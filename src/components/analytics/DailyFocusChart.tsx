"use client";
import { useState } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

function generateMockData() {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return { date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), minutes: Math.floor(Math.random() * 150 + 30) };
  });
}

interface DailyFocusChartProps {
  data?: { date: string; minutes: number }[];
}

export function DailyFocusChart({ data }: DailyFocusChartProps) {
  const [mockData] = useState<{ date: string; minutes: number }[]>(generateMockData);
  const chartData = data ?? mockData;

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ecdc4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4ecdc4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 10, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} interval={3} />
          <YAxis tick={{ fill: "#6b7280", fontSize: 10, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "#0d0d20", border: "1px solid #2a2a3e", borderRadius: "8px", color: "#fff", fontFamily: "Space Mono", fontSize: "12px" }} formatter={(value: string | number) => [String(value) + " min", "Focus Time"]} />
          <Area type="monotone" dataKey="minutes" stroke="#4ecdc4" strokeWidth={2} fill="url(#focusGradient)" style={{ filter: "drop-shadow(0 0 4px #4ecdc4)" }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
