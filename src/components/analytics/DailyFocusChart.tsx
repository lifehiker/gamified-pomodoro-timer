'use client';
import { useTimer } from '@/providers/TimerProvider';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

function getDailyFocusData(sessionHistory: { type: string; completedAt: string; duration: number }[]) {
  const today = new Date();
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (13 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const minutes = sessionHistory
      .filter((s) => s.type === 'work' && s.completedAt.slice(0, 10) === dateStr)
      .reduce((sum, s) => sum + s.duration, 0);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      minutes,
    };
  });
}

export function DailyFocusChart() {
  const { state } = useTimer();
  const chartData = getDailyFocusData(state.sessionHistory);
  const hasData = chartData.some((day) => day.minutes > 0);

  if (!hasData) {
    return (
      <div className='flex h-48 items-center justify-center rounded-[1.5rem] border border-dashed border-white/10 bg-black/10 px-6 text-center'>
        <div>
          <div className='font-orbitron text-lg text-white'>No focus minutes yet</div>
          <p className='mt-2 font-mono text-xs text-slate-500'>Your last 14 days will chart here once you finish a work session.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-48'>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id='focusGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#4ecdc4' stopOpacity={0.3} />
              <stop offset='95%' stopColor='#4ecdc4' stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey='date' tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'var(--font-plex-mono)' }} axisLine={false} tickLine={false} interval={3} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'var(--font-plex-mono)' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: '#0d0d20', border: '1px solid #2a2a3e', borderRadius: '8px', color: '#fff', fontFamily: 'var(--font-plex-mono)', fontSize: '12px' }} formatter={(value: string | number) => [String(value) + ' min', 'Focus Time']} />
          <Area type='monotone' dataKey='minutes' stroke='#4ecdc4' strokeWidth={2} fill='url(#focusGradient)' style={{ filter: 'drop-shadow(0 0 4px #4ecdc4)' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
