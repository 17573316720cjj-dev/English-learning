import { describe, expect, it } from "vitest";
import type { LearningItem } from "../src/domain";
import {
  buildFillBlankQuestion,
  buildPhraseMatchRound,
  checkFillBlankAnswer,
  checkPhraseMatchPair,
  shuffleLearningItems
} from "../src/lib/practice";

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
  },
  {
    id: "daily-run-out-of",
    phrase: "run out of",
    meaningZh: "用完，耗尽",
    example: "I ran out of time before I finished the exercise.",
    exampleZh: "我还没完成练习就没时间了。",
    category: "Daily",
    difficulty: "Basic",
    source: "built-in"
  }
];

describe("practice logic", () => {
  it("builds a fill-blank question from an example sentence", () => {
    const question = buildFillBlankQuestion(items[0], items);
    expect(question.prompt).toBe("I want to ____ my speaking skills before the interview.");
    expect(question.answer).toBe("work on");
    expect(question.options).toContain("work on");
    expect(question.options).toHaveLength(4);
  });

  it("shuffles learning items deterministically by seed", () => {
    const studentAOrder = shuffleLearningItems(items, "student-a", "All").map((item) => item.id);
    const repeatedStudentAOrder = shuffleLearningItems([...items].reverse(), "student-a", "All").map((item) => item.id);
    const studentBOrder = shuffleLearningItems(items, "student-b", "All").map((item) => item.id);

    expect(repeatedStudentAOrder).toEqual(studentAOrder);
    expect(new Set(studentAOrder)).toEqual(new Set(items.map((item) => item.id)));
    expect(studentAOrder).not.toEqual(studentBOrder);
  });

  it("shuffles fill-blank options stably for the current question", () => {
    const question = buildFillBlankQuestion(items[0], items, "student-a");
    const repeatedQuestion = buildFillBlankQuestion(items[0], [...items].reverse(), "student-a");
    const otherStudentQuestion = buildFillBlankQuestion(items[0], items, "student-b");

    expect(question.options).toContain("work on");
    expect(repeatedQuestion.options).toEqual(question.options);
    expect(question.options).not.toEqual(otherStudentQuestion.options);
  });

  it("checks fill-blank answers", () => {
    expect(checkFillBlankAnswer("work on", "work on")).toEqual({ correct: true, normalizedAnswer: "work on" });
    expect(checkFillBlankAnswer(" Work On ", "work on")).toEqual({ correct: true, normalizedAnswer: "work on" });
    expect(checkFillBlankAnswer("give up", "work on")).toEqual({ correct: false, normalizedAnswer: "give up" });
  });

  it("builds a phrase matching round", () => {
    const round = buildPhraseMatchRound(items);
    expect(round.phrases.map((entry) => entry.text)).toEqual([
      "work on",
      "take advantage of",
      "as a result of",
      "run out of"
    ]);
    expect(round.meanings).toHaveLength(4);
    expect(round.meanings.map((entry) => entry.itemId).sort()).toEqual([
      "basic-work-on",
      "cet-take-advantage",
      "daily-run-out-of",
      "writing-as-a-result"
    ]);
  });

  it("shuffles phrase matching meanings stably by seed", () => {
    const round = buildPhraseMatchRound(items, "student-a");
    const repeatedRound = buildPhraseMatchRound([...items].reverse(), "student-a");
    const otherStudentRound = buildPhraseMatchRound(items, "student-b");

    expect(round.meanings).toEqual(repeatedRound.meanings);
    expect(round.meanings.map((entry) => entry.itemId).sort()).toEqual(items.map((item) => item.id).sort());
    expect(round.meanings).not.toEqual(otherStudentRound.meanings);
  });

  it("checks phrase matching pairs", () => {
    expect(checkPhraseMatchPair("basic-work-on", "basic-work-on")).toBe(true);
    expect(checkPhraseMatchPair("basic-work-on", "cet-take-advantage")).toBe(false);
  });
});
