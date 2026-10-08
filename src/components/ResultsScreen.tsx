import { Question } from '../types';
import { calculateScore, getGrade, getModeLabel, isAnswerCorrect } from '../utils';

interface ResultsScreenProps {
  questions: Question[];
  answers: (number | string | null)[];
  quizTitle: string;
  mode: string;
  onRetry: () => void;
  onGoToSubject: () => void;
  onGoHome: () => void;
  onContinueMistakes?: () => void;
  mistakesCount?: number;
}

export default function ResultsScreen({ 
  questions, 
  answers, 
  quizTitle, 
  mode,
  onRetry, 
  onGoToSubject, 
  onGoHome,
  onContinueMistakes,
  mistakesCount
}: ResultsScreenProps) {
  const score = calculateScore(questions, answers);
  const total = questions.length;
  const percentage = Math.round((score / total) * 100);
  const gradeInfo = getGrade(percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">{gradeInfo.emoji}</span>
          <h1 className="text-3xl font-bold text-white mb-2">Результаты</h1>
          <p className="text-slate-400">{getModeLabel(mode)}</p>
          <p className="text-slate-500 text-sm mt-1">{quizTitle}</p>
        </div>

        <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 mb-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-white mb-2">
              {score} <span className="text-slate-500">/ {total}</span>
            </div>
            <div className="text-2xl font-semibold mb-4" style={{ color: percentage >= 60 ? '#4ade80' : '#f87171' }}>
              {percentage}%
            </div>
            <div className={`text-xl font-medium ${gradeInfo.color}`}>Оценка: {gradeInfo.grade}</div>
          </div>

          <div className="flex justify-center mt-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#334155" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke={percentage >= 60 ? '#4ade80' : '#f87171'}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${percentage * 2.51} 251`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{percentage}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
            <p className="text-blue-400 text-2xl font-bold">{questions.filter(q => q.type === 'multiple-choice').length}</p>
            <p className="text-slate-400 text-xs mt-1">Тестовых</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
            <p className="text-purple-400 text-2xl font-bold">{questions.filter(q => q.type === 'open-answer').length}</p>
            <p className="text-slate-400 text-xs mt-1">Письменных</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
            <p className="text-green-400 text-2xl font-bold">{total}</p>
            <p className="text-slate-400 text-xs mt-1">Всего</p>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-8">
          <h3 className="text-white font-semibold mb-4">Детализация по вопросам:</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {questions.map((q, i) => {
              const correct = isAnswerCorrect(q, answers[i]);
              return (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className={correct ? 'text-green-400' : 'text-red-400'}>{correct ? '✓' : '✗'}</span>
                  <span className="text-slate-300 truncate flex-1">
                    {i + 1}. {q.question.substring(0, 70)}{q.question.length > 70 ? '...' : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {mode !== 'mistakes' && (
            <button
              onClick={onRetry}
              className="flex-1 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              🔄 Пройти ещё раз
            </button>
          )}
          {mode === 'mistakes' && mistakesCount && mistakesCount > 0 && onContinueMistakes && (
            <button
              onClick={onContinueMistakes}
              className="flex-1 py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              ❌ Продолжить работу над ошибками
            </button>
          )}
          <button
            onClick={mode === 'mistakes' ? onContinueMistakes : onGoToSubject}
            className="flex-1 py-4 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-colors"
          >
            {mode === 'mistakes' ? '← К ошибкам' : '← К предмету'}
          </button>
          <button
            onClick={onGoHome}
            className="flex-1 py-4 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-colors"
          >
            🏠 Главная
          </button>
        </div>
      </div>
    </div>
  );
}
