"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTimer } from "@/providers/TimerProvider";
import { XPBar } from "@/components/gamification/XPBar";
import { Timer, BarChart2, Settings, Zap, Sparkles } from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard", label: "TIMER", icon: Timer },
  { href: "/analytics", label: "STATS", icon: BarChart2 },
  { href: "/pricing", label: "PRICING", icon: Sparkles },
  { href: "/settings", label: "CONFIG", icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const { state } = useTimer();
  const { totalPoints } = state;
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#08111f]/78 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 min-h-16 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
            <Zap className="h-4 w-4 text-neon-green" style={{ filter: "drop-shadow(0 0 8px rgba(184,255,98,0.7))" }} />
          </div>
          <span className="font-orbitron text-sm font-black text-white tracking-[0.24em] hidden sm:block">
            POMODORO<span className="text-neon-green">QUEST</span>
          </span>
        </Link>
        <div className="flex items-center gap-1 flex-wrap justify-center">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`flex items-center gap-1.5 px-3 py-2 rounded-full font-mono text-[11px] tracking-[0.22em] transition-all border ${pathname === href ? "text-neon-green bg-neon-green/10 border-neon-green/20 shadow-[0_0_20px_rgba(184,255,98,0.08)]" : "text-slate-400 border-transparent hover:text-slate-100 hover:bg-white/[0.04]"}`}>
              <Icon className="h-3 w-3" />
              {label}
            </Link>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3 min-w-[220px] justify-end">
          {session ? (
            <>
              <XPBar totalPoints={totalPoints} compact />
              <div className="flex items-center gap-2 flex-shrink-0">
                {session.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                    className="h-7 w-7 rounded-full border border-[#1a1a2e]"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-white/[0.05] flex items-center justify-center font-mono text-xs text-neon-green border border-white/10">
                    {session.user?.name?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                )}
                <span className="font-mono text-xs text-gray-300 max-w-[80px] truncate">
                  {session.user?.name?.split(" ")[0]}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/dashboard" })}
                  className="font-mono text-[11px] text-slate-400 hover:text-white tracking-[0.22em] transition-colors px-3 py-2 rounded-full border border-white/10 hover:border-white/20"
                >
                  SIGN OUT
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="font-mono text-[11px] font-bold tracking-[0.22em] px-4 py-2 rounded-full border border-neon-green/70 text-neon-green hover:bg-neon-green/10 transition-all"
              style={{ boxShadow: "0 0 16px rgba(184,255,98,0.16)" }}
            >
              SIGN IN
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
