import { describe, expect, it } from "vitest";
import { builtInItems } from "../src/data/builtInItems";
import { examItems } from "../src/data/examItems";
import { createExamItems } from "../src/data/examItems/createExamItems";
import type { ExamLevel, LearningItem, PhraseTag } from "../src/domain";
import { buildFillBlankQuestion } from "../src/lib/practice";
import { getItemTags } from "../src/lib/tags";

const examLevels: ExamLevel[] = ["CET4", "CET6", "TEM4", "TEM8"];
const phraseTags: PhraseTag[] = ["HighFrequency", "Writing", "Reading", "Translation", "Speaking"];
const minimumExamItemCount = 60;
const minimumTagPracticeItems: Record<PhraseTag, number> = {
  HighFrequency: 12,
  Writing: 10,
  Reading: 12,
  Translation: 10,
  Speaking: 8
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

function isCompleteExamItem(item: LearningItem): boolean {
  return Boolean(
    item.id &&
      item.phrase &&
      item.meaningZh &&
      item.example &&
      item.exampleZh &&
      item.category &&
      item.difficulty &&
      item.tags &&
      item.tags.length > 0 &&
      item.source === "built-in" &&
      item.examLevel
  );
}

describe("exam content", () => {
  it("has enough built-in items for each supported exam level", () => {
    for (const level of examLevels) {
      expect(examItems.filter((item) => item.examLevel === level).length).toBeGreaterThanOrEqual(
        minimumExamItemCount
      );
    }
  });

  it("has complete fields for every exam item", () => {
    expect(examItems.every(isCompleteExamItem)).toBe(true);
  });

  it("covers every learning tag in the exam content bank", () => {
    for (const tag of phraseTags) {
      expect(examItems.some((item) => item.tags?.includes(tag))).toBe(true);
    }
  });

  it("has enough practice items for every key tag within each exam level", () => {
    for (const level of examLevels) {
      const items = examItems.filter((item) => item.examLevel === level);

      for (const tag of phraseTags) {
        expect(items.filter((item) => getItemTags(item).includes(tag)).length).toBeGreaterThanOrEqual(
          minimumTagPracticeItems[tag]
        );
      }
    }
  });

  it("keeps a reasonable difficulty spread for each exam level", () => {
    for (const level of examLevels) {
      const items = examItems.filter((item) => item.examLevel === level);

      for (const [difficulty, minimumCount] of Object.entries(minimumDifficultyBands[level])) {
        expect(items.filter((item) => item.difficulty === difficulty).length).toBeGreaterThanOrEqual(
          minimumCount
        );
      }
    }
  });

  it("does not duplicate phrases inside an exam level", () => {
    for (const level of examLevels) {
      const phrases = examItems
        .filter((item) => item.examLevel === level)
        .map((item) => item.phrase.toLocaleLowerCase());

      expect(new Set(phrases).size).toBe(phrases.length);
    }
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
          difficulty: "Intermediate",
          tags: ["HighFrequency", "Reading"]
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
        tags: ["HighFrequency", "Reading"],
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

  it("uses examples that contain a blankable form of every exam phrase", () => {
    for (const item of examItems) {
      const prompt = buildFillBlankQuestion(item, builtInItems, "content-check").prompt;

      expect(prompt).not.toBe(`____ ${item.example}`);
    }
  });
});
