import type { FillBlankQuestion, LearningItem, PhraseMatchRound } from "../domain";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function rotate<T>(items: T[], amount: number): T[] {
  if (items.length === 0) return [];
  const offset = amount % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

export function buildFillBlankQuestion(item: LearningItem, allItems: LearningItem[]): FillBlankQuestion {
  const prompt = item.example.replace(new RegExp(item.phrase, "i"), "____");
  const distractors = allItems.filter((candidate) => candidate.id !== item.id).map((candidate) => candidate.phrase);
  const options = [item.phrase, ...distractors].slice(0, 4);

  return {
    item,
    prompt,
    options,
    answer: item.phrase
  };
}

export function checkFillBlankAnswer(answer: string, expected: string): { correct: boolean; normalizedAnswer: string } {
  const normalizedAnswer = normalize(answer);
  return {
    correct: normalizedAnswer === normalize(expected),
    normalizedAnswer
  };
}

export function buildPhraseMatchRound(items: LearningItem[]): PhraseMatchRound {
  const selected = items.slice(0, 6);
  return {
    phrases: selected.map((item) => ({ itemId: item.id, text: item.phrase })),
    meanings: rotate(
      selected.map((item) => ({ itemId: item.id, text: item.meaningZh })),
      1
    )
  };
}

export function checkPhraseMatchPair(phraseItemId: string, meaningItemId: string): boolean {
  return phraseItemId === meaningItemId;
}
