import { createExamItems } from "../../createExamItems";
import { tem8ExpansionCoreItems } from "./core";
import { tem8ExpansionSpeakingItems } from "./speaking";
import { tem8ExpansionTranslationItems } from "./translation";
import { tem8ExpansionWritingItems } from "./writing";

export const tem8ExpansionItems = createExamItems("TEM8", [
  ...tem8ExpansionCoreItems,
  ...tem8ExpansionWritingItems,
  ...tem8ExpansionTranslationItems,
  ...tem8ExpansionSpeakingItems
]);
