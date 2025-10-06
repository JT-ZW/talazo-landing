"""
Configuration settings for the Talazo Intelligence Backend.

This module handles all environment variables and application configuration.
"""

from typing import List, Optional
from pydantic import BaseSettings, validator
from decouple import config


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # FastAPI Configuration
    DEBUG: bool = config("DEBUG", default=False, cast=bool)
    API_V1_STR: str = config("API_V1_STR", default="/api/v1")
    PROJECT_NAME: str = config("PROJECT_NAME", default="Talazo Intelligence Backend")
    VERSION: str = config("VERSION", default="1.0.0")
    DESCRIPTION: str = config("DESCRIPTION", default="AI-powered drone imagery analysis")
    
    # Server Configuration
    HOST: str = config("HOST", default="0.0.0.0")
    PORT: int = config("PORT", default=8000, cast=int)
    WORKERS: int = config("WORKERS", default=1, cast=int)
    
    # Database Configuration
    DATABASE_URL: str = config("DATABASE_URL")
    SUPABASE_URL: str = config("SUPABASE_URL")
    SUPABASE_SERVICE_KEY: str = config("SUPABASE_SERVICE_KEY")
    SUPABASE_ANON_KEY: str = config("SUPABASE_ANON_KEY")
    
    # Storage Configuration
    STORAGE_PROVIDER: str = config("STORAGE_PROVIDER", default="supabase")
    SUPABASE_STORAGE_BUCKET: str = config("SUPABASE_STORAGE_BUCKET", default="talazo-reports")
    AWS_ACCESS_KEY_ID: Optional[str] = config("AWS_ACCESS_KEY_ID", default=None)
    AWS_SECRET_ACCESS_KEY: Optional[str] = config("AWS_SECRET_ACCESS_KEY", default=None)
    AWS_REGION: str = config("AWS_REGION", default="us-east-1")
    AWS_S3_BUCKET: str = config("AWS_S3_BUCKET", default="talazo-intelligence")
    
    # Email Configuration
    EMAIL_PROVIDER: str = config("EMAIL_PROVIDER", default="resend")
    RESEND_API_KEY: Optional[str] = config("RESEND_API_KEY", default=None)
    SENDGRID_API_KEY: Optional[str] = config("SENDGRID_API_KEY", default=None)
    FROM_EMAIL: str = config("FROM_EMAIL", default="reports@talazo.com")
    FROM_NAME: str = config("FROM_NAME", default="Talazo Intelligence")
    
    # Security
    SECRET_KEY: str = config("SECRET_KEY")
    ALGORITHM: str = config("ALGORITHM", default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = config("ACCESS_TOKEN_EXPIRE_MINUTES", default=30, cast=int)
    
    # Redis Configuration
    REDIS_URL: str = config("REDIS_URL", default="redis://localhost:6379/0")
    
    # OpenDroneMap Configuration
    ODM_API_URL: str = config("ODM_API_URL", default="http://localhost:3000")
    ODM_PROCESSING_TIMEOUT: int = config("ODM_PROCESSING_TIMEOUT", default=3600, cast=int)
    
    # Image Processing
    MAX_IMAGE_SIZE_MB: int = config("MAX_IMAGE_SIZE_MB", default=50, cast=int)
    SUPPORTED_FORMATS: str = config("SUPPORTED_FORMATS", default="tiff,tif,jpg,jpeg,png")
    MAX_IMAGES_PER_BATCH: int = config("MAX_IMAGES_PER_BATCH", default=100, cast=int)
    
    # Analysis Configuration
    NDVI_THRESHOLD_HEALTHY: float = config("NDVI_THRESHOLD_HEALTHY", default=0.5, cast=float)
    NDVI_THRESHOLD_STRESSED: float = config("NDVI_THRESHOLD_STRESSED", default=0.3, cast=float)
    NDWI_THRESHOLD_WATER_STRESS: float = config("NDWI_THRESHOLD_WATER_STRESS", default=-0.1, cast=float)
    
    # Monitoring
    SENTRY_DSN: Optional[str] = config("SENTRY_DSN", default=None)
    LOG_LEVEL: str = config("LOG_LEVEL", default="INFO")
    
    # CORS Configuration
    ALLOWED_ORIGINS: str = config("ALLOWED_ORIGINS", default="http://localhost:3000")
    ALLOWED_METHODS: str = config("ALLOWED_METHODS", default="GET,POST,PUT,DELETE")
    ALLOWED_HEADERS: str = config("ALLOWED_HEADERS", default="*")
    
    @validator("SUPPORTED_FORMATS")
    def validate_supported_formats(cls, v):
        """Convert comma-separated string to list."""
        return [fmt.strip().lower() for fmt in v.split(",")]
    
    @validator("ALLOWED_ORIGINS")
    def validate_allowed_origins(cls, v):
        """Convert comma-separated string to list."""
        return [origin.strip() for origin in v.split(",")]
    
    @validator("ALLOWED_METHODS")
    def validate_allowed_methods(cls, v):
        """Convert comma-separated string to list."""
        return [method.strip() for method in v.split(",")]
    
    @property
    def max_image_size_bytes(self) -> int:
        """Convert MB to bytes."""
        return self.MAX_IMAGE_SIZE_MB * 1024 * 1024
    
    class Config:
        """Pydantic configuration."""
        case_sensitive = True


# Global settings instance
settings = Settings()