import type { LearningItem, ProgressState } from "../domain";

export const CUSTOM_ITEMS_KEY = "english_phrase_practice_custom_items";
export const PROGRESS_KEY = "english_phrase_practice_progress";
export const USER_SEED_KEY = "english_phrase_practice_user_seed";

export const emptyProgress: ProgressState = {
  totalAttempts: 0,
  correctAttempts: 0,
  fillBlankAttempts: 0,
  phraseMatchAttempts: 0,
  perItem: {},
  recentItemIds: []
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function createUserSeed(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  if (typeof globalThis.crypto?.getRandomValues === "function") {
    const values = new Uint32Array(2);
    globalThis.crypto.getRandomValues(values);
    return `${values[0].toString(36)}-${values[1].toString(36)}`;
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export function loadUserSeed(): string {
  const existingSeed = localStorage.getItem(USER_SEED_KEY);
  if (existingSeed) return existingSeed;

  const seed = createUserSeed();
  localStorage.setItem(USER_SEED_KEY, seed);
  return seed;
}

export function loadCustomItems(): LearningItem[] {
  return readJson<LearningItem[]>(CUSTOM_ITEMS_KEY, []);
}

export function saveCustomItem(item: LearningItem): LearningItem[] {
  const current = loadCustomItems();
  const next = current.some((existing) => existing.id === item.id)
    ? current.map((existing) => (existing.id === item.id ? item : existing))
    : [...current, item];
  writeJson(CUSTOM_ITEMS_KEY, next);
  return next;
}

export function deleteCustomItem(itemId: string): LearningItem[] {
  const next = loadCustomItems().filter((item) => item.id !== itemId);
  writeJson(CUSTOM_ITEMS_KEY, next);
  return next;
}

export function loadProgress(): ProgressState {
  return readJson<ProgressState>(PROGRESS_KEY, emptyProgress);
}

export function saveProgress(progress: ProgressState): ProgressState {
  writeJson(PROGRESS_KEY, progress);
  return progress;
}

export function recordPracticeAttempt(input: { itemId: string; mode: "fill-blank" | "phrase-match"; correct: boolean }): ProgressState {
  const progress = loadProgress();
  const itemProgress = progress.perItem[input.itemId] ?? { correct: 0, incorrect: 0 };
  const next: ProgressState = {
    totalAttempts: progress.totalAttempts + 1,
    correctAttempts: progress.correctAttempts + (input.correct ? 1 : 0),
    fillBlankAttempts: progress.fillBlankAttempts + (input.mode === "fill-blank" ? 1 : 0),
    phraseMatchAttempts: progress.phraseMatchAttempts + (input.mode === "phrase-match" ? 1 : 0),
    perItem: {
      ...progress.perItem,
      [input.itemId]: {
        correct: itemProgress.correct + (input.correct ? 1 : 0),
        incorrect: itemProgress.incorrect + (input.correct ? 0 : 1)
      }
    },
    recentItemIds: [input.itemId, ...progress.recentItemIds.filter((id) => id !== input.itemId)].slice(0, 8)
  };

  return saveProgress(next);
}
