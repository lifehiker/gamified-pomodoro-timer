# Features

## Gamified Pomodoro Timer

### Core Timer
- **Description**: Circular countdown timer supporting work, short break, and long break session types. Plays an audio chime on completion using the Web Audio API.
- **Status**: Completed
- **Implementation**: `src/components/timer/PomodoroTimer.tsx`, `src/components/timer/CircularTimer.tsx`, `src/providers/TimerProvider.tsx`
- **Date added**: 2026-04-13

### XP & Leveling System
- **Description**: Users earn XP points per completed session (10 for work, 5 for short break, 2 for long break). Points accumulate into levels (100 pts/level) with a level-up animation on progression.
- **Status**: Completed
- **Implementation**: `src/providers/TimerProvider.tsx`, `src/components/gamification/XPBar.tsx`
- **Date added**: 2026-04-13

### Streak Display
- **Description**: Shows a daily streak count with a fire emoji and visual highlight when streak is active.
- **Status**: Completed
- **Implementation**: `src/components/gamification/StreakDisplay.tsx`
- **Date added**: 2026-04-13

### Task Management
- **Description**: Local task list with add/complete/delete. Tasks track estimated vs. actual pomodoros. Active task can be linked to a timer session. Persists to localStorage.
- **Status**: Completed
- **Implementation**: `src/components/tasks/TaskList.tsx`, `src/components/tasks/TaskItem.tsx`
- **Date added**: 2026-04-13

### Focus Mode
- **Description**: Toggle to signal distraction-free focus. Button toggles between FOCUS MODE and EXIT FOCUS MODE with neon orange highlight.
- **Status**: Completed (UI toggle only; no additional UI hiding currently)
- **Implementation**: `src/components/timer/PomodoroTimer.tsx`, `src/providers/TimerProvider.tsx`
- **Date added**: 2026-04-13

### Achievements
- **Description**: Grid of achievement badges (First Focus, On Fire, Getting Serious, Centurion, Veteran, Early Bird). Currently static/locked — unlock logic not yet wired.
- **Status**: In-progress (UI complete; dynamic unlock tracking planned)
- **Implementation**: `src/components/analytics/AchievementBadge.tsx`
- **Date added**: 2026-04-13

### Analytics — Weekly Chart
- **Description**: Bar chart showing sessions per day for the past 7 days. Uses recharts. Today's bar highlighted in neon green.
- **Status**: Completed (shows mock data; real data via API planned)
- **Implementation**: `src/components/analytics/WeeklyChart.tsx`
- **Date added**: 2026-04-13

### Analytics — Daily Focus Chart
- **Description**: Area chart showing focus minutes per day for the past 14 days. Uses recharts.
- **Status**: Completed (shows mock data; real data via API planned)
- **Implementation**: `src/components/analytics/DailyFocusChart.tsx`
- **Date added**: 2026-04-13

### Navbar with Live XP
- **Description**: Fixed top navigation with links to Dashboard, Stats, and Config. Compact XP bar visible on desktop showing current level and progress.
- **Status**: Completed
- **Implementation**: `src/components/layout/Navbar.tsx`
- **Date added**: 2026-04-13

### Settings Page
- **Description**: In-app settings for all timer durations (work, short break, long break, long break interval), daily goal, auto-start toggles, and sound toggle. Settings saved to localStorage and immediately applied via TimerProvider.
- **Status**: Completed
- **Implementation**: `src/app/settings/page.tsx`
- **Date added**: 2026-04-13

### Google Auth (NextAuth v5)
- **Description**: Sign in with Google via NextAuth v5 with database sessions stored through Prisma adapter.
- **Status**: Completed (backend configured; sign-in UI flow not yet surfaced in pages)
- **Implementation**: `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`
- **Date added**: 2026-04-13

### Stripe Subscriptions
- **Description**: Checkout session creation and webhook handler for Pro subscription. Stores subscription state (customer ID, subscription ID, price ID, period end, status) in database.
- **Status**: Completed (backend complete; Pro gating in UI not yet implemented)
- **Implementation**: `src/lib/stripe.ts`, `src/app/api/subscribe/route.ts`, `src/app/api/webhooks/stripe/route.ts`
- **Date added**: 2026-04-13

### Persistent Session Logging (API)
- **Description**: REST endpoint to create/list Pomodoro sessions per user in the database. Awards points and increments task pomodoro count on session completion.
- **Status**: Completed
- **Implementation**: `src/app/api/sessions/route.ts`
- **Date added**: 2026-04-13

### User Stats API
- **Description**: REST endpoint returning total points, level, streak data, and session counts (today / this week / all time) for authenticated users.
- **Status**: Completed
- **Implementation**: `src/app/api/stats/route.ts`
- **Date added**: 2026-04-13

### Task API (CRUD)
- **Description**: REST endpoints to create, list, update (including completion), and delete tasks scoped to the authenticated user.
- **Status**: Completed
- **Implementation**: `src/app/api/tasks/route.ts`, `src/app/api/tasks/[id]/route.ts`
- **Date added**: 2026-04-13

---

## Code Quality & Bug Fixes (2026-04-13)

### Auto-start Logic Fix
- **Description**: Fixed incorrect auto-start behavior in `COMPLETE_SESSION` reducer. Previously, either auto-start setting would trigger both break and work auto-starts. Now correctly uses `autoStartBreaks` when transitioning from work to break, and `autoStartPomodoros` when transitioning from break to work.
- **Status**: Completed
- **Implementation**: `src/providers/TimerProvider.tsx`
- **Date modified**: 2026-04-13

### Timer Reset on Settings Change Fix
- **Description**: Fixed a bug where changing any setting (e.g., toggling sound) would reset the running timer's countdown. Settings changes now only recalculate `timeLeft` when the timer is not running.
- **Status**: Completed
- **Implementation**: `src/providers/TimerProvider.tsx`
- **Date modified**: 2026-04-13

### Hydration Mismatch Fix (Charts)
- **Description**: Moved `Math.random()`-based mock data generation in WeeklyChart and DailyFocusChart from module scope into `useState` lazy initializers. This prevents SSR/client hydration mismatches caused by different random values on server vs. client.
- **Status**: Completed
- **Implementation**: `src/components/analytics/WeeklyChart.tsx`, `src/components/analytics/DailyFocusChart.tsx`
- **Date modified**: 2026-04-13

### Font Loading Migration
- **Description**: Migrated from `<link>` Google Fonts tags in `<head>` to `next/font/google` with CSS variable injection. Eliminates the `no-page-custom-font` lint warning and improves font performance (preloading, font-display swap, self-hosted).
- **Status**: Completed
- **Implementation**: `src/app/layout.tsx`, `tailwind.config.ts`, `src/app/globals.css`
- **Date modified**: 2026-04-13
