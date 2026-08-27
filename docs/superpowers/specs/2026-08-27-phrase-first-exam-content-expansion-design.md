# Phrase-First Exam Content Expansion Design

## Goal

Expand the built-in CET-4, CET-6, TEM-4, and TEM-8 exam content so the site feels useful for sustained exam preparation while keeping the product centered on phrases, collocations, and sentence patterns rather than general single-word memorization.

The current exam bank has 60 items per exam level. That is enough for feature validation, but not enough for repeated practice across reading, writing, translation, and speaking needs.

## Scope

This phase expands and validates the built-in exam content bank. It preserves the existing `LearningItem` structure, current practice flows, current progress dashboard, and existing exam-level filters.

In scope:

- Increase built-in exam content to larger phrase-first targets.
- Keep each exam level balanced across key practice tags.
- Strengthen content quality tests so future additions keep the same standards.
- Keep all examples and Chinese translations original.
- Keep user-created custom items compatible with the existing data model.

Out of scope:

- Importing official copyrighted word lists, past-paper passages, or proprietary examples.
- Adding accounts, backend storage, AI generation, audio, or spaced repetition.
- Turning the product into a broad dictionary or single-word vocabulary list.

## Content Targets

The expanded built-in bank should reach these minimum item counts:

| Exam | Target items | Primary level |
| --- | ---: | --- |
| CET-4 | 200 | core high-frequency phrase practice |
| CET-6 | 250 | academic and translation-oriented phrase practice |
| TEM-4 | 300 | reading, writing, translation, and speaking expression practice |
| TEM-8 | 350 | advanced academic, argument, translation, and interpretation-style phrase practice |

Each exam level must keep at least 80% multi-word items. A multi-word item is a phrase, collocation, phrasal verb, prepositional pattern, discourse marker, sentence frame, or fixed expression with two or more tokens.

Single-word entries are allowed only when the word is a useful anchor for phrase learning. The example must teach a high-value collocation or pattern around that word. Examples:

- `access` through `have access to`
- `priority` through `give priority to`
- `emphasis` through `place emphasis on`
- `contribute` through `contribute to`
- `exposure` through `be exposed to`

## Content Types

The bank should prefer these item types:

- Phrasal verbs: `carry out`, `come up with`, `account for`
- Prepositional phrases and patterns: `in response to`, `with regard to`, `be subject to`
- Verb-noun and adjective-noun collocations: `pose a threat`, `reach a consensus`, `strong evidence`
- Writing frames: `It is widely acknowledged that`, `This suggests that`
- Translation patterns: `not only ... but also`, `the more ..., the more ...`
- Reading discourse phrases: `by contrast`, `in the long run`, `as a result`
- Speaking frames: `from my perspective`, `what matters most is`
- Advanced academic phrases: `give rise to`, `cast doubt on`, `be conducive to`

The content should remain exam-oriented. Items should be useful for sentence production, reading comprehension, translation, or oral expression.

## Difficulty Balance

Difficulty labels should reflect how demanding the phrase is for the target exam, not just how short the expression looks.

Minimum difficulty coverage:

| Exam | Basic | Intermediate | Advanced |
| --- | ---: | ---: | ---: |
| CET-4 | 110 | 80 | 0 |
| CET-6 | 20 | 150 | 70 |
| TEM-4 | 10 | 150 | 120 |
| TEM-8 | 0 | 80 | 250 |

The totals are lower than target item counts in some rows on purpose. They define minimum coverage, not exact distribution. Extra items can be assigned where they naturally fit.

Difficulty caps should prevent level drift:

- CET-4 should have no more than 10 Advanced items.
- CET-6 should have no more than 35 Basic items.
- TEM-4 should have no more than 30 Basic items.
- TEM-8 should have no Basic items unless a later content review explicitly justifies them.

## Tag Balance

Tags may overlap. Each exam level should meet these minimum counts:

| Exam | HighFrequency | Reading | Writing | Translation | Speaking |
| --- | ---: | ---: | ---: | ---: | ---: |
| CET-4 | 140 | 110 | 55 | 45 | 35 |
| CET-6 | 110 | 130 | 85 | 85 | 40 |
| TEM-4 | 90 | 140 | 105 | 105 | 50 |
| TEM-8 | 70 | 170 | 170 | 160 | 60 |

