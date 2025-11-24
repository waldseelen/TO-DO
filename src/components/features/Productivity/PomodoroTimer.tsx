import { useEffect, useState } from 'react';
import { RotateCcw, Timer } from 'lucide-react';

import { formatTime } from '@/utils/time';

export const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: number | null = null;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'work') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(prev => !prev);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  return (
    <div className="bg-white dark:bg-dark-surface p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center gap-2 w-full">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
        <Timer size={14} />
        {mode === 'work' ? 'Odaklan' : 'Mola'}
      </div>
      <div className={`text-4xl font-mono font-bold ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
        {formatTime(timeLeft)}
      </div>
      <div className="flex gap-2 w-full">
        <button
          onClick={toggleTimer}
          className={`flex-1 py-1 rounded text-sm font-medium transition-colors ${
            isActive ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'
          }`}
        >
          {isActive ? 'Duraklat' : 'Başlat'}
        </button>
        <button
          onClick={resetTimer}
          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
};
