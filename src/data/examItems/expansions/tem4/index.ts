import { createExamItems } from "../../createExamItems";
import { tem4ExpansionCoreItems } from "./core";
import { tem4ExpansionSpeakingItems } from "./speaking";
import { tem4ExpansionTranslationItems } from "./translation";
import { tem4ExpansionWritingItems } from "./writing";

export const tem4ExpansionItems = createExamItems("TEM4", [
  ...tem4ExpansionCoreItems,
  ...tem4ExpansionWritingItems,
  ...tem4ExpansionTranslationItems,
  ...tem4ExpansionSpeakingItems
]);
