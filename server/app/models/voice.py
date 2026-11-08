from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime

class VoiceBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    gender: str = Field(default="neutral")
    accent: str = Field(default="American (General)")
    language: str = Field(default="English")
    language_code: str = Field(default="en-US")
    style: Optional[str] = "Conversational"
    category: Optional[str] = "General"
    description: Optional[str] = ""
    tags: List[str] = Field(default_factory=list)

class VoiceCreate(VoiceBase):
    source_method: str = Field(default="upload", description="upload, record, or external")
    source_file_name: Optional[str] = None
    external_provider: Optional[str] = None
    external_voice_id: Optional[str] = None

class VoiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    accent: Optional[str] = None
    style: Optional[str] = None
    is_favorite: Optional[bool] = None

class VoiceResponse(VoiceBase):
    id: str
    avatar: str
    preview_text: str
    sample_duration: float
    is_custom: bool
    is_favorite: bool
    popularity: int
    created_at: str

    class Config:
        from_attributes = True
