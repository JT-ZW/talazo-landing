"""
Analysis data models and schemas.

This module defines the schemas for vegetation analysis, image processing,
and algorithm results.
"""

from datetime import datetime
from typing import List, Optional, Dict, Any, Tuple
from uuid import UUID
from enum import Enum

from pydantic import BaseModel, Field, validator
import numpy as np


class VegetationIndex(str, Enum):
    """Supported vegetation indices."""
    NDVI = "ndvi"
    NDWI = "ndwi"
    EVI = "evi"
    SAVI = "savi"
    MSAVI = "msavi"


class ProcessingStage(str, Enum):
    """Image processing stages."""
    UPLOAD = "upload"
    VALIDATION = "validation"
    ORTHOMOSAIC = "orthomosaic"
    BAND_EXTRACTION = "band_extraction"
    INDEX_CALCULATION = "index_calculation"
    VISUALIZATION = "visualization"
    REPORT_GENERATION = "report_generation"
    STORAGE = "storage"
    NOTIFICATION = "notification"


class AnalysisType(str, Enum):
    """Types of analysis that can be performed."""
    VEGETATION_HEALTH = "vegetation_health"
    WATER_STRESS = "water_stress"
    DISEASE_DETECTION = "disease_detection"
    YIELD_PREDICTION = "yield_prediction"
    SOIL_ANALYSIS = "soil_analysis"


# Base schemas
class ImageMetadata(BaseModel):
    """Metadata extracted from drone images."""
    filename: str
    file_size_bytes: int
    image_width: int
    image_height: int
    bands: List[str]  # e.g., ["Red", "Green", "Blue", "NIR", "RedEdge"]
    pixel_size_x: Optional[float] = None
    pixel_size_y: Optional[float] = None
    coordinate_system: Optional[str] = None
    capture_datetime: Optional[datetime] = None
    camera_model: Optional[str] = None
    camera_settings: Optional[Dict[str, Any]] = None
    gps_coordinates: Optional[Tuple[float, float]] = None  # (lat, lon)
    altitude_meters: Optional[float] = None
    flight_speed: Optional[float] = None
    overlap_percentage: Optional[float] = None


class BandData(BaseModel):
    """Spectral band data and statistics."""
    band_name: str
    wavelength_nm: Optional[float] = None
    min_value: float
    max_value: float
    mean_value: float
    std_value: float
    null_pixels: int
    valid_pixels: int
    histogram_data: Optional[List[int]] = None


class VegetationIndexResult(BaseModel):
    """Results from vegetation index calculation."""
    index_type: VegetationIndex
    mean_value: float = Field(..., ge=-1, le=1)
    std_value: float = Field(..., ge=0)
    min_value: float = Field(..., ge=-1, le=1)
    max_value: float = Field(..., ge=-1, le=1)
    pixel_count: int = Field(..., gt=0)
    null_pixels: int = Field(..., ge=0)
    
    # Thresholded areas
    healthy_pixels: int = Field(..., ge=0)
    stressed_pixels: int = Field(..., ge=0)
    severely_stressed_pixels: int = Field(..., ge=0)
    
    # Percentages
    healthy_percent: float = Field(..., ge=0, le=100)
    stressed_percent: float = Field(..., ge=0, le=100)
    severely_stressed_percent: float = Field(..., ge=0, le=100)
    
    @validator("healthy_percent", "stressed_percent", "severely_stressed_percent")
    def validate_percentages(cls, v, values):
        """Ensure percentages don't exceed 100% total."""
        return v


class AnalysisZone(BaseModel):
    """Analysis results for a specific zone/area."""
    zone_id: str
    zone_name: Optional[str] = None
    polygon_coordinates: Dict[str, Any]  # GeoJSON polygon
    area_hectares: float = Field(..., gt=0)
    
    # Vegetation indices for this zone
    ndvi_result: Optional[VegetationIndexResult] = None
    ndwi_result: Optional[VegetationIndexResult] = None
    
    # Zone-specific insights
    dominant_vegetation_type: Optional[str] = None
    irrigation_recommendation: Optional[str] = None
    fertilizer_recommendation: Optional[str] = None
    pest_risk_level: Optional[str] = None
    yield_potential: Optional[str] = None


class OrthomosaicResult(BaseModel):
    """Results from orthomosaic generation."""
    orthomosaic_url: str
    thumbnail_url: Optional[str] = None
    image_width: int = Field(..., gt=0)
    image_height: int = Field(..., gt=0)
    pixel_resolution_cm: float = Field(..., gt=0)
    total_area_hectares: float = Field(..., gt=0)
    coordinate_system: str
    bounds_coordinates: List[Tuple[float, float]]  # [(lat, lon), ...]
    processing_time_seconds: int = Field(..., ge=0)
    input_image_count: int = Field(..., gt=0)
    overlap_quality_score: Optional[float] = Field(None, ge=0, le=1)


class ProcessingProgress(BaseModel):
    """Processing progress tracking."""
    job_id: UUID
    current_stage: ProcessingStage
    progress_percent: int = Field(..., ge=0, le=100)
    estimated_completion_minutes: Optional[int] = Field(None, gt=0)
    stages_completed: List[ProcessingStage] = []
    current_operation: Optional[str] = None
    error_message: Optional[str] = None
    warnings: List[str] = []


