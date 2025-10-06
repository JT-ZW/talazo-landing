"""
Analysis API routes.

This module handles vegetation analysis, processing jobs,
and visualization generation endpoints.
"""

from typing import List, Optional, Dict, Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy.orm import Session
import asyncio
import structlog

from app.api.dependencies import (
    get_db, get_current_user_required, get_admin_user,
    log_request_info
)
from app.models.report import Report, ProcessingJob, ProcessingJobResponse, ReportStatus
from app.models.analysis import (
    AnalysisRequest, AnalysisResult, ProcessingProgress, 
    VisualizationRequest, QualityMetrics, AnalysisConfig
)
from app.services.image_processor import ImageProcessor
from app.services.vegetation_analysis import VegetationAnalyzer
from app.services.storage_service import StorageService
from app.core.exceptions import NotFoundError, ProcessingError

logger = structlog.get_logger()

router = APIRouter()

# Initialize services
image_processor = ImageProcessor()
vegetation_analyzer = VegetationAnalyzer()
storage_service = StorageService()


@router.post("/start", response_model=ProcessingJobResponse)
async def start_analysis(
    analysis_request: AnalysisRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user_required),
    _: None = Depends(log_request_info)
):
    """Start vegetation analysis for a report."""
    try:
        # Verify report exists and has images
        report = db.query(Report).filter(Report.id == analysis_request.report_id).first()
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )
        
        if not report.image_uploads:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No images uploaded for this report"
            )
        
        logger.info(
            "Starting analysis", 
            report_id=str(analysis_request.report_id),
            analysis_types=analysis_request.analysis_types
        )
        
        # Create processing job
        job = ProcessingJob(
            report_id=analysis_request.report_id,
            job_type="analysis",
            status="queued",
            max_retries=3
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        # Start background processing
        background_tasks.add_task(
            process_analysis,
            job.id,
            analysis_request
        )
        
        logger.info("Analysis job created", job_id=str(job.id))
        
        return ProcessingJobResponse.from_orm(job)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to start analysis", error=str(e))
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start analysis: {str(e)}"
        )


@router.get("/status/{job_id}", response_model=ProcessingProgress)
async def get_analysis_status(
    job_id: UUID,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user_required),
    _: None = Depends(log_request_info)
):
    """Get analysis processing status."""
    try:
        job = db.query(ProcessingJob).filter(ProcessingJob.id == job_id).first()
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Processing job not found"
            )
        
        # Convert job to progress object
        progress = ProcessingProgress(
            job_id=job.id,
            current_stage=job.job_type,  # Simplified mapping
            progress_percent=job.progress_percent,
            estimated_completion_minutes=None,  # Would calculate based on job history
            stages_completed=[],  # Would track completed stages
            current_operation=f"Processing {job.job_type}",
            error_message=job.error_message,
            warnings=[]
        )
        
        logger.info("Analysis status retrieved", job_id=str(job_id), status=job.status)
        
        return progress
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get analysis status", error=str(e), job_id=str(job_id))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get analysis status: {str(e)}"
        )


@router.get("/results/{report_id}", response_model=AnalysisResult)
async def get_analysis_results(
    report_id: UUID,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user_required),
    _: None = Depends(log_request_info)
):
    """Get analysis results for a report."""
    try:
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )
        
        if report.status != ReportStatus.COMPLETED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Analysis not completed yet"
            )
        
        # Create analysis result from report data
        result = AnalysisResult(
            report_id=report.id,
            analysis_id=UUID('00000000-0000-0000-0000-000000000000'),  # Would be actual analysis ID
            created_at=report.created_at,
            completed_at=report.updated_at,
            processing_duration_seconds=report.processing_duration_seconds,
            total_area_analyzed_hectares=report.field_area_hectares or 0,
            image_count_processed=report.image_count or 0,
            ndvi_heatmap_url=report.ndvi_map_url,
            ndwi_heatmap_url=report.ndwi_map_url,
            pdf_report_url=report.pdf_report_url,
            vegetation_health_score=report.healthy_vegetation_percent,
            recommended_actions=report.recommendations or [],
            analysis_confidence=0.85,  # Would be calculated
            data_quality_score=0.9   # Would be calculated
        )
        
        logger.info("Analysis results retrieved", report_id=str(report_id))
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get analysis results", error=str(e), report_id=str(report_id))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get analysis results: {str(e)}"
        )


