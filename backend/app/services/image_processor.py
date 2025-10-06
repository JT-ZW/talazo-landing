"""
Image Processing Service

This module handles drone image processing, orthomosaic generation,
and preparation for vegetation analysis.
"""

import os
import asyncio
import tempfile
import shutil
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
from uuid import UUID
import numpy as np
import cv2
from PIL import Image, ExifTags
import rasterio
from rasterio.merge import merge
from rasterio.warp import calculate_default_transform, reproject, Resampling
from rasterio.transform import from_bounds
import structlog

from app.config import settings
from app.core.exceptions import ProcessingError, ValidationError
from app.models.analysis import ImageMetadata, OrthomosaicResult, ProcessingProgress, ProcessingStage
from app.services.storage_service import StorageService

logger = structlog.get_logger()


class ImageProcessor:
    """Handles all image processing operations."""
    
    def __init__(self):
        self.storage_service = StorageService()
        self.temp_dir = Path(tempfile.gettempdir()) / "talazo_processing"
        self.temp_dir.mkdir(exist_ok=True)
        
        # Supported image formats
        self.supported_formats = settings.SUPPORTED_FORMATS
        self.max_image_size = settings.max_image_size_bytes
    
    async def validate_images(self, image_files: List[Dict[str, Any]]) -> List[ImageMetadata]:
        """
        Validate uploaded images and extract metadata.
        
        Args:
            image_files: List of image file information
            
        Returns:
            List of ImageMetadata objects
            
        Raises:
            ValidationError: If images don't meet requirements
        """
        logger.info("Starting image validation", count=len(image_files))
        
        if len(image_files) > settings.MAX_IMAGES_PER_BATCH:
            raise ValidationError(
                f"Too many images. Maximum {settings.MAX_IMAGES_PER_BATCH} allowed."
            )
        
        validated_images = []
        
        for i, image_file in enumerate(image_files):
            try:
                metadata = await self._extract_image_metadata(image_file)
                validated_images.append(metadata)
                
                logger.info(
                    "Image validated successfully",
                    filename=metadata.filename,
                    size_mb=round(metadata.file_size_bytes / 1024 / 1024, 2),
                    dimensions=f"{metadata.image_width}x{metadata.image_height}",
                    bands=len(metadata.bands)
                )
                
            except Exception as e:
                logger.error(
                    "Image validation failed",
                    filename=image_file.get("filename", f"image_{i}"),
                    error=str(e)
                )
                raise ValidationError(f"Invalid image {image_file.get('filename', i)}: {str(e)}")
        
        # Validate that images are compatible for stitching
        await self._validate_image_compatibility(validated_images)
        
        logger.info("All images validated successfully", total_count=len(validated_images))
        return validated_images
    
    async def _extract_image_metadata(self, image_file: Dict[str, Any]) -> ImageMetadata:
        """Extract metadata from a single image."""
        filename = image_file["filename"]
        file_size = image_file.get("file_size_bytes", 0)
        
        # Validate file size
        if file_size > self.max_image_size:
            raise ValidationError(f"Image {filename} too large. Maximum {self.max_image_size / 1024 / 1024}MB allowed.")
        
        # Validate file format
        file_ext = Path(filename).suffix.lower().lstrip('.')
        if file_ext not in self.supported_formats:
            raise ValidationError(f"Unsupported format: {file_ext}. Supported: {', '.join(self.supported_formats)}")
        
        # For now, create basic metadata
        # In production, you'd download and analyze the actual image
        metadata = ImageMetadata(
            filename=filename,
            file_size_bytes=file_size,
            image_width=4000,  # Default values - would be extracted from actual image
            image_height=3000,
            bands=["Red", "Green", "Blue", "NIR"] if file_ext in ["tiff", "tif"] else ["Red", "Green", "Blue"],
            coordinate_system="EPSG:4326",
            capture_datetime=None,  # Would extract from EXIF
            gps_coordinates=None,   # Would extract from EXIF
        )
        
        return metadata
    
    async def _validate_image_compatibility(self, images: List[ImageMetadata]) -> None:
        """Validate that images are compatible for stitching."""
        if not images:
            raise ValidationError("No images provided")
        
        # Check that all images have similar band configurations
        reference_bands = set(images[0].bands)
        for img in images[1:]:
            if set(img.bands) != reference_bands:
                raise ValidationError("All images must have the same spectral bands")
        
        # Check for minimum NIR band for vegetation analysis
        if "NIR" not in reference_bands:
            logger.warning("No NIR band detected. NDVI calculation may not be accurate.")
    
    async def generate_orthomosaic(
        self, 
        report_id: UUID, 
        image_urls: List[str],
        progress_callback: Optional[callable] = None
    ) -> OrthomosaicResult:
        """
        Generate orthomosaic from drone images.
        
        Args:
            report_id: Report ID for file naming
            image_urls: List of image URLs to process
            progress_callback: Optional callback for progress updates
            
        Returns:
            OrthomosaicResult with orthomosaic information
        """
        logger.info("Starting orthomosaic generation", report_id=str(report_id), image_count=len(image_urls))
        
        if progress_callback:
            await progress_callback(ProcessingStage.ORTHOMOSAIC, 0)
        
        try:
            # Create temporary processing directory
            work_dir = self.temp_dir / str(report_id)
            work_dir.mkdir(exist_ok=True)
            
            # Download images
            if progress_callback:
                await progress_callback(ProcessingStage.ORTHOMOSAIC, 10)
            
            local_images = await self._download_images(image_urls, work_dir)
            
            if progress_callback:
                await progress_callback(ProcessingStage.ORTHOMOSAIC, 30)
            
            # Generate orthomosaic using OpenDroneMap or simple stitching
            orthomosaic_path = await self._create_orthomosaic(local_images, work_dir)
            
            if progress_callback:
                await progress_callback(ProcessingStage.ORTHOMOSAIC, 70)
            
            # Upload orthomosaic to storage
            orthomosaic_url = await self.storage_service.upload_file(
                orthomosaic_path,
                f"reports/{report_id}/orthomosaic.tiff",
                "image/tiff"
            )
            
            # Generate thumbnail
            thumbnail_path = await self._create_thumbnail(orthomosaic_path, work_dir)
            thumbnail_url = await self.storage_service.upload_file(
                thumbnail_path,
                f"reports/{report_id}/orthomosaic_thumb.jpg",
                "image/jpeg"
            )
            
            if progress_callback:
                await progress_callback(ProcessingStage.ORTHOMOSAIC, 90)
            
            # Extract orthomosaic metadata
            with rasterio.open(orthomosaic_path) as src:
                bounds = src.bounds
                width = src.width
                height = src.height
                pixel_size = src.res[0]  # Assuming square pixels
                crs = src.crs.to_string()
                
                # Calculate area in hectares
                area_m2 = (bounds.right - bounds.left) * (bounds.top - bounds.bottom)
                area_hectares = area_m2 / 10000
            
            result = OrthomosaicResult(
                orthomosaic_url=orthomosaic_url,
                thumbnail_url=thumbnail_url,
                image_width=width,
                image_height=height,
                pixel_resolution_cm=pixel_size * 100,  # Convert to cm
                total_area_hectares=area_hectares,
                coordinate_system=crs,
                bounds_coordinates=[(bounds.bottom, bounds.left), (bounds.top, bounds.right)],
                processing_time_seconds=0,  # Would be calculated
                input_image_count=len(image_urls),
                overlap_quality_score=0.8  # Would be calculated
            )
            
            if progress_callback:
                await progress_callback(ProcessingStage.ORTHOMOSAIC, 100)
            
            logger.info(
                "Orthomosaic generated successfully",
                report_id=str(report_id),
                area_hectares=round(area_hectares, 2),
                resolution_cm=round(pixel_size * 100, 1)
            )
            
            return result
            
        except Exception as e:
            logger.error("Orthomosaic generation failed", error=str(e), report_id=str(report_id))
            raise ProcessingError(f"Failed to generate orthomosaic: {str(e)}")
        
        finally:
            # Cleanup temporary files
            if work_dir.exists():
                shutil.rmtree(work_dir, ignore_errors=True)
    
    async def _download_images(self, image_urls: List[str], work_dir: Path) -> List[Path]:
        """Download images to local storage for processing."""
        local_images = []
        
        for i, url in enumerate(image_urls):
            # In production, download from the actual URL
            # For now, create dummy files
            local_path = work_dir / f"image_{i}.tiff"
            
            # Create a dummy TIFF file for demonstration
            # In production, this would download the actual image
            dummy_image = np.random.randint(0, 255, (1000, 1000, 4), dtype=np.uint8)
            
            # Save as TIFF with rasterio
            with rasterio.open(
                local_path,
                'w',
                driver='GTiff',
                height=dummy_image.shape[0],
                width=dummy_image.shape[1],
                count=4,
                dtype=dummy_image.dtype,
                crs='EPSG:4326',
                transform=from_bounds(-1, -1, 1, 1, dummy_image.shape[1], dummy_image.shape[0])
            ) as dst:
                for band in range(4):
                    dst.write(dummy_image[:, :, band], band + 1)
            
            local_images.append(local_path)
        
        return local_images
    
    async def _create_orthomosaic(self, image_paths: List[Path], work_dir: Path) -> Path:
        """Create orthomosaic from individual images."""
        orthomosaic_path = work_dir / "orthomosaic.tiff"
        
        # For demonstration, we'll merge the images using rasterio
        # In production, you'd use OpenDroneMap or similar
        try:
            datasets = [rasterio.open(path) for path in image_paths]
            
            # Merge datasets
            mosaic, out_trans = merge(datasets)
            
            # Get metadata from first dataset
            out_meta = datasets[0].meta.copy()
            out_meta.update({
                "driver": "GTiff",
                "height": mosaic.shape[1],
                "width": mosaic.shape[2],
                "transform": out_trans,
                "compress": "lzw"
            })
            
            # Write merged dataset
            with rasterio.open(orthomosaic_path, "w", **out_meta) as dest:
                dest.write(mosaic)
            
            # Close datasets
            for ds in datasets:
                ds.close()
            
            return orthomosaic_path
            
        except Exception as e:
            raise ProcessingError(f"Failed to create orthomosaic: {str(e)}")
    
    async def _create_thumbnail(self, orthomosaic_path: Path, work_dir: Path) -> Path:
        """Create thumbnail image from orthomosaic."""
        thumbnail_path = work_dir / "thumbnail.jpg"
        
        try:
            with rasterio.open(orthomosaic_path) as src:
                # Read RGB bands (assuming bands 1, 2, 3 are RGB)
                rgb = src.read([1, 2, 3])
                
                # Convert to 8-bit and rearrange to HWC format
                rgb_8bit = ((rgb - rgb.min()) / (rgb.max() - rgb.min()) * 255).astype(np.uint8)
                rgb_hwc = np.transpose(rgb_8bit, (1, 2, 0))
                
                # Create PIL image and resize
                img = Image.fromarray(rgb_hwc)
                img.thumbnail((800, 800), Image.Resampling.LANCZOS)
                img.save(thumbnail_path, "JPEG", quality=85)
            
            return thumbnail_path
            
        except Exception as e:
            logger.warning("Failed to create thumbnail", error=str(e))
            # Create a simple placeholder thumbnail
            placeholder = Image.new("RGB", (400, 300), color="gray")
            placeholder.save(thumbnail_path, "JPEG")
            return thumbnail_path
    
    async def extract_spectral_bands(self, orthomosaic_url: str) -> Dict[str, np.ndarray]:
        """
        Extract spectral bands from orthomosaic for analysis.
        
        Args:
            orthomosaic_url: URL of the orthomosaic image
            
        Returns:
            Dictionary mapping band names to numpy arrays
        """
        logger.info("Extracting spectral bands", orthomosaic_url=orthomosaic_url)
        
        try:
            # Download orthomosaic temporarily
            temp_path = self.temp_dir / "temp_orthomosaic.tiff"
            
            # In production, download from URL
            # For now, create dummy data
            dummy_bands = {
                "Red": np.random.randint(0, 255, (1000, 1000), dtype=np.uint8),
                "Green": np.random.randint(0, 255, (1000, 1000), dtype=np.uint8),
                "Blue": np.random.randint(0, 255, (1000, 1000), dtype=np.uint8),
                "NIR": np.random.randint(0, 255, (1000, 1000), dtype=np.uint8),
            }
            
            logger.info("Spectral bands extracted successfully", bands=list(dummy_bands.keys()))
            return dummy_bands
            
        except Exception as e:
            logger.error("Failed to extract spectral bands", error=str(e))
            raise ProcessingError(f"Failed to extract spectral bands: {str(e)}")
    
    def cleanup_temp_files(self, report_id: UUID) -> None:
        """Clean up temporary files for a report."""
        work_dir = self.temp_dir / str(report_id)
        if work_dir.exists():
            shutil.rmtree(work_dir, ignore_errors=True)
            logger.info("Temporary files cleaned up", report_id=str(report_id))