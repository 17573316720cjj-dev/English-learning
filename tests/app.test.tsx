import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "../src/App";
import { builtInItems } from "../src/data/builtInItems";
import type { ExamLevel, LearningItem } from "../src/domain";
import { buildFillBlankQuestion, buildPhraseMatchRound, shuffleLearningItems } from "../src/lib/practice";
import { USER_SEED_KEY } from "../src/lib/storage";

const appTestSeed = "app-test-seed";

function getShuffledItems(examLevel: ExamLevel | "All" = "All"): LearningItem[] {
  const sourceItems = examLevel === "All" ? builtInItems : builtInItems.filter((item) => item.examLevel === examLevel);
  return shuffleLearningItems(sourceItems, appTestSeed, examLevel);
}

function getPromptPattern(item: LearningItem): RegExp {
  return new RegExp(item.example.replace(item.phrase, "____").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
}

function getQuestionSeed(examLevel: ExamLevel | "All" = "All"): string {
  return `${appTestSeed}:${examLevel}`;
}

function getMatchSeed(examLevel: ExamLevel | "All" = "All", currentIndex = 0): string {
  return `${appTestSeed}:${examLevel}:${currentIndex}`;
}

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem(USER_SEED_KEY, appTestSeed);
});

describe("App", () => {
  it("opens into a home navigation screen", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "英语短语练习" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "学习首页" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "练习" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "词库" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "添加" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "进度" })).toBeInTheDocument();
    expect(screen.queryByText("English Phrase Practice")).not.toBeInTheDocument();
    expect(screen.queryByText("Study dashboard")).not.toBeInTheDocument();
  });

  it("navigates from home into sentence fill-in practice", async () => {
    const firstItem = getShuffledItems()[0];

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "练习" }));

    expect(screen.getByRole("heading", { name: "完成句子" })).toBeInTheDocument();
    expect(screen.getByText(getPromptPattern(firstItem))).toBeInTheDocument();
  });

  it("returns from a feature screen to the home navigation", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "词库" }));

    expect(screen.getByRole("heading", { name: "短语词库" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "首页" })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "返回首页" }));
    expect(screen.getByRole("heading", { name: "学习首页" })).toBeInTheDocument();
  });

  it("submits a sentence fill-in answer and records progress", async () => {
    const firstItem = getShuffledItems()[0];

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "练习" }));
    await userEvent.click(screen.getByRole("button", { name: firstItem.phrase }));
    await userEvent.click(screen.getByRole("button", { name: "检查答案" }));

    expect(await screen.findByText("正确")).toBeInTheDocument();
    expect(screen.getByText(firstItem.meaningZh)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "返回首页" }));
    await userEvent.click(screen.getByRole("button", { name: "进度" }));
    expect(screen.getByText("1 次")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("records incorrect fill-in answers", async () => {
    const shuffledItems = getShuffledItems();
    const question = buildFillBlankQuestion(shuffledItems[0], shuffledItems, getQuestionSeed());
    const wrongOption = question.options.find((option) => option !== question.answer);
    if (!wrongOption) throw new Error("Expected a distractor option");

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "练习" }));
    await userEvent.click(screen.getByRole("button", { name: wrongOption }));
    await userEvent.click(screen.getByRole("button", { name: "检查答案" }));

    expect(await screen.findByText("再试一次")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "返回首页" }));
    await userEvent.click(screen.getByRole("button", { name: "进度" }));
    expect(screen.getByText("1 次")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("supports phrase matching practice", async () => {
    const round = buildPhraseMatchRound(getShuffledItems(), getMatchSeed());
    const phrase = round.phrases[0];
    const matchingMeaning = round.meanings.find((entry) => entry.itemId === phrase.itemId);
    if (!matchingMeaning) throw new Error("Expected a matching meaning");

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "练习" }));
    await userEvent.click(screen.getByRole("button", { name: "短语匹配" }));
    await userEvent.click(screen.getByRole("button", { name: phrase.text }));
    await userEvent.click(screen.getByRole("button", { name: matchingMeaning.text }));

    expect(await screen.findByText("匹配成功")).toBeInTheDocument();
  });

  it("shows feedback for mismatched phrase pairs", async () => {
    const round = buildPhraseMatchRound(getShuffledItems(), getMatchSeed());
    const phrase = round.phrases[0];
    const mismatchedMeaning = round.meanings.find((entry) => entry.itemId !== phrase.itemId);
    if (!mismatchedMeaning) throw new Error("Expected a mismatched meaning");

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "练习" }));
    await userEvent.click(screen.getByRole("button", { name: "短语匹配" }));
    await userEvent.click(screen.getByRole("button", { name: phrase.text }));
    await userEvent.click(screen.getByRole("button", { name: mismatchedMeaning.text }));

    expect(await screen.findByText("再试一次")).toBeInTheDocument();
  });

  it("shows a filterable phrase library", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "词库" }));

    expect(screen.getByRole("heading", { name: "短语词库" })).toBeInTheDocument();
    expect(screen.getByText("work on")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "写作" }));
    expect(screen.getByText("as a result of")).toBeInTheDocument();
    expect(screen.queryByText("work on")).not.toBeInTheDocument();
  });

  it("filters practice by exam level", async () => {
    const firstCet4Item = getShuffledItems("CET4")[0];

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "练习" }));
    await userEvent.click(screen.getByRole("button", { name: "CET-4" }));

    expect(screen.getByText(getPromptPattern(firstCet4Item))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: firstCet4Item.phrase })).toBeInTheDocument();
  });

  it("filters the phrase library by exam level", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "词库" }));
    await userEvent.click(screen.getByRole("button", { name: "TEM-8" }));

    expect(screen.getByText("call into question")).toBeInTheDocument();
    expect(screen.queryByText("work on")).not.toBeInTheDocument();
  });

  it("combines exam and category filters in the phrase library", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "词库" }));
    await userEvent.click(screen.getByRole("button", { name: "TEM-8" }));
    await userEvent.click(screen.getByRole("button", { name: "四六级" }));

    expect(screen.getByText("come to terms with")).toBeInTheDocument();
    expect(screen.queryByText("call into question")).not.toBeInTheDocument();
    expect(screen.queryByText("take advantage of")).not.toBeInTheDocument();
  });

  it("adds, edits, and deletes custom learning items", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "添加" }));

    expect(screen.getByRole("heading", { name: "添加自定义短语" })).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("英文短语"), "make progress");
    await userEvent.type(screen.getByLabelText("中文释义"), "取得进步");
    await userEvent.type(screen.getByLabelText("英文例句"), "I make progress when I practice daily.");
    await userEvent.type(screen.getByLabelText("中文例句"), "每天练习时我会取得进步。");
    await userEvent.click(screen.getByRole("button", { name: "保存条目" }));

    expect(screen.getByText("make progress")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "编辑 make progress" }));
    await userEvent.clear(screen.getByLabelText("中文释义"));
    await userEvent.type(screen.getByLabelText("中文释义"), "进步");
    await userEvent.click(screen.getByRole("button", { name: "保存条目" }));
    expect(screen.getByText("进步")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "删除 make progress" }));
    expect(screen.queryByText("make progress")).not.toBeInTheDocument();
  });

  it("shows detailed local progress", async () => {
    const firstItem = getShuffledItems()[0];

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "练习" }));
    await userEvent.click(screen.getByRole("button", { name: firstItem.phrase }));
    await userEvent.click(screen.getByRole("button", { name: "检查答案" }));
    await userEvent.click(screen.getByRole("button", { name: "返回首页" }));
    await userEvent.click(screen.getByRole("button", { name: "进度" }));

    expect(screen.getByRole("heading", { name: "学习进度" })).toBeInTheDocument();
    expect(screen.getByText("1 次")).toBeInTheDocument();
    expect(screen.getByText("句子填空")).toBeInTheDocument();
    expect(screen.getByText("最近练习")).toBeInTheDocument();
    expect(screen.getByText(firstItem.phrase)).toBeInTheDocument();
  });
});
