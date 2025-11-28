import { BarChart3, CheckCircle, GraduationCap, Sparkles, Sun, Trophy } from 'lucide-react';

import { ProgressBar } from '@/components/ui/ProgressBar';
import { StreakBadge } from '@/components/ui/StreakBadge';
import { usePlannerContext } from '@/context/AppContext';
import { useStreak } from '@/hooks/useStreak';
import { getCourseProgress, getNextTask } from '@/utils/course';
import { getDaysLeft } from '@/utils/time';

// Motivation messages
const MOTIVATION_MESSAGES = [
    { threshold: 0, message: "Every great journey starts with a single step! 🚀", subtext: "Complete your first task" },
    { threshold: 10, message: "Great start! Keep going! 💪", subtext: "You're building momentum" },
    { threshold: 25, message: "Quarter way there! Amazing! ⭐", subtext: "Consistency is key" },
    { threshold: 50, message: "Halfway there! Don't give up! 🔥", subtext: "The peak is getting closer" },
    { threshold: 75, message: "Final stretch! 🏃", subtext: "The finish line is in sight" },
    { threshold: 90, message: "Almost done! Final push! 🎯", subtext: "Champions never quit" },
    { threshold: 100, message: "AMAZING! You completed everything! 🏆", subtext: "You're a legend!" },
];

const getMotivationMessage = (progress: number) => {
    for (let i = MOTIVATION_MESSAGES.length - 1; i >= 0; i--) {
        if (progress >= MOTIVATION_MESSAGES[i].threshold) {
            return MOTIVATION_MESSAGES[i];
        }
    }
    return MOTIVATION_MESSAGES[0];
};

interface Props {
    onNavigateCourse: (courseId: string) => void;
    onNavigateDaily: () => void;
}

export const Overview = ({ onNavigateCourse, onNavigateDaily }: Props) => {
    const { courses, completedTasks, completionHistory } = usePlannerContext();
    const completedCount = completedTasks.size;
    const { streak, weeklyCount, hasCompletedToday } = useStreak(completionHistory);

    // Toplam ilerleme hesapla
    const totalProgress = (() => {
        let total = 0;
        let done = 0;
        courses.forEach(course => {
            course.units.forEach(unit => {
                unit.tasks.forEach(task => {
                    total += 1;
                    if (completedTasks.has(task.id)) done += 1;
                });
            });
        });
        return total === 0 ? 0 : Math.round((done / total) * 100);
    })();

    const motivation = getMotivationMessage(totalProgress);

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

    // Yaklaşan sınavları hesapla (sadece gelecekteki)
    const upcomingExams = courses
        .flatMap(course =>
            (course.exams || []).map(exam => ({
                ...exam,
                course,
                daysLeft: Math.ceil((new Date(exam.date).getTime() - new Date().setHours(0, 0, 0, 0)) / (1000 * 3600 * 24))
            }))
        )
        .filter(exam => exam.daysLeft >= 0)
        .sort((a, b) => a.daysLeft - b.daysLeft)
        .slice(0, 5); // İlk 5 sınav

    return (
        <div className="p-6 space-y-8 animate-fade-in pt-16 md:pt-6">
            <header className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Overview</h1>
                        <p className="text-slate-500 dark:text-slate-400">Your academic journey and goals in one place.</p>
                    </div>
                    <StreakBadge streak={streak} weeklyCount={weeklyCount} hasCompletedToday={hasCompletedToday} />
                </div>

                {/* Motivasyon Kartı */}
                <div className="mt-4 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-xl border border-indigo-200/50 dark:border-indigo-500/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                            <Sparkles size={20} className="text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-800 dark:text-white">{motivation.message}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{motivation.subtext}</p>
                        </div>
                        <div className="ml-auto text-3xl font-black text-indigo-500">%{totalProgress}</div>
                    </div>
                </div>
            </header>

            {/* Yaklaşan Sınavlar Uyarısı */}
            {upcomingExams.length > 0 && (
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <GraduationCap size={24} className="text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Upcoming Exams</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                        {upcomingExams.map(exam => (
                            <div
                                key={exam.id}
                                onClick={() => onNavigateCourse(exam.course.id)}
                                className={`bg-white/10 backdrop-blur-sm p-3 rounded-xl cursor-pointer hover:bg-white/20 transition-colors ${exam.daysLeft <= 3 ? 'ring-2 ring-white/50 animate-pulse' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: exam.course.customColor || '#fff' }}
                                    />
                                    <span className="text-white/80 text-xs font-medium truncate">{exam.course.code}</span>
                                </div>
                                <p className="text-white font-bold text-sm truncate">{exam.title}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-white/70 text-xs">
                                        {new Date(exam.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                        {exam.time && ` ${exam.time}`}
                                    </span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${exam.daysLeft === 0
                                        ? 'bg-red-600 text-white'
                                        : exam.daysLeft <= 3
                                            ? 'bg-orange-400 text-white'
                                            : 'bg-white/20 text-white'
                                        }`}>
                                        {exam.daysLeft === 0 ? 'TODAY!' : `${exam.daysLeft} days`}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                        <CheckCircle size={32} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{completedCount}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Completed Tasks</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 size={20} className="text-indigo-500" />
                        <span className="text-sm font-bold text-slate-500">Last 7 Days Activity</span>
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
                        <h3 className="text-xl font-bold mb-1">Plan Today</h3>
                        <p className="text-indigo-100 text-sm">Pick 5 random tasks</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                        <Sun size={24} />
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Course Progress</h2>
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
                                className={`bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-sm border ${isUrgent ? 'border-red-400 dark:border-red-600 animate-pulse' : 'border-slate-100 dark:border-slate-700'
                                    } hover:shadow-md transition-all cursor-pointer group flex flex-col h-full relative`}
                            >
                                {daysLeft !== null && daysLeft >= 0 && (
                                    <div
                                        className={`absolute top-2 left-2 z-20 px-2 py-1 rounded text-xs font-bold shadow-sm ${isUrgent ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-700'
                                            }`}
                                    >
                                        {daysLeft === 0 ? 'EXAM TODAY' : `${daysLeft} days left`}
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
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Progress</span>
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
                                            <p className="text-xs text-slate-400 uppercase font-bold mb-1">Next Task</p>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{next.task.text}</p>
                                        </div>
                                    ) : (
                                        <div className="mt-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30 mt-auto flex items-center gap-2">
                                            <Trophy size={16} className="text-green-500" />
                                            <p className="text-sm font-bold text-green-600 dark:text-green-400">Completed!</p>
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
