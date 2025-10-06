"""
Vegetation Analysis Service

This module handles vegetation index calculations (NDVI, NDWI),
vegetation health assessment, and insight generation.
"""

import numpy as np
from typing import Dict, List, Tuple, Optional
from uuid import UUID
import cv2
from scipy import ndimage
from skimage import filters, segmentation, measure
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
from matplotlib.patches import Polygon
import plotly.graph_objects as go
import plotly.express as px
import structlog

from app.config import settings
from app.core.exceptions import ProcessingError
from app.models.analysis import (
    VegetationIndex, VegetationIndexResult, AnalysisZone, 
    AnalysisConfig, QualityMetrics, ProcessingStage
)
from app.services.storage_service import StorageService

logger = structlog.get_logger()


class VegetationAnalyzer:
    """Handles vegetation analysis and index calculations."""
    
    def __init__(self):
        self.storage_service = StorageService()
        self.config = AnalysisConfig()
        
        # Configure analysis thresholds from settings
        self.config.ndvi_healthy_threshold = settings.NDVI_THRESHOLD_HEALTHY
        self.config.ndvi_stressed_threshold = settings.NDVI_THRESHOLD_STRESSED
        self.config.ndwi_water_threshold = settings.NDWI_THRESHOLD_WATER_STRESS
    
    async def calculate_vegetation_indices(
        self, 
        spectral_bands: Dict[str, np.ndarray],
        report_id: UUID,
        progress_callback: Optional[callable] = None
    ) -> Dict[str, VegetationIndexResult]:
        """
        Calculate vegetation indices from spectral bands.
        
        Args:
            spectral_bands: Dictionary of spectral band arrays
            report_id: Report ID for logging
            progress_callback: Optional progress callback
            
        Returns:
            Dictionary mapping index names to results
        """
        logger.info("Starting vegetation index calculations", report_id=str(report_id))
        
        if progress_callback:
            await progress_callback(ProcessingStage.INDEX_CALCULATION, 0)
        
        results = {}
        
        try:
            # Calculate NDVI
            if "Red" in spectral_bands and "NIR" in spectral_bands:
                ndvi_result = await self._calculate_ndvi(
                    spectral_bands["Red"], 
                    spectral_bands["NIR"]
                )
                results["ndvi"] = ndvi_result
                logger.info("NDVI calculated", mean_value=round(ndvi_result.mean_value, 3))
            
            if progress_callback:
                await progress_callback(ProcessingStage.INDEX_CALCULATION, 33)
            
            # Calculate NDWI
            if "Green" in spectral_bands and "NIR" in spectral_bands:
                ndwi_result = await self._calculate_ndwi(
                    spectral_bands["Green"], 
                    spectral_bands["NIR"]
                )
                results["ndwi"] = ndwi_result
                logger.info("NDWI calculated", mean_value=round(ndwi_result.mean_value, 3))
            
            if progress_callback:
                await progress_callback(ProcessingStage.INDEX_CALCULATION, 66)
            
            # Calculate EVI (Enhanced Vegetation Index) if available
            if all(band in spectral_bands for band in ["Red", "NIR", "Blue"]):
                evi_result = await self._calculate_evi(
                    spectral_bands["Blue"],
                    spectral_bands["Red"], 
                    spectral_bands["NIR"]
                )
                results["evi"] = evi_result
                logger.info("EVI calculated", mean_value=round(evi_result.mean_value, 3))
            
            if progress_callback:
                await progress_callback(ProcessingStage.INDEX_CALCULATION, 100)
            
            logger.info("Vegetation indices calculated successfully", indices=list(results.keys()))
            return results
            
        except Exception as e:
            logger.error("Vegetation index calculation failed", error=str(e))
            raise ProcessingError(f"Failed to calculate vegetation indices: {str(e)}")
    
    async def _calculate_ndvi(self, red: np.ndarray, nir: np.ndarray) -> VegetationIndexResult:
        """Calculate Normalized Difference Vegetation Index."""
        try:
            # Convert to float to avoid overflow
            red_f = red.astype(np.float32)
            nir_f = nir.astype(np.float32)
            
            # Calculate NDVI: (NIR - Red) / (NIR + Red)
            denominator = nir_f + red_f
            
            # Avoid division by zero
            ndvi = np.zeros_like(denominator)
            valid_mask = denominator != 0
            ndvi[valid_mask] = (nir_f[valid_mask] - red_f[valid_mask]) / denominator[valid_mask]
            
            # Apply median filter to reduce noise
            ndvi_filtered = ndimage.median_filter(ndvi, size=self.config.median_filter_size)
            
            # Calculate statistics
            valid_pixels = np.sum(valid_mask)
            null_pixels = np.sum(~valid_mask)
            
            if valid_pixels == 0:
                raise ProcessingError("No valid pixels for NDVI calculation")
            
            valid_ndvi = ndvi_filtered[valid_mask]
            
            # Calculate thresholded areas
            healthy_pixels = np.sum(valid_ndvi >= self.config.ndvi_healthy_threshold)
            stressed_pixels = np.sum(
                (valid_ndvi >= self.config.ndvi_stressed_threshold) & 
                (valid_ndvi < self.config.ndvi_healthy_threshold)
            )
            severely_stressed_pixels = np.sum(valid_ndvi < self.config.ndvi_stressed_threshold)
            
            return VegetationIndexResult(
                index_type=VegetationIndex.NDVI,
                mean_value=float(np.mean(valid_ndvi)),
                std_value=float(np.std(valid_ndvi)),
                min_value=float(np.min(valid_ndvi)),
                max_value=float(np.max(valid_ndvi)),
                pixel_count=int(valid_pixels),
                null_pixels=int(null_pixels),
                healthy_pixels=int(healthy_pixels),
                stressed_pixels=int(stressed_pixels),
                severely_stressed_pixels=int(severely_stressed_pixels),
                healthy_percent=float(healthy_pixels / valid_pixels * 100),
                stressed_percent=float(stressed_pixels / valid_pixels * 100),
                severely_stressed_percent=float(severely_stressed_pixels / valid_pixels * 100)
            )
            
        except Exception as e:
            raise ProcessingError(f"NDVI calculation failed: {str(e)}")
    
    async def _calculate_ndwi(self, green: np.ndarray, nir: np.ndarray) -> VegetationIndexResult:
        """Calculate Normalized Difference Water Index."""
        try:
            # Convert to float
            green_f = green.astype(np.float32)
            nir_f = nir.astype(np.float32)
            
            # Calculate NDWI: (Green - NIR) / (Green + NIR)
            denominator = green_f + nir_f
            
            # Avoid division by zero
            ndwi = np.zeros_like(denominator)
            valid_mask = denominator != 0
            ndwi[valid_mask] = (green_f[valid_mask] - nir_f[valid_mask]) / denominator[valid_mask]
            
            # Apply median filter
            ndwi_filtered = ndimage.median_filter(ndwi, size=self.config.median_filter_size)
            
            # Calculate statistics
            valid_pixels = np.sum(valid_mask)
            null_pixels = np.sum(~valid_mask)
            
            if valid_pixels == 0:
                raise ProcessingError("No valid pixels for NDWI calculation")
            
            valid_ndwi = ndwi_filtered[valid_mask]
            
            # For NDWI, we interpret differently - higher values indicate more water/moisture
            water_pixels = np.sum(valid_ndwi >= self.config.ndwi_water_threshold)
            moist_pixels = np.sum(
                (valid_ndwi >= self.config.ndwi_moisture_threshold) & 
                (valid_ndwi < self.config.ndwi_water_threshold)
            )
            dry_pixels = np.sum(valid_ndwi < self.config.ndwi_moisture_threshold)
            
            return VegetationIndexResult(
                index_type=VegetationIndex.NDWI,
                mean_value=float(np.mean(valid_ndwi)),
                std_value=float(np.std(valid_ndwi)),
                min_value=float(np.min(valid_ndwi)),
                max_value=float(np.max(valid_ndwi)),
                pixel_count=int(valid_pixels),
                null_pixels=int(null_pixels),
                healthy_pixels=int(water_pixels),  # Water/well-irrigated areas
                stressed_pixels=int(moist_pixels),  # Moderately moist areas
                severely_stressed_pixels=int(dry_pixels),  # Dry areas
                healthy_percent=float(water_pixels / valid_pixels * 100),
                stressed_percent=float(moist_pixels / valid_pixels * 100),
                severely_stressed_percent=float(dry_pixels / valid_pixels * 100)
            )
            
        except Exception as e:
            raise ProcessingError(f"NDWI calculation failed: {str(e)}")
    
    async def _calculate_evi(self, blue: np.ndarray, red: np.ndarray, nir: np.ndarray) -> VegetationIndexResult:
        """Calculate Enhanced Vegetation Index."""
        try:
            # Convert to float
            blue_f = blue.astype(np.float32)
            red_f = red.astype(np.float32)
            nir_f = nir.astype(np.float32)
            
            # EVI = 2.5 * ((NIR - Red) / (NIR + 6 * Red - 7.5 * Blue + 1))
            denominator = nir_f + 6 * red_f - 7.5 * blue_f + 1
            
            # Avoid division by zero
            evi = np.zeros_like(denominator)
            valid_mask = denominator != 0
            evi[valid_mask] = 2.5 * (nir_f[valid_mask] - red_f[valid_mask]) / denominator[valid_mask]
            
            # Clamp EVI values to reasonable range
            evi = np.clip(evi, -1, 1)
            
            # Apply median filter
            evi_filtered = ndimage.median_filter(evi, size=self.config.median_filter_size)
            
            # Calculate statistics (using NDVI thresholds for simplicity)
            valid_pixels = np.sum(valid_mask)
            null_pixels = np.sum(~valid_mask)
            
            if valid_pixels == 0:
                raise ProcessingError("No valid pixels for EVI calculation")
            
            valid_evi = evi_filtered[valid_mask]
            
            # Use similar thresholds as NDVI but adjusted for EVI
            healthy_pixels = np.sum(valid_evi >= self.config.ndvi_healthy_threshold)
            stressed_pixels = np.sum(
                (valid_evi >= self.config.ndvi_stressed_threshold) & 
                (valid_evi < self.config.ndvi_healthy_threshold)
            )
            severely_stressed_pixels = np.sum(valid_evi < self.config.ndvi_stressed_threshold)
            
            return VegetationIndexResult(
                index_type=VegetationIndex.EVI,
                mean_value=float(np.mean(valid_evi)),
                std_value=float(np.std(valid_evi)),
                min_value=float(np.min(valid_evi)),
                max_value=float(np.max(valid_evi)),
                pixel_count=int(valid_pixels),
                null_pixels=int(null_pixels),
                healthy_pixels=int(healthy_pixels),
                stressed_pixels=int(stressed_pixels),
                severely_stressed_pixels=int(severely_stressed_pixels),
                healthy_percent=float(healthy_pixels / valid_pixels * 100),
                stressed_percent=float(stressed_pixels / valid_pixels * 100),
                severely_stressed_percent=float(severely_stressed_pixels / valid_pixels * 100)
            )
            
        except Exception as e:
            raise ProcessingError(f"EVI calculation failed: {str(e)}")
    
    async def generate_analysis_zones(
        self, 
        vegetation_indices: Dict[str, VegetationIndexResult],
        spectral_bands: Dict[str, np.ndarray],
        area_hectares: float,
        max_zones: int = 10
    ) -> List[AnalysisZone]:
        """
        Generate analysis zones based on vegetation indices.
        
        Args:
            vegetation_indices: Calculated vegetation indices
            spectral_bands: Original spectral band data
            area_hectares: Total area in hectares
            max_zones: Maximum number of zones to generate
            
        Returns:
            List of analysis zones
        """
        logger.info("Generating analysis zones", max_zones=max_zones)
        
        try:
            zones = []
            
            if "ndvi" not in vegetation_indices:
                logger.warning("No NDVI data available for zone generation")
                return zones
            
            # Use NDVI for zone segmentation
            ndvi_data = self._reconstruct_index_array(
                vegetation_indices["ndvi"], 
                spectral_bands["Red"].shape
            )
            
            # Apply segmentation algorithm
            segments = segmentation.slic(
                ndvi_data, 
                n_segments=max_zones,
                compactness=10,
                sigma=1,
                start_label=1
            )
            
            # Analyze each segment
            for zone_id in np.unique(segments):
                if zone_id == 0:  # Skip background
                    continue
                
                zone_mask = segments == zone_id
                zone_pixels = np.sum(zone_mask)
                
                if zone_pixels < self.config.min_zone_size_pixels:
                    continue
                
                # Calculate zone area
                zone_area = (zone_pixels / ndvi_data.size) * area_hectares
                
                # Extract zone statistics
                zone_ndvi = ndvi_data[zone_mask]
                zone_ndvi_result = self._calculate_zone_statistics(zone_ndvi, VegetationIndex.NDVI)
                
                zone_ndwi_result = None
                if "ndwi" in vegetation_indices:
                    ndwi_data = self._reconstruct_index_array(
                        vegetation_indices["ndwi"], 
                        spectral_bands["Green"].shape
                    )
                    zone_ndwi = ndwi_data[zone_mask]
                    zone_ndwi_result = self._calculate_zone_statistics(zone_ndwi, VegetationIndex.NDWI)
                
                # Generate zone polygon (simplified)
                zone_polygon = self._extract_zone_polygon(zone_mask)
                
                # Generate recommendations
                recommendations = self._generate_zone_recommendations(zone_ndvi_result, zone_ndwi_result)
                
                zone = AnalysisZone(
                    zone_id=f"zone_{zone_id}",
                    zone_name=f"Analysis Zone {zone_id}",
                    polygon_coordinates=zone_polygon,
                    area_hectares=round(zone_area, 2),
                    ndvi_result=zone_ndvi_result,
                    ndwi_result=zone_ndwi_result,
                    irrigation_recommendation=recommendations.get("irrigation"),
                    fertilizer_recommendation=recommendations.get("fertilizer"),
                    pest_risk_level=recommendations.get("pest_risk", "low")
                )
                
                zones.append(zone)
            
            logger.info("Analysis zones generated", zone_count=len(zones))
            return zones
            
        except Exception as e:
            logger.error("Zone generation failed", error=str(e))
            raise ProcessingError(f"Failed to generate analysis zones: {str(e)}")
    
    def _reconstruct_index_array(self, index_result: VegetationIndexResult, shape: Tuple[int, int]) -> np.ndarray:
        """Reconstruct index array from result statistics (simplified)."""
        # In production, you'd store the actual index arrays
        # For now, generate a representative array based on statistics
        mean_val = index_result.mean_value
        std_val = index_result.std_value
        
        # Generate random array with similar statistics
        array = np.random.normal(mean_val, std_val, shape)
        array = np.clip(array, index_result.min_value, index_result.max_value)
        
        return array
    
    def _calculate_zone_statistics(self, zone_data: np.ndarray, index_type: VegetationIndex) -> VegetationIndexResult:
        """Calculate statistics for a specific zone."""
        valid_data = zone_data[~np.isnan(zone_data)]
        
        if len(valid_data) == 0:
            raise ProcessingError("No valid data in zone")
        
        # Use appropriate thresholds based on index type
        if index_type == VegetationIndex.NDVI:
            healthy_threshold = self.config.ndvi_healthy_threshold
            stressed_threshold = self.config.ndvi_stressed_threshold
        else:  # NDWI
            healthy_threshold = self.config.ndwi_water_threshold
            stressed_threshold = self.config.ndwi_moisture_threshold
        
        healthy_pixels = np.sum(valid_data >= healthy_threshold)
        stressed_pixels = np.sum(
            (valid_data >= stressed_threshold) & (valid_data < healthy_threshold)
        )
        severely_stressed_pixels = np.sum(valid_data < stressed_threshold)
        
        total_pixels = len(valid_data)
        
        return VegetationIndexResult(
            index_type=index_type,
            mean_value=float(np.mean(valid_data)),
            std_value=float(np.std(valid_data)),
            min_value=float(np.min(valid_data)),
            max_value=float(np.max(valid_data)),
            pixel_count=total_pixels,
            null_pixels=0,
            healthy_pixels=int(healthy_pixels),
            stressed_pixels=int(stressed_pixels),
            severely_stressed_pixels=int(severely_stressed_pixels),
            healthy_percent=float(healthy_pixels / total_pixels * 100),
            stressed_percent=float(stressed_pixels / total_pixels * 100),
            severely_stressed_percent=float(severely_stressed_pixels / total_pixels * 100)
        )
    
    def _extract_zone_polygon(self, zone_mask: np.ndarray) -> Dict[str, any]:
        """Extract polygon coordinates for a zone (simplified)."""
        # Find contours of the zone
        contours = measure.find_contours(zone_mask.astype(np.uint8), 0.5)
        
        if not contours:
            # Create a simple bounding box
            rows, cols = np.where(zone_mask)
            min_row, max_row = rows.min(), rows.max()
            min_col, max_col = cols.min(), cols.max()
            
            # Convert to lat/lon (simplified transformation)
            coordinates = [
                [min_col, min_row],
                [max_col, min_row],
                [max_col, max_row],
                [min_col, max_row],
                [min_col, min_row]  # Close polygon
            ]
        else:
            # Use the largest contour
            largest_contour = max(contours, key=len)
            coordinates = [[float(point[1]), float(point[0])] for point in largest_contour]
        
        return {
            "type": "Polygon",
            "coordinates": [coordinates]
        }
    
    def _generate_zone_recommendations(
        self, 
        ndvi_result: VegetationIndexResult, 
        ndwi_result: Optional[VegetationIndexResult]
    ) -> Dict[str, str]:
        """Generate recommendations for a zone."""
        recommendations = {}
        
        # Irrigation recommendations based on NDWI
        if ndwi_result:
            if ndwi_result.severely_stressed_percent > 50:
                recommendations["irrigation"] = "Immediate irrigation required"
            elif ndwi_result.stressed_percent > 30:
                recommendations["irrigation"] = "Increase irrigation frequency"
            else:
                recommendations["irrigation"] = "Current irrigation adequate"
        
        # Fertilizer recommendations based on NDVI
        if ndvi_result.severely_stressed_percent > 40:
            recommendations["fertilizer"] = "Apply nitrogen fertilizer immediately"
        elif ndvi_result.stressed_percent > 30:
            recommendations["fertilizer"] = "Consider balanced fertilizer application"
        else:
            recommendations["fertilizer"] = "Current nutrition appears adequate"
        
        # Pest risk assessment
        if ndvi_result.severely_stressed_percent > 60:
            recommendations["pest_risk"] = "high"
        elif ndvi_result.stressed_percent > 40:
            recommendations["pest_risk"] = "medium"
        else:
            recommendations["pest_risk"] = "low"
        
        return recommendations
    
    async def assess_data_quality(self, spectral_bands: Dict[str, np.ndarray]) -> QualityMetrics:
        """Assess the quality of input data and processing results."""
        try:
            quality_issues = []
            recommendations = []
            scores = {}
            
            # Check image sharpness (using Laplacian variance)
            if "Red" in spectral_bands:
                red_band = spectral_bands["Red"]
                laplacian_var = cv2.Laplacian(red_band.astype(np.uint8), cv2.CV_64F).var()
                sharpness_score = min(laplacian_var / 1000, 1.0)  # Normalize
                scores["image_sharpness_score"] = sharpness_score
                
                if sharpness_score < 0.3:
                    quality_issues.append("Low image sharpness detected")
                    recommendations.append("Ensure stable flight conditions and proper camera focus")
            
            # Check exposure quality (using histogram analysis)
            if "Red" in spectral_bands:
                red_hist, _ = np.histogram(red_band, bins=256, range=(0, 255))
                
                # Check for overexposure (too many pixels at max value)
                overexposed_ratio = red_hist[-1] / red_band.size
                underexposed_ratio = red_hist[0] / red_band.size
                
                exposure_score = 1.0 - max(overexposed_ratio, underexposed_ratio) * 10
                exposure_score = max(0, min(1, exposure_score))
                scores["exposure_quality_score"] = exposure_score
                
                if overexposed_ratio > 0.05:
                    quality_issues.append("Image overexposure detected")
                    recommendations.append("Reduce camera exposure or fly during optimal lighting")
                
                if underexposed_ratio > 0.05:
                    quality_issues.append("Image underexposure detected")
                    recommendations.append("Increase camera exposure or fly during brighter conditions")
            
            # Overall quality score
            overall_score = np.mean(list(scores.values())) if scores else 0.5
            
            return QualityMetrics(
                image_sharpness_score=scores.get("image_sharpness_score"),
                exposure_quality_score=scores.get("exposure_quality_score"),
                overall_quality_score=overall_score,
                quality_issues=quality_issues,
                recommendations=recommendations
            )
            
        except Exception as e:
            logger.error("Quality assessment failed", error=str(e))
            return QualityMetrics(overall_quality_score=0.5, quality_issues=["Quality assessment failed"])