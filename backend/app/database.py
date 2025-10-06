"""
Database configuration and connection management.

This module handles database connections, session management, and provides
the base classes for all database models.
"""

from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import asyncpg
from typing import AsyncGenerator
from app.config import settings

# SQLAlchemy setup for synchronous operations
engine = create_engine(
    settings.DATABASE_URL,
    poolclass=StaticPool,
    pool_pre_ping=True,
    echo=settings.DEBUG
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all models
Base = declarative_base()

# Metadata for database operations
metadata = MetaData()


class DatabaseManager:
    """Database connection and session management."""
    
    def __init__(self):
        self.engine = engine
        self.SessionLocal = SessionLocal
    
    def get_db(self):
        """Get database session for dependency injection."""
        db = self.SessionLocal()
        try:
            yield db
        finally:
            db.close()
    
    async def get_async_connection(self) -> AsyncGenerator[asyncpg.Connection, None]:
        """Get async database connection for complex queries."""
        conn = await asyncpg.connect(settings.DATABASE_URL)
        try:
            yield conn
        finally:
            await conn.close()
    
    def create_tables(self):
        """Create all tables in the database."""
        Base.metadata.create_all(bind=self.engine)
    
    def drop_tables(self):
        """Drop all tables in the database."""
        Base.metadata.drop_all(bind=self.engine)


# Global database manager instance
db_manager = DatabaseManager()

# Dependency for FastAPI
def get_database() -> SessionLocal:
    """Database dependency for FastAPI routes."""
    return db_manager.get_db()


# Supabase client setup
from supabase import create_client, Client

def get_supabase_client() -> Client:
    """Get Supabase client for direct operations."""
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

# Global Supabase client
supabase: Client = get_supabase_client()