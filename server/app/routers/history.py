from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from app.models.history import HistoryItemResponse, HistoryItemCreate

router = APIRouter(prefix="/history", tags=["History"])

MOCK_HISTORY_DB = [
    {
        "id": "hist-01",
        "title": "Q3 Earnings Keynote Opening Statement",
        "text_snippet": "Good morning shareholders and partners. Today, we present our third-quarter operational milestones.",
        "voice_id": "v-marcus",
        "voice_name": "Marcus Sterling",
        "duration": 38.4,
        "format": "WAV",
        "sample_rate": 48000,
        "file_size": 3420000,
        "speed": 1.0,
        "pitch": 0.0,
        "emotion": "authoritative",
        "created_at": "2026-11-07T18:42:00Z"
    }
]

@router.get("", response_model=List[HistoryItemResponse])
def get_history():
    return MOCK_HISTORY_DB

@router.post("", response_model=HistoryItemResponse)
def add_history(item: HistoryItemCreate):
    new_entry = {
        "id": f"hist-{int(datetime.utcnow().timestamp())}",
        "title": item.title,
        "text_snippet": item.text_snippet,
        "voice_id": item.voice_id,
        "voice_name": item.voice_name,
        "duration": item.duration,
        "format": item.format,
        "sample_rate": item.sample_rate,
        "file_size": item.file_size or int(item.duration * 88200),
        "speed": item.speed,
        "pitch": item.pitch,
        "emotion": item.emotion,
        "created_at": datetime.utcnow().isoformat()
    }
    MOCK_HISTORY_DB.insert(0, new_entry)
    return new_entry

@router.delete("/{item_id}")
def delete_history_item(item_id: str):
    global MOCK_HISTORY_DB
    MOCK_HISTORY_DB = [h for h in MOCK_HISTORY_DB if h["id"] != item_id]
    return {"message": f"History item {item_id} deleted"}
