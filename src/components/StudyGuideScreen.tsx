interface StudyGuideScreenProps {
  title: string;
  content: string;
  onGoBack: () => void;
  onStartTest: () => void;
}

export default function StudyGuideScreen({ title, content, onGoBack, onStartTest }: StudyGuideScreenProps) {
  const renderContent = () => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-semibold text-blue-400 mt-6 mb-3">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="text-lg font-semibold text-white mt-4 mb-2">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="text-slate-300 ml-6 mb-2 list-disc">{line.replace('- ', '')}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="text-slate-300 mb-3 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={onGoBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
          <span>←</span> Назад к лекциям
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">📖 Конспект</h1>
          <p className="text-slate-400">{title}</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-slate-700 mb-8">
          <div className="prose prose-invert max-w-none">
            {renderContent()}
          </div>
        </div>

        <button
          onClick={onStartTest}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg hover:opacity-90 transition-opacity"
        >
          🚀 Начать тест
        </button>
      </div>
    </div>
  );
}
