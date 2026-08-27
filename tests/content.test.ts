import { describe, expect, it } from "vitest";
import { builtInItems } from "../src/data/builtInItems";
import { examItems } from "../src/data/examItems";
import { createExamItems } from "../src/data/examItems/createExamItems";
import type { ExamLevel, LearningItem, PhraseTag } from "../src/domain";
import { buildFillBlankQuestion } from "../src/lib/practice";
import { getItemTags } from "../src/lib/tags";

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
      expect(getExamLevelItems(level).length).toBeGreaterThanOrEqual(targetExamItemCounts[level]);
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
      const items = getExamLevelItems(level);

      for (const tag of phraseTags) {
        expect(items.filter((item) => getItemTags(item).includes(tag)).length).toBeGreaterThanOrEqual(
          minimumTagPracticeItems[level][tag]
        );
      }
    }
  });

  it("keeps a reasonable difficulty spread for each exam level", () => {
    for (const level of examLevels) {
      const items = getExamLevelItems(level);

      for (const [difficulty, minimumCount] of Object.entries(minimumDifficultyBands[level])) {
        expect(items.filter((item) => item.difficulty === difficulty).length).toBeGreaterThanOrEqual(
          minimumCount
        );
      }
    }
  });

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

  it("does not duplicate phrases inside an exam level", () => {
    for (const level of examLevels) {
      const phrases = getExamLevelItems(level).map((item) => item.phrase.toLocaleLowerCase());

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
