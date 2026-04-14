import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPointsForSessionType } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ sessions: [] });
    }
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") ?? "7");
    const since = new Date();
    since.setDate(since.getDate() - days);

    const sessions = await prisma.pomodoroSession.findMany({
      where: { userId: session.user.id, startedAt: { gte: since } },
      orderBy: { startedAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ sessions });
  } catch {
    return NextResponse.json({ sessions: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { type, duration, completed, taskId } = body;
    const pointsEarned = completed ? getPointsForSessionType(type) : 0;

    const pomodoroSession = await prisma.pomodoroSession.create({
      data: {
        userId: session.user.id,
        type,
        duration,
        completed,
        pointsEarned,
        taskId: taskId || null,
        completedAt: completed ? new Date() : null,
      },
    });

    if (completed) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { totalPoints: { increment: pointsEarned } },
      });
      if (taskId && type === "work") {
        await prisma.task.update({
          where: { id: taskId },
          data: { actualPomodoros: { increment: 1 } },
        });
      }
    }

    return NextResponse.json({ session: pomodoroSession });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
