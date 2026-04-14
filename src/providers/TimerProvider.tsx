'use client';
import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { TimerSettings, SessionType, StoredSession, AchievementKey } from '@/types';

function toDateStr(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getDuration(type: SessionType, settings: TimerSettings): number {
  switch (type) {
    case 'work': return settings.workDuration * 60;
    case 'short_break': return settings.shortBreakDuration * 60;
    case 'long_break': return settings.longBreakDuration * 60;
  }
}

function getPointsForType(type: SessionType): number {
  switch (type) {
    case 'work': return 10;
    case 'short_break': return 5;
    case 'long_break': return 2;
  }
}

function getLevelFromPoints(points: number): number {
  return Math.floor(points / 100) + 1;
}

function getDurationMinutes(type: SessionType, settings: TimerSettings): number {
  switch (type) {
    case 'work': return settings.workDuration;
    case 'short_break': return settings.shortBreakDuration;
    case 'long_break': return settings.longBreakDuration;
  }
}

interface PersistedData {
  totalPoints: number;
  level: number;
  streak: number;
  longestStreak: number;
  lastSessionDate: string | null;
  totalSessions: number;
  sessionHistory: StoredSession[];
  achievements: Record<AchievementKey, boolean>;
}

const DEFAULT_ACHIEVEMENTS: Record<AchievementKey, boolean> = {
  first_pomodoro: false,
  five_day_streak: false,
  ten_sessions: false,
  hundred_sessions: false,
  level_10: false,
  early_bird: false,
};

function loadPersistedData(): PersistedData {
  if (typeof window === 'undefined') {
    return { totalPoints: 0, level: 1, streak: 0, longestStreak: 0, lastSessionDate: null, totalSessions: 0, sessionHistory: [], achievements: { ...DEFAULT_ACHIEVEMENTS } };
  }
  try {
    const raw = localStorage.getItem('pomodoroData');
    if (!raw) throw new Error('no data');
    const parsed = JSON.parse(raw) as PersistedData;
    return {
      totalPoints: parsed.totalPoints ?? 0,
      level: parsed.level ?? 1,
      streak: parsed.streak ?? 0,
      longestStreak: parsed.longestStreak ?? 0,
      lastSessionDate: parsed.lastSessionDate ?? null,
      totalSessions: parsed.totalSessions ?? 0,
      sessionHistory: parsed.sessionHistory ?? [],
      achievements: { ...DEFAULT_ACHIEVEMENTS, ...(parsed.achievements ?? {}) },
    };
  } catch {
    return { totalPoints: 0, level: 1, streak: 0, longestStreak: 0, lastSessionDate: null, totalSessions: 0, sessionHistory: [], achievements: { ...DEFAULT_ACHIEVEMENTS } };
  }
}

function savePersistedData(data: PersistedData): void {
  try { localStorage.setItem('pomodoroData', JSON.stringify(data)); } catch { /* ignore */ }
}

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25, shortBreakDuration: 5, longBreakDuration: 15, longBreakInterval: 4,
  autoStartBreaks: false, autoStartPomodoros: false, dailyGoal: 8, soundEnabled: true,
};

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
  streak: number;
  longestStreak: number;
  lastSessionDate: string | null;
  totalSessions: number;
  sessionHistory: StoredSession[];
  achievements: Record<AchievementKey, boolean>;
  showLevelUp: boolean;
  newAchievement: AchievementKey | null;
}

type TimerAction =
  | { type: 'TICK' }
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'SET_SESSION_TYPE'; payload: SessionType }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'SET_TASK'; payload: string | null }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<TimerSettings> }
  | { type: 'TOGGLE_FOCUS_MODE' }
  | { type: 'DISMISS_LEVEL_UP' }
  | { type: 'DISMISS_ACHIEVEMENT' }
  | { type: 'HYDRATE'; payload: PersistedData };

