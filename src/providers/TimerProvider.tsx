"use client";
import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from "react";
import { TimerSettings, SessionType } from "@/types";

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  sessionType: SessionType;
  sessionsCompleted: number;
  currentTaskId: string | null;
  settings: TimerSettings;
  isFocusMode: boolean;
  totalPoints: number;
  level: number;
  showLevelUp: boolean;
}

type TimerAction =
  | { type: "TICK" }
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESET" }
  | { type: "SET_SESSION_TYPE"; payload: SessionType }
  | { type: "COMPLETE_SESSION" }
  | { type: "SET_TASK"; payload: string | null }
  | { type: "UPDATE_SETTINGS"; payload: Partial<TimerSettings> }
  | { type: "TOGGLE_FOCUS_MODE" }
  | { type: "ADD_POINTS"; payload: number }
  | { type: "DISMISS_LEVEL_UP" };

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  dailyGoal: 8,
  soundEnabled: true,
};

function getDuration(type: SessionType, settings: TimerSettings): number {
  switch (type) {
    case "work": return settings.workDuration * 60;
    case "short_break": return settings.shortBreakDuration * 60;
    case "long_break": return settings.longBreakDuration * 60;
  }
}

function getPointsForType(type: SessionType): number {
  switch (type) {
    case "work": return 10;
    case "short_break": return 5;
    case "long_break": return 2;
  }
}

function getLevelFromPoints(points: number): number {
  return Math.floor(points / 100) + 1;
}

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "TICK":
      if (state.timeLeft <= 0) return state;
      return { ...state, timeLeft: state.timeLeft - 1 };
    case "START":
      return { ...state, isRunning: true };
    case "PAUSE":
      return { ...state, isRunning: false };
    case "RESET":
      return { ...state, isRunning: false, timeLeft: getDuration(state.sessionType, state.settings) };
    case "SET_SESSION_TYPE":
      return { ...state, sessionType: action.payload, isRunning: false, timeLeft: getDuration(action.payload, state.settings) };
    case "COMPLETE_SESSION": {
      const points = getPointsForType(state.sessionType);
      const newTotalPoints = state.totalPoints + points;
      const newLevel = getLevelFromPoints(newTotalPoints);
      const leveledUp = newLevel > state.level;
      const nextSessionsCompleted = state.sessionType === "work" ? state.sessionsCompleted + 1 : state.sessionsCompleted;

      let nextType: SessionType = state.sessionType;
      if (state.sessionType === "work") {
        nextType = nextSessionsCompleted % state.settings.longBreakInterval === 0 ? "long_break" : "short_break";
      } else {
        nextType = "work";
      }

      return {
        ...state,
        isRunning: state.sessionType === "work" ? state.settings.autoStartBreaks : state.settings.autoStartPomodoros,
        sessionsCompleted: nextSessionsCompleted,
        sessionType: nextType,
        timeLeft: getDuration(nextType, state.settings),
        totalPoints: newTotalPoints,
        level: newLevel,
        showLevelUp: leveledUp,
      };
    }
    case "SET_TASK":
      return { ...state, currentTaskId: action.payload };
    case "UPDATE_SETTINGS": {
      const newSettings = { ...state.settings, ...action.payload };
      return {
        ...state,
        settings: newSettings,
        timeLeft: state.isRunning ? state.timeLeft : getDuration(state.sessionType, newSettings),
      };
    }
    case "TOGGLE_FOCUS_MODE":
      return { ...state, isFocusMode: !state.isFocusMode };
    case "ADD_POINTS": {
      const newTotalPoints = state.totalPoints + action.payload;
      const newLevel = getLevelFromPoints(newTotalPoints);
      const leveledUp = newLevel > state.level;
      return { ...state, totalPoints: newTotalPoints, level: newLevel, showLevelUp: leveledUp };
    }
    case "DISMISS_LEVEL_UP":
      return { ...state, showLevelUp: false };
    default:
      return state;
  }
}

interface TimerContextType {
  state: TimerState;
  start: () => void;
  pause: () => void;
  reset: () => void;
  setSessionType: (type: SessionType) => void;
  setTask: (taskId: string | null) => void;
  updateSettings: (settings: Partial<TimerSettings>) => void;
  toggleFocusMode: () => void;
  dismissLevelUp: () => void;
}

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(timerReducer, {
    timeLeft: DEFAULT_SETTINGS.workDuration * 60,
    isRunning: false,
    sessionType: "work",
    sessionsCompleted: 0,
    currentTaskId: null,
    settings: DEFAULT_SETTINGS,
    isFocusMode: false,
    totalPoints: 0,
    level: 1,
    showLevelUp: false,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionCompletedRef = useRef(false);

  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(() => dispatch({ type: "TICK" }), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [state.isRunning]);

  useEffect(() => {
    if (state.timeLeft === 0 && state.isRunning && !sessionCompletedRef.current) {
      sessionCompletedRef.current = true;
      dispatch({ type: "COMPLETE_SESSION" });
      if (state.settings.soundEnabled) {
        try {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(800, ctx.currentTime);
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.5);
        } catch { /* ignore audio errors */ }
      }
      setTimeout(() => { sessionCompletedRef.current = false; }, 1000);
    }
  }, [state.timeLeft, state.isRunning, state.settings.soundEnabled]);

  useEffect(() => {
    const saved = localStorage.getItem("timerSettings");
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        dispatch({ type: "UPDATE_SETTINGS", payload: settings });
      } catch { /* ignore */ }
    }
  }, []);

  const start = useCallback(() => dispatch({ type: "START" }), []);
  const pause = useCallback(() => dispatch({ type: "PAUSE" }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  const setSessionType = useCallback((type: SessionType) => dispatch({ type: "SET_SESSION_TYPE", payload: type }), []);
  const setTask = useCallback((taskId: string | null) => dispatch({ type: "SET_TASK", payload: taskId }), []);
  const updateSettings = useCallback((settings: Partial<TimerSettings>) => {
    dispatch({ type: "UPDATE_SETTINGS", payload: settings });
    const current = JSON.parse(localStorage.getItem("timerSettings") ?? "{}");
    localStorage.setItem("timerSettings", JSON.stringify({ ...current, ...settings }));
  }, []);
  const toggleFocusMode = useCallback(() => dispatch({ type: "TOGGLE_FOCUS_MODE" }), []);
  const dismissLevelUp = useCallback(() => dispatch({ type: "DISMISS_LEVEL_UP" }), []);

  return (
    <TimerContext.Provider value={{ state, start, pause, reset, setSessionType, setTask, updateSettings, toggleFocusMode, dismissLevelUp }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer must be used within TimerProvider");
  return ctx;
}
