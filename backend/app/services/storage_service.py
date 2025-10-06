"""
Storage Service

This module handles file storage operations for images, reports,
and generated visualizations using Supabase Storage or AWS S3.
"""

import os
import asyncio
import aiofiles
from pathlib import Path
from typing import Optional, Dict, Any, List
from urllib.parse import urlparse
import boto3
from botocore.exceptions import ClientError
import structlog

from app.config import settings
from app.database import supabase
from app.core.exceptions import StorageError

logger = structlog.get_logger()


class StorageService:
    """Handles file storage operations."""
    
    def __init__(self):
        self.provider = settings.STORAGE_PROVIDER
        self.bucket_name = settings.SUPABASE_STORAGE_BUCKET
        
        # Initialize S3 client if using AWS
        if self.provider == "s3":
            self.s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION
            )
            self.bucket_name = settings.AWS_S3_BUCKET
        else:
            self.s3_client = None
    
    async def upload_file(
        self, 
        file_path: Path, 
        storage_path: str, 
        content_type: Optional[str] = None
    ) -> str:
        """
        Upload a file to storage.
        
        Args:
            file_path: Local path to the file
            storage_path: Path in storage (without bucket name)
            content_type: MIME type of the file
            
        Returns:
            Public URL of the uploaded file
        """
        try:
            if not file_path.exists():
                raise StorageError(f"File not found: {file_path}")
            
            if self.provider == "supabase":
                return await self._upload_to_supabase(file_path, storage_path, content_type)
            elif self.provider == "s3":
                return await self._upload_to_s3(file_path, storage_path, content_type)
            else:
                raise StorageError(f"Unsupported storage provider: {self.provider}")
                
        except Exception as e:
            logger.error("File upload failed", error=str(e), file_path=str(file_path))
            raise StorageError(f"Failed to upload file: {str(e)}")
    
    async def _upload_to_supabase(
        self, 
        file_path: Path, 
        storage_path: str, 
        content_type: Optional[str]
    ) -> str:
        """Upload file to Supabase Storage."""
        try:
            # Read file content
            async with aiofiles.open(file_path, 'rb') as f:
                file_content = await f.read()
            
            # Upload to Supabase
            result = supabase.storage.from_(self.bucket_name).upload(
                path=storage_path,
                file=file_content,
                file_options={
                    "content-type": content_type or "application/octet-stream",
                    "upsert": True
                }
            )
            
            if result.get("error"):
                raise StorageError(f"Supabase upload error: {result['error']}")
            
            # Get public URL
            public_url = supabase.storage.from_(self.bucket_name).get_public_url(storage_path)
            
            logger.info(
                "File uploaded to Supabase",
                storage_path=storage_path,
                file_size=file_path.stat().st_size,
                url=public_url
            )
            
            return public_url
            
        except Exception as e:
            raise StorageError(f"Supabase upload failed: {str(e)}")
    
    async def _upload_to_s3(
        self, 
        file_path: Path, 
        storage_path: str, 
        content_type: Optional[str]
    ) -> str:
        """Upload file to AWS S3."""
        try:
            extra_args = {}
            if content_type:
                extra_args['ContentType'] = content_type
            
            # Upload file
            self.s3_client.upload_file(
                str(file_path),
                self.bucket_name,
                storage_path,
                ExtraArgs=extra_args
            )
            
            # Generate public URL
            url = f"https://{self.bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/{storage_path}"
            
            logger.info(
                "File uploaded to S3",
                storage_path=storage_path,
                file_size=file_path.stat().st_size,
                url=url
            )
            
            return url
            
        except ClientError as e:
            raise StorageError(f"S3 upload failed: {str(e)}")
    
    async def download_file(self, url: str, local_path: Path) -> Path:
        """
        Download a file from storage to local path.
        
        Args:
            url: URL of the file to download
            local_path: Local path to save the file
            
        Returns:
            Path to the downloaded file
        """
        try:
            # Ensure directory exists
            local_path.parent.mkdir(parents=True, exist_ok=True)
            
            if self.provider == "supabase":
                return await self._download_from_supabase(url, local_path)
            elif self.provider == "s3":
                return await self._download_from_s3(url, local_path)
            else:
                raise StorageError(f"Unsupported storage provider: {self.provider}")
                
        except Exception as e:
            logger.error("File download failed", error=str(e), url=url)
            raise StorageError(f"Failed to download file: {str(e)}")
    
    async def _download_from_supabase(self, url: str, local_path: Path) -> Path:
        """Download file from Supabase Storage."""
        try:
            # Extract storage path from URL
            parsed_url = urlparse(url)
            storage_path = parsed_url.path.split(f'/{self.bucket_name}/')[-1]
            
            # Download from Supabase
            result = supabase.storage.from_(self.bucket_name).download(storage_path)
            
            if isinstance(result, dict) and result.get("error"):
                raise StorageError(f"Supabase download error: {result['error']}")
            
            # Write to local file
            async with aiofiles.open(local_path, 'wb') as f:
                await f.write(result)
            
            logger.info("File downloaded from Supabase", local_path=str(local_path))
            return local_path
            
        except Exception as e:
            raise StorageError(f"Supabase download failed: {str(e)}")
    
    async def _download_from_s3(self, url: str, local_path: Path) -> Path:
        """Download file from AWS S3."""
        try:
            # Extract storage path from URL
            parsed_url = urlparse(url)
            storage_path = parsed_url.path.lstrip('/')
            
            # Download from S3
            self.s3_client.download_file(
                self.bucket_name,
                storage_path,
                str(local_path)
            )
            
            logger.info("File downloaded from S3", local_path=str(local_path))
            return local_path
            
        except ClientError as e:
            raise StorageError(f"S3 download failed: {str(e)}")
    
    async def delete_file(self, url: str) -> bool:
        """
        Delete a file from storage.
        
        Args:
            url: URL of the file to delete
            
        Returns:
            True if successful, False otherwise
        """
        try:
            if self.provider == "supabase":
                return await self._delete_from_supabase(url)
            elif self.provider == "s3":
                return await self._delete_from_s3(url)
            else:
                raise StorageError(f"Unsupported storage provider: {self.provider}")
                
        except Exception as e:
            logger.error("File deletion failed", error=str(e), url=url)
            return False
    
    async def _delete_from_supabase(self, url: str) -> bool:
        """Delete file from Supabase Storage."""
        try:
            parsed_url = urlparse(url)
            storage_path = parsed_url.path.split(f'/{self.bucket_name}/')[-1]
            
            result = supabase.storage.from_(self.bucket_name).remove([storage_path])
            
            if result.get("error"):
                logger.error("Supabase deletion error", error=result["error"])
                return False
            
            logger.info("File deleted from Supabase", storage_path=storage_path)
            return True
            
        except Exception as e:
            logger.error("Supabase deletion failed", error=str(e))
            return False
    
    async def _delete_from_s3(self, url: str) -> bool:
        """Delete file from AWS S3."""
        try:
            parsed_url = urlparse(url)
            storage_path = parsed_url.path.lstrip('/')
            
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=storage_path
            )
            
            logger.info("File deleted from S3", storage_path=storage_path)
            return True
            
        except ClientError as e:
            logger.error("S3 deletion failed", error=str(e))
            return False
    
    async def list_files(self, prefix: str = "") -> List[Dict[str, Any]]:
        """
        List files in storage with optional prefix filter.
        
        Args:
            prefix: Prefix to filter files
            
        Returns:
            List of file information dictionaries
        """
        try:
            if self.provider == "supabase":
                return await self._list_supabase_files(prefix)
            elif self.provider == "s3":
                return await self._list_s3_files(prefix)
            else:
                raise StorageError(f"Unsupported storage provider: {self.provider}")
                
        except Exception as e:
            logger.error("File listing failed", error=str(e))
            raise StorageError(f"Failed to list files: {str(e)}")
    
    async def _list_supabase_files(self, prefix: str) -> List[Dict[str, Any]]:
        """List files from Supabase Storage."""
        try:
            result = supabase.storage.from_(self.bucket_name).list(
                path=prefix,
                limit=1000
            )
            
            if isinstance(result, dict) and result.get("error"):
                raise StorageError(f"Supabase list error: {result['error']}")
            
            files = []
            for item in result:
                if item.get("name"):
                    files.append({
                        "name": item["name"],
                        "size": item.get("metadata", {}).get("size", 0),
                        "last_modified": item.get("updated_at"),
                        "url": supabase.storage.from_(self.bucket_name).get_public_url(
                            f"{prefix}/{item['name']}" if prefix else item["name"]
                        )
                    })
            
            return files
            
        except Exception as e:
            raise StorageError(f"Supabase file listing failed: {str(e)}")
    
    async def _list_s3_files(self, prefix: str) -> List[Dict[str, Any]]:
        """List files from AWS S3."""
        try:
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix,
                MaxKeys=1000
            )
            
            files = []
            for item in response.get("Contents", []):
                key = item["Key"]
                files.append({
                    "name": os.path.basename(key),
                    "size": item["Size"],
                    "last_modified": item["LastModified"].isoformat(),
                    "url": f"https://{self.bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"
                })
            
            return files
            
        except ClientError as e:
            raise StorageError(f"S3 file listing failed: {str(e)}")
    
    async def generate_presigned_url(
        self, 
        storage_path: str, 
        expiration: int = 3600,
        operation: str = "get"
    ) -> str:
        """
        Generate a presigned URL for file access.
        
        Args:
            storage_path: Path in storage
            expiration: URL expiration time in seconds
            operation: Operation type ('get' or 'put')
            
        Returns:
            Presigned URL
        """
        try:
            if self.provider == "s3":
                method = "get_object" if operation == "get" else "put_object"
                url = self.s3_client.generate_presigned_url(
                    method,
                    Params={"Bucket": self.bucket_name, "Key": storage_path},
                    ExpiresIn=expiration
                )
                return url
            else:
                # Supabase uses permanent URLs with auth
                return supabase.storage.from_(self.bucket_name).get_public_url(storage_path)
                
        except Exception as e:
            logger.error("Presigned URL generation failed", error=str(e))
            raise StorageError(f"Failed to generate presigned URL: {str(e)}")
    
    def get_file_info(self, url: str) -> Dict[str, Any]:
        """
        Get file information from URL.
        
        Args:
            url: File URL
            
        Returns:
            File information dictionary
        """
        parsed_url = urlparse(url)
        filename = os.path.basename(parsed_url.path)
        
        return {
            "filename": filename,
            "url": url,
            "provider": self.provider,
            "bucket": self.bucket_name
        }