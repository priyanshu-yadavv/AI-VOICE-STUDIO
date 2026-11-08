from typing import Optional, List
from pydantic import BaseModel, Field

class CloningConsentRequest(BaseModel):
    model_name: str
    voice_actor_name: str
    consent_confirmed: bool
    statement_hash: Optional[str] = None
    clone_type: str = Field(default="pvc", description="ivc or pvc")

class CloningJobStatus(BaseModel):
    job_id: str
    model_name: str
    status: str = "dataset_verified_phase_1"
    submitted_at: str
    samples_count: int
    consent_verified: bool
    phase_message: str = "Acoustic dataset & consent validated for Phase 2 neural pipeline."
