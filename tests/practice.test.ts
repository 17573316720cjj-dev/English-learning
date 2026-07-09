import { describe, expect, it } from "vitest";
import type { LearningItem } from "../src/domain";
import { buildFillBlankQuestion, buildPhraseMatchRound, checkFillBlankAnswer, checkPhraseMatchPair } from "../src/lib/practice";

const items: LearningItem[] = [
  {
    id: "basic-work-on",
    phrase: "work on",
    meaningZh: "努力改善，致力于",
    example: "I want to work on my speaking skills before the interview.",
    exampleZh: "我想在面试前提升口语能力。",
    category: "Basic",
    difficulty: "Basic",
    source: "built-in"
  },
  {
    id: "cet-take-advantage",
    phrase: "take advantage of",
    meaningZh: "利用",
    example: "Students should take advantage of library resources.",
    exampleZh: "学生应该利用图书馆资源。",
    category: "CET",
    difficulty: "Intermediate",
    source: "built-in"
  },
  {
    id: "writing-as-a-result",
    phrase: "as a result of",
    meaningZh: "由于，因为",
    example: "As a result of regular practice, her writing became clearer.",
    exampleZh: "由于经常练习，她的写作变得更清晰。",
    category: "Writing",
    difficulty: "Intermediate",
    source: "built-in"
  }
];

describe("practice logic", () => {
  it("builds a fill-blank question from an example sentence", () => {
    const question = buildFillBlankQuestion(items[0], items);
    expect(question.prompt).toBe("I want to ____ my speaking skills before the interview.");
    expect(question.answer).toBe("work on");
    expect(question.options).toContain("work on");
    expect(question.options).toHaveLength(3);
  });

  it("checks fill-blank answers", () => {
    expect(checkFillBlankAnswer("work on", "work on")).toEqual({ correct: true, normalizedAnswer: "work on" });
    expect(checkFillBlankAnswer(" Work On ", "work on")).toEqual({ correct: true, normalizedAnswer: "work on" });
    expect(checkFillBlankAnswer("give up", "work on")).toEqual({ correct: false, normalizedAnswer: "give up" });
  });

  it("builds a phrase matching round", () => {
    const round = buildPhraseMatchRound(items);
    expect(round.phrases.map((entry) => entry.text)).toEqual(["work on", "take advantage of", "as a result of"]);
    expect(round.meanings).toHaveLength(3);
    expect(round.meanings.map((entry) => entry.itemId).sort()).toEqual(["basic-work-on", "cet-take-advantage", "writing-as-a-result"]);
  });

  it("checks phrase matching pairs", () => {
    expect(checkPhraseMatchPair("basic-work-on", "basic-work-on")).toBe(true);
    expect(checkPhraseMatchPair("basic-work-on", "cet-take-advantage")).toBe(false);
  });
});
