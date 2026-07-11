import type React from "react";
import { useMemo, useState } from "react";
import type { ExamLevel, LearningItem } from "../domain";
import { examLevelLabels } from "../data/examItems";
import {
  buildFillBlankQuestion,
  buildPhraseMatchRound,
  checkFillBlankAnswer,
  checkPhraseMatchPair,
  shuffleLearningItems
} from "../lib/practice";
import { loadUserSeed, recordPracticeAttempt } from "../lib/storage";

const examFilters: Array<ExamLevel | "All"> = ["All", "CET4", "CET6", "TEM4", "TEM8"];

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
  const [userSeed] = useState(() => loadUserSeed());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [fillResult, setFillResult] = useState<"correct" | "incorrect" | null>(null);
  const [selectedPhraseId, setSelectedPhraseId] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<"matched" | "try-again" | null>(null);
  const visibleItems = useMemo(
    () => (activeExamLevel === "All" ? items : items.filter((item) => item.examLevel === activeExamLevel)),
    [activeExamLevel, items]
  );
  const shuffledItems = useMemo(
    () => shuffleLearningItems(visibleItems, userSeed, activeExamLevel),
    [activeExamLevel, userSeed, visibleItems]
  );
  const safeCurrentIndex = shuffledItems.length === 0 ? 0 : currentIndex % shuffledItems.length;
  const activeItem = shuffledItems[safeCurrentIndex] ?? null;
  const fillQuestion = useMemo(
    () => (activeItem ? buildFillBlankQuestion(activeItem, shuffledItems, `${userSeed}:${activeExamLevel}`) : null),
    [activeExamLevel, activeItem, shuffledItems, userSeed]
  );
  const matchRound = useMemo(
    () => buildPhraseMatchRound(shuffledItems, `${userSeed}:${activeExamLevel}:${safeCurrentIndex}`),
    [activeExamLevel, safeCurrentIndex, shuffledItems, userSeed]
  );

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
    setMatchResult(null);
  };

  const goToNextQuestion = (): void => {
    setCurrentIndex((index) => (shuffledItems.length === 0 ? 0 : (index + 1) % shuffledItems.length));
    setSelectedAnswer("");
    setFillResult(null);
    setSelectedPhraseId(null);
    setMatchResult(null);
  };

  const submitFillBlank = (): void => {
    if (!fillQuestion) return;
    const result = checkFillBlankAnswer(selectedAnswer, fillQuestion.answer);
    setFillResult(result.correct ? "correct" : "incorrect");
    recordPracticeAttempt({ itemId: fillQuestion.item.id, mode: "fill-blank", correct: result.correct });
    onProgressChange();
  };

  const chooseMeaning = (meaningItemId: string): void => {
    if (!selectedPhraseId) return;
    const correct = checkPhraseMatchPair(selectedPhraseId, meaningItemId);
    setMatchResult(correct ? "matched" : "try-again");
    recordPracticeAttempt({ itemId: selectedPhraseId, mode: "phrase-match", correct });
    onProgressChange();
    setSelectedPhraseId(null);
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
            <p className="muted">请选择其他考试级别，或添加短语后继续。</p>
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
                    className={selectedPhraseId === entry.itemId ? "answer-button selected" : "answer-button"}
                    onClick={() => setSelectedPhraseId(entry.itemId)}
                  >
                    {entry.text}
                  </button>
                ))}
              </div>
              <div className="match-column">
                {matchRound.meanings.map((entry) => (
                  <button key={entry.itemId} className="answer-button" onClick={() => chooseMeaning(entry.itemId)}>
                    {entry.text}
                  </button>
                ))}
              </div>
            </div>
            {matchResult ? (
              <>
                <div className={matchResult === "matched" ? "feedback correct" : "feedback incorrect"}>
                  {matchResult === "matched" ? "匹配成功" : "再试一次"}
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