function checkNewAchievements(
  prev: Record<AchievementKey, boolean>,
  params: { totalSessions: number; streak: number; level: number; completedAt: Date }
): { updated: Record<AchievementKey, boolean>; newKey: AchievementKey | null } {
  const updated = { ...prev };
  let newKey: AchievementKey | null = null;
  const check = (key: AchievementKey, condition: boolean) => {
    if (condition && !updated[key]) { updated[key] = true; if (!newKey) newKey = key; }
  };
  check('first_pomodoro', params.totalSessions >= 1);
  check('ten_sessions', params.totalSessions >= 10);
  check('hundred_sessions', params.totalSessions >= 100);
  check('five_day_streak', params.streak >= 5);
  check('level_10', params.level >= 10);
  check('early_bird', params.completedAt.getHours() < 8);
  return { updated, newKey };
}

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'TICK':
      if (state.timeLeft <= 0) return state;
      return { ...state, timeLeft: state.timeLeft - 1 };
    case 'START':
      return { ...state, isRunning: true };
    case 'PAUSE':
      return { ...state, isRunning: false };
    case 'RESET':
      return { ...state, isRunning: false, timeLeft: getDuration(state.sessionType, state.settings) };
    case 'SET_SESSION_TYPE':
      return { ...state, sessionType: action.payload, isRunning: false, timeLeft: getDuration(action.payload, state.settings) };
    case 'COMPLETE_SESSION': {
      const now = new Date();
      const todayStr = toDateStr(now);
      const points = getPointsForType(state.sessionType);
      const newTotalPoints = state.totalPoints + points;
      const newLevel = getLevelFromPoints(newTotalPoints);
      const leveledUp = newLevel > state.level;
      const isWork = state.sessionType === 'work';
      const nextTotalSessions = isWork ? state.totalSessions + 1 : state.totalSessions;
      const nextSessionsCompleted = isWork ? state.sessionsCompleted + 1 : state.sessionsCompleted;

      let newStreak = state.streak;
      let newLongestStreak = state.longestStreak;
      let newLastSessionDate = state.lastSessionDate;

      if (isWork) {
        if (state.lastSessionDate === null) {
          newStreak = 1;
        } else if (state.lastSessionDate === todayStr) {
          newStreak = state.streak;
        } else {
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = toDateStr(yesterday);
          newStreak = state.lastSessionDate === yesterdayStr ? state.streak + 1 : 1;
        }
        newLastSessionDate = todayStr;
        newLongestStreak = Math.max(newStreak, state.longestStreak);
      }

      const newSession: StoredSession = {
        id: Date.now() + '-' + Math.random().toString(36).slice(2),
        type: state.sessionType,
        completedAt: now.toISOString(),
        duration: getDurationMinutes(state.sessionType, state.settings),
        pointsEarned: points,
      };

      const newSessionHistory = [...state.sessionHistory, newSession];
      const { updated: newAchievements, newKey } = checkNewAchievements(state.achievements, {
        totalSessions: nextTotalSessions, streak: newStreak, level: newLevel, completedAt: now,
      });

      let nextType: SessionType = state.sessionType;
      if (state.sessionType === 'work') {
        nextType = nextSessionsCompleted % state.settings.longBreakInterval === 0 ? 'long_break' : 'short_break';
      } else {
        nextType = 'work';
      }

      return {
        ...state,
        isRunning: isWork ? state.settings.autoStartBreaks : state.settings.autoStartPomodoros,
        sessionsCompleted: nextSessionsCompleted,
        sessionType: nextType,
        timeLeft: getDuration(nextType, state.settings),
        totalPoints: newTotalPoints,
        level: newLevel,
        showLevelUp: leveledUp,
        streak: newStreak,
        longestStreak: newLongestStreak,
        lastSessionDate: newLastSessionDate,
        totalSessions: nextTotalSessions,
        sessionHistory: newSessionHistory,
        achievements: newAchievements,
        newAchievement: newKey,
      };
    }
    case 'SET_TASK':
      return { ...state, currentTaskId: action.payload };
    case 'UPDATE_SETTINGS': {
      const newSettings = { ...state.settings, ...action.payload };
      return { ...state, settings: newSettings, timeLeft: state.isRunning ? state.timeLeft : getDuration(state.sessionType, newSettings) };
    }
    case 'TOGGLE_FOCUS_MODE':
      return { ...state, isFocusMode: !state.isFocusMode };
    case 'DISMISS_LEVEL_UP':
      return { ...state, showLevelUp: false };
    case 'DISMISS_ACHIEVEMENT':
      return { ...state, newAchievement: null };
    case 'HYDRATE':
      return {
        ...state,
        totalPoints: action.payload.totalPoints,
        level: action.payload.level,
        streak: action.payload.streak,
        longestStreak: action.payload.longestStreak,
        lastSessionDate: action.payload.lastSessionDate,
        totalSessions: action.payload.totalSessions,
        sessionHistory: action.payload.sessionHistory,
        achievements: action.payload.achievements,
      };
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
  dismissAchievement: () => void;
}

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(timerReducer, {
    timeLeft: DEFAULT_SETTINGS.workDuration * 60,
    isRunning: false,
    sessionType: 'work' as SessionType,
    sessionsCompleted: 0,
    currentTaskId: null,
    settings: DEFAULT_SETTINGS,
    isFocusMode: false,
    totalPoints: 0,
    level: 1,
    streak: 0,
    longestStreak: 0,
    lastSessionDate: null,
    totalSessions: 0,
    sessionHistory: [],
    achievements: { ...DEFAULT_ACHIEVEMENTS },
    showLevelUp: false,
    newAchievement: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionCompletedRef = useRef(false);

  useEffect(() => {
    const saved = loadPersistedData();
    dispatch({ type: 'HYDRATE', payload: saved });
    const savedSettings = localStorage.getItem('timerSettings');
    if (savedSettings) {
      try { dispatch({ type: 'UPDATE_SETTINGS', payload: JSON.parse(savedSettings) }); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    savePersistedData({
      totalPoints: state.totalPoints,
      level: state.level,
      streak: state.streak,
      longestStreak: state.longestStreak,
      lastSessionDate: state.lastSessionDate,
      totalSessions: state.totalSessions,
      sessionHistory: state.sessionHistory,
      achievements: state.achievements,
    });
  }, [state.totalPoints, state.level, state.streak, state.longestStreak, state.lastSessionDate, state.totalSessions, state.sessionHistory, state.achievements]);

  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [state.isRunning]);

  useEffect(() => {
    if (state.timeLeft === 0 && state.isRunning && !sessionCompletedRef.current) {
      sessionCompletedRef.current = true;
      dispatch({ type: 'COMPLETE_SESSION' });
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

  const start = useCallback(() => dispatch({ type: 'START' }), []);
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const setSessionType = useCallback((type: SessionType) => dispatch({ type: 'SET_SESSION_TYPE', payload: type }), []);
  const setTask = useCallback((taskId: string | null) => dispatch({ type: 'SET_TASK', payload: taskId }), []);
  const updateSettings = useCallback((settings: Partial<TimerSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    const current = JSON.parse(localStorage.getItem('timerSettings') ?? '{}');
    localStorage.setItem('timerSettings', JSON.stringify({ ...current, ...settings }));
  }, []);
  const toggleFocusMode = useCallback(() => dispatch({ type: 'TOGGLE_FOCUS_MODE' }), []);
  const dismissLevelUp = useCallback(() => dispatch({ type: 'DISMISS_LEVEL_UP' }), []);
  const dismissAchievement = useCallback(() => dispatch({ type: 'DISMISS_ACHIEVEMENT' }), []);

  return (
    <TimerContext.Provider value={{ state, start, pause, reset, setSessionType, setTask, updateSettings, toggleFocusMode, dismissLevelUp, dismissAchievement }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimer must be used within TimerProvider');
  return ctx;
}
