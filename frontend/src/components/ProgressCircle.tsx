import React from 'react';

interface ProgressCircleProps {
  progress: number;
  size?: number;
}

export default function ProgressCircle({ progress, size = 48 }: ProgressCircleProps) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  let color = 'var(--alert)';
  if (progress >= 80) color = 'var(--flash)';
  else if (progress >= 40) color = 'var(--gold)';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--d4)"
        strokeWidth={3}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease' }}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize={size < 48 ? 9 : 11}
        fontWeight={700}
        fontFamily="Inter, sans-serif"
      >
        {progress}%
      </text>
    </svg>
  );
}
