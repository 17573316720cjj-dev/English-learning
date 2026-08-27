# Phrase-First Exam Content Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the built-in CET-4, CET-6, TEM-4, and TEM-8 phrase bank to 200, 250, 300, and 350 exam-oriented practice items while preserving phrase-first learning.

**Architecture:** Keep the existing `LearningItem` model and public exports stable. Strengthen `tests/content.test.ts` first, add focused expansion shards beside the current exam files, then expand one exam level at a time so each batch is testable and reviewable. Existing Practice, Library, Daily Practice, and Progress flows should continue to consume `builtInItems` and `examItems` without interface changes.

**Tech Stack:** Vite, React 19, TypeScript, Vitest, Testing Library, localStorage.

**Spec:** `docs/superpowers/specs/2026-08-27-phrase-first-exam-content-expansion-design.md`

## Global Constraints

- Preserve the existing `LearningItem` structure.
- Preserve the current practice flows, progress dashboard, and exam-level filters.
- Do not import official copyrighted word lists, past-paper passages, or proprietary examples.
- Do not add accounts, backend storage, AI generation, audio, or spaced repetition.
- Keep all examples and Chinese translations original.
- CET-4 must have at least 200 built-in exam items.
- CET-6 must have at least 250 built-in exam items.
- TEM-4 must have at least 300 built-in exam items.
- TEM-8 must have at least 350 built-in exam items.
- Each exam level must keep at least 80% multi-word items.
- Single-word anchor entries must stay at or below 20% per exam level.
- CET-4 should have no more than 10 Advanced items.
- CET-6 should have no more than 35 Basic items.
- TEM-4 should have no more than 30 Basic items.
- TEM-8 should have no Basic items unless a content review explicitly justifies them.
- Every exam item must have a stable id suffix, phrase or phrase anchor, Chinese meaning, English example, Chinese example translation, category, difficulty, one or more tags, built-in source, and exam level.

---

## File Structure

- Modify `tests/content.test.ts`: add phrase-first ratio checks, per-exam target maps, tag targets, difficulty floors, difficulty caps, and single-word cap checks.
- Modify `tests/studyPlans.test.ts`: add assertions that every study plan preset can draw at least one full daily-practice batch from the expanded built-in bank.
- Modify `tests/progressStats.test.ts`: assert progress summaries use expanded totals without changing progress math.
- Modify `src/data/examItems/createExamItems.ts`: export `ExamItemSeed` so shard files can share the seed type.
- Keep existing seed files: `src/data/examItems/cet4.ts`, `src/data/examItems/cet6.ts`, `src/data/examItems/tem4.ts`, and `src/data/examItems/tem8.ts`.
- Create `src/data/examItems/expansions/cet4/index.ts`: aggregate new CET-4 expansion shards with `createExamItems("CET4", seeds)`.
- Create `src/data/examItems/expansions/cet4/core.ts`: new CET-4 high-frequency core phrase seeds.
- Create `src/data/examItems/expansions/cet4/writing.ts`: new CET-4 writing phrase seeds.
- Create `src/data/examItems/expansions/cet4/translation.ts`: new CET-4 translation phrase seeds.
- Create `src/data/examItems/expansions/cet4/speaking.ts`: new CET-4 speaking phrase seeds.
- Create the same `index.ts`, `core.ts`, `writing.ts`, `translation.ts`, and `speaking.ts` layout under `expansions/cet6`, `expansions/tem4`, and `expansions/tem8`.
- Modify `src/data/examItems/index.ts`: keep exporting `examLevelLabels` and `examItems`, now combining original files plus expansion modules.

---

### Task 1: Strengthen Content Quality Tests

**Files:**
- Modify: `tests/content.test.ts`

**Interfaces:**
- Consumes: `examItems: LearningItem[]`, `builtInItems: LearningItem[]`, `ExamLevel`, `PhraseTag`, `getItemTags(item)`, `buildFillBlankQuestion(item, allItems, seed)`.
- Produces: stricter content tests that still pass against the current 60-item-per-exam bank before final target counts are raised.

- [ ] **Step 1: Add phrase-first and per-exam target helpers**

Update the constants and helper functions at the top of `tests/content.test.ts` to this shape:

