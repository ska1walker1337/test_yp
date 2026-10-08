import { MistakeItem } from '../types';

interface MistakesScreenProps {
  mistakes: MistakeItem[];
  onGoHome: () => void;
  onPracticeAll: () => void;
  onPracticeBySubject: (subjectMistakes: MistakeItem[]) => void;
  onRemoveMistake: (id: string) => void;
  onClearAll: () => void;
}

export default function MistakesScreen({ 
  mistakes, 
  onGoHome, 
  onPracticeAll, 
  onPracticeBySubject, 
  onRemoveMistake, 
  onClearAll 
}: MistakesScreenProps) {
  const mistakesBySubject = mistakes.reduce((acc, mistake) => {
    if (!acc[mistake.subjectId]) {
      acc[mistake.subjectId] = {
        subjectName: mistake.subjectName,
        subjectId: mistake.subjectId,
        mistakes: [],
      };
    }
    acc[mistake.subjectId].mistakes.push(mistake);
    return acc;
  }, {} as Record<string, { subjectName: string; subjectId: string; mistakes: MistakeItem[] }>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={onGoHome} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
          <span>←</span> На главную
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">❌ Работа над ошибками</h1>
          <p className="text-slate-400 mt-2">Неправильно выполненные задания: {mistakes.length}</p>
        </div>

        {mistakes.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">🎉</span>
            <p className="text-slate-400 text-lg">Отлично! Ошибок нет</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={onPracticeAll}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                🔄 Прорешать все ошибки ({mistakes.length})
              </button>
              <button
                onClick={() => {
                  if (confirm('Удалить все ошибки из трекера?')) {
                    onClearAll();
                  }
                }}
                className="px-6 py-3 rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
              >
                🗑️ Очистить все
              </button>
            </div>

            <div className="space-y-6">
              {Object.values(mistakesBySubject).map(({ subjectName, subjectId, mistakes: subjectMistakes }) => (
                <div key={subjectId} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">{subjectName}</h2>
                    <button
                      onClick={() => onPracticeBySubject(subjectMistakes)}
                      className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-sm"
                    >
                      Прорешать ({subjectMistakes.length})
                    </button>
                  </div>

                  <div className="space-y-3">
                    {subjectMistakes.map((mistake) => (
                      <div key={mistake.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-slate-400 text-xs mb-1">{mistake.lectureTitle}</p>
                            <p className="text-white text-sm mb-2">{mistake.question.question}</p>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span>Попыток: {mistake.attempts}</span>
                              <span>•</span>
                              <span>{mistake.date}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => onRemoveMistake(mistake.id)}
                            className="text-slate-500 hover:text-red-400 transition-colors"
                            title="Удалить из списка"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
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
