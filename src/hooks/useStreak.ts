import { useMemo } from 'react';

import { CompletionHistory } from '@/types';

export const useStreak = (completionHistory: CompletionHistory) => {
    return useMemo(() => {
        const dates = new Set(
            Object.values(completionHistory).map(date => date.split('T')[0])
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let streak = 0;
        let checkDate = new Date(today);

        // Bugün görev tamamlandı mı kontrol et
        const todayStr = today.toISOString().split('T')[0];
        if (!dates.has(todayStr)) {
            // Bugün tamamlanmadıysa dünden başla
            checkDate.setDate(checkDate.getDate() - 1);
        }

        // Geriye doğru ardışık günleri say
        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            if (dates.has(dateStr)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        // Bu hafta tamamlanan görev sayısı
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weeklyCount = Object.values(completionHistory).filter(date => {
            const d = new Date(date);
            return d >= weekStart;
        }).length;

        return { streak, weeklyCount, hasCompletedToday: dates.has(todayStr) };
    }, [completionHistory]);
};
