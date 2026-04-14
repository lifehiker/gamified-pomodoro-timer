"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Zap, Timer, BarChart2, Settings2 } from "lucide-react";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-[#0a0a18] flex items-center justify-center relative overflow-hidden px-4">
      {/* Scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.015) 2px, rgba(0,255,136,0.015) 4px)",
        }}
      />

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse, #00ff88 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#0d0d20] border border-[#1a1a2e] rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <Zap
              className="h-8 w-8 text-[#00ff88]"
              style={{ filter: "drop-shadow(0 0 8px #00ff88)" }}
            />
            <span className="font-orbitron text-2xl font-black text-white tracking-wider">
              POMODORO<span className="text-[#00ff88]">QUEST</span>
            </span>
          </div>

          {/* Tagline */}
          <p className="font-mono text-gray-400 text-center text-sm mb-8">
            Level up your productivity
          </p>

          {/* Feature list */}
          <ul className="space-y-3 mb-8">
            {[
              { icon: Timer, text: "Gamified Pomodoro timer" },
              { icon: BarChart2, text: "Analytics & achievements" },
              { icon: Settings2, text: "Customizable sessions" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <Icon
                  className="h-4 w-4 text-[#00ff88] flex-shrink-0"
                  style={{ filter: "drop-shadow(0 0 4px #00ff88)" }}
                />
                <span className="font-mono text-sm text-gray-300">{text}</span>
              </li>
            ))}
          </ul>

          {/* Sign in button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-mono text-sm font-bold tracking-widest text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              border: "1px solid #00ff88",
              boxShadow: loading ? "none" : "0 0 16px rgba(0,255,136,0.25), inset 0 0 16px rgba(0,255,136,0.05)",
              background: "rgba(0,255,136,0.05)",
            }}
          >
            {/* Google icon */}
            <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {loading ? "SIGNING IN..." : "SIGN IN WITH GOOGLE"}
          </button>

          {/* Footer */}
          <p className="font-mono text-xs text-gray-500 text-center mt-6">
            Free to use. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
}