@router.post("/visualize", response_model=Dict[str, str])
async def generate_visualizations(
    viz_request: VisualizationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user_required),
    _: None = Depends(log_request_info)
):
    """Generate visualization maps for a report."""
    try:
        report = db.query(Report).filter(Report.id == viz_request.report_id).first()
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )
        
        logger.info(
            "Generating visualizations",
            report_id=str(viz_request.report_id),
            types=viz_request.visualization_types
        )
        
        # Start background visualization generation
        background_tasks.add_task(
            generate_visualization_maps,
            viz_request.report_id,
            viz_request
        )
        
        return {
            "message": "Visualization generation started",
            "report_id": str(viz_request.report_id),
            "types": viz_request.visualization_types
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to start visualization generation", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate visualizations: {str(e)}"
        )


@router.get("/quality/{report_id}", response_model=QualityMetrics)
async def get_quality_metrics(
    report_id: UUID,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user_required),
    _: None = Depends(log_request_info)
):
    """Get data quality metrics for a report."""
    try:
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )
        
        # For demonstration, return sample quality metrics
        # In production, this would be calculated during analysis
        quality_metrics = QualityMetrics(
            image_sharpness_score=0.85,
            exposure_quality_score=0.92,
            color_balance_score=0.78,
            overlap_sufficiency=0.89,
            ground_control_accuracy=2.5,  # cm
            orthomosaic_seamlines_quality=0.91,
            overall_quality_score=0.87,
            quality_issues=[],
            recommendations=["Consider flying at lower altitude for better resolution"]
        )
        
        logger.info("Quality metrics retrieved", report_id=str(report_id))
        
        return quality_metrics
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get quality metrics", error=str(e), report_id=str(report_id))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get quality metrics: {str(e)}"
        )


@router.get("/config", response_model=AnalysisConfig)
async def get_analysis_config(
    current_user: Dict[str, Any] = Depends(get_current_user_required),
    _: None = Depends(log_request_info)
):
    """Get current analysis configuration."""
    try:
        config = AnalysisConfig()
        
        logger.info("Analysis config retrieved")
        
        return config
        
    except Exception as e:
        logger.error("Failed to get analysis config", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get analysis config: {str(e)}"
        )


@router.put("/config", response_model=AnalysisConfig)
async def update_analysis_config(
    config: AnalysisConfig,
    current_user: Dict[str, Any] = Depends(get_admin_user),
    _: None = Depends(log_request_info)
):
    """Update analysis configuration (admin only)."""
    try:
        # In production, save config to database or configuration service
        logger.info("Analysis config updated", config=config.dict())
        
        return config
        
    except Exception as e:
        logger.error("Failed to update analysis config", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update analysis config: {str(e)}"
        )


