import type { ExamLevel, LearningItem } from "../../domain";
import { cet4Items } from "./cet4";
import { cet6Items } from "./cet6";
import { cet4ExpansionItems } from "./expansions/cet4";
import { cet6ExpansionItems } from "./expansions/cet6";
import { tem4ExpansionItems } from "./expansions/tem4";
import { tem8ExpansionItems } from "./expansions/tem8";
import { tem4Items } from "./tem4";
import { tem8Items } from "./tem8";

export const examLevelLabels: Record<ExamLevel, string> = {
  CET4: "CET-4",
  CET6: "CET-6",
  TEM4: "TEM-4",
  TEM8: "TEM-8"
};

export const examItems: LearningItem[] = [
  ...cet4Items,
  ...cet4ExpansionItems,
  ...cet6Items,
  ...cet6ExpansionItems,
  ...tem4Items,
  ...tem4ExpansionItems,
  ...tem8Items,
  ...tem8ExpansionItems
];
