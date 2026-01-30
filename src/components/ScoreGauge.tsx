import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { ScoreCategory } from '@/types';

interface ScoreGaugeProps {
  score: number;
  category: ScoreCategory;
  size?: number;
  strokeWidth?: number;
}

const categoryLabels: Record<ScoreCategory, string> = {
  excellent: 'Excellent',
  good: 'Good',
  'needs-improvement': 'Needs Improvement',
  poor: 'Poor',
};

const categoryColors: Record<ScoreCategory, string> = {
  excellent: '#00FF88',
  good: '#00F0FF',
  'needs-improvement': '#FFD700',
  poor: '#FF0055',
};

export function ScoreGauge({
  score,
  category,
  size = 180,
  strokeWidth = 12,
}: ScoreGaugeProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  useEffect(() => {
    // Animate the gauge fill
    if (circleRef.current) {
      gsap.fromTo(
        circleRef.current,
        { strokeDashoffset: circumference },
        {
          strokeDashoffset,
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)',
        }
      );
    }
    
    // Animate the score number
    if (scoreRef.current) {
      gsap.fromTo(
        { value: 0 },
        { value: score },
        {
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: function () {
            if (scoreRef.current) {
              scoreRef.current.textContent = Math.round(this.targets()[0].value).toString();
            }
          },
        }
      );
    }
  }, [score, strokeDashoffset, circumference]);
  
  const color = categoryColors[category];
  
  return (
    <div className="flex flex-col items-center" role="region" aria-label={`Accessibility score: ${score} out of 100, ${categoryLabels[category]}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
          aria-hidden="true"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#2A2A35"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            style={{
              filter: `drop-shadow(0 0 8px ${color}40)`,
            }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            ref={scoreRef}
            className="text-4xl font-bold font-['Rajdhani']"
            style={{ color }}
            aria-hidden="true"
          >
            0
          </span>
          <span className="text-xs text-gray-400 mt-1">/ 100</span>
        </div>
      </div>
      {/* Category label */}
      <div className="mt-4 text-center">
        <span
          className="text-lg font-semibold font-['Rajdhani']"
          style={{ color }}
        >
          {categoryLabels[category]}
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center max-w-[200px]">
        Based on automated checks only
      </p>
    </div>
  );
}

export default ScoreGauge;
