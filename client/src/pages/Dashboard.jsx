import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Volume2,
  Mic,
  Clock,
  HardDrive,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  Download,
  Plus,
  Sliders,
  History,
  CheckCircle2
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import VoiceCard from '../components/voice/VoiceCard';
import { useVoice } from '../context/VoiceContext';
import { useAudio } from '../context/AudioContext';
import { useHistory } from '../context/HistoryContext';
import { useToast } from '../context/ToastContext';
import { MOCK_STATS } from '../data/mockStats';
import { formatTime, formatRelativeTime } from '../utils/formatters';

export default function Dashboard() {
  const navigate = useNavigate();
  const { voices, selectedVoice, setSelectedVoiceId } = useVoice();
  const { playTrack, currentTrack, isPlaying, togglePlayTrack, downloadTrack } = useAudio();
  const { history, addHistoryItem } = useHistory();
  const { showToast } = useToast();

  // Quick TTS state
  const [quickText, setQuickText] = useState(
    "Welcome to AI Voice Studio. Experience high fidelity vocal synthesis designed for creators and storytellers."
  );
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const handleQuickGenerate = () => {
    if (!quickText.trim()) {
      showToast('Please enter some text to synthesize', 'error');
      return;
    }

    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      const newTrack = {
        id: `track-${Date.now()}`,
        title: quickText.slice(0, 32) + (quickText.length > 32 ? '...' : ''),
        text: quickText,
        voiceId: selectedVoice.id,
        voiceName: selectedVoice.name,
        duration: Math.max(3.2, quickText.length * 0.06),
        speed: 1.0,
        pitch: 0,
        gender: selectedVoice.gender,
        lang: selectedVoice.languageCode || 'en-US',
      };

      // Add to history
      addHistoryItem({
        title: newTrack.title,
        textSnippet: quickText,
        voiceId: selectedVoice.id,
        voiceName: selectedVoice.name,
        duration: newTrack.duration,
        format: 'WAV',
      });

      // Play audio preview
      playTrack(newTrack);
      showToast('Audio synthesized successfully! Playing preview.', 'success');
    }, 600);
  };

  const recentHistory = history.slice(0, 4);
  const featuredVoices = voices.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* 1. Welcome Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2D2824] via-[#24201D] to-[#1A1816] text-[#FAF8F5] p-6 md:p-8 border border-[#3E3833] shadow-card">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#C27847]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-48 h-48 rounded-full bg-[#A35D31]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs text-[#FAF8F5] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#E6A075]" />
            <span>AI Voice Studio — Phase 1 Foundation</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            Elevate your stories with human-like vocal mastery
          </h2>

          <p className="text-sm md:text-base text-[#D4CDC5] leading-relaxed mb-6 font-normal">
            Generate lifelike voiceovers, manage custom acoustic profiles, and preview professional speech synthesis right from your browser.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              size="md"
              icon={Volume2}
              onClick={() => navigate('/text-to-voice')}
            >
              Open Full Voice Studio
            </Button>
            <Button
              variant="outline"
              size="md"
              className="!text-white !border-white/20 hover:!bg-white/10"
              icon={Mic}
              onClick={() => navigate('/add-custom-voice')}
            >
              Add Custom Voice
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Usage Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Quota */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#68645D] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Characters Left</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF3EC] text-[#C27847] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#1F1D1A]">
              {(100000 - MOCK_STATS.characterQuota.used).toLocaleString()}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-[#68645D]">
              <span>84.2% quota used</span>
              <span className="text-[#C27847] font-semibold">12d reset</span>
            </div>
            <div className="w-full bg-[#F4F1EA] rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-[#C27847] h-full rounded-full"
                style={{ width: `${MOCK_STATS.characterQuota.percentage}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Audio Hours */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#68645D] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Hours Generated</span>
            <div className="w-8 h-8 rounded-lg bg-[#F4F1EA] text-[#1F1D1A] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#1F1D1A]">
              {MOCK_STATS.audioHours.formattedHours}
            </div>
            <div className="mt-2 text-xs text-emerald-700 font-medium flex items-center space-x-1">
              <span>{MOCK_STATS.audioHours.trend}</span>
            </div>
          </div>
        </Card>

        {/* Available Voice Profiles */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#68645D] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Voice Profiles</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF3EC] text-[#C27847] flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#1F1D1A]">
              {voices.length} Active
            </div>
            <div className="mt-2 text-xs text-[#68645D] flex items-center justify-between">
              <span>{voices.filter(v => v.isCustom).length} Custom Voices</span>
              <span>{voices.filter(v => !v.isCustom).length} Studio Presets</span>
            </div>
          </div>
        </Card>

        {/* Storage */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#68645D] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Storage Used</span>
            <div className="w-8 h-8 rounded-lg bg-[#F4F1EA] text-[#1F1D1A] flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#1F1D1A]">
              {MOCK_STATS.storage.formattedUsed}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-[#68645D]">
              <span>of 10 GB limit</span>
              <span>{MOCK_STATS.storage.percentage}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Quick Text-to-Speech Action + Recent Generations Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Quick Text to Speech Action Card (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FAF3EC] text-[#C27847] flex items-center justify-center">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-[#1F1D1A]">Quick Speech Generator</h3>
                </div>
                
                {/* Active Voice Pill */}
                <div className="flex items-center space-x-2 bg-[#FAF8F5] border border-[#E2DDD3] px-3 py-1 rounded-full text-xs">
                  <span className="text-[#68645D]">Voice:</span>
                  <span className="font-semibold text-[#1F1D1A]">{selectedVoice.name}</span>
                </div>
              </div>

              {/* Text Input Area */}
              <div className="relative">
                <textarea
                  value={quickText}
                  onChange={(e) => setQuickText(e.target.value)}
                  rows={4}
                  maxLength={500}
                  placeholder="Type or paste any text to hear it spoken in studio quality..."
                  className="w-full p-4 rounded-xl bg-[#FAF8F5] border border-[#E2DDD3] focus:border-[#C27847] focus:ring-2 focus:ring-[#C27847]/20 outline-none text-sm text-[#1F1D1A] placeholder-[#9E988F] resize-none transition"
                />
                <div className="flex justify-between items-center text-xs text-[#68645D] mt-2 px-1">
                  <span>Estimated duration: ~{Math.round(quickText.length * 0.06)}s</span>
                  <span>{quickText.length} / 500 characters</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="mt-5 pt-4 border-t border-[#F4F1EA] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <select
                  value={selectedVoice.id}
                  onChange={(e) => setSelectedVoiceId(e.target.value)}
                  className="bg-[#FAF8F5] border border-[#E2DDD3] rounded-xl text-xs py-2 px-3 text-[#1F1D1A] focus:outline-none focus:border-[#C27847]"
                >
                  {voices.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.accent})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => navigate('/text-to-voice')}
                  className="text-xs text-[#C27847] hover:underline font-medium"
                >
                  Fine-tune sliders & emotions →
                </button>
              </div>

              <Button
                variant="primary"
                size="md"
                loading={isSynthesizing}
                onClick={handleQuickGenerate}
                icon={Play}
              >
                Synthesize & Play
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Generated Audio (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FAF3EC] text-[#C27847] flex items-center justify-center">
                    <History className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-[#1F1D1A]">Recent Audio</h3>
                </div>
                <button
                  onClick={() => navigate('/audio-history')}
                  className="text-xs font-semibold text-[#C27847] hover:underline"
                >
                  View all ({history.length})
                </button>
              </div>

              <div className="divide-y divide-[#F4F1EA] space-y-2">
                {recentHistory.map((item) => {
                  const isItemPlaying = currentTrack && currentTrack.id === item.id && isPlaying;

                  return (
                    <div
                      key={item.id}
                      className="pt-2 flex items-center justify-between group hover:bg-[#FAF8F5] p-2 rounded-xl transition"
                    >
                      <div className="flex items-center space-x-3 min-w-0 pr-2">
                        <button
                          onClick={() => togglePlayTrack({
                            id: item.id,
                            title: item.title,
                            text: item.textSnippet,
                            voiceName: item.voiceName,
                            duration: item.duration,
                            gender: 'neutral'
                          })}
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition ${
                            isItemPlaying
                              ? 'bg-[#1F1D1A] text-white'
                              : 'bg-[#FAF3EC] text-[#C27847] hover:bg-[#C27847] hover:text-white'
                          }`}
                        >
                          {isItemPlaying ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-[#1F1D1A] truncate">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-[#68645D] truncate mt-0.5">
                            {item.voiceName} • {formatTime(item.duration)} • {formatRelativeTime(item.createdAt)}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => downloadTrack({
                          title: item.title,
                          text: item.textSnippet,
                          duration: item.duration
                        })}
                        className="p-1.5 rounded-lg text-[#68645D] hover:text-[#1F1D1A] hover:bg-white border border-transparent hover:border-[#E2DDD3] transition opacity-0 group-hover:opacity-100 shrink-0"
                        title="Download audio file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F4F1EA]">
              <button
                onClick={() => navigate('/audio-history')}
                className="w-full py-2 rounded-xl text-center text-xs font-semibold text-[#68645D] hover:text-[#1F1D1A] hover:bg-[#FAF8F5] transition"
              >
                Go to Audio History Archive →
              </button>
            </div>
          </Card>
        </div>

      </div>

      {/* 4. Featured Voice Profiles Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#1F1D1A]">Featured Voice Profiles</h3>
            <p className="text-xs text-[#68645D]">Instant preview of studio-calibrated vocal personas</p>
          </div>
          <button
            onClick={() => navigate('/voice-library')}
            className="text-xs font-semibold text-[#C27847] hover:underline flex items-center space-x-1"
          >
            <span>Explore All {voices.length} Voices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredVoices.map((voice) => (
            <VoiceCard
              key={voice.id}
              voice={voice}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