```ts
const examLevels: ExamLevel[] = ["CET4", "CET6", "TEM4", "TEM8"];
const phraseTags: PhraseTag[] = ["HighFrequency", "Writing", "Reading", "Translation", "Speaking"];
const phraseFirstMinimumRatio = 0.8;
const singleWordMaximumRatio = 0.2;

const targetExamItemCounts: Record<ExamLevel, number> = {
  CET4: 60,
  CET6: 60,
  TEM4: 60,
  TEM8: 60
};

const minimumTagPracticeItems: Record<ExamLevel, Record<PhraseTag, number>> = {
  CET4: {
    HighFrequency: 12,
    Writing: 10,
    Reading: 12,
    Translation: 10,
    Speaking: 8
  },
  CET6: {
    HighFrequency: 12,
    Writing: 10,
    Reading: 12,
    Translation: 10,
    Speaking: 8
  },
  TEM4: {
    HighFrequency: 12,
    Writing: 10,
    Reading: 12,
    Translation: 10,
    Speaking: 8
  },
  TEM8: {
    HighFrequency: 12,
    Writing: 10,
    Reading: 12,
    Translation: 10,
    Speaking: 8
  }
};

const minimumDifficultyBands: Record<ExamLevel, Partial<Record<LearningItem["difficulty"], number>>> = {
  CET4: {
    Basic: 30,
    Intermediate: 20
  },
  CET6: {
    Intermediate: 25,
    Advanced: 20
  },
  TEM4: {
    Intermediate: 20,
    Advanced: 20
  },
  TEM8: {
    Intermediate: 8,
    Advanced: 45
  }
};

const maximumDifficultyBands: Record<ExamLevel, Partial<Record<LearningItem["difficulty"], number>>> = {
  CET4: {
    Advanced: 10
  },
  CET6: {
    Basic: 35
  },
  TEM4: {
    Basic: 30
  },
  TEM8: {
    Basic: 0
  }
};

function getExamLevelItems(level: ExamLevel): LearningItem[] {
  return examItems.filter((item) => item.examLevel === level);
}

function isMultiWordPhrase(item: LearningItem): boolean {
  return item.phrase.trim().split(/\s+/).filter(Boolean).length >= 2;
}
```

- [ ] **Step 2: Replace the current count and tag tests**

Change the item-count test to use `targetExamItemCounts`:

```ts
it("has enough built-in items for each supported exam level", () => {
  for (const level of examLevels) {
    expect(getExamLevelItems(level).length).toBeGreaterThanOrEqual(targetExamItemCounts[level]);
  }
});
```

Change the tag-count test to use the per-exam map:

```ts
it("has enough practice items for every key tag within each exam level", () => {
  for (const level of examLevels) {
    const items = getExamLevelItems(level);

    for (const tag of phraseTags) {
      expect(items.filter((item) => getItemTags(item).includes(tag)).length).toBeGreaterThanOrEqual(
        minimumTagPracticeItems[level][tag]
      );
    }
  }
});
```

- [ ] **Step 3: Add phrase-first ratio and difficulty cap tests**

Add these tests inside `describe("exam content", () => { ... })`:

```ts
it("keeps every exam level phrase-first", () => {
  for (const level of examLevels) {
    const items = getExamLevelItems(level);
    const multiWordItems = items.filter(isMultiWordPhrase);

    expect(multiWordItems.length / items.length).toBeGreaterThanOrEqual(phraseFirstMinimumRatio);
  }
});

it("keeps single-word anchors capped in every exam level", () => {
  for (const level of examLevels) {
    const items = getExamLevelItems(level);
    const singleWordItems = items.filter((item) => !isMultiWordPhrase(item));

    expect(singleWordItems.length / items.length).toBeLessThanOrEqual(singleWordMaximumRatio);
  }
});

it("does not let difficulty labels drift beyond exam level caps", () => {
  for (const level of examLevels) {
    const items = getExamLevelItems(level);

    for (const [difficulty, maximumCount] of Object.entries(maximumDifficultyBands[level])) {
      expect(items.filter((item) => item.difficulty === difficulty).length).toBeLessThanOrEqual(
        maximumCount
      );
    }
  }
});
```

- [ ] **Step 4: Run the strengthened content tests**

Run:

```bash
npm test -- tests/content.test.ts
```

Expected: PASS with the current 60-item-per-exam bank.

- [ ] **Step 5: Commit**

Run:

```bash
git add tests/content.test.ts
git commit -m "test: strengthen exam content quality checks"
```

---

