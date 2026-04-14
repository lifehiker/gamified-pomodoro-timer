import type { Metadata } from "next";
import { Orbitron, Space_Mono, Inter } from "next/font/google";
import "./globals.css";
import { TimerProvider } from "@/providers/TimerProvider";
import { SessionProvider } from "@/providers/SessionProvider";
import { Toaster } from "@/components/ui/toaster";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-space-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PomodoroQuest — Gamified Focus Timer",
  description: "Level up your productivity with gamified Pomodoro sessions, achievements, and analytics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${orbitron.variable} ${spaceMono.variable} ${inter.variable}`}>
      <body>
        <SessionProvider>
          <TimerProvider>
            {children}
            <Toaster />
          </TimerProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
