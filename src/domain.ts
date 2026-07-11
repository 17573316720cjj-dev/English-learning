export type PhraseCategory = "Basic" | "CET" | "Speaking" | "Writing" | "Daily";
export type PhraseDifficulty = "Basic" | "Intermediate" | "Advanced";
export type PhraseTag = "HighFrequency" | "Writing" | "Reading" | "Translation" | "Speaking";
export type LearningItemSource = "built-in" | "custom";
export type ExamLevel = "CET4" | "CET6" | "TEM4" | "TEM8";

export interface LearningItem {
  id: string;
  phrase: string;
  meaningZh: string;
  example: string;
  exampleZh: string;
  category: PhraseCategory;
  difficulty: PhraseDifficulty;
  tags?: PhraseTag[];
  source: LearningItemSource;
  examLevel?: ExamLevel;
}

export interface FillBlankQuestion {
  item: LearningItem;
  prompt: string;
  options: string[];
  answer: string;
}

export interface MatchEntry {
  itemId: string;
  text: string;
}

export interface PhraseMatchRound {
  phrases: MatchEntry[];
  meanings: MatchEntry[];
}

export interface ProgressState {
  totalAttempts: number;
  correctAttempts: number;
  fillBlankAttempts: number;
  phraseMatchAttempts: number;
  perItem: Record<string, { correct: number; incorrect: number }>;
  recentItemIds: string[];
}