### Task 2: Add Expansion Shard Structure Without Changing Runtime Behavior

**Files:**
- Modify: `src/data/examItems/createExamItems.ts`
- Modify: `src/data/examItems/index.ts`
- Create: `src/data/examItems/expansions/cet4/index.ts`
- Create: `src/data/examItems/expansions/cet4/core.ts`
- Create: `src/data/examItems/expansions/cet4/writing.ts`
- Create: `src/data/examItems/expansions/cet4/translation.ts`
- Create: `src/data/examItems/expansions/cet4/speaking.ts`
- Create: `src/data/examItems/expansions/cet6/index.ts`
- Create: `src/data/examItems/expansions/cet6/core.ts`
- Create: `src/data/examItems/expansions/cet6/writing.ts`
- Create: `src/data/examItems/expansions/cet6/translation.ts`
- Create: `src/data/examItems/expansions/cet6/speaking.ts`
- Create: `src/data/examItems/expansions/tem4/index.ts`
- Create: `src/data/examItems/expansions/tem4/core.ts`
- Create: `src/data/examItems/expansions/tem4/writing.ts`
- Create: `src/data/examItems/expansions/tem4/translation.ts`
- Create: `src/data/examItems/expansions/tem4/speaking.ts`
- Create: `src/data/examItems/expansions/tem8/index.ts`
- Create: `src/data/examItems/expansions/tem8/core.ts`
- Create: `src/data/examItems/expansions/tem8/writing.ts`
- Create: `src/data/examItems/expansions/tem8/translation.ts`
- Create: `src/data/examItems/expansions/tem8/speaking.ts`

**Interfaces:**
- Consumes: existing `createExamItems(examLevel, items)` behavior.
- Produces: empty expansion modules whose arrays can be combined with the existing `cet4Items`, `cet6Items`, `tem4Items`, and `tem8Items` without changing current counts.

- [ ] **Step 1: Export the seed type**

Modify `src/data/examItems/createExamItems.ts`:

```ts
export interface ExamItemSeed {
  id: string;
  phrase: string;
  meaningZh: string;
  example: string;
  exampleZh: string;
  category: PhraseCategory;
  difficulty: PhraseDifficulty;
  tags?: PhraseTag[];
}
```

Keep the function signature:

```ts
export function createExamItems(examLevel: ExamLevel, items: ExamItemSeed[]): LearningItem[] {
```

- [ ] **Step 2: Create expansion folder structure**

Run:

```bash
mkdir -p src/data/examItems/expansions/cet4 src/data/examItems/expansions/cet6 src/data/examItems/expansions/tem4 src/data/examItems/expansions/tem8
```

- [ ] **Step 3: Add empty CET-4 expansion shards**

Create `src/data/examItems/expansions/cet4/core.ts`:

```ts
import type { ExamItemSeed } from "../../createExamItems";

export const cet4ExpansionCoreItems: ExamItemSeed[] = [];
```

Create `src/data/examItems/expansions/cet4/writing.ts`:

```ts
import type { ExamItemSeed } from "../../createExamItems";

export const cet4ExpansionWritingItems: ExamItemSeed[] = [];
```

Create `src/data/examItems/expansions/cet4/translation.ts`:

```ts
import type { ExamItemSeed } from "../../createExamItems";

export const cet4ExpansionTranslationItems: ExamItemSeed[] = [];
```

Create `src/data/examItems/expansions/cet4/speaking.ts`:

```ts
import type { ExamItemSeed } from "../../createExamItems";

export const cet4ExpansionSpeakingItems: ExamItemSeed[] = [];
```

- [ ] **Step 4: Add empty CET-6 expansion shards**

Create `src/data/examItems/expansions/cet6/core.ts`:

```ts
import type { ExamItemSeed } from "../../createExamItems";

export const cet6ExpansionCoreItems: ExamItemSeed[] = [];
```

Create `src/data/examItems/expansions/cet6/writing.ts`:

```ts
import type { ExamItemSeed } from "../../createExamItems";

export const cet6ExpansionWritingItems: ExamItemSeed[] = [];
```

Create `src/data/examItems/expansions/cet6/translation.ts`:

```ts
import type { ExamItemSeed } from "../../createExamItems";

export const cet6ExpansionTranslationItems: ExamItemSeed[] = [];
```

Create `src/data/examItems/expansions/cet6/speaking.ts`:

