// Web Audio API and Speech Synthesis Helpers for Phase 1 Studio

let audioCtx = null;

export function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays speech using Web Speech API if supported, or melodic speech harmonics via Web Audio API.
 * Returns a controller object { stop, durationPromise }.
 */
export function playSyntheticSpeech(text, voiceOptions = {}) {
  const {
    speed = 1.0,
    pitch = 1.0,
    gender = 'neutral',
    lang = 'en-US',
    onEnd = () => {},
    onStart = () => {}
  } = voiceOptions;

  // 1. Try Browser native Web Speech API first
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = Math.max(0.5, Math.min(2.0, speed));
    utterance.pitch = Math.max(0.5, Math.min(1.5, pitch));
    utterance.lang = lang;

    // Try to find a matching voice if voices are loaded
    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices.length > 0) {
      const matched = availableVoices.find(v => {
        const nameLower = v.name.toLowerCase();
        const matchesLang = v.lang.startsWith(lang.split('-')[0]);
        if (gender === 'female') {
          return matchesLang && (nameLower.includes('female') || nameLower.includes('samantha') || nameLower.includes('zira') || nameLower.includes('victoria'));
        } else if (gender === 'male') {
          return matchesLang && (nameLower.includes('male') || nameLower.includes('david') || nameLower.includes('george') || nameLower.includes('alex'));
        }
        return matchesLang;
      });
      if (matched) {
        utterance.voice = matched;
      }
    }

    utterance.onstart = () => {
      onStart();
    };

    utterance.onend = () => {
      onEnd();
    };

    utterance.onerror = () => {
      onEnd();
    };

    window.speechSynthesis.speak(utterance);

    return {
      stop: () => {
        window.speechSynthesis.cancel();
        onEnd();
      }
    };
  }

  // 2. Fallback harmonic chime sequence if speech synthesis is disabled or unavailable
  const ctx = getAudioContext();
  if (!ctx) {
    onEnd();
    return { stop: () => {} };
  }

  const duration = Math.min(4, Math.max(1.5, text.length * 0.05 / speed));
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  const baseFreq = gender === 'female' ? 260 * pitch : gender === 'male' ? 140 * pitch : 200 * pitch;
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, ctx.currentTime + duration * 0.5);
  osc.frequency.exponentialRampToValueAtTime(baseFreq, ctx.currentTime + duration);

  gain.gain.setValueAtTime(0.01, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  onStart();
  osc.stop(ctx.currentTime + duration);

  const timeoutId = setTimeout(() => {
    onEnd();
  }, duration * 1000);

  return {
    stop: () => {
      clearTimeout(timeoutId);
      try {
        osc.stop();
        gain.disconnect();
      } catch (e) {
        // already stopped
      }
      onEnd();
    }
  };
}

/**
 * Creates a valid PCM 44.1kHz 16-bit WAV audio Blob from text simulation.
 * This ensures exported/downloaded files are real, playable WAV audio files.
 */
export function createWavBlob(text, durationSec = 3.5, sampleRate = 44100) {
  const numChannels = 1;
  const numSamples = Math.floor(durationSec * sampleRate);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // RIFF chunk length
  view.setUint32(4, 36 + numSamples * 2, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (1 = PCM)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, numChannels, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * numChannels * 2, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, numChannels * 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, numSamples * 2, true);

  // Write synthesized soothing voice-like harmonic waveform
  const baseFreq = 220;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Harmonic series with gentle envelope
    const envelope = Math.sin((Math.PI * i) / numSamples);
    const sample = envelope * 0.3 * (
      0.6 * Math.sin(2 * Math.PI * baseFreq * t) +
      0.3 * Math.sin(4 * Math.PI * baseFreq * t) +
      0.1 * Math.sin(6 * Math.PI * baseFreq * t)
    );
    const s = Math.max(-1, Math.min(1, sample));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Generate an array of normalized heights for waveform rendering
 */
export function generateWaveformData(seed = 'studio', count = 48) {
  const bars = [];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  for (let i = 0; i < count; i++) {
    // Generate pseudo-random value between 0.15 and 0.95
    const pseudo = Math.abs(Math.sin((hash + i * 13) * 0.1));
    const bellCurve = Math.sin((Math.PI * i) / count);
    const val = Math.max(0.12, Math.min(0.98, pseudo * 0.6 + bellCurve * 0.4));
    bars.push(Number(val.toFixed(2)));
  }
  return bars;
}
