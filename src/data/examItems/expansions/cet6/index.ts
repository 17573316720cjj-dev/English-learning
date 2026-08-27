import { createExamItems } from "../../createExamItems";
import { cet6ExpansionCoreItems } from "./core";
import { cet6ExpansionSpeakingItems } from "./speaking";
import { cet6ExpansionTranslationItems } from "./translation";
import { cet6ExpansionWritingItems } from "./writing";

export const cet6ExpansionItems = createExamItems("CET6", [
  ...cet6ExpansionCoreItems,
  ...cet6ExpansionWritingItems,
  ...cet6ExpansionTranslationItems,
  ...cet6ExpansionSpeakingItems
]);
