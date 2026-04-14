"use client";
import { getLevelFromPoints } from "@/lib/utils";

interface XPBarProps {
  totalPoints: number;
  compact?: boolean;
}

export function XPBar({ totalPoints, compact = false }: XPBarProps) {
  const { level, progress, pointsToNext } = getLevelFromPoints(totalPoints);
  const progressPercent = (progress / 100) * 100;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="font-orbitron text-xs font-bold text-neon-green">LVL {level}</div>
        <div className="flex-1 h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
          <div
            className="h-full bg-neon-green rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%`, boxShadow: "0 0 6px #00ff88" }}
          />
        </div>
        <div className="font-mono text-xs text-gray-500">{pointsToNext}xp</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-orbitron text-2xl font-black text-neon-green">LVL {level}</span>
        </div>
        <span className="font-mono text-sm text-gray-400">{totalPoints} pts total</span>
      </div>
      <div className="relative h-3 bg-[#1a1a2e] rounded-full overflow-hidden border border-[#2a2a3e]">
        <div
          className="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full transition-all duration-500"
          style={{
            width: `${progressPercent}%`,
            boxShadow: "0 0 8px #00ff88, 0 0 16px #00ff8840",
          }}
        />
      </div>
      <div className="flex justify-between">
        <span className="font-mono text-xs text-gray-500">{progress} / 100 xp</span>
        <span className="font-mono text-xs text-gray-500">{pointsToNext} xp to next level</span>
      </div>
    </div>
  );
}