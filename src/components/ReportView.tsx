import React, { useRef } from 'react';
import type { AnalysisResult } from '../types/analysis';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis, Tooltip } from 'recharts';
import html2canvas from 'html2canvas';
import { Download, AlertTriangle, CheckCircle, Zap, MessageSquare, Lightbulb } from 'lucide-react';

interface ReportViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ result, onReset }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (reportRef.current) {
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#030712', // Tailwind gray-950
        scale: 2,
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'ViralLens-Report.png';
      link.click();
    }
  };

  const radarData = [
    { subject: 'Hook', A: result.sub_scores.hook.score },
    { subject: 'Pacing', A: result.sub_scores.pacing.score },
    { subject: 'Visual', A: result.sub_scores.visual.score },
    { subject: 'Caption', A: result.sub_scores.caption.score },
    { subject: 'Audio', A: result.sub_scores.audio.score },
    { subject: 'Emotion', A: result.sub_scores.emotion.score },
    { subject: 'Trend', A: result.sub_scores.trend.score },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <button onClick={onReset} className="text-gray-400 hover:text-white transition-colors">
          &larr; Analyze Another
        </button>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Report Card</span>
        </button>
      </div>

      <div ref={reportRef} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl space-y-12">

        {/* Header section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
            {result.overall_score}/100
          </h1>
          <div className="inline-block px-4 py-1 rounded-full bg-gray-800 text-purple-300 font-semibold border border-purple-500/30">
            {result.score_label}
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            {result.score_description}
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500 mt-4">
            <span>Hook Type: <strong className="text-gray-300">{result.hook_type}</strong></span>
            <span>Platform Fit: <strong className="text-gray-300">{result.platform_fit}</strong></span>
            <span>Risk: <strong className={`${result.suppression_risk === 'High' ? 'text-red-400' : 'text-green-400'}`}>{result.suppression_risk}</strong></span>
          </div>
        </div>

        {/* Chart & Highlights */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="h-80 w-full bg-gray-950 rounded-xl p-4 border border-gray-800">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} />
                <Radar name="Score" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-6">
            <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-xl">
              <h3 className="flex items-center text-red-400 font-semibold mb-3">
                <AlertTriangle className="w-5 h-5 mr-2" /> Top 3 Suppression Risks
              </h3>
              <ul className="space-y-2">
                {result.top_3_issues.map((issue, i) => (
                  <li key={i} className="text-gray-300 flex items-start">
                    <span className="text-red-500 mr-2">•</span> {issue}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 p-5 rounded-xl">
              <h3 className="flex items-center text-green-400 font-semibold mb-3">
                <CheckCircle className="w-5 h-5 mr-2" /> Top 3 Strengths
              </h3>
              <ul className="space-y-2">
                {result.top_3_strengths.map((str, i) => (
                  <li key={i} className="text-gray-300 flex items-start">
                    <span className="text-green-500 mr-2">•</span> {str}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Sub-Scores */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-purple-400" /> Actionable Fixes by Category
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(result.sub_scores).map(([key, data]) => (
              <div key={key} className="bg-gray-950 p-5 rounded-xl border border-gray-800">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold capitalize text-gray-200">{key}</span>
                  <span className={`font-black ${getScoreColor(data.score)}`}>{data.score}</span>
                </div>
                <div className="space-y-3">
                  {data.fixes.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">How to fix</span>
                      <ul className="mt-1 space-y-1">
                        {data.fixes.map((fix, i) => <li key={i} className="text-sm text-gray-300">- {fix}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Enhancements */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-950 p-6 rounded-xl border border-gray-800">
            <h3 className="flex items-center text-blue-400 font-semibold mb-3">
              <MessageSquare className="w-5 h-5 mr-2" /> Rewritten Caption
            </h3>
            <p className="text-gray-300 whitespace-pre-wrap text-sm">{result.rewritten_caption}</p>
          </div>
          <div className="bg-gray-950 p-6 rounded-xl border border-gray-800">
            <h3 className="flex items-center text-yellow-400 font-semibold mb-3">
              <Lightbulb className="w-5 h-5 mr-2" /> Hook Alternatives
            </h3>
            <ul className="space-y-2">
              {result.hook_alternatives.map((alt, i) => (
                <li key={i} className="text-gray-300 text-sm bg-gray-900 p-2 rounded">"{alt}"</li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};
