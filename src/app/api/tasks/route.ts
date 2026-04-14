import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ tasks: [] });
    }
    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id, completed: false },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ tasks });
  } catch {
    return NextResponse.json({ tasks: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const task = await prisma.task.create({
      data: {
        userId: session.user.id,
        title: body.title,
        description: body.description,
        estimatedPomodoros: body.estimatedPomodoros ?? 1,
        priority: body.priority ?? "medium",
      },
    });
    return NextResponse.json({ task });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
