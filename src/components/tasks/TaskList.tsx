"use client";
import { useState, useEffect } from "react";
import { Task } from "@/types";
import { TaskItem } from "./TaskItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ListTodo, Target } from "lucide-react";
import { useTimer } from "@/providers/TimerProvider";

function getLocalTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("tasks") ?? "[]"); } catch { return []; }
}

function saveLocalTasks(tasks: Task[]) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { setTask, state } = useTimer();

  useEffect(() => {
    const syncTasks = () => setTasks(getLocalTasks());
    syncTasks();
    window.addEventListener("tasks:updated", syncTasks);
    window.addEventListener("storage", syncTasks);
    return () => {
      window.removeEventListener("tasks:updated", syncTasks);
      window.removeEventListener("storage", syncTasks);
    };
  }, []);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      estimatedPomodoros: 1,
      actualPomodoros: 0,
      completed: false,
      priority: "medium",
      createdAt: new Date().toISOString(),
    };
    const updated = [task, ...tasks];
    setTasks(updated);
    saveLocalTasks(updated);
    setNewTaskTitle("");
    setIsAdding(false);
  };

  const completeTask = (id: string) => {
    const updated = tasks.map((t) => t.id === id ? { ...t, completed: true, completedAt: new Date().toISOString() } : t);
    setTasks(updated);
    saveLocalTasks(updated);
    if (state.currentTaskId === id) setTask(null);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    saveLocalTasks(updated);
    if (state.currentTaskId === id) setTask(null);
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.length - activeTasks.length;
  const totalEstimatedPomodoros = activeTasks.reduce((sum, task) => sum + task.estimatedPomodoros, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-mono text-xs tracking-[0.28em] text-gray-400 uppercase">Task Queue</h3>
            <p className="mt-2 text-sm text-slate-300/80">Pin a target to the timer so each session lands somewhere concrete.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsAdding(!isAdding)} className="h-9 w-9 rounded-full text-neon-green hover:bg-neon-green/10 hover:text-neon-green">
            <span className="sr-only">Add a task</span>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] text-slate-400 uppercase">
              <ListTodo className="h-3 w-3" />
              Active
            </div>
            <div className="mt-3 font-orbitron text-2xl text-white">{activeTasks.length}</div>
            <div className="font-mono text-[11px] text-slate-500">{completedTasks} closed today or earlier</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] text-slate-400 uppercase">
              <Target className="h-3 w-3" />
              Load
            </div>
            <div className="mt-3 font-orbitron text-2xl text-neon-orange">{totalEstimatedPomodoros}</div>
            <div className="font-mono text-[11px] text-slate-500">estimated pomodoros remaining</div>
          </div>
        </div>
      </div>
      {isAdding && (
        <div className="flex gap-2 mb-3">
          <Input value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} placeholder="Task name..." className="h-10 rounded-xl text-sm bg-[#0d0d20] border-[#2a2a3e] focus:border-neon-green" autoFocus />
          <Button size="sm" variant="neon" onClick={addTask} className="h-10 px-4 text-xs">Add</Button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {activeTasks.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-black/10 px-5 py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
              <ListTodo className="h-6 w-6 text-slate-400" />
            </div>
            <div className="mt-4 font-orbitron text-lg text-white">No active missions</div>
            <div className="mt-2 font-mono text-xs text-slate-500">Add a task to route your next focus block somewhere meaningful.</div>
          </div>
        ) : (
          activeTasks.map((task) => (
            <TaskItem key={task.id} task={task} isActive={state.currentTaskId === task.id} onSelect={() => setTask(state.currentTaskId === task.id ? null : task.id)} onComplete={() => completeTask(task.id)} onDelete={() => deleteTask(task.id)} />
          ))
        )}
      </div>
    </div>
  );
}
