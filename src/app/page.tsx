'use client';
import { Navbar } from '@/components/layout/Navbar';
import { PomodoroTimer } from '@/components/timer/PomodoroTimer';
import { TaskList } from '@/components/tasks/TaskList';
import { StatsBar } from '@/components/gamification/StatsBar';
import { useTimer } from '@/providers/TimerProvider';

export default function DashboardPage() {
  const { state } = useTimer();
  const { isFocusMode } = state;

  return (
    <div className={'min-h-screen transition-all duration-500 ' + (isFocusMode ? 'bg-[#050510]' : 'bg-[#0a0a18]')}>
      {!isFocusMode && <Navbar />}
      <main className={isFocusMode ? 'pt-0' : 'pt-14'}>
        <div className='max-w-7xl mx-auto px-4 py-8'>
          {isFocusMode ? (
            <div className='min-h-screen flex items-center justify-center'>
              <div className='bg-[#0d0d20]/80 rounded-2xl border border-[#1a1a2e] p-12 flex items-center justify-center'>
                <PomodoroTimer />
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              <div className='lg:col-span-2 flex flex-col gap-6'>
                <div className='bg-[#0d0d20] rounded-2xl border border-[#1a1a2e] p-8 flex items-center justify-center'>
                  <PomodoroTimer />
                </div>
                <div className='bg-[#0d0d20] rounded-2xl border border-[#1a1a2e] p-6'>
                  <StatsBar />
                </div>
              </div>
              <div className='bg-[#0d0d20] rounded-2xl border border-[#1a1a2e] p-6 min-h-[400px]'>
                <TaskList />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
