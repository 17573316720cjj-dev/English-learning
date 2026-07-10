import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PracticeScreen } from "../src/components/PracticeScreen";
import type { LearningItem } from "../src/domain";
import { shuffleLearningItems } from "../src/lib/practice";
import { USER_SEED_KEY } from "../src/lib/storage";

const customItem: LearningItem = {
  id: "custom-speak-up",
  phrase: "speak up",
  meaningZh: "大声说，明确表达",
  example: "I need to speak up during group discussions.",
  exampleZh: "我需要在小组讨论中明确表达。",
  category: "Speaking",
  difficulty: "Basic",
  source: "custom"
};

const reviewItem: LearningItem = {
  id: "custom-look-back",
  phrase: "look back on",
  meaningZh: "回顾",
  example: "I often look back on my weekly notes before a quiz.",
  exampleZh: "小测前我经常回顾每周笔记。",
  category: "Daily",
  difficulty: "Basic",
  source: "custom"
};

const writingItem: LearningItem = {
  id: "custom-point-out",
  phrase: "point out",
  meaningZh: "指出",
  example: "The teacher will point out common mistakes in our essays.",
  exampleZh: "老师会指出我们作文里的常见错误。",
  category: "Writing",
  difficulty: "Intermediate",
  source: "custom"
};

const practiceSeed = "practice-screen-seed";

function promptFor(item: LearningItem): string {
  return item.example.replace(item.phrase, "____");
}

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem(USER_SEED_KEY, practiceSeed);
});

describe("PracticeScreen", () => {
  it("shows an empty state when there are no practice items", () => {
    render(<PracticeScreen items={[]} onProgressChange={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "No practice items" })).toBeInTheDocument();
    expect(screen.getByText("Add a phrase to start practicing.")).toBeInTheDocument();
  });

  it("shows an empty state when an exam filter has no matching items", async () => {
    render(<PracticeScreen items={[customItem]} onProgressChange={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "Complete the sentence" })).toBeInTheDocument();
    expect(screen.getByText(/I need to ____ during group discussions/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "CET-4" }));

    expect(screen.getByRole("heading", { name: "No practice items" })).toBeInTheDocument();
    expect(screen.getByText("Choose another exam level or add a phrase to continue.")).toBeInTheDocument();
    expect(screen.queryByText(/I need to ____ during group discussions/)).not.toBeInTheDocument();
  });

  it("uses the local seed order and advances to the next shuffled question", async () => {
    const items = [customItem, reviewItem, writingItem];
    const shuffledItems = shuffleLearningItems(items, practiceSeed, "All");

    render(<PracticeScreen items={items} onProgressChange={vi.fn()} />);

    expect(screen.getByText(promptFor(shuffledItems[0]))).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: shuffledItems[0].phrase }));
    await userEvent.click(screen.getByRole("button", { name: "Check answer" }));
    await userEvent.click(screen.getByRole("button", { name: "Next question" }));

    expect(screen.getByText(promptFor(shuffledItems[1]))).toBeInTheDocument();
    expect(screen.queryByText(promptFor(shuffledItems[0]))).not.toBeInTheDocument();
  });
});
