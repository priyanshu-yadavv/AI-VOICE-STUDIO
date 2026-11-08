import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { playSyntheticSpeech, createWavBlob, downloadBlob } from '../utils/audioHelpers';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  const activeSpeechController = useRef(null);
  const progressTimerRef = useRef(null);

  const stopActiveAudio = () => {
    if (activeSpeechController.current) {
      activeSpeechController.current.stop();
      activeSpeechController.current = null;
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const playTrack = (track) => {
    // track = { id, title, text, voiceName, duration, speed, pitch, gender, lang }
    stopActiveAudio();

    const trackDuration = track.duration || 4.5;
    setCurrentTrack(track);
    setDuration(trackDuration);
    setCurrentTime(0);
    setIsPlaying(true);

    const controller = playSyntheticSpeech(track.text || track.title || 'Studio preview audio track', {
      speed: (track.speed || 1.0) * playbackRate,
      pitch: track.pitch ? 1.0 + (track.pitch / 50) : 1.0,
      gender: track.gender || 'neutral',
      lang: track.lang || 'en-US',
      onStart: () => {
        setIsPlaying(true);
      },
      onEnd: () => {
        setIsPlaying(false);
        setCurrentTime(trackDuration);
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
          progressTimerRef.current = null;
        }
      }
    });

    activeSpeechController.current = controller;

    // Start progress timer to update playback position
    const startTime = Date.now();
    progressTimerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000 * playbackRate;
      if (elapsed >= trackDuration) {
        setCurrentTime(trackDuration);
        setIsPlaying(false);
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      } else {
        setCurrentTime(elapsed);
      }
    }, 100);
  };

  const pauseTrack = () => {
    stopActiveAudio();
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    if (currentTrack) {
      playTrack({ ...currentTrack, initialOffset: currentTime });
    }
  };

  const togglePlayTrack = (track) => {
    if (currentTrack && currentTrack.id === track.id && isPlaying) {
      pauseTrack();
    } else {
      playTrack(track);
    }
  };

  const seekTo = (seconds) => {
    const clamped = Math.max(0, Math.min(duration, seconds));
    setCurrentTime(clamped);
    if (isPlaying && currentTrack) {
      playTrack({ ...currentTrack, initialOffset: clamped });
    }
  };

  const closePlayer = () => {
    stopActiveAudio();
    setCurrentTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const downloadTrack = (track) => {
    const target = track || currentTrack;
    if (!target) return;
    const blob = createWavBlob(target.text || target.title, target.duration || 4.0);
    const filename = `${(target.title || 'audio_studio').toLowerCase().replace(/[^a-z0-9]/g, '_')}.wav`;
    downloadBlob(blob, filename);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopActiveAudio();
  }, []);

  return (
    <AudioContext.Provider value={{
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      playbackRate,
      setVolume,
      setPlaybackRate,
      playTrack,
      pauseTrack,
      resumeTrack,
      togglePlayTrack,
      seekTo,
      closePlayer,
      downloadTrack
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
