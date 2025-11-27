/**
 * Quick Add Task Component
 * Global görev ekleme kısayolu (Ctrl+N ile açılır)
 *
 * @author Code Audit - Production Ready
 * @version 1.0.0
 */

import { ChevronDown, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { usePlannerContext } from '@/context/AppContext';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const QuickAddTask = ({ isOpen, onClose }: Props) => {
    const { courses, addTaskToCourse } = usePlannerContext();
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [taskText, setTaskText] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Modal açıldığında input'a focus
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            // İlk dersi seç
            if (!selectedCourseId && courses.length > 0) {
                setSelectedCourseId(courses[0].id);
            }
        }
    }, [isOpen, courses, selectedCourseId]);

    // Escape tuşu ile kapat
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const handleSubmit = () => {
        if (!taskText.trim() || !selectedCourseId) return;

        addTaskToCourse(selectedCourseId, taskText.trim());

        // Toast göster
        const event = new CustomEvent('toast', {
            detail: { message: 'Görev eklendi!', type: 'success' }
        });
        window.dispatchEvent(event);

        // Formu temizle ve kapat
        setTaskText('');
        onClose();
    };

    const selectedCourse = courses.find(c => c.id === selectedCourseId);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-dark-surface w-full max-w-lg mx-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <h3 className="font-bold flex items-center gap-2">
                        <Plus size={20} />
                        Hızlı Görev Ekle
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Course Selector */}
                    <div className="relative">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Ders Seç
                        </label>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-left flex items-center justify-between"
                        >
                            {selectedCourse ? (
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${selectedCourse.color}`}></div>
                                    <span className="text-slate-700 dark:text-white">{selectedCourse.title}</span>
                                </div>
                            ) : (
                                <span className="text-slate-400">Ders seçin...</span>
                            )}
                            <ChevronDown size={16} className={`text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                                {courses.map(course => (
                                    <button
                                        key={course.id}
                                        onClick={() => {
                                            setSelectedCourseId(course.id);
                                            setShowDropdown(false);
                                        }}
                                        className="w-full p-3 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                                    >
                                        <div className={`w-3 h-3 rounded-full ${course.color}`}></div>
                                        <span className="text-slate-700 dark:text-white">{course.title}</span>
                                        <span className="text-xs text-slate-400 ml-auto">{course.code}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Task Input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Görev
                        </label>
                        <input
                            ref={inputRef}
                            type="text"
                            value={taskText}
                            onChange={e => setTaskText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                            placeholder="Görev açıklaması..."
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={!taskText.trim() || !selectedCourseId}
                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        Ekle
                    </button>

                    {/* Shortcut hint */}
                    <p className="text-center text-xs text-slate-400">
                        <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">Enter</kbd>
                        {' '}ile ekle • {' '}
                        <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">Esc</kbd>
                        {' '}ile kapat
                    </p>
                </div>
            </div>
        </div>
    );
};
