import { describe, expect, it } from "vitest";
import type { LearningItem, ProgressState } from "../src/domain";
import { getWeakLearningItems, getWrongLearningItems } from "../src/lib/review";

const items: LearningItem[] = [
  {
    id: "weak-lead-to",
    phrase: "lead to",
    meaningZh: "导致",
    example: "Careless reading can lead to misunderstanding.",
    exampleZh: "粗心阅读可能导致误解。",
    category: "CET",
    difficulty: "Basic",
    source: "built-in",
    examLevel: "CET4"
  },
  {
    id: "mastered-focus-on",
    phrase: "focus on",
    meaningZh: "专注于",
    example: "You should focus on the main idea first.",
    exampleZh: "你应该先关注主旨。",
    category: "CET",
    difficulty: "Basic",
    source: "built-in",
    examLevel: "CET4"
  },
  {
    id: "untouched-work-on",
    phrase: "work on",
    meaningZh: "努力改善",
    example: "I work on my writing every week.",
    exampleZh: "我每周都练习写作。",
    category: "Basic",
    difficulty: "Basic",
    source: "built-in"
  },
  {
    id: "very-weak-run-out",
    phrase: "run out of",
    meaningZh: "用完",
    example: "We may run out of time.",
    exampleZh: "我们可能会没时间。",
    category: "Daily",
    difficulty: "Basic",
    source: "built-in"
  }
];

const progress: ProgressState = {
  totalAttempts: 10,
  correctAttempts: 5,
  fillBlankAttempts: 6,
  phraseMatchAttempts: 4,
  perItem: {
    "weak-lead-to": { correct: 1, incorrect: 2 },
    "mastered-focus-on": { correct: 3, incorrect: 1 },
    "very-weak-run-out": { correct: 0, incorrect: 3 }
  },
  recentItemIds: ["mastered-focus-on", "very-weak-run-out", "weak-lead-to"]
};

describe("review logic", () => {
  it("lists every phrase that has ever been answered incorrectly", () => {
    expect(getWrongLearningItems(items, progress).map((item) => item.id)).toEqual([
      "mastered-focus-on",
      "very-weak-run-out",
      "weak-lead-to"
    ]);
  });

  it("keeps only active weak phrases for review practice", () => {
    expect(getWeakLearningItems(items, progress).map((item) => item.id)).toEqual([
      "very-weak-run-out",
      "weak-lead-to"
    ]);
  });
});