```ts
import type { ExamItemSeed } from "../../createExamItems";

export const cet6ExpansionSpeakingItems: ExamItemSeed[] = [];
```

- [ ] **Step 5: Add empty TEM-4 expansion shards**

Create `src/data/examItems/expansions/tem4/core.ts`:

```ts
import type { ExamItemSeed } from "../../createExamItems";

export const tem4ExpansionCoreItems: ExamItemSeed[] = [];
```

Create `src/data/examItems/expansions/tem4/writing.ts`:

```ts
import type { ExamItemSeed } from "../../createExamItems";

export const tem4ExpansionWritingItems: ExamItemSeed[] = [];
```

Create `src/data/examItems/expansions/tem4/translation.ts`:

```ts
import type { ExamItemSeed } from "../../createExamItems";

export const tem4ExpansionTranslationItems: ExamItemSeed[] = [];
```

Create `src/data/examItems/expansions/tem4/speaking.ts`:

```ts
import type { ExamItemSeed } from "../../createExamItems";

export const tem4ExpansionSpeakingItems: ExamItemSeed[] = [];
```

- [ ] **Step 6: Add empty TEM-8 expansion shards**

Create `src/data/examItems/expansions/tem8/core.ts`:

```ts
import type { ExamItemSeed } from "../../createExamItems";

export const tem8ExpansionCoreItems: ExamItemSeed[] = [];
```

Create `src/data/examItems/expansions/tem8/writing.ts`:

```ts
import type { ExamItemSeed } from "../../createExamItems";

export const tem8ExpansionWritingItems: ExamItemSeed[] = [];
```

Create `src/data/examItems/expansions/tem8/translation.ts`:

```ts
import type { ExamItemSeed } from "../../createExamItems";

export const tem8ExpansionTranslationItems: ExamItemSeed[] = [];
```

Create `src/data/examItems/expansions/tem8/speaking.ts`:

```ts
import type { ExamItemSeed } from "../../createExamItems";

export const tem8ExpansionSpeakingItems: ExamItemSeed[] = [];
```

- [ ] **Step 7: Add per-exam expansion index files**

Create `src/data/examItems/expansions/cet4/index.ts`:

```ts
import { createExamItems } from "../../createExamItems";
import { cet4ExpansionCoreItems } from "./core";
import { cet4ExpansionSpeakingItems } from "./speaking";
import { cet4ExpansionTranslationItems } from "./translation";
import { cet4ExpansionWritingItems } from "./writing";

export const cet4ExpansionItems = createExamItems("CET4", [
  ...cet4ExpansionCoreItems,
  ...cet4ExpansionWritingItems,
  ...cet4ExpansionTranslationItems,
  ...cet4ExpansionSpeakingItems
]);
```

Create `src/data/examItems/expansions/cet6/index.ts`:

```ts
import { createExamItems } from "../../createExamItems";
import { cet6ExpansionCoreItems } from "./core";
import { cet6ExpansionSpeakingItems } from "./speaking";
import { cet6ExpansionTranslationItems } from "./translation";
import { cet6ExpansionWritingItems } from "./writing";

export const cet6ExpansionItems = createExamItems("CET6", [
  ...cet6ExpansionCoreItems,
  ...cet6ExpansionWritingItems,
  ...cet6ExpansionTranslationItems,
  ...cet6ExpansionSpeakingItems
]);
```

Create `src/data/examItems/expansions/tem4/index.ts`:

```ts
import { createExamItems } from "../../createExamItems";
import { tem4ExpansionCoreItems } from "./core";
import { tem4ExpansionSpeakingItems } from "./speaking";
import { tem4ExpansionTranslationItems } from "./translation";
import { tem4ExpansionWritingItems } from "./writing";

export const tem4ExpansionItems = createExamItems("TEM4", [
  ...tem4ExpansionCoreItems,
  ...tem4ExpansionWritingItems,
  ...tem4ExpansionTranslationItems,
  ...tem4ExpansionSpeakingItems
]);
```

Create `src/data/examItems/expansions/tem8/index.ts`:

```ts
import { createExamItems } from "../../createExamItems";
import { tem8ExpansionCoreItems } from "./core";
import { tem8ExpansionSpeakingItems } from "./speaking";
import { tem8ExpansionTranslationItems } from "./translation";
import { tem8ExpansionWritingItems } from "./writing";

export const tem8ExpansionItems = createExamItems("TEM8", [
  ...tem8ExpansionCoreItems,
  ...tem8ExpansionWritingItems,
  ...tem8ExpansionTranslationItems,
  ...tem8ExpansionSpeakingItems
]);
```

