"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

const FREE_FEATURES = [
  "Basic Pomodoro timer",
  "3 achievements",
  "Session history (7 days)",
  "Basic analytics",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited history",
  "Full analytics suite",
  "All 6 achievements",
  "Priority support",
  "Task management",
  "Cloud sync",
];

const FAQ = [
  {
    q: "Can I cancel anytime?",
    a: "Yes, cancel anytime from your account settings.",
  },
  {
    q: "Is my data safe?",
    a: "Your data is encrypted and never shared.",
  },
  {
    q: "What payment methods?",
    a: "All major credit cards via Stripe.",
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [upgrading, setUpgrading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setCheckoutError(null);
    if (!session) {
      router.push("/auth/signin?callbackUrl=/pricing");
      return;
    }
    setUpgrading(true);
    try {
      const res = await fetch("/api/subscribe", { method: "POST" });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      setCheckoutError(data?.error || "Unable to start checkout right now.");
    } catch {
      setCheckoutError("Unable to start checkout right now.");
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a18]">
      <Navbar />
      <main className="pt-14">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-orbitron text-3xl md:text-4xl font-black text-white tracking-wider mb-3">
              CHOOSE YOUR{" "}
              <span className="text-[#00ff88]" style={{ textShadow: "0 0 20px rgba(0,255,136,0.5)" }}>
                PLAN
              </span>
            </h1>
            <p className="font-mono text-gray-400 text-sm">
              Start free. Upgrade when you&apos;re ready.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* FREE card */}
            <div className="bg-[#0d0d20] border border-[#1a1a2e] rounded-2xl p-8 flex flex-col">
              <div className="mb-6">
                <span className="font-mono text-xs text-gray-400 tracking-widest bg-[#1a1a2e] px-3 py-1 rounded-full">
                  FREE FOREVER
                </span>
              </div>
              <div className="mb-6">
                <span className="font-orbitron text-4xl font-black text-white">$0</span>
                <span className="font-mono text-gray-400 text-sm ml-1">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check
                      className="h-4 w-4 text-[#00ff88] mt-0.5 flex-shrink-0"
                      style={{ filter: "drop-shadow(0 0 4px #00ff88)" }}
                    />
                    <span className="font-mono text-sm text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className="block text-center font-mono text-sm font-bold tracking-widest px-6 py-3 rounded-xl border border-[#1a1a2e] text-gray-300 hover:border-gray-500 hover:text-white transition-all duration-200"
              >
                GET STARTED FREE
              </Link>
            </div>

            {/* PRO card */}
            <div
              className="bg-[#0d0d20] rounded-2xl p-8 flex flex-col relative overflow-hidden"
              style={{
                border: "1px solid #00ff88",
                boxShadow: "0 0 32px rgba(0,255,136,0.15), 0 0 64px rgba(0,255,136,0.05)",
              }}
            >
              <div className="mb-6">
                <span
                  className="font-mono text-xs tracking-widest px-3 py-1 rounded-full text-[#0a0a18] font-bold"
                  style={{
                    background: "#00ff88",
                    animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
                  }}
                >
                  MOST POPULAR
                </span>
              </div>
              <div className="mb-6 flex items-end gap-1">
                <span
                  className="font-orbitron text-4xl font-black"
                  style={{ color: "#00ff88", textShadow: "0 0 16px rgba(0,255,136,0.4)" }}
                >
                  $3
                </span>
                <span className="font-mono text-gray-400 text-sm mb-1">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check
                      className="h-4 w-4 text-[#00ff88] mt-0.5 flex-shrink-0"
                      style={{ filter: "drop-shadow(0 0 4px #00ff88)" }}
                    />
                    <span className="font-mono text-sm text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="font-mono text-sm font-bold tracking-widest px-6 py-3 rounded-xl text-[#0a0a18] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: upgrading
                    ? "rgba(0,255,136,0.6)"
                    : "#00ff88",
                  boxShadow: upgrading ? "none" : "0 0 16px rgba(0,255,136,0.4)",
                }}
              >
                {upgrading ? "REDIRECTING..." : "UPGRADE TO PRO"}
              </button>
              {checkoutError && (
                <p className="mt-3 font-mono text-xs text-[#ffad49]">
                  {checkoutError}
                </p>
              )}
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <h2 className="font-orbitron text-lg font-black text-white tracking-wider text-center mb-6">
              FAQ
            </h2>
            <div className="space-y-3">
              {FAQ.map(({ q, a }, i) => (
                <div
                  key={i}
                  className="bg-[#0d0d20] border border-[#1a1a2e] rounded-xl overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-mono text-sm text-gray-200">{q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="h-4 w-4 text-[#00ff88] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4">
                      <p className="font-mono text-sm text-gray-400">{a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
