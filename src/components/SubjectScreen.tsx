import { Subject, Lecture } from '../types';
import { studyGuides } from '../data/studyGuides';

interface SubjectScreenProps {
  subject: Subject;
  onGoHome: () => void;
  onStartControl: () => void;
  onStartMarathon: () => void;
  onStartTest: (lecture: Lecture) => void;
  onShowStudyGuide: (lecture: Lecture) => void;
}

export default function SubjectScreen({ 
  subject, 
  onGoHome, 
  onStartControl, 
  onStartMarathon, 
  onStartTest,
  onShowStudyGuide
}: SubjectScreenProps) {
  const totalQuestions = subject.lectures.reduce((acc, l) => acc + l.questions.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={onGoHome} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
          <span>←</span> Назад к предметам
        </button>

        <div className="mb-8">
          <span className="text-4xl">{subject.icon}</span>
          <h1 className="text-3xl font-bold text-white mt-2">{subject.name}</h1>
          <p className="text-slate-400 text-sm mt-1">Всего вопросов: {totalQuestions}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={onStartControl}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 p-5 text-white text-left shadow-lg hover:shadow-xl transition-all"
          >
            <div className="relative z-10">
              <span className="text-2xl">📝</span>
              <h3 className="text-lg font-bold mt-2">Контрольная работа</h3>
              <p className="text-white/80 text-sm mt-1">Выберите несколько тем для большого теста</p>
            </div>
          </button>

          <button
            onClick={onStartMarathon}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 p-5 text-white text-left shadow-lg hover:shadow-xl transition-all"
          >
            <div className="relative z-10">
              <span className="text-2xl">🏃</span>
              <h3 className="text-lg font-bold mt-2">Марафон</h3>
              <p className="text-white/80 text-sm mt-1">Сначала тип вопросов, потом выбор тем</p>
            </div>
          </button>
        </div>

        <h2 className="text-white font-semibold text-lg mb-4">Лекции</h2>
        <div className="space-y-4">
          {subject.lectures.map((lecture) => {
            const hasStudyGuide = studyGuides[lecture.id] !== undefined;
            return (
              <div key={lecture.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-500 transition-all">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{lecture.title}</h3>
                    <p className="text-slate-400 text-sm mt-1">
                      {lecture.questions.length} вопросов ({lecture.questions.filter(q => q.type === 'multiple-choice').length} тестовых + {lecture.questions.filter(q => q.type === 'open-answer').length} открытых)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {hasStudyGuide && (
                      <button
                        onClick={() => onShowStudyGuide(lecture)}
                        className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-300 hover:bg-blue-500/30 transition-all text-sm"
                      >
                        📖 Конспект
                      </button>
                    )}
                    <button
                      onClick={() => onStartTest(lecture)}
                      className={`px-6 py-2 rounded-lg bg-gradient-to-r ${subject.color} text-white font-medium hover:opacity-90 transition-opacity shadow-lg`}
                    >
                      Начать тест
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
