from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime
from app.models.voice import VoiceResponse, VoiceCreate, VoiceUpdate

router = APIRouter(prefix="/voices", tags=["Voices"])

# In-memory mock voices scaffold database
MOCK_VOICES_DB = [
    {
        "id": "v-evelyn",
        "name": "Evelyn Harper",
        "gender": "female",
        "accent": "British (RP)",
        "language": "English",
        "language_code": "en-GB",
        "style": "Narrative & Warm",
        "category": "Narrative",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        "description": "Refined, articulate British voice with velvety cadence.",
        "preview_text": "In the quiet stillness of the evening, the library held secrets that time itself had long forgotten.",
        "sample_duration": 4.8,
        "tags": ["Audiobook", "Luxury", "Calm"],
        "is_custom": False,
        "is_favorite": True,
        "popularity": 98,
        "created_at": "2026-09-01T00:00:00Z"
    },
    {
        "id": "v-marcus",
        "name": "Marcus Sterling",
        "gender": "male",
        "accent": "American (General)",
        "language": "English",
        "language_code": "en-US",
        "style": "Deep & Authoritative",
        "category": "Corporate",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        "description": "Resonant, baritone American voice carrying confidence and trust.",
        "preview_text": "Building scalable infrastructure requires both strategic foresight and relentless attention to engineering fundamentals.",
        "sample_duration": 5.2,
        "tags": ["Keynote", "Commercial", "Deep"],
        "is_custom": False,
        "is_favorite": True,
        "popularity": 95,
        "created_at": "2026-09-01T00:00:00Z"
    }
]

@router.get("", response_model=List[VoiceResponse])
def get_voices():
    return MOCK_VOICES_DB

@router.get("/{voice_id}", response_model=VoiceResponse)
def get_voice(voice_id: str):
    voice = next((v for v in MOCK_VOICES_DB if v["id"] == voice_id), None)
    if not voice:
        raise HTTPException(status_code=404, detail="Voice not found")
    return voice

@router.post("", response_model=VoiceResponse, status_code=status.HTTP_201_CREATED)
def create_voice(payload: VoiceCreate):
    new_id = f"v-custom-{int(datetime.utcnow().timestamp())}"
    new_voice = {
        "id": new_id,
        "name": payload.name,
        "gender": payload.gender,
        "accent": payload.accent,
        "language": payload.language,
        "language_code": payload.language_code,
        "style": payload.style or "Conversational",
        "category": payload.category or "Custom Clone",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        "description": payload.description or f"Custom voice profile added via {payload.source_method}",
        "preview_text": payload.description or f"Hello, this is a custom preview for {payload.name}.",
        "sample_duration": 4.5,
        "tags": payload.tags or ["Custom", "Phase 1"],
        "is_custom": True,
        "is_favorite": False,
        "popularity": 70,
        "created_at": datetime.utcnow().isoformat()
    }
    MOCK_VOICES_DB.insert(0, new_voice)
    return new_voice

@router.delete("/{voice_id}")
def delete_voice(voice_id: str):
    global MOCK_VOICES_DB
    existing = next((v for v in MOCK_VOICES_DB if v["id"] == voice_id), None)
    if not existing:
        raise HTTPException(status_code=404, detail="Voice not found")
    if not existing.get("is_custom"):
        raise HTTPException(status_code=400, detail="Cannot delete built-in studio preset voice")
    MOCK_VOICES_DB = [v for v in MOCK_VOICES_DB if v["id"] != voice_id]
    return {"message": f"Voice {voice_id} deleted successfully"}
