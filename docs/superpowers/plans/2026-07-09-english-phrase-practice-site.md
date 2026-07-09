# English Phrase Practice Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clean, practice-first English sentence and phrase learning website that runs as a static GitHub Pages app with local browser progress.

**Architecture:** Use a Vite React single-page app. Keep learning content, practice logic, localStorage persistence, and UI components in separate focused modules. The app has no backend, no AI, and no database; built-in content is bundled with the site and custom content/progress are stored in `localStorage`.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, localStorage, GitHub Pages static build.

---

## File Structure

- Create `package.json`: project scripts and dependencies.
- Create `index.html`: Vite entry HTML.
- Create `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: TypeScript configuration.
- Create `vite.config.ts`: React and Vitest configuration.
- Create `src/main.tsx`: React entry point.
- Create `src/App.tsx`: screen navigation and app composition.
- Create `src/styles.css`: white focused visual system and responsive layout.
- Create `src/domain.ts`: shared app types.
- Create `src/data/builtInItems.ts`: default phrase and sentence learning content.
- Create `src/lib/practice.ts`: pure practice generation and answer-checking logic.
- Create `src/lib/storage.ts`: localStorage read/write utilities for custom content and progress.
- Create `src/components/AppNav.tsx`: compact top navigation.
- Create `src/components/PracticeScreen.tsx`: sentence fill-in and phrase matching practice.
- Create `src/components/LibraryScreen.tsx`: browse and filter all learning items.
- Create `src/components/AddItemScreen.tsx`: add, edit, and delete custom items.
- Create `src/components/ProgressScreen.tsx`: local study progress summary.
- Create `tests/setup.ts`: Testing Library matcher setup.
- Create `tests/practice.test.ts`: practice logic tests.
- Create `tests/storage.test.ts`: localStorage tests.
- Create `tests/app.test.tsx`: user-flow tests for React screens.

---

## Task 1: Project Scaffold and Test Harness

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `tests/setup.ts`

- [ ] **Step 1: Create package metadata and scripts**

Create `package.json`:

```json
{
  "name": "english-phrase-practice-site",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest run --passWithNoTests",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^4.7.0",
    "vite": "^5.4.21",
    "typescript": "^5.7.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.6.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^25.0.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run:

```bash
npm install
```

Expected: `package-lock.json` is created and install exits with code 0.

- [ ] **Step 3: Create Vite and TypeScript configuration**

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>English Phrase Practice</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `tsconfig.json`:

```json
{
  "files": [],
  "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "tests"]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true,
    "types": ["node"]
  },
  "include": ["vite.config.ts"]
}
```

Create `vite.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["tests/setup.ts"]
  }
});
```

- [ ] **Step 4: Create a minimal app shell**

Create `src/main.tsx`:

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element #root was not found");
}

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Create `src/App.tsx`:

```tsx
export function App(): JSX.Element {
  return (
    <main className="app-shell">
      <section className="practice-card">
        <p className="eyebrow">Practice</p>
        <h1>English Phrase Practice</h1>
        <p>Practice sentence fill-in and phrase matching with a clean, focused study page.</p>
      </section>
    </main>
  );
}
```

Create `src/styles.css`:

```css
:root {
  color: #111827;
  background: #ffffff;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
input,
select,
textarea {
  font: inherit;
}

.app-shell {
  width: min(1120px, calc(100vw - 32px));
  margin: 0 auto;
  padding: 32px 0;
}

.practice-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  background: #ffffff;
}

.eyebrow {
  margin: 0 0 8px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1,
p {
  margin-top: 0;
}
```

Create `tests/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: Run scaffold verification**

Run:

```bash
npm test
npm run build
```

Expected: both commands exit with code 0. `npm test` may report no tests found because `--passWithNoTests` is set.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json index.html tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts src/main.tsx src/App.tsx src/styles.css tests/setup.ts
git commit -m "chore: scaffold phrase practice site"
```

---

## Task 2: Domain Types, Built-In Content, and Practice Logic

**Files:**
- Create: `src/domain.ts`
- Create: `src/data/builtInItems.ts`
- Create: `src/lib/practice.ts`
- Create: `tests/practice.test.ts`

- [ ] **Step 1: Write failing practice logic tests**

