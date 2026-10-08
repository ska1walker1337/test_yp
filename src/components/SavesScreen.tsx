import { Save } from '../types';

interface SavesScreenProps {
  saves: Save[];
  onGoHome: () => void;
  onLoadSave: (save: Save) => void;
  onDeleteSave: (saveId: string) => void;
}

export default function SavesScreen({ saves, onGoHome, onLoadSave, onDeleteSave }: SavesScreenProps) {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={onGoHome} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
          <span>←</span> На главную
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">💾 Сохранения прогресса</h1>

        {saves.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">📝</span>
            <p className="text-slate-400 text-lg">Нет сохранений</p>
            <p className="text-slate-500 text-sm mt-2">Пройдите тест и сохраните прогресс, чтобы продолжить позже</p>
          </div>
        ) : (
          <div className="space-y-4">
            {saves.map((save) => {
              const progress = Math.round((save.currentQuestion / save.questions.length) * 100);
              return (
                <div key={save.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-2">{save.name}</h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-slate-400">
                          <span className="text-slate-500">Предмет:</span> {save.subjectName}
                        </p>
                        <p className="text-slate-400">
                          <span className="text-slate-500">Лекция:</span> {save.lectureTitle}
                        </p>
                        <p className="text-slate-400">
                          <span className="text-slate-500">Прогресс:</span> {save.currentQuestion + 1} из {save.questions.length} вопросов ({progress}%)
                        </p>
                        <p className="text-slate-400">
                          <span className="text-slate-500">Сохранено:</span> {formatDate(save.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => onLoadSave(save)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
                      >
                        ▶ Продолжить
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Удалить это сохранение?')) {
                            onDeleteSave(save.id);
                          }
                        }}
                        className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                      >
                        🗑️ Удалить
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
