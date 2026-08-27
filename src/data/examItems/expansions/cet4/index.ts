import { createExamItems } from "../../createExamItems";
import { cet4ExpansionCoreItems } from "./core";
import { cet4ExpansionSpeakingItems } from "./speaking";
import { cet4ExpansionTranslationItems } from "./translation";
import { cet4ExpansionWritingItems } from "./writing";

export const cet4ExpansionItems = createExamItems("CET4", [
  ...cet4ExpansionCoreItems,
  ...cet4ExpansionWritingItems,
  ...cet4ExpansionTranslationItems,
  ...cet4ExpansionSpeakingItems
]);
