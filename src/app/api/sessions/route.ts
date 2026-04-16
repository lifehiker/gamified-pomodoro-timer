import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createSession, listSessions } from "@/lib/data-store";
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

    const sessions = await listSessions(session.user.id, days);
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

    const { session: pomodoroSession } = await createSession(session.user.id, {
      type,
      duration,
      completed,
      pointsEarned,
      taskId: taskId || null,
    });

    return NextResponse.json({ session: pomodoroSession });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
