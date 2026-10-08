import { useState, useEffect } from 'react';
import { subjects } from './data/tests';
import { studyGuides } from './data/studyGuides';
import { Subject, Lecture, Question, Screen, QuizMode, QuestionFilter, QuizState, TestResult, MistakeItem, Save } from './types';
import { shuffleArray, isAnswerCorrect, shuffleAllQuestionOptions } from './utils';
import HomeScreen from './components/HomeScreen';
import SubjectScreen from './components/SubjectScreen';
import StudyGuideScreen from './components/StudyGuideScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import HistoryScreen from './components/HistoryScreen';
import MistakesScreen from './components/MistakesScreen';
import SavesScreen from './components/SavesScreen';
import FilterSelectScreen from './components/FilterSelectScreen';
import TopicSelectScreen from './components/TopicSelectScreen';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [quizMode, setQuizMode] = useState<QuizMode>('test');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionFilter, setQuestionFilter] = useState<QuestionFilter>('all');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [quizTitle, setQuizTitle] = useState('');
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
  const [mistakes, setMistakes] = useState<MistakeItem[]>(() => {
    try {
      const saved = localStorage.getItem('unitest-mistakes');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [saves, setSaves] = useState<Save[]>(() => {
    try {
      const saved = localStorage.getItem('unitest-saves');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Автосохранение прогресса при изменении состояния теста
  useEffect(() => {
    if (screen === 'quiz' && currentQuestions.length > 0 && selectedSubject && selectedLecture) {
      const autoSave: Save = {
        id: 'autosave',
        name: 'Автосохранение',
        subjectId: selectedSubject.id,
        subjectName: selectedSubject.name,
        lectureId: selectedLecture.id,
        lectureTitle: selectedLecture.title,
        questions: currentQuestions,
        currentQuestion: quizState.currentQuestion,
        answers: quizState.answers,
        quizMode: quizMode,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('unitest-autosave', JSON.stringify(autoSave));
    }
  }, [screen, quizState.currentQuestion, quizState.answers]);

  // Загрузка автосохранения при старте приложения
  useEffect(() => {
    try {
      const autoSave = localStorage.getItem('unitest-autosave');
      if (autoSave) {
        const save: Save = JSON.parse(autoSave);
        // Проверяем, есть ли несохранённый прогресс
        if (save.currentQuestion > 0 || save.answers.some(a => a !== null)) {
          const shouldResume = confirm('Обнаружен несохранённый прогресс теста. Хотите продолжить?');
          if (shouldResume) {
            loadSave(save);
          }
        }
      }
    } catch (e) {
      console.error('Ошибка загрузки автосохранения:', e);
    }
  }, []);

  const saveProgress = () => {
    if (!selectedSubject || !selectedLecture || currentQuestions.length === 0) return;
    
    const saveName = prompt('Введите название сохранения:', `${selectedLecture.title} - ${quizState.currentQuestion + 1}/${currentQuestions.length}`);
    if (!saveName) return;

    const newSave: Save = {
      id: Date.now().toString(),
      name: saveName,
      subjectId: selectedSubject.id,
      subjectName: selectedSubject.name,
      lectureId: selectedLecture.id,
      lectureTitle: selectedLecture.title,
      questions: currentQuestions,
      currentQuestion: quizState.currentQuestion,
      answers: quizState.answers,
      quizMode: quizMode,
      timestamp: new Date().toISOString(),
    };

    const newSaves = [newSave, ...saves].slice(0, 20); // Максимум 20 сохранений
    setSaves(newSaves);
    localStorage.setItem('unitest-saves', JSON.stringify(newSaves));
    alert('Прогресс сохранён!');
  };

  const loadSave = (save: Save) => {
    const subject = subjects.find(s => s.id === save.subjectId);
    const lecture = subject?.lectures.find(l => l.id === save.lectureId);
    
    if (!subject || !lecture) {
      alert('Не удалось загрузить сохранение: предмет или лекция не найдены');
      return;
    }

    setSelectedSubject(subject);
    setSelectedLecture(lecture);
    setQuizMode(save.quizMode);
    setCurrentQuestions(save.questions);
    setQuizTitle(save.lectureTitle);
    setQuizState({
      currentQuestion: save.currentQuestion,
      answers: save.answers,
      showExplanation: false,
      isFinished: false,
    });
    setScreen('quiz');
  };

  const deleteSave = (saveId: string) => {
    const newSaves = saves.filter(s => s.id !== saveId);
    setSaves(newSaves);
    localStorage.setItem('unitest-saves', JSON.stringify(newSaves));
  };

  const addMistake = (question: Question, subjectId: string, subjectName: string, lectureId: string, lectureTitle: string, questionIndex: number) => {
    const existingIndex = mistakes.findIndex(
      m => m.subjectId === subjectId && m.lectureId === lectureId && m.questionIndex === questionIndex
    );
    
    let newMistakes: MistakeItem[];
    if (existingIndex >= 0) {
      newMistakes = [...mistakes];
      newMistakes[existingIndex] = {
        ...newMistakes[existingIndex],
        attempts: newMistakes[existingIndex].attempts + 1,
        date: new Date().toLocaleDateString('ru-RU'),
      };
    } else {
      const newMistake: MistakeItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        subjectId,
        subjectName,
        lectureId,
        lectureTitle,
        questionIndex,
        question,
        date: new Date().toLocaleDateString('ru-RU'),
        attempts: 1,
      };
      newMistakes = [newMistake, ...mistakes];
    }
    
    setMistakes(newMistakes);
    localStorage.setItem('unitest-mistakes', JSON.stringify(newMistakes));
  };

  const removeMistake = (mistakeId: string) => {
    const newMistakes = mistakes.filter(m => m.id !== mistakeId);
    setMistakes(newMistakes);
    localStorage.setItem('unitest-mistakes', JSON.stringify(newMistakes));
  };

  const clearAllMistakes = () => {
    setMistakes([]);
    localStorage.removeItem('unitest-mistakes');
  };

  const collectQuestions = (lectureIds: string[], filter: QuestionFilter): Question[] => {
    if (!selectedSubject) return [];
    let questions: Question[] = [];
    lectureIds.forEach((id: string) => {
      const lecture = selectedSubject.lectures.find((l: Lecture) => l.id === id);
      if (lecture) {
        questions = [...questions, ...lecture.questions];
      }
    });
    if (filter === 'multiple-choice') {
      questions = questions.filter((q: Question) => q.type === 'multiple-choice');
    } else if (filter === 'open-answer') {
      questions = questions.filter((q: Question) => q.type === 'open-answer');
    }
    return shuffleArray(questions);
  };

  const startQuiz = (questions: Question[], title: string) => {
    // Перемешиваем варианты ответов для всех вопросов
    const shuffledQuestions = shuffleAllQuestionOptions(questions);
    setCurrentQuestions(shuffledQuestions);
    setQuizTitle(title);
    setQuizState({
      currentQuestion: 0,
      answers: new Array(shuffledQuestions.length).fill(null),
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

  const saveResult = (subjectName: string, title: string, mode: QuizMode) => {
    let correct = 0;
    currentQuestions.forEach((q, i) => {
      if (q.type === 'multiple-choice') {
        if (quizState.answers[i] === q.correctAnswer) correct++;
      } else {
        const userAnswer = (quizState.answers[i] as string || '').toLowerCase();
        const hasKeywords = q.keywords?.some((kw: string) => userAnswer.includes(kw.toLowerCase())) || false;
        if (hasKeywords && userAnswer.length > 20) correct++;
      }
    });
    const result: TestResult = {
      id: Date.now().toString(),
      subjectName,
      lectureTitle: title,
      mode,
      score: correct,
      total: currentQuestions.length,
      percentage: Math.round((correct / currentQuestions.length) * 100),
      date: new Date().toLocaleDateString('ru-RU'),
    };
    const newHistory = [result, ...testHistory].slice(0, 50);
    setTestHistory(newHistory);
    localStorage.setItem('unitest-history', JSON.stringify(newHistory));
  };

  const nextQuestion = () => {
    const currentQ = currentQuestions[quizState.currentQuestion];
    const currentAnswer = quizState.answers[quizState.currentQuestion];
    const isCorrect = isAnswerCorrect(currentQ, currentAnswer);

    if (quizMode !== 'mistakes') {
      if (!isCorrect && selectedSubject) {
        let lectureId = '';
        let lectureTitle = '';
        
        if (selectedLecture) {
          lectureId = selectedLecture.id;
          lectureTitle = selectedLecture.title;
        } else {
          for (const lecture of selectedSubject.lectures) {
            const qIndex = lecture.questions.findIndex((q: Question) => q.question === currentQ.question);
            if (qIndex >= 0) {
              lectureId = lecture.id;
              lectureTitle = lecture.title;
              break;
            }
          }
        }

        if (lectureId) {
          const originalIndex = selectedSubject.lectures
            .find((l: Lecture) => l.id === lectureId)
            ?.questions.findIndex((q: Question) => q.question === currentQ.question) || 0;
          
          addMistake(currentQ, selectedSubject.id, selectedSubject.name, lectureId, lectureTitle, originalIndex);
        }
      }
    }

    if (quizMode === 'mistakes' && isCorrect) {
      const mistakeToRemove = mistakes.find(m => m.question.question === currentQ.question);
      if (mistakeToRemove) {
        removeMistake(mistakeToRemove.id);
      }
    }

    if (quizState.currentQuestion < currentQuestions.length - 1) {
      setQuizState({
        ...quizState,
        currentQuestion: quizState.currentQuestion + 1,
        showExplanation: false,
      });
    } else {
      setQuizState({ ...quizState, isFinished: true });
      if (selectedSubject && quizMode !== 'mistakes') {
        saveResult(selectedSubject.name, quizTitle, quizMode);
      }
      // Удаляем автосохранение после завершения теста
      localStorage.removeItem('unitest-autosave');
      setScreen('results');
    }
  };

  const goHome = () => {
    setScreen('home');
    setSelectedSubject(null);
    setSelectedLecture(null);
    setSelectedTopics([]);
    setQuestionFilter('all');
  };

  const goToSubject = () => {
    setScreen('subject');
    setSelectedTopics([]);
    setQuestionFilter('all');
  };

  const startMistakesQuiz = (filteredMistakes?: MistakeItem[]) => {
    const mistakesToUse = filteredMistakes || mistakes;
    const questions = shuffleArray(mistakesToUse.map(m => m.question));
    // Перемешиваем варианты ответов для всех вопросов
    const shuffledQuestions = shuffleAllQuestionOptions(questions);
    setQuizMode('mistakes');
    setQuizTitle('Работа над ошибками');
    setCurrentQuestions(shuffledQuestions);
    setQuizState({
      currentQuestion: 0,
      answers: new Array(shuffledQuestions.length).fill(null),
      showExplanation: false,
      isFinished: false,
    });
    setScreen('quiz');
  };

  switch (screen) {
    case 'home':
      return (
        <HomeScreen
          subjects={subjects}
          mistakesCount={mistakes.length}
          historyCount={testHistory.length}
          savesCount={saves.length}
          onSelectSubject={(subject) => {
            setSelectedSubject(subject);
            setScreen('subject');
          }}
          onShowHistory={() => setScreen('history')}
          onShowMistakes={() => setScreen('mistakes')}
          onShowSaves={() => setScreen('saves')}
        />
      );
    case 'subject':
      if (!selectedSubject) return null;
      return (
        <SubjectScreen
          subject={selectedSubject}
          onGoHome={goHome}
          onStartControl={() => {
            setQuizMode('control');
            setSelectedTopics(selectedSubject.lectures.map(l => l.id));
            setQuestionFilter('all');
            setScreen('topic-select');
          }}
          onStartMarathon={() => {
            setQuizMode('marathon');
            setSelectedTopics(selectedSubject.lectures.map(l => l.id));
            setQuestionFilter('all');
            setScreen('filter-select');
          }}
          onStartTest={(lecture) => {
            setQuizMode('test');
            setSelectedLecture(lecture);
            setSelectedTopics([lecture.id]);
            setQuestionFilter('all');
            const questions = collectQuestions([lecture.id], 'all');
            startQuiz(questions, lecture.title);
          }}
          onShowStudyGuide={(lecture) => {
            setSelectedLecture(lecture);
            setScreen('study-guide');
          }}
        />
      );
    case 'study-guide':
      if (!selectedLecture || !selectedSubject) return null;
      const guideContent = studyGuides[selectedLecture.id];
      if (!guideContent) return null;
      return (
        <StudyGuideScreen
          title={selectedLecture.title}
          content={guideContent}
          onGoBack={goToSubject}
          onStartTest={() => {
            setQuizMode('test');
            setSelectedTopics([selectedLecture.id]);
            setQuestionFilter('all');
            const questions = collectQuestions([selectedLecture.id], 'all');
            startQuiz(questions, selectedLecture.title);
          }}
        />
      );
    case 'quiz':
      return (
        <QuizScreen
          questions={currentQuestions}
          quizTitle={quizTitle}
          isMistakesMode={quizMode === 'mistakes'}
          onAnswer={handleAnswer}
          onNext={nextQuestion}
          onExit={goToSubject}
          onSave={saveProgress}
          currentState={quizState}
        />
      );
    case 'results':
      return (
        <ResultsScreen
          questions={currentQuestions}
          answers={quizState.answers}
          quizTitle={quizTitle}
          mode={quizMode}
          onRetry={() => {
            const questions = collectQuestions(selectedTopics, questionFilter);
            startQuiz(questions, quizTitle);
          }}
          onGoToSubject={goToSubject}
          onGoHome={goHome}
          onContinueMistakes={() => startMistakesQuiz()}
          mistakesCount={mistakes.length}
        />
      );
    case 'history':
      return (
        <HistoryScreen
          history={testHistory}
          onGoHome={goHome}
          onClearHistory={() => {
            setTestHistory([]);
            localStorage.removeItem('unitest-history');
          }}
        />
      );
    case 'mistakes':
      return (
        <MistakesScreen
          mistakes={mistakes}
          onGoHome={goHome}
          onPracticeAll={() => startMistakesQuiz()}
          onPracticeBySubject={(subjectMistakes) => startMistakesQuiz(subjectMistakes)}
          onRemoveMistake={removeMistake}
          onClearAll={clearAllMistakes}
        />
      );
    case 'saves':
      return (
        <SavesScreen
          saves={saves}
          onGoHome={goHome}
          onLoadSave={loadSave}
          onDeleteSave={deleteSave}
        />
      );
    case 'filter-select':
      if (!selectedSubject) return null;
      return (
        <FilterSelectScreen
          subject={selectedSubject}
          selectedTopics={selectedTopics}
          questionFilter={questionFilter}
          onSetFilter={(filter) => setQuestionFilter(filter)}
          onGoBack={quizMode === 'control' ? () => setScreen('topic-select') : goToSubject}
          onStart={() => {
            const questions = collectQuestions(selectedTopics, questionFilter);
            const titleParts: string[] = [];
            if (quizMode === 'marathon') titleParts.push('Марафон');
            else if (quizMode === 'control') titleParts.push('Контрольная');
            if (selectedTopics.length === 1) {
              const lecture = selectedSubject.lectures.find(l => l.id === selectedTopics[0]);
              if (lecture) titleParts.push(lecture.title);
            } else {
              titleParts.push(`${selectedTopics.length} тем`);
            }
            if (questionFilter !== 'all') {
              titleParts.push(questionFilter === 'multiple-choice' ? '(тестовые)' : '(письменные)');
            }
            startQuiz(questions, titleParts.join(' — '));
          }}
        />
      );
    case 'topic-select':
      if (!selectedSubject) return null;
      return (
        <TopicSelectScreen
          subject={selectedSubject}
          selectedTopics={selectedTopics}
          questionFilter={questionFilter}
          onToggleTopic={(lectureId) => {
            setSelectedTopics(prev =>
              prev.includes(lectureId)
                ? prev.filter(id => id !== lectureId)
                : [...prev, lectureId]
            );
          }}
          onSelectAll={() => setSelectedTopics(selectedSubject.lectures.map(l => l.id))}
          onDeselectAll={() => setSelectedTopics([])}
          onGoBack={goToSubject}
          onStart={() => setScreen('filter-select')}
        />
      );
    default:
      return null;
  }
}

export default App;
