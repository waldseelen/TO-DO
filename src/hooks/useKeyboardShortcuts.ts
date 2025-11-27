/**
 * Enhanced Keyboard Shortcuts Hook
 * Global klavye kısayolları yönetimi
 *
 * @author Code Audit - Production Ready
 * @version 2.0.0
 */

import { useCallback, useEffect, useMemo, useRef } from 'react';

export interface ShortcutConfig {
    /** Tuş (küçük harf) */
    key: string;
    /** Ctrl/Cmd tuşu gerekli mi */
    ctrl?: boolean;
    /** Shift tuşu gerekli mi */
    shift?: boolean;
    /** Alt tuşu gerekli mi */
    alt?: boolean;
    /** Kısayol açıklaması (UI'da göstermek için) */
    description?: string;
    /** Çalıştırılacak fonksiyon */
    callback: () => void;
    /** Input/textarea içindeyken de çalışsın mı */
    allowInInput?: boolean;
}

// Varsayılan global kısayollar
export const DEFAULT_SHORTCUTS = {
    SAVE: { key: 's', ctrl: true, description: 'Kaydet' },
    UNDO: { key: 'z', ctrl: true, description: 'Geri Al' },
    SEARCH: { key: 'k', ctrl: true, description: 'Ara' },
    SETTINGS: { key: ',', ctrl: true, description: 'Ayarlar' },
    TOGGLE_THEME: { key: 'd', ctrl: true, shift: true, description: 'Tema Değiştir' },
    NEW_TASK: { key: 'n', ctrl: true, description: 'Yeni Görev' },
    ESCAPE: { key: 'Escape', description: 'Kapat/İptal' },
} as const;

/**
 * Kısayol tuş kombinasyonunu string'e dönüştürür
 * Örn: { ctrl: true, key: 's' } -> "Ctrl+S"
 */
export const formatShortcut = (shortcut: Omit<ShortcutConfig, 'callback'>): string => {
    const parts: string[] = [];

    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.alt) parts.push('Alt');
    if (shortcut.shift) parts.push('Shift');

    // Özel tuş isimleri
    const keyName = shortcut.key === ' ' ? 'Space' :
        shortcut.key === 'Escape' ? 'Esc' :
            shortcut.key.length === 1 ? shortcut.key.toUpperCase() :
                shortcut.key;

    parts.push(keyName);

    return parts.join('+');
};

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[], enabled = true) => {
    // Ref kullanarak her render'da yeni listener eklemeyi önle
    const shortcutsRef = useRef(shortcuts);
    shortcutsRef.current = shortcuts;

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        // Input/textarea içindeyken varsayılan olarak devre dışı
        const target = event.target as HTMLElement;
        const isInInput = target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable;

        for (const shortcut of shortcutsRef.current) {
            // Input kontrolü
            if (isInInput && !shortcut.allowInInput) {
                // Sadece Escape gibi özel tuşlara izin ver
                if (shortcut.key !== 'Escape') continue;
            }

            const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
            const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
            const altMatch = shortcut.alt ? event.altKey : !event.altKey;
            const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

            // Eğer modifier belirtilmemişse, herhangi bir durumda çalış
            const finalCtrlMatch = shortcut.ctrl === undefined ? true : ctrlMatch;
            const finalShiftMatch = shortcut.shift === undefined ? true : shiftMatch;
            const finalAltMatch = shortcut.alt === undefined ? true : altMatch;

            if (finalCtrlMatch && finalShiftMatch && finalAltMatch && keyMatch) {
                event.preventDefault();
                event.stopPropagation();
                shortcut.callback();
                break; // İlk eşleşen kısayolu çalıştır ve dur
            }
        }
    }, []);

    useEffect(() => {
        if (!enabled) return;

        window.addEventListener('keydown', handleKeyDown, { capture: true });
        return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
    }, [enabled, handleKeyDown]);

    // Kısayolları formatlı olarak döndür (UI'da göstermek için)
    const formattedShortcuts = useMemo(() =>
        shortcuts.map(s => ({
            ...s,
            formatted: formatShortcut(s)
        })),
        [shortcuts]
    );

    return { formattedShortcuts };
};

/**
 * Tek bir kısayol için basitleştirilmiş hook
 */
export const useKeyboardShortcut = (
    config: Omit<ShortcutConfig, 'callback'>,
    callback: () => void,
    enabled = true
) => {
    useKeyboardShortcuts(
        [{ ...config, callback }],
        enabled
    );
};
