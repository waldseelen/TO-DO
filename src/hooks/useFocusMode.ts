/**
 * Focus Mode Hook
 * Dikkat dağıtıcı öğeleri gizleyerek odaklanmayı artırır.
 *
 * @author Code Audit - Production Ready
 * @version 1.0.0
 */

import { useCallback, useEffect, useState } from 'react';

interface FocusModeState {
    isActive: boolean;
    startTime: Date | null;
    sessionMinutes: number;
}

export const useFocusMode = () => {
    const [state, setState] = useState<FocusModeState>({
        isActive: false,
        startTime: null,
        sessionMinutes: 0
    });

    // Focus mode'u aktifle/deaktifle
    const toggleFocusMode = useCallback(() => {
        setState(prev => {
            if (prev.isActive) {
                // Deaktifle ve oturum süresini hesapla
                const sessionMinutes = prev.startTime
                    ? Math.round((Date.now() - prev.startTime.getTime()) / 60000)
                    : 0;

                return {
                    isActive: false,
                    startTime: null,
                    sessionMinutes
                };
            } else {
                // Aktifle
                return {
                    isActive: true,
                    startTime: new Date(),
                    sessionMinutes: 0
                };
            }
        });
    }, []);

    // Focus mode aktifken body'ye class ekle
    useEffect(() => {
        if (state.isActive) {
            document.body.classList.add('focus-mode');

            // Browser notification izni iste
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }
        } else {
            document.body.classList.remove('focus-mode');
        }

        return () => {
            document.body.classList.remove('focus-mode');
        };
    }, [state.isActive]);

    // Focus mode süresini hesapla
    const getElapsedMinutes = useCallback(() => {
        if (!state.startTime) return 0;
        return Math.round((Date.now() - state.startTime.getTime()) / 60000);
    }, [state.startTime]);

    return {
        isActive: state.isActive,
        startTime: state.startTime,
        lastSessionMinutes: state.sessionMinutes,
        toggleFocusMode,
        getElapsedMinutes
    };
};
