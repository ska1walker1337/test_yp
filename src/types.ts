export type Screen = 'home' | 'subject' | 'quiz' | 'results' | 'history' | 'mistakes' | 'filter-select' | 'topic-select' | 'saves' | 'study-guide';
export type QuizMode = 'test' | 'control' | 'marathon' | 'mistakes';
export type QuestionFilter = 'all' | 'multiple-choice' | 'open-answer';

export interface Question {
  id: number;
  type: 'multiple-choice' | 'open-answer';
  question: string;
  options?: string[];
  correctAnswer?: number;
  modelAnswer?: string;
  explanation: string;
  keywords?: string[];
}

export interface Lecture {
  id: string;
  title: string;
  questions: Question[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  lectures: Lecture[];
}

export interface QuizState {
  currentQuestion: number;
  answers: (number | string | null)[];
  showExplanation: boolean;
  isFinished: boolean;
}

export interface TestResult {
  id: string;
  subjectName: string;
  lectureTitle: string;
  mode: QuizMode;
  score: number;
  total: number;
  percentage: number;
  date: string;
}

export interface MistakeItem {
  id: string;
  subjectId: string;
  subjectName: string;
  lectureId: string;
  lectureTitle: string;
  questionIndex: number;
  question: Question;
  date: string;
  attempts: number;
}

export interface Save {
  id: string;
  name: string;
  subjectId: string;
  subjectName: string;
  lectureId: string;
  lectureTitle: string;
  questions: Question[];
  currentQuestion: number;
  answers: (number | string | null)[];
  quizMode: QuizMode;
  timestamp: string;
}
