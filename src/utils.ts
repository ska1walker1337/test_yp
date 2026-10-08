import { Question } from './types';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function shuffleAllQuestionOptions(questions: Question[]): Question[] {
  return questions.map(question => {
    if (question.type === 'multiple-choice' && question.options && question.correctAnswer !== undefined) {
      const options = [...question.options];
      const correctAnswerText = options[question.correctAnswer];
      
      const shuffledOptions = shuffleArray(options);
      const newCorrectAnswer = shuffledOptions.indexOf(correctAnswerText);
      
      return {
        ...question,
        options: shuffledOptions,
        correctAnswer: newCorrectAnswer
      };
    }
    return question;
  });
}

export function isAnswerCorrect(question: Question, userAnswer: number | string | null): boolean {
  if (userAnswer === null) return false;
  
  if (question.type === 'multiple-choice') {
    return userAnswer === question.correctAnswer;
  } else {
    const answer = String(userAnswer).toLowerCase().trim();
    const keywords = question.keywords || [];
    
    if (keywords.length === 0) return false;
    
    const matchedKeywords = keywords.filter(keyword => 
      answer.includes(keyword.toLowerCase())
    );
    
    return matchedKeywords.length >= Math.ceil(keywords.length * 0.6);
  }
}

export function calculateScore(questions: Question[], answers: (number | string | null)[]): number {
  let correct = 0;
  questions.forEach((question, index) => {
    if (isAnswerCorrect(question, answers[index])) {
      correct++;
    }
  });
  return correct;
}

export function getGrade(percentage: number): { grade: string; emoji: string; color: string } {
  if (percentage >= 90) return { grade: '5 (Отлично)', emoji: '🎉', color: 'text-green-400' };
  if (percentage >= 75) return { grade: '4 (Хорошо)', emoji: '👍', color: 'text-blue-400' };
  if (percentage >= 60) return { grade: '3 (Удовлетворительно)', emoji: '📝', color: 'text-yellow-400' };
  if (percentage >= 40) return { grade: '2 (Неудовлетворительно)', emoji: '📚', color: 'text-orange-400' };
  return { grade: '1 (Очень плохо)', emoji: '❌', color: 'text-red-400' };
}

export function getModeLabel(mode: string): string {
  switch (mode) {
    case 'test': return '📋 Обычный тест';
    case 'control': return '📝 Контрольная работа';
    case 'marathon': return '🏃 Марафон';
    case 'mistakes': return '❌ Работа над ошибками';
    default: return 'Тест';
  }
}