Create `tests/practice.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { LearningItem } from "../src/domain";
import { buildFillBlankQuestion, buildPhraseMatchRound, checkFillBlankAnswer, checkPhraseMatchPair } from "../src/lib/practice";

const items: LearningItem[] = [
  {
    id: "basic-work-on",
    phrase: "work on",
    meaningZh: "努力改善，致力于",
    example: "I want to work on my speaking skills before the interview.",
    exampleZh: "我想在面试前提升口语能力。",
    category: "Basic",
    difficulty: "Basic",
    source: "built-in"
  },
  {
    id: "cet-take-advantage",
    phrase: "take advantage of",
    meaningZh: "利用",
    example: "Students should take advantage of library resources.",
    exampleZh: "学生应该利用图书馆资源。",
    category: "CET",
    difficulty: "Intermediate",
    source: "built-in"
  },
  {
    id: "writing-as-a-result",
    phrase: "as a result of",
    meaningZh: "由于，因为",
    example: "As a result of regular practice, her writing became clearer.",
    exampleZh: "由于经常练习，她的写作变得更清晰。",
    category: "Writing",
    difficulty: "Intermediate",
    source: "built-in"
  }
];

describe("practice logic", () => {
  it("builds a fill-blank question from an example sentence", () => {
    const question = buildFillBlankQuestion(items[0], items);
    expect(question.prompt).toBe("I want to ____ my speaking skills before the interview.");
    expect(question.answer).toBe("work on");
    expect(question.options).toContain("work on");
    expect(question.options).toHaveLength(3);
  });

  it("checks fill-blank answers", () => {
    expect(checkFillBlankAnswer("work on", "work on")).toEqual({ correct: true, normalizedAnswer: "work on" });
    expect(checkFillBlankAnswer(" Work On ", "work on")).toEqual({ correct: true, normalizedAnswer: "work on" });
    expect(checkFillBlankAnswer("give up", "work on")).toEqual({ correct: false, normalizedAnswer: "give up" });
  });

  it("builds a phrase matching round", () => {
    const round = buildPhraseMatchRound(items);
    expect(round.phrases.map((entry) => entry.text)).toEqual(["work on", "take advantage of", "as a result of"]);
    expect(round.meanings).toHaveLength(3);
    expect(round.meanings.map((entry) => entry.itemId).sort()).toEqual(["basic-work-on", "cet-take-advantage", "writing-as-a-result"]);
  });

  it("checks phrase matching pairs", () => {
    expect(checkPhraseMatchPair("basic-work-on", "basic-work-on")).toBe(true);
    expect(checkPhraseMatchPair("basic-work-on", "cet-take-advantage")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
npm test -- tests/practice.test.ts
```

Expected: FAIL because `src/domain.ts` and `src/lib/practice.ts` do not exist.

- [ ] **Step 3: Create shared domain types**

Create `src/domain.ts`:

```ts
export type PhraseCategory = "Basic" | "CET" | "Speaking" | "Writing" | "Daily";
export type PhraseDifficulty = "Basic" | "Intermediate";
export type LearningItemSource = "built-in" | "custom";

export interface LearningItem {
  id: string;
  phrase: string;
  meaningZh: string;
  example: string;
  exampleZh: string;
  category: PhraseCategory;
  difficulty: PhraseDifficulty;
  source: LearningItemSource;
}

export interface FillBlankQuestion {
  item: LearningItem;
  prompt: string;
  options: string[];
  answer: string;
}

export interface MatchEntry {
  itemId: string;
  text: string;
}

export interface PhraseMatchRound {
  phrases: MatchEntry[];
  meanings: MatchEntry[];
}

export interface ProgressState {
  totalAttempts: number;
  correctAttempts: number;
  fillBlankAttempts: number;
  phraseMatchAttempts: number;
  perItem: Record<string, { correct: number; incorrect: number }>;
  recentItemIds: string[];
}
```

- [ ] **Step 4: Create built-in learning content**

Create `src/data/builtInItems.ts`:

```ts
import type { LearningItem } from "../domain";

export const builtInItems: LearningItem[] = [
  {
    id: "basic-work-on",
    phrase: "work on",
    meaningZh: "努力改善，致力于",
    example: "I want to work on my speaking skills before the interview.",
    exampleZh: "我想在面试前提升口语能力。",
    category: "Basic",
    difficulty: "Basic",
    source: "built-in"
  },
  {
    id: "basic-get-used-to",
    phrase: "get used to",
    meaningZh: "习惯于",
    example: "It takes time to get used to reading English every day.",
    exampleZh: "每天阅读英语需要时间来适应。",
    category: "Basic",
    difficulty: "Basic",
    source: "built-in"
  },
  {
    id: "cet-take-advantage",
    phrase: "take advantage of",
    meaningZh: "利用",
    example: "Students should take advantage of library resources.",
    exampleZh: "学生应该利用图书馆资源。",
    category: "CET",
    difficulty: "Intermediate",
    source: "built-in"
  },
  {
    id: "cet-be-likely-to",
    phrase: "be likely to",
    meaningZh: "很可能",
    example: "Students who review regularly are likely to remember more phrases.",
    exampleZh: "经常复习的学生更可能记住更多短语。",
    category: "CET",
    difficulty: "Intermediate",
    source: "built-in"
  },
  {
    id: "speaking-come-up-with",
    phrase: "come up with",
    meaningZh: "想出，提出",
    example: "She came up with a simple way to practice speaking.",
    exampleZh: "她想出了一个练习口语的简单方法。",
    category: "Speaking",
    difficulty: "Basic",
    source: "built-in"
  },
  {
    id: "speaking-look-forward-to",
    phrase: "look forward to",
    meaningZh: "期待",
    example: "I look forward to discussing this topic in class.",
    exampleZh: "我期待在课堂上讨论这个话题。",
    category: "Speaking",
    difficulty: "Basic",
    source: "built-in"
  },
  {
    id: "writing-as-a-result",
    phrase: "as a result of",
    meaningZh: "由于，因为",
    example: "As a result of regular practice, her writing became clearer.",
    exampleZh: "由于经常练习，她的写作变得更清晰。",
    category: "Writing",
    difficulty: "Intermediate",
    source: "built-in"
  },
  {
    id: "writing-in-terms-of",
    phrase: "in terms of",
    meaningZh: "就……而言",
    example: "In terms of accuracy, this sentence is much better.",
    exampleZh: "就准确性而言，这个句子好多了。",
    category: "Writing",
    difficulty: "Intermediate",
    source: "built-in"
  },
  {
    id: "daily-run-out-of",
    phrase: "run out of",
    meaningZh: "用完，耗尽",
    example: "I ran out of time before I finished the exercise.",
    exampleZh: "我还没完成练习就没时间了。",
    category: "Daily",
    difficulty: "Basic",
    source: "built-in"
  },
  {
    id: "daily-keep-track-of",
    phrase: "keep track of",
    meaningZh: "记录，掌握动态",
    example: "This website helps you keep track of your phrase practice.",
    exampleZh: "这个网站帮助你记录短语练习情况。",
    category: "Daily",
    difficulty: "Basic",
    source: "built-in"
  }
];
```

