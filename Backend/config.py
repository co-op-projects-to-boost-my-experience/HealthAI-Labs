# config.py
import os
import secrets
from typing import Optional
from pydantic import BaseSettings, Field, validator
from pydantic.networks import PostgresDsn
import warnings

class Settings(BaseSettings):
    """Application settings with validation"""
    
    # API Settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "HealthAI"
    
    # Security
    JWT_SECRET_KEY: str = Field(
        default_factory=lambda: secrets.token_hex(32),
        description="JWT signing key (min 32 chars)",
        min_length=32
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: PostgresDsn = Field(
        ...,
        description="PostgreSQL connection URL"
    )
    
    # Google OAuth
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    
    # News API
    GNEWS_API_KEY: Optional[str] = None
    
    # MinIO Configuration
    MINIO_ENDPOINT: str = Field("minio:9000", description="MinIO server endpoint")
    MINIO_ACCESS_KEY: Optional[str] = None
    MINIO_SECRET_KEY: Optional[str] = None
    MINIO_SECURE: bool = False
    MINIO_BUCKET_NAME: str = "healthai"

    # File Upload
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_EXTENSIONS: set = {".jpg", ".jpeg", ".png", ".csv"}
    UPLOAD_DIR: str = "/app/uploads"

    # CORS
    BACKEND_CORS_ORIGINS: list = Field(
        default=["http://localhost", "http://localhost:3000"],
        description="Allowed CORS origins"
    )

    # Model Paths
    MRI_MODEL_DIR: str = "/app/MRI"
    CKD_MODEL_DIR: str = "/app/CKD"
    CKD_SCALER_PATH: str = "/app/CKD/data_scaler.joblib"
    CKD_DIAGNOSIS_PATH: str = "/app/CKD/ckd_diagnosis_model.joblib"
    CKD_STAGE_PATH: str = "/app/CKD/ckd_stage_model.joblib"

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "/app/logs/healthai.log"

    @validator("JWT_SECRET_KEY")
    def validate_jwt_secret(cls, v):
        if v in ["changeme", "your-secret-key-change-in-production", 
                "changeme-generate-with-openssl-rand-hex-32"]:
            warnings.warn(
                "Using default JWT secret key! This is insecure for production!",
                UserWarning,
                stacklevel=2
            )
        return v
  
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        env_file_encoding = 'utf-8'


# Global settings instance
settings = Settings()

# Validate critical settings
if settings.JWT_SECRET_KEY.startswith("changeme"):
    import sys
    print("ERROR: Invalid JWT secret key. Set JWT_SECRET_KEY environment variable.", file=sys.stderr)
    sys.exit(1)
