import { describe, expect, it } from "vitest";
import { builtInItems } from "../src/data/builtInItems";
import type { LearningItem, ProgressState } from "../src/domain";
import {
  DAILY_PRACTICE_ITEM_LIMIT,
  filterLearningItems,
  getTodayPracticeDateKey,
  getTodayPracticeItems,
  studyPlanPresets
} from "../src/lib/studyPlans";

const items: LearningItem[] = [
  {
    id: "cet4-high-basic",
    phrase: "pay attention to",
    meaningZh: "注意",
    example: "Students should pay attention to useful phrases.",
    exampleZh: "学生应该注意有用短语。",
    category: "Writing",
    difficulty: "Basic",
    tags: ["HighFrequency", "Writing"],
    source: "built-in",
    examLevel: "CET4"
  },
  {
    id: "cet6-writing-intermediate",
    phrase: "take into account",
    meaningZh: "考虑到",
    example: "Writers should take into account different views.",
    exampleZh: "写作者应该考虑不同观点。",
    category: "Writing",
    difficulty: "Intermediate",
    tags: ["HighFrequency", "Writing", "Translation"],
    source: "built-in",
    examLevel: "CET6"
  },
  {
    id: "tem4-reading-intermediate",
    phrase: "make sense of",
    meaningZh: "理解",
    example: "Readers make sense of difficult texts through context.",
    exampleZh: "读者通过语境理解难懂文本。",
    category: "CET",
    difficulty: "Intermediate",
    tags: ["HighFrequency", "Reading"],
    source: "built-in",
    examLevel: "TEM4"
  },
  {
    id: "tem8-speaking-intermediate",
    phrase: "take a balanced view of",
    meaningZh: "客观看待",
    example: "Candidates should take a balanced view of the issue.",
    exampleZh: "考生应客观看待这个问题。",
    category: "Speaking",
    difficulty: "Intermediate",
    tags: ["HighFrequency", "Speaking", "Writing"],
    source: "built-in",
    examLevel: "TEM8"
  }
];

const emptyProgress: ProgressState = {
  totalAttempts: 0,
  correctAttempts: 0,
  fillBlankAttempts: 0,
  phraseMatchAttempts: 0,
  perItem: {},
  recentItemIds: []
};

describe("study plans", () => {
  it("defines exam presets that filter to real practice content", () => {
    expect(studyPlanPresets.map((preset) => preset.title)).toEqual([
      "CET-4 高频基础",
      "CET-6 写作翻译",
      "TEM-4 阅读表达",
      "TEM-8 高级口试"
    ]);

    expect(
      filterLearningItems(items, {
        examLevel: "CET6",
        tag: "Writing",
        difficulty: "Intermediate"
      }).map((item) => item.id)
    ).toEqual(["cet6-writing-intermediate"]);
  });

  it("builds today's practice with weak items first and a capped review size", () => {
    const progress: ProgressState = {
      ...emptyProgress,
      totalAttempts: 1,
      fillBlankAttempts: 1,
      perItem: {
        "tem8-speaking-intermediate": {
          correct: 0,
          incorrect: 1
        }
      },
      recentItemIds: ["tem8-speaking-intermediate"]
    };

    const todayItems = getTodayPracticeItems(items, progress, "student-a", "2026-08-16");

    expect(todayItems[0]?.id).toBe("tem8-speaking-intermediate");
    expect(todayItems).toHaveLength(items.length);
    expect(todayItems.length).toBeLessThanOrEqual(DAILY_PRACTICE_ITEM_LIMIT);
    expect(new Set(todayItems.map((item) => item.id)).size).toBe(todayItems.length);
  });

  it("formats today's date as a local stable key", () => {
    expect(getTodayPracticeDateKey(new Date(2026, 7, 6))).toBe("2026-08-06");
  });

  it("has enough built-in items for every study plan preset", () => {
    for (const preset of studyPlanPresets) {
      const matchingItems = filterLearningItems(builtInItems, preset.filters);

      expect(matchingItems.length).toBeGreaterThanOrEqual(DAILY_PRACTICE_ITEM_LIMIT);
    }
  });
});
