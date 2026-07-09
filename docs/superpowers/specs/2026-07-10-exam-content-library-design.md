# Exam Content Library Expansion Design

## Goal

Expand the built-in phrase and sentence library so the site can support CET-4, CET-6, TEM-4, and TEM-8 study needs. The expansion should make the exam target visible to users, keep practice focused, and make future content additions maintainable.

## Scope

This phase adds exam-oriented built-in content and filtering. It does not add AI generation, server storage, accounts, spaced repetition, or official copyrighted word-list imports.

## Content Principles

- All new examples and Chinese translations will be original learning material.
- Content will be exam-oriented rather than copied from official word lists or past papers.
- Each item must include a phrase, Chinese meaning, English example sentence, Chinese example translation, category, difficulty, source, and exam level.
- The first expansion will add 120 built-in items:
  - 30 CET-4 items
  - 30 CET-6 items
  - 30 TEM-4 items
  - 30 TEM-8 items
- Items should cover phrase learning and sentence-level use, including reading, writing, translation, speaking, and academic argument patterns.

## Data Model

Add an `ExamLevel` type:

```ts
export type ExamLevel = "CET4" | "CET6" | "TEM4" | "TEM8";
```

Extend `PhraseDifficulty`:

```ts
export type PhraseDifficulty = "Basic" | "Intermediate" | "Advanced";
```

Add an optional exam marker to `LearningItem`:

```ts
examLevel?: ExamLevel;
```

The field is optional so existing general items and custom user items remain compatible. Built-in exam items should always include it.

## File Organization

Split exam content into focused files:

- `src/data/examItems/cet4.ts`
- `src/data/examItems/cet6.ts`
- `src/data/examItems/tem4.ts`
- `src/data/examItems/tem8.ts`
- `src/data/examItems/index.ts`

`src/data/builtInItems.ts` will continue to export the complete built-in list by combining the existing general items with all exam-specific items. This preserves the app's current import path.

## User Experience

Add exam-level filters to the Practice and Library screens:

- `All`
- `CET-4`
- `CET-6`
- `TEM-4`
- `TEM-8`

Default remains `All` so existing behavior is preserved. When a user selects an exam level, practice questions and phrase matching should use only items from that exam level. Library filtering should support exam-level filtering alongside the existing category filters.

Custom items without an exam level remain visible in `All`. They do not appear under a specific exam filter unless future work adds exam-level selection to the custom item form.

## Practice Behavior

Practice generation should use the filtered item set. If a filter somehow produces no items, the current empty-state behavior should appear.

Fill-blank and phrase-match behavior remains unchanged, but tests should cover that filtered items can still generate valid questions.

## Testing

Add tests for:

- Each exam level has exactly 30 built-in exam items.
- Every exam item has `examLevel`, `phrase`, `meaningZh`, `example`, `exampleZh`, `category`, `difficulty`, and `source`.
- No duplicate built-in IDs exist.
- Library filtering can show CET-4 and TEM-8 items.
- Practice filtering can switch to a specific exam level and still show a valid fill-blank question.
- Existing practice, storage, and app tests still pass.

## Rollout

Implement on a feature branch, open a PR, let GitHub Actions run, merge to `main`, and allow the existing GitHub Pages workflow to deploy the update.

## References

- CET official syllabus page: https://cet.neea.edu.cn/xhtml1/folder/16113/1588-1.htm
- CET official syllabus PDF: https://cet.neea.edu.cn/res/Home/1704/55b02330ac17274664f06d9d3db8249d.pdf
