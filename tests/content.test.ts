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
