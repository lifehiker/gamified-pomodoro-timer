import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ stats: null });
    }
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { totalPoints: true, level: true, currentStreak: true, longestStreak: true },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [todaySessions, weekSessions, totalSessions] = await Promise.all([
      prisma.pomodoroSession.count({ where: { userId: session.user.id, completed: true, startedAt: { gte: today } } }),
      prisma.pomodoroSession.count({ where: { userId: session.user.id, completed: true, startedAt: { gte: weekAgo } } }),
      prisma.pomodoroSession.count({ where: { userId: session.user.id, completed: true } }),
    ]);

    return NextResponse.json({
      stats: { ...user, todaySessions, weekSessions, totalSessions },
    });
  } catch {
    return NextResponse.json({ stats: null });
  }
}
