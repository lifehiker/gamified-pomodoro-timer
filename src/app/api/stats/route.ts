import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserStats } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ stats: null });
    }
    const stats = await getUserStats(session.user.id);
    return NextResponse.json({ stats });
  } catch {
    return NextResponse.json({ stats: null });
  }
}
