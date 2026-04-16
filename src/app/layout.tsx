import type { Metadata } from "next";
import { Aldrich, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { TimerProvider } from "@/providers/TimerProvider";
import { SessionProvider } from "@/providers/SessionProvider";
import { Toaster } from "@/components/ui/toaster";

const aldrich = Aldrich({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-aldrich",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-plex-mono",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PomodoroQuest — Gamified Focus Timer",
  description: "Level up your productivity with gamified Pomodoro sessions, achievements, and analytics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${aldrich.variable} ${plexMono.variable} ${instrumentSans.variable}`}>
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
