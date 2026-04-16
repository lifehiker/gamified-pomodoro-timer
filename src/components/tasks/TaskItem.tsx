"use client";
import { Task } from "@/types";
import { Check, Trash2, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  isActive: boolean;
  onSelect: () => void;
  onComplete: () => void;
  onDelete: () => void;
}

const PRIORITY_COLORS = {
  low: "border-l-gray-600",
  medium: "border-l-neon-yellow",
  high: "border-l-neon-orange",
};

export function TaskItem({ task, isActive, onSelect, onComplete, onDelete }: TaskItemProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-[1.15rem] border border-l-2 cursor-pointer px-3 py-3 transition-all duration-200",
        PRIORITY_COLORS[task.priority],
        isActive
          ? "bg-neon-green/10 border-r-neon-green/30 border-t-neon-green/30 border-b-neon-green/30 shadow-[0_12px_30px_rgba(0,255,136,0.08)]"
          : "bg-[#0d0d20] border-r-[#1a1a2e] border-t-[#1a1a2e] border-b-[#1a1a2e] hover:bg-[#12122a] hover:border-r-white/15 hover:border-t-white/15 hover:border-b-white/15"
      )}
      onClick={onSelect}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onComplete(); }}
        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-gray-600 hover:border-neon-green hover:bg-neon-green/10 transition-all"
      >
        <Check className="h-2.5 w-2.5 text-neon-green opacity-0 group-hover:opacity-50" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="font-mono text-xs text-gray-300 truncate">{task.title}</div>
          {isActive && <div className="rounded-full border border-neon-green/30 bg-neon-green/10 px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] text-neon-green">LIVE</div>}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <Timer className="h-2.5 w-2.5 text-gray-600" />
          <span className="font-mono text-[10px] text-gray-600">{task.actualPomodoros}/{task.estimatedPomodoros}</span>
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
}
