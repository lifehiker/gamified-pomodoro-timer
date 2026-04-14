"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function generateMockData() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { day: DAYS[d.getDay()], sessions: Math.floor(Math.random() * 10), isToday: i === 6 };
  });
}

interface WeeklyChartProps {
  data?: { day: string; sessions: number; isToday?: boolean }[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const [mockData] = useState<{ day: string; sessions: number; isToday?: boolean }[]>(generateMockData);
  const chartData = data ?? mockData;

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 11, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#6b7280", fontSize: 11, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "#0d0d20", border: "1px solid #2a2a3e", borderRadius: "8px", color: "#fff", fontFamily: "Space Mono", fontSize: "12px" }} cursor={{ fill: "rgba(0,255,136,0.05)" }} />
          <Bar dataKey="sessions" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.isToday ? "#00ff88" : "#2a2a4e"} style={{ filter: entry.isToday ? "drop-shadow(0 0 6px #00ff88)" : undefined }} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
