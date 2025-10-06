"""
Reports API routes.

This module handles all report-related endpoints including creation,
retrieval, updates, and file management.
"""

from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc
import structlog

from app.api.dependencies import (
    get_db, get_current_user_required, get_admin_user, 
    get_pagination, PaginationParams, log_request_info
)
from app.models.report import (
    ReportCreate, ReportUpdate, ReportResponse, ReportSummary,
    ImageUploadCreate, ImageUploadResponse, Report, ImageUpload,
    ReportStatus, ProcessingJob, ProcessingJobStatus
)
from app.models.farmer import FarmerResponse
from app.services.image_processor import ImageProcessor
from app.services.storage_service import StorageService
from app.core.exceptions import NotFoundError, ValidationError, ProcessingError

logger = structlog.get_logger()

router = APIRouter()

# Initialize services
image_processor = ImageProcessor()
storage_service = StorageService()


@router.post("/", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(
    report: ReportCreate,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user_required),
    _: None = Depends(log_request_info)
):
    """Create a new report for a farmer."""
    try:
        logger.info("Creating new report", farmer_id=str(report.farmer_id))
        
        # Verify farmer exists (in production, check against farmers table)
        # For now, we'll assume the farmer exists
        
        # Create new report
        db_report = Report(
            farmer_id=report.farmer_id,
            report_name=report.report_name,
            report_date=report.report_date,
            field_area_hectares=report.field_area_hectares,
            status=ReportStatus.PROCESSING
        )
        
        db.add(db_report)
        db.commit()
        db.refresh(db_report)
        
        logger.info("Report created successfully", report_id=str(db_report.id))
        
        return ReportResponse.from_orm(db_report)
        
    except Exception as e:
        logger.error("Failed to create report", error=str(e))
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create report: {str(e)}"
        )


@router.get("/", response_model=List[ReportResponse])
async def list_reports(
    farmer_id: Optional[UUID] = None,
    status_filter: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    pagination: PaginationParams = Depends(get_pagination),
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user_required),
    _: None = Depends(log_request_info)
):
    """List reports with optional filtering."""
    try:
        query = db.query(Report)
        
        # Apply filters
        if farmer_id:
            query = query.filter(Report.farmer_id == farmer_id)
        
        if status_filter:
            query = query.filter(Report.status == status_filter)
        
        if start_date:
            query = query.filter(Report.report_date >= start_date)
        
        if end_date:
            query = query.filter(Report.report_date <= end_date)
        
        # Apply pagination and ordering
        reports = query.order_by(desc(Report.created_at))\
                      .offset(pagination.offset)\
                      .limit(pagination.limit)\
                      .all()
        
        logger.info("Reports retrieved", count=len(reports), filters={
            "farmer_id": str(farmer_id) if farmer_id else None,
            "status": status_filter,
            "start_date": start_date,
            "end_date": end_date
        })
        
        return [ReportResponse.from_orm(report) for report in reports]
        
    except Exception as e:
        logger.error("Failed to list reports", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list reports: {str(e)}"
        )


@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: UUID,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user_required),
    _: None = Depends(log_request_info)
):
    """Get a specific report by ID."""
    try:
        report = db.query(Report).filter(Report.id == report_id).first()
        
        if not report:
            logger.warning("Report not found", report_id=str(report_id))
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )
        
        logger.info("Report retrieved", report_id=str(report_id))
        
        return ReportResponse.from_orm(report)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get report", error=str(e), report_id=str(report_id))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get report: {str(e)}"
        )


@router.put("/{report_id}", response_model=ReportResponse)
async def update_report(
    report_id: UUID,
    report_update: ReportUpdate,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user_required),
    _: None = Depends(log_request_info)
):
    """Update a report."""
    try:
        report = db.query(Report).filter(Report.id == report_id).first()
        
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )
        
        # Update fields
        update_data = report_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(report, field, value)
        
        db.commit()
        db.refresh(report)
        
        logger.info("Report updated", report_id=str(report_id), updated_fields=list(update_data.keys()))
        
        return ReportResponse.from_orm(report)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to update report", error=str(e), report_id=str(report_id))
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update report: {str(e)}"
        )


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report(
    report_id: UUID,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_admin_user),
    _: None = Depends(log_request_info)
):
    """Delete a report (admin only)."""
    try:
        report = db.query(Report).filter(Report.id == report_id).first()
        
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )
        
        # Delete associated files from storage
        file_urls = [
            report.orthomosaic_url,
            report.ndvi_map_url,
            report.ndwi_map_url,
            report.pdf_report_url
        ]
        
        for url in file_urls:
            if url:
                await storage_service.delete_file(url)
        
        # Delete from database
        db.delete(report)
        db.commit()
        
        logger.info("Report deleted", report_id=str(report_id))
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to delete report", error=str(e), report_id=str(report_id))
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete report: {str(e)}"
        )


