from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import health, voices, tts, cloning, history

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Backend API scaffold for AI Voice Studio (Phase 1 Foundation)",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development scaffold allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(health.router, prefix="/api")
app.include_router(voices.router, prefix="/api")
app.include_router(tts.router, prefix="/api")
app.include_router(cloning.router, prefix="/api")
app.include_router(history.router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "AI Voice Studio API Scaffold (Phase 1)",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
