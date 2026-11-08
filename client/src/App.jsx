import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import TextToVoice from './pages/TextToVoice';
import VoiceLibrary from './pages/VoiceLibrary';
import AddCustomVoice from './pages/AddCustomVoice';
import VoiceCloning from './pages/VoiceCloning';
import AudioHistory from './pages/AudioHistory';
import Settings from './pages/Settings';
import { AudioProvider } from './context/AudioContext';
import { VoiceProvider } from './context/VoiceContext';
import { HistoryProvider } from './context/HistoryContext';
import { ToastProvider } from './context/ToastContext';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <VoiceProvider>
          <HistoryProvider>
            <AudioProvider>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="text-to-voice" element={<TextToVoice />} />
                  <Route path="voice-library" element={<VoiceLibrary />} />
                  <Route path="add-custom-voice" element={<AddCustomVoice />} />
                  <Route path="voice-cloning" element={<VoiceCloning />} />
                  <Route path="audio-history" element={<AudioHistory />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </AudioProvider>
          </HistoryProvider>
        </VoiceProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
