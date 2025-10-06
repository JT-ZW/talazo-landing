"""
Security and Authentication Module

This module handles JWT token validation, user authentication,
and authorization for the Talazo intelligence platform.
"""

import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import structlog

from app.config import settings
from app.core.exceptions import AuthenticationError, AuthorizationError

logger = structlog.get_logger()

# Security scheme for FastAPI docs
security = HTTPBearer()


class SecurityService:
    """Handles authentication and authorization."""
    
    def __init__(self):
        self.secret_key = settings.JWT_SECRET_KEY
        self.algorithm = settings.JWT_ALGORITHM
        self.access_token_expire_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES
    
    def create_access_token(
        self, 
        data: Dict[str, Any], 
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """
        Create a JWT access token.
        
        Args:
            data: Data to encode in the token
            expires_delta: Token expiration time
            
        Returns:
            Encoded JWT token
        """
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def verify_token(self, token: str) -> Dict[str, Any]:
        """
        Verify and decode a JWT token.
        
        Args:
            token: JWT token to verify
            
        Returns:
            Decoded token payload
            
        Raises:
            AuthenticationError: If token is invalid or expired
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            
            # Check if token is expired
            exp = payload.get("exp")
            if exp and datetime.utcnow() > datetime.fromtimestamp(exp):
                raise AuthenticationError("Token has expired")
            
            return payload
            
        except jwt.ExpiredSignatureError:
            raise AuthenticationError("Token has expired")
        except jwt.InvalidTokenError:
            raise AuthenticationError("Invalid token")
    
    def extract_user_id(self, token: str) -> str:
        """
        Extract user ID from JWT token.
        
        Args:
            token: JWT token
            
        Returns:
            User ID from token
        """
        payload = self.verify_token(token)
        user_id = payload.get("sub")
        
        if not user_id:
            raise AuthenticationError("Token does not contain user ID")
        
        return user_id
    
    def extract_user_role(self, token: str) -> str:
        """
        Extract user role from JWT token.
        
        Args:
            token: JWT token
            
        Returns:
            User role from token
        """
        payload = self.verify_token(token)
        role = payload.get("role", "farmer")  # Default to farmer role
        
        return role
    
    def check_admin_permission(self, token: str) -> bool:
        """
        Check if user has admin permissions.
        
        Args:
            token: JWT token
            
        Returns:
            True if user is admin
        """
        role = self.extract_user_role(token)
        return role in ["admin", "super_admin"]
    
    def check_analyst_permission(self, token: str) -> bool:
        """
        Check if user has analyst permissions.
        
        Args:
            token: JWT token
            
        Returns:
            True if user is analyst or admin
        """
        role = self.extract_user_role(token)
        return role in ["analyst", "admin", "super_admin"]


# Global security service instance
security_service = SecurityService()


# Dependency functions for FastAPI

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Dict[str, Any]:
    """
    FastAPI dependency to get current authenticated user.
    
    Args:
        credentials: HTTP authorization credentials
        
    Returns:
        User information from token
        
    Raises:
        HTTPException: If authentication fails
    """
    try:
        token = credentials.credentials
        payload = security_service.verify_token(token)
        
        user_id = payload.get("sub")
        if not user_id:
            raise AuthenticationError("Token does not contain user ID")
        
        return {
            "user_id": user_id,
            "email": payload.get("email"),
            "role": payload.get("role", "farmer"),
            "exp": payload.get("exp")
        }
        
    except AuthenticationError as e:
        logger.warning("Authentication failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_admin_user(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    FastAPI dependency to ensure current user is admin.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Admin user information
        
    Raises:
        HTTPException: If user is not admin
    """
    role = current_user.get("role")
    if role not in ["admin", "super_admin"]:
        logger.warning(
            "Access denied - admin required", 
            user_id=current_user.get("user_id"),
            role=role
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    return current_user


async def get_current_analyst_user(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    FastAPI dependency to ensure current user is analyst or admin.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Analyst/admin user information
        
    Raises:
        HTTPException: If user is not analyst or admin
    """
    role = current_user.get("role")
    if role not in ["analyst", "admin", "super_admin"]:
        logger.warning(
            "Access denied - analyst required", 
            user_id=current_user.get("user_id"),
            role=role
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Analyst or admin access required"
        )
    
    return current_user


# Utility functions

def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password
    """
    import bcrypt
    
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.
    
    Args:
        password: Plain text password
        hashed_password: Hashed password
        
    Returns:
        True if password matches
    """
    import bcrypt
    
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
        """Decorator to require specific role."""
        def role_checker(current_user: Dict[str, Any]) -> Dict[str, Any]:
            user_roles = current_user.get("roles", [])
            if required_role not in user_roles:
                raise AuthorizationError(f"Role '{required_role}' required")
            return current_user
        return role_checker


# Global security manager
security_manager = SecurityManager()


# FastAPI dependencies
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> Dict[str, Any]:
    """FastAPI dependency for getting current user."""
    return security_manager.get_current_user(credentials)


def get_admin_user(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """FastAPI dependency for admin users."""
    return security_manager.require_admin(current_user)


def require_role(role: str):
    """FastAPI dependency factory for role-based access."""
    def role_dependency(
        current_user: Dict[str, Any] = Depends(get_current_user)
    ) -> Dict[str, Any]:
        return security_manager.require_role(role)(current_user)
    return role_dependency