import { useState } from 'react';
import { UploadForm } from './components/UploadForm';
import { AnalysisProgress } from './components/AnalysisProgress';
import { ReportView } from './components/ReportView';
import { analyzeContent } from './utils/videoProcessing';
import type { AnalysisResult } from './types/analysis';
import { Eye } from 'lucide-react';

type AppState = 'idle' | 'analyzing' | 'result';

function App() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (file: File | null, url: string, caption: string, platform: string) => {
    setAppState('analyzing');
    try {
      const res = await analyzeContent(file, url, caption, platform, (p, s) => {
        setProgress(p);
        setStatusText(s);
      });
      setResult(res);
      setAppState('result');
    } catch (error) {
      console.error(error);
      alert('Analysis failed');
      setAppState('idle');
    }
  };

  const handleReset = () => {
    setAppState('idle');
    setResult(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans p-4 md:p-8 selection:bg-purple-500/30">

      {/* Header */}
      <header className="max-w-5xl mx-auto mb-12 mt-4 text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Eye className="w-10 h-10 text-purple-500" />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Viral<span className="text-purple-500">Lens</span>
          </h1>
        </div>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          We don't give you fake confidence. We analyze measurable algorithmic suppression triggers so you know EXACTLY why your content will or won't perform.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto flex flex-col items-center">
        {appState === 'idle' && (
          <UploadForm onAnalyze={handleAnalyze} />
        )}

        {appState === 'analyzing' && (
          <AnalysisProgress progress={progress} status={statusText} />
        )}

        {appState === 'result' && result && (
          <ReportView result={result} onReset={handleReset} />
        )}
      </main>

    </div>
  );
}

export default App;
