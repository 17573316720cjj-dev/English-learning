import { buildCollocationSeeds, buildFixedPhraseSeeds } from "../buildExpansionSeeds";

export const tem4ExpansionWritingItems = [
  ...buildCollocationSeeds([
    {
      action: { en: "craft", zh: "构思" },
      objects: [
        { en: "a focused introduction", zh: "聚焦的开头" },
        { en: "a clear topic sentence", zh: "清晰主题句" },
        { en: "a logical outline", zh: "有逻辑的提纲" },
        { en: "a balanced response", zh: "均衡回应" },
        { en: "a persuasive ending", zh: "有说服力的结尾" },
        { en: "a concise summary", zh: "简洁总结" },
        { en: "a precise definition", zh: "准确定义" },
        { en: "a coherent paragraph", zh: "连贯段落" }
      ],
      category: "Writing",
      difficulty: "Intermediate",
      tags: ["Writing", "Reading", "Translation"]
    },
    {
      action: { en: "develop", zh: "展开" },
      objects: [
        { en: "a comparison paragraph", zh: "比较段落" },
        { en: "a cause analysis", zh: "原因分析" },
        { en: "a problem statement", zh: "问题陈述" },
        { en: "a solution proposal", zh: "解决方案建议" },
        { en: "an example-based argument", zh: "基于例子的论证" },
        { en: "a personal reflection", zh: "个人反思" },
        { en: "a critical response", zh: "批判性回应" },
        { en: "a closing comment", zh: "结尾评论" }
      ],
      category: "Writing",
      difficulty: "Intermediate",
      tags: ["Writing", "Reading", "Translation"]
    },
    {
      action: { en: "integrate", zh: "整合" },
      objects: [
        { en: "textual evidence", zh: "文本证据" },
        { en: "background information", zh: "背景信息" },
        { en: "personal experience", zh: "个人经历" },
        { en: "counterarguments", zh: "反方观点" },
        { en: "supporting examples", zh: "支撑例子" },
        { en: "transition signals", zh: "过渡信号" },
        { en: "reading insights", zh: "阅读见解" },
        { en: "topic vocabulary", zh: "话题词汇" }
      ],
      category: "Writing",
      difficulty: "Intermediate",
      tags: ["Writing", "Reading", "Translation"]
    },
    {
      action: { en: "reinforce", zh: "强化" },
      objects: [
        { en: "the thesis statement", zh: "论点句" },
        { en: "the central claim", zh: "中心主张" },
        { en: "paragraph unity", zh: "段落统一性" },
        { en: "logical progression", zh: "逻辑推进" },
        { en: "reader understanding", zh: "读者理解" },
        { en: "argument clarity", zh: "论证清晰度" },
        { en: "evidence relevance", zh: "证据相关性" },
        { en: "essay focus", zh: "文章焦点" }
      ],
      category: "Writing",
      difficulty: "Intermediate",
      tags: ["Writing", "Reading", "Translation"]
    },
    {
      action: { en: "organize", zh: "组织" },
      objects: [
        { en: "paragraph order", zh: "段落顺序" },
        { en: "supporting points", zh: "支撑要点" },
        { en: "writing evidence", zh: "写作证据" },
        { en: "transition sentences", zh: "过渡句" },
        { en: "comparison details", zh: "比较细节" },
        { en: "argument layers", zh: "论证层次" },
        { en: "examples and explanations", zh: "例子和解释" },
        { en: "summary notes", zh: "摘要笔记" }
      ],
      category: "Writing",
      difficulty: "Intermediate",
      tags: ["Writing", "Reading", "Translation"]
    },
    {
      action: { en: "revise", zh: "修改" },
      objects: [
        { en: "unclear wording", zh: "不清楚的措辞" },
        { en: "weak examples", zh: "薄弱例子" },
        { en: "loose logic", zh: "松散逻辑" },
        { en: "repeated phrases", zh: "重复短语" },
        { en: "awkward sentences", zh: "别扭句子" },
        { en: "inaccurate translations", zh: "不准确翻译" },
        { en: "vague claims", zh: "模糊主张" },
        { en: "long paragraphs", zh: "过长段落" },
        { en: "final drafts", zh: "终稿" }
      ],
      category: "Writing",
      difficulty: "Intermediate",
      tags: ["Writing", "Reading", "Translation"]
    }
  ]),
  ...buildFixedPhraseSeeds([
    {
      phrase: "advance a nuanced argument",
      meaningZh: "提出有细微差别的论证",
      example: "A strong essay should advance a nuanced argument.",
      exampleZh: "一篇有力的作文应该提出有细微差别的论证。",
      category: "Writing",
      difficulty: "Advanced",
      tags: ["Writing", "Translation"]
    },
    {
      phrase: "challenge a simplified view",
      meaningZh: "质疑简单化观点",
      example: "The writer tries to challenge a simplified view of success.",
      exampleZh: "作者试图质疑对成功的简单化看法。",
      category: "Writing",
      difficulty: "Advanced",
      tags: ["Writing", "Translation"]
    },
    {
      phrase: "qualify the main claim",
      meaningZh: "限定主要主张",
      example: "Good writers often qualify the main claim with careful evidence.",
      exampleZh: "优秀写作者常用谨慎证据限定主要主张。",
      category: "Writing",
      difficulty: "Advanced",
      tags: ["Writing", "Translation"]
    },
    {
      phrase: "situate the issue in context",
      meaningZh: "把问题置于语境中",
      example: "The introduction should situate the issue in context.",
      exampleZh: "开头应把问题置于语境中。",
      category: "Writing",
      difficulty: "Advanced",
      tags: ["Writing", "Translation"]
    },
    {
      phrase: "weigh the evidence carefully",
      meaningZh: "仔细权衡证据",
      example: "Students need to weigh the evidence carefully before concluding.",
      exampleZh: "学生下结论前需要仔细权衡证据。",
      category: "Writing",
      difficulty: "Advanced",
      tags: ["Writing", "Translation"]
    },
    {
      phrase: "avoid overgeneralized statements",
      meaningZh: "避免过度概括的表述",
      example: "Academic writing should avoid overgeneralized statements.",
      exampleZh: "学术写作应避免过度概括的表述。",
      category: "Writing",
      difficulty: "Advanced",
      tags: ["Writing", "Translation"]
    },
    {
      phrase: "establish a clear stance",
      meaningZh: "确立清晰立场",
      example: "The first paragraph should establish a clear stance.",
      exampleZh: "第一段应确立清晰立场。",
      category: "Writing",
      difficulty: "Advanced",
      tags: ["Writing", "Translation"]
    },
    {
      phrase: "acknowledge an opposing view",
      meaningZh: "承认相反观点",
      example: "A balanced essay can acknowledge an opposing view.",
      exampleZh: "一篇均衡的作文可以承认相反观点。",
      category: "Writing",
      difficulty: "Advanced",
      tags: ["Writing", "Translation"]
    },
    {
      phrase: "maintain a formal tone",
      meaningZh: "保持正式语气",
      example: "Exam essays should maintain a formal tone.",
      exampleZh: "考试作文应保持正式语气。",
      category: "Writing",
      difficulty: "Advanced",
      tags: ["Writing", "Translation"]
    },
    {
      phrase: "create a logical progression",
      meaningZh: "形成逻辑推进",
      example: "Clear transitions create a logical progression.",
      exampleZh: "清晰过渡能形成逻辑推进。",
      category: "Writing",
      difficulty: "Advanced",
      tags: ["Writing", "Translation"]
    },
    {
      phrase: "strengthen the final conclusion",
      meaningZh: "强化最终结论",
      example: "A specific recommendation can strengthen the final conclusion.",
      exampleZh: "具体建议可以强化最终结论。",
      category: "Writing",
      difficulty: "Advanced",
      tags: ["Writing", "Translation"]
    }
  ])
];