- [ ] **Step 8: Keep the public aggregate export stable**

Modify `src/data/examItems/index.ts` imports:

```ts
import { cet4Items } from "./cet4";
import { cet4ExpansionItems } from "./expansions/cet4";
import { cet6Items } from "./cet6";
import { cet6ExpansionItems } from "./expansions/cet6";
import { tem4Items } from "./tem4";
import { tem4ExpansionItems } from "./expansions/tem4";
import { tem8Items } from "./tem8";
import { tem8ExpansionItems } from "./expansions/tem8";
```

Update the aggregate export:

```ts
export const examItems: LearningItem[] = [
  ...cet4Items,
  ...cet4ExpansionItems,
  ...cet6Items,
  ...cet6ExpansionItems,
  ...tem4Items,
  ...tem4ExpansionItems,
  ...tem8Items,
  ...tem8ExpansionItems
];
```

- [ ] **Step 9: Verify behavior did not change**

Run:

```bash
npm test -- tests/content.test.ts tests/studyPlans.test.ts tests/progressStats.test.ts
npm run build
```

Expected: PASS.

- [ ] **Step 10: Commit**

Run:

```bash
git add src/data/examItems tests/content.test.ts
git commit -m "refactor: add exam content expansion shards"
```

---

### Task 3: Expand CET-4 Phrase Content

**Files:**
- Modify: `src/data/examItems/expansions/cet4/core.ts`
- Modify: `src/data/examItems/expansions/cet4/writing.ts`
- Modify: `src/data/examItems/expansions/cet4/translation.ts`
- Modify: `src/data/examItems/expansions/cet4/speaking.ts`
- Modify: `tests/content.test.ts`

**Interfaces:**
- Consumes: `ExamItemSeed[]` shards and `createExamItems("CET4", seeds)`.
- Produces: at least 200 CET-4 built-in items with final CET-4 tag, difficulty, and phrase-first targets.

- [ ] **Step 1: Raise CET-4 targets in tests**

Update these CET-4 rows in `tests/content.test.ts`:

```ts
const targetExamItemCounts: Record<ExamLevel, number> = {
  CET4: 200,
  CET6: 60,
  TEM4: 60,
  TEM8: 60
};
```

```ts
CET4: {
  HighFrequency: 140,
  Writing: 55,
  Reading: 110,
  Translation: 45,
  Speaking: 35
}
```

```ts
CET4: {
  Basic: 110,
  Intermediate: 80
}
```

- [ ] **Step 2: Run the CET-4 red test**

Run:

```bash
npm test -- tests/content.test.ts
```

Expected: FAIL because CET-4 still has 60 items.

- [ ] **Step 3: Add CET-4 phrase seeds**

Add at least 140 new CET-4 `ExamItemSeed` objects across the four CET-4 shards. Use this distribution as the minimum content mix:

```text
core.ts: at least 70 new high-frequency reading or general-use phrases
writing.ts: at least 30 new writing frames and collocations
translation.ts: at least 25 new translation patterns and sentence structures
speaking.ts: at least 15 new speaking frames
```

Every new seed must use this shape:

```ts
{
  id: "give-priority-to",
  phrase: "give priority to",
  meaningZh: "优先考虑",
  example: "Schools should give priority to students' physical and mental health.",
  exampleZh: "学校应该优先考虑学生的身心健康。",
  category: "Writing",
  difficulty: "Intermediate",
  tags: ["HighFrequency", "Writing", "Translation"]
}
```

Use CET-4-appropriate content. Add enough tags and difficulty labels to reach these final deltas from the current bank:

```text
total items: add at least 140
HighFrequency: add at least 82
Reading: add at least 76
Writing: add at least 44
Translation: add at least 33
Speaking: add at least 21
Basic: add at least 71
Intermediate: add at least 59
Advanced: keep total at or below 10
```

Allowed CET-4 phrase families:

```text
adapt to, be aware of, pay attention to, take part in, make progress in,
have difficulty in, play an important role in, be related to, be willing to,
be likely to, look forward to, keep in touch with, take advantage of,
make full use of, as far as I am concerned, in my opinion, on the one hand,
on the other hand, as a result, in order to, not only but also
```

