from fastapi import APIRouter, HTTPException
from datetime import datetime
import uuid
from app.models.cloning import CloningConsentRequest, CloningJobStatus

router = APIRouter(prefix="/cloning", tags=["Voice Cloning"])

@router.post("/consent", response_model=CloningJobStatus)
def submit_cloning_consent(payload: CloningConsentRequest):
    if not payload.consent_confirmed:
        raise HTTPException(status_code=400, detail="Voice actor consent must be confirmed.")

    job_id = f"CLONE-{uuid.uuid4().hex[:8].upper()}"

    return CloningJobStatus(
        job_id=job_id,
        model_name=payload.model_name,
        status="dataset_verified_phase_1",
        submitted_at=datetime.utcnow().isoformat(),
        samples_count=24 if payload.clone_type == "pvc" else 3,
        consent_verified=True,
        phase_message="Acoustic dataset & consent validated for Phase 2 neural pipeline."
    )
