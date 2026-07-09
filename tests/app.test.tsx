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
});
