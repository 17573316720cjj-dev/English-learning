import { describe, expect, it } from "vitest";
import { builtInItems } from "../src/data/builtInItems";
import { examItems } from "../src/data/examItems";
import { createExamItems } from "../src/data/examItems/createExamItems";
import type { ExamLevel, LearningItem } from "../src/domain";
import { buildFillBlankQuestion } from "../src/lib/practice";

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

  it("creates exam items with stable ids and exam metadata", () => {
    expect(
      createExamItems("TEM4", [
        {
          id: "look-into",
          phrase: "look into",
          meaningZh: "调查",
          example: "The committee will look into the issue carefully.",
          exampleZh: "委员会会仔细调查这个问题。",
          category: "Writing",
          difficulty: "Intermediate"
        }
      ])
    ).toEqual([
      {
        id: "tem4-look-into",
        phrase: "look into",
        meaningZh: "调查",
        example: "The committee will look into the issue carefully.",
        exampleZh: "委员会会仔细调查这个问题。",
        category: "Writing",
        difficulty: "Intermediate",
        source: "built-in",
        examLevel: "TEM4"
      }
    ]);
  });

  it("can generate a real blank prompt for every built-in item", () => {
    for (const item of builtInItems) {
      expect(buildFillBlankQuestion(item, builtInItems, "content-check").prompt).toContain("____");
    }
  });
});
