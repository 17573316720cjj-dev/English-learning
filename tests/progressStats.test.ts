import { describe, expect, it } from "vitest";
import type { LearningItem, ProgressState } from "../src/domain";
import { getExamProgressSummaries } from "../src/lib/progressStats";

const items: LearningItem[] = [
  {
    id: "cet4-reading",
    phrase: "lead to",
    meaningZh: "导致",
    example: "Careless reading can lead to misunderstanding.",
    exampleZh: "粗心阅读可能导致误解。",
    category: "CET",
    difficulty: "Basic",
    tags: ["HighFrequency", "Reading"],
    source: "built-in",
    examLevel: "CET4"
  },
  {
    id: "cet4-writing",
    phrase: "pay attention to",
    meaningZh: "注意",
    example: "Students should pay attention to paragraph structure.",
    exampleZh: "学生应该注意段落结构。",
    category: "Writing",
    difficulty: "Basic",
    tags: ["HighFrequency", "Writing"],
    source: "built-in",
    examLevel: "CET4"
  },
  {
    id: "cet6-translation",
    phrase: "take into account",
    meaningZh: "考虑到",
    example: "Writers should take into account different views.",
    exampleZh: "写作者应该考虑不同观点。",
    category: "Writing",
    difficulty: "Intermediate",
    tags: ["Writing", "Translation"],
    source: "built-in",
    examLevel: "CET6"
  },
  {
    id: "general-work-on",
    phrase: "work on",
    meaningZh: "努力改善",
    example: "I work on my writing every week.",
    exampleZh: "我每周都练习写作。",
    category: "Basic",
    difficulty: "Basic",
    source: "built-in"
  }
];

const progress: ProgressState = {
  totalAttempts: 6,
  correctAttempts: 3,
  fillBlankAttempts: 4,
  phraseMatchAttempts: 2,
  perItem: {
    "cet4-reading": { correct: 1, incorrect: 2 },
    "cet4-writing": { correct: 2, incorrect: 0 },
    "cet6-translation": { correct: 0, incorrect: 1 },
    "general-work-on": { correct: 5, incorrect: 0 }
  },
  recentItemIds: ["cet6-translation", "cet4-writing", "cet4-reading"]
};

describe("exam progress stats", () => {
  it("summarizes practice progress by exam level", () => {
    const summaries = getExamProgressSummaries(items, progress);
    const cet4 = summaries.find((summary) => summary.examLevel === "CET4");
    const cet6 = summaries.find((summary) => summary.examLevel === "CET6");

    expect(cet4).toMatchObject({
      examLevel: "CET4",
      totalItems: 2,
      practicedItems: 2,
      totalAttempts: 5,
      correctAttempts: 3,
      accuracy: 60,
      weakItems: 1
    });
    expect(cet6).toMatchObject({
      examLevel: "CET6",
      totalItems: 1,
      practicedItems: 1,
      totalAttempts: 1,
      correctAttempts: 0,
      accuracy: 0,
      weakItems: 1
    });
  });

  it("reports tag-level coverage and the weakest practiced tag", () => {
    const cet4 = getExamProgressSummaries(items, progress).find((summary) => summary.examLevel === "CET4");
    if (!cet4) throw new Error("Expected CET4 summary");

    expect(cet4.tagSummaries).toContainEqual(
      expect.objectContaining({
        tag: "Reading",
        totalItems: 1,
        practicedItems: 1,
        totalAttempts: 3,
        accuracy: 33
      })
    );
    expect(cet4.focusTag).toEqual(
      expect.objectContaining({
        tag: "Reading",
        accuracy: 33
      })
    );
  });
});