- [ ] **Step 4: Verify CET-4 content**

Run:

```bash
npm test -- tests/content.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/data/examItems/expansions/cet4 tests/content.test.ts
git commit -m "feat: expand CET-4 phrase content"
```

---

### Task 4: Expand CET-6 Phrase Content

**Files:**
- Modify: `src/data/examItems/expansions/cet6/core.ts`
- Modify: `src/data/examItems/expansions/cet6/writing.ts`
- Modify: `src/data/examItems/expansions/cet6/translation.ts`
- Modify: `src/data/examItems/expansions/cet6/speaking.ts`
- Modify: `tests/content.test.ts`

**Interfaces:**
- Consumes: `ExamItemSeed[]` shards and `createExamItems("CET6", seeds)`.
- Produces: at least 250 CET-6 built-in items with final CET-6 tag, difficulty, and phrase-first targets.

- [ ] **Step 1: Raise CET-6 targets in tests**

Update these rows in `tests/content.test.ts`:

```ts
const targetExamItemCounts: Record<ExamLevel, number> = {
  CET4: 200,
  CET6: 250,
  TEM4: 60,
  TEM8: 60
};
```

```ts
CET6: {
  HighFrequency: 110,
  Writing: 85,
  Reading: 130,
  Translation: 85,
  Speaking: 40
}
```

```ts
CET6: {
  Basic: 20,
  Intermediate: 150,
  Advanced: 70
}
```

- [ ] **Step 2: Run the CET-6 red test**

Run:

```bash
npm test -- tests/content.test.ts
```

Expected: FAIL because CET-6 still has 60 items.

- [ ] **Step 3: Add CET-6 phrase seeds**

Add at least 190 new CET-6 `ExamItemSeed` objects across the four CET-6 shards. Use this minimum content mix:

```text
core.ts: at least 75 new academic reading and general academic phrases
writing.ts: at least 45 new writing argument phrases
translation.ts: at least 45 new translation patterns and collocations
speaking.ts: at least 25 new speaking or discussion frames
```

Every new seed must use this shape:

```ts
{
  id: "take-into-account",
  phrase: "take into account",
  meaningZh: "考虑到",
  example: "Policymakers should take into account the needs of different communities.",
  exampleZh: "政策制定者应该考虑不同群体的需求。",
  category: "Writing",
  difficulty: "Intermediate",
  tags: ["HighFrequency", "Writing", "Translation"]
}
```

Add enough labels to reach these final deltas from the current bank:

```text
total items: add at least 190
HighFrequency: add at least 79
Reading: add at least 97
Writing: add at least 64
Translation: add at least 51
Speaking: add at least 32
Basic: add at least 20 and keep total at or below 35
Intermediate: add at least 116
Advanced: add at least 44
```

Allowed CET-6 phrase families:

```text
account for, contribute to, be exposed to, give rise to, be associated with,
be attributed to, take into account, place emphasis on, impose restrictions on,
have access to, bridge the gap between, reach a consensus on, shed light on,
cast doubt on, in terms of, with respect to, in the long run,
it is widely acknowledged that, this phenomenon can be explained by
```

- [ ] **Step 4: Verify CET-6 content**

Run:

```bash
npm test -- tests/content.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/data/examItems/expansions/cet6 tests/content.test.ts
git commit -m "feat: expand CET-6 phrase content"
```

---

### Task 5: Expand TEM-4 Phrase Content

**Files:**
- Modify: `src/data/examItems/expansions/tem4/core.ts`
- Modify: `src/data/examItems/expansions/tem4/writing.ts`
- Modify: `src/data/examItems/expansions/tem4/translation.ts`
- Modify: `src/data/examItems/expansions/tem4/speaking.ts`
- Modify: `tests/content.test.ts`

**Interfaces:**
- Consumes: `ExamItemSeed[]` shards and `createExamItems("TEM4", seeds)`.
- Produces: at least 300 TEM-4 built-in items with final TEM-4 tag, difficulty, and phrase-first targets.

- [ ] **Step 1: Raise TEM-4 targets in tests**

Update these rows in `tests/content.test.ts`:

```ts
const targetExamItemCounts: Record<ExamLevel, number> = {
  CET4: 200,
  CET6: 250,
  TEM4: 300,
  TEM8: 60
};
```

