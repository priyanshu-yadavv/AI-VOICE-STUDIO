# AI Voice Studio — FastAPI Backend Scaffold

This directory provides the Python FastAPI backend scaffold for **AI Voice Studio** (Phase 1: Foundation & Scaffold).

## Architecture

- `app/main.py`: Main FastAPI application, middleware, router orchestration
- `app/config.py`: Environment configurations and CORS policies
- `app/models/`: Pydantic schemas for Voices, Text-to-Speech requests, Cloning consent, and History
- `app/routers/`:
  - `/api/health`: Healthcheck & version status
  - `/api/voices`: Voice catalog, profile additions, and deletions
  - `/api/tts`: Text-to-speech generation task management
  - `/api/cloning`: Voice actor consent declaration and dataset quality preparation
  - `/api/history`: Saved audio exports and generation history

## How to Run

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Run the server using `uvicorn`:
   ```bash
   python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

3. Explore interactive Swagger documentation:
   - OpenAPI Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
   - ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
