import type { VocabularyWord } from "./types";

export function isDue(card: VocabularyCard, now: Date = new Date()): boolean {
  const currentTime = new Date(now).getTime();
  const reviewTime = new Date(card.nextReview).getTime();

  if (Number.isNaN(currentTime) || Number.isNaN(reviewTime)) {
    return false;
  }

  return reviewTime <= currentTime;
}

export const accuracy = (words: VocabularyWord[]) => {
  const correct = words.reduce((n, w) => n + w.correctCount, 0);
  const total = correct + words.reduce((n, w) => n + w.incorrectCount, 0);
  return total ? Math.round((correct / total) * 100) : 0;
};
export const dayLabel = (date: Date) =>
  date.toLocaleDateString(undefined, { weekday: "short" });
export function downloadFile(name: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
export function speak(text: string) {
  if (!("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.88;
  window.speechSynthesis.speak(utterance);
  return true;
}
