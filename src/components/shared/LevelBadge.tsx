import React from 'react';
import { LEVEL_LABELS, LEVEL_COLORS } from '../../data/competencies';

interface Props {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const SIZE_CLASSES = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

export const LevelBadge: React.FC<Props> = ({ level, size = 'md', showLabel = false }) => {
  const color = LEVEL_COLORS[level] ?? '#9ca3af';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${SIZE_CLASSES[size]}`}
      style={{
        backgroundColor: color + '22',
        color: color,
        border: `1px solid ${color}55`,
      }}
    >
      <span
        className="inline-block rounded-full"
        style={{ width: 8, height: 8, backgroundColor: color }}
      />
      {showLabel ? LEVEL_LABELS[level] : `Level ${level}`}
    </span>
  );
};
