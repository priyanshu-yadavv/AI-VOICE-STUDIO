import React, { useMemo } from 'react';
import { generateWaveformData } from '../../utils/audioHelpers';

export default function WaveformVisualizer({
  seed = 'studio',
  barsCount = 48,
  progress = 0, // 0 to 1
  isPlaying = false,
  onSeek,
  height = 42,
  barWidth = 3,
  barGap = 2,
  className = ''
}) {
  const bars = useMemo(() => {
    return generateWaveformData(seed, barsCount);
  }, [seed, barsCount]);

  const handleClick = (e) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(clickRatio);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative flex items-center justify-between w-full select-none ${onSeek ? 'cursor-pointer group' : ''} ${className}`}
      style={{ height: `${height}px` }}
      title={onSeek ? "Click to seek" : undefined}
    >
      <div className="flex items-center justify-between w-full h-full gap-[2px]">
        {bars.map((bar, index) => {
          const barProgress = index / barsCount;
          const isPassed = barProgress <= progress;
          const barHeightPx = Math.max(4, Math.round(bar * height));

          // Active playing wave wobble
          const isCurrentActive = isPlaying && Math.abs(barProgress - progress) < 0.08;

          return (
            <div
              key={index}
              className="flex-1 rounded-full transition-all duration-75"
              style={{
                height: `${barHeightPx}px`,
                backgroundColor: isPassed ? '#C27847' : '#E2DDD3',
                transform: isCurrentActive ? 'scaleY(1.25)' : 'scaleY(1)',
                opacity: isPassed ? 1 : 0.85
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
