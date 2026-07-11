# Wrong Book Review Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a wrong-book and weak-phrase review flow while preserving the current typography, restrained colors, weak borders, and compact card style.

**Architecture:** Derive weak phrases from the existing local `ProgressState.perItem` counts instead of adding a new storage format. Add a focused review screen that lists weak phrases and starts a scoped practice session using the existing `PracticeScreen` UI.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, localStorage-backed progress.

## Global Constraints

- Do not change the global font stack or introduce a new visual theme.
- Reuse existing `practice-card`, `library-item`, `stat-card`, `nav-button`, and `primary-button` styles.
- Keep the feature local-only and based on current progress data.
- Verify with `npm test` and `npm run build`.

---

### Task 1: Weak Item Selection Rules

**Files:**
- Create: `src/lib/review.ts`
- Test: `tests/review.test.ts`

**Interfaces:**
- Consumes: `LearningItem[]`, `ProgressState`
- Produces: `getWeakLearningItems(items, progress): LearningItem[]`

- [ ] **Step 1: Write failing tests**
  - Assert items with at least one incorrect attempt are included.
  - Assert items whose correct count is more than incorrect count are excluded.
  - Assert returned items are sorted by highest incorrect count, then lowest correct count.

- [ ] **Step 2: Run targeted test**
  - Run: `npm test -- tests/review.test.ts`
  - Expected: fail because `src/lib/review.ts` does not exist yet.

- [ ] **Step 3: Implement helper**
  - Add `getWeakLearningItems` using current progress data only.

- [ ] **Step 4: Verify targeted test passes**
  - Run: `npm test -- tests/review.test.ts`
  - Expected: pass.

### Task 2: Review Screen UI

**Files:**
- Create: `src/components/ReviewScreen.tsx`
- Modify: `src/App.tsx`
- Test: `tests/app.test.tsx`

**Interfaces:**
- Consumes: `items`, `progress`, `onProgressChange`
- Produces: visible `错题复习`, `薄弱短语`, and `开始复习`

- [ ] **Step 1: Write failing app-flow tests**
  - Navigate from home to `错题复习`.
  - Show empty state when there are no weak phrases.
  - After a wrong answer, show that phrase in `薄弱短语`.
  - Start review and verify unrelated phrases are excluded from the review practice pool.

- [ ] **Step 2: Run targeted test**
  - Run: `npm test -- tests/app.test.tsx`
  - Expected: fail because the new screen and nav entry do not exist.

- [ ] **Step 3: Implement screen**
  - Use existing card/list/button classes.
  - Show weak phrase cards with incorrect and correct attempt counts.
  - Render existing `PracticeScreen` with weak items only after `开始复习`.

- [ ] **Step 4: Verify targeted test passes**
  - Run: `npm test -- tests/app.test.tsx`
  - Expected: pass.

### Task 3: Navigation and Style Preservation

**Files:**
- Modify: `src/components/AppNav.tsx`
- Modify: `src/components/HomeScreen.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Produces: new home card label `错题复习`

- [ ] **Step 1: Add navigation type and home card**
  - Extend `FeatureScreen` with `Review`.
  - Add a home card using an existing lucide icon and existing `home-nav-card` styling.

- [ ] **Step 2: Add only minimal layout CSS**
  - Preserve the font stack and color tokens.
  - Keep cards and buttons on existing classes.

- [ ] **Step 3: Verify full suite and build**
  - Run: `npm test`
  - Run: `npm run build`

