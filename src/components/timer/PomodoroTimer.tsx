"use client";
import { useTimer } from "@/providers/TimerProvider";
import { CircularTimer } from "./CircularTimer";
import { formatTime, getSessionColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Focus, Bell, BellOff } from "lucide-react";
import { SessionType } from "@/types";
import { useEffect, useState } from "react";

const SESSION_LABELS: Record<SessionType, string> = {
  work: "FOCUS",
  short_break: "SHORT BREAK",
  long_break: "LONG BREAK",
};

export function PomodoroTimer() {
  const { state, start, pause, reset, setSessionType, toggleFocusMode, updateSettings } = useTimer();
  const { timeLeft, isRunning, sessionType, sessionsCompleted, settings, isFocusMode, level } = state;

  const maxTime = sessionType === "work"
    ? settings.workDuration * 60
    : sessionType === "short_break"
    ? settings.shortBreakDuration * 60
    : settings.longBreakDuration * 60;

  const progress = maxTime > 0 ? (maxTime - timeLeft) / maxTime : 0;
  const color = getSessionColor(sessionType);


  const [pointsAnimation, setPointsAnimation] = useState<number | null>(null);

  useEffect(() => {
    if (state.showLevelUp) {
      setPointsAnimation(level);
      const t = setTimeout(() => setPointsAnimation(null), 2000);
      return () => clearTimeout(t);
    }
  }, [state.showLevelUp, level]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-2 bg-[#0d0d20] rounded-lg p-1">
        {(["work", "short_break", "long_break"] as SessionType[]).map((type) => (
          <button
            key={type}
            onClick={() => setSessionType(type)}
            className={`px-4 py-2 rounded-md text-xs font-mono font-bold transition-all ${
              sessionType === type ? "text-[#0a0a18]" : "text-gray-500 hover:text-gray-300"
            }`}
            style={sessionType === type ? { backgroundColor: getSessionColor(type) } : {}}
          >
            {SESSION_LABELS[type]}
          </button>
        ))}
      </div>

      <div className="relative">
        <CircularTimer progress={progress} sessionType={sessionType} size={280} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="font-orbitron text-6xl font-black tracking-wider tabular-nums"
            style={{ color, textShadow: `0 0 20px ${color}60` }}
          >
            {formatTime(timeLeft)}
          </div>
          <div className="font-mono text-xs tracking-[0.3em] text-gray-500 mt-2">
            {SESSION_LABELS[sessionType]}
          </div>
          {sessionsCompleted > 0 && (
            <div className="font-mono text-xs text-gray-600 mt-1">
              {sessionsCompleted} sessions today
            </div>
          )}
        </div>
        {pointsAnimation && (
          <div className="absolute inset-0 flex items-center justify-center animate-fade-in pointer-events-none">
            <div className="text-center">
              <div className="font-orbitron text-2xl font-black text-neon-yellow animate-level-up">LEVEL UP!</div>
              <div className="font-mono text-sm text-neon-yellow">Level {pointsAnimation}</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={reset} className="text-gray-500 hover:text-gray-300">
          <RotateCcw className="h-5 w-5" />
        </Button>
        <button
          onClick={isRunning ? pause : start}
          className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${color}40, ${color}20)`,
            border: `2px solid ${color}`,
            boxShadow: isRunning ? `0 0 20px ${color}60, 0 0 40px ${color}30` : `0 0 10px ${color}40`,
          }}
        >
          {isRunning ? (
            <Pause className="h-7 w-7" style={{ color }} />
          ) : (
            <Play className="h-7 w-7 ml-1" style={{ color }} />
          )}
        </button>
        <Button variant="ghost" size="icon" onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })} className="text-gray-500 hover:text-gray-300">
          {settings.soundEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
        </Button>
      </div>

      <button
        onClick={toggleFocusMode}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono border transition-all ${
          isFocusMode ? "border-neon-orange text-neon-orange bg-neon-orange/10" : "border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-400"
        }`}
      >
        <Focus className="h-3 w-3" />
        {isFocusMode ? "EXIT FOCUS MODE" : "FOCUS MODE"}
      </button>
    </div>
  );
}