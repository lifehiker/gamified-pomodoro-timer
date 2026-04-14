"use client";
import { Navbar } from "@/components/layout/Navbar";
import { PomodoroTimer } from "@/components/timer/PomodoroTimer";
import { TaskList } from "@/components/tasks/TaskList";
import { StatsBar } from "@/components/gamification/StatsBar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0a0a18]">
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Timer column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-[#0d0d20] rounded-2xl border border-[#1a1a2e] p-8 flex items-center justify-center">
                <PomodoroTimer />
              </div>
              <div className="bg-[#0d0d20] rounded-2xl border border-[#1a1a2e] p-6">
                <StatsBar />
              </div>
            </div>
            {/* Tasks column */}
            <div className="bg-[#0d0d20] rounded-2xl border border-[#1a1a2e] p-6 min-h-[400px]">
              <TaskList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
