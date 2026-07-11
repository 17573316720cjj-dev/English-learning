import type { LearningItem, PhraseCategory, PhraseDifficulty, PhraseTag } from "../domain";

export const phraseTagLabels: Record<PhraseTag, string> = {
  HighFrequency: "高频",
  Writing: "写作",
  Reading: "阅读",
  Translation: "翻译",
  Speaking: "口语"
};

export function getDefaultPhraseTags(category: PhraseCategory, difficulty: PhraseDifficulty): PhraseTag[] {
  const tags = new Set<PhraseTag>();

  if (difficulty !== "Advanced") {
    tags.add("HighFrequency");
  }

  if (category === "Writing") {
    tags.add("Writing");
  }

  if (category === "Speaking") {
    tags.add("Speaking");
  }

  if (category === "CET" || category === "Basic" || category === "Daily") {
    tags.add("Reading");
  }

  if (category === "Writing" || difficulty === "Advanced") {
    tags.add("Translation");
  }

  if (tags.size === 0) {
    tags.add("HighFrequency");
  }

  return [...tags];
}

export function getItemTags(item: LearningItem): PhraseTag[] {
  return item.tags?.length ? item.tags : getDefaultPhraseTags(item.category, item.difficulty);
}
