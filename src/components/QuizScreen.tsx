import { Question } from '../types';
import { useState } from 'react';

interface QuizScreenProps {
  questions: Question[];
  quizTitle: string;
  isMistakesMode: boolean;
  onAnswer: (answer: number | string) => void;
  onNext: () => void;
  onExit: () => void;
  onSave?: () => void;
  currentState: {
    currentQuestion: number;
    answers: (number | string | null)[];
    showExplanation: boolean;
  };
}

export default function QuizScreen({ 
  questions, 
  quizTitle, 
  isMistakesMode,
  onAnswer, 
  onNext, 
  onExit,
  onSave,
  currentState
}: QuizScreenProps) {
  const [openAnswer, setOpenAnswer] = useState('');
  const question = questions[currentState.currentQuestion];
  const progress = ((currentState.currentQuestion + 1) / questions.length) * 100;

  const handleOpenAnswerSubmit = () => {
    if (openAnswer.trim().length > 0) {
      onAnswer(openAnswer.trim());
      setOpenAnswer('');
    }
  };

  if (questions.length === 0) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (confirm('Выйти из теста? Прогресс будет потерян.')) {
                  onExit();
                }
              }}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕ Выйти
            </button>
            {onSave && (
              <button
                onClick={onSave}
                className="text-blue-400 hover:text-blue-300 transition-colors"
                title="Сохранить прогресс"
              >
                💾 Сохранить
              </button>
            )}
          </div>
          <span className="text-slate-400 text-sm">{currentState.currentQuestion + 1} / {questions.length}</span>
        </div>

        <div className="mb-2">
          <p className="text-slate-500 text-xs truncate">
            {isMistakesMode ? '❌ Работа над ошибками' : quizTitle}
          </p>
        </div>

        <div className="w-full h-2 bg-slate-700 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div key={currentState.currentQuestion} className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-700 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              question.type === 'multiple-choice' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
            }`}>
              {question.type === 'multiple-choice' ? '📝 Тестовый вопрос' : '✍️ Открытый ответ'}
            </span>
          </div>
          <h2 className="text-white text-lg md:text-xl font-medium leading-relaxed">{question.question}</h2>
        </div>

        {!currentState.showExplanation ? (
          <div key={`answer-${currentState.currentQuestion}`} className="space-y-3">
            {question.type === 'multiple-choice' ? (
              question.options?.map((option: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => onAnswer(idx)}
                  className="w-full text-left p-4 rounded-xl bg-slate-800/50 border border-slate-600 hover:border-blue-500 hover:bg-slate-700/50 text-white transition-all"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-slate-300 mr-3 text-sm font-medium">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </button>
              ))
            ) : (
              <div>
                <textarea
                  placeholder="Напишите ваш ответ здесь..."
                  value={openAnswer}
                  onChange={(e) => setOpenAnswer(e.target.value)}
                  className="w-full h-40 p-4 rounded-xl bg-slate-800/50 border border-slate-600 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none transition-all"
                />
                <button
                  onClick={handleOpenAnswerSubmit}
                  className="mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Ответить
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {question.type === 'multiple-choice' ? (
              <div className="space-y-3">
                {question.options?.map((option: string, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      idx === question.correctAnswer ? 'bg-green-500/10 border-green-500 text-green-200'
                        : idx === currentState.answers[currentState.currentQuestion] ? 'bg-red-500/10 border-red-500 text-red-200'
                        : 'bg-slate-800/30 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 text-sm font-medium bg-slate-700/50">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                    {idx === question.correctAnswer && <span className="ml-2">✓</span>}
                    {idx === currentState.answers[currentState.currentQuestion] && idx !== question.correctAnswer && <span className="ml-2">✗</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h4 className="text-purple-300 font-medium mb-2">📖 Модельный ответ:</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{question.modelAnswer}</p>
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <h4 className="text-blue-300 font-medium mb-1">Ваш ответ:</h4>
                  <p className="text-slate-400 text-sm">{currentState.answers[currentState.currentQuestion] as string}</p>
                </div>
              </div>
            )}

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <h4 className="text-amber-300 font-medium mb-2">💡 Объяснение:</h4>
              <p className="text-amber-100/80 text-sm leading-relaxed">{question.explanation}</p>
            </div>

            <button
              onClick={onNext}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              {currentState.currentQuestion < questions.length - 1 ? 'Следующий вопрос →' : 'Завершить тест'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
