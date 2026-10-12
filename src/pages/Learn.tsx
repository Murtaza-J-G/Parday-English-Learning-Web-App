import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
  Volume2,
  X,
  Sparkles,
  Brain,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  PageHeader,
  ProgressBar,
  Card,
  EmptyState,
} from "../components";
import { useAppStore } from "../store";
import { isDue, speak } from "../utils";

export default function Learn({ mode }: { mode: "learn" | "review" }) {
  const words = useAppStore((s) => s.words);
  const reviewWord = useAppStore((s) => s.reviewWord);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);
  const deck = useMemo(
    () =>
      mode === "review"
        ? words.filter(isDue)
        : words.filter((w) => w.correctCount === 0).slice(0, 20),
    [words, mode],
  );
  const current = deck[index];
  useEffect(() => {
    setIndex(0);
    setRevealed(false);
    setDone(0);
  }, [mode]);
  const answer = (correct: boolean) => {
    if (current) {
      reviewWord(current.id, correct);
      setDone((x) => x + 1);
      setRevealed(false);
      setIndex((x) => x + 1);
    }
  };
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow={
          mode === "review" ? "SPACED REPETITION" : "BUILD YOUR VOCABULARY"
        }
        title={mode === "review" ? "Time to review" : "Learn something new"}
        description={
          mode === "review"
            ? "Strengthen your memory with the words due today."
            : "Meet a few new words, then test your recall."
        }
        action={
          <Link to="/progress" className="text-link">
            View progress <ArrowRight size={15} />
          </Link>
        }
      />
      {!current ? (
        <Card>
          <EmptyState
            icon={
              mode === "review" ? <Sparkles size={26} /> : <Check size={26} />
            }
            title={
              mode === "review"
                ? "You're all caught up!"
                : "You've practiced every word"
            }
            description={
              mode === "review"
                ? "No words are due for review right now. Come back later to keep your memory strong."
                : "Try reviewing words, exploring collections, or adding vocabulary of your own."
            }
          />
          <div className="center-actions">
            <Link to="/vocabulary" className="btn btn-primary">
              Explore vocabulary
            </Link>
            <Link to="/quiz" className="btn btn-secondary">
              Take a quiz
            </Link>
          </div>
        </Card>
      ) : (
        <div className="learning-layout">
          <div className="learning-meta">
            <span>
              <Brain size={15} />{" "}
              {mode === "review" ? "Review session" : "Learning session"}
            </span>
            <strong>
              {Math.min(index + 1, deck.length)} <small>of {deck.length}</small>
            </strong>
          </div>
          <ProgressBar value={(index / deck.length) * 100} />
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flashcard-large"
            >
              <div className="flashcard-top">
                <span className="card-tag">{current.partOfSpeech}</span>
                <button
                  className="icon-btn"
                  onClick={() => speak(current.word)}
                  aria-label={`Pronounce ${current.word}`}
                >
                  <Volume2 size={19} />
                </button>
              </div>
              <div className="flashcard-center">
                <div className="phonetic-big">{current.phonetic}</div>
                <h2>{current.word}</h2>
                {!revealed ? (
                  <>
                    <p>Think of the meaning, then reveal the answer.</p>
                    <Button
                      onClick={() => setRevealed(true)}
                      icon={<RotateCcw size={16} />}
                    >
                      Reveal answer
                    </Button>
                  </>
                ) : (
                  <div className="answer-reveal">
                    <div className="translation-big">{current.translation}</div>
                    <p>{current.definition}</p>
                    <div className="example-box">
                      <span>EXAMPLE</span>
                      <p>“{current.example}”</p>
                    </div>
                    <div className="box-status">
                      Leitner box {current.box} <span>·</span>{" "}
                      {current.difficulty}
                    </div>
                  </div>
                )}
              </div>
              <div className="flashcard-bottom">
                <span>
                  {current.categoryId.replace(/^\w/, (c) => c.toUpperCase())}
                </span>
                <span>Take your time — learning is a process.</span>
              </div>
            </motion.div>
          </AnimatePresence>
          {revealed ? (
            <div className="answer-buttons">
              <button
                className="answer-btn again"
                onClick={() => answer(false)}
              >
                <X size={18} />
                <span>
                  <strong>Need practice</strong>
                  <small>Review again soon</small>
                </span>
              </button>
              <button className="answer-btn known" onClick={() => answer(true)}>
                <Check size={18} />
                <span>
                  <strong>Got it!</strong>
                  <small>Move to next box</small>
                </span>
              </button>
            </div>
          ) : (
            <div className="session-hint">
              Tip: Try to recall the meaning before revealing the answer.
            </div>
          )}
          <div className="session-footer">
            <span>{done} answered this session</span>
            <button
              className="text-link"
              onClick={() => {
                setIndex(deck.length);
                setRevealed(false);
              }}
            >
              Finish session <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
