"""
Custom exceptions for the Talazo Intelligence Backend.

This module defines application-specific exceptions with proper error handling.
"""

from typing import Optional, Any, Dict


class CustomException(Exception):
    """Base custom exception class."""
    
    def __init__(
        self,
        message: str,
        status_code: int = 500,
        detail: Optional[str] = None,
        extra_data: Optional[Dict[str, Any]] = None,
    ):
        self.message = message
        self.status_code = status_code
        self.detail = detail or message
        self.extra_data = extra_data or {}
        super().__init__(self.message)


class ValidationError(CustomException):
    """Raised when input validation fails."""
    
    def __init__(self, message: str = "Validation failed", detail: Optional[str] = None):
        super().__init__(message, status_code=422, detail=detail)


class NotFoundError(CustomException):
    """Raised when a requested resource is not found."""
    
    def __init__(self, message: str = "Resource not found", detail: Optional[str] = None):
        super().__init__(message, status_code=404, detail=detail)


class AuthenticationError(CustomException):
    """Raised when authentication fails."""
    
    def __init__(self, message: str = "Authentication failed", detail: Optional[str] = None):
        super().__init__(message, status_code=401, detail=detail)


class AuthorizationError(CustomException):
    """Raised when user lacks permission for an action."""
    
    def __init__(self, message: str = "Access denied", detail: Optional[str] = None):
        super().__init__(message, status_code=403, detail=detail)


class ProcessingError(CustomException):
    """Raised when image processing fails."""
    
    def __init__(self, message: str = "Processing failed", detail: Optional[str] = None):
        super().__init__(message, status_code=500, detail=detail)


class StorageError(CustomException):
    """Raised when file storage operations fail."""
    
    def __init__(self, message: str = "Storage operation failed", detail: Optional[str] = None):
        super().__init__(message, status_code=500, detail=detail)


class EmailError(CustomException):
    """Raised when email sending fails."""
    
    def __init__(self, message: str = "Email sending failed", detail: Optional[str] = None):
        super().__init__(message, status_code=500, detail=detail)


class ConfigurationError(CustomException):
    """Raised when configuration is invalid."""
    
    def __init__(self, message: str = "Configuration error", detail: Optional[str] = None):
        super().__init__(message, status_code=500, detail=detail)


class ExternalServiceError(CustomException):
    """Raised when external service calls fail."""
    
    def __init__(self, message: str = "External service error", detail: Optional[str] = None):
        super().__init__(message, status_code=502, detail=detail)


class RateLimitError(CustomException):
    """Raised when rate limits are exceeded."""
    
    def __init__(self, message: str = "Rate limit exceeded", detail: Optional[str] = None):
        super().__init__(message, status_code=429, detail=detail)