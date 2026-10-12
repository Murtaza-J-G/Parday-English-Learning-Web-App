export type Difficulty = "beginner" | "intermediate" | "advanced";
export interface VocabularyWord {
  id: string; word: string; definition: string; translation: string; partOfSpeech: string;
  example: string; phonetic: string; categoryId: string; difficulty: Difficulty;
  synonyms: string[]; antonyms: string[]; notes: string; favorite: boolean;
  box: 1 | 2 | 3 | 4 | 5; createdAt: string; lastReviewedAt: string | null; nextReviewAt: string;
  correctCount: number; incorrectCount: number; isSample?: boolean;
}
export interface Category { id: string; name: string; description: string; color: string; icon: string }
export interface ReviewRecord { id: string; wordId: string; correct: boolean; reviewedAt: string; boxBefore: number; boxAfter: number }
export interface LearningSession { id: string; date: string; wordsReviewed: number; correct: number; durationSeconds: number }
export interface QuizResult { id: string; date: string; mode: string; total: number; correct: number }
export interface UserSettings { dailyGoal: number; translationLanguage: string; theme: "light" | "dark"; showPhonetics: boolean; animations: boolean }
export interface AppState {
  words: VocabularyWord[]; categories: Category[]; reviewRecords: ReviewRecord[];
  sessions: LearningSession[]; quizResults: QuizResult[]; settings: UserSettings;
  addWord: (word: Omit<VocabularyWord, "id" | "createdAt" | "box" | "lastReviewedAt" | "nextReviewAt" | "correctCount" | "incorrectCount">) => void;
  updateWord: (id: string, changes: Partial<VocabularyWord>) => void;
  deleteWord: (id: string) => void; reviewWord: (id: string, correct: boolean) => void;
  setSettings: (settings: Partial<UserSettings>) => void; addQuizResult: (result: Omit<QuizResult, "id" | "date">) => void;
  importWords: (words: VocabularyWord[]) => void; resetData: () => void;
}