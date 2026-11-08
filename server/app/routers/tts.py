from fastapi import APIRouter
from datetime import datetime
import uuid
from app.models.tts import TTSGenerateRequest, TTSGenerateResponse

router = APIRouter(prefix="/tts", tags=["TTS"])

@router.post("/generate", response_model=TTSGenerateResponse)
def generate_speech(payload: TTSGenerateRequest):
    # Calculate mock duration based on text length and speed
    words = len(payload.text.split())
    duration = max(2.5, round((words / (140 * payload.speed)) * 60, 2))

    task_id = f"task_{uuid.uuid4().hex[:12]}"

    return TTSGenerateResponse(
        task_id=task_id,
        status="completed",
        voice_id=payload.voice_id,
        voice_name="Selected Voice Profile",
        duration_seconds=duration,
        characters_processed=len(payload.text),
        format=payload.format,
        sample_rate=payload.sample_rate,
        audio_url=f"/api/audio/stream/{task_id}.{payload.format.lower()}",
        created_at=datetime.utcnow().isoformat(),
        message="Phase 1 Scaffold synthesis response. In Phase 2, backend neural weights will generate audio stream."
    )
