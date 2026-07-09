import type React from "react";
import { useMemo, useState } from "react";
import type { LearningItem } from "../domain";
import {
  buildFillBlankQuestion,
  buildPhraseMatchRound,
  checkFillBlankAnswer,
  checkPhraseMatchPair
} from "../lib/practice";
import { recordPracticeAttempt } from "../lib/storage";

export function PracticeScreen({
  items,
  onProgressChange
}: {
  items: LearningItem[];
  onProgressChange(): void;
}): React.JSX.Element {
  const [mode, setMode] = useState<"fill-blank" | "phrase-match">("fill-blank");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [fillResult, setFillResult] = useState<"correct" | "incorrect" | null>(null);
  const [selectedPhraseId, setSelectedPhraseId] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<"matched" | "try-again" | null>(null);

  if (items.length === 0) {
    return (
      <section className="screen-grid">
        <div className="practice-card">
          <p className="eyebrow">Practice</p>
          <h2>No practice items</h2>
          <p className="muted">Add a phrase to start practicing.</p>
        </div>
      </section>
    );
  }

  const activeItem = items[0];
  const fillQuestion = useMemo(() => buildFillBlankQuestion(activeItem, items), [activeItem, items]);
  const matchRound = useMemo(() => buildPhraseMatchRound(items), [items]);

  const submitFillBlank = (): void => {
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
        <div className="segmented-control" aria-label="Practice mode">
          <button className={mode === "fill-blank" ? "active" : ""} onClick={() => setMode("fill-blank")}>
            Sentence fill-in
          </button>
          <button className={mode === "phrase-match" ? "active" : ""} onClick={() => setMode("phrase-match")}>
            Phrase match
          </button>
        </div>

        {mode === "fill-blank" ? (
          <div>
            <h2>Complete the sentence</h2>
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
              Check answer
            </button>
            {fillResult ? (
              <div className={fillResult === "correct" ? "feedback correct" : "feedback incorrect"}>
                <strong>{fillResult === "correct" ? "Correct" : "Try again"}</strong>
                <p>{fillQuestion.item.meaningZh}</p>
                <p>{fillQuestion.item.example}</p>
                <p>{fillQuestion.item.exampleZh}</p>
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <h2>Phrase match</h2>
            <p className="muted">Select a phrase, then choose its Chinese meaning.</p>
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
              <div className={matchResult === "matched" ? "feedback correct" : "feedback incorrect"}>
                {matchResult === "matched" ? "Matched" : "Try again"}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
