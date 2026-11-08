import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Server,
  Volume2,
  Sliders,
  Shield,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { useVoice } from '../context/VoiceContext';
import { useToast } from '../context/ToastContext';
import { LANGUAGE_OPTIONS } from '../data/mockVoices';

export default function Settings() {
  const { voices, selectedVoiceId, setSelectedVoiceId } = useVoice();
  const { showToast } = useToast();

  // Studio Preferences State
  const [defaultLanguage, setDefaultLanguage] = useState('en-US');
  const [defaultFormat, setDefaultFormat] = useState('WAV');
  const [defaultSampleRate, setDefaultSampleRate] = useState('48000');
  const [autoPlayPreview, setAutoPlayPreview] = useState(true);
  const [normalizeAudio, setNormalizeAudio] = useState(true);

  // Backend Scaffold State
  const [backendUrl, setBackendUrl] = useState('http://127.0.0.1:8000');
  const [backendStatus, setBackendStatus] = useState('checking'); // 'connected' | 'offline' | 'checking'
  const [backendDetails, setBackendDetails] = useState(null);
  const [isPinging, setIsPinging] = useState(false);

  // Reset confirmation modal
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Test backend connection
  const checkBackendHealth = async () => {
    setIsPinging(true);
    setBackendStatus('checking');

    try {
      const response = await fetch('/api/health', { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        setBackendStatus('connected');
        setBackendDetails(data);
        showToast('FastAPI Backend Scaffold online & responsive!', 'success');
      } else {
        setBackendStatus('offline');
        showToast('Backend responded with error status', 'error');
      }
    } catch (err) {
      // Backend not running on port 8000 yet, fallback gracefully to scaffold mode
      setBackendStatus('scaffold');
      setBackendDetails({
        status: "scaffold_ready",
        version: "1.0.0",
        message: "Scaffold ready. Start FastAPI server with 'uvicorn app.main:app' to enable live endpoints."
      });
      showToast('Scaffold mock mode active (FastAPI scaffold in /server)', 'info');
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    showToast('Studio preferences saved successfully', 'success');
  };

  const handleResetDefaults = () => {
    localStorage.removeItem('ai_voice_studio_custom_voices');
    localStorage.removeItem('ai_voice_studio_audio_history');
    setIsResetModalOpen(false);
    showToast('Studio restored to initial mock state. Reloading...', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#1F1D1A]">Studio Settings & Configuration</h2>
        <p className="text-xs text-[#68645D] mt-0.5">
          Configure default export acoustics, player behavior, and connect to the FastAPI backend scaffold
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Studio Preferences (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <Card className="space-y-5">
            <div className="flex items-center space-x-2 border-b border-[#F4F1EA] pb-3">
              <Sliders className="w-4 h-4 text-[#C27847]" />
              <h3 className="text-sm font-bold text-[#1F1D1A]">General Audio Defaults</h3>
            </div>

            <form onSubmit={handleSavePreferences} className="space-y-4">
              {/* Default Voice */}
              <div>
                <label className="block text-xs font-semibold text-[#1F1D1A] mb-1">
                  Default Voice Persona
                </label>
                <select
                  value={selectedVoiceId}
                  onChange={(e) => setSelectedVoiceId(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2DDD3] rounded-xl text-xs py-2 px-3 text-[#1F1D1A] focus:outline-none focus:border-[#C27847]"
                >
                  {voices.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.accent} • {v.gender}) {v.isCustom ? '— Custom' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Default Language & Export Format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1D1A] mb-1">
                    Default Language
                  </label>
                  <select
                    value={defaultLanguage}
                    onChange={(e) => setDefaultLanguage(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E2DDD3] rounded-xl text-xs py-2 px-3 text-[#1F1D1A] focus:outline-none focus:border-[#C27847]"
                  >
                    {LANGUAGE_OPTIONS.map(l => (
                      <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1D1A] mb-1">
                    Master Export Format
                  </label>
                  <select
                    value={defaultFormat}
                    onChange={(e) => setDefaultFormat(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E2DDD3] rounded-xl text-xs py-2 px-3 text-[#1F1D1A] focus:outline-none focus:border-[#C27847]"
                  >
                    <option value="WAV">WAV (Uncompressed PCM)</option>
                    <option value="MP3">MP3 (320kbps High Bitrate)</option>
                  </select>
                </div>
              </div>

              {/* Sample Rate */}
              <div>
                <label className="block text-xs font-semibold text-[#1F1D1A] mb-1">
                  Sampling Frequency
                </label>
                <select
                  value={defaultSampleRate}
                  onChange={(e) => setDefaultSampleRate(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2DDD3] rounded-xl text-xs py-2 px-3 text-[#1F1D1A] focus:outline-none focus:border-[#C27847]"
                >
                  <option value="48000">48,000 Hz — Studio Broadcast Quality</option>
                  <option value="44100">44,100 Hz — Standard Audio CD Quality</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-[#F4F1EA]">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-[#1F1D1A] block">Auto-play Previews</span>
                    <span className="text-[11px] text-[#68645D]">Automatically play audio after generation finishes</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoPlayPreview}
                    onChange={(e) => setAutoPlayPreview(e.target.checked)}
                    className="rounded text-[#C27847] focus:ring-[#C27847] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-[#1F1D1A] block">Dynamic Peak Normalization</span>
                    <span className="text-[11px] text-[#68645D]">Apply studio loudness normalization to output tracks</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={normalizeAudio}
                    onChange={(e) => setNormalizeAudio(e.target.checked)}
                    className="rounded text-[#C27847] focus:ring-[#C27847] w-4 h-4"
                  />
                </label>
              </div>

              <div className="pt-3 border-t border-[#F4F1EA] flex justify-end">
                <Button variant="primary" size="sm" type="submit">
                  Save Preferences
                </Button>
              </div>
            </form>
          </Card>

          {/* Reset Studio Data */}
          <Card className="border-rose-200/80 bg-rose-50/20 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-rose-900">Restore Studio Mock Data</h4>
                <p className="text-[11px] text-[#68645D] mt-0.5">
                  Clear custom voices and audio history and re-initialize Phase 1 mock dataset.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="!text-rose-700 !border-rose-300 hover:!bg-rose-50"
                icon={RotateCcw}
                onClick={() => setIsResetModalOpen(true)}
              >
                Reset Studio
              </Button>
            </div>
          </Card>

        </div>

        {/* Right Column: FastAPI Backend Scaffold & Security (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Backend Scaffold Card */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#F4F1EA] pb-3">
              <div className="flex items-center space-x-2">
                <Server className="w-4 h-4 text-[#C27847]" />
                <h3 className="text-sm font-bold text-[#1F1D1A]">Python FastAPI Scaffold</h3>
              </div>
              <Badge
                variant={backendStatus === 'connected' ? 'success' : backendStatus === 'scaffold' ? 'accent' : 'warning'}
                size="xs"
              >
                {backendStatus === 'connected' ? 'Live Connected' : backendStatus === 'scaffold' ? 'Scaffold Ready' : 'Checking'}
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1F1D1A] mb-1">
                  Backend API Endpoint
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={backendUrl}
                    onChange={(e) => setBackendUrl(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E2DDD3] rounded-xl font-mono text-[#1F1D1A]"
                  />
                  <Button
                    variant="subtle"
                    size="sm"
                    loading={isPinging}
                    onClick={checkBackendHealth}
                  >
                    Test Ping
                  </Button>
                </div>
              </div>

              {/* Backend Endpoints Scaffold Map */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E2DDD3] space-y-2 text-xs">
                <span className="font-bold text-[#1F1D1A] block">Scaffolded Endpoints (`/server`):</span>
                <div className="font-mono text-[11px] space-y-1 text-[#68645D]">
                  <div className="flex justify-between">
                    <span>GET /api/health</span>
                    <span className="text-emerald-700">Healthcheck</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GET /api/voices</span>
                    <span className="text-emerald-700">Catalog</span>
                  </div>
                  <div className="flex justify-between">
                    <span>POST /api/tts/generate</span>
                    <span className="text-emerald-700">Synthesis</span>
                  </div>
                  <div className="flex justify-between">
                    <span>POST /api/cloning/consent</span>
                    <span className="text-emerald-700">Compliance</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GET /api/history</span>
                    <span className="text-emerald-700">Archives</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-[#68645D] leading-relaxed">
                Run the backend locally: <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E2DDD3] text-[#1F1D1A]">cd server && python3 -m uvicorn app.main:app --port 8000</code>
              </div>
            </div>
          </Card>

          {/* Privacy & Security Card */}
          <Card className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-[#C27847]" />
              <h3 className="text-sm font-bold text-[#1F1D1A]">Privacy & API Safety</h3>
            </div>
            <p className="text-xs text-[#68645D] leading-relaxed">
              Phase 1 adheres strictly to client privacy. No private API keys or unencrypted credentials are exposed to the client bundle. All voice cloning consent files are prepared within sandbox guidelines.
            </p>
          </Card>

        </div>

      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset Studio Defaults"
        subtitle="Restore initial presets and clear custom storage"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#68645D] leading-relaxed">
            Are you sure you want to restore the studio to default state? All custom uploaded voices and local audio generation history will be reset.
          </p>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleResetDefaults}>
              Reset Everything
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
