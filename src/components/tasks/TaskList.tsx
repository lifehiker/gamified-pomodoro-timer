"use client";
import { useState, useEffect } from "react";
import { Task } from "@/types";
import { TaskItem } from "./TaskItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
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

  useEffect(() => { setTasks(getLocalTasks()); }, []);

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
    const updated = tasks.map((t) => t.id === id ? { ...t, completed: true } : t);
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-mono text-xs tracking-widest text-gray-400 uppercase">Tasks</h3>
        <Button variant="ghost" size="icon" onClick={() => setIsAdding(!isAdding)} className="h-6 w-6 text-neon-green hover:bg-neon-green/10">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {isAdding && (
        <div className="flex gap-2 mb-3">
          <Input value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} placeholder="Task name..." className="h-8 text-xs bg-[#0d0d20] border-[#2a2a3e] focus:border-neon-green" autoFocus />
          <Button size="sm" variant="neon" onClick={addTask} className="h-8 text-xs">Add</Button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {activeTasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-600 font-mono text-xs">No tasks yet</div>
            <div className="text-gray-700 font-mono text-xs mt-1">Add one to track focus time</div>
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
