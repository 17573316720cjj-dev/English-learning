import type { ExamLevel, LearningItem } from "../../domain";
import { cet4Items } from "./cet4";
import { cet6Items } from "./cet6";
import { tem4Items } from "./tem4";
import { tem8Items } from "./tem8";

export const examLevelLabels: Record<ExamLevel, string> = {
  CET4: "CET-4",
  CET6: "CET-6",
  TEM4: "TEM-4",
  TEM8: "TEM-8"
};

export const examItems: LearningItem[] = [...cet4Items, ...cet6Items, ...tem4Items, ...tem8Items];
