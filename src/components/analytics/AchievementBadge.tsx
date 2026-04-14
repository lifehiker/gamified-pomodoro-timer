'use client';
import { useTimer } from '@/providers/TimerProvider';
import { ACHIEVEMENT_DEFS } from '@/types';

export function AchievementBadges() {
  const { state } = useTimer();
  const achievements = ACHIEVEMENT_DEFS.map((def) => ({
    ...def,
    unlocked: state.achievements[def.key] ?? false,
  }));

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
      {achievements.map((achievement) => (
        <div
          key={achievement.key}
          className={'flex items-center gap-3 p-3 rounded-lg border transition-all ' +
            (achievement.unlocked
              ? 'bg-neon-green/10 border-neon-green/30'
              : 'bg-[#0d0d20] border-[#1a1a2e] opacity-40')}
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
  );
}
