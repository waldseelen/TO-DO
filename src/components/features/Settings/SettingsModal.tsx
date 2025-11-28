import { Copy, Download, Keyboard, RotateCcw, Settings as SettingsIcon, Timer, Upload, Volume2, VolumeX, X } from 'lucide-react';

import { usePlannerContext } from '@/context/AppContext';
import { usePomodoroSettings } from '@/hooks/usePomodoroSettings';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onExport: () => void;
    onExportToday: () => void;
}

export const SettingsModal = ({ isOpen, onClose, onImport, onExport, onExportToday }: Props) => {
    const { settings, updateSettings, resetSettings, DEFAULT_SETTINGS } = usePomodoroSettings();
    const { soundEnabled, setSoundEnabled } = usePlannerContext();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-xl max-w-md w-full border border-slate-100 dark:border-slate-700 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <SettingsIcon className="text-slate-500" /> Ayarlar
                    </h3>
                    <button onClick={onClose}>
                        <X className="text-slate-400 hover:text-slate-600" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Ses Ayarları */}
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {soundEnabled ? (
                                    <Volume2 size={18} className="text-amber-600 dark:text-amber-400" />
                                ) : (
                                    <VolumeX size={18} className="text-amber-600/50 dark:text-amber-400/50" />
                                )}
                                <div>
                                    <h4 className="font-bold text-amber-700 dark:text-amber-400">Tamamlama Sesi</h4>
                                    <p className="text-xs text-amber-600/70 dark:text-amber-400/70">Görev tamamlandığında ses çal</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${soundEnabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                            >
                                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform shadow-sm ${soundEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Pomodoro Ayarları */}
                    <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-900/50">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                                <Timer size={16} /> Pomodoro Ayarları
                            </h4>
                            <button
                                onClick={resetSettings}
                                className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1"
                                title="Varsayılana Sıfırla"
                            >
                                <RotateCcw size={12} /> Sıfırla
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[10px] text-rose-600/70 dark:text-rose-400/70 font-bold uppercase mb-1">
                                    Çalışma (dk)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="120"
                                    value={settings.workDuration}
                                    onChange={(e) => updateSettings({ workDuration: Math.max(1, parseInt(e.target.value) || DEFAULT_SETTINGS.workDuration) })}
                                    className="w-full p-2 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 rounded-lg text-sm text-center font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-rose-600/70 dark:text-rose-400/70 font-bold uppercase mb-1">
                                    Kısa Mola (dk)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={settings.shortBreakDuration}
                                    onChange={(e) => updateSettings({ shortBreakDuration: Math.max(1, parseInt(e.target.value) || DEFAULT_SETTINGS.shortBreakDuration) })}
                                    className="w-full p-2 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 rounded-lg text-sm text-center font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-rose-600/70 dark:text-rose-400/70 font-bold uppercase mb-1">
                                    Uzun Mola (dk)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={settings.longBreakDuration}
                                    onChange={(e) => updateSettings({ longBreakDuration: Math.max(1, parseInt(e.target.value) || DEFAULT_SETTINGS.longBreakDuration) })}
                                    className="w-full p-2 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 rounded-lg text-sm text-center font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-rose-600/70 dark:text-rose-400/70 font-bold uppercase mb-1">
                                    Uzun Mola Aralığı
                                </label>
                                <input
                                    type="number"
                                    min="2"
                                    max="10"
                                    value={settings.sessionsBeforeLongBreak}
                                    onChange={(e) => updateSettings({ sessionsBeforeLongBreak: Math.max(2, parseInt(e.target.value) || DEFAULT_SETTINGS.sessionsBeforeLongBreak) })}
                                    className="w-full p-2 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 rounded-lg text-sm text-center font-mono"
                                />
                            </div>
                        </div>
                        <p className="text-[10px] text-rose-600/60 dark:text-rose-400/60 mt-2 text-center">
                            Her {settings.sessionsBeforeLongBreak} pomodoro sonunda {settings.longBreakDuration} dk uzun mola
                        </p>
                    </div>

                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                        <h4 className="font-bold text-indigo-700 dark:text-indigo-400 mb-1">Verileri Yedekle</h4>
                        <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 mb-3">Tüm ilerlemeni bir JSON dosyası olarak indir.</p>
                        <button
                            onClick={onExport}
                            className="w-full py-2 bg-indigo-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                            <Download size={16} /> Yedeği İndir
                        </button>
                    </div>

                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                        <h4 className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">Markdown Export</h4>
                        <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mb-3">Bugün tamamlananları Obsidian/Notion için kopyala.</p>
                        <button
                            onClick={onExportToday}
                            className="w-full py-2 bg-emerald-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-emerald-700 transition-colors"
                        >
                            <Copy size={16} /> Panoya Kopyala
                        </button>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Yedeği Yükle</h4>
                        <p className="text-xs text-slate-500 mb-3">Daha önce indirdiğin yedeği geri yükle.</p>
                        <label className="w-full py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg flex items-center justify-center gap-2 text-sm font-medium cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                            <Upload size={16} />
                            Dosya Seç
                            <input type="file" accept=".json" onChange={onImport} className="hidden" />
                        </label>
                    </div>

                    {/* Klavye Kısayolları */}
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-900/50">
                        <h4 className="font-bold text-purple-700 dark:text-purple-400 mb-3 flex items-center gap-2">
                            <Keyboard size={16} /> Klavye Kısayolları
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600 dark:text-slate-400">Kaydet</span>
                                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded text-purple-600 dark:text-purple-400 font-mono">Ctrl+S</kbd>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600 dark:text-slate-400">Geri Al</span>
                                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded text-purple-600 dark:text-purple-400 font-mono">Ctrl+Z</kbd>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600 dark:text-slate-400">Ara</span>
                                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded text-purple-600 dark:text-purple-400 font-mono">Ctrl+K</kbd>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600 dark:text-slate-400">Yeni Görev</span>
                                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded text-purple-600 dark:text-purple-400 font-mono">Ctrl+N</kbd>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600 dark:text-slate-400">Tema</span>
                                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded text-purple-600 dark:text-purple-400 font-mono">Ctrl+Shift+D</kbd>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600 dark:text-slate-400">Ayarlar</span>
                                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded text-purple-600 dark:text-purple-400 font-mono">Ctrl+,</kbd>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