@router.post("/{report_id}/images", response_model=List[ImageUploadResponse])
async def upload_images(
    report_id: UUID,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user_required),
    _: None = Depends(log_request_info)
):
    """Upload drone images for a report."""
    try:
        # Verify report exists
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )
        
        logger.info("Starting image upload", report_id=str(report_id), image_count=len(files))
        
        # Validate files
        file_info = []
        for file in files:
            if file.size > image_processor.max_image_size:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail=f"File {file.filename} too large"
                )
            
            file_info.append({
                "filename": file.filename,
                "file_size_bytes": file.size,
                "content_type": file.content_type
            })
        
        # Validate images
        validated_images = await image_processor.validate_images(file_info)
        
        # Upload files and create database records
        uploaded_images = []
        for i, (file, metadata) in enumerate(zip(files, validated_images)):
            # Save file temporarily and upload to storage
            import tempfile
            import os
            
            with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file.filename.split('.')[-1]}") as tmp_file:
                content = await file.read()
                tmp_file.write(content)
                tmp_file.flush()
                
                # Upload to storage
                storage_path = f"reports/{report_id}/images/{file.filename}"
                upload_url = await storage_service.upload_file(
                    tmp_file.name,
                    storage_path,
                    file.content_type
                )
                
                # Clean up temp file
                os.unlink(tmp_file.name)
            
            # Create database record
            db_image = ImageUpload(
                report_id=report_id,
                filename=file.filename,
                file_size_bytes=file.size,
                file_type=file.content_type,
                upload_url=upload_url,
                processing_order=i + 1
            )
            
            db.add(db_image)
            uploaded_images.append(db_image)
        
        db.commit()
        
        # Update report status
        report.status = ReportStatus.PROCESSING
        report.image_count = len(uploaded_images)
        db.commit()
        
        logger.info("Images uploaded successfully", report_id=str(report_id), count=len(uploaded_images))
        
        return [ImageUploadResponse.from_orm(img) for img in uploaded_images]
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Image upload failed", error=str(e), report_id=str(report_id))
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Image upload failed: {str(e)}"
        )


@router.get("/{report_id}/images", response_model=List[ImageUploadResponse])
async def get_report_images(
    report_id: UUID,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user_required),
    _: None = Depends(log_request_info)
):
    """Get all images for a report."""
    try:
        images = db.query(ImageUpload)\
                   .filter(ImageUpload.report_id == report_id)\
                   .order_by(ImageUpload.processing_order)\
                   .all()
        
        logger.info("Report images retrieved", report_id=str(report_id), count=len(images))
        
        return [ImageUploadResponse.from_orm(img) for img in images]
        
    except Exception as e:
        logger.error("Failed to get report images", error=str(e), report_id=str(report_id))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get report images: {str(e)}"
        )


@router.get("/summary/statistics", response_model=ReportSummary)
async def get_report_statistics(
    farmer_id: Optional[UUID] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user_required),
    _: None = Depends(log_request_info)
):
    """Get report statistics and summary."""
    try:
        query = db.query(Report)
        
        # Apply filters
        if farmer_id:
            query = query.filter(Report.farmer_id == farmer_id)
        
        if start_date:
            query = query.filter(Report.report_date >= start_date)
        
        if end_date:
            query = query.filter(Report.report_date <= end_date)
        
        # Calculate statistics
        all_reports = query.all()
        total_reports = len(all_reports)
        
        completed_reports = len([r for r in all_reports if r.status == ReportStatus.COMPLETED])
        processing_reports = len([r for r in all_reports if r.status == ReportStatus.PROCESSING])
        failed_reports = len([r for r in all_reports if r.status == ReportStatus.FAILED])
        
        # Calculate averages
        completed_with_ndvi = [r for r in all_reports if r.ndvi_score is not None]
        completed_with_ndwi = [r for r in all_reports if r.ndwi_score is not None]
        
        average_ndvi = sum(r.ndvi_score for r in completed_with_ndvi) / len(completed_with_ndvi) if completed_with_ndvi else None
        average_ndwi = sum(r.ndwi_score for r in completed_with_ndwi) / len(completed_with_ndwi) if completed_with_ndwi else None
        
        total_area = sum(r.field_area_hectares for r in all_reports if r.field_area_hectares) or None
        
        summary = ReportSummary(
            total_reports=total_reports,
            completed_reports=completed_reports,
            processing_reports=processing_reports,
            failed_reports=failed_reports,
            average_ndvi=round(average_ndvi, 3) if average_ndvi else None,
            average_ndwi=round(average_ndwi, 3) if average_ndwi else None,
            total_area_analyzed=round(total_area, 2) if total_area else None
        )
        
        logger.info("Report statistics calculated", summary=summary.dict())
        
        return summary
        
    except Exception as e:
        logger.error("Failed to calculate report statistics", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate statistics: {str(e)}"
        )