import type { FillBlankQuestion, LearningItem, PhraseMatchRound } from "../domain";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function rotate<T>(items: T[], amount: number): T[] {
  if (items.length === 0) return [];
  const offset = amount % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

function hashString(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function stableShuffle<T>(items: T[], seed: string, scope: string, getKey: (item: T) => string): T[] {
  return [...items]
    .map((item) => {
      const key = getKey(item);
      return {
        item,
        key,
        rank: hashString(`${seed}:${scope}:${key}`)
      };
    })
    .sort((left, right) => left.rank - right.rank || left.key.localeCompare(right.key))
    .map(({ item }) => item);
}

function shuffleValues(values: string[], seed: string, scope: string): string[] {
  return stableShuffle(values, seed, scope, (value) => value);
}

export function shuffleLearningItems(items: LearningItem[], seed: string, scope = "All"): LearningItem[] {
  return stableShuffle(items, seed, scope, (item) => item.id);
}

function getLeadingWordForms(word: string): string[] {
  const lowerWord = word.toLowerCase();
  const irregularForms: Record<string, string[]> = {
    be: ["am", "are", "be", "been", "being", "is", "was", "were"],
    come: ["came", "comes", "coming"],
    run: ["ran", "running", "runs"],
    speak: ["speaking", "speaks", "spoke", "spoken"],
    spring: ["sprang", "springing", "springs", "sprung"]
  };
  const forms = new Set([word, lowerWord, ...(irregularForms[lowerWord] ?? [])]);

  if (lowerWord.endsWith("y") && !/[aeiou]y$/.test(lowerWord)) {
    forms.add(`${lowerWord.slice(0, -1)}ies`);
    forms.add(`${lowerWord.slice(0, -1)}ied`);
  } else if (lowerWord.endsWith("e")) {
    forms.add(`${lowerWord}s`);
    forms.add(`${lowerWord}d`);
    forms.add(`${lowerWord.slice(0, -1)}ing`);
  } else {
    forms.add(`${lowerWord}s`);
    forms.add(`${lowerWord}ed`);
    forms.add(`${lowerWord}ing`);
  }

  return [...forms];
}

function blankPrompt(example: string, phrase: string): string {
  const exactPhrasePattern = new RegExp(escapeRegex(phrase), "i");
  if (exactPhrasePattern.test(example)) {
    return example.replace(exactPhrasePattern, "____");
  }

  const words = phrase.split(/\s+/);
  if (words.length > 1) {
    const leadingWordPattern = getLeadingWordForms(words[0]).map(escapeRegex).join("|");
    const tailPattern = words.slice(1).map(escapeRegex).join("\\s+");
    const flexiblePhrasePattern = new RegExp(
      `\\b(?:${leadingWordPattern})(?:\\s+[A-Za-z'-]+){0,4}\\s+${tailPattern}\\b`,
      "i"
    );

    if (flexiblePhrasePattern.test(example)) {
      return example.replace(flexiblePhrasePattern, "____");
    }
  }

  return `____ ${example}`;
}

export function buildFillBlankQuestion(item: LearningItem, allItems: LearningItem[], seed?: string): FillBlankQuestion {
  const prompt = blankPrompt(item.example, item.phrase);
  const distractors = allItems.filter((candidate) => candidate.id !== item.id);
  const distractorPhrases = seed
    ? stableShuffle(distractors, seed, `${item.id}:distractors`, (candidate) => candidate.id).map(
        (candidate) => candidate.phrase
      )
    : distractors.map((candidate) => candidate.phrase);
  const orderedOptions = [item.phrase, ...distractorPhrases.slice(0, 3)];
  const options = seed ? shuffleValues(orderedOptions, seed, `${item.id}:options`) : orderedOptions;

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

export function buildPhraseMatchRound(items: LearningItem[], seed?: string): PhraseMatchRound {
  const selected = items.slice(0, 6);
  const meanings = selected.map((item) => ({ itemId: item.id, text: item.meaningZh }));
  const shuffledMeanings = seed
    ? stableShuffle(meanings, seed, "phrase-match-meanings", (entry) => entry.itemId)
    : rotate(meanings, 1);

  return {
    phrases: selected.map((item) => ({ itemId: item.id, text: item.phrase })),
    meanings:
      selected.length > 1 && shuffledMeanings.every((entry, index) => entry.itemId === selected[index]?.id)
        ? rotate(shuffledMeanings, 1)
        : shuffledMeanings
  };
}

export function checkPhraseMatchPair(phraseItemId: string, meaningItemId: string): boolean {
  return phraseItemId === meaningItemId;
}
