"""
Report data models and schemas.

This module defines the database models and Pydantic schemas for reports,
image uploads, analysis insights, and processing jobs.
"""

from datetime import datetime, date
from typing import List, Optional, Dict, Any
from uuid import UUID
from enum import Enum

from sqlalchemy import Column, String, DateTime, Date, Text, Integer, Numeric, Boolean, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID as PGUUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from pydantic import BaseModel, Field, validator

from app.database import Base


# Enums
class ReportStatus(str, Enum):
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class ProcessingJobType(str, Enum):
    IMAGE_UPLOAD = "image_upload"
    ORTHOMOSAIC = "orthomosaic"
    ANALYSIS = "analysis"
    REPORT_GENERATION = "report_generation"


class ProcessingJobStatus(str, Enum):
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class InsightType(str, Enum):
    HEALTH_ASSESSMENT = "health_assessment"
    WATER_STRESS = "water_stress"
    DISEASE_DETECTION = "disease_detection"


class SeverityLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


# Database Models
class Report(Base):
    """Main reports table for storing analysis results."""
    
    __tablename__ = "reports"
    
    id = Column(PGUUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4())
    farmer_id = Column(PGUUID(as_uuid=True), nullable=False)  # References farmers.id
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Report metadata
    report_name = Column(String(255), nullable=False)
    report_date = Column(Date, nullable=False)
    field_area_hectares = Column(Numeric(10, 2))
    
    # Analysis results
    ndvi_score = Column(Numeric(5, 4))  # -1 to 1
    ndwi_score = Column(Numeric(5, 4))  # -1 to 1
    healthy_vegetation_percent = Column(Numeric(5, 2))
    stressed_vegetation_percent = Column(Numeric(5, 2))
    water_stress_percent = Column(Numeric(5, 2))
    
    # File storage URLs
    original_images_url = Column(ARRAY(Text))
    orthomosaic_url = Column(Text)
    ndvi_map_url = Column(Text)
    ndwi_map_url = Column(Text)
    pdf_report_url = Column(Text)
    
    # Processing status
    status = Column(String(50), default="processing")
    processing_error = Column(Text)
    
    # Additional metadata
    image_count = Column(Integer)
    processing_duration_seconds = Column(Integer)
    recommendations = Column(ARRAY(Text))
    
    # Relationships
    image_uploads = relationship("ImageUpload", back_populates="report", cascade="all, delete-orphan")
    insights = relationship("AnalysisInsight", back_populates="report", cascade="all, delete-orphan")
    processing_jobs = relationship("ProcessingJob", back_populates="report", cascade="all, delete-orphan")


