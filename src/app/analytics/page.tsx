"use client";
import { Navbar } from "@/components/layout/Navbar";
import { WeeklyChart } from "@/components/analytics/WeeklyChart";
import { DailyFocusChart } from "@/components/analytics/DailyFocusChart";
import { AchievementBadges } from "@/components/analytics/AchievementBadge";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a18]">
      <Navbar />
      <main className="pt-14">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <h1 className="font-orbitron text-2xl font-black text-white tracking-wider">
            STATS <span className="text-neon-green">&amp;</span> ANALYTICS
          </h1>

          <div className="bg-[#0d0d20] rounded-2xl border border-[#1a1a2e] p-6">
            <h2 className="font-mono text-xs tracking-widest text-gray-400 uppercase mb-4">
              Sessions This Week
            </h2>
            <WeeklyChart />
          </div>

          <div className="bg-[#0d0d20] rounded-2xl border border-[#1a1a2e] p-6">
            <h2 className="font-mono text-xs tracking-widest text-gray-400 uppercase mb-4">
              Focus Time (Last 14 Days)
            </h2>
            <DailyFocusChart />
          </div>

          <div className="bg-[#0d0d20] rounded-2xl border border-[#1a1a2e] p-6">
            <h2 className="font-mono text-xs tracking-widest text-gray-400 uppercase mb-4">
              Achievements
            </h2>
            <AchievementBadges />
          </div>
        </div>
      </main>
    </div>
  );
}
