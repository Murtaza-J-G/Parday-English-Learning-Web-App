import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AppState, VocabularyWord } from "./types";
import { categories, sampleWords } from "./data";

const initialSettings = { dailyGoal: 10, translationLanguage: "Dari", theme: "light" as const, showPhonetics: true, animations: true };
const freshWords = () => sampleWords.map(w => ({ ...w }));

export const useAppStore = create<AppState>()(persist((set, get) => ({
  words: freshWords(), categories, reviewRecords: [], sessions: [], quizResults: [], settings: initialSettings,
  addWord: (word) => {
    const now = new Date();
    const item: VocabularyWord = { ...word, id: crypto.randomUUID(), createdAt: now.toISOString(), box: 1, lastReviewedAt: null, nextReviewAt: now.toISOString(), correctCount: 0, incorrectCount: 0 };
    set(s => ({ words: [item, ...s.words] }));
  },
  updateWord: (id, changes) => set(s => ({ words: s.words.map(w => w.id === id ? { ...w, ...changes } : w) })),
  deleteWord: (id) => set(s => ({ words: s.words.filter(w => w.id !== id), reviewRecords: s.reviewRecords.filter(r => r.wordId !== id) })),
  reviewWord: (id, correct) => {
    const now = new Date();
    const word = get().words.find(w => w.id === id);
    if (!word) return;
    const nextBox = (correct ? Math.min(5, word.box + 1) : 1) as 1|2|3|4|5;
    const days = [1, 2, 4, 7, 14][nextBox - 1];
    const next = new Date(now);
    next.setDate(next.getDate() + days);
    const record = { id: crypto.randomUUID(), wordId: id, correct, reviewedAt: now.toISOString(), boxBefore: word.box, boxAfter: nextBox };
    set(s => ({
      words: s.words.map(w => w.id === id ? { ...w, box: nextBox, lastReviewedAt: now.toISOString(), nextReviewAt: next.toISOString(), correctCount: w.correctCount + (correct ? 1 : 0), incorrectCount: w.incorrectCount + (correct ? 0 : 1) } : w),
      reviewRecords: [record, ...s.reviewRecords],
      sessions: (() => {
        const day = now.toISOString().slice(0,10);
        const existing = s.sessions.find(x => x.date.slice(0,10) === day);
        if (existing) return s.sessions.map(x => x.id === existing.id ? { ...x, wordsReviewed: x.wordsReviewed + 1, correct: x.correct + (correct ? 1 : 0) } : x);
        return [{ id: crypto.randomUUID(), date: now.toISOString(), wordsReviewed: 1, correct: correct ? 1 : 0, durationSeconds: 0 }, ...s.sessions];
      })()
    }));
  },
  setSettings: (settings) => set(s => ({ settings: { ...s.settings, ...settings } })),
  addQuizResult: (result) => set(s => ({ quizResults: [{ ...result, id: crypto.randomUUID(), date: new Date().toISOString() }, ...s.quizResults] })),
  importWords: (words) => set(s => ({ words: [...words.map(w => ({ ...w, id: crypto.randomUUID(), isSample: false })), ...s.words] })),
  resetData: () => set({ words: freshWords(), categories, reviewRecords: [], sessions: [], quizResults: [], settings: initialSettings })
}), { name: "vocably-storage", storage: createJSONStorage(() => localStorage), version: 1 }));
