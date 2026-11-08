import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Library,
  Search,
  Plus,
  Filter,
  Sparkles,
  Heart,
  Mic,
  Volume2,
  Trash2,
  Edit3
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import VoiceCard from '../components/voice/VoiceCard';
import { useVoice } from '../context/VoiceContext';
import { useToast } from '../context/ToastContext';

const CATEGORIES = [
  "All Categories",
  "Narrative",
  "Conversational",
  "Corporate",
  "Audiobook",
  "Meditation",
  "E-Learning",
  "Commercial",
  "Custom Clone"
];

export default function VoiceLibrary() {
  const navigate = useNavigate();
  const { voices, deleteCustomVoice, editCustomVoice } = useVoice();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [onlyCustom, setOnlyCustom] = useState(false);

  // Edit Modal State
  const [editingVoice, setEditingVoice] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAccent, setEditAccent] = useState('');

  // Delete Modal State
  const [deletingVoice, setDeletingVoice] = useState(null);

  const filteredVoices = voices.filter(voice => {
    const matchesSearch =
      voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.accent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGender = selectedGender === 'all' || voice.gender === selectedGender;
    const matchesCategory =
      selectedCategory === 'All Categories' ||
      voice.category === selectedCategory ||
      (selectedCategory === 'Custom Clone' && voice.isCustom);

    const matchesFavorite = !onlyFavorites || voice.isFavorite;
    const matchesCustom = !onlyCustom || voice.isCustom;

    return matchesSearch && matchesGender && matchesCategory && matchesFavorite && matchesCustom;
  });

  const handleOpenEdit = (voice) => {
    setEditingVoice(voice);
    setEditName(voice.name);
    setEditDescription(voice.description);
    setEditAccent(voice.accent);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Voice name is required', 'error');
      return;
    }
    editCustomVoice(editingVoice.id, {
      name: editName.trim(),
      description: editDescription.trim(),
      accent: editAccent.trim(),
    });
    setEditingVoice(null);
    showToast(`Updated voice profile "${editName}"`, 'success');
  };

  const handleConfirmDelete = () => {
    if (deletingVoice) {
      deleteCustomVoice(deletingVoice.id);
      showToast(`Removed custom voice "${deletingVoice.name}"`, 'info');
      setDeletingVoice(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1F1D1A]">Acoustic Voice Library</h2>
          <p className="text-xs text-[#68645D] mt-0.5">
            Browse {voices.length} calibrated voices or add your own custom vocal identity
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => navigate('/add-custom-voice')}
        >
          Add Custom Voice
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="!p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#9E988F]" />
            <input
              type="text"
              placeholder="Search by voice name, accent, or characteristics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF8F5] border border-[#E2DDD3] rounded-xl focus:border-[#C27847] outline-none"
            />
          </div>

          {/* Gender Filter */}
          <div className="flex items-center space-x-1.5 shrink-0">
            {['all', 'female', 'male'].map(gender => (
              <button
                key={gender}
                onClick={() => setSelectedGender(gender)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl capitalize transition border ${
                  selectedGender === gender
                    ? 'bg-[#1F1D1A] text-white border-[#1F1D1A]'
                    : 'bg-[#FAF8F5] text-[#68645D] border-[#E2DDD3] hover:text-[#1F1D1A]'
                }`}
              >
                {gender === 'all' ? 'All Genders' : gender}
              </button>
            ))}
          </div>

          {/* Favorites & Custom Toggle Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setOnlyFavorites(prev => !prev)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl flex items-center space-x-1.5 border transition ${
                onlyFavorites
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-[#FAF8F5] border-[#E2DDD3] text-[#68645D] hover:text-[#1F1D1A]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current' : ''}`} />
              <span>Favorites</span>
            </button>

            <button
              onClick={() => setOnlyCustom(prev => !prev)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl flex items-center space-x-1.5 border transition ${
                onlyCustom
                  ? 'bg-[#FAF3EC] border-[#C27847] text-[#C27847]'
                  : 'bg-[#FAF8F5] border-[#E2DDD3] text-[#68645D] hover:text-[#1F1D1A]'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Custom Only</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-2 border-t border-[#F4F1EA]">
          <span className="text-[11px] font-semibold text-[#68645D] shrink-0 mr-1">Category:</span>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-xs rounded-full shrink-0 transition ${
                selectedCategory === category
                  ? 'bg-[#C27847] text-white font-medium'
                  : 'bg-[#FAF8F5] hover:bg-[#F4F1EA] text-[#68645D] hover:text-[#1F1D1A] border border-[#E2DDD3]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </Card>

      {/* Voice Cards Grid */}
      {filteredVoices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVoices.map(voice => (
            <VoiceCard
              key={voice.id}
              voice={voice}
              onEdit={voice.isCustom ? handleOpenEdit : undefined}
              onDelete={voice.isCustom ? () => setDeletingVoice(voice) : undefined}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No voice profiles match your filters"
          description="Try broadening your search keywords, clearing selected category filters, or add a custom voice."
          actionLabel="Clear All Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedGender('all');
            setSelectedCategory('All Categories');
            setOnlyFavorites(false);
            setOnlyCustom(false);
          }}
        />
      )}

      {/* Edit Voice Modal */}
      <Modal
        isOpen={!!editingVoice}
        onClose={() => setEditingVoice(null)}
        title="Edit Custom Voice Profile"
        subtitle="Update voice persona details, accent, and descriptions"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1F1D1A] mb-1">
              Voice Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E2DDD3] rounded-xl focus:border-[#C27847] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F1D1A] mb-1">
              Accent / Dialect
            </label>
            <input
              type="text"
              value={editAccent}
              onChange={(e) => setEditAccent(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E2DDD3] rounded-xl focus:border-[#C27847] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F1D1A] mb-1">
              Description & Style Notes
            </label>
            <textarea
              rows={3}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full p-3 text-xs bg-[#FAF8F5] border border-[#E2DDD3] rounded-xl focus:border-[#C27847] outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#F4F1EA]">
            <Button variant="ghost" size="sm" onClick={() => setEditingVoice(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingVoice}
        onClose={() => setDeletingVoice(null)}
        title="Delete Custom Voice"
        subtitle="Are you sure you want to delete this custom voice profile?"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#68645D] leading-relaxed">
            This will permanently remove <strong>{deletingVoice?.name}</strong> from your local studio library. Any generation history created with this voice will remain archived.
          </p>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setDeletingVoice(null)}>
              Keep Voice
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmDelete}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
