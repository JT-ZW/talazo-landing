"""
Farmers API routes.

This module handles farmer-related endpoints that integrate with
the existing farmers table from the frontend database.
"""

from typing import List, Optional, Dict, Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc, func
import structlog

from app.api.dependencies import (
    get_db, get_current_user_required, get_admin_user,
    get_pagination, PaginationParams, log_request_info
)
from app.models.farmer import (
    FarmerResponse, FarmerUpdate, FarmerSearch, FarmerStats, 
    FarmerWithReports, FarmerStatus, FarmerExperience
)
from app.models.report import Report, ReportResponse, FarmerReports

logger = structlog.get_logger()

router = APIRouter()


@router.get("/", response_model=List[FarmerWithReports])
async def list_farmers(
    search: Optional[str] = Query(None, description="Search by name or location"),
    status_filter: Optional[FarmerStatus] = Query(None, description="Filter by farmer status"),
    experience: Optional[FarmerExperience] = Query(None, description="Filter by experience level"),
    crop_type: Optional[str] = Query(None, description="Filter by crop type"),
    min_farm_size: Optional[float] = Query(None, description="Minimum farm size in hectares"),
    max_farm_size: Optional[float] = Query(None, description="Maximum farm size in hectares"),
    has_reports: Optional[bool] = Query(None, description="Filter farmers with/without reports"),
    pagination: PaginationParams = Depends(get_pagination),
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user_required),
    _: None = Depends(log_request_info)
):
    """List farmers with optional filtering and search."""
    try:
        # Note: In production, you'd query the actual farmers table
        # For demonstration, we'll create sample data
        
        farmers_data = [
            {
                "id": UUID("11111111-1111-1111-1111-111111111111"),
                "full_name": "John Mukamuri",
                "email": "john.mukamuri@gmail.com",
                "phone": "+263771234567",
                "farm_location": "Harare East",
                "farm_size": 15.5,
                "crop_types": ["maize", "tobacco"],
                "experience": "experienced",
                "has_smartphone": True,
                "preferred_language": "english",
                "hear_about_us": "word_of_mouth",
                "status": "active",
                "total_reports": 3,
                "reports_completed": 2,
                "reports_processing": 1,
                "average_vegetation_health": 78.5
            },
            {
                "id": UUID("22222222-2222-2222-2222-222222222222"),
                "full_name": "Grace Chikwanha",
                "email": "grace.chikwanha@gmail.com",
                "phone": "+263772345678",
                "farm_location": "Mashonaland Central",
                "farm_size": 8.2,
                "crop_types": ["maize", "soybeans"],
                "experience": "intermediate",
                "has_smartphone": True,
                "preferred_language": "shona",
                "hear_about_us": "social_media",
                "status": "active",
                "total_reports": 1,
                "reports_completed": 1,
                "reports_processing": 0,
                "average_vegetation_health": 82.1
            }
        ]
        
        # Apply filters (simplified for demonstration)
        filtered_farmers = farmers_data
        
        if search:
            filtered_farmers = [
                f for f in filtered_farmers 
                if search.lower() in f["full_name"].lower() or search.lower() in f["farm_location"].lower()
            ]
        
        if status_filter:
            filtered_farmers = [f for f in filtered_farmers if f["status"] == status_filter.value]
        
        if experience:
            filtered_farmers = [f for f in filtered_farmers if f["experience"] == experience.value]
        
        if crop_type:
            filtered_farmers = [f for f in filtered_farmers if crop_type.lower() in [c.lower() for c in f["crop_types"]]]
        
        if min_farm_size:
            filtered_farmers = [f for f in filtered_farmers if f["farm_size"] >= min_farm_size]
        
        if max_farm_size:
            filtered_farmers = [f for f in filtered_farmers if f["farm_size"] <= max_farm_size]
        
        if has_reports is not None:
            if has_reports:
                filtered_farmers = [f for f in filtered_farmers if f["total_reports"] > 0]
            else:
                filtered_farmers = [f for f in filtered_farmers if f["total_reports"] == 0]
        
        # Apply pagination
        start_idx = pagination.offset
        end_idx = start_idx + pagination.limit
        paginated_farmers = filtered_farmers[start_idx:end_idx]
        
        # Convert to response objects
        result = []
        for farmer_data in paginated_farmers:
            farmer = FarmerWithReports(
                id=farmer_data["id"],
                created_at="2024-01-01T00:00:00Z",
                updated_at="2024-01-01T00:00:00Z",
                full_name=farmer_data["full_name"],
                email=farmer_data["email"],
                phone=farmer_data["phone"],
                farm_location=farmer_data["farm_location"],
                farm_size=farmer_data["farm_size"],
                crop_types=farmer_data["crop_types"],
                experience=farmer_data["experience"],
                has_smartphone=farmer_data["has_smartphone"],
                preferred_language=farmer_data["preferred_language"],
                hear_about_us=farmer_data["hear_about_us"],
                status=farmer_data["status"],
                total_reports=farmer_data["total_reports"],
                reports_completed=farmer_data["reports_completed"],
                reports_processing=farmer_data["reports_processing"],
                average_vegetation_health=farmer_data.get("average_vegetation_health")
            )
            result.append(farmer)
        
        logger.info(
            "Farmers listed", 
            total_found=len(filtered_farmers),
            returned=len(result),
            filters={
                "search": search,
                "status": status_filter,
                "experience": experience,
                "crop_type": crop_type,
                "has_reports": has_reports
            }
        )
        
        return result
        
    except Exception as e:
        logger.error("Failed to list farmers", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list farmers: {str(e)}"
        )


