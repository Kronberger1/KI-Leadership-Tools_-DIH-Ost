import React from 'react';

interface Props {
  value: number;  // 0–100
  color?: string;
  height?: number;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<Props> = ({
  value,
  color = '#0d9488',
  height = 8,
  showLabel = false,
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="flex items-center gap-2 w-full">
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height, backgroundColor: '#e5e7eb' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500 w-10 text-right">{Math.round(clamped)}%</span>
      )}
    </div>
  );
};
