"""
Farmer data models and schemas.

This module defines the schemas for farmer data that integrates with
the existing farmers table in the frontend database.
"""

from datetime import datetime
from typing import List, Optional
from uuid import UUID
from enum import Enum

from pydantic import BaseModel, Field, EmailStr


# Enums matching the database
class FarmerExperience(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    EXPERIENCED = "experienced"


class PreferredLanguage(str, Enum):
    ENGLISH = "english"
    SHONA = "shona"
    NDEBELE = "ndebele"


class HearAboutSource(str, Enum):
    SOCIAL_MEDIA = "social_media"
    WORD_OF_MOUTH = "word_of_mouth"
    AGRICULTURAL_EXTENSION = "agricultural_extension"
    ONLINE_SEARCH = "online_search"
    OTHER = "other"


class FarmerStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"


# Pydantic Schemas
class FarmerBase(BaseModel):
    """Base farmer schema."""
    full_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=20)
    farm_location: str = Field(..., min_length=1, max_length=100)
    farm_size: float = Field(..., gt=0, description="Farm size in hectares")
    crop_types: List[str] = Field(..., min_items=1)
    experience: FarmerExperience
    has_smartphone: bool = True
    preferred_language: PreferredLanguage
    hear_about_us: HearAboutSource
    additional_info: Optional[str] = None


class FarmerResponse(FarmerBase):
    """Schema for farmer responses."""
    id: UUID
    created_at: datetime
    updated_at: datetime
    status: FarmerStatus
    
    class Config:
        from_attributes = True


class FarmerUpdate(BaseModel):
    """Schema for updating farmer information."""
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone: Optional[str] = Field(None, min_length=10, max_length=20)
    farm_location: Optional[str] = Field(None, min_length=1, max_length=100)
    farm_size: Optional[float] = Field(None, gt=0)
    crop_types: Optional[List[str]] = Field(None, min_items=1)
    experience: Optional[FarmerExperience] = None
    has_smartphone: Optional[bool] = None
    preferred_language: Optional[PreferredLanguage] = None
    additional_info: Optional[str] = None
    status: Optional[FarmerStatus] = None


class FarmerSearch(BaseModel):
    """Schema for farmer search parameters."""
    name: Optional[str] = None
    location: Optional[str] = None
    crop_type: Optional[str] = None
    experience: Optional[FarmerExperience] = None
    status: Optional[FarmerStatus] = None
    min_farm_size: Optional[float] = Field(None, gt=0)
    max_farm_size: Optional[float] = Field(None, gt=0)
    limit: int = Field(10, ge=1, le=100)
    offset: int = Field(0, ge=0)


class FarmerStats(BaseModel):
    """Farmer statistics for analytics."""
    total_farmers: int
    active_farmers: int
    pending_farmers: int
    average_farm_size: float
    total_farm_area: float
    farmers_by_experience: dict
    farmers_by_crop_type: dict
    farmers_by_location: dict


class FarmerWithReports(FarmerResponse):
    """Farmer data with report summary."""
    total_reports: int = 0
    latest_report_date: Optional[datetime] = None
    average_vegetation_health: Optional[float] = None
    reports_completed: int = 0
    reports_processing: int = 0