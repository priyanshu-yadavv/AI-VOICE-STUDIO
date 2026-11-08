import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  Download,
  Trash2,
  Play,
  Pause,
  ExternalLink,
  Volume2,
  Calendar,
  Layers,
  LayoutGrid,
  List,
  Sparkles
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import WaveformVisualizer from '../components/audio/WaveformVisualizer';
import { useHistory } from '../context/HistoryContext';
import { useAudio } from '../context/AudioContext';
import { useVoice } from '../context/VoiceContext';
import { useToast } from '../context/ToastContext';
import { formatTime, formatDate, formatRelativeTime, formatBytes } from '../utils/formatters';

export default function AudioHistory() {
  const navigate = useNavigate();
  const { history, deleteHistoryItem, clearHistory } = useHistory();
  const { currentTrack, isPlaying, togglePlayTrack, seekTo, downloadTrack } = useAudio();
  const { setSelectedVoiceId } = useVoice();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isClearingAll, setIsClearingAll] = useState(false);

  const filteredHistory = history.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.textSnippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.voiceName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFormat = formatFilter === 'ALL' || item.format === formatFilter;

    return matchesSearch && matchesFormat;
  });

  const handleReopenInEditor = (item) => {
    if (item.voiceId) {
      setSelectedVoiceId(item.voiceId);
    }
    navigate('/text-to-voice');
    showToast(`Loaded "${item.title}" into synthesis workspace`, 'info');
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteHistoryItem(itemToDelete.id);
      showToast(`Deleted "${itemToDelete.title}"`, 'info');
      setItemToDelete(null);
    }
  };

  const handleClearAllConfirm = () => {
    clearHistory();
    setIsClearingAll(false);
    showToast('All audio history records cleared', 'info');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1F1D1A]">Generated Audio Archive</h2>
          <p className="text-xs text-[#68645D] mt-0.5">
            Access, play, re-open, and export master audio files created across your studio sessions
          </p>
        </div>

        {history.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200"
            icon={Trash2}
            onClick={() => setIsClearingAll(true)}
          >
            Clear History
          </Button>
        )}
      </div>

      {/* Filter and View Mode Bar */}
      <Card className="!p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#9E988F]" />
            <input
              type="text"
              placeholder="Search history by title, script, or voice persona..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF8F5] border border-[#E2DDD3] rounded-xl focus:border-[#C27847] outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            {/* Format Filter */}
            <div className="flex items-center space-x-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E2DDD3]">
              {['ALL', 'WAV', 'MP3'].map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setFormatFilter(fmt)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    formatFilter === fmt
                      ? 'bg-white text-[#C27847] shadow-2xs'
                      : 'text-[#68645D] hover:text-[#1F1D1A]'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E2DDD3]">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'list'
                    ? 'bg-white text-[#C27847] shadow-2xs'
                    : 'text-[#68645D] hover:text-[#1F1D1A]'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#C27847] shadow-2xs'
                    : 'text-[#68645D] hover:text-[#1F1D1A]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* History Items Render */}
      {filteredHistory.length > 0 ? (
        viewMode === 'list' ? (
          /* LIST VIEW */
          <div className="space-y-3">
            {filteredHistory.map(item => {
              const isItemPlaying = currentTrack?.id === item.id && isPlaying;

              return (
                <Card
                  key={item.id}
                  className="!p-4 transition hover:border-[#D5CEBF] hover:shadow-card"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Play button & info */}
                    <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                      <button
                        onClick={() => togglePlayTrack({
                          id: item.id,
                          title: item.title,
                          text: item.textSnippet,
                          voiceName: item.voiceName,
                          duration: item.duration,
                          gender: 'neutral'
                        })}
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition shadow-sm ${
                          isItemPlaying
                            ? 'bg-[#1F1D1A] text-white'
                            : 'bg-[#FAF3EC] text-[#C27847] hover:bg-[#C27847] hover:text-white'
                        }`}
                        title={isItemPlaying ? "Pause Audio" : "Play Audio"}
                      >
                        {isItemPlaying ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-[#1F1D1A] truncate">
                            {item.title}
                          </h4>
                          <Badge variant="neutral" size="xs">{item.format}</Badge>
                        </div>
                        <p className="text-xs text-[#68645D] line-clamp-1 mt-1 font-normal">
                          "{item.textSnippet}"
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#9E988F] mt-2">
                          <span className="text-[#68645D] font-medium">Voice: {item.voiceName}</span>
                          <span>•</span>
                          <span>Duration: {formatTime(item.duration)}</span>
                          <span>•</span>
                          <span>Size: {formatBytes(item.fileSize)}</span>
                          <span>•</span>
                          <span>{formatRelativeTime(item.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center space-x-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F4F1EA]">
                      <button
                        onClick={() => handleReopenInEditor(item)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#68645D] hover:text-[#1F1D1A] hover:bg-[#FAF8F5] border border-[#E2DDD3] transition flex items-center space-x-1"
                        title="Re-open in Text to Voice Editor"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Edit Script</span>
                      </button>

                      <Button
                        variant="subtle"
                        size="sm"
                        icon={Download}
                        onClick={() => downloadTrack({
                          title: item.title,
                          text: item.textSnippet,
                          duration: item.duration
                        })}
                        title="Download audio"
                      >
                        Download
                      </Button>

                      <button
                        onClick={() => setItemToDelete(item)}
                        className="p-2 rounded-xl text-[#9E988F] hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete from history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHistory.map(item => {
              const isItemPlaying = currentTrack?.id === item.id && isPlaying;

              return (
                <Card
                  key={item.id}
                  className="flex flex-col justify-between hover:shadow-card transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="accent" size="xs">{item.voiceName}</Badge>
                      <Badge variant="neutral" size="xs">{item.format}</Badge>
                    </div>

                    <h4 className="text-sm font-bold text-[#1F1D1A] line-clamp-2 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#68645D] line-clamp-3 mb-4 leading-relaxed">
                      "{item.textSnippet}"
                    </p>

                    <div className="bg-[#FAF8F5] p-2 rounded-xl border border-[#E2DDD3] mb-4">
                      <WaveformVisualizer seed={item.id} barsCount={36} height={28} />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F4F1EA] flex items-center justify-between text-xs">
                    <span className="font-mono text-[#68645D]">
                      {formatTime(item.duration)} • {formatBytes(item.fileSize)}
                    </span>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => togglePlayTrack({
                          id: item.id,
                          title: item.title,
                          text: item.textSnippet,
                          voiceName: item.voiceName,
                          duration: item.duration,
                          gender: 'neutral'
                        })}
                        className="p-2 rounded-full bg-[#FAF3EC] text-[#C27847] hover:bg-[#C27847] hover:text-white transition"
                      >
                        {isItemPlaying ? (
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        )}
                      </button>

                      <button
                        onClick={() => downloadTrack({
                          title: item.title,
                          text: item.textSnippet,
                          duration: item.duration
                        })}
                        className="p-2 rounded-lg text-[#68645D] hover:text-[#1F1D1A] hover:bg-[#FAF8F5]"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setItemToDelete(item)}
                        className="p-2 rounded-lg text-[#68645D] hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )
      ) : (
        <EmptyState
          icon={History}
          title="No generated audio records found"
          description={
            searchQuery || formatFilter !== 'ALL'
              ? 'No records match your active search terms or filters.'
              : 'Your generated audio tracks will appear here once synthesized in the Text-to-Voice studio.'
          }
          actionLabel={searchQuery || formatFilter !== 'ALL' ? 'Clear Filters' : 'Go to Voice Studio'}
          onAction={() => {
            if (searchQuery || formatFilter !== 'ALL') {
              setSearchQuery('');
              setFormatFilter('ALL');
            } else {
              navigate('/text-to-voice');
            }
          }}
        />
      )}

      {/* Delete Item Confirmation Modal */}
      <Modal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        title="Delete Generated Audio Record"
        subtitle="This action will permanently delete this audio entry from your history."
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#68645D]">
            Are you sure you want to delete <strong>"{itemToDelete?.title}"</strong>?
          </p>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setItemToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmDelete}>
              Delete Record
            </Button>
          </div>
        </div>
      </Modal>

      {/* Clear All Modal */}
      <Modal
        isOpen={isClearingAll}
        onClose={() => setIsClearingAll(false)}
        title="Clear Entire Audio History"
        subtitle="Remove all saved generation history"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#68645D] leading-relaxed">
            This will permanently remove all {history.length} generated speech tracks from your local storage.
          </p>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsClearingAll(false)}>
              Keep History
            </Button>
            <Button variant="danger" size="sm" onClick={handleClearAllConfirm}>
              Clear Everything
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