@router.get("/{farmer_id}", response_model=FarmerWithReports)
async def get_farmer(
    farmer_id: UUID,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user_required),
    _: None = Depends(log_request_info)
):
    """Get a specific farmer by ID."""
    try:
        # In production, query the actual farmers table
        # For demonstration, return sample data
        
        if str(farmer_id) == "11111111-1111-1111-1111-111111111111":
            farmer = FarmerWithReports(
                id=farmer_id,
                created_at="2024-01-01T00:00:00Z",
                updated_at="2024-01-01T00:00:00Z",
                full_name="John Mukamuri",
                email="john.mukamuri@gmail.com",
                phone="+263771234567",
                farm_location="Harare East",
                farm_size=15.5,
                crop_types=["maize", "tobacco"],
                experience="experienced",
                has_smartphone=True,
                preferred_language="english",
                hear_about_us="word_of_mouth",
                status="active",
                total_reports=3,
                reports_completed=2,
                reports_processing=1,
                average_vegetation_health=78.5
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farmer not found"
            )
        
        logger.info("Farmer retrieved", farmer_id=str(farmer_id))
        
        return farmer
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get farmer", error=str(e), farmer_id=str(farmer_id))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get farmer: {str(e)}"
        )


@router.get("/{farmer_id}/reports", response_model=List[ReportResponse])
async def get_farmer_reports(
    farmer_id: UUID,
    include_processing: bool = Query(True, description="Include processing reports"),
    include_failed: bool = Query(False, description="Include failed reports"),
    pagination: PaginationParams = Depends(get_pagination),
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user_required),
    _: None = Depends(log_request_info)
):
    """Get all reports for a specific farmer."""
    try:
        query = db.query(Report).filter(Report.farmer_id == farmer_id)
        
        # Apply status filters
        status_filters = ["completed"]
        if include_processing:
            status_filters.append("processing")
        if include_failed:
            status_filters.append("failed")
        
        query = query.filter(Report.status.in_(status_filters))
        
        # Apply pagination and ordering
        reports = query.order_by(desc(Report.created_at))\
                      .offset(pagination.offset)\
                      .limit(pagination.limit)\
                      .all()
        
        logger.info(
            "Farmer reports retrieved", 
            farmer_id=str(farmer_id),
            count=len(reports),
            include_processing=include_processing,
            include_failed=include_failed
        )
        
        return [ReportResponse.from_orm(report) for report in reports]
        
    except Exception as e:
        logger.error("Failed to get farmer reports", error=str(e), farmer_id=str(farmer_id))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get farmer reports: {str(e)}"
        )


