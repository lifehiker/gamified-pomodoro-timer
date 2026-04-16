'use client';
import { Navbar } from '@/components/layout/Navbar';
import { PomodoroTimer } from '@/components/timer/PomodoroTimer';
import { TaskList } from '@/components/tasks/TaskList';
import { StatsBar } from '@/components/gamification/StatsBar';
import { useTimer } from '@/providers/TimerProvider';

export default function DashboardPage() {
  const { state } = useTimer();
  const { isFocusMode, currentTaskId, sessionsCompleted, settings, streak, totalPoints } = state;

  return (
    <div className={'min-h-screen transition-all duration-500 ' + (isFocusMode ? 'bg-[#050913]' : '')}>
      {!isFocusMode && <Navbar />}
      <main className={isFocusMode ? 'pt-0' : 'pt-14'}>
        <div className='max-w-7xl mx-auto px-4 py-8 relative z-10'>
          {isFocusMode ? (
            <div className='min-h-screen flex items-center justify-center'>
              <div className='panel-card panel-outline rounded-[2rem] p-12 flex items-center justify-center'>
                <PomodoroTimer />
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-6 xl:gap-8'>
              <div className='flex flex-col gap-6'>
                <div className='panel-card panel-outline rounded-[2rem] p-6 sm:p-8'>
                  <div className='flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-8'>
                    <div className='space-y-3 max-w-xl'>
                      <div className='font-mono text-[11px] section-label'>Focus Console</div>
                      <h1 className='font-orbitron text-3xl sm:text-4xl text-white leading-tight'>
                        A command deck for deliberate work.
                      </h1>
                      <p className='text-sm sm:text-base text-slate-300/86 max-w-lg'>
                        Run focused sprints, stack streaks, and keep a live line of sight on today&apos;s progress without losing the ritual.
                      </p>
                    </div>
                    <div className='grid grid-cols-2 gap-3 min-w-full md:min-w-[280px] md:max-w-[360px]'>
                      <div className='rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3'>
                        <div className='font-mono text-[10px] section-label'>Today</div>
                        <div className='font-orbitron text-2xl text-neon-green mt-2'>{sessionsCompleted}</div>
                        <div className='font-mono text-[11px] text-slate-400'>of {settings.dailyGoal} target rounds</div>
                      </div>
                      <div className='rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3'>
                        <div className='font-mono text-[10px] section-label'>Task Link</div>
                        <div className='font-orbitron text-xl text-neon-orange mt-2'>{currentTaskId ? 'ARMED' : 'IDLE'}</div>
                        <div className='font-mono text-[11px] text-slate-400'>{currentTaskId ? 'Timer routed to a task' : 'Select a task to track effort'}</div>
                      </div>
                    </div>
                  </div>
                  <div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_240px] xl:items-center'>
                    <div className='flex items-center justify-center'>
                      <PomodoroTimer />
                    </div>
                    <div className='grid gap-3'>
                      <div className='rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5'>
                        <div className='font-mono text-[10px] section-label'>Momentum</div>
                        <div className='mt-3 font-orbitron text-3xl text-white'>{streak}<span className='text-sm font-mono text-slate-400 ml-2'>day streak</span></div>
                        <p className='mt-2 text-sm text-slate-300/75'>
                          {streak > 0 ? 'Keep the chain alive with one more deliberate round today.' : 'Start the streak clock with a single focused session.'}
                        </p>
                      </div>
                      <div className='rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-neon-green/10 via-transparent to-neon-cyan/10 p-5'>
                        <div className='font-mono text-[10px] section-label'>Power Reserve</div>
                        <div className='mt-3 flex items-end gap-2'>
                          <span className='font-orbitron text-3xl text-neon-green'>{totalPoints}</span>
                          <span className='pb-1 font-mono text-xs text-slate-400'>XP banked</span>
                        </div>
                        <p className='mt-2 text-sm text-slate-300/75'>
                          Every completed session pushes the next level threshold and unlocks more achievements.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='panel-card panel-outline rounded-[1.75rem] p-6'>
                  <StatsBar />
                </div>
              </div>
              <div className='panel-card panel-outline rounded-[2rem] p-6 min-h-[460px]'>
                <TaskList />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
