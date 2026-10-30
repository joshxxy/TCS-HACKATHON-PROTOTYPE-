import React from 'react';

interface SparklineProps {
  data: number[];
  nominal: number;
  critical: number;
  color?: string;
  height?: number;
  width?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  nominal,
  critical,
  color = '#10B981',
  height = 36,
  width = 120,
}) => {
  if (!data || data.length < 2) {
    return (
      <div
        className="flex items-center justify-center text-[10px] text-slate-500 font-mono"
        style={{ height, width }}
      >
        --
      </div>
    );
  }

  const minVal = Math.min(...data, nominal * 0.8);
  const maxVal = Math.max(...data, critical * 1.05);
  const range = maxVal - minVal || 1;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - 4) + 2;
    const y = height - 4 - ((val - minVal) / range) * (height - 8);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const currentVal = data[data.length - 1];
  const isNearCritical = currentVal >= critical * 0.95;
  const strokeColor = isNearCritical ? '#F43F5E' : color;

  return (
    <div className="relative inline-block" style={{ height, width }}>
      <svg
        width={width}
        height={height}
        className="overflow-visible"
        aria-hidden="true"
      >
        {/* Subtle guide line for nominal */}
        {nominal >= minVal && nominal <= maxVal && (
          <line
            x1="0"
            y1={height - 4 - ((nominal - minVal) / range) * (height - 8)}
            x2={width}
            y2={height - 4 - ((nominal - minVal) / range) * (height - 8)}
            stroke="#475569"
            strokeDasharray="2,2"
            strokeWidth="0.8"
            opacity="0.4"
          />
        )}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Highlight latest point */}
        <circle
          cx={(data.length - 1) / (data.length - 1) * (width - 4) + 2}
          cy={height - 4 - ((currentVal - minVal) / range) * (height - 8)}
          r="2.5"
          fill={strokeColor}
        />
      </svg>
    </div>
  );
};
