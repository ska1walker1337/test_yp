import { useState, useEffect } from 'react';
import { subjects, Subject, Lecture, Question } from './data/tests';

type Screen = 'home' | 'subject' | 'lecture' | 'quiz' | 'results' | 'history';

interface QuizState {
  currentQuestion: number;
  answers: (number | string)[];
  showExplanation: boolean;
  isFinished: boolean;
}

interface TestResult {
  id: string;
  subjectName: string;
  lectureTitle: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
}

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: [],
    showExplanation: false,
    isFinished: false,
  });
  const [testHistory, setTestHistory] = useState<TestResult[]>(() => {
    try {
      const saved = localStorage.getItem('unitest-history');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const startQuiz = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setQuizState({
      currentQuestion: 0,
      answers: new Array(lecture.questions.length).fill(null),
      showExplanation: false,
      isFinished: false,
    });
    setScreen('quiz');
  };

  const handleAnswer = (answer: number | string) => {
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQuestion] = answer;
    setQuizState({ ...quizState, answers: newAnswers, showExplanation: true });
  };

  const saveResult = (lecture: Lecture, subjectName: string) => {
    let correct = 0;
    lecture.questions.forEach((q, i) => {
      if (q.type === 'multiple-choice') {
        if (quizState.answers[i] === q.correctAnswer) correct++;
      } else {
        const userAnswer = (quizState.answers[i] as string || '').toLowerCase();
        const hasKeywords = q.keywords.some(kw => userAnswer.includes(kw.toLowerCase()));
        if (hasKeywords && userAnswer.length > 20) correct++;
      }
    });
    const result: TestResult = {
      id: Date.now().toString(),
      subjectName,
      lectureTitle: lecture.title,
      score: correct,
      total: lecture.questions.length,
      percentage: Math.round((correct / lecture.questions.length) * 100),
      date: new Date().toLocaleDateString('ru-RU'),
    };
    const newHistory = [result, ...testHistory].slice(0, 50);
    setTestHistory(newHistory);
    localStorage.setItem('unitest-history', JSON.stringify(newHistory));
  };

  const nextQuestion = () => {
    if (quizState.currentQuestion < (selectedLecture?.questions.length || 0) - 1) {
      setQuizState({
        ...quizState,
        currentQuestion: quizState.currentQuestion + 1,
        showExplanation: false,
      });
    } else {
      setQuizState({ ...quizState, isFinished: true });
      if (selectedLecture && selectedSubject) {
        saveResult(selectedLecture, selectedSubject.name);
      }
      setScreen('results');
    }
  };

  const calculateScore = () => {
    if (!selectedLecture) return 0;
    let correct = 0;
    selectedLecture.questions.forEach((q, i) => {
      if (q.type === 'multiple-choice') {
        if (quizState.answers[i] === q.correctAnswer) correct++;
      } else {
        const userAnswer = (quizState.answers[i] as string || '').toLowerCase();
        const hasKeywords = q.keywords.some(kw => userAnswer.includes(kw.toLowerCase()));
        if (hasKeywords && userAnswer.length > 20) correct++;
      }
    });
    return correct;
  };

  const goHome = () => {
    setScreen('home');
    setSelectedSubject(null);
    setSelectedLecture(null);
  };

  // Home Screen
  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            📚 UniTest
          </h1>
          <p className="text-slate-300 text-lg">
            Тесты по университетским предметам
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => {
                setSelectedSubject(subject);
                setScreen('subject');
              }}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${subject.color} p-8 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
              <div className="relative z-10">
                <span className="text-5xl mb-4 block">{subject.icon}</span>
                <h2 className="text-xl font-bold mb-2">{subject.name}</h2>
                <p className="text-white/80 text-sm">
                  {subject.lectures.length} {subject.lectures.length === 1 ? 'лекция' : 'лекций'}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setScreen('history')}
            className="px-6 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all"
          >
            📊 История тестов ({testHistory.length})
          </button>
        </div>

        <div className="mt-6 text-center">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-white font-semibold mb-2">💡 Как пользоваться</h3>
            <p className="text-slate-400 text-sm">
              Выберите предмет → лекцию → проходите тест. Вопросы бывают двух типов: 
              с выбором ответа и с открытым ответом (нужно написать определение или термин).
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Subject Screen
  const SubjectScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={goHome}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <span>←</span> Назад к предметам
        </button>

        <div className="mb-8">
          <span className="text-4xl">{selectedSubject?.icon}</span>
          <h1 className="text-3xl font-bold text-white mt-2">{selectedSubject?.name}</h1>
        </div>

        <div className="space-y-4">
          {selectedSubject?.lectures.map((lecture, index) => (
            <div
              key={lecture.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-500 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold text-lg">{lecture.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    {lecture.questions.length} вопросов ({lecture.questions.filter(q => q.type === 'multiple-choice').length} тестовых + {lecture.questions.filter(q => q.type === 'open-answer').length} открытых)
                  </p>
                </div>
                <button
                  onClick={() => startQuiz(lecture)}
                  className={`px-6 py-3 rounded-lg bg-gradient-to-r ${selectedSubject?.color} text-white font-medium hover:opacity-90 transition-opacity shadow-lg`}
                >
                  Начать
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Quiz Screen
  const QuizScreen = () => {
    if (!selectedLecture) return null;
    const question = selectedLecture.questions[quizState.currentQuestion];
    const progress = ((quizState.currentQuestion + 1) / selectedLecture.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goHome}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕ Выйти
            </button>
            <span className="text-slate-400 text-sm">
              Вопрос {quizState.currentQuestion + 1} из {selectedLecture.questions.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-700 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Question */}
          <div key={quizState.currentQuestion} className="animate-fadeIn bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-700 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                question.type === 'multiple-choice' 
                  ? 'bg-blue-500/20 text-blue-300' 
                  : 'bg-purple-500/20 text-purple-300'
              }`}>
                {question.type === 'multiple-choice' ? '📝 Тестовый вопрос' : '✍️ Открытый ответ'}
              </span>
            </div>
            <h2 className="text-white text-lg md:text-xl font-medium leading-relaxed">
              {question.question}
            </h2>
          </div>

          {/* Answer Area */}
          {!quizState.showExplanation ? (
            <div key={`answer-${quizState.currentQuestion}`} className="animate-slideIn space-y-3">
              {question.type === 'multiple-choice' ? (
                question.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
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
                    className="w-full h-40 p-4 rounded-xl bg-slate-800/50 border border-slate-600 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none transition-all"
                    id="open-answer-input"
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById('open-answer-input') as HTMLTextAreaElement;
                      if (input && input.value.trim().length > 0) {
                        handleAnswer(input.value.trim());
                      }
                    }}
                    className="mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    Ответить
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Show correct answer / model answer */}
              {question.type === 'multiple-choice' ? (
                <div className="space-y-3">
                  {question.options.map((option, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border ${
                        idx === question.correctAnswer
                          ? 'bg-green-500/10 border-green-500 text-green-200'
                          : idx === quizState.answers[quizState.currentQuestion]
                          ? 'bg-red-500/10 border-red-500 text-red-200'
                          : 'bg-slate-800/30 border-slate-700 text-slate-400'
                      }`}
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 text-sm font-medium bg-slate-700/50">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                      {idx === question.correctAnswer && <span className="ml-2">✓</span>}
                      {idx === quizState.answers[quizState.currentQuestion] && idx !== question.correctAnswer && <span className="ml-2">✗</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h4 className="text-purple-300 font-medium mb-2">📖 Модельный ответ:</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{question.modelAnswer}</p>
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <h4 className="text-blue-300 font-medium mb-1">Ваш ответ:</h4>
                    <p className="text-slate-400 text-sm">{quizState.answers[quizState.currentQuestion] as string}</p>
                  </div>
                </div>
              )}

              {/* Explanation */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <h4 className="text-amber-300 font-medium mb-2">💡 Объяснение:</h4>
                <p className="text-amber-100/80 text-sm leading-relaxed">{question.explanation}</p>
              </div>

              {/* Next Button */}
              <button
                onClick={nextQuestion}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                {quizState.currentQuestion < selectedLecture.questions.length - 1 ? 'Следующий вопрос →' : 'Завершить тест'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Results Screen
  const ResultsScreen = () => {
    if (!selectedLecture) return null;
    const score = calculateScore();
    const total = selectedLecture.questions.length;
    const percentage = Math.round((score / total) * 100);

    const getGrade = () => {
      if (percentage >= 90) return { grade: '5 (Отлично)', color: 'text-green-400', emoji: '🎉' };
      if (percentage >= 75) return { grade: '4 (Хорошо)', color: 'text-blue-400', emoji: '👍' };
      if (percentage >= 60) return { grade: '3 (Удовлетворительно)', color: 'text-yellow-400', emoji: '📖' };
      return { grade: '2 (Неудовлетворительно)', color: 'text-red-400', emoji: '📚' };
    };

    const gradeInfo = getGrade();

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <span className="text-6xl mb-4 block">{gradeInfo.emoji}</span>
            <h1 className="text-3xl font-bold text-white mb-2">Результаты теста</h1>
            <p className="text-slate-400">{selectedLecture.title}</p>
          </div>

          <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 mb-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">
                {score} <span className="text-slate-500">/ {total}</span>
              </div>
              <div className="text-2xl font-semibold mb-4" style={{ color: percentage >= 60 ? '#4ade80' : '#f87171' }}>
                {percentage}%
              </div>
              <div className={`text-xl font-medium ${gradeInfo.color}`}>
                Оценка: {gradeInfo.grade}
              </div>
            </div>

            {/* Progress circle */}
            <div className="flex justify-center mt-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke={percentage >= 60 ? '#4ade80' : '#f87171'}
                    strokeWidth="8"
                    strokeLinecap="round"
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

          {/* Detailed Results */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-8">
            <h3 className="text-white font-semibold mb-4">Детализация по вопросам:</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedLecture.questions.map((q, i) => {
                let isCorrect = false;
                if (q.type === 'multiple-choice') {
                  isCorrect = quizState.answers[i] === q.correctAnswer;
                } else {
                  const userAnswer = (quizState.answers[i] as string || '').toLowerCase();
                  const hasKeywords = q.keywords.some(kw => userAnswer.includes(kw.toLowerCase()));
                  isCorrect = hasKeywords && userAnswer.length > 20;
                }
                return (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <span className="text-slate-300 truncate">
                      Вопрос {i + 1}: {q.question.substring(0, 60)}...
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => startQuiz(selectedLecture)}
              className="flex-1 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              🔄 Пройти ещё раз
            </button>
            <button
              onClick={() => {
                setScreen('subject');
              }}
              className="flex-1 py-4 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-colors"
            >
              ← К лекциям
            </button>
            <button
              onClick={goHome}
              className="flex-1 py-4 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-colors"
            >
              🏠 На главную
            </button>
          </div>
        </div>
      </div>
    );
  };

  // History Screen
  const HistoryScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={goHome}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <span>←</span> На главную
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">📊 История тестов</h1>

        {testHistory.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">📝</span>
            <p className="text-slate-400 text-lg">Пока нет пройденных тестов</p>
            <p className="text-slate-500 text-sm mt-2">Пройдите свой первый тест!</p>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => {
                  if (confirm('Очистить всю историю?')) {
                    setTestHistory([]);
                    localStorage.removeItem('unitest-history');
                  }
                }}
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                🗑️ Очистить историю
              </button>
            </div>
            <div className="space-y-3">
              {testHistory.map((result) => (
                <div
                  key={result.id}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-white font-medium">{result.lectureTitle}</h3>
                    <p className="text-slate-400 text-sm">{result.subjectName} • {result.date}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      result.percentage >= 90 ? 'text-green-400' :
                      result.percentage >= 75 ? 'text-blue-400' :
                      result.percentage >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {result.percentage}%
                    </div>
                    <p className="text-slate-500 text-sm">{result.score}/{result.total}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Render current screen
  switch (screen) {
    case 'home':
      return <HomeScreen />;
    case 'subject':
      return <SubjectScreen />;
    case 'quiz':
      return <QuizScreen />;
    case 'results':
      return <ResultsScreen />;
    case 'history':
      return <HistoryScreen />;
    default:
      return <HomeScreen />;
  }
}

export default App;