@router.put("/{farmer_id}", response_model=FarmerResponse)
async def update_farmer(
    farmer_id: UUID,
    farmer_update: FarmerUpdate,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user_required),
    _: None = Depends(log_request_info)
):
    """Update farmer information."""
    try:
        # In production, update the actual farmers table
        # For demonstration, return success response
        
        logger.info("Farmer update requested", farmer_id=str(farmer_id), updates=farmer_update.dict(exclude_unset=True))
        
        # Return sample updated farmer data
        farmer = FarmerResponse(
            id=farmer_id,
            created_at="2024-01-01T00:00:00Z",
            updated_at="2024-10-02T12:00:00Z",
            full_name="John Mukamuri Updated",
            email="john.mukamuri@gmail.com",
            phone="+263771234567",
            farm_location="Harare East",
            farm_size=15.5,
            crop_types=["maize", "tobacco"],
            experience="experienced",
            has_smartphone=True,
            preferred_language="english",
            hear_about_us="word_of_mouth",
            status="active"
        )
        
        return farmer
        
    except Exception as e:
        logger.error("Failed to update farmer", error=str(e), farmer_id=str(farmer_id))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update farmer: {str(e)}"
        )


@router.get("/statistics/overview", response_model=FarmerStats)
async def get_farmer_statistics(
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user_required),
    _: None = Depends(log_request_info)
):
    """Get farmer statistics and analytics."""
    try:
        # In production, calculate from actual farmers table
        # For demonstration, return sample statistics
        
        stats = FarmerStats(
            total_farmers=156,
            active_farmers=142,
            pending_farmers=14,
            average_farm_size=12.8,
            total_farm_area=1996.8,
            farmers_by_experience={
                "beginner": 45,
                "intermediate": 67,
                "experienced": 44
            },
            farmers_by_crop_type={
                "maize": 98,
                "tobacco": 67,
                "soybeans": 43,
                "cotton": 32,
                "wheat": 28
            },
            farmers_by_location={
                "Harare": 34,
                "Mashonaland Central": 28,
                "Mashonaland East": 31,
                "Mashonaland West": 25,
                "Manicaland": 22,
                "Other": 16
            }
        )
        
        logger.info("Farmer statistics calculated", total_farmers=stats.total_farmers)
        
        return stats
        
    except Exception as e:
        logger.error("Failed to calculate farmer statistics", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate farmer statistics: {str(e)}"
        )


@router.post("/{farmer_id}/reports/summary", response_model=FarmerReports)
async def get_farmer_reports_summary(
    farmer_id: UUID,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user_required),
    _: None = Depends(log_request_info)
):
    """Get comprehensive farmer reports summary."""
    try:
        # Get all reports for the farmer
        reports = db.query(Report)\
                    .filter(Report.farmer_id == farmer_id)\
                    .order_by(desc(Report.created_at))\
                    .all()
        
        # Calculate summary statistics
        total_reports = len(reports)
        latest_report_date = reports[0].report_date if reports else None
        
        # Calculate average vegetation health from completed reports
        completed_reports = [r for r in reports if r.healthy_vegetation_percent is not None]
        average_vegetation_health = (
            sum(r.healthy_vegetation_percent for r in completed_reports) / len(completed_reports)
            if completed_reports else None
        )
        
        summary = FarmerReports(
            farmer_id=farmer_id,
            reports=[ReportResponse.from_orm(report) for report in reports],
            total_reports=total_reports,
            latest_report_date=latest_report_date,
            average_vegetation_health=round(average_vegetation_health, 1) if average_vegetation_health else None
        )
        
        logger.info(
            "Farmer reports summary generated",
            farmer_id=str(farmer_id),
            total_reports=total_reports,
            average_health=average_vegetation_health
        )
        
        return summary
        
    except Exception as e:
        logger.error("Failed to generate farmer reports summary", error=str(e), farmer_id=str(farmer_id))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate farmer reports summary: {str(e)}"
        )