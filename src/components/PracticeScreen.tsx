import type React from "react";
import { useMemo, useState } from "react";
import type { ExamLevel, LearningItem, PhraseDifficulty, PhraseTag } from "../domain";
import { examLevelLabels } from "../data/examItems";
import {
  buildFillBlankQuestion,
  buildPhraseMatchRound,
  checkFillBlankAnswer,
  checkPhraseMatchPair,
  shuffleLearningItems
} from "../lib/practice";
import { loadUserSeed, recordPracticeAttempt } from "../lib/storage";
import { difficultyLabels } from "../lib/labels";
import { getItemTags, phraseTagLabels } from "../lib/tags";
import { FilterSummary } from "./FilterSummary";

const examFilters: Array<ExamLevel | "All"> = ["All", "CET4", "CET6", "TEM4", "TEM8"];
const tagFilters: Array<PhraseTag | "All"> = ["All", "HighFrequency", "Writing", "Reading", "Translation", "Speaking"];
const difficultyFilters: Array<PhraseDifficulty | "All"> = ["All", "Basic", "Intermediate", "Advanced"];
const tagFilterLabels: Record<PhraseTag | "All", string> = {
  All: "全部",
  ...phraseTagLabels
};
const difficultyFilterLabels: Record<PhraseDifficulty | "All", string> = {
  All: "全部",
  ...difficultyLabels
};

type MatchFeedback = {
  result: "matched" | "try-again";
  phraseItemId: string;
  chosenMeaningItemId: string;
  correctMeaningItemId: string;
};

function getExamFilterLabel(filter: ExamLevel | "All"): string {
  return filter === "All" ? "全部" : examLevelLabels[filter];
}

export function PracticeScreen({
  items,
  onProgressChange
}: {
  items: LearningItem[];
  onProgressChange(): void;
}): React.JSX.Element {
  const [mode, setMode] = useState<"fill-blank" | "phrase-match">("fill-blank");
  const [activeExamLevel, setActiveExamLevel] = useState<ExamLevel | "All">("All");
  const [activeTag, setActiveTag] = useState<PhraseTag | "All">("All");
  const [activeDifficulty, setActiveDifficulty] = useState<PhraseDifficulty | "All">("All");
  const [userSeed] = useState(() => loadUserSeed());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [fillResult, setFillResult] = useState<"correct" | "incorrect" | null>(null);
  const [selectedPhraseId, setSelectedPhraseId] = useState<string | null>(null);
  const [matchFeedback, setMatchFeedback] = useState<MatchFeedback | null>(null);
  const visibleItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesExamLevel = activeExamLevel === "All" || item.examLevel === activeExamLevel;
        const matchesTag = activeTag === "All" || getItemTags(item).includes(activeTag);
        const matchesDifficulty = activeDifficulty === "All" || item.difficulty === activeDifficulty;

        return matchesExamLevel && matchesTag && matchesDifficulty;
      }),
    [activeDifficulty, activeExamLevel, activeTag, items]
  );
  const filterScope =
    activeTag === "All" && activeDifficulty === "All"
      ? activeExamLevel
      : `${activeExamLevel}:${activeTag}:${activeDifficulty}`;
  const shuffledItems = useMemo(
    () => shuffleLearningItems(visibleItems, userSeed, filterScope),
    [filterScope, userSeed, visibleItems]
  );
  const safeCurrentIndex = shuffledItems.length === 0 ? 0 : currentIndex % shuffledItems.length;
  const activeItem = shuffledItems[safeCurrentIndex] ?? null;
  const fillQuestion = useMemo(
    () => (activeItem ? buildFillBlankQuestion(activeItem, shuffledItems, `${userSeed}:${filterScope}`) : null),
    [activeItem, filterScope, shuffledItems, userSeed]
  );
  const matchRound = useMemo(
    () => buildPhraseMatchRound(shuffledItems, `${userSeed}:${filterScope}:${safeCurrentIndex}`),
    [filterScope, safeCurrentIndex, shuffledItems, userSeed]
  );
  const activeFilterLabels = [
    activeExamLevel === "All" ? null : getExamFilterLabel(activeExamLevel),
    activeTag === "All" ? null : tagFilterLabels[activeTag],
    activeDifficulty === "All" ? null : difficultyFilterLabels[activeDifficulty]
  ].filter((label): label is string => Boolean(label));

  if (items.length === 0) {
    return (
      <section className="screen-grid">
        <div className="practice-card">
          <p className="eyebrow">练习</p>
          <h2>暂无练习内容</h2>
          <p className="muted">添加短语后即可开始练习。</p>
        </div>
      </section>
    );
  }

  const chooseExamLevel = (filter: ExamLevel | "All"): void => {
    setActiveExamLevel(filter);
    setCurrentIndex(0);
    setSelectedAnswer("");
    setFillResult(null);
    setSelectedPhraseId(null);
    setMatchFeedback(null);
  };

  const chooseTag = (filter: PhraseTag | "All"): void => {
    setActiveTag(filter);
    setCurrentIndex(0);
    setSelectedAnswer("");
    setFillResult(null);
    setSelectedPhraseId(null);
    setMatchFeedback(null);
  };

  const chooseDifficulty = (filter: PhraseDifficulty | "All"): void => {
    setActiveDifficulty(filter);
    setCurrentIndex(0);
    setSelectedAnswer("");
    setFillResult(null);
    setSelectedPhraseId(null);
    setMatchFeedback(null);
  };

  const resetFilters = (): void => {
    setActiveExamLevel("All");
    setActiveTag("All");
    setActiveDifficulty("All");
    setCurrentIndex(0);
    setSelectedAnswer("");
    setFillResult(null);
    setSelectedPhraseId(null);
    setMatchFeedback(null);
  };

  const goToNextQuestion = (): void => {
    setCurrentIndex((index) => (shuffledItems.length === 0 ? 0 : (index + 1) % shuffledItems.length));
    setSelectedAnswer("");
    setFillResult(null);
    setSelectedPhraseId(null);
    setMatchFeedback(null);
  };

  const submitFillBlank = (): void => {
    if (!fillQuestion) return;
    const result = checkFillBlankAnswer(selectedAnswer, fillQuestion.answer);
    setFillResult(result.correct ? "correct" : "incorrect");
    recordPracticeAttempt({ itemId: fillQuestion.item.id, mode: "fill-blank", correct: result.correct });
    onProgressChange();
  };

  const choosePhrase = (phraseItemId: string): void => {
    setSelectedPhraseId(phraseItemId);
    setMatchFeedback(null);
  };

  const chooseMeaning = (meaningItemId: string): void => {
    if (!selectedPhraseId) return;
    const correct = checkPhraseMatchPair(selectedPhraseId, meaningItemId);
    setMatchFeedback({
      result: correct ? "matched" : "try-again",
      phraseItemId: selectedPhraseId,
      chosenMeaningItemId: meaningItemId,
      correctMeaningItemId: selectedPhraseId
    });
    recordPracticeAttempt({ itemId: selectedPhraseId, mode: "phrase-match", correct });
    onProgressChange();
    if (correct) {
      setSelectedPhraseId(null);
    }
  };

  const getPhraseMatchClassName = (phraseItemId: string): string => {
    const classNames = ["answer-button"];
    const hasActiveFeedback = matchFeedback?.phraseItemId === phraseItemId;

    if (selectedPhraseId === phraseItemId || hasActiveFeedback) {
      classNames.push(matchFeedback?.result === "matched" && hasActiveFeedback ? "match-correct" : "match-selected");
    }

    return classNames.join(" ");
  };

  const getMeaningMatchClassName = (meaningItemId: string): string => {
    const classNames = ["answer-button"];

    if (!matchFeedback) {
      return classNames.join(" ");
    }

    if (meaningItemId === matchFeedback.correctMeaningItemId) {
      classNames.push("match-correct");
    } else if (meaningItemId === matchFeedback.chosenMeaningItemId) {
      classNames.push("match-wrong");
    }

    return classNames.join(" ");
  };

  return (
    <section className="screen-grid">
      <div className="practice-card">
        <div className="filter-section">
          <span className="filter-label">考试</span>
          <div className="filter-row" aria-label="考试筛选">
            {examFilters.map((filter) => (
              <button
                key={filter}
                className={activeExamLevel === filter ? "nav-button active" : "nav-button"}
                onClick={() => chooseExamLevel(filter)}
              >
                {getExamFilterLabel(filter)}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-section">
          <span className="filter-label">标签</span>
          <div className="filter-row" aria-label="练习标签筛选">
            {tagFilters.map((filter) => (
              <button
                key={filter}
                className={activeTag === filter ? "nav-button active" : "nav-button"}
                onClick={() => chooseTag(filter)}
              >
                {tagFilterLabels[filter]}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-section">
          <span className="filter-label">难度</span>
          <div className="filter-row" aria-label="练习难度筛选">
            {difficultyFilters.map((filter) => (
              <button
                key={filter}
                className={activeDifficulty === filter ? "nav-button active" : "nav-button"}
                onClick={() => chooseDifficulty(filter)}
              >
                {difficultyFilterLabels[filter]}
              </button>
            ))}
          </div>
        </div>

        <FilterSummary activeFilters={activeFilterLabels} itemCount={visibleItems.length} onReset={resetFilters} />

        <div className="segmented-control" aria-label="练习模式">
          <button className={mode === "fill-blank" ? "active" : ""} onClick={() => setMode("fill-blank")}>
            句子填空
          </button>
          <button className={mode === "phrase-match" ? "active" : ""} onClick={() => setMode("phrase-match")}>
            短语匹配
          </button>
        </div>

        {!fillQuestion ? (
          <div>
            <h2>暂无练习内容</h2>
            <p className="muted">
              {activeFilterLabels.length > 0
                ? "当前筛选下暂无内容，可重置筛选或选择其他标签。"
                : "请选择其他考试级别，或添加短语后继续。"}
            </p>
          </div>
        ) : mode === "fill-blank" ? (
          <div>
            <h2>完成句子</h2>
            <p className="sentence-prompt">{fillQuestion.prompt}</p>
            <div className="answer-grid">
              {fillQuestion.options.map((option) => (
                <button
                  key={option}
                  className={selectedAnswer === option ? "answer-button selected" : "answer-button"}
                  onClick={() => setSelectedAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <button className="primary-button" disabled={!selectedAnswer} onClick={submitFillBlank}>
              检查答案
            </button>
            {fillResult ? (
              <>
                <div className={fillResult === "correct" ? "feedback correct" : "feedback incorrect"}>
                  <strong>{fillResult === "correct" ? "正确" : "再试一次"}</strong>
                  <p>{fillQuestion.item.meaningZh}</p>
                  <p>{fillQuestion.item.example}</p>
                  <p>{fillQuestion.item.exampleZh}</p>
                </div>
                <button className="primary-button" onClick={goToNextQuestion}>
                  下一题
                </button>
              </>
            ) : null}
          </div>
        ) : (
          <div>
            <h2>短语匹配</h2>
            <p className="muted">先选择英文短语，再选择对应中文释义。</p>
            <div className="match-grid">
              <div className="match-column">
                {matchRound.phrases.map((entry) => (
                  <button
                    key={entry.itemId}
                    className={getPhraseMatchClassName(entry.itemId)}
                    onClick={() => choosePhrase(entry.itemId)}
                  >
                    {entry.text}
                    {matchFeedback?.phraseItemId === entry.itemId && matchFeedback.result === "matched" ? (
                      <span className="match-state-label">已匹配</span>
                    ) : null}
                  </button>
                ))}
              </div>
              <div className="match-column">
                {matchRound.meanings.map((entry) => (
                  <button
                    key={entry.itemId}
                    className={getMeaningMatchClassName(entry.itemId)}
                    onClick={() => chooseMeaning(entry.itemId)}
                  >
                    {entry.text}
                    {matchFeedback?.chosenMeaningItemId === entry.itemId && matchFeedback.result === "try-again" ? (
                      <span className="match-state-label">你的选择</span>
                    ) : null}
                    {matchFeedback?.correctMeaningItemId === entry.itemId ? (
                      <span className="match-state-label">正确释义</span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
            {matchFeedback ? (
              <>
                <div className={matchFeedback.result === "matched" ? "feedback correct" : "feedback incorrect"}>
                  {matchFeedback.result === "matched" ? "匹配成功" : "再试一次"}
                </div>
                <button className="primary-button" onClick={goToNextQuestion}>
                  下一题
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
