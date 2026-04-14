"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useTimer } from "@/providers/TimerProvider";
import { TimerSettings } from "@/types";

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-[#1a1a2e] last:border-0">
      <div className="flex-1">
        <div className="font-mono text-sm text-gray-200">{label}</div>
        {description && (
          <div className="font-mono text-xs text-gray-500 mt-0.5">{description}</div>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-7 h-7 rounded border border-[#2a2a3e] text-gray-400 hover:text-white hover:border-neon-green/50 transition-all font-mono text-lg leading-none"
      >
        −
      </button>
      <span className="font-orbitron text-sm font-bold text-neon-green w-8 text-center tabular-nums">
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-7 h-7 rounded border border-[#2a2a3e] text-gray-400 hover:text-white hover:border-neon-green/50 transition-all font-mono text-lg leading-none"
      >
        +
      </button>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors " +
        (checked ? "bg-neon-green" : "bg-[#2a2a3e]")
      }
    >
      <span
        className={
          "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform " +
          (checked ? "translate-x-6" : "translate-x-1")
        }
      />
    </button>
  );
}

export default function SettingsPage() {
  const { state, updateSettings } = useTimer();
  const [local, setLocal] = useState<TimerSettings>(state.settings);

  useEffect(() => {
    setLocal(state.settings);
  }, [state.settings]);

  function set<K extends keyof TimerSettings>(key: K, value: TimerSettings[K]) {
    const updated = { ...local, [key]: value };
    setLocal(updated);
    updateSettings({ [key]: value });
  }

  return (
    <div className="min-h-screen bg-[#0a0a18]">
      <Navbar />
      <main className="pt-14">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          <h1 className="font-orbitron text-2xl font-black text-white tracking-wider">
            CONFIG
          </h1>

          <div className="bg-[#0d0d20] rounded-2xl border border-[#1a1a2e] p-6 space-y-1">
            <h2 className="font-mono text-xs tracking-widest text-gray-400 uppercase mb-4">
              Timer Durations
            </h2>
            <SettingRow label="Work Duration" description="Minutes per focus session">
              <NumberInput value={local.workDuration} onChange={(v) => set("workDuration", v)} min={1} max={90} />
            </SettingRow>
            <SettingRow label="Short Break" description="Minutes for short break">
              <NumberInput value={local.shortBreakDuration} onChange={(v) => set("shortBreakDuration", v)} min={1} max={30} />
            </SettingRow>
            <SettingRow label="Long Break" description="Minutes for long break">
              <NumberInput value={local.longBreakDuration} onChange={(v) => set("longBreakDuration", v)} min={1} max={60} />
            </SettingRow>
            <SettingRow label="Long Break Interval" description="Sessions before long break">
              <NumberInput value={local.longBreakInterval} onChange={(v) => set("longBreakInterval", v)} min={2} max={10} />
            </SettingRow>
          </div>

          <div className="bg-[#0d0d20] rounded-2xl border border-[#1a1a2e] p-6 space-y-1">
            <h2 className="font-mono text-xs tracking-widest text-gray-400 uppercase mb-4">
              Automation
            </h2>
            <SettingRow label="Auto-start Breaks" description="Automatically start break timer">
              <Toggle checked={local.autoStartBreaks} onChange={(v) => set("autoStartBreaks", v)} />
            </SettingRow>
            <SettingRow label="Auto-start Pomodoros" description="Automatically start next session">
              <Toggle checked={local.autoStartPomodoros} onChange={(v) => set("autoStartPomodoros", v)} />
            </SettingRow>
            <SettingRow label="Sound Notifications" description="Play sound when session ends">
              <Toggle checked={local.soundEnabled} onChange={(v) => set("soundEnabled", v)} />
            </SettingRow>
          </div>

          <div className="bg-[#0d0d20] rounded-2xl border border-[#1a1a2e] p-6">
            <h2 className="font-mono text-xs tracking-widest text-gray-400 uppercase mb-4">
              Goals
            </h2>
            <SettingRow label="Daily Session Goal" description="Target sessions per day">
              <NumberInput value={local.dailyGoal} onChange={(v) => set("dailyGoal", v)} min={1} max={20} />
            </SettingRow>
          </div>

          <p className="font-mono text-xs text-gray-600 text-center">
            Settings are saved automatically and persist across sessions.
          </p>
        </div>
      </main>
    </div>
  );
}
