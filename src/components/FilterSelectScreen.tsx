import { Subject, QuestionFilter } from '../types';

interface FilterSelectScreenProps {
  subject: Subject;
  selectedTopics: string[];
  questionFilter: QuestionFilter;
  onSetFilter: (filter: QuestionFilter) => void;
  onGoBack: () => void;
  onStart: () => void;
}

export default function FilterSelectScreen({ 
  subject, 
  selectedTopics, 
  questionFilter, 
  onSetFilter, 
  onGoBack, 
  onStart 
}: FilterSelectScreenProps) {
  const selectedLectures = subject.lectures.filter(l => selectedTopics.includes(l.id));
  const allQuestions = selectedLectures.flatMap(l => l.questions);
  const testCount = allQuestions.filter(q => q.type === 'multiple-choice').length;
  const openCount = allQuestions.filter(q => q.type === 'open-answer').length;

  const getFilteredCount = () => {
    if (questionFilter === 'multiple-choice') return testCount;
    if (questionFilter === 'open-answer') return openCount;
    return allQuestions.length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={onGoBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <span>←</span> Назад
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Выберите тип вопросов</h1>
          <p className="text-slate-400 mt-1">{subject.name}</p>
        </div>

        <div className="space-y-3 mb-8">
          <button
            onClick={() => onSetFilter('all')}
            className={`w-full text-left p-5 rounded-xl border transition-all ${
              questionFilter === 'all'
                ? 'bg-blue-500/10 border-blue-500 text-white'
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">📋</span>
              <div>
                <h3 className="font-medium text-white">Все вопросы</h3>
                <p className="text-sm text-slate-400">Тестовые + открытые ({allQuestions.length} шт.)</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onSetFilter('multiple-choice')}
            className={`w-full text-left p-5 rounded-xl border transition-all ${
              questionFilter === 'multiple-choice'
                ? 'bg-blue-500/10 border-blue-500 text-white'
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">📝</span>
              <div>
                <h3 className="font-medium text-white">Только тестовые</h3>
                <p className="text-sm text-slate-400">Выбор правильного ответа ({testCount} шт.)</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onSetFilter('open-answer')}
            className={`w-full text-left p-5 rounded-xl border transition-all ${
              questionFilter === 'open-answer'
                ? 'bg-blue-500/10 border-blue-500 text-white'
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">✍️</span>
              <div>
                <h3 className="font-medium text-white">Только письменные</h3>
                <p className="text-sm text-slate-400">Открытый ответ — определения и понятия ({openCount} шт.)</p>
              </div>
            </div>
          </button>
        </div>

        <button
          onClick={onStart}
          disabled={getFilteredCount() === 0}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🚀 Начать ({getFilteredCount()} вопросов)
        </button>
      </div>
    </div>
  );
}