These targets should create enough practice material for every entry point already in the app:

- Exam filters in practice and library screens
- Study plan presets
- Daily practice
- Exam target progress cards
- Weak-item review and recent-practice feedback

## Data Organization

The public export shape should stay stable:

- `src/data/examItems/index.ts` continues to export `examItems` and `examLevelLabels`.
- `src/data/builtInItems.ts` continues to aggregate general built-in items with all exam items.
- Each exam item continues to use `LearningItem`.

As the content grows, the exam item files can be split into focused shards while preserving the current import contract. Recommended organization:

- `src/data/examItems/cet4/index.ts`
- `src/data/examItems/cet4/core.ts`
- `src/data/examItems/cet4/writing.ts`
- `src/data/examItems/cet4/translation.ts`
- `src/data/examItems/cet4/speaking.ts`

Apply the same pattern to `cet6`, `tem4`, and `tem8` if the single-file data modules become hard to review. `createExamItems` should remain the only place that adds built-in source and exam-level metadata.

## Content Quality Rules

Every exam item must have:

- Stable id suffix before `createExamItems` prefixes the exam level.
- Phrase or phrase anchor.
- Chinese meaning.
- English example that contains a blankable form of the phrase or anchor.
- Chinese example translation.
- Category.
- Difficulty.
- One or more explicit tags.
- Built-in source and exam level from `createExamItems`.

Examples should be short enough for focused practice, usually one sentence. They should be natural, original, and aligned with the intended exam level. Chinese meanings should explain the phrase in context, not mechanically translate word by word.

## Test Strategy

Update `tests/content.test.ts` so content integrity fails early when the bank becomes unbalanced.

Required tests:

- Each exam level meets its target item count.
- Each exam level keeps at least 80% multi-word phrase items.
- Single-word anchor entries stay at or below 20% per exam level.
- Each exam level meets the minimum tag counts in the tag-balance table.
- Each exam level meets the minimum difficulty counts in the difficulty table.
- Every exam item has complete required fields.
- Every exam item can generate a fill-blank prompt.
- No duplicate built-in ids exist.
- No duplicate phrase appears inside the same exam level.
- Exam items remain included in the built-in aggregate export.

Useful supporting tests:

- Study plan presets still return enough items after the larger bank is loaded.
- Daily practice can draw from the expanded bank without repeating the same items too narrowly.
- Progress summaries remain accurate with larger item totals.

The tests cannot prove semantic quality by themselves. The data review checklist should still check that examples are natural, translations are clear, tags are justified, and single-word anchors actually teach collocations.

## Implementation Sequence

1. Add or update content tests with the new target counts, tag minimums, difficulty minimums, and phrase-first ratio checks. These tests should fail before content is expanded.
2. Refactor exam data files into shards only where it improves reviewability. Preserve the existing exports.
3. Expand CET-4 and CET-6 first, because they cover the largest learner base and provide the clearest basic-to-intermediate calibration.
4. Expand TEM-4 and TEM-8 next, using more advanced academic, translation, interpretation, and argument patterns.
5. Run content tests after each exam level reaches its target so quality drift is caught quickly.
6. Run full verification with tests, build, and whitespace checks before committing implementation.

## Acceptance Criteria

Implementation is complete when:

- CET-4 has at least 200 built-in exam items.
- CET-6 has at least 250 built-in exam items.
- TEM-4 has at least 300 built-in exam items.
- TEM-8 has at least 350 built-in exam items.
- Every exam level is at least 80% phrase-first by the test definition.
- All key tags have enough practice items per exam level.
- Difficulty labels are distributed according to the target exam levels.
- Existing practice, library, daily practice, and progress flows still work.
- Full automated verification passes.

## Risks

- Large data additions can become hard to review if they stay in one file per exam.
- Tag counts can look balanced while examples are still too similar.
- Single-word anchors can gradually pull the product away from phrase practice if the cap is not enforced.
- Overly ambitious one-pass expansion can increase the chance of duplicate or low-value items.

The implementation should favor smaller reviewable content batches within the same feature branch and keep tests strict enough to reject incomplete batches.
