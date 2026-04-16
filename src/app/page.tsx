import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-14">
        <section className="max-w-6xl mx-auto px-4 py-20 sm:py-28">
          <div className="panel-card panel-outline rounded-[2rem] overflow-hidden">
            <div className="grid gap-10 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div className="space-y-6">
                <div className="font-mono text-[11px] section-label">PomodoroQuest</div>
                <div className="space-y-4">
                  <h1 className="font-orbitron text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
                    Build a repeatable focus ritual.
                  </h1>
                  <p className="max-w-2xl text-base text-slate-300/80 sm:text-lg">
                    Track deliberate work sessions, keep your streak alive, and move into the live dashboard when you are ready to start the timer.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/dashboard"
                    className="rounded-full border border-neon-green/50 bg-neon-green/10 px-6 py-3 font-mono text-xs tracking-[0.22em] text-neon-green transition-colors hover:bg-neon-green/15"
                  >
                    OPEN DASHBOARD
                  </Link>
                  <Link
                    href="/pricing"
                    className="rounded-full border border-white/10 px-6 py-3 font-mono text-xs tracking-[0.22em] text-slate-200 transition-colors hover:bg-white/[0.04]"
                  >
                    VIEW PRICING
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <div className="font-mono text-[10px] section-label">Sessions</div>
                  <div className="mt-3 font-orbitron text-3xl text-neon-green">25 / 5</div>
                  <p className="mt-2 text-sm text-slate-300/75">Pomodoro rounds with automatic break pacing.</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <div className="font-mono text-[10px] section-label">Momentum</div>
                  <div className="mt-3 font-orbitron text-3xl text-neon-orange">Streaks</div>
                  <p className="mt-2 text-sm text-slate-300/75">Keep consistency visible instead of relying on memory.</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <div className="font-mono text-[10px] section-label">Analytics</div>
                  <div className="mt-3 font-orbitron text-3xl text-neon-cyan">Insight</div>
                  <p className="mt-2 text-sm text-slate-300/75">Review focus volume, task effort, and progress over time.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
