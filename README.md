# AI Voice Studio — Phase 1: Foundation & UI Development

A modern, high-fidelity AI Text-to-Speech web studio built with React, Vite, Tailwind CSS, and a Python FastAPI backend scaffold.

Designed with an elegant, warm neutral aesthetic (cream, beige, white, soft grey, warm terracotta accents) suited for premium creative workflows, audio production, and voiceover engineering.

---

## Architecture Overview

```
AI-VOICE-STUDIO/
├── client/                     # Frontend Application (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── audio/          # GlobalAudioPlayer, WaveformVisualizer
│   │   │   ├── common/         # Badge, Button, Card, Modal, EmptyState
│   │   │   ├── layout/         # Layout, Navbar, Sidebar
│   │   │   └── voice/          # VoiceCard
│   │   ├── context/            # AudioContext, VoiceContext, HistoryContext, ToastContext
│   │   ├── data/               # mockVoices, mockHistory, mockStats
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TextToVoice.jsx
│   │   │   ├── VoiceLibrary.jsx
│   │   │   ├── AddCustomVoice.jsx
│   │   │   ├── VoiceCloning.jsx
│   │   │   ├── AudioHistory.jsx
│   │   │   └── Settings.jsx
│   │   ├── utils/              # audioHelpers (Web Audio & Speech API), formatters
│   │   ├── App.jsx             # React Router 6 Navigation Setup
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js      # Warm neutral palette & studio tokens
│   ├── vite.config.js          # Vite config with /api proxy to FastAPI
│   └── package.json
│
└── server/                     # Backend Scaffold (Python FastAPI)
    ├── app/
    │   ├── models/             # Pydantic schemas (voice, tts, history, cloning)
    │   ├── routers/            # /api/health, /api/voices, /api/tts, /api/cloning, /api/history
    │   ├── config.py
    │   └── main.py
    ├── requirements.txt
    └── README.md
```

---

## Features Implemented in Phase 1

### 1. Dashboard (`/`)
- **Welcome & Hero Section**: Studio summary, quick start actions, and Phase 1 badge.
- **Usage Statistics**: Interactive quota cards for character quota (84.2k/100k), generated hours (18.4 hrs), active voice profiles, and storage.
- **Quick Text-to-Speech**: Instant speech generator card allowing rapid script typing, voice selection, synthesis, and live playback.
- **Recent Audio**: Streamlined list of recently generated tracks with play/pause and instant download.
- **Featured Voice Profiles**: Curated voice personas with sample audio previews.

### 2. Text to Voice Studio (`/text-to-voice`)
- **Large Script Editor**: Character counter, word count, estimated duration calculator, clear, copy, and quick template prompts (Audiobook, Tech Keynote, SaaS Onboarding, Meditation).
- **Acoustic Tuning Controls**:
  - Speaking Speed slider (0.5x to 2.0x)
  - Pitch Shift slider (-50% to +50%)
  - Emotion & Style selector (Neutral, Cheerful, Authoritative, Dramatic, Whispering, Storyteller, Empathetic)
  - Multi-lingual selection (English US/UK/AU/IN, Spanish, French, German, Japanese, Portuguese, Italian)
  - Export Format (WAV, MP3) and Sampling Rate (44.1 kHz, 48 kHz Studio)
- **Voice Selection Panel**: Real-time search, gender filter chips (All, Female, Male), and instant sample previews.
- **Master Audio Preview & Export Player**: Interactive scrubbable waveform visualizer, play/pause, timecode, and WAV/MP3 direct downloads.

### 3. Voice Profile Library (`/voice-library`)
- **Catalog of Voices**: Built-in Studio Presets and Custom Created Voices.
- **Multi-dimensional Filtering**: Search by name/accent/description, gender filter, category pills (Narrative, Conversational, Corporate, Audiobook, Meditation, E-Learning, Commercial, Custom Clone).
- **Favorites & Custom Toggles**: Fast access to favorite voices or custom models.
- **Custom Profile Management**: Edit voice modal and delete confirmation modal for custom profiles.
- **Empty States**: Friendly empty state when search filters return zero results with one-click filter reset.

### 4. Add Custom Voice (`/add-custom-voice`)
- **Three Input Methods**:
  1. **Audio File Upload**: Drag-and-drop zone supporting MP3, WAV, M4A, OGG up to 25 MB with format validation, error alerts, and waveform visualization of uploaded audio.
  2. **Microphone Recording**: In-browser microphone capture using `MediaRecorder`, live VU level simulation meter, elapsed recording timer, audio playback preview, and re-record options.
  3. **External Voice ID Import**: Link voice IDs from ElevenLabs, Cartesia, or Play.ht with mock schema verification.
- **Metadata Configuration**: Voice name, gender, language, accent/dialect, style tag, and notes.
- **Persistent Storage**: Newly created voices are automatically persisted in `localStorage` and made available throughout the studio (Dashboard, Voice Library, and Text to Voice).

### 5. Voice Cloning Pipeline (`/voice-cloning`)
- **Pipeline Architecture**: Clear comparison between Instant Voice Cloning (zero-shot) and Professional Voice Cloning (full neural training).
- **Acoustic Quality Analysis Checklist**: Signal-to-Noise Ratio (SNR) background floor check (42 dB), dynamic range peak limiter, and phonetic monologue consistency.
- **Voice Actor Consent Verification**: Mandatory legal declaration and confirmation checkbox preventing unauthorized vocal imitation.
- **Phase 1 Transparency**: Clear disclosure that dataset preparation and consent are finalized in Phase 1, with GPU training clusters scheduled for Phase 2.

### 6. Audio History & Archive (`/audio-history`)
- **Dual View Modes**: Switch between List View and Grid View.
- **Search & Filters**: Search across script text, title, and voice persona; filter by format (WAV, MP3, All).
- **Audio Playback**: Inline play/pause with waveform scrubber.
- **Metadata**: Voice used, duration, file size, creation timestamp.
- **Track Actions**: Re-open script in Text to Voice editor, download audio file, delete single track, and batch clear all history.

### 7. Studio Settings & Backend Scaffold (`/settings`)
- **Studio Preferences**: Default voice persona, default language, export format, sampling frequency, auto-play preview toggle, and audio normalizer.
- **FastAPI Scaffold Monitor**: Live healthcheck ping to `/api/health`, endpoint directory map, and connection status.
- **Data Reset**: Ability to clear local storage and restore default studio state.
- **Security & Privacy**: Zero API keys exposed to frontend bundles.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### Running the Frontend
```bash
# Navigate to client directory
cd client

# Start Vite dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

To create an optimized production build:
```bash
npm run build
```

### Running the Backend Scaffold
```bash
# Navigate to server directory
cd server

# Run FastAPI with uvicorn
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive API Documentation will be available at:
- Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
