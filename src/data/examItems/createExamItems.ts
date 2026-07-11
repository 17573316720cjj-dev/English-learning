import type { ExamLevel, LearningItem, PhraseCategory, PhraseDifficulty, PhraseTag } from "../../domain";
import { getDefaultPhraseTags } from "../../lib/tags";

interface ExamItemSeed {
  id: string;
  phrase: string;
  meaningZh: string;
  example: string;
  exampleZh: string;
  category: PhraseCategory;
  difficulty: PhraseDifficulty;
  tags?: PhraseTag[];
}

export function createExamItems(examLevel: ExamLevel, items: ExamItemSeed[]): LearningItem[] {
  const prefix = examLevel.toLowerCase();

  return items.map((item) => ({
    ...item,
    id: `${prefix}-${item.id}`,
    tags: item.tags ?? getDefaultPhraseTags(item.category, item.difficulty),
    source: "built-in",
    examLevel
  }));
}