- [ ] **Step 5: Implement practice logic**

Create `src/lib/practice.ts`:

```ts
import type { FillBlankQuestion, LearningItem, PhraseMatchRound } from "../domain";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function rotate<T>(items: T[], amount: number): T[] {
  if (items.length === 0) return [];
  const offset = amount % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

export function buildFillBlankQuestion(item: LearningItem, allItems: LearningItem[]): FillBlankQuestion {
  const prompt = item.example.replace(new RegExp(item.phrase, "i"), "____");
  const distractors = allItems.filter((candidate) => candidate.id !== item.id).map((candidate) => candidate.phrase);
  const options = [item.phrase, ...distractors].slice(0, 4);

  return {
    item,
    prompt,
    options,
    answer: item.phrase
  };
}

export function checkFillBlankAnswer(answer: string, expected: string): { correct: boolean; normalizedAnswer: string } {
  const normalizedAnswer = normalize(answer);
  return {
    correct: normalizedAnswer === normalize(expected),
    normalizedAnswer
  };
}

export function buildPhraseMatchRound(items: LearningItem[]): PhraseMatchRound {
  const selected = items.slice(0, 6);
  return {
    phrases: selected.map((item) => ({ itemId: item.id, text: item.phrase })),
    meanings: rotate(
      selected.map((item) => ({ itemId: item.id, text: item.meaningZh })),
      1
    )
  };
}

export function checkPhraseMatchPair(phraseItemId: string, meaningItemId: string): boolean {
  return phraseItemId === meaningItemId;
}
```

- [ ] **Step 6: Run test to verify pass**

Run:

```bash
npm test -- tests/practice.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/domain.ts src/data/builtInItems.ts src/lib/practice.ts tests/practice.test.ts
git commit -m "feat: add phrase practice logic"
```

---

## Task 3: localStorage Persistence and Progress Updates

**Files:**
- Create: `src/lib/storage.ts`
- Create: `tests/storage.test.ts`

- [ ] **Step 1: Write failing storage tests**

Create `tests/storage.test.ts`:

```ts
import { beforeEach, describe, expect, it } from "vitest";
import type { LearningItem } from "../src/domain";
import {
  CUSTOM_ITEMS_KEY,
  PROGRESS_KEY,
  deleteCustomItem,
  loadCustomItems,
  loadProgress,
  recordPracticeAttempt,
  saveCustomItem
} from "../src/lib/storage";

const customItem: LearningItem = {
  id: "custom-1",
  phrase: "make progress",
  meaningZh: "取得进步",
  example: "I can make progress by practicing every day.",
  exampleZh: "我可以通过每天练习取得进步。",
  category: "Daily",
  difficulty: "Basic",
  source: "custom"
};

beforeEach(() => {
  localStorage.clear();
});

describe("storage", () => {
  it("saves, updates, and deletes custom items", () => {
    saveCustomItem(customItem);
    expect(loadCustomItems()).toEqual([customItem]);

    saveCustomItem({ ...customItem, meaningZh: "进步" });
    expect(loadCustomItems()[0]?.meaningZh).toBe("进步");

    deleteCustomItem("custom-1");
    expect(loadCustomItems()).toEqual([]);
  });

  it("falls back to empty custom items when stored JSON is invalid", () => {
    localStorage.setItem(CUSTOM_ITEMS_KEY, "{broken");
    expect(loadCustomItems()).toEqual([]);
  });

  it("records progress for correct and incorrect attempts", () => {
    recordPracticeAttempt({ itemId: "basic-work-on", mode: "fill-blank", correct: true });
    recordPracticeAttempt({ itemId: "basic-work-on", mode: "phrase-match", correct: false });

    const progress = loadProgress();
    expect(progress.totalAttempts).toBe(2);
    expect(progress.correctAttempts).toBe(1);
    expect(progress.fillBlankAttempts).toBe(1);
    expect(progress.phraseMatchAttempts).toBe(1);
    expect(progress.perItem["basic-work-on"]).toEqual({ correct: 1, incorrect: 1 });
    expect(progress.recentItemIds).toEqual(["basic-work-on"]);
  });

  it("falls back to empty progress when stored JSON is invalid", () => {
    localStorage.setItem(PROGRESS_KEY, "{broken");
    expect(loadProgress()).toMatchObject({
      totalAttempts: 0,
      correctAttempts: 0,
      fillBlankAttempts: 0,
      phraseMatchAttempts: 0,
      perItem: {},
      recentItemIds: []
    });
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
npm test -- tests/storage.test.ts
```

Expected: FAIL because `src/lib/storage.ts` does not exist.

- [ ] **Step 3: Implement storage utilities**

Create `src/lib/storage.ts`:

```ts
import type { LearningItem, ProgressState } from "../domain";

export const CUSTOM_ITEMS_KEY = "english_phrase_practice_custom_items";
export const PROGRESS_KEY = "english_phrase_practice_progress";

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
```

- [ ] **Step 4: Run test to verify pass**

Run:

```bash
npm test -- tests/storage.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/storage.ts tests/storage.test.ts
git commit -m "feat: add local practice storage"
```

---

## Task 4: App Navigation and Practice Screen

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Create: `src/components/AppNav.tsx`
- Create: `src/components/PracticeScreen.tsx`
- Create: `tests/app.test.tsx`

- [ ] **Step 1: Write failing UI tests for navigation and practice**

Create `tests/app.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "../src/App";

beforeEach(() => {
  localStorage.clear();
});

describe("App", () => {
  it("opens directly into sentence fill-in practice", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Complete the sentence" })).toBeInTheDocument();
    expect(screen.getByText(/I want to ____ my speaking skills/)).toBeInTheDocument();
  });

  it("submits a sentence fill-in answer and records progress", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "work on" }));
    await userEvent.click(screen.getByRole("button", { name: "Check answer" }));

    expect(await screen.findByText("Correct")).toBeInTheDocument();
    expect(screen.getByText("努力改善，致力于")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Progress" }));
    expect(screen.getByText("1 attempt")).toBeInTheDocument();
    expect(screen.getByText("100% accuracy")).toBeInTheDocument();
  });

  it("supports phrase matching practice", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Phrase match" }));
    await userEvent.click(screen.getByRole("button", { name: "work on" }));
    await userEvent.click(screen.getByRole("button", { name: "努力改善，致力于" }));

    expect(await screen.findByText("Matched")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
npm test -- tests/app.test.tsx
```

Expected: FAIL because the app shell does not have navigation or practice UI.

- [ ] **Step 3: Create navigation component**

Create `src/components/AppNav.tsx`:

```tsx
export type Screen = "Practice" | "Library" | "Add" | "Progress";

const screens: Screen[] = ["Practice", "Library", "Add", "Progress"];

export function AppNav({ active, onNavigate }: { active: Screen; onNavigate(screen: Screen): void }): JSX.Element {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">PhrasePractice</p>
        <h1>English Phrase Practice</h1>
      </div>
      <nav className="top-nav" aria-label="Main navigation">
        {screens.map((screen) => (
          <button key={screen} className={active === screen ? "nav-button active" : "nav-button"} onClick={() => onNavigate(screen)}>
            {screen}
          </button>
        ))}
      </nav>
    </header>
  );
}
```

- [ ] **Step 4: Create practice screen component**

Create `src/components/PracticeScreen.tsx`:

```tsx
import { useMemo, useState } from "react";
import type { LearningItem } from "../domain";
import { buildFillBlankQuestion, buildPhraseMatchRound, checkFillBlankAnswer, checkPhraseMatchPair } from "../lib/practice";
import { recordPracticeAttempt } from "../lib/storage";

export function PracticeScreen({ items, onProgressChange }: { items: LearningItem[]; onProgressChange(): void }): JSX.Element {
  const [mode, setMode] = useState<"fill-blank" | "phrase-match">("fill-blank");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [fillResult, setFillResult] = useState<"correct" | "incorrect" | null>(null);
  const [selectedPhraseId, setSelectedPhraseId] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<"matched" | "try-again" | null>(null);

  const activeItem = items[0];
  const fillQuestion = useMemo(() => buildFillBlankQuestion(activeItem, items), [activeItem, items]);
  const matchRound = useMemo(() => buildPhraseMatchRound(items), [items]);

  const submitFillBlank = (): void => {
    const result = checkFillBlankAnswer(selectedAnswer, fillQuestion.answer);
    setFillResult(result.correct ? "correct" : "incorrect");
    recordPracticeAttempt({ itemId: fillQuestion.item.id, mode: "fill-blank", correct: result.correct });
    onProgressChange();
  };

  const chooseMeaning = (meaningItemId: string): void => {
    if (!selectedPhraseId) return;
    const correct = checkPhraseMatchPair(selectedPhraseId, meaningItemId);
    setMatchResult(correct ? "matched" : "try-again");
    recordPracticeAttempt({ itemId: selectedPhraseId, mode: "phrase-match", correct });
    onProgressChange();
    setSelectedPhraseId(null);
  };

  return (
    <section className="screen-grid">
      <div className="practice-card">
        <div className="segmented-control" aria-label="Practice mode">
          <button className={mode === "fill-blank" ? "active" : ""} onClick={() => setMode("fill-blank")}>
            Sentence fill-in
          </button>
          <button className={mode === "phrase-match" ? "active" : ""} onClick={() => setMode("phrase-match")}>
            Phrase match
          </button>
        </div>

        {mode === "fill-blank" ? (
          <div>
            <h2>Complete the sentence</h2>
            <p className="sentence-prompt">{fillQuestion.prompt}</p>
            <div className="answer-grid">
              {fillQuestion.options.map((option) => (
                <button key={option} className={selectedAnswer === option ? "answer-button selected" : "answer-button"} onClick={() => setSelectedAnswer(option)}>
                  {option}
                </button>
              ))}
            </div>
            <button className="primary-button" disabled={!selectedAnswer} onClick={submitFillBlank}>
              Check answer
            </button>
            {fillResult ? (
              <div className={fillResult === "correct" ? "feedback correct" : "feedback incorrect"}>
                <strong>{fillResult === "correct" ? "Correct" : "Try again"}</strong>
                <p>{fillQuestion.item.meaningZh}</p>
                <p>{fillQuestion.item.example}</p>
                <p>{fillQuestion.item.exampleZh}</p>
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <h2>Phrase match</h2>
            <p className="muted">Select a phrase, then choose its Chinese meaning.</p>
            <div className="match-grid">
              <div className="match-column">
                {matchRound.phrases.map((entry) => (
                  <button
                    key={entry.itemId}
                    className={selectedPhraseId === entry.itemId ? "answer-button selected" : "answer-button"}
                    onClick={() => setSelectedPhraseId(entry.itemId)}
                  >
                    {entry.text}
                  </button>
                ))}
              </div>
              <div className="match-column">
                {matchRound.meanings.map((entry) => (
                  <button key={entry.itemId} className="answer-button" onClick={() => chooseMeaning(entry.itemId)}>
                    {entry.text}
                  </button>
                ))}
              </div>
            </div>
            {matchResult ? <div className="feedback correct">{matchResult === "matched" ? "Matched" : "Try again"}</div> : null}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Wire App with Practice and current-scope fallback panels**

Replace `src/App.tsx` with:

```tsx
import { useMemo, useState } from "react";
import { builtInItems } from "./data/builtInItems";
import { loadCustomItems, loadProgress } from "./lib/storage";
import { AppNav, type Screen } from "./components/AppNav";
import { PracticeScreen } from "./components/PracticeScreen";

export function App(): JSX.Element {
  const [activeScreen, setActiveScreen] = useState<Screen>("Practice");
  const [customItems, setCustomItems] = useState(() => loadCustomItems());
  const [progress, setProgress] = useState(() => loadProgress());

  const allItems = useMemo(() => [...builtInItems, ...customItems], [customItems]);
  const refreshProgress = (): void => setProgress(loadProgress());

  return (
    <main className="app-shell">
      <AppNav active={activeScreen} onNavigate={setActiveScreen} />
      {activeScreen === "Practice" ? (
        <PracticeScreen items={allItems} onProgressChange={refreshProgress} />
      ) : activeScreen === "Progress" ? (
        <section className="practice-card">
          <p className="eyebrow">Progress</p>
          <h2>{progress.totalAttempts === 1 ? "1 attempt" : `${progress.totalAttempts} attempts`}</h2>
          <p>{progress.totalAttempts === 0 ? "0% accuracy" : `${Math.round((progress.correctAttempts / progress.totalAttempts) * 100)}% accuracy`}</p>
        </section>
      ) : (
        <section className="practice-card">
          <p className="eyebrow">{activeScreen}</p>
          <h2>{activeScreen}</h2>
          <p>Use Practice or Progress while this section is being connected.</p>
        </section>
      )}
    </main>
  );
}
```

- [ ] **Step 6: Extend styles for practice UI**

Append to `src/styles.css`:

```css
.app-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.app-header h1 {
  margin-bottom: 0;
  font-size: 30px;
  line-height: 1.1;
}

.top-nav,
.segmented-control {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.nav-button,
.segmented-control button,
.primary-button,
.answer-button {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  min-height: 40px;
  padding: 0 14px;
  color: #111827;
  background: #ffffff;
  cursor: pointer;
}

.nav-button.active,
.segmented-control button.active,
.answer-button.selected {
  border-color: #111827;
  background: #111827;
  color: #ffffff;
}

.primary-button {
  margin-top: 16px;
  border-color: #111827;
  background: #111827;
  color: #ffffff;
}

.primary-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.screen-grid {
  display: grid;
  gap: 16px;
}

.sentence-prompt {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 18px;
  background: #f9fafb;
  font-size: 20px;
  line-height: 1.5;
}

.answer-grid,
.match-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.match-column {
  display: grid;
  align-content: start;
  gap: 10px;
}

.feedback {
  margin-top: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 14px;
}

.feedback.correct {
  border-color: #bbf7d0;
  background: #f0fdf4;
}

.feedback.incorrect {
  border-color: #fecaca;
  background: #fef2f2;
}

.muted {
  color: #6b7280;
}

@media (max-width: 720px) {
  .app-header {
    align-items: stretch;
    flex-direction: column;
  }

  .answer-grid,
  .match-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 7: Run UI test to verify pass**

Run:

```bash
npm test -- tests/app.test.tsx
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/App.tsx src/styles.css src/components/AppNav.tsx src/components/PracticeScreen.tsx tests/app.test.tsx
git commit -m "feat: add practice-first interface"
```

---

## Task 5: Library Screen with Category Filtering

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/LibraryScreen.tsx`
- Modify: `tests/app.test.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add failing Library test**

Append to `tests/app.test.tsx` inside `describe("App", () => { ... })`:

```tsx
  it("shows a filterable phrase library", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Library" }));

    expect(screen.getByRole("heading", { name: "Phrase library" })).toBeInTheDocument();
    expect(screen.getByText("work on")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Writing" }));
    expect(screen.getByText("as a result of")).toBeInTheDocument();
    expect(screen.queryByText("work on")).not.toBeInTheDocument();
  });
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
npm test -- tests/app.test.tsx
```

Expected: FAIL because `Library` still renders the current-scope fallback panel.

- [ ] **Step 3: Create LibraryScreen component**

Create `src/components/LibraryScreen.tsx`:

```tsx
import { useState } from "react";
import type { LearningItem, PhraseCategory } from "../domain";

const filters: Array<PhraseCategory | "All"> = ["All", "Basic", "CET", "Speaking", "Writing", "Daily"];

export function LibraryScreen({ items }: { items: LearningItem[] }): JSX.Element {
  const [activeFilter, setActiveFilter] = useState<PhraseCategory | "All">("All");
  const visibleItems = activeFilter === "All" ? items : items.filter((item) => item.category === activeFilter);

  return (
    <section className="practice-card">
      <p className="eyebrow">Library</p>
      <h2>Phrase library</h2>
      <div className="filter-row" aria-label="Category filters">
        {filters.map((filter) => (
          <button key={filter} className={activeFilter === filter ? "nav-button active" : "nav-button"} onClick={() => setActiveFilter(filter)}>
            {filter}
          </button>
        ))}
      </div>
      <div className="item-list">
        {visibleItems.map((item) => (
          <article className="library-item" key={item.id}>
            <div>
              <h3>{item.phrase}</h3>
              <p>{item.meaningZh}</p>
              <p className="muted">{item.example}</p>
            </div>
            <span className="item-meta">{item.category}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Wire LibraryScreen in App**

Modify `src/App.tsx` imports:

```tsx
import { LibraryScreen } from "./components/LibraryScreen";
```

Replace the fallback branch with:

```tsx
      ) : activeScreen === "Library" ? (
        <LibraryScreen items={allItems} />
      ) : activeScreen === "Progress" ? (
```

- [ ] **Step 5: Add library styles**

Append to `src/styles.css`:

```css
.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0;
}

.item-list {
  display: grid;
  gap: 10px;
}

.library-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 14px;
  background: #ffffff;
}

.library-item h3 {
  margin: 0 0 6px;
}

.item-meta {
  align-self: flex-start;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 4px 8px;
  color: #6b7280;
  font-size: 13px;
}
```

- [ ] **Step 6: Run tests**

Run:

```bash
npm test -- tests/app.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/components/LibraryScreen.tsx src/styles.css tests/app.test.tsx
git commit -m "feat: add phrase library"
```

---

## Task 6: Add, Edit, and Delete Custom Items

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/AddItemScreen.tsx`
- Modify: `tests/app.test.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add failing custom item management test**

Append to `tests/app.test.tsx` inside `describe("App", () => { ... })`:

```tsx
  it("adds, edits, and deletes custom learning items", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Add" }));

    await userEvent.type(screen.getByLabelText("Phrase"), "make progress");
    await userEvent.type(screen.getByLabelText("Chinese meaning"), "取得进步");
    await userEvent.type(screen.getByLabelText("Example sentence"), "I make progress when I practice daily.");
    await userEvent.type(screen.getByLabelText("Chinese example"), "每天练习时我会取得进步。");
    await userEvent.click(screen.getByRole("button", { name: "Save item" }));

    expect(screen.getByText("make progress")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Edit make progress" }));
    await userEvent.clear(screen.getByLabelText("Chinese meaning"));
    await userEvent.type(screen.getByLabelText("Chinese meaning"), "进步");
    await userEvent.click(screen.getByRole("button", { name: "Save item" }));
    expect(screen.getByText("进步")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Delete make progress" }));
    expect(screen.queryByText("make progress")).not.toBeInTheDocument();
  });
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
npm test -- tests/app.test.tsx
```

Expected: FAIL because `Add` still renders the current-scope fallback panel.

- [ ] **Step 3: Create AddItemScreen component**

Create `src/components/AddItemScreen.tsx`:

```tsx
import { useState } from "react";
import type { LearningItem, PhraseCategory, PhraseDifficulty } from "../domain";

interface FormState {
  id: string;
  phrase: string;
  meaningZh: string;
  example: string;
  exampleZh: string;
  category: PhraseCategory;
  difficulty: PhraseDifficulty;
}

const emptyForm: FormState = {
  id: "",
  phrase: "",
  meaningZh: "",
  example: "",
  exampleZh: "",
  category: "Daily",
  difficulty: "Basic"
};

function createId(phrase: string): string {
  return `custom-${phrase.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now()}`;
}

export function AddItemScreen({
  items,
  onSave,
  onDelete
}: {
  items: LearningItem[];
  onSave(item: LearningItem): void;
  onDelete(itemId: string): void;
}): JSX.Element {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");
  const customItems = items.filter((item) => item.source === "custom");

  const update = (field: keyof FormState, value: string): void => setForm((current) => ({ ...current, [field]: value }));

  const submit = (): void => {
    if (!form.phrase.trim() || !form.meaningZh.trim() || !form.example.trim() || !form.exampleZh.trim()) {
      setError("Please fill in every field.");
      return;
    }

    onSave({
      id: form.id || createId(form.phrase),
      phrase: form.phrase.trim(),
      meaningZh: form.meaningZh.trim(),
      example: form.example.trim(),
      exampleZh: form.exampleZh.trim(),
      category: form.category,
      difficulty: form.difficulty,
      source: "custom"
    });
    setForm(emptyForm);
    setError("");
  };

  const edit = (item: LearningItem): void => {
    setForm({
      id: item.id,
      phrase: item.phrase,
      meaningZh: item.meaningZh,
      example: item.example,
      exampleZh: item.exampleZh,
      category: item.category,
      difficulty: item.difficulty
    });
  };

  return (
    <section className="practice-card">
      <p className="eyebrow">Add</p>
      <h2>Add custom phrase</h2>
      <div className="form-grid">
        <label>
          Phrase
          <input value={form.phrase} onChange={(event) => update("phrase", event.target.value)} />
        </label>
        <label>
          Chinese meaning
          <input value={form.meaningZh} onChange={(event) => update("meaningZh", event.target.value)} />
        </label>
        <label>
          Example sentence
          <textarea value={form.example} onChange={(event) => update("example", event.target.value)} />
        </label>
        <label>
          Chinese example
          <textarea value={form.exampleZh} onChange={(event) => update("exampleZh", event.target.value)} />
        </label>
        <label>
          Category
          <select value={form.category} onChange={(event) => update("category", event.target.value)}>
            <option>Basic</option>
            <option>CET</option>
            <option>Speaking</option>
            <option>Writing</option>
            <option>Daily</option>
          </select>
        </label>
        <label>
          Difficulty
          <select value={form.difficulty} onChange={(event) => update("difficulty", event.target.value)}>
            <option>Basic</option>
            <option>Intermediate</option>
          </select>
        </label>
      </div>
      {error ? <p className="error-message">{error}</p> : null}
      <button className="primary-button" onClick={submit}>
        Save item
      </button>

      <h2 className="section-title">Custom items</h2>
      <div className="item-list">
        {customItems.map((item) => (
          <article className="library-item" key={item.id}>
            <div>
              <h3>{item.phrase}</h3>
              <p>{item.meaningZh}</p>
            </div>
            <div className="row-actions">
              <button className="nav-button" aria-label={`Edit ${item.phrase}`} onClick={() => edit(item)}>
                Edit
              </button>
              <button className="nav-button" aria-label={`Delete ${item.phrase}`} onClick={() => onDelete(item.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Wire custom item management in App**

Modify `src/App.tsx` imports:

```tsx
import type { LearningItem } from "./domain";
import { deleteCustomItem, loadCustomItems, loadProgress, saveCustomItem } from "./lib/storage";
import { AddItemScreen } from "./components/AddItemScreen";
```

Add handlers inside `App`:

```tsx
  const saveItem = (item: LearningItem): void => {
    setCustomItems(saveCustomItem(item));
  };

  const removeItem = (itemId: string): void => {
    setCustomItems(deleteCustomItem(itemId));
  };
```

Add the `Add` branch:

```tsx
      ) : activeScreen === "Add" ? (
        <AddItemScreen items={allItems} onSave={saveItem} onDelete={removeItem} />
      ) : activeScreen === "Progress" ? (
```

- [ ] **Step 5: Add form styles**

Append to `src/styles.css`:

```css
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  color: #374151;
  font-weight: 700;
}

.form-grid input,
.form-grid textarea,
.form-grid select {
  width: 100%;
  min-height: 40px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 10px;
  background: #ffffff;
}

.form-grid textarea {
  min-height: 76px;
  resize: vertical;
}

.error-message {
  color: #b91c1c;
  font-weight: 700;
}

.section-title {
  margin-top: 28px;
}

.row-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 720px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .library-item {
    flex-direction: column;
  }
}
```

- [ ] **Step 6: Run tests**

Run:

```bash
npm test -- tests/app.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/components/AddItemScreen.tsx src/styles.css tests/app.test.tsx
git commit -m "feat: manage custom phrase content"
```

---

## Task 7: Full Progress Screen

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/ProgressScreen.tsx`
- Modify: `tests/app.test.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add failing Progress screen test**

Append to `tests/app.test.tsx` inside `describe("App", () => { ... })`:

```tsx
  it("shows detailed local progress", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "work on" }));
    await userEvent.click(screen.getByRole("button", { name: "Check answer" }));
    await userEvent.click(screen.getByRole("button", { name: "Progress" }));

    expect(screen.getByRole("heading", { name: "Learning progress" })).toBeInTheDocument();
    expect(screen.getByText("1 attempt")).toBeInTheDocument();
    expect(screen.getByText("Fill-in attempts")).toBeInTheDocument();
    expect(screen.getByText("Recently practiced")).toBeInTheDocument();
    expect(screen.getByText("work on")).toBeInTheDocument();
  });
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
npm test -- tests/app.test.tsx
```

Expected: FAIL because Progress is still a minimal inline summary.

- [ ] **Step 3: Create ProgressScreen component**

Create `src/components/ProgressScreen.tsx`:

```tsx
import type { LearningItem, ProgressState } from "../domain";

function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? `1 ${singular}` : `${count} ${plural}`;
}

export function ProgressScreen({ progress, items }: { progress: ProgressState; items: LearningItem[] }): JSX.Element {
  const accuracy = progress.totalAttempts === 0 ? 0 : Math.round((progress.correctAttempts / progress.totalAttempts) * 100);
  const recentItems = progress.recentItemIds.map((id) => items.find((item) => item.id === id)).filter((item): item is LearningItem => Boolean(item));

  return (
    <section className="practice-card">
      <p className="eyebrow">Progress</p>
      <h2>Learning progress</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <span>Total practice</span>
          <strong>{pluralize(progress.totalAttempts, "attempt", "attempts")}</strong>
        </div>
        <div className="stat-card">
          <span>Accuracy</span>
          <strong>{accuracy}% accuracy</strong>
        </div>
        <div className="stat-card">
          <span>Fill-in attempts</span>
          <strong>{progress.fillBlankAttempts}</strong>
        </div>
        <div className="stat-card">
          <span>Match attempts</span>
          <strong>{progress.phraseMatchAttempts}</strong>
        </div>
      </div>
      <h2 className="section-title">Recently practiced</h2>
      <div className="item-list">
        {recentItems.length > 0 ? (
          recentItems.map((item) => (
            <article className="library-item" key={item.id}>
              <div>
                <h3>{item.phrase}</h3>
                <p>{item.meaningZh}</p>
              </div>
              <span className="item-meta">{item.category}</span>
            </article>
          ))
        ) : (
          <p className="muted">Practice a sentence or phrase to start your local progress record.</p>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Wire ProgressScreen in App**

Modify `src/App.tsx` imports:

```tsx
import { ProgressScreen } from "./components/ProgressScreen";
```

Replace the inline progress branch:

```tsx
      ) : activeScreen === "Progress" ? (
        <ProgressScreen progress={progress} items={allItems} />
      ) : (
```

- [ ] **Step 5: Add progress styles**

Append to `src/styles.css`:

```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.stat-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 14px;
  background: #f9fafb;
}

.stat-card span {
  display: block;
  color: #6b7280;
  font-size: 13px;
  margin-bottom: 8px;
}

.stat-card strong {
  font-size: 20px;
}

@media (max-width: 880px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 6: Run tests**

Run:

```bash
npm test -- tests/app.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/components/ProgressScreen.tsx src/styles.css tests/app.test.tsx
git commit -m "feat: add local progress dashboard"
```

---

## Task 8: Final Polish, Build Verification, and GitHub Pages Readiness

**Files:**
- Modify: `package.json`
- Modify: `src/styles.css`
- Create: `README.md`

- [ ] **Step 1: Add GitHub Pages-friendly build metadata**

Modify `package.json` to add homepage and a deploy note script:

```json
{
  "name": "english-phrase-practice-site",
  "version": "0.1.0",
  "private": true,
  "homepage": "https://17573316720cjj-dev.github.io/English-learning/",
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest run --passWithNoTests",
    "test:watch": "vitest"
  }
}
```

Keep the existing dependency sections unchanged.

- [ ] **Step 2: Set Vite base path**

Modify `vite.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/English-learning/",
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["tests/setup.ts"]
  }
});
```

- [ ] **Step 3: Create project README**

Create `README.md`:

```md
# English Phrase Practice

A clean, practice-first English learning website for sentence fill-in and phrase matching.

## Features

- Sentence fill-in practice
- Phrase matching practice
- Built-in English phrases and examples
- Custom phrase add, edit, and delete
- Local progress saved in the browser
- Static GitHub Pages deployment

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm test
npm run build
```

## Deployment

This project is designed for GitHub Pages. It does not require a paid domain, backend, login, or database.
```

- [ ] **Step 4: Run full automated verification**

Run:

```bash
npm test
npm run build
```

Expected: both commands exit with code 0.

- [ ] **Step 5: Run local preview smoke test**

Run:

```bash
npm run dev
```

Open the local URL shown by Vite. Verify manually:

- default screen is `Practice`,
- sentence fill-in works,
- phrase matching works,
- Library filter works,
- custom item can be added, edited, and deleted,
- Progress updates after practice,
- mobile viewport does not overflow.

Stop the dev server with `Ctrl+C`.

- [ ] **Step 6: Commit**

```bash
git add package.json vite.config.ts README.md src/styles.css
git commit -m "docs: add GitHub Pages readiness"
```

- [ ] **Step 7: Final status**

Run:

```bash
git status --short
git log --oneline --decorate -8
```

Expected: clean working tree on `main`.
