import type { LearningItem } from "../domain";
import { examItems } from "./examItems";

const generalItems: LearningItem[] = [
  {
    id: "basic-work-on",
    phrase: "work on",
    meaningZh: "努力改善，致力于",
    example: "I want to work on my speaking skills before the interview.",
    exampleZh: "我想在面试前提升口语能力。",
    category: "Basic",
    difficulty: "Basic",
    source: "built-in"
  },
  {
    id: "basic-get-used-to",
    phrase: "get used to",
    meaningZh: "习惯于",
    example: "It takes time to get used to reading English every day.",
    exampleZh: "每天阅读英语需要时间来适应。",
    category: "Basic",
    difficulty: "Basic",
    source: "built-in"
  },
  {
    id: "cet-take-advantage",
    phrase: "take advantage of",
    meaningZh: "利用",
    example: "Students should take advantage of library resources.",
    exampleZh: "学生应该利用图书馆资源。",
    category: "CET",
    difficulty: "Intermediate",
    source: "built-in"
  },
  {
    id: "cet-be-likely-to",
    phrase: "be likely to",
    meaningZh: "很可能",
    example: "Students who review regularly are likely to remember more phrases.",
    exampleZh: "经常复习的学生更可能记住更多短语。",
    category: "CET",
    difficulty: "Intermediate",
    source: "built-in"
  },
  {
    id: "speaking-come-up-with",
    phrase: "come up with",
    meaningZh: "想出，提出",
    example: "She came up with a simple way to practice speaking.",
    exampleZh: "她想出了一个练习口语的简单方法。",
    category: "Speaking",
    difficulty: "Basic",
    source: "built-in"
  },
  {
    id: "speaking-look-forward-to",
    phrase: "look forward to",
    meaningZh: "期待",
    example: "I look forward to discussing this topic in class.",
    exampleZh: "我期待在课堂上讨论这个话题。",
    category: "Speaking",
    difficulty: "Basic",
    source: "built-in"
  },
  {
    id: "writing-as-a-result",
    phrase: "as a result of",
    meaningZh: "由于，因为",
    example: "As a result of regular practice, her writing became clearer.",
    exampleZh: "由于经常练习，她的写作变得更清晰。",
    category: "Writing",
    difficulty: "Intermediate",
    source: "built-in"
  },
  {
    id: "writing-in-terms-of",
    phrase: "in terms of",
    meaningZh: "就……而言",
    example: "In terms of accuracy, this sentence is much better.",
    exampleZh: "就准确性而言，这个句子好多了。",
    category: "Writing",
    difficulty: "Intermediate",
    source: "built-in"
  },
  {
    id: "daily-run-out-of",
    phrase: "run out of",
    meaningZh: "用完，耗尽",
    example: "I ran out of time before I finished the exercise.",
    exampleZh: "我还没完成练习就没时间了。",
    category: "Daily",
    difficulty: "Basic",
    source: "built-in"
  },
  {
    id: "daily-keep-track-of",
    phrase: "keep track of",
    meaningZh: "记录，掌握动态",
    example: "This website helps you keep track of your phrase practice.",
    exampleZh: "这个网站帮助你记录短语练习情况。",
    category: "Daily",
    difficulty: "Basic",
    source: "built-in"
  }
];

export const builtInItems: LearningItem[] = [...generalItems, ...examItems];
