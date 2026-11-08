import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import GlobalAudioPlayer from '../audio/GlobalAudioPlayer';
import { useAudio } from '../../context/AudioContext';

const PAGE_META = {
  '/': { title: 'Studio Dashboard', subtitle: 'Overview of synthesis quotas, voice profiles & recent activity' },
  '/text-to-voice': { title: 'Text to Voice Studio', subtitle: 'Craft, preview, and export high-fidelity speech' },
  '/voice-library': { title: 'Voice Profile Library', subtitle: 'Curated studio voices and custom fine-tuned profiles' },
  '/add-custom-voice': { title: 'Add Custom Voice', subtitle: 'Upload audio, record via microphone, or link external voice IDs' },
  '/voice-cloning': { title: 'Voice Cloning Pipeline', subtitle: 'Consent verification, acoustic dataset preparation & queue' },
  '/audio-history': { title: 'Audio History & Exports', subtitle: 'Manage, re-open, and download your generated master tracks' },
  '/settings': { title: 'Studio Settings & API', subtitle: 'Preferences, audio defaults, and FastAPI backend scaffolding' },
};

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentTrack } = useAudio();

  const currentMeta = PAGE_META[location.pathname] || {
    title: 'AI Voice Studio',
    subtitle: 'Text-to-speech studio platform'
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1D1A] flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          title={currentMeta.title}
          subtitle={currentMeta.subtitle}
        />

        <main className={`flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full transition-all ${
          currentTrack ? 'pb-32' : 'pb-16'
        }`}>
          <Outlet />
        </main>
      </div>

      {/* Global Bottom Audio Player */}
      <GlobalAudioPlayer />
    </div>
  );
}
