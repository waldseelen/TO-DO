/**
 * Statistics Component
 * Haftalık ve aylık görev tamamlama istatistiklerini gösterir.
 *
 * @author Code Audit - Production Ready
 * @version 1.0.0
 */

import { Award, Calendar, Flame, TrendingUp, Zap } from 'lucide-react';
import { useMemo } from 'react';

import { usePlannerContext } from '@/context/AppContext';
import { CompletionHistory } from '@/types';

interface StatsData {
    todayCount: number;
    weekCount: number;
    monthCount: number;
    streak: number;
    bestStreak: number;
    averagePerDay: number;
    weeklyData: { date: string; count: number }[];
    monthlyData: { week: string; count: number }[];
}

const calculateStats = (history: CompletionHistory): StatsData => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Tarih bazlı gruplamaları hazırla
    const dateCounts: Record<string, number> = {};

    Object.values(history).forEach(dateStr => {
        const date = dateStr.split('T')[0];
        dateCounts[date] = (dateCounts[date] || 0) + 1;
    });

    // Bugün
    const todayCount = dateCounts[today] || 0;

    // Son 7 gün
    const weekData: { date: string; count: number }[] = [];
    let weekCount = 0;

    for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const count = dateCounts[dateStr] || 0;
        weekCount += count;
        weekData.push({
            date: d.toLocaleDateString('tr-TR', { weekday: 'short' }),
            count
        });
    }

    // Son 30 gün
    let monthCount = 0;
    const monthlyData: { week: string; count: number }[] = [];

    for (let w = 3; w >= 0; w--) {
        let weekTotal = 0;
        for (let d = 0; d < 7; d++) {
            const date = new Date(now);
            date.setDate(date.getDate() - (w * 7 + d));
            const dateStr = date.toISOString().split('T')[0];
            weekTotal += dateCounts[dateStr] || 0;
        }
        monthCount += weekTotal;
        monthlyData.push({
            week: `Hafta ${4 - w}`,
            count: weekTotal
        });
    }

    // Streak hesaplama (ardışık gün sayısı)
    let streak = 0;
    let currentDate = new Date(now);

    while (true) {
        const dateStr = currentDate.toISOString().split('T')[0];
        if (dateCounts[dateStr] && dateCounts[dateStr] > 0) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }

    // En iyi streak (basit hesaplama)
    const sortedDates = Object.keys(dateCounts).sort();
    let bestStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    sortedDates.forEach(dateStr => {
        const current = new Date(dateStr);
        if (prevDate) {
            const diffDays = Math.round((current.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                tempStreak++;
            } else {
                tempStreak = 1;
            }
        } else {
            tempStreak = 1;
        }
        bestStreak = Math.max(bestStreak, tempStreak);
        prevDate = current;
    });

    // Günlük ortalama (son 30 gün)
    const averagePerDay = monthCount / 30;

    return {
        todayCount,
        weekCount,
        monthCount,
        streak,
        bestStreak,
        averagePerDay: Math.round(averagePerDay * 10) / 10,
        weeklyData: weekData,
        monthlyData
    };
};

export const Statistics = () => {
    const { completionHistory, completedTasks, courses } = usePlannerContext();

    const stats = useMemo(() => calculateStats(completionHistory), [completionHistory]);

    // Toplam görev sayısı
    const totalTasks = useMemo(() => {
        return courses.reduce((acc, course) => {
            return acc + course.units.reduce((unitAcc, unit) => unitAcc + unit.tasks.length, 0);
        }, 0);
    }, [courses]);

    const completionRate = totalTasks > 0
        ? Math.round((completedTasks.size / totalTasks) * 100)
        : 0;

    const maxWeekCount = Math.max(...stats.weeklyData.map(d => d.count), 1);

    return (
        <div className="p-6 space-y-6 animate-fade-in pt-16 md:pt-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">📊 İstatistikler</h1>
                <p className="text-slate-500 dark:text-slate-400">Üretkenlik performansın ve ilerleme verilerin</p>
            </header>

            {/* Ana Metrikler */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-dark-surface p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Zap size={20} className="text-green-500" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Bugün</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white">{stats.todayCount}</p>
                    <p className="text-xs text-slate-400 mt-1">görev tamamlandı</p>
                </div>

                <div className="bg-white dark:bg-dark-surface p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Calendar size={20} className="text-blue-500" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Bu Hafta</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white">{stats.weekCount}</p>
                    <p className="text-xs text-slate-400 mt-1">görev tamamlandı</p>
                </div>

                <div className="bg-white dark:bg-dark-surface p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                            <Flame size={20} className="text-orange-500" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Seri</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white">{stats.streak}</p>
                    <p className="text-xs text-slate-400 mt-1">ardışık gün</p>
                </div>

                <div className="bg-white dark:bg-dark-surface p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Award size={20} className="text-purple-500" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">En İyi Seri</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white">{stats.bestStreak}</p>
                    <p className="text-xs text-slate-400 mt-1">gün</p>
                </div>
            </div>

            {/* Haftalık Grafik */}
            <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <TrendingUp size={20} className="text-indigo-500" />
                        Haftalık Aktivite
                    </h3>
                    <span className="text-sm text-slate-400">
                        Günlük Ort: <span className="font-bold text-slate-600 dark:text-slate-300">{stats.averagePerDay}</span>
                    </span>
                </div>

                <div className="flex items-end justify-between gap-2 h-40">
                    {stats.weeklyData.map((day, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full flex flex-col items-center justify-end h-32">
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                                    {day.count > 0 ? day.count : ''}
                                </span>
                                <div
                                    className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg transition-all duration-500 hover:from-indigo-600 hover:to-purple-600"
                                    style={{
                                        height: `${Math.max((day.count / maxWeekCount) * 100, day.count > 0 ? 10 : 0)}%`,
                                        minHeight: day.count > 0 ? '8px' : '0'
                                    }}
                                />
                            </div>
                            <span className="text-xs text-slate-400 font-medium">{day.date}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Genel İlerleme */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
                <h3 className="font-bold text-lg mb-4">🎯 Genel İlerleme</h3>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-indigo-100">Tamamlanan / Toplam</span>
                    <span className="font-bold">{completedTasks.size} / {totalTasks}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-4 mb-2">
                    <div
                        className="bg-white rounded-full h-4 transition-all duration-1000"
                        style={{ width: `${completionRate}%` }}
                    />
                </div>
                <p className="text-right text-xl font-bold">%{completionRate}</p>
            </div>

            {/* Motivasyon Kartı */}
            {stats.streak >= 3 && (
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 rounded-2xl shadow-lg text-white text-center">
                    <div className="text-4xl mb-2">🔥</div>
                    <h3 className="text-xl font-bold mb-1">Harika Gidiyorsun!</h3>
                    <p className="text-amber-100">
                        {stats.streak} günlük serini koruyorsun. Devam et!
                    </p>
                </div>
            )}
        </div>
    );
};
