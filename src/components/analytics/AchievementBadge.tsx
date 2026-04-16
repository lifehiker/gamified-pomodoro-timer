'use client';
import { useTimer } from '@/providers/TimerProvider';
import { ACHIEVEMENT_DEFS } from '@/types';

export function AchievementBadges() {
  const { state } = useTimer();
  const achievements = ACHIEVEMENT_DEFS.map((def) => ({
    ...def,
    unlocked: state.achievements[def.key] ?? false,
  }));
  const unlockedCount = achievements.filter((achievement) => achievement.unlocked).length;

  return (
    <div className='space-y-4'>
      <div className='rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3'>
        <div className='font-mono text-[10px] tracking-[0.24em] text-slate-400 uppercase'>Cabinet Status</div>
        <div className='mt-2 font-orbitron text-2xl text-white'>{unlockedCount}<span className='ml-2 font-mono text-xs text-slate-500'>of {achievements.length} unlocked</span></div>
      </div>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3'>
        {achievements.map((achievement) => (
          <div
            key={achievement.key}
            className={'flex items-center gap-3 rounded-2xl border p-4 transition-all ' +
              (achievement.unlocked
                ? 'bg-neon-green/10 border-neon-green/30 shadow-[0_14px_35px_rgba(0,255,136,0.08)]'
                : 'bg-[#0d0d20] border-[#1a1a2e] opacity-50')}
          >
            <div className='text-2xl' dangerouslySetInnerHTML={{ __html: achievement.icon }} />
            <div>
              <div className={'font-mono text-xs font-bold ' + (achievement.unlocked ? 'text-neon-green' : 'text-gray-500')}>
                {achievement.title}
              </div>
              <div className='font-mono text-[10px] text-gray-600'>{achievement.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
