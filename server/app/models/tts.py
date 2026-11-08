from typing import Optional
from pydantic import BaseModel, Field

class TTSGenerateRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    voice_id: str
    language: str = "en-US"
    speed: float = Field(default=1.0, ge=0.5, le=2.0)
    pitch: float = Field(default=0.0, ge=-50.0, le=50.0)
    emotion: str = "neutral"
    format: str = "WAV"
    sample_rate: int = 48000

class TTSGenerateResponse(BaseModel):
    task_id: str
    status: str
    voice_id: str
    voice_name: str
    duration_seconds: float
    characters_processed: int
    format: str
    sample_rate: int
    audio_url: Optional[str] = None
    created_at: str
    message: str = "Phase 1 Scaffold synthesis response. Neural backend will generate real weights in Phase 2."
