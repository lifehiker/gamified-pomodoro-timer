'use client';
import { Navbar } from '@/components/layout/Navbar';
import { WeeklyChart } from '@/components/analytics/WeeklyChart';
import { DailyFocusChart } from '@/components/analytics/DailyFocusChart';
import { AchievementBadges } from '@/components/analytics/AchievementBadge';
import { useTimer } from '@/providers/TimerProvider';

export default function AnalyticsPage() {
  const { state } = useTimer();
  const { totalSessions, streak, longestStreak, totalPoints } = state;

  return (
    <div className='min-h-screen bg-[#0a0a18]'>
      <Navbar />
      <main className='pt-14'>
        <div className='max-w-4xl mx-auto px-4 py-8 space-y-6'>
          <h1 className='font-orbitron text-2xl font-black text-white tracking-wider'>
            STATS <span className='text-neon-green'>&amp;</span> ANALYTICS
          </h1>

          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
            {[
              { label: 'TOTAL SESSIONS', value: totalSessions, color: 'text-neon-green' },
              { label: 'CURRENT STREAK', value: streak + 'd', color: 'text-neon-orange' },
              { label: 'LONGEST STREAK', value: longestStreak + 'd', color: 'text-neon-cyan' },
              { label: 'TOTAL POINTS', value: totalPoints, color: 'text-neon-yellow' },
            ].map(({ label, value, color }) => (
              <div key={label} className='bg-[#0d0d20] rounded-xl border border-[#1a1a2e] p-4 text-center'>
                <div className='font-mono text-[10px] tracking-widest text-gray-500 mb-1'>{label}</div>
                <div className={'font-orbitron text-2xl font-black ' + color}>{value}</div>
              </div>
            ))}
          </div>

          <div className='bg-[#0d0d20] rounded-2xl border border-[#1a1a2e] p-6'>
            <h2 className='font-mono text-xs tracking-widest text-gray-400 uppercase mb-4'>
              Sessions This Week
            </h2>
            <WeeklyChart />
          </div>

          <div className='bg-[#0d0d20] rounded-2xl border border-[#1a1a2e] p-6'>
            <h2 className='font-mono text-xs tracking-widest text-gray-400 uppercase mb-4'>
              Focus Time (Last 14 Days)
            </h2>
            <DailyFocusChart />
          </div>

          <div className='bg-[#0d0d20] rounded-2xl border border-[#1a1a2e] p-6'>
            <h2 className='font-mono text-xs tracking-widest text-gray-400 uppercase mb-4'>
              Achievements
            </h2>
            <AchievementBadges />
          </div>
        </div>
      </main>
    </div>
  );
}
