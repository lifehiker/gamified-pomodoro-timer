export interface TimerSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  dailyGoal: number;
  soundEnabled: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  estimatedPomodoros: number;
  actualPomodoros: number;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
}

export interface UserStats {
  totalPoints: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  todaySessions: number;
  weekSessions: number;
  totalSessions: number;
}

export type SessionType = "work" | "short_break" | "long_break";

export interface PomodoroSession {
  id: string;
  type: SessionType;
  duration: number;
  completed: boolean;
  pointsEarned: number;
  startedAt: string;
  completedAt?: string;
  taskId?: string;
}