class AnalysisRequest(BaseModel):
    """Request for starting analysis."""
    report_id: UUID
    analysis_types: List[AnalysisType] = [AnalysisType.VEGETATION_HEALTH]
    vegetation_indices: List[VegetationIndex] = [VegetationIndex.NDVI, VegetationIndex.NDWI]
    generate_zones: bool = True
    zone_size_hectares: Optional[float] = Field(None, gt=0, le=10)
    include_recommendations: bool = True
    email_farmer: bool = True
    priority: int = Field(1, ge=1, le=10)


class AnalysisResult(BaseModel):
    """Complete analysis results."""
    report_id: UUID
    analysis_id: UUID
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    # Processing metadata
    processing_duration_seconds: Optional[int] = None
    total_area_analyzed_hectares: float = Field(..., gt=0)
    image_count_processed: int = Field(..., gt=0)
    
    # Orthomosaic results
    orthomosaic: Optional[OrthomosaicResult] = None
    
    # Overall vegetation indices
    overall_ndvi: Optional[VegetationIndexResult] = None
    overall_ndwi: Optional[VegetationIndexResult] = None
    
    # Zone-based analysis
    analysis_zones: List[AnalysisZone] = []
    
    # Generated files
    ndvi_heatmap_url: Optional[str] = None
    ndwi_heatmap_url: Optional[str] = None
    zones_map_url: Optional[str] = None
    pdf_report_url: Optional[str] = None
    
    # Key insights
    vegetation_health_score: Optional[float] = Field(None, ge=0, le=100)
    water_stress_level: Optional[str] = None  # "low", "medium", "high"
    recommended_actions: List[str] = []
    priority_areas: List[Dict[str, Any]] = []
    
    # Quality metrics
    analysis_confidence: Optional[float] = Field(None, ge=0, le=1)
    data_quality_score: Optional[float] = Field(None, ge=0, le=1)
    weather_conditions: Optional[Dict[str, Any]] = None


class VisualizationRequest(BaseModel):
    """Request for generating visualizations."""
    report_id: UUID
    visualization_types: List[str] = ["ndvi_heatmap", "ndwi_heatmap", "zones_map"]
    color_scheme: str = "viridis"
    include_legend: bool = True
    include_scale_bar: bool = True
    output_format: str = "png"
    resolution_dpi: int = Field(300, ge=72, le=600)
    width_pixels: Optional[int] = Field(None, gt=0, le=4096)
    height_pixels: Optional[int] = Field(None, gt=0, le=4096)


class QualityMetrics(BaseModel):
    """Image and processing quality metrics."""
    image_sharpness_score: Optional[float] = Field(None, ge=0, le=1)
    exposure_quality_score: Optional[float] = Field(None, ge=0, le=1)
    color_balance_score: Optional[float] = Field(None, ge=0, le=1)
    overlap_sufficiency: Optional[float] = Field(None, ge=0, le=1)
    ground_control_accuracy: Optional[float] = Field(None, ge=0)  # cm
    orthomosaic_seamlines_quality: Optional[float] = Field(None, ge=0, le=1)
    overall_quality_score: Optional[float] = Field(None, ge=0, le=1)
    quality_issues: List[str] = []
    recommendations: List[str] = []


class AnalysisConfig(BaseModel):
    """Configuration for analysis algorithms."""
    # NDVI thresholds
    ndvi_healthy_threshold: float = Field(0.5, ge=0, le=1)
    ndvi_stressed_threshold: float = Field(0.3, ge=0, le=1)
    ndvi_severely_stressed_threshold: float = Field(0.1, ge=0, le=1)
    
    # NDWI thresholds
    ndwi_water_threshold: float = Field(0.3, ge=-1, le=1)
    ndwi_moisture_threshold: float = Field(0.0, ge=-1, le=1)
    ndwi_dry_threshold: float = Field(-0.2, ge=-1, le=1)
    
    # Processing parameters
    median_filter_size: int = Field(3, ge=1, le=9)
    gaussian_sigma: float = Field(1.0, gt=0, le=5)
    outlier_removal_threshold: float = Field(2.0, gt=0, le=5)
    
    # Zone generation
    min_zone_size_pixels: int = Field(1000, gt=0)
    zone_homogeneity_threshold: float = Field(0.1, gt=0, le=1)
    
    @validator("ndvi_healthy_threshold", "ndvi_stressed_threshold", "ndvi_severely_stressed_threshold")
    def validate_ndvi_thresholds(cls, v, values, field):
        """Ensure NDVI thresholds are in correct order."""
        if field.name == "ndvi_stressed_threshold" and "ndvi_healthy_threshold" in values:
            if v >= values["ndvi_healthy_threshold"]:
                raise ValueError("Stressed threshold must be less than healthy threshold")
        elif field.name == "ndvi_severely_stressed_threshold" and "ndvi_stressed_threshold" in values:
            if v >= values["ndvi_stressed_threshold"]:
                raise ValueError("Severely stressed threshold must be less than stressed threshold")
        return v