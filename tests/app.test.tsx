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

    expect(screen.getByRole("heading", { name: "Study dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Practice" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Library" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Progress" })).toBeInTheDocument();
  });

  it("navigates from home into sentence fill-in practice", async () => {
    const firstItem = getShuffledItems()[0];

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Practice" }));

    expect(screen.getByRole("heading", { name: "Complete the sentence" })).toBeInTheDocument();
    expect(screen.getByText(getPromptPattern(firstItem))).toBeInTheDocument();
  });

  it("returns from a feature screen to the home navigation", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Library" }));

    expect(screen.getByRole("heading", { name: "Phrase library" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Home" }));
    expect(screen.getByRole("heading", { name: "Study dashboard" })).toBeInTheDocument();
  });

  it("submits a sentence fill-in answer and records progress", async () => {
    const firstItem = getShuffledItems()[0];

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Practice" }));
    await userEvent.click(screen.getByRole("button", { name: firstItem.phrase }));
    await userEvent.click(screen.getByRole("button", { name: "Check answer" }));

    expect(await screen.findByText("Correct")).toBeInTheDocument();
    expect(screen.getByText(firstItem.meaningZh)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Home" }));
    await userEvent.click(screen.getByRole("button", { name: "Progress" }));
    expect(screen.getByText("1 attempt")).toBeInTheDocument();
    expect(screen.getByText("100% accuracy")).toBeInTheDocument();
  });

  it("records incorrect fill-in answers", async () => {
    const shuffledItems = getShuffledItems();
    const question = buildFillBlankQuestion(shuffledItems[0], shuffledItems, getQuestionSeed());
    const wrongOption = question.options.find((option) => option !== question.answer);
    if (!wrongOption) throw new Error("Expected a distractor option");

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Practice" }));
    await userEvent.click(screen.getByRole("button", { name: wrongOption }));
    await userEvent.click(screen.getByRole("button", { name: "Check answer" }));

    expect(await screen.findByText("Try again")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Home" }));
    await userEvent.click(screen.getByRole("button", { name: "Progress" }));
    expect(screen.getByText("1 attempt")).toBeInTheDocument();
    expect(screen.getByText("0% accuracy")).toBeInTheDocument();
  });

  it("supports phrase matching practice", async () => {
    const round = buildPhraseMatchRound(getShuffledItems(), getMatchSeed());
    const phrase = round.phrases[0];
    const matchingMeaning = round.meanings.find((entry) => entry.itemId === phrase.itemId);
    if (!matchingMeaning) throw new Error("Expected a matching meaning");

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Practice" }));
    await userEvent.click(screen.getByRole("button", { name: "Phrase match" }));
    await userEvent.click(screen.getByRole("button", { name: phrase.text }));
    await userEvent.click(screen.getByRole("button", { name: matchingMeaning.text }));

    expect(await screen.findByText("Matched")).toBeInTheDocument();
  });

  it("shows feedback for mismatched phrase pairs", async () => {
    const round = buildPhraseMatchRound(getShuffledItems(), getMatchSeed());
    const phrase = round.phrases[0];
    const mismatchedMeaning = round.meanings.find((entry) => entry.itemId !== phrase.itemId);
    if (!mismatchedMeaning) throw new Error("Expected a mismatched meaning");

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Practice" }));
    await userEvent.click(screen.getByRole("button", { name: "Phrase match" }));
    await userEvent.click(screen.getByRole("button", { name: phrase.text }));
    await userEvent.click(screen.getByRole("button", { name: mismatchedMeaning.text }));

    expect(await screen.findByText("Try again")).toBeInTheDocument();
  });

  it("shows a filterable phrase library", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Library" }));

    expect(screen.getByRole("heading", { name: "Phrase library" })).toBeInTheDocument();
    expect(screen.getByText("work on")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Writing" }));
    expect(screen.getByText("as a result of")).toBeInTheDocument();
    expect(screen.queryByText("work on")).not.toBeInTheDocument();
  });

  it("filters practice by exam level", async () => {
    const firstCet4Item = getShuffledItems("CET4")[0];

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Practice" }));
    await userEvent.click(screen.getByRole("button", { name: "CET-4" }));

    expect(screen.getByText(getPromptPattern(firstCet4Item))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: firstCet4Item.phrase })).toBeInTheDocument();
  });

  it("filters the phrase library by exam level", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Library" }));
    await userEvent.click(screen.getByRole("button", { name: "TEM-8" }));

    expect(screen.getByText("call into question")).toBeInTheDocument();
    expect(screen.queryByText("work on")).not.toBeInTheDocument();
  });

  it("combines exam and category filters in the phrase library", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Library" }));
    await userEvent.click(screen.getByRole("button", { name: "TEM-8" }));
    await userEvent.click(screen.getByRole("button", { name: "CET" }));

    expect(screen.getByText("come to terms with")).toBeInTheDocument();
    expect(screen.queryByText("call into question")).not.toBeInTheDocument();
    expect(screen.queryByText("take advantage of")).not.toBeInTheDocument();
  });

  it("adds, edits, and deletes custom learning items", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Add" }));

    await userEvent.type(screen.getByLabelText("Phrase"), "make progress");
    await userEvent.type(screen.getByLabelText("Chinese meaning"), "取得进步");
    await userEvent.type(screen.getByLabelText("Example sentence"), "I make progress when I practice daily.");
    await userEvent.type(screen.getByLabelText("Chinese example"), "每天练习时我会取得进步。");
    await userEvent.click(screen.getByRole("button", { name: "Save item" }));

    expect(screen.getByText("make progress")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Edit make progress" }));
    await userEvent.clear(screen.getByLabelText("Chinese meaning"));
    await userEvent.type(screen.getByLabelText("Chinese meaning"), "进步");
    await userEvent.click(screen.getByRole("button", { name: "Save item" }));
    expect(screen.getByText("进步")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Delete make progress" }));
    expect(screen.queryByText("make progress")).not.toBeInTheDocument();
  });

  it("shows detailed local progress", async () => {
    const firstItem = getShuffledItems()[0];

    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Practice" }));
    await userEvent.click(screen.getByRole("button", { name: firstItem.phrase }));
    await userEvent.click(screen.getByRole("button", { name: "Check answer" }));
    await userEvent.click(screen.getByRole("button", { name: "Home" }));
    await userEvent.click(screen.getByRole("button", { name: "Progress" }));

    expect(screen.getByRole("heading", { name: "Learning progress" })).toBeInTheDocument();
    expect(screen.getByText("1 attempt")).toBeInTheDocument();
    expect(screen.getByText("Fill-in attempts")).toBeInTheDocument();
    expect(screen.getByText("Recently practiced")).toBeInTheDocument();
    expect(screen.getByText(firstItem.phrase)).toBeInTheDocument();
  });
});
