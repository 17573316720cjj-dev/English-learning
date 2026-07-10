import { beforeEach, describe, expect, it } from "vitest";
import type { LearningItem } from "../src/domain";
import {
  CUSTOM_ITEMS_KEY,
  PROGRESS_KEY,
  USER_SEED_KEY,
  deleteCustomItem,
  loadCustomItems,
  loadProgress,
  loadUserSeed,
  recordPracticeAttempt,
  saveCustomItem
} from "../src/lib/storage";

const customItem: LearningItem = {
  id: "custom-1",
  phrase: "make progress",
  meaningZh: "取得进步",
  example: "I can make progress by practicing every day.",
  exampleZh: "我可以通过每天练习取得进步。",
  category: "Daily",
  difficulty: "Basic",
  source: "custom"
};

beforeEach(() => {
  localStorage.clear();
});

describe("storage", () => {
  it("saves, updates, and deletes custom items", () => {
    saveCustomItem(customItem);
    expect(loadCustomItems()).toEqual([customItem]);

    saveCustomItem({ ...customItem, meaningZh: "进步" });
    expect(loadCustomItems()[0]?.meaningZh).toBe("进步");

    deleteCustomItem("custom-1");
    expect(loadCustomItems()).toEqual([]);
  });

  it("falls back to empty custom items when stored JSON is invalid", () => {
    localStorage.setItem(CUSTOM_ITEMS_KEY, "{broken");
    expect(loadCustomItems()).toEqual([]);
  });

  it("records progress for correct and incorrect attempts", () => {
    recordPracticeAttempt({ itemId: "basic-work-on", mode: "fill-blank", correct: true });
    recordPracticeAttempt({ itemId: "basic-work-on", mode: "phrase-match", correct: false });

    const progress = loadProgress();
    expect(progress.totalAttempts).toBe(2);
    expect(progress.correctAttempts).toBe(1);
    expect(progress.fillBlankAttempts).toBe(1);
    expect(progress.phraseMatchAttempts).toBe(1);
    expect(progress.perItem["basic-work-on"]).toEqual({ correct: 1, incorrect: 1 });
    expect(progress.recentItemIds).toEqual(["basic-work-on"]);
  });

  it("falls back to empty progress when stored JSON is invalid", () => {
    localStorage.setItem(PROGRESS_KEY, "{broken");
    expect(loadProgress()).toMatchObject({
      totalAttempts: 0,
      correctAttempts: 0,
      fillBlankAttempts: 0,
      phraseMatchAttempts: 0,
      perItem: {},
      recentItemIds: []
    });
  });

  it("creates and reuses a local user seed for stable practice order", () => {
    const firstSeed = loadUserSeed();
    const storedSeed = localStorage.getItem(USER_SEED_KEY);

    expect(firstSeed).toBeTruthy();
    expect(storedSeed).toBe(firstSeed);
    expect(loadUserSeed()).toBe(firstSeed);

    localStorage.setItem(USER_SEED_KEY, "existing-student-seed");
    expect(loadUserSeed()).toBe("existing-student-seed");
  });
});
