from typing import Optional
from pydantic import BaseModel

class HistoryItemBase(BaseModel):
    title: str
    text_snippet: str
    voice_id: str
    voice_name: str
    duration: float
    format: str = "WAV"
    sample_rate: int = 48000
    file_size: Optional[int] = 0
    speed: Optional[float] = 1.0
    pitch: Optional[float] = 0.0
    emotion: Optional[str] = "neutral"

class HistoryItemCreate(HistoryItemBase):
    pass

class HistoryItemResponse(HistoryItemBase):
    id: str
    created_at: str