```ts
TEM4: {
  HighFrequency: 90,
  Writing: 105,
  Reading: 140,
  Translation: 105,
  Speaking: 50
}
```

```ts
TEM4: {
  Basic: 10,
  Intermediate: 150,
  Advanced: 120
}
```

- [ ] **Step 2: Run the TEM-4 red test**

Run:

```bash
npm test -- tests/content.test.ts
```

Expected: FAIL because TEM-4 still has 60 items.

- [ ] **Step 3: Add TEM-4 phrase seeds**

Add at least 240 new TEM-4 `ExamItemSeed` objects across the four TEM-4 shards. Use this minimum content mix:

```text
core.ts: at least 85 new reading and discourse phrases
writing.ts: at least 60 new composition and argument phrases
translation.ts: at least 60 new translation collocations and structures
speaking.ts: at least 35 new oral expression frames
```

Every new seed must use this shape:

```ts
{
  id: "make-sense-of",
  phrase: "make sense of",
  meaningZh: "理解，弄懂",
  example: "Readers can make sense of a difficult passage by following its logic.",
  exampleZh: "读者可以通过梳理逻辑来理解一篇难懂的文章。",
  category: "CET",
  difficulty: "Intermediate",
  tags: ["HighFrequency", "Reading"]
}
```

Add enough labels to reach these final deltas from the current bank:

```text
total items: add at least 240
HighFrequency: add at least 66
Reading: add at least 106
Writing: add at least 80
Translation: add at least 72
Speaking: add at least 38
Basic: add at least 9 and keep total at or below 30
Intermediate: add at least 122
Advanced: add at least 89
```

Allowed TEM-4 phrase families:

```text
make sense of, draw attention to, be inclined to, be reluctant to,
take a firm stand on, to some extent, in sharp contrast to,
from a broader perspective, be consistent with, be relevant to,
leave an impression on, provide insight into, be engaged in,
come to terms with, in the absence of, in comparison with
```

- [ ] **Step 4: Verify TEM-4 content**

Run:

```bash
npm test -- tests/content.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/data/examItems/expansions/tem4 tests/content.test.ts
git commit -m "feat: expand TEM-4 phrase content"
```

---

### Task 6: Expand TEM-8 Phrase Content

**Files:**
- Modify: `src/data/examItems/expansions/tem8/core.ts`
- Modify: `src/data/examItems/expansions/tem8/writing.ts`
- Modify: `src/data/examItems/expansions/tem8/translation.ts`
- Modify: `src/data/examItems/expansions/tem8/speaking.ts`
- Modify: `tests/content.test.ts`

**Interfaces:**
- Consumes: `ExamItemSeed[]` shards and `createExamItems("TEM8", seeds)`.
- Produces: at least 350 TEM-8 built-in items with final TEM-8 tag, difficulty, and phrase-first targets.

- [ ] **Step 1: Raise TEM-8 targets in tests**

Update these rows in `tests/content.test.ts`:

```ts
const targetExamItemCounts: Record<ExamLevel, number> = {
  CET4: 200,
  CET6: 250,
  TEM4: 300,
  TEM8: 350
};
```

```ts
TEM8: {
  HighFrequency: 70,
  Writing: 170,
  Reading: 170,
  Translation: 160,
  Speaking: 60
}
```

```ts
TEM8: {
  Intermediate: 80,
  Advanced: 250
}
```

- [ ] **Step 2: Run the TEM-8 red test**

Run:

```bash
npm test -- tests/content.test.ts
```

Expected: FAIL because TEM-8 still has 60 items.

- [ ] **Step 3: Add TEM-8 phrase seeds**

Add at least 290 new TEM-8 `ExamItemSeed` objects across the four TEM-8 shards. Use this minimum content mix:

```text
core.ts: at least 95 new academic reading and discourse phrases
writing.ts: at least 75 new advanced argument and essay phrases
translation.ts: at least 75 new translation and interpretation-style patterns
speaking.ts: at least 45 new debate, presentation, and oral argument frames
```

Every new seed must use this shape:

```ts
{
  id: "cast-doubt-on",
  phrase: "cast doubt on",
  meaningZh: "使人怀疑",
  example: "The inconsistent evidence may cast doubt on the author's conclusion.",
  exampleZh: "前后不一致的证据可能会使人怀疑作者的结论。",
  category: "Writing",
  difficulty: "Advanced",
  tags: ["Reading", "Writing", "Translation"]
}
```

