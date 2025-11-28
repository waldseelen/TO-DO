import { Flame, Zap } from 'lucide-react';

interface StreakBadgeProps {
    streak: number;
    weeklyCount: number;
    hasCompletedToday: boolean;
}

export const StreakBadge = ({ streak, weeklyCount, hasCompletedToday }: StreakBadgeProps) => {
    if (streak === 0 && weeklyCount === 0) return null;

    return (
        <div className="flex items-center gap-3">
            {/* Streak Badge */}
            {streak > 0 && (
                <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${streak >= 7
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                        : streak >= 3
                            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                >
                    <Flame
                        size={16}
                        className={streak >= 7 ? 'animate-pulse' : ''}
                    />
                    <span>{streak} day streak</span>
                </div>
            )}

            {/* Weekly Progress */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                <Zap size={14} />
                <span>This week: {weeklyCount}</span>
            </div>

            {/* Today indicator */}
            {hasCompletedToday && (
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="You completed a task today!" />
            )}
        </div>
    );
};
