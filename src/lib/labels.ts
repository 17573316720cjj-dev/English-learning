import type { PhraseCategory, PhraseDifficulty } from "../domain";

export const categoryLabels: Record<PhraseCategory, string> = {
  Basic: "基础",
  CET: "四六级",
  Speaking: "口语",
  Writing: "写作",
  Daily: "日常"
};

export const difficultyLabels: Record<PhraseDifficulty, string> = {
  Basic: "基础",
  Intermediate: "进阶",
  Advanced: "高级"
};

export function formatAttemptCount(count: number): string {
  return `${count} 次`;
}
