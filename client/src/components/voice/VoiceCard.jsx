import React from 'react';
import { Play, Pause, Heart, Sparkles, Trash2, Edit3, ArrowRight } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useVoice } from '../../context/VoiceContext';
import { useNavigate } from 'react-router-dom';
import Badge from '../common/Badge';

export default function VoiceCard({
  voice,
  onEdit,
  onDelete,
  selectable = false,
  isSelected = false,
  onSelect
}) {
  const { currentTrack, isPlaying, togglePlayTrack } = useAudio();
  const { toggleFavorite, setSelectedVoiceId } = useVoice();
  const navigate = useNavigate();

  const isCurrentAudio = currentTrack && currentTrack.id === `preview-${voice.id}`;
  const isAudioPlaying = isCurrentAudio && isPlaying;

  const handlePreview = (e) => {
    e.stopPropagation();
    togglePlayTrack({
      id: `preview-${voice.id}`,
      title: `${voice.name} — Voice Preview`,
      text: voice.previewText || `Hello! This is a voice preview for ${voice.name}. The audio studio is ready for your text.`,
      voiceName: voice.name,
      duration: voice.sampleDuration || 4.5,
      gender: voice.gender,
      lang: voice.languageCode || 'en-US'
    });
  };

  const handleUseInTts = (e) => {
    e.stopPropagation();
    setSelectedVoiceId(voice.id);
    navigate('/text-to-voice');
  };

  return (
    <div
      onClick={selectable && onSelect ? () => onSelect(voice) : undefined}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between ${
        isSelected
          ? 'border-[#C27847] ring-2 ring-[#C27847]/20 shadow-card'
          : 'border-[#E2DDD3] hover:border-[#D5CEBF] hover:shadow-card'
      } ${selectable ? 'cursor-pointer' : ''}`}
    >
      <div>
        {/* Top Header: Avatar, Name, Accent & Favorite */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={voice.avatar}
                alt={voice.name}
                className="w-12 h-12 rounded-xl object-cover border border-[#E2DDD3] shadow-subtle group-hover:scale-105 transition duration-200"
              />
              <button
                onClick={handlePreview}
                className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center transition shadow-sm ${
                  isAudioPlaying
                    ? 'bg-[#1F1D1A] text-white scale-110'
                    : 'bg-[#C27847] text-white hover:bg-[#AA6536]'
                }`}
                title={isAudioPlaying ? "Pause sample" : "Play sample preview"}
              >
                {isAudioPlaying ? (
                  <Pause className="w-3 h-3 fill-current" />
                ) : (
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                )}
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <h4 className="text-sm font-bold text-[#1F1D1A] truncate group-hover:text-[#C27847] transition">
                  {voice.name}
                </h4>
                {voice.isCustom && (
                  <Badge variant="accent" size="xs">Custom</Badge>
                )}
              </div>
              <p className="text-xs text-[#68645D] truncate mt-0.5">
                {voice.accent} • {voice.gender.charAt(0).toUpperCase() + voice.gender.slice(1)}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(voice.id);
            }}
            className={`p-1.5 rounded-lg transition ${
              voice.isFavorite
                ? 'text-rose-500 hover:text-rose-600 bg-rose-50'
                : 'text-[#68645D] hover:text-[#1F1D1A] hover:bg-[#FAF8F5]'
            }`}
            title={voice.isFavorite ? "Remove favorite" : "Add to favorites"}
          >
            <Heart className={`w-4 h-4 ${voice.isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-[#68645D] line-clamp-2 mb-3.5 leading-relaxed">
          {voice.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge variant="neutral" size="xs">{voice.category || voice.style}</Badge>
          {voice.tags?.slice(0, 2).map((tag, idx) => (
            <Badge key={idx} variant="neutral" size="xs">{tag}</Badge>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-[#F4F1EA] flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1">
          {voice.isCustom && onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(voice);
              }}
              className="p-1.5 text-[#68645D] hover:text-[#1F1D1A] hover:bg-[#FAF8F5] rounded-lg transition"
              title="Edit Voice Profile"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}

          {voice.isCustom && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(voice);
              }}
              className="p-1.5 text-[#68645D] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Delete Custom Voice"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {!selectable && (
          <button
            onClick={handleUseInTts}
            className="inline-flex items-center space-x-1 font-semibold text-[#C27847] hover:text-[#AA6536] transition group-hover:translate-x-0.5 py-1 px-2 rounded-lg hover:bg-[#FBF3ED]"
          >
            <span>Use Voice</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}

        {selectable && (
          <span className={`font-medium ${isSelected ? 'text-[#C27847]' : 'text-[#68645D]'}`}>
            {isSelected ? '✓ Selected' : 'Click to select'}
          </span>
        )}
      </div>
    </div>
  );
}
