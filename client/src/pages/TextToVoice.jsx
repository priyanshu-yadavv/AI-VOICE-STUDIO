import React, { useState } from 'react';
import {
  Volume2,
  Play,
  Pause,
  Download,
  RotateCcw,
  Sparkles,
  Sliders,
  Globe,
  Settings2,
  FileText,
  Copy,
  Check,
  Music,
  Share2
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import WaveformVisualizer from '../components/audio/WaveformVisualizer';
import { useVoice } from '../context/VoiceContext';
import { useAudio } from '../context/AudioContext';
import { useHistory } from '../context/HistoryContext';
import { useToast } from '../context/ToastContext';
import { LANGUAGE_OPTIONS, EMOTION_OPTIONS } from '../data/mockVoices';
import { formatTime } from '../utils/formatters';

const SAMPLE_PROMPTS = [
  {
    label: "Audiobook Prologue",
    text: "The clockwork library did not tick with ordinary gears; its pendulums swayed to the rhythmic cadence of forgotten languages recorded upon copper discs.",
    emotion: "storyteller"
  },
  {
    label: "Tech Keynote",
    text: "Today we are unveiling an entirely new foundation for human-computer interaction. It begins not with code, but with voice.",
    emotion: "authoritative"
  },
  {
    label: "SaaS Onboarding",
    text: "Welcome to your new workspace! In this sixty-second tour, we'll configure your voice model and set up your automated audio export pipelines.",
    emotion: "cheerful"
  },
  {
    label: "Sleep & Wellness",
    text: "Allow your shoulders to soften. Release any tension held in your jaw, and let the gentle rhythm of your breathing anchor you in this moment.",
    emotion: "whispering"
  }
];

export default function TextToVoice() {
  const { voices, selectedVoice, setSelectedVoiceId } = useVoice();
  const { playTrack, currentTrack, isPlaying, togglePlayTrack, seekTo, currentTime, duration, downloadTrack } = useAudio();
  const { addHistoryItem } = useHistory();
  const { showToast } = useToast();

  // Synthesis Parameters State
  const [text, setText] = useState(
    "AI Voice Studio delivers studio-grade text-to-speech with natural cadence, accurate pronunciation, and expressive emotional nuance."
  );
  const [selectedLanguage, setSelectedLanguage] = useState(selectedVoice?.languageCode || 'en-US');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0); // -50 to +50
  const [emotion, setEmotion] = useState('neutral');
  const [exportFormat, setExportFormat] = useState('WAV');
  const [sampleRate, setSampleRate] = useState('48000');

  // Generation & Audio Result State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [latestAudio, setLatestAudio] = useState(null);
  const [voiceSearch, setVoiceSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');

  // Metrics
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const estimatedSeconds = Math.max(2, Math.round((wordCount / (140 * speed)) * 60));

  const filteredVoices = voices.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(voiceSearch.toLowerCase()) ||
                          v.accent.toLowerCase().includes(voiceSearch.toLowerCase()) ||
                          v.style.toLowerCase().includes(voiceSearch.toLowerCase());
    const matchesGender = genderFilter === 'all' || v.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  const handleGenerate = () => {
    if (!text.trim()) {
      showToast('Please enter text before generating audio', 'error');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(10);

    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 120);

    setTimeout(() => {
      clearInterval(interval);
      setGenerationProgress(100);
      setIsGenerating(false);

      const generatedTrack = {
        id: `gen-${Date.now()}`,
        title: text.slice(0, 42) + (text.length > 42 ? '...' : ''),
        text: text,
        voiceId: selectedVoice.id,
        voiceName: selectedVoice.name,
        duration: estimatedSeconds,
        speed: speed,
        pitch: pitch,
        emotion: emotion,
        gender: selectedVoice.gender,
        lang: selectedLanguage,
        format: exportFormat,
        sampleRate: parseInt(sampleRate, 10),
        createdAt: new Date().toISOString()
      };

      setLatestAudio(generatedTrack);

      // Add to audio history
      addHistoryItem({
        title: generatedTrack.title,
        textSnippet: text,
        voiceId: selectedVoice.id,
        voiceName: selectedVoice.name,
        duration: estimatedSeconds,
        format: exportFormat,
        sampleRate: parseInt(sampleRate, 10),
        speed,
        pitch,
        emotion
      });

      // Auto play generated audio
      playTrack(generatedTrack);
      showToast('Vocal synthesis complete! Audio preview loaded.', 'success');
    }, 850);
  };

  const handleApplyPrompt = (prompt) => {
    setText(prompt.text);
    if (prompt.emotion) setEmotion(prompt.emotion);
    showToast(`Loaded "${prompt.label}" sample prompt`, 'info');
  };

  const handleClearText = () => {
    setText('');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(text);
    showToast('Text copied to clipboard', 'info');
  };

  const handleDownload = () => {
    if (!latestAudio) {
      // Create instant blob from current text
      const blobTrack = {
        title: text.slice(0, 30),
        text: text,
        duration: estimatedSeconds
      };
      downloadTrack(blobTrack);
    } else {
      downloadTrack(latestAudio);
    }
    showToast(`Downloading audio track (${exportFormat})`, 'success');
  };

  const isCurrentAudioPlaying = latestAudio && currentTrack?.id === latestAudio.id && isPlaying;
  const currentAudioProgress = latestAudio && duration > 0 ? currentTime / duration : 0;

  return (
    <div className="space-y-6">
      
      {/* Studio Banner */}
      <div className="bg-[#FAF3EC] border border-[#F3D5C0] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-[#C27847] text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#A25F35] uppercase tracking-wider">
              Studio Generation Workspace
            </h4>
            <p className="text-xs text-[#68645D]">
              Fine-tune speed, pitch, emotion, and vocal acoustics with instant browser harmonic playback.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#68645D]">
          <span className="font-semibold text-[#1F1D1A]">Active Voice:</span>
          <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E2DDD3] font-medium text-[#C27847]">
            {selectedVoice.name} ({selectedVoice.accent})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Text Editor & Audio Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Text Editor Card */}
          <Card className="flex flex-col justify-between">
            <div>
              {/* Header: Title & Actions */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F4F1EA]">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-[#C27847]" />
                  <span className="text-sm font-bold text-[#1F1D1A]">Script & Speech Content</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={handleCopyText}
                    className="p-1.5 text-xs text-[#68645D] hover:text-[#1F1D1A] hover:bg-[#FAF8F5] rounded-lg transition"
                    title="Copy Script"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleClearText}
                    className="p-1.5 text-xs text-[#68645D] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Clear text"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sample Prompts Pills */}
              <div className="mb-3 flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
                <span className="text-[#68645D] shrink-0 font-medium text-[11px]">Templates:</span>
                {SAMPLE_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApplyPrompt(prompt)}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#F4F1EA] text-[#68645D] hover:text-[#1F1D1A] border border-[#E2DDD3] shrink-0 transition text-[11px]"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>

              {/* Large Text Editor */}
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={9}
                placeholder="Type or paste the script you wish to convert into speech..."
                className="w-full p-4 rounded-xl bg-[#FAF8F5] border border-[#E2DDD3] focus:border-[#C27847] focus:ring-2 focus:ring-[#C27847]/20 outline-none text-sm text-[#1F1D1A] placeholder-[#9E988F] leading-relaxed resize-none transition"
              />

              {/* Character & Word Metrics */}
              <div className="flex flex-wrap items-center justify-between text-xs text-[#68645D] mt-3 pt-2">
                <div className="flex items-center space-x-4">
                  <span><strong>{charCount}</strong> characters</span>
                  <span><strong>{wordCount}</strong> words</span>
                  <span>Est. duration: <strong>~{estimatedSeconds}s</strong></span>
                </div>
                <div className="text-[11px] text-[#A25F35]">
                  Max 5,000 characters per synthesis
                </div>
              </div>
            </div>

            {/* Generate Action Bar */}
            <div className="mt-6 pt-4 border-t border-[#F4F1EA] flex items-center justify-between gap-3">
              <div className="text-xs text-[#68645D]">
                Format: <strong className="text-[#1F1D1A]">{exportFormat}</strong> ({sampleRate === '48000' ? '48 kHz Studio' : '44.1 kHz Standard'})
              </div>

              <Button
                variant="primary"
                size="lg"
                loading={isGenerating}
                onClick={handleGenerate}
                icon={Volume2}
                className="w-full sm:w-auto"
              >
                {isGenerating ? `Synthesizing (${generationProgress}%)` : 'Generate Speech'}
              </Button>
            </div>
          </Card>

          {/* Audio Preview & Export Player UI */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Music className="w-4 h-4 text-[#C27847]" />
                <h3 className="text-sm font-bold text-[#1F1D1A]">Master Audio Preview & Export</h3>
              </div>
              {latestAudio && (
                <Badge variant="accent" size="xs">{latestAudio.format} Master</Badge>
              )}
            </div>

            {latestAudio ? (
              <div className="bg-[#FAF8F5] rounded-xl p-4 border border-[#E2DDD3] space-y-4">
                {/* Audio Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#1F1D1A] truncate max-w-md">
                      {latestAudio.title}
                    </h4>
                    <p className="text-xs text-[#68645D]">
                      Voice: {latestAudio.voiceName} • Emotion: {latestAudio.emotion} • Speed: {latestAudio.speed}x
                    </p>
                  </div>
                  <span className="text-xs font-mono font-medium text-[#68645D]">
                    {formatTime(currentTime)} / {formatTime(latestAudio.duration)}
                  </span>
                </div>

                {/* Waveform Player */}
                <div className="bg-white p-3 rounded-xl border border-[#E2DDD3]">
                  <WaveformVisualizer
                    seed={latestAudio.id}
                    barsCount={64}
                    progress={currentAudioProgress}
                    isPlaying={isCurrentAudioPlaying}
                    onSeek={(ratio) => seekTo(ratio * latestAudio.duration)}
                    height={46}
                  />
                </div>

                {/* Controls & Download Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => togglePlayTrack(latestAudio)}
                      className="w-10 h-10 rounded-full bg-[#C27847] hover:bg-[#AA6536] text-white flex items-center justify-center transition shadow-sm cursor-pointer"
                    >
                      {isCurrentAudioPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>
                    <span className="text-xs text-[#68645D]">
                      {isCurrentAudioPlaying ? 'Playing audio preview' : 'Click to preview audio'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Download}
                      onClick={handleDownload}
                    >
                      Download {exportFormat}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 px-4 border border-dashed border-[#E2DDD3] rounded-xl bg-[#FAF8F5]/60">
                <Volume2 className="w-8 h-8 text-[#9E988F] mx-auto mb-2" />
                <p className="text-xs font-semibold text-[#1F1D1A]">No audio generated yet</p>
                <p className="text-xs text-[#68645D] mt-0.5">
                  Enter your script above and click "Generate Speech" to synthesize and preview.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Voice Selection, Language & Acoustic Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Acoustic & Emotion Controls */}
          <Card className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#F4F1EA] pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-[#C27847]" />
                <h3 className="text-sm font-bold text-[#1F1D1A]">Acoustic Tuning</h3>
              </div>
              <button
                onClick={() => {
                  setSpeed(1.0);
                  setPitch(0);
                  setEmotion('neutral');
                  showToast('Acoustic controls reset to default', 'info');
                }}
                className="text-xs text-[#68645D] hover:text-[#C27847] font-medium"
              >
                Reset Defaults
              </button>
            </div>

            {/* Speed Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#1F1D1A]">Speaking Speed</span>
                <span className="font-mono text-[#C27847] font-bold">{speed.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-[#C27847] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#9E988F]">
                <span>0.5x Slow</span>
                <span>1.0x Normal</span>
                <span>2.0x Fast</span>
              </div>
            </div>

            {/* Pitch Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#1F1D1A]">Voice Pitch Shift</span>
                <span className="font-mono text-[#C27847] font-bold">{pitch > 0 ? `+${pitch}` : pitch}%</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={pitch}
                onChange={(e) => setPitch(parseInt(e.target.value, 10))}
                className="w-full accent-[#C27847] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#9E988F]">
                <span>-50% Deeper</span>
                <span>0 Normal</span>
                <span>+50% Higher</span>
              </div>
            </div>

            {/* Emotion / Delivery Style Selector */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-[#1F1D1A]">Emotion & Tone Style</span>
              <div className="grid grid-cols-2 gap-2">
                {EMOTION_OPTIONS.map((emo) => (
                  <button
                    key={emo.id}
                    onClick={() => setEmotion(emo.id)}
                    className={`p-2.5 rounded-xl text-left border transition text-xs flex flex-col justify-between ${
                      emotion === emo.id
                        ? 'bg-[#FAF3EC] border-[#C27847] text-[#1F1D1A] ring-1 ring-[#C27847]/30'
                        : 'bg-[#FAF8F5] border-[#E2DDD3] text-[#68645D] hover:border-[#D5CEBF] hover:text-[#1F1D1A]'
                    }`}
                  >
                    <span className="font-bold capitalize">{emo.label}</span>
                    <span className="text-[10px] opacity-80 truncate">{emo.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language & Export Settings */}
            <div className="pt-2 border-t border-[#F4F1EA] space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {/* Language Select */}
                <div>
                  <label className="block text-xs font-semibold text-[#1F1D1A] mb-1">
                    Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E2DDD3] rounded-xl text-xs py-2 px-3 text-[#1F1D1A] focus:outline-none focus:border-[#C27847]"
                  >
                    {LANGUAGE_OPTIONS.map(l => (
                      <option key={l.code} value={l.code}>
                        {l.flag} {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Export Format */}
                <div>
                  <label className="block text-xs font-semibold text-[#1F1D1A] mb-1">
                    Format & Quality
                  </label>
                  <div className="flex space-x-1.5">
                    {['WAV', 'MP3'].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setExportFormat(fmt)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                          exportFormat === fmt
                            ? 'bg-[#C27847] text-white border-[#C27847]'
                            : 'bg-[#FAF8F5] text-[#68645D] border-[#E2DDD3] hover:text-[#1F1D1A]'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Voice Selection Panel */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#F4F1EA] pb-3">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-[#C27847]" />
                <h3 className="text-sm font-bold text-[#1F1D1A]">Select Voice Persona</h3>
              </div>
              <span className="text-xs text-[#68645D]">{filteredVoices.length} available</span>
            </div>

            {/* Filter & Search Bar */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Search voices by name, accent..."
                value={voiceSearch}
                onChange={(e) => setVoiceSearch(e.target.value)}
                className="w-full py-2 px-3 text-xs bg-[#FAF8F5] border border-[#E2DDD3] rounded-xl focus:border-[#C27847] outline-none"
              />

              <div className="flex items-center space-x-1 text-xs">
                {['all', 'female', 'male'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenderFilter(g)}
                    className={`px-2.5 py-1 rounded-lg capitalize text-[11px] font-medium border transition ${
                      genderFilter === g
                        ? 'bg-[#1F1D1A] text-white border-[#1F1D1A]'
                        : 'bg-[#FAF8F5] text-[#68645D] border-[#E2DDD3] hover:text-[#1F1D1A]'
                    }`}
                  >
                    {g === 'all' ? 'All Voices' : g}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Voice Cards List */}
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {filteredVoices.map((voice) => {
                const isSelected = selectedVoice.id === voice.id;

                return (
                  <div
                    key={voice.id}
                    onClick={() => setSelectedVoiceId(voice.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      isSelected
                        ? 'bg-[#FAF3EC] border-[#C27847] ring-1 ring-[#C27847]/30 shadow-subtle'
                        : 'bg-[#FAF8F5] border-[#E2DDD3] hover:border-[#D5CEBF]'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={voice.avatar}
                        alt={voice.name}
                        className="w-9 h-9 rounded-lg object-cover border border-[#E2DDD3] shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-xs font-bold text-[#1F1D1A] truncate">{voice.name}</h4>
                          {voice.isCustom && <Badge variant="accent" size="xs">Custom</Badge>}
                        </div>
                        <p className="text-[11px] text-[#68645D] truncate">{voice.accent} • {voice.style}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlayTrack({
                            id: `preview-${voice.id}`,
                            title: `${voice.name} Preview`,
                            text: voice.previewText,
                            voiceName: voice.name,
                            duration: voice.sampleDuration || 4.5,
                            gender: voice.gender
                          });
                        }}
                        className="p-1.5 rounded-lg bg-white border border-[#E2DDD3] hover:border-[#C27847] text-[#C27847] transition shadow-2xs"
                        title="Sample Preview"
                      >
                        <Play className="w-3 h-3 fill-current" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
}
