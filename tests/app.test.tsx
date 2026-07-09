import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "../src/App";

beforeEach(() => {
  localStorage.clear();
});

describe("App", () => {
  it("opens directly into sentence fill-in practice", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Complete the sentence" })).toBeInTheDocument();
    expect(screen.getByText(/I want to ____ my speaking skills/)).toBeInTheDocument();
  });

  it("submits a sentence fill-in answer and records progress", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "work on" }));
    await userEvent.click(screen.getByRole("button", { name: "Check answer" }));

    expect(await screen.findByText("Correct")).toBeInTheDocument();
    expect(screen.getByText("努力改善，致力于")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Progress" }));
    expect(screen.getByText("1 attempt")).toBeInTheDocument();
    expect(screen.getByText("100% accuracy")).toBeInTheDocument();
  });

  it("supports phrase matching practice", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Phrase match" }));
    await userEvent.click(screen.getByRole("button", { name: "work on" }));
    await userEvent.click(screen.getByRole("button", { name: "努力改善，致力于" }));

    expect(await screen.findByText("Matched")).toBeInTheDocument();
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
});
