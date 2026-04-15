"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Zap, Timer, BarChart2, Settings2 } from "lucide-react";

type Mode = "signin" | "register";

export default function SignInPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        return;
      }
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
        redirect: false,
      });
      if (result?.url) {
        window.location.href = result.url;
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "bg-[#0a0a18] border border-[#2a2a3e] text-white font-mono text-sm rounded-lg px-3 py-2.5 w-full focus:outline-none focus:border-[#00ff88]/60";

  return (
    <div className="min-h-screen bg-[#0a0a18] flex items-center justify-center relative overflow-hidden px-4">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.015) 2px, rgba(0,255,136,0.015) 4px)",
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse, #00ff88 0%, transparent 70%)" }}
        />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#0d0d20] border border-[#1a1a2e] rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Zap
              className="h-8 w-8 text-[#00ff88]"
              style={{ filter: "drop-shadow(0 0 8px #00ff88)" }}
            />
            <span className="font-orbitron text-2xl font-black text-white tracking-wider">
              POMODORO<span className="text-[#00ff88]">QUEST</span>
            </span>
          </div>
          <p className="font-mono text-gray-400 text-center text-sm mb-6">
            Level up your productivity
          </p>
          <ul className="space-y-3 mb-6">
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
          <div className="flex rounded-lg overflow-hidden border border-[#2a2a3e] mb-6">
            <button
              type="button"
              onClick={() => { setMode("signin"); setError(null); }}
              className={mode === "signin" ? "flex-1 py-2 font-mono text-xs tracking-widest font-bold bg-[#00ff88]/10 text-[#00ff88]" : "flex-1 py-2 font-mono text-xs tracking-widest font-bold text-gray-500"}
            >
              SIGN IN
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setError(null); }}
              className={mode === "register" ? "flex-1 py-2 font-mono text-xs tracking-widest font-bold bg-[#00ff88]/10 text-[#00ff88]" : "flex-1 py-2 font-mono text-xs tracking-widest font-bold text-gray-500"}
            >
              CREATE ACCOUNT
            </button>
          </div>
          {error && (
            <div className="mb-4 px-3 py-2.5 rounded-lg border border-red-500/40 bg-red-500/10">
              <p className="font-mono text-xs text-red-400">{error}</p>
            </div>
          )}
          {mode === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-gray-400 mb-1.5 tracking-wider">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-gray-400 mb-1.5 tracking-wider">
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center px-6 py-3.5 rounded-xl font-mono text-sm font-bold tracking-widest text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                style={{
                  border: "1px solid #00ff88",
                  boxShadow: loading ? "none" : "0 0 16px rgba(0,255,136,0.25), inset 0 0 16px rgba(0,255,136,0.05)",
                  background: "rgba(0,255,136,0.05)",
                }}
              >
                {loading ? "SIGNING IN..." : "SIGN IN"}
              </button>
            </form>
          )}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-gray-400 mb-1.5 tracking-wider">
                  NAME
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="Your name (optional)"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-gray-400 mb-1.5 tracking-wider">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-gray-400 mb-1.5 tracking-wider">
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-gray-400 mb-1.5 tracking-wider">
                  CONFIRM PASSWORD
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center px-6 py-3.5 rounded-xl font-mono text-sm font-bold tracking-widest text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                style={{
                  border: "1px solid #00ff88",
                  boxShadow: loading ? "none" : "0 0 16px rgba(0,255,136,0.25), inset 0 0 16px rgba(0,255,136,0.05)",
                  background: "rgba(0,255,136,0.05)",
                }}
              >
                {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              </button>
            </form>
          )}
          <p className="font-mono text-xs text-gray-500 text-center mt-6">
            Free to use. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
}
