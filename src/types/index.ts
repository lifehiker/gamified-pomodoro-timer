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
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  completedAt?: string | null;
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

export type SessionType = 'work' | 'short_break' | 'long_break';

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

export interface StoredSession {
  id: string;
  type: SessionType;
  completedAt: string;
  duration: number;
  pointsEarned: number;
}

export type AchievementKey =
  | 'first_pomodoro'
  | 'five_day_streak'
  | 'ten_sessions'
  | 'hundred_sessions'
  | 'level_10'
  | 'early_bird';

export interface AchievementDef {
  key: AchievementKey;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export const ACHIEVEMENT_DEFS: Omit<AchievementDef, 'unlocked'>[] = [
  { key: 'first_pomodoro', title: 'First Focus', description: 'Complete your first Pomodoro', icon: '&#127813;' },
  { key: 'five_day_streak', title: 'On Fire', description: '5-day streak', icon: '&#128293;' },
  { key: 'ten_sessions', title: 'Getting Serious', description: 'Complete 10 sessions', icon: '&#9889;' },
  { key: 'hundred_sessions', title: 'Centurion', description: 'Complete 100 sessions', icon: '&#128175;' },
  { key: 'level_10', title: 'Veteran', description: 'Reach level 10', icon: '&#127942;' },
  { key: 'early_bird', title: 'Early Bird', description: 'Complete a session before 8am', icon: '&#127749;' },
];
