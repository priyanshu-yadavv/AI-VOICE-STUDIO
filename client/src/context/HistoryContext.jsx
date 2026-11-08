import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_HISTORY } from '../data/mockHistory';

const HistoryContext = createContext();

const STORAGE_KEY = 'ai_voice_studio_audio_history';

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load history from storage', e);
    }
    return INITIAL_HISTORY;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Could not save history to storage', e);
    }
  }, [history]);

  const addHistoryItem = (item) => {
    const newItem = {
      id: `hist-${Date.now()}`,
      createdAt: new Date().toISOString(),
      format: item.format || 'WAV',
      fileSize: item.fileSize || Math.floor((item.duration || 10) * 88200),
      sampleRate: item.sampleRate || 48000,
      ...item
    };
    setHistory(prev => [newItem, ...prev]);
    return newItem;
  };

  const deleteHistoryItem = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <HistoryContext.Provider value={{
      history,
      addHistoryItem,
      deleteHistoryItem,
      clearHistory
    }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
