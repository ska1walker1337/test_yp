import { Subject, Lecture, Question } from '../types';

interface TopicSelectScreenProps {
  subject: Subject;
  selectedTopics: string[];
  questionFilter: string;
  onToggleTopic: (lectureId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onGoBack: () => void;
  onStart: () => void;
}

export default function TopicSelectScreen({ 
  subject, 
  selectedTopics, 
  questionFilter,
  onToggleTopic, 
  onSelectAll, 
  onDeselectAll, 
  onGoBack, 
  onStart 
}: TopicSelectScreenProps) {
  const getFilteredCount = (lecture: Lecture) => {
    if (questionFilter === 'multiple-choice') {
      return lecture.questions.filter((q: Question) => q.type === 'multiple-choice').length;
    } else if (questionFilter === 'open-answer') {
      return lecture.questions.filter((q: Question) => q.type === 'open-answer').length;
    }
    return lecture.questions.length;
  };

  const getFilterLabel = () => {
    if (questionFilter === 'multiple-choice') return ' тестовых';
    if (questionFilter === 'open-answer') return ' письменных';
    return '';
  };

  const totalSelected = selectedTopics.reduce((acc, id) => {
    const lecture = subject.lectures.find(l => l.id === id);
    return acc + (lecture ? getFilteredCount(lecture) : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={onGoBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <span>←</span> Назад
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Выберите темы</h1>
          <p className="text-slate-400 mt-1">{subject.name}</p>
        </div>

        <div className="flex gap-3 mb-4">
          <button
            onClick={onSelectAll}
            className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm hover:bg-slate-600 transition-colors"
          >
            ✓ Выбрать все
          </button>
          <button
            onClick={onDeselectAll}
            className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm hover:bg-slate-600 transition-colors"
          >
            ✕ Снять все
          </button>
        </div>

        <div className="space-y-3 mb-8">
          {subject.lectures.map((lecture) => {
            const isSelected = selectedTopics.includes(lecture.id);
            const count = getFilteredCount(lecture);
            return (
              <button
                key={lecture.id}
                onClick={() => onToggleTopic(lecture.id)}
                className={`w-full text-left p-5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-blue-500/10 border-blue-500 text-white'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-500'
                  }`}>
                    {isSelected && <span className="text-white text-sm">✓</span>}
                  </div>
                  <div>
                    <h3 className="font-medium">{lecture.title}</h3>
                    <p className="text-sm opacity-70">{count}{getFilterLabel()} вопросов</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {selectedTopics.length > 0 && (
          <div className="bg-slate-800/70 rounded-xl p-5 border border-slate-700 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">
                  Выбрано тем: {selectedTopics.length}
                </p>
                <p className="text-slate-400 text-sm">
                  Всего вопросов: {totalSelected}
                </p>
              </div>
              <button
                onClick={onStart}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                🚀 Начать
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
