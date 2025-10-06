"""
API dependencies and shared utilities.

This module provides common dependencies used across API routes.
"""

from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import structlog

from app.database import get_database
from app.core.security import get_current_user, security_manager
from app.core.exceptions import AuthenticationError, AuthorizationError

logger = structlog.get_logger()


# Database dependency
def get_db() -> Session:
    """Get database session."""
    return next(get_database())


# Authentication dependencies
async def get_current_user_optional(
    request: Request,
) -> Optional[Dict[str, Any]]:
    """Get current user if authenticated, None otherwise."""
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None
        
        token = auth_header.split(" ")[1]
        user = security_manager.verify_token(token)
        return user
    except Exception:
        return None


async def get_current_user_required(
    credentials: HTTPAuthorizationCredentials = Depends(security_manager.security)
) -> Dict[str, Any]:
    """Get current user, raise exception if not authenticated."""
    try:
        return await security_manager.get_current_user(credentials)
    except AuthenticationError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_admin_user(
    current_user: Dict[str, Any] = Depends(get_current_user_required)
) -> Dict[str, Any]:
    """Get current user and verify admin privileges."""
    try:
        return security_manager.require_admin(current_user)
    except AuthorizationError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )


# Pagination dependencies
class PaginationParams:
    """Pagination parameters."""
    
    def __init__(self, page: int = 1, size: int = 20):
        self.page = max(1, page)
        self.size = min(max(1, size), 100)  # Limit page size
        self.offset = (self.page - 1) * self.size
        self.limit = self.size


def get_pagination(page: int = 1, size: int = 20) -> PaginationParams:
    """Get pagination parameters."""
    return PaginationParams(page, size)


# Request logging middleware
async def log_request_info(request: Request) -> None:
    """Log request information for debugging."""
    logger.info(
        "API request",
        method=request.method,
        url=str(request.url),
        client_ip=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )