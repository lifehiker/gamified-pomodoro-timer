import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export interface StoredUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  password: string | null;
  createdAt: string;
  updatedAt: string;
  totalPoints: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

export interface StoredTask {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  estimatedPomodoros: number;
  actualPomodoros: number;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface StoredPomodoroSession {
  id: string;
  userId: string;
  type: "work" | "short_break" | "long_break";
  duration: number;
  completed: boolean;
  pointsEarned: number;
  taskId: string | null;
  startedAt: string;
  completedAt: string | null;
}

export interface StoredSubscription {
  id: string;
  userId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  stripeCurrentPeriodEnd: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface AppStore {
  users: StoredUser[];
  tasks: StoredTask[];
  pomodoroSessions: StoredPomodoroSession[];
  subscriptions: StoredSubscription[];
}

const STORE_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(STORE_DIR, "app-store.json");

const EMPTY_STORE: AppStore = {
  users: [],
  tasks: [],
  pomodoroSessions: [],
  subscriptions: [],
};

async function ensureStore() {
  await fs.mkdir(STORE_DIR, { recursive: true });
  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.writeFile(STORE_PATH, JSON.stringify(EMPTY_STORE, null, 2), "utf8");
  }
}

async function readStore(): Promise<AppStore> {
  await ensureStore();
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<AppStore>;
    return {
      users: parsed.users ?? [],
      tasks: parsed.tasks ?? [],
      pomodoroSessions: parsed.pomodoroSessions ?? [],
      subscriptions: parsed.subscriptions ?? [],
    };
  } catch {
    return structuredClone(EMPTY_STORE);
  }
}

async function writeStore(store: AppStore) {
  await ensureStore();
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

function getLevelFromPoints(totalPoints: number) {
  return Math.floor(totalPoints / 100) + 1;
}

function getSessionDay(isoString: string) {
  return isoString.slice(0, 10);
}

function getStreakData(sessionDates: string[]) {
  const uniqueDates = [...new Set(sessionDates)].sort();
  if (uniqueDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastActiveDate: null as string | null };
  }

  let longestStreak = 1;
  let running = 1;

  for (let i = 1; i < uniqueDates.length; i += 1) {
    const prev = new Date(`${uniqueDates[i - 1]}T00:00:00.000Z`);
    const next = new Date(`${uniqueDates[i]}T00:00:00.000Z`);
    const diffDays = Math.round((next.getTime() - prev.getTime()) / 86400000);
    if (diffDays === 1) {
      running += 1;
      longestStreak = Math.max(longestStreak, running);
    } else if (diffDays > 1) {
      running = 1;
    }
  }

  let currentStreak = 1;
  for (let i = uniqueDates.length - 1; i > 0; i -= 1) {
    const current = new Date(`${uniqueDates[i]}T00:00:00.000Z`);
    const prev = new Date(`${uniqueDates[i - 1]}T00:00:00.000Z`);
    const diffDays = Math.round((current.getTime() - prev.getTime()) / 86400000);
    if (diffDays === 1) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  return {
    currentStreak,
    longestStreak,
    lastActiveDate: uniqueDates[uniqueDates.length - 1],
  };
}

async function refreshUserStats(store: AppStore, userId: string) {
  const user = store.users.find((entry) => entry.id === userId);
  if (!user) return null;

  const completedWorkSessions = store.pomodoroSessions.filter(
    (session) => session.userId === userId && session.completed && session.type === "work"
  );

  const totalPoints = completedWorkSessions.reduce(
    (sum, session) => sum + session.pointsEarned,
    0
  );
  const streak = getStreakData(
    completedWorkSessions.map((session) =>
      getSessionDay(session.completedAt ?? session.startedAt)
    )
  );

  user.totalPoints = totalPoints;
  user.level = getLevelFromPoints(totalPoints);
  user.currentStreak = streak.currentStreak;
  user.longestStreak = streak.longestStreak;
  user.lastActiveDate = streak.lastActiveDate;
  user.updatedAt = new Date().toISOString();

  return user;
}

export async function getUserByEmail(email: string) {
  const store = await readStore();
  return store.users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  ) ?? null;
}

export async function getUserById(userId: string) {
  const store = await readStore();
  return store.users.find((user) => user.id === userId) ?? null;
}

export async function createUser(input: {
  email: string;
  name?: string | null;
  password: string;
}) {
  const store = await readStore();
  const existing = store.users.find(
    (user) => user.email.toLowerCase() === input.email.toLowerCase()
  );
  if (existing) return null;

  const now = new Date().toISOString();
  const user: StoredUser = {
    id: randomUUID(),
    email: input.email,
    name: input.name?.trim() || null,
    image: null,
    password: input.password,
    createdAt: now,
    updatedAt: now,
    totalPoints: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
  };

  store.users.push(user);
  await writeStore(store);
  return user;
}

export async function listTasks(userId: string) {
  const store = await readStore();
  return store.tasks
    .filter((task) => task.userId === userId && !task.completed)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createTask(
  userId: string,
  input: {
    title: string;
    description?: string | null;
    estimatedPomodoros?: number;
    priority?: "low" | "medium" | "high";
  }
) {
  const store = await readStore();
  const now = new Date().toISOString();
  const task: StoredTask = {
    id: randomUUID(),
    userId,
    title: input.title.trim(),
    description: input.description?.trim() || null,
    estimatedPomodoros: input.estimatedPomodoros ?? 1,
    actualPomodoros: 0,
    completed: false,
    priority: input.priority ?? "medium",
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  };

  store.tasks.push(task);
  await writeStore(store);
  return task;
}

export async function updateTask(
  userId: string,
  taskId: string,
  updates: Partial<Pick<StoredTask, "title" | "description" | "estimatedPomodoros" | "actualPomodoros" | "completed" | "priority">>
) {
  const store = await readStore();
  const task = store.tasks.find((entry) => entry.id === taskId && entry.userId === userId);
  if (!task) return null;

  Object.assign(task, updates);
  task.updatedAt = new Date().toISOString();
  task.completedAt = task.completed ? new Date().toISOString() : null;

  await writeStore(store);
  return task;
}

export async function deleteTask(userId: string, taskId: string) {
  const store = await readStore();
  const index = store.tasks.findIndex((entry) => entry.id === taskId && entry.userId === userId);
  if (index === -1) return false;
  store.tasks.splice(index, 1);
  await writeStore(store);
  return true;
}

export async function listSessions(userId: string, days: number) {
  const store = await readStore();
  const since = new Date();
  since.setDate(since.getDate() - days);
  return store.pomodoroSessions
    .filter((session) => session.userId === userId && new Date(session.startedAt) >= since)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .slice(0, 100);
}

export async function createSession(
  userId: string,
  input: {
    type: StoredPomodoroSession["type"];
    duration: number;
    completed: boolean;
    pointsEarned: number;
    taskId?: string | null;
  }
) {
  const store = await readStore();
  const now = new Date().toISOString();
  const session: StoredPomodoroSession = {
    id: randomUUID(),
    userId,
    type: input.type,
    duration: input.duration,
    completed: input.completed,
    pointsEarned: input.pointsEarned,
    taskId: input.taskId ?? null,
    startedAt: now,
    completedAt: input.completed ? now : null,
  };

  store.pomodoroSessions.push(session);

  if (input.completed && input.taskId && input.type === "work") {
    const task = store.tasks.find((entry) => entry.id === input.taskId && entry.userId === userId);
    if (task) {
      task.actualPomodoros += 1;
      task.updatedAt = now;
    }
  }

  const user = await refreshUserStats(store, userId);
  await writeStore(store);
  return { session, user };
}

export async function getUserStats(userId: string) {
  const store = await readStore();
  const user = store.users.find((entry) => entry.id === userId);
  if (!user) return null;

  await refreshUserStats(store, userId);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const completedSessions = store.pomodoroSessions.filter(
    (session) => session.userId === userId && session.completed
  );

  await writeStore(store);

  return {
    totalPoints: user.totalPoints,
    level: user.level,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    todaySessions: completedSessions.filter(
      (session) => new Date(session.startedAt) >= today
    ).length,
    weekSessions: completedSessions.filter(
      (session) => new Date(session.startedAt) >= weekAgo
    ).length,
    totalSessions: completedSessions.length,
  };
}

export async function upsertSubscription(input: {
  userId: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  stripeCurrentPeriodEnd?: string | null;
  status: string;
}) {
  const store = await readStore();
  const now = new Date().toISOString();
  const existing = store.subscriptions.find((entry) => entry.userId === input.userId);

  if (existing) {
    existing.stripeCustomerId = input.stripeCustomerId ?? existing.stripeCustomerId;
    existing.stripeSubscriptionId = input.stripeSubscriptionId ?? existing.stripeSubscriptionId;
    existing.stripePriceId = input.stripePriceId ?? existing.stripePriceId;
    existing.stripeCurrentPeriodEnd = input.stripeCurrentPeriodEnd ?? existing.stripeCurrentPeriodEnd;
    existing.status = input.status;
    existing.updatedAt = now;
    await writeStore(store);
    return existing;
  }

  const subscription: StoredSubscription = {
    id: randomUUID(),
    userId: input.userId,
    stripeCustomerId: input.stripeCustomerId ?? null,
    stripeSubscriptionId: input.stripeSubscriptionId ?? null,
    stripePriceId: input.stripePriceId ?? null,
    stripeCurrentPeriodEnd: input.stripeCurrentPeriodEnd ?? null,
    status: input.status,
    createdAt: now,
    updatedAt: now,
  };

  store.subscriptions.push(subscription);
  await writeStore(store);
  return subscription;
}

export async function updateSubscriptionByStripeId(
  stripeSubscriptionId: string,
  updates: { status: string; stripeCurrentPeriodEnd?: string | null }
) {
  const store = await readStore();
  const matches = store.subscriptions.filter(
    (entry) => entry.stripeSubscriptionId === stripeSubscriptionId
  );
  if (matches.length === 0) return 0;

  for (const match of matches) {
    match.status = updates.status;
    match.stripeCurrentPeriodEnd = updates.stripeCurrentPeriodEnd ?? match.stripeCurrentPeriodEnd;
    match.updatedAt = new Date().toISOString();
  }

  await writeStore(store);
  return matches.length;
}
