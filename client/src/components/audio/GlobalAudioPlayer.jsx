import React from 'react';
import { Play, Pause, X, Download, Volume2, VolumeX, FastForward } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { formatTime } from '../../utils/formatters';
import WaveformVisualizer from './WaveformVisualizer';
import Badge from '../common/Badge';

export default function GlobalAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    setPlaybackRate,
    volume,
    setVolume,
    togglePlayTrack,
    seekTo,
    closePlayer,
    downloadTrack
  } = useAudio();

  if (!currentTrack) return null;

  const progress = duration > 0 ? currentTime / duration : 0;

  const handleSeekWaveform = (ratio) => {
    seekTo(ratio * duration);
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 0.75];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    setPlaybackRate(speeds[nextIdx]);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2DDD3] shadow-float px-4 md:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
        
        {/* Track Info */}
        <div className="flex items-center space-x-3.5 min-w-[200px] w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E2DDD3] flex items-center justify-center shrink-0">
            <span className="text-base font-bold text-[#C27847]">🎙️</span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-[#1F1D1A] truncate">
              {currentTrack.title || 'Studio Audio Preview'}
            </h4>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-xs text-[#68645D] truncate">{currentTrack.voiceName || 'AI Voice'}</span>
              {currentTrack.emotion && (
                <Badge variant="accent" size="xs">{currentTrack.emotion}</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Center: Controls & Waveform */}
        <div className="flex-1 w-full max-w-2xl flex flex-col items-center">
          <div className="w-full flex items-center space-x-4">
            {/* Play/Pause Button */}
            <button
              onClick={() => togglePlayTrack(currentTrack)}
              className="w-10 h-10 rounded-full bg-[#C27847] hover:bg-[#AA6536] text-white flex items-center justify-center transition shadow-sm shrink-0 active:scale-95 cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            {/* Time Stamp Current */}
            <span className="text-xs font-mono text-[#68645D] shrink-0 w-9 text-right">
              {formatTime(currentTime)}
            </span>

            {/* Waveform Scrubber */}
            <div className="flex-1 px-1">
              <WaveformVisualizer
                seed={currentTrack.id || currentTrack.title || 'track'}
                barsCount={56}
                progress={progress}
                isPlaying={isPlaying}
                onSeek={handleSeekWaveform}
                height={32}
              />
            </div>

            {/* Total Duration */}
            <span className="text-xs font-mono text-[#68645D] shrink-0 w-9">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right Actions: Speed, Volume, Download, Close */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Speed Toggle */}
          <button
            onClick={cycleSpeed}
            className="px-2 py-1 text-xs font-semibold rounded-lg bg-[#FAF8F5] hover:bg-[#F4F1EA] text-[#68645D] hover:text-[#1F1D1A] border border-[#E2DDD3] transition flex items-center space-x-1"
            title="Toggle playback speed"
          >
            <FastForward className="w-3 h-3 text-[#C27847]" />
            <span>{playbackRate}x</span>
          </button>

          {/* Download button */}
          <button
            onClick={() => downloadTrack(currentTrack)}
            className="p-2 rounded-lg text-[#68645D] hover:text-[#1F1D1A] hover:bg-[#FAF8F5] border border-transparent hover:border-[#E2DDD3] transition"
            title="Download Audio (WAV)"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Close */}
          <button
            onClick={closePlayer}
            className="p-2 rounded-lg text-[#68645D] hover:text-rose-600 hover:bg-rose-50 transition"
            title="Close Player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
