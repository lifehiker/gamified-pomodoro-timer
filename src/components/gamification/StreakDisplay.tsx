"use client";

interface StreakDisplayProps {
  streak: number;
  compact?: boolean;
}

export function StreakDisplay({ streak, compact = false }: StreakDisplayProps) {
  if (streak === 0) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-base">&#128293;</span>
        <span className="font-orbitron text-xs font-bold text-neon-orange">{streak}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-orange/10 border border-neon-orange/30">
      <span className="text-2xl">&#128293;</span>
      <div>
        <div className="font-orbitron text-lg font-black text-neon-orange">{streak} DAY STREAK</div>
        <div className="font-mono text-xs text-gray-400">Keep it up!</div>
      </div>
    </div>
  );
}
