import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_VOICES } from '../data/mockVoices';

const VoiceContext = createContext();

const STORAGE_KEY = 'ai_voice_studio_custom_voices';

export function VoiceProvider({ children }) {
  const [voices, setVoices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Combine initial built-in voices with any newly added custom voices
        const builtIn = INITIAL_VOICES.filter(v => !v.isCustom);
        const storedCustom = parsed.filter(v => v.isCustom);
        // Include initial custom ones if not already present
        const initialCustom = INITIAL_VOICES.filter(v => v.isCustom);
        const combinedCustom = [...storedCustom];
        initialCustom.forEach(ic => {
          if (!combinedCustom.find(c => c.id === ic.id)) {
            combinedCustom.push(ic);
          }
        });
        return [...builtIn, ...combinedCustom];
      }
    } catch (e) {
      console.warn('Could not load custom voices from storage', e);
    }
    return INITIAL_VOICES;
  });

  const [selectedVoiceId, setSelectedVoiceId] = useState('v-evelyn');

  // Save custom voices to localStorage
  useEffect(() => {
    try {
      const customVoices = voices.filter(v => v.isCustom);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customVoices));
    } catch (e) {
      console.warn('Could not save custom voices to storage', e);
    }
  }, [voices]);

  const selectedVoice = voices.find(v => v.id === selectedVoiceId) || voices[0];

  const addCustomVoice = (voiceData) => {
    const newVoice = {
      id: `v-custom-${Date.now()}`,
      createdDate: new Date().toISOString(),
      popularity: 75,
      isCustom: true,
      isFavorite: false,
      avatar: voiceData.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      sampleDuration: voiceData.sampleDuration || 4.5,
      ...voiceData,
    };
    setVoices(prev => [newVoice, ...prev]);
    return newVoice;
  };

  const editCustomVoice = (id, updatedData) => {
    setVoices(prev => prev.map(v => {
      if (v.id === id) {
        return { ...v, ...updatedData };
      }
      return v;
    }));
  };

  const deleteCustomVoice = (id) => {
    setVoices(prev => prev.filter(v => v.id !== id));
    if (selectedVoiceId === id) {
      setSelectedVoiceId('v-evelyn');
    }
  };

  const toggleFavorite = (id) => {
    setVoices(prev => prev.map(v => {
      if (v.id === id) {
        return { ...v, isFavorite: !v.isFavorite };
      }
      return v;
    }));
  };

  return (
    <VoiceContext.Provider value={{
      voices,
      selectedVoice,
      selectedVoiceId,
      setSelectedVoiceId,
      addCustomVoice,
      editCustomVoice,
      deleteCustomVoice,
      toggleFavorite
    }}>
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
}
