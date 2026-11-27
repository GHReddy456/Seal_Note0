import React from 'react';
import {
  Heart,
  Sun,
  CloudRain,
  PaperPlaneTilt,
  Campfire,
  Mountains,
  Sparkle,
  FlowerLotus,
} from '@phosphor-icons/react';

const EMOTION_ICON_MAP = {
  love: Heart,
  happiness: Sun,
  sadness: CloudRain,
  missing: PaperPlaneTilt,
  friendship: Campfire,
  motivation: Mountains,
  gratitude: Sparkle,
  apology: FlowerLotus,
};

export function EmotionIcon({ emotionId, size = 18, weight = 'regular', className = '', style }) {
  const Icon = EMOTION_ICON_MAP[emotionId] || Sparkle;
  return <Icon size={size} weight={weight} className={className} style={style} aria-hidden="true" />;
}

export function BrandMonogram({ className = 'w-6 h-6' }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="1" y="1" width="26" height="26" rx="7" fill="#080808" stroke="#242424" strokeWidth="1" />
      <rect x="4" y="4" width="20" height="20" rx="4" fill="#080808" />
      <path d="M8.5 10.5L12.5 14L8.5 17.5" stroke="#FFF9F7" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 17.5H19.5" stroke="#F4510B" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
