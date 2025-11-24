import { BarChart3, CheckCircle, Sun, Trophy } from 'lucide-react';

import { usePlannerContext } from '@/context/AppContext';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getCourseProgress, getNextTask } from '@/utils/course';
import { getDaysLeft } from '@/utils/time';

interface Props {
  onNavigateCourse: (courseId: string) => void;
  onNavigateDaily: () => void;
}

export const Overview = ({ onNavigateCourse, onNavigateDaily }: Props) => {
  const { courses, completedTasks, completionHistory } = usePlannerContext();
  const completedCount = completedTasks.size;

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const activityData = last7Days.map(date => {
    const count = Object.values(completionHistory).filter(d => d.startsWith(date)).length;
    return { date, count };
  });

  const maxCount = Math.max(...activityData.map(d => d.count), 1);

  return (
    <div className="p-6 space-y-8 animate-fade-in pt-16 md:pt-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Genel Bakış</h1>
        <p className="text-slate-500 dark:text-slate-400">Akademik yolculuğun ve hedeflerin tek bir yerde.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
            <CheckCircle size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{completedCount}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tamamlanan Görev</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={20} className="text-indigo-500" />
            <span className="text-sm font-bold text-slate-500">Son 7 Günlük Aktivite</span>
          </div>
          <div className="flex items-end gap-2 h-12 w-full">
            {activityData.map((d, i) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div
                  className="w-full bg-indigo-500/20 dark:bg-indigo-400/20 rounded-t-sm hover:bg-indigo-500 transition-colors"
                  style={{ height: `${(d.count / maxCount) * 100}%` }}
                ></div>
                <div className="absolute -bottom-6 text-[10px] text-slate-400 opacity-0 group-hover:opacity-100">
                  {d.date.slice(5)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          onClick={onNavigateDaily}
          className="cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-md text-white flex items-center justify-between group hover:shadow-lg transition-all"
        >
          <div>
            <h3 className="text-xl font-bold mb-1">Bugünü Planla</h3>
            <p className="text-indigo-100 text-sm">Rastgele 5 görev seç</p>
          </div>
          <div className="p-3 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
            <Sun size={24} />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Ders İlerlemeleri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const progress = getCourseProgress(course, completedTasks);
            const next = getNextTask(course, completedTasks);
            const isComplete = progress === 100;
            const daysLeft = getDaysLeft(course);
            const isUrgent = daysLeft !== null && daysLeft <= 3 && daysLeft >= 0;

            return (
              <div
                key={course.id}
                onClick={() => onNavigateCourse(course.id)}
                className={`bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-sm border ${
                  isUrgent ? 'border-red-400 dark:border-red-600 animate-pulse' : 'border-slate-100 dark:border-slate-700'
                } hover:shadow-md transition-all cursor-pointer group flex flex-col h-full relative`}
              >
                {daysLeft !== null && daysLeft >= 0 && (
                  <div
                    className={`absolute top-2 left-2 z-20 px-2 py-1 rounded text-xs font-bold shadow-sm ${
                      isUrgent ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-700'
                    }`}
                  >
                    {daysLeft === 0 ? 'SINAV BUGÜN' : `${daysLeft} gün kaldı`}
                  </div>
                )}

                <div className={`h-24 ${course.bgGradient} relative p-4`}>
                  <div className="absolute bottom-0 left-0 w-full h-full bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  <span className="absolute top-4 right-4 bg-black/20 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
                    {course.code}
                  </span>
                  <h3 className="text-white font-bold text-lg mt-8 shadow-black drop-shadow-md">{course.title}</h3>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">İlerleme</span>
                    <span className={`text-lg font-bold ${isComplete ? 'text-green-500' : 'text-slate-800 dark:text-white'}`}>
                      %{progress}
                    </span>
                  </div>
                  <ProgressBar
                    percentage={progress}
                    colorClass={isComplete ? 'bg-green-500' : course.color.split(' ')[0]}
                  />

                  {next ? (
                    <div className="mt-6 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700/50 mt-auto">
                      <p className="text-xs text-slate-400 uppercase font-bold mb-1">Sıradaki Görev</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{next.task.text}</p>
                    </div>
                  ) : (
                    <div className="mt-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30 mt-auto flex items-center gap-2">
                      <Trophy size={16} className="text-green-500" />
                      <p className="text-sm font-bold text-green-600 dark:text-green-400">Tamamlandı!</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