Add enough labels to reach these final deltas from the current bank:

```text
total items: add at least 290
HighFrequency: add at least 54
Reading: add at least 145
Writing: add at least 128
Translation: add at least 115
Speaking: add at least 50
Intermediate: add at least 70
Advanced: add at least 200
Basic: keep total at 0
```

Allowed TEM-8 phrase families:

```text
cast doubt on, be conducive to, lend support to, call into question,
give rise to, run counter to, be predicated on, be susceptible to,
be inextricably linked to, draw a distinction between, put forward an argument,
advance the view that, take issue with, be open to interpretation,
fall short of, have far-reaching implications for
```

- [ ] **Step 4: Verify TEM-8 content**

Run:

```bash
npm test -- tests/content.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/data/examItems/expansions/tem8 tests/content.test.ts
git commit -m "feat: expand TEM-8 phrase content"
```

---

### Task 7: Add Expanded-Bank Regression Tests

**Files:**
- Modify: `tests/studyPlans.test.ts`
- Modify: `tests/progressStats.test.ts`

**Interfaces:**
- Consumes: `builtInItems`, `studyPlanPresets`, `filterLearningItems`, `DAILY_PRACTICE_ITEM_LIMIT`, `getExamProgressSummaries`.
- Produces: tests proving the larger bank gives each key entry point enough items to practice.

- [ ] **Step 1: Add study-plan capacity test**

Add these imports to `tests/studyPlans.test.ts`:

```ts
import { builtInItems } from "../src/data/builtInItems";
```

Add this test inside `describe("study plans", () => { ... })`:

```ts
it("has enough built-in items for every study plan preset", () => {
  for (const preset of studyPlanPresets) {
    const matchingItems = filterLearningItems(builtInItems, preset.filters);

    expect(matchingItems.length).toBeGreaterThanOrEqual(DAILY_PRACTICE_ITEM_LIMIT);
  }
});
```

- [ ] **Step 2: Add progress total regression test**

Add or update a test in `tests/progressStats.test.ts` so it uses the real expanded bank:

```ts
import { examItems } from "../src/data/examItems";
import { getExamProgressSummaries } from "../src/lib/progressStats";

it("uses expanded exam totals in progress summaries", () => {
  const summaries = getExamProgressSummaries(examItems, {
    totalAttempts: 0,
    correctAttempts: 0,
    fillBlankAttempts: 0,
    phraseMatchAttempts: 0,
    perItem: {},
    recentItemIds: []
  });

  expect(Object.fromEntries(summaries.map((summary) => [summary.examLevel, summary.totalItems]))).toEqual({
    CET4: 200,
    CET6: 250,
    TEM4: 300,
    TEM8: 350
  });
});
```

- [ ] **Step 3: Run regression tests**

Run:

```bash
npm test -- tests/content.test.ts tests/studyPlans.test.ts tests/progressStats.test.ts
```

Expected: PASS.

- [ ] **Step 4: Commit**

Run:

```bash
git add tests/studyPlans.test.ts tests/progressStats.test.ts
git commit -m "test: cover expanded exam practice capacity"
```

---

### Task 8: Full Verification and GitHub Sync

**Files:**
- Modify only files already changed by Tasks 1-7 if verification finds a defect.

**Interfaces:**
- Consumes: all expanded exam content and tests.
- Produces: verified branch pushed to GitHub.

- [ ] **Step 1: Run full test suite**

Run:

```bash
npm test
```

Expected: PASS for all test files.

- [ ] **Step 2: Run production build**

Run:

```bash
npm run build
```

Expected: PASS with `tsc -b` and `vite build` completing successfully.

- [ ] **Step 3: Check whitespace**

Run:

```bash
git diff --check
```

Expected: no output.

- [ ] **Step 4: Inspect final status**

Run:

```bash
git status -sb
git log --oneline -8
```

Expected: worktree is clean and the branch contains the expansion commits.

- [ ] **Step 5: Push the branch**

Run:

```bash
git push
```

Expected: current branch updates on GitHub.

- [ ] **Step 6: Report final outcome**

Include:

```text
Expanded counts: CET-4 200, CET-6 250, TEM-4 300, TEM-8 350.
Verification: npm test, npm run build, git diff --check.
GitHub: branch pushed.
```
