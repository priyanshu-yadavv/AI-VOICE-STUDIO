import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  Mic,
  Link2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileAudio,
  Sparkles,
  Info,
  Trash2,
  ArrowRight
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import WaveformVisualizer from '../components/audio/WaveformVisualizer';
import { useVoice } from '../context/VoiceContext';
import { useAudio } from '../context/AudioContext';
import { useToast } from '../context/ToastContext';
import { LANGUAGE_OPTIONS } from '../data/mockVoices';
import { formatTime, formatBytes } from '../utils/formatters';

const ALLOWED_EXTENSIONS = ['mp3', 'wav', 'm4a', 'ogg'];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export default function AddCustomVoice() {
  const navigate = useNavigate();
  const { addCustomVoice, voices } = useVoice();
  const { playTrack, currentTrack, isPlaying, togglePlayTrack } = useAudio();
  const { showToast } = useToast();

  // Tab State: 'upload' | 'record' | 'import'
  const [activeTab, setActiveTab] = useState('upload');

  // Voice Metadata Form State
  const [voiceName, setVoiceName] = useState('');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState('female');
  const [language, setLanguage] = useState('en-US');
  const [accent, setAccent] = useState('American (Neutral)');
  const [categoryTag, setCategoryTag] = useState('Podcast & Narrative');

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Microphone Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [vuLevel, setVuLevel] = useState(25);
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const audioChunksRef = useRef([]);

  // External Voice ID State
  const [externalProvider, setExternalProvider] = useState('elevenlabs');
  const [externalVoiceId, setExternalVoiceId] = useState('');
  const [isVerifyingExternal, setIsVerifyingExternal] = useState(false);
  const [externalVerified, setExternalVerified] = useState(false);

  // Submitting state
  const [isSaving, setIsSaving] = useState(false);

  // Clean up recording URL on unmount
  useEffect(() => {
    return () => {
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [recordedAudioUrl]);

  // Handle File Selection
  const validateAndSetFile = (file) => {
    setFileError(null);
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setFileError(`Invalid format (.${ext}). Supported formats: MP3, WAV, M4A, OGG`);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError(`File too large (${formatBytes(file.size)}). Max allowed is 25 MB.`);
      return;
    }

    setUploadedFile(file);
    if (!voiceName) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setVoiceName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
    showToast(`Audio sample loaded: ${file.name}`, 'info');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // Microphone Recording Handlers
  const startRecording = async () => {
    try {
      setFileError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingSeconds(sec => sec + 1);
        setVuLevel(Math.floor(Math.random() * 60) + 30);
      }, 1000);

    } catch (err) {
      console.error(err);
      setFileError('Microphone access denied or not supported in this browser. Please allow microphone permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
      setVuLevel(0);
      showToast('Recording captured successfully!', 'success');
      if (!voiceName) {
        setVoiceName(`Voice Recording ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      }
    }
  };

  const resetRecording = () => {
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
    }
    setRecordedAudioBlob(null);
    setRecordedAudioUrl(null);
    setRecordingSeconds(0);
  };

  // External Voice Verification
  const handleVerifyExternal = () => {
    if (!externalVoiceId.trim()) {
      showToast('Please enter an External Voice ID', 'error');
      return;
    }
    setIsVerifyingExternal(true);
    setTimeout(() => {
      setIsVerifyingExternal(false);
      setExternalVerified(true);
      if (!voiceName) {
        setVoiceName(`${externalProvider.toUpperCase()} Voice Profile (${externalVoiceId.slice(0, 6)})`);
      }
      showToast(`Voice ID verified on ${externalProvider} endpoint!`, 'success');
    }, 800);
  };

  // Preview the sample
  const handlePreviewSample = () => {
    const previewName = voiceName || 'Custom Sample';
    togglePlayTrack({
      id: 'custom-sample-preview',
      title: `${previewName} (Sample Preview)`,
      text: description || "This is a custom audio sample recorded for AI Voice Studio calibration.",
      voiceName: previewName,
      duration: activeTab === 'record' ? Math.max(3, recordingSeconds) : 4.5,
      gender: gender
    });
  };

  // Save Voice Profile
  const handleSaveVoice = (e) => {
    e.preventDefault();

    if (!voiceName.trim()) {
      showToast('Please specify a voice name', 'error');
      return;
    }

    // Validation based on active tab
    if (activeTab === 'upload' && !uploadedFile) {
      showToast('Please upload an audio file first', 'error');
      return;
    }
    if (activeTab === 'record' && !recordedAudioBlob) {
      showToast('Please record audio with your microphone first', 'error');
      return;
    }
    if (activeTab === 'import' && !externalVoiceId) {
      showToast('Please specify and verify an external voice ID', 'error');
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      const newVoice = addCustomVoice({
        name: voiceName.trim(),
        description: description.trim() || `Custom voice profile created via ${activeTab} method.`,
        gender,
        languageCode: language,
        accent,
        style: categoryTag,
        category: "Custom Clone",
        previewText: description || `Hello! This is a voice preview for ${voiceName}.`,
        sampleDuration: activeTab === 'record' ? Math.max(3.5, recordingSeconds) : 5.0,
        tags: ["Custom Voice", categoryTag, activeTab.toUpperCase()],
        sourceMethod: activeTab,
        sourceFileName: uploadedFile ? uploadedFile.name : activeTab === 'record' ? 'mic_session.webm' : externalVoiceId
      });

      showToast(`Custom voice "${voiceName}" added to library!`, 'success');
      navigate('/voice-library');
    }, 700);
  };

  const isSampleReady =
    (activeTab === 'upload' && uploadedFile) ||
    (activeTab === 'record' && recordedAudioBlob) ||
    (activeTab === 'import' && externalVerified);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1F1D1A]">Create New Custom Voice</h2>
          <p className="text-xs text-[#68645D] mt-0.5">
            Add a personalized acoustic profile via high-quality audio upload, live microphone, or external provider ID.
          </p>
        </div>

        <button
          onClick={() => navigate('/voice-library')}
          className="text-xs font-semibold text-[#68645D] hover:text-[#1F1D1A] flex items-center space-x-1"
        >
          <span>View Voice Library</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Methods (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Method Tabs */}
          <div className="flex rounded-2xl bg-white p-1.5 border border-[#E2DDD3] shadow-subtle gap-1.5">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                activeTab === 'upload'
                  ? 'bg-[#C27847] text-white shadow-sm'
                  : 'text-[#68645D] hover:text-[#1F1D1A] hover:bg-[#FAF8F5]'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Audio File Upload</span>
            </button>

            <button
              onClick={() => setActiveTab('record')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                activeTab === 'record'
                  ? 'bg-[#C27847] text-white shadow-sm'
                  : 'text-[#68645D] hover:text-[#1F1D1A] hover:bg-[#FAF8F5]'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Microphone Record</span>
            </button>

            <button
              onClick={() => setActiveTab('import')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
                activeTab === 'import'
                  ? 'bg-[#C27847] text-white shadow-sm'
                  : 'text-[#68645D] hover:text-[#1F1D1A] hover:bg-[#FAF8F5]'
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>External Voice ID</span>
            </button>
          </div>

          {/* TAB 1: FILE UPLOAD INTERFACE */}
          {activeTab === 'upload' && (
            <Card className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F4F1EA]">
                <div>
                  <h3 className="text-sm font-bold text-[#1F1D1A]">Upload Acoustic Sample</h3>
                  <p className="text-xs text-[#68645D]">Upload clean, isolated speech free of heavy background music</p>
                </div>
                <Badge variant="accent" size="xs">MP3, WAV, M4A, OGG</Badge>
              </div>

              {/* Drag and Drop Box */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                  isDragging
                    ? 'border-[#C27847] bg-[#FAF3EC]'
                    : 'border-[#E2DDD3] bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] hover:border-[#D5CEBF]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".mp3,.wav,.m4a,.ogg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      validateAndSetFile(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-12 h-12 rounded-2xl bg-[#FAF3EC] text-[#C27847] flex items-center justify-center mb-3 shadow-subtle">
                  <UploadCloud className="w-6 h-6" />
                </div>

                <h4 className="text-sm font-bold text-[#1F1D1A] mb-1">
                  Click to choose file or drag & drop here
                </h4>
                <p className="text-xs text-[#68645D] max-w-sm mb-3">
                  Accepts MP3, WAV, M4A, or OGG up to 25 MB. Clear vocal recordings produce the highest fidelity.
                </p>

                <span className="text-[11px] font-semibold text-[#C27847] bg-white border border-[#E2DDD3] px-3 py-1 rounded-full shadow-2xs">
                  Browse files
                </span>
              </div>

              {/* Error state */}
              {fileError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{fileError}</span>
                </div>
              )}

              {/* Uploaded File Detail & Waveform */}
              {uploadedFile && (
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E2DDD3] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <FileAudio className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-[#1F1D1A] truncate">{uploadedFile.name}</h5>
                        <p className="text-[11px] text-[#68645D]">{formatBytes(uploadedFile.size)} • Ready for profile extraction</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setUploadedFile(null)}
                      className="p-1.5 rounded-lg text-[#68645D] hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Waveform Visualization of Uploaded Track */}
                  <div className="bg-white p-2.5 rounded-lg border border-[#E2DDD3]">
                    <WaveformVisualizer seed={uploadedFile.name} barsCount={50} height={32} />
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* TAB 2: MICROPHONE RECORDING INTERFACE */}
          {activeTab === 'record' && (
            <Card className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F4F1EA]">
                <div>
                  <h3 className="text-sm font-bold text-[#1F1D1A]">Microphone Speech Capture</h3>
                  <p className="text-xs text-[#68645D]">Record 15–30 seconds of clean speech using your browser microphone</p>
                </div>
                <Badge variant={isRecording ? "danger" : "neutral"} size="xs">
                  {isRecording ? "LIVE RECORDING" : "STANDBY"}
                </Badge>
              </div>

              {/* Recording Studio Box */}
              <div className="border border-[#E2DDD3] bg-[#FAF8F5] rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                {/* Visualizer / VU level */}
                <div className="w-full max-w-sm h-12 flex items-center justify-center space-x-1">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const activeHeight = isRecording
                      ? Math.max(4, Math.sin(i * 0.4 + recordingSeconds) * vuLevel * 0.7)
                      : 4;
                    return (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-100 ${
                          isRecording ? 'bg-[#C27847]' : 'bg-[#E2DDD3]'
                        }`}
                        style={{ height: `${activeHeight}px` }}
                      />
                    );
                  })}
                </div>

                {/* Timer */}
                <div className="font-mono text-2xl font-bold text-[#1F1D1A]">
                  {formatTime(recordingSeconds)}
                </div>

                {/* Prompt Script to Read */}
                <div className="bg-white p-3.5 rounded-xl border border-[#E2DDD3] max-w-md text-left text-xs text-[#68645D] leading-relaxed">
                  <span className="font-semibold text-[#1F1D1A] block mb-1">Suggested script to read:</span>
                  "The quick brown fox jumps over the lazy dog. Studio acoustics are calibrated for natural pitch, expressive inflections, and seamless audio synthesis."
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-3 pt-2">
                  {!isRecording ? (
                    <Button
                      variant="primary"
                      size="md"
                      icon={Mic}
                      onClick={startRecording}
                    >
                      {recordedAudioBlob ? 'Record Again' : 'Start Recording'}
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      size="md"
                      onClick={stopRecording}
                    >
                      Stop & Save Recording
                    </Button>
                  )}

                  {recordedAudioBlob && !isRecording && (
                    <Button
                      variant="subtle"
                      size="md"
                      icon={RotateCcw}
                      onClick={resetRecording}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              {/* Recorded Audio Preview */}
              {recordedAudioBlob && !isRecording && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between text-emerald-900">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Microphone sample recorded: <strong>{recordingSeconds}s duration</strong></span>
                  </div>
                  <button
                    onClick={handlePreviewSample}
                    className="font-semibold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Play recorded sample
                  </button>
                </div>
              )}
            </Card>
          )}

          {/* TAB 3: EXTERNAL VOICE ID IMPORT INTERFACE */}
          {activeTab === 'import' && (
            <Card className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F4F1EA]">
                <div>
                  <h3 className="text-sm font-bold text-[#1F1D1A]">External Voice Model Link</h3>
                  <p className="text-xs text-[#68645D]">Link pre-existing voice IDs from trusted AI voice providers</p>
                </div>
                <Badge variant="accent" size="xs">API Scaffolding</Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1D1A] mb-1.5">
                    Select Voice Provider
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'elevenlabs', name: 'ElevenLabs' },
                      { id: 'cartesia', name: 'Cartesia' },
                      { id: 'playht', name: 'Play.ht' },
                    ].map(prov => (
                      <button
                        key={prov.id}
                        type="button"
                        onClick={() => {
                          setExternalProvider(prov.id);
                          setExternalVerified(false);
                        }}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                          externalProvider === prov.id
                            ? 'bg-[#FAF3EC] border-[#C27847] text-[#C27847]'
                            : 'bg-[#FAF8F5] border-[#E2DDD3] text-[#68645D] hover:text-[#1F1D1A]'
                        }`}
                      >
                        {prov.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1D1A] mb-1.5">
                    Provider Voice ID
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="e.g. 21m00Tcm4TlvDq8ikWAM"
                      value={externalVoiceId}
                      onChange={(e) => {
                        setExternalVoiceId(e.target.value);
                        setExternalVerified(false);
                      }}
                      className="flex-1 px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E2DDD3] rounded-xl focus:border-[#C27847] outline-none"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      loading={isVerifyingExternal}
                      onClick={handleVerifyExternal}
                    >
                      Verify ID
                    </Button>
                  </div>
                  <p className="text-[11px] text-[#68645D] mt-1.5">
                    Voice IDs are validated against the provider schema. No private API keys are exposed.
                  </p>
                </div>

                {externalVerified && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>External voice ID confirmed active on <strong>{externalProvider}</strong></span>
                  </div>
                )}
              </div>
            </Card>
          )}

        </div>

        {/* Right Column: Voice Profile Metadata & Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="space-y-4">
            <div className="border-b border-[#F4F1EA] pb-3">
              <h3 className="text-sm font-bold text-[#1F1D1A]">Profile Configuration</h3>
              <p className="text-xs text-[#68645D]">Define the persona attributes for this acoustic model</p>
            </div>

            <form onSubmit={handleSaveVoice} className="space-y-4">
              {/* Voice Name */}
              <div>
                <label className="block text-xs font-semibold text-[#1F1D1A] mb-1">
                  Voice Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maya Narrator v2"
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E2DDD3] rounded-xl focus:border-[#C27847] outline-none"
                  required
                />
              </div>

              {/* Gender and Language */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1D1A] mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E2DDD3] rounded-xl text-xs py-2 px-3 text-[#1F1D1A] focus:outline-none focus:border-[#C27847]"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="neutral">Neutral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1D1A] mb-1">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E2DDD3] rounded-xl text-xs py-2 px-3 text-[#1F1D1A] focus:outline-none focus:border-[#C27847]"
                  >
                    {LANGUAGE_OPTIONS.map(l => (
                      <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Accent and Style Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1D1A] mb-1">
                    Accent / Dialect
                  </label>
                  <input
                    type="text"
                    value={accent}
                    onChange={(e) => setAccent(e.target.value)}
                    placeholder="e.g. British (RP), Scottish"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E2DDD3] rounded-xl focus:border-[#C27847] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1D1A] mb-1">
                    Intended Use
                  </label>
                  <input
                    type="text"
                    value={categoryTag}
                    onChange={(e) => setCategoryTag(e.target.value)}
                    placeholder="e.g. Audiobook, Commercial"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E2DDD3] rounded-xl focus:border-[#C27847] outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#1F1D1A] mb-1">
                  Description & Voice Notes
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Notes about timbre, pacing, emotional range, or acoustic recording conditions..."
                  className="w-full p-3 text-xs bg-[#FAF8F5] border border-[#E2DDD3] rounded-xl focus:border-[#C27847] outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Voice Preview Action */}
              <div className="pt-2">
                <Button
                  variant="subtle"
                  size="sm"
                  icon={Play}
                  onClick={handlePreviewSample}
                  className="w-full"
                >
                  Test Sample Preview Audio
                </Button>
              </div>

              {/* Submit Save Profile Button */}
              <div className="pt-3 border-t border-[#F4F1EA]">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isSaving}
                  disabled={!isSampleReady}
                  className="w-full"
                >
                  Save to Voice Library
                </Button>
                {!isSampleReady && (
                  <p className="text-[11px] text-[#A25F35] text-center mt-2">
                    * Please upload a file, record audio, or verify an ID before saving.
                  </p>
                )}
              </div>
            </form>
          </Card>
        </div>

      </div>

    </div>
  );
}
