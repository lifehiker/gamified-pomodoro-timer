"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTimer } from "@/providers/TimerProvider";
import { XPBar } from "@/components/gamification/XPBar";
import { Timer, BarChart2, Settings, Zap } from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard", label: "TIMER", icon: Timer },
  { href: "/analytics", label: "STATS", icon: BarChart2 },
  { href: "/settings", label: "CONFIG", icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const { state } = useTimer();
  const { totalPoints } = state;


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a18]/90 backdrop-blur-sm border-b border-[#1a1a2e]">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Zap className="h-5 w-5 text-neon-green" style={{ filter: "drop-shadow(0 0 6px #00ff88)" }} />
          <span className="font-orbitron text-sm font-black text-white tracking-wider hidden sm:block">
            POMODORO<span className="text-neon-green">QUEST</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs tracking-widest transition-all ${pathname === href ? "text-neon-green bg-neon-green/10" : "text-gray-500 hover:text-gray-300"}`}>
              <Icon className="h-3 w-3" />
              {label}
            </Link>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3 min-w-[180px]">
          <XPBar totalPoints={totalPoints} compact />
        </div>
      </div>
    </nav>
  );
}