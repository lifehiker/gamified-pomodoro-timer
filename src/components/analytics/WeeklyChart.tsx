'use client';
import { useTimer } from '@/providers/TimerProvider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getWeeklyData(sessionHistory: { type: string; completedAt: string }[]) {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const sessions = sessionHistory.filter(
      (s) => s.type === 'work' && s.completedAt.slice(0, 10) === dateStr
    ).length;
    return { day: DAY_LABELS[d.getDay()], sessions, isToday: i === 6 };
  });
}

export function WeeklyChart() {
  const { state } = useTimer();
  const chartData = getWeeklyData(state.sessionHistory);

  return (
    <div className='h-48'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <XAxis dataKey='day' tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip contentStyle={{ background: '#0d0d20', border: '1px solid #2a2a3e', borderRadius: '8px', color: '#fff', fontFamily: 'Space Mono', fontSize: '12px' }} cursor={{ fill: 'rgba(0,255,136,0.05)' }} />
          <Bar dataKey='sessions' radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.isToday ? '#00ff88' : '#2a2a4e'} style={{ filter: entry.isToday ? 'drop-shadow(0 0 6px #00ff88)' : undefined }} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
