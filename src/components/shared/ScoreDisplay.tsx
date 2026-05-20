import React from 'react';
import { LEVEL_COLORS } from '../../data/competencies';

interface Props {
  score: number;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_CLASSES = {
  sm: 'text-lg font-bold',
  md: 'text-2xl font-bold',
  lg: 'text-4xl font-bold',
  xl: 'text-6xl font-bold',
};

function scoreColor(score: number): string {
  if (score >= 4) return LEVEL_COLORS[4];
  if (score >= 3) return LEVEL_COLORS[3];
  if (score >= 2) return LEVEL_COLORS[2];
  if (score >= 1) return LEVEL_COLORS[1];
  return LEVEL_COLORS[0];
}

export const ScoreDisplay: React.FC<Props> = ({ score, maxScore = 4, size = 'md' }) => {
  return (
    <span className={SIZE_CLASSES[size]} style={{ color: scoreColor(score) }}>
      {score.toFixed(1)}
      <span className="text-gray-400 font-normal text-sm ml-1">/ {maxScore}</span>
    </span>
  );
};
