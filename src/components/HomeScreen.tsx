import { Subject } from '../types';

interface HomeScreenProps {
  subjects: Subject[];
  mistakesCount: number;
  historyCount: number;
  savesCount: number;
  onSelectSubject: (subject: Subject) => void;
  onShowHistory: () => void;
  onShowMistakes: () => void;
  onShowSaves: () => void;
}

export default function HomeScreen({ 
  subjects, 
  mistakesCount, 
  historyCount, 
  savesCount,
  onSelectSubject, 
  onShowHistory, 
  onShowMistakes,
  onShowSaves
}: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">📚 UniTest</h1>
          <p className="text-slate-300 text-lg">Тесты по университетским предметам</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjects.map((subject) => {
            const totalQuestions = subject.lectures.reduce((acc, l) => acc + l.questions.length, 0);
            return (
              <button
                key={subject.id}
                onClick={() => onSelectSubject(subject)}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${subject.color} p-8 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="relative z-10">
                  <span className="text-5xl mb-4 block">{subject.icon}</span>
                  <h2 className="text-xl font-bold mb-2">{subject.name}</h2>
                  <p className="text-white/80 text-sm">{subject.lectures.length} лекций • {totalQuestions} вопросов</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={onShowHistory}
            className="px-6 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all"
          >
            📊 История тестов ({historyCount})
          </button>
          {mistakesCount > 0 && (
            <button
              onClick={onShowMistakes}
              className="px-6 py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300 hover:text-red-200 hover:border-red-400 transition-all"
            >
              ❌ Ошибки ({mistakesCount})
            </button>
          )}
          <button
            onClick={onShowSaves}
            className="px-6 py-3 rounded-xl bg-blue-500/20 border border-blue-500/50 text-blue-300 hover:text-blue-200 hover:border-blue-400 transition-all"
          >
            💾 Сохранения ({savesCount})
          </button>
        </div>

        <div className="mt-6 text-center">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-white font-semibold mb-2">💡 Режимы тестирования</h3>
            <p className="text-slate-400 text-sm">
              <strong>Обычный тест</strong> — одна лекция. <strong>Контрольная работа</strong> — несколько тем. <strong>Марафон</strong> — все вопросы предмета. Можно фильтровать по типу вопросов.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
