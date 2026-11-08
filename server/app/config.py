import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "AI Voice Studio API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    MAX_UPLOAD_SIZE_BYTES: int = 25 * 1024 * 1024 # 25 MB
    PHASE: str = "Phase 1: Foundation & Scaffold"

settings = Settings()