class ImageUpload(Base):
    """Individual drone images uploaded for processing."""
    
    __tablename__ = "image_uploads"
    
    id = Column(PGUUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4())
    report_id = Column(PGUUID(as_uuid=True), ForeignKey("reports.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Image metadata
    filename = Column(String(255), nullable=False)
    file_size_bytes = Column(Integer)
    file_type = Column(String(50))
    upload_url = Column(Text, nullable=False)
    
    # Geospatial data
    latitude = Column(Numeric(10, 8))
    longitude = Column(Numeric(11, 8))
    altitude_meters = Column(Numeric(8, 2))
    camera_settings = Column(JSONB)
    
    # Processing flags
    is_processed = Column(Boolean, default=False)
    processing_order = Column(Integer)
    
    # Relationships
    report = relationship("Report", back_populates="image_uploads")


class AnalysisInsight(Base):
    """Detailed analysis insights and findings."""
    
    __tablename__ = "analysis_insights"
    
    id = Column(PGUUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4())
    report_id = Column(PGUUID(as_uuid=True), ForeignKey("reports.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Insight data
    insight_type = Column(String(100), nullable=False)
    severity_level = Column(String(50))
    affected_area_percent = Column(Numeric(5, 2))
    
    # Location data
    polygon_coordinates = Column(JSONB)  # GeoJSON polygon
    center_latitude = Column(Numeric(10, 8))
    center_longitude = Column(Numeric(11, 8))
    
    # Recommendations
    recommended_action = Column(Text)
    priority_score = Column(Integer)  # 1-10
    estimated_yield_impact = Column(Numeric(5, 2))
    
    # Relationships
    report = relationship("Report", back_populates="insights")


class ProcessingJob(Base):
    """Background processing jobs tracking."""
    
    __tablename__ = "processing_jobs"
    
    id = Column(PGUUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4())
    report_id = Column(PGUUID(as_uuid=True), ForeignKey("reports.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    
    # Job details
    job_type = Column(String(100), nullable=False)
    status = Column(String(50), default="queued")
    progress_percent = Column(Integer, default=0)
    
    # Error handling
    error_message = Column(Text)
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    
    # Performance metrics
    cpu_usage_percent = Column(Numeric(5, 2))
    memory_usage_mb = Column(Integer)
    processing_time_seconds = Column(Integer)
    
    # Relationships
    report = relationship("Report", back_populates="processing_jobs")


# Pydantic Schemas
class ReportBase(BaseModel):
    """Base report schema."""
    report_name: str = Field(..., min_length=1, max_length=255)
    report_date: date
    field_area_hectares: Optional[float] = Field(None, gt=0)


class ReportCreate(ReportBase):
    """Schema for creating a new report."""
    farmer_id: UUID


class ReportUpdate(BaseModel):
    """Schema for updating a report."""
    report_name: Optional[str] = Field(None, min_length=1, max_length=255)
    field_area_hectares: Optional[float] = Field(None, gt=0)
    ndvi_score: Optional[float] = Field(None, ge=-1, le=1)
    ndwi_score: Optional[float] = Field(None, ge=-1, le=1)
    healthy_vegetation_percent: Optional[float] = Field(None, ge=0, le=100)
    stressed_vegetation_percent: Optional[float] = Field(None, ge=0, le=100)
    water_stress_percent: Optional[float] = Field(None, ge=0, le=100)
    status: Optional[ReportStatus] = None
    recommendations: Optional[List[str]] = None


class ReportResponse(ReportBase):
    """Schema for report responses."""
    id: UUID
    farmer_id: UUID
    created_at: datetime
    updated_at: datetime
    
    # Analysis results
    ndvi_score: Optional[float]
    ndwi_score: Optional[float]
    healthy_vegetation_percent: Optional[float]
    stressed_vegetation_percent: Optional[float]
    water_stress_percent: Optional[float]
    
    # File URLs
    original_images_url: Optional[List[str]]
    orthomosaic_url: Optional[str]
    ndvi_map_url: Optional[str]
    ndwi_map_url: Optional[str]
    pdf_report_url: Optional[str]
    
    # Status and metadata
    status: str
    processing_error: Optional[str]
    image_count: Optional[int]
    processing_duration_seconds: Optional[int]
    recommendations: Optional[List[str]]
    
    class Config:
        from_attributes = True


class ImageUploadBase(BaseModel):
    """Base image upload schema."""
    filename: str = Field(..., min_length=1, max_length=255)
    file_size_bytes: Optional[int] = Field(None, gt=0)
    file_type: Optional[str] = None
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    altitude_meters: Optional[float] = None
    camera_settings: Optional[Dict[str, Any]] = None


class ImageUploadCreate(ImageUploadBase):
    """Schema for creating image upload."""
    upload_url: str


class ImageUploadResponse(ImageUploadBase):
    """Schema for image upload responses."""
    id: UUID
    report_id: UUID
    created_at: datetime
    upload_url: str
    is_processed: bool
    processing_order: Optional[int]
    
    class Config:
        from_attributes = True


class AnalysisInsightBase(BaseModel):
    """Base analysis insight schema."""
    insight_type: InsightType
    severity_level: Optional[SeverityLevel] = None
    affected_area_percent: Optional[float] = Field(None, ge=0, le=100)
    center_latitude: Optional[float] = Field(None, ge=-90, le=90)
    center_longitude: Optional[float] = Field(None, ge=-180, le=180)
    recommended_action: Optional[str] = None
    priority_score: Optional[int] = Field(None, ge=1, le=10)
    estimated_yield_impact: Optional[float] = Field(None, ge=0, le=100)


class AnalysisInsightCreate(AnalysisInsightBase):
    """Schema for creating analysis insight."""
    polygon_coordinates: Optional[Dict[str, Any]] = None


class AnalysisInsightResponse(AnalysisInsightBase):
    """Schema for analysis insight responses."""
    id: UUID
    report_id: UUID
    created_at: datetime
    polygon_coordinates: Optional[Dict[str, Any]]
    
    class Config:
        from_attributes = True


class ProcessingJobBase(BaseModel):
    """Base processing job schema."""
    job_type: ProcessingJobType
    max_retries: Optional[int] = Field(3, ge=0, le=10)


class ProcessingJobCreate(ProcessingJobBase):
    """Schema for creating processing job."""
    pass


class ProcessingJobResponse(ProcessingJobBase):
    """Schema for processing job responses."""
    id: UUID
    report_id: UUID
    created_at: datetime
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    status: ProcessingJobStatus
    progress_percent: int
    error_message: Optional[str]
    retry_count: int
    cpu_usage_percent: Optional[float]
    memory_usage_mb: Optional[int]
    processing_time_seconds: Optional[int]
    
    class Config:
        from_attributes = True


# Summary schemas
class ReportSummary(BaseModel):
    """Summary of reports for dashboard."""
    total_reports: int
    completed_reports: int
    processing_reports: int
    failed_reports: int
    average_ndvi: Optional[float]
    average_ndwi: Optional[float]
    total_area_analyzed: Optional[float]


class FarmerReports(BaseModel):
    """Farmer's reports summary."""
    farmer_id: UUID
    reports: List[ReportResponse]
    total_reports: int
    latest_report_date: Optional[date]
    average_vegetation_health: Optional[float]