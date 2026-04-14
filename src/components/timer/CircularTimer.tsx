"use client";
import { getSessionColor } from "@/lib/utils";
import { SessionType } from "@/types";

interface CircularTimerProps {
  progress: number;
  sessionType: SessionType;
  size?: number;
}

export function CircularTimer({ progress, sessionType, size = 280 }: CircularTimerProps) {
  const color = getSessionColor(sessionType);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1a1a2e" strokeWidth="10" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{
          filter: `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 16px ${color}40)`,
          transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease",
        }}
      />
    </svg>
  );
}