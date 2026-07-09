# Exam Content Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add CET-4, CET-6, TEM-4, and TEM-8 built-in phrase/sentence content with exam-level filtering in practice and library screens.

**Architecture:** Extend the existing `LearningItem` model with an optional exam level and split exam content into focused files under `src/data/examItems/`. Keep `builtInItems` as the single public aggregate export so existing app imports remain stable. Add local UI state in Practice and Library for exam filtering without changing storage format.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, localStorage.

---

## File Structure

- Modify `src/domain.ts`: add `ExamLevel`, add `Advanced`, and add optional `examLevel`.
- Create `src/data/examItems/cet4.ts`: 30 CET-4 items.
- Create `src/data/examItems/cet6.ts`: 30 CET-6 items.
- Create `src/data/examItems/tem4.ts`: 30 TEM-4 items.
- Create `src/data/examItems/tem8.ts`: 30 TEM-8 items.
- Create `src/data/examItems/index.ts`: aggregate exam items and labels.
- Modify `src/data/builtInItems.ts`: combine existing general items with exam items.
- Modify `src/components/PracticeScreen.tsx`: add exam-level filter and reset transient answer state when filter changes.
- Modify `src/components/LibraryScreen.tsx`: add exam-level filter alongside category filter.
- Modify `src/styles.css`: add small filter group styling if current spacing is not enough.
- Create `tests/content.test.ts`: validate counts, required fields, and duplicate IDs.
- Modify `tests/app.test.tsx`: test exam-level filtering in Practice and Library.

---

## Task 1: Domain and Content Validation Tests

**Files:**
- Modify: `src/domain.ts`
- Create: `tests/content.test.ts`

- [ ] **Step 1: Write failing content tests**

Create `tests/content.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { builtInItems } from "../src/data/builtInItems";
import { examItems } from "../src/data/examItems";
import type { ExamLevel, LearningItem } from "../src/domain";

const examLevels: ExamLevel[] = ["CET4", "CET6", "TEM4", "TEM8"];

function isCompleteExamItem(item: LearningItem): boolean {
  return Boolean(
    item.id &&
      item.phrase &&
      item.meaningZh &&
      item.example &&
      item.exampleZh &&
      item.category &&
      item.difficulty &&
      item.source === "built-in" &&
      item.examLevel
  );
}

describe("exam content", () => {
  it("has 30 built-in items for each supported exam level", () => {
    for (const level of examLevels) {
      expect(examItems.filter((item) => item.examLevel === level)).toHaveLength(30);
    }
  });

  it("has complete fields for every exam item", () => {
    expect(examItems.every(isCompleteExamItem)).toBe(true);
  });

  it("does not duplicate built-in item ids", () => {
    const ids = builtInItems.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps exam items inside the built-in aggregate export", () => {
    for (const item of examItems) {
      expect(builtInItems).toContainEqual(item);
    }
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
npm test -- tests/content.test.ts
```

Expected: FAIL because `src/data/examItems` and `ExamLevel` do not exist yet.

- [ ] **Step 3: Add domain fields**

Modify `src/domain.ts`:

```ts
export type PhraseCategory = "Basic" | "CET" | "Speaking" | "Writing" | "Daily";
export type PhraseDifficulty = "Basic" | "Intermediate" | "Advanced";
export type LearningItemSource = "built-in" | "custom";
export type ExamLevel = "CET4" | "CET6" | "TEM4" | "TEM8";

export interface LearningItem {
  id: string;
  phrase: string;
  meaningZh: string;
  example: string;
  exampleZh: string;
  category: PhraseCategory;
  difficulty: PhraseDifficulty;
  source: LearningItemSource;
  examLevel?: ExamLevel;
}
```

- [ ] **Step 4: Commit after tests pass in Task 2**

Do not commit this task alone until exam content files exist and `tests/content.test.ts` passes.

---

## Task 2: Exam Content Files

**Files:**
- Create: `src/data/examItems/cet4.ts`
- Create: `src/data/examItems/cet6.ts`
- Create: `src/data/examItems/tem4.ts`
- Create: `src/data/examItems/tem8.ts`
- Create: `src/data/examItems/index.ts`
- Modify: `src/data/builtInItems.ts`

- [ ] **Step 1: Create exam item files**

Each exam file should export a `LearningItem[]` with exactly 30 entries. Use IDs prefixed with the lower-case exam level, for example `cet4-adapt-to`, `cet6-account-for`, `tem4-shed-light-on`, and `tem8-call-into-question`.

Every entry must follow this shape:

```ts
{
  id: "cet4-adapt-to",
  phrase: "adapt to",
  meaningZh: "适应",
  example: "Students need time to adapt to a new learning schedule.",
  exampleZh: "学生需要时间适应新的学习安排。",
  category: "CET",
  difficulty: "Basic",
  source: "built-in",
  examLevel: "CET4"
}
```

Use `category: "CET"` for CET-4 and CET-6 items. Use a mix of `Writing`, `Speaking`, and `CET` for TEM-4 and TEM-8 items because the current category model does not yet include `TEM`.

- [ ] **Step 2: Create aggregate export**

Create `src/data/examItems/index.ts`:

```ts
import type { ExamLevel, LearningItem } from "../../domain";
import { cet4Items } from "./cet4";
import { cet6Items } from "./cet6";
import { tem4Items } from "./tem4";
import { tem8Items } from "./tem8";

export const examLevelLabels: Record<ExamLevel, string> = {
  CET4: "CET-4",
  CET6: "CET-6",
  TEM4: "TEM-4",
  TEM8: "TEM-8"
};

export const examItems: LearningItem[] = [...cet4Items, ...cet6Items, ...tem4Items, ...tem8Items];
```

- [ ] **Step 3: Add exam items to built-in aggregate**

Modify `src/data/builtInItems.ts`:

```ts
import type { LearningItem } from "../domain";
import { examItems } from "./examItems";

const generalItems: LearningItem[] = [
  // existing 10 general items
];

export const builtInItems: LearningItem[] = [...generalItems, ...examItems];
```

- [ ] **Step 4: Run content tests**

Run:

```bash
npm test -- tests/content.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/domain.ts src/data/builtInItems.ts src/data/examItems tests/content.test.ts
git commit -m "feat: add exam content library"
```

---

## Task 3: Practice and Library Exam Filters

**Files:**
- Modify: `src/components/PracticeScreen.tsx`
- Modify: `src/components/LibraryScreen.tsx`
- Modify: `src/styles.css`
- Modify: `tests/app.test.tsx`

- [ ] **Step 1: Add failing UI tests**

Append these tests inside `describe("App", () => { ... })` in `tests/app.test.tsx`:

```tsx
  it("filters practice by exam level", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "CET-4" }));

    expect(screen.getByText(/It is important to adapt to/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "adapt to" })).toBeInTheDocument();
  });

  it("filters the phrase library by exam level", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Library" }));
    await userEvent.click(screen.getByRole("button", { name: "TEM-8" }));

    expect(screen.getByText("call into question")).toBeInTheDocument();
    expect(screen.queryByText("work on")).not.toBeInTheDocument();
  });
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm test -- tests/app.test.tsx
```

Expected: FAIL because exam filter controls do not exist yet.

- [ ] **Step 3: Add filter UI to PracticeScreen**

Modify `src/components/PracticeScreen.tsx`:

```tsx
import type { ExamLevel, LearningItem } from "../domain";
import { examLevelLabels } from "../data/examItems";

const examFilters: Array<ExamLevel | "All"> = ["All", "CET4", "CET6", "TEM4", "TEM8"];
```

Add local filter state and derive `visibleItems` before empty-state handling:

```tsx
const [activeExamLevel, setActiveExamLevel] = useState<ExamLevel | "All">("All");
const visibleItems =
  activeExamLevel === "All" ? items : items.filter((item) => item.examLevel === activeExamLevel);
```

Use `visibleItems` instead of `items` for empty state, active item, fill-blank generation, and phrase matching. Add filter buttons above the mode control:

```tsx
<div className="filter-section">
  <span className="filter-label">Exam</span>
  <div className="filter-row" aria-label="Exam filters">
    {examFilters.map((filter) => (
      <button
        key={filter}
        className={activeExamLevel === filter ? "nav-button active" : "nav-button"}
        onClick={() => {
          setActiveExamLevel(filter);
          setSelectedAnswer("");
          setFillResult(null);
          setSelectedPhraseId(null);
          setMatchResult(null);
        }}
      >
        {filter === "All" ? "All" : examLevelLabels[filter]}
      </button>
    ))}
  </div>
</div>
```

- [ ] **Step 4: Add filter UI to LibraryScreen**

Modify `src/components/LibraryScreen.tsx`:

```tsx
import type { ExamLevel, LearningItem, PhraseCategory } from "../domain";
import { examLevelLabels } from "../data/examItems";

const categoryFilters: Array<PhraseCategory | "All"> = ["All", "Basic", "CET", "Speaking", "Writing", "Daily"];
const examFilters: Array<ExamLevel | "All"> = ["All", "CET4", "CET6", "TEM4", "TEM8"];
```

Use two pieces of state:

```tsx
const [activeCategory, setActiveCategory] = useState<PhraseCategory | "All">("All");
const [activeExamLevel, setActiveExamLevel] = useState<ExamLevel | "All">("All");
const visibleItems = items.filter((item) => {
  const matchesCategory = activeCategory === "All" || item.category === activeCategory;
  const matchesExam = activeExamLevel === "All" || item.examLevel === activeExamLevel;
  return matchesCategory && matchesExam;
});
```

Render an exam filter group and a category filter group.

- [ ] **Step 5: Add small filter styles**

Append or adjust in `src/styles.css`:

```css
.filter-section {
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
}

.filter-label {
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
}
```

- [ ] **Step 6: Run UI tests**

Run:

```bash
npm test -- tests/app.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit**

Run:

```bash
git add src/components/PracticeScreen.tsx src/components/LibraryScreen.tsx src/styles.css tests/app.test.tsx
git commit -m "feat: filter learning content by exam"
```

---

## Task 4: Final Verification and Deployment

**Files:**
- No new files expected.

- [ ] **Step 1: Run full local verification**

Run:

```bash
npm test && npm run build
```

Expected: 0 failed tests and successful production build.

- [ ] **Step 2: Run browser smoke check**

Start:

```bash
npm run dev
```

Open `http://127.0.0.1:5173/English-learning/` and verify:

- default Practice still opens,
- CET-4 practice filter shows `adapt to`,
- TEM-8 Library filter shows `call into question`,
- mobile viewport has no horizontal overflow.

Stop the server with `Ctrl+C`.

- [ ] **Step 3: Push and PR**

Run:

```bash
git push -u origin codex/exam-content-library
gh pr create --repo 17573316720cjj-dev/English-learning --base main --head codex/exam-content-library --title "Add exam content library" --body $'## Summary\n- Add CET-4, CET-6, TEM-4, and TEM-8 built-in phrase content.\n- Add exam-level filtering to Practice and Library screens.\n- Validate exam content counts, required fields, and duplicate IDs.\n\n## Test Plan\n- npm test\n- npm run build\n- Browser smoke check for exam filters and mobile overflow.'
```

- [ ] **Step 4: Merge after checks pass**

After PR checks pass:

```bash
gh pr merge "$(gh pr view --repo 17573316720cjj-dev/English-learning --json number --jq .number)" --repo 17573316720cjj-dev/English-learning --merge --delete-branch
git fetch origin --prune
git checkout main
git pull --ff-only
```

Expected: `main` includes the content library and Pages deploys through the existing workflow.
