import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Video, Search, BrainCircuit, Activity } from 'lucide-react';

interface AnalysisProgressProps {
  progress: number;
  status: string;
}

const steps = [
  { icon: Video, label: "Extracting frames & audio..." },
  { icon: Search, label: "Analyzing hook strength & pacing..." },
  { icon: BrainCircuit, label: "Evaluating AI suppression triggers..." },
  { icon: Activity, label: "Generating final score & insights..." }
];

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ progress, status }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (progress < 25) setCurrentStepIndex(0);
    else if (progress < 50) setCurrentStepIndex(1);
    else if (progress < 75) setCurrentStepIndex(2);
    else setCurrentStepIndex(3);
  }, [progress]);

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-gray-900 rounded-2xl border border-gray-800 shadow-xl">
      <div className="flex flex-col items-center mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-purple-500 mb-4" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Analyzing Content</h2>
        <p className="text-gray-400">{status}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden mb-8">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut", duration: 0.5 }}
        />
      </div>

      {/* Steps Checklist */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStepIndex;
          const isPast = index < currentStepIndex;

          return (
            <div key={index} className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${
              isActive ? 'bg-purple-500/10 border border-purple-500/20' : ''
            }`}>
              <div className={`p-2 rounded-full ${
                isPast ? 'bg-green-500/20 text-green-400' :
                isActive ? 'bg-purple-500/20 text-purple-400' :
                'bg-gray-800 text-gray-600'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`font-medium ${
                isPast ? 'text-gray-300' :
                isActive ? 'text-purple-300' :
                'text-gray-600'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
