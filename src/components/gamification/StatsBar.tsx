"use client";
import { useTimer } from "@/providers/TimerProvider";
import { XPBar } from "./XPBar";
import { StreakDisplay } from "./StreakDisplay";

interface StatsBarProps {
  streak?: number;
  todaySessions?: number;
  dailyGoal?: number;
}

export function StatsBar({ streak = 0, todaySessions = 0, dailyGoal = 8 }: StatsBarProps) {
  const { state } = useTimer();
  const { totalPoints, sessionsCompleted } = state;

  const displaySessions = todaySessions + sessionsCompleted;

  return (
    <div className="space-y-4">
      <XPBar totalPoints={totalPoints} />
      {streak > 0 && <StreakDisplay streak={streak} />}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0d0d20] rounded-lg p-3 border border-[#2a2a3e]">
          <div className="font-mono text-xs text-gray-500 mb-1">TODAY</div>
          <div className="font-orbitron text-2xl font-bold text-white">
            {displaySessions}<span className="text-gray-500 text-sm font-mono">/{dailyGoal}</span>
          </div>
        </div>
        <div className="bg-[#0d0d20] rounded-lg p-3 border border-[#2a2a3e]">
          <div className="font-mono text-xs text-gray-500 mb-1">POINTS</div>
          <div className="font-orbitron text-2xl font-bold text-neon-green">{totalPoints}</div>
        </div>
      </div>
    </div>
  );
}