# Background task functions
async def process_analysis(job_id: UUID, analysis_request: AnalysisRequest):
    """Background task to process vegetation analysis."""
    from app.database import SessionLocal
    
    db = SessionLocal()
    
    try:
        job = db.query(ProcessingJob).filter(ProcessingJob.id == job_id).first()
        if not job:
            logger.error("Processing job not found", job_id=str(job_id))
            return
        
        report = db.query(Report).filter(Report.id == analysis_request.report_id).first()
        if not report:
            logger.error("Report not found", report_id=str(analysis_request.report_id))
            return
        
        logger.info("Starting background analysis processing", job_id=str(job_id))
        
        # Update job status
        job.status = "running"
        job.progress_percent = 0
        db.commit()
        
        # Progress callback
        async def update_progress(stage, percent):
            job.progress_percent = percent
            db.commit()
            logger.info("Analysis progress update", job_id=str(job_id), stage=stage, percent=percent)
        
        try:
            # Step 1: Generate orthomosaic
            image_urls = [img.upload_url for img in report.image_uploads]
            orthomosaic_result = await image_processor.generate_orthomosaic(
                report.id, 
                image_urls,
                progress_callback=update_progress
            )
            
            # Update report with orthomosaic URL
            report.orthomosaic_url = orthomosaic_result.orthomosaic_url
            job.progress_percent = 30
            db.commit()
            
            # Step 2: Extract spectral bands
            spectral_bands = await image_processor.extract_spectral_bands(
                orthomosaic_result.orthomosaic_url
            )
            job.progress_percent = 50
            db.commit()
            
            # Step 3: Calculate vegetation indices
            vegetation_indices = await vegetation_analyzer.calculate_vegetation_indices(
                spectral_bands,
                report.id,
                progress_callback=update_progress
            )
            
            # Update report with analysis results
            if "ndvi" in vegetation_indices:
                ndvi_result = vegetation_indices["ndvi"]
                report.ndvi_score = ndvi_result.mean_value
                report.healthy_vegetation_percent = ndvi_result.healthy_percent
                report.stressed_vegetation_percent = ndvi_result.stressed_percent
            
            if "ndwi" in vegetation_indices:
                ndwi_result = vegetation_indices["ndwi"]
                report.ndwi_score = ndwi_result.mean_value
                report.water_stress_percent = ndwi_result.severely_stressed_percent
            
            job.progress_percent = 80
            db.commit()
            
            # Step 4: Generate analysis zones and recommendations
            zones = await vegetation_analyzer.generate_analysis_zones(
                vegetation_indices,
                spectral_bands,
                orthomosaic_result.total_area_hectares
            )
            
            # Extract recommendations
            recommendations = []
            for zone in zones:
                if zone.irrigation_recommendation:
                    recommendations.append(f"Zone {zone.zone_id}: {zone.irrigation_recommendation}")
                if zone.fertilizer_recommendation:
                    recommendations.append(f"Zone {zone.zone_id}: {zone.fertilizer_recommendation}")
            
            report.recommendations = recommendations[:10]  # Limit to 10 recommendations
            
            # Complete the job
            job.status = "completed"
            job.progress_percent = 100
            job.completed_at = db.func.now()
            
            report.status = ReportStatus.COMPLETED
            report.processing_duration_seconds = 300  # Would calculate actual duration
            
            db.commit()
            
            logger.info("Analysis processing completed successfully", job_id=str(job_id))
            
        except Exception as e:
            logger.error("Analysis processing failed", error=str(e), job_id=str(job_id))
            
            job.status = "failed"
            job.error_message = str(e)
            job.retry_count += 1
            
            report.status = ReportStatus.FAILED
            report.processing_error = str(e)
            
            db.commit()
            
    except Exception as e:
        logger.error("Background analysis task failed", error=str(e), job_id=str(job_id))
    finally:
        db.close()


async def generate_visualization_maps(report_id: UUID, viz_request: VisualizationRequest):
    """Background task to generate visualization maps."""
    from app.database import SessionLocal
    
    db = SessionLocal()
    
    try:
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            logger.error("Report not found for visualization", report_id=str(report_id))
            return
        
        logger.info("Starting visualization generation", report_id=str(report_id))
        
        # Generate visualizations based on request
        # This would use matplotlib/plotly to create actual heatmaps
        
        # For demonstration, create placeholder URLs
        if "ndvi_heatmap" in viz_request.visualization_types:
            report.ndvi_map_url = f"https://storage.example.com/reports/{report_id}/ndvi_heatmap.png"
        
        if "ndwi_heatmap" in viz_request.visualization_types:
            report.ndwi_map_url = f"https://storage.example.com/reports/{report_id}/ndwi_heatmap.png"
        
        db.commit()
        
        logger.info("Visualization generation completed", report_id=str(report_id))
        
    except Exception as e:
        logger.error("Visualization generation failed", error=str(e), report_id=str(report_id))
    finally:
        db.close()