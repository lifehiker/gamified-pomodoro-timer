import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function getPointsForSessionType(type: "work" | "short_break" | "long_break"): number {
  switch (type) {
    case "work": return 10;
    case "short_break": return 5;
    case "long_break": return 2;
    default: return 0;
  }
}

export function getLevelFromPoints(points: number): { level: number; progress: number; pointsToNext: number } {
  const pointsPerLevel = 100;
  const level = Math.floor(points / pointsPerLevel) + 1;
  const progress = points % pointsPerLevel;
  const pointsToNext = pointsPerLevel - progress;
  return { level, progress, pointsToNext };
}

export function getSessionColor(type: string): string {
  switch (type) {
    case "work": return "#00ff88";
    case "short_break": return "#4ecdc4";
    case "long_break": return "#ffd93d";
    default: return "#00ff88";
  }
}
