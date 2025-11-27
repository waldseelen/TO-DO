/**
 * Backup Reminder Hook
 * Son yedeklemeden bu yana geçen süreyi takip eder ve kullanıcıya hatırlatır.
 *
 * @author Code Audit - Production Ready
 * @version 1.0.0
 */

import { useCallback, useEffect, useState } from 'react';

import { STORAGE_KEYS } from '@/constants';

interface BackupState {
    lastBackupDate: Date | null;
    daysSinceBackup: number;
    shouldRemind: boolean;
}

const BACKUP_REMINDER_DAYS = 7; // 7 günde bir hatırlat

const getLastBackupDate = (): Date | null => {
    if (typeof window === 'undefined') return null;

    try {
        const stored = localStorage.getItem(STORAGE_KEYS.LAST_BACKUP);
        if (stored) {
            return new Date(stored);
        }
    } catch (error) {
        console.warn('useBackupReminder: Failed to read last backup date', error);
    }

    return null;
};

const calculateDaysSince = (date: Date | null): number => {
    if (!date) return Infinity;

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const useBackupReminder = () => {
    const [state, setState] = useState<BackupState>(() => {
        const lastBackupDate = getLastBackupDate();
        const daysSinceBackup = calculateDaysSince(lastBackupDate);

        return {
            lastBackupDate,
            daysSinceBackup,
            shouldRemind: daysSinceBackup >= BACKUP_REMINDER_DAYS
        };
    });

    // Yedekleme tarihini kaydet
    const recordBackup = useCallback(() => {
        const now = new Date();

        try {
            localStorage.setItem(STORAGE_KEYS.LAST_BACKUP, now.toISOString());
        } catch (error) {
            console.warn('useBackupReminder: Failed to save backup date', error);
        }

        setState({
            lastBackupDate: now,
            daysSinceBackup: 0,
            shouldRemind: false
        });
    }, []);

    // Hatırlatmayı kapat (erteleme)
    const dismissReminder = useCallback(() => {
        setState(prev => ({
            ...prev,
            shouldRemind: false
        }));
    }, []);

    // Her gün kontrol et (sayfa açıkken)
    useEffect(() => {
        const checkBackupStatus = () => {
            const lastBackupDate = getLastBackupDate();
            const daysSinceBackup = calculateDaysSince(lastBackupDate);

            setState({
                lastBackupDate,
                daysSinceBackup,
                shouldRemind: daysSinceBackup >= BACKUP_REMINDER_DAYS
            });
        };

        // İlk kontrol
        checkBackupStatus();

        // Her saat kontrol et
        const interval = setInterval(checkBackupStatus, 60 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    // Formatlanmış son yedekleme tarihi
    const formattedLastBackup = state.lastBackupDate
        ? state.lastBackupDate.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : 'Hiç yedeklenmedi';

    return {
        lastBackupDate: state.lastBackupDate,
        daysSinceBackup: state.daysSinceBackup,
        shouldRemind: state.shouldRemind,
        formattedLastBackup,
        recordBackup,
        dismissReminder
    };
};
