import { TestResult } from '../types';

interface HistoryScreenProps {
  history: TestResult[];
  onGoHome: () => void;
  onClearHistory: () => void;
}

export default function HistoryScreen({ history, onGoHome, onClearHistory }: HistoryScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={onGoHome} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
          <span>←</span> На главную
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">📊 История тестов</h1>

        {history.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">📝</span>
            <p className="text-slate-400 text-lg">Пока нет пройденных тестов</p>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => {
                  if (confirm('Очистить всю историю?')) {
                    onClearHistory();
                  }
                }}
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                🗑️ Очистить историю
              </button>
            </div>
            <div className="space-y-3">
              {history.map((result) => (
                <div key={result.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs">
                        {result.mode === 'control' ? '📝' : result.mode === 'marathon' ? '🏃' : result.mode === 'mistakes' ? '❌' : '📋'}
                      </span>
                      <h3 className="text-white font-medium text-sm">{result.lectureTitle}</h3>
                    </div>
                    <p className="text-slate-400 text-xs">{result.subjectName} • {result.date}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      result.percentage >= 90 ? 'text-green-400' :
                      result.percentage >= 75 ? 'text-blue-400' :
                      result.percentage >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {result.percentage}%
                    </div>
                    <p className="text-slate-500 text-xs">{result.score}/{result.total}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
