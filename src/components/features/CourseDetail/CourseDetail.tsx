import {
    BookOpen,
    Calendar,
    Check,
    CheckCircle,
    ChevronDown,
    Clock as ClockIcon,
    Copy,
    Globe,
    GripVertical,
    Loader2,
    MoreVertical,
    Palette,
    Plus,
    Save,
    Trash2
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Checkmark } from '@/components/ui/Checkmark';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { usePlannerContext } from '@/context/AppContext';
import { Task, Unit } from '@/types';
import { getCourseProgress } from '@/utils/course';
import { generateMarkdown } from '@/utils/markdown';

// Color presets
const COLOR_PRESETS = [
    { name: 'Blue', hex: '#3b82f6', bg: 'bg-blue-500', gradient: 'from-blue-500 to-cyan-400' },
    { name: 'Purple', hex: '#6366f1', bg: 'bg-indigo-500', gradient: 'from-indigo-500 to-purple-500' },
    { name: 'Green', hex: '#10b981', bg: 'bg-emerald-500', gradient: 'from-emerald-500 to-teal-500' },
    { name: 'Orange', hex: '#f97316', bg: 'bg-orange-500', gradient: 'from-orange-500 to-amber-500' },
    { name: 'Red', hex: '#ef4444', bg: 'bg-red-500', gradient: 'from-red-500 to-pink-600' },
    { name: 'Pink', hex: '#ec4899', bg: 'bg-pink-500', gradient: 'from-pink-500 to-rose-500' },
    { name: 'Yellow', hex: '#eab308', bg: 'bg-yellow-500', gradient: 'from-yellow-500 to-amber-400' },
    { name: 'Cyan', hex: '#06b6d4', bg: 'bg-cyan-500', gradient: 'from-cyan-500 to-blue-400' },
    { name: 'Gray', hex: '#475569', bg: 'bg-slate-600', gradient: 'from-slate-600 to-slate-800' },
];

interface Props {
    courseId: string;
    onOpenTaskDetails: (task: Task) => void;
}

export const CourseDetail = ({ courseId, onOpenTaskDetails }: Props) => {
    const {
        courses,
        completedTasks,
        toggleTask,
        updateCourse,
        updateCourseMeta,
        addTaskToCourse
    } = usePlannerContext();
    const course = courses.find(c => c.id === courseId);

    const [openUnits, setOpenUnits] = useState<Set<number>>(new Set([0]));
    const [newTaskText, setNewTaskText] = useState('');
    const [localUnits, setLocalUnits] = useState<Unit[]>(course?.units || []);
    const [dragSource, setDragSource] = useState<{ unitIdx: number; taskIdx: number } | null>(null);
    const [dragTarget, setDragTarget] = useState<{ unitIdx: number; taskIdx: number } | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState('');
    const editInputRef = useRef<HTMLInputElement>(null);
    const [deleteModalData, setDeleteModalData] = useState<{ unitIdx: number; taskIdx: number } | null>(null);
    const [showExamManager, setShowExamManager] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);

    useEffect(() => {
        if (!isDirty && course) {
            setLocalUnits(course.units);
        }
    }, [course, isDirty]);

    useEffect(() => {
        if (editingTaskId && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [editingTaskId]);

    if (!course) {
        return (
            <div className="p-6">
                <p className="text-slate-500">Course not found.</p>
            </div>
        );
    }

    const progress = getCourseProgress(course, completedTasks);

    const toggleUnit = (idx: number) => {
        const next = new Set(openUnits);
        if (next.has(idx)) next.delete(idx);
        else next.add(idx);
        setOpenUnits(next);
    };

    const handleDragStart = (unitIdx: number, taskIdx: number) => {
        setDragSource({ unitIdx, taskIdx });
    };

    const handleDragEnter = (unitIdx: number, taskIdx: number) => {
        if (dragSource && dragSource.unitIdx === unitIdx) {
            setDragTarget({ unitIdx, taskIdx });
        }
    };

    const handleDrop = (targetUnitIdx: number, targetTaskIdx: number) => {
        if (dragSource && dragSource.unitIdx === targetUnitIdx && dragSource.taskIdx !== targetTaskIdx) {
            const newUnits = [...localUnits];
            const tasks = [...newUnits[dragSource.unitIdx].tasks];
            const [movedTask] = tasks.splice(dragSource.taskIdx, 1);
            tasks.splice(targetTaskIdx, 0, movedTask);
            newUnits[dragSource.unitIdx].tasks = tasks;
            setLocalUnits(newUnits);
            setIsDirty(true);
        }
        setDragSource(null);
        setDragTarget(null);
    };

    const handleDragEnd = () => {
        setDragSource(null);
        setDragTarget(null);
    };

    // handleSave'i useCallback ile sarmalayarak bağımlılık sorununu çözüyoruz
    const handleSave = useCallback(() => {
        if (!course) return;
        setIsSaving(true);
        updateCourse(course.id, localUnits);
        setIsDirty(false);
        setTimeout(() => {
            setIsSaving(false);
            const event = new CustomEvent('toast', {
                detail: { message: 'Changes saved', type: 'success' }
            });
            window.dispatchEvent(event);
        }, 800);
    }, [course, localUnits, updateCourse]);

    // Auto-save effect - artık handleSave doğru şekilde bağımlılıklarda
    useEffect(() => {
        const timer = setInterval(() => {
            if (isDirty) {
                handleSave();
            }
        }, 30000);

        return () => clearInterval(timer);
    }, [isDirty, handleSave]);

    const handleAddTask = () => {
        if (!newTaskText.trim()) return;
        addTaskToCourse(course.id, newTaskText);
        setNewTaskText('');
        const next = new Set(openUnits);
        next.add(localUnits.length - 1);
        setOpenUnits(next);
        setIsDirty(false);
    };

    const startEditing = (task: Task) => {
        setEditingTaskId(task.id);
        setEditingText(task.text);
    };

    const saveEditing = (unitIdx: number, taskIdx: number) => {
        if (!editingTaskId) return;
        const newUnits = [...localUnits];
        newUnits[unitIdx].tasks[taskIdx].text = editingText;
        setLocalUnits(newUnits);
        setIsDirty(true);
        setEditingTaskId(null);
    };

    const confirmDelete = () => {
        if (!deleteModalData) return;
        const { unitIdx, taskIdx } = deleteModalData;
        const newUnits = [...localUnits];
        newUnits[unitIdx].tasks.splice(taskIdx, 1);
        setLocalUnits(newUnits);
        setIsDirty(true);
        setDeleteModalData(null);
    };

    const copySyllabus = async () => {
        try {
            const md = generateMarkdown(course, completedTasks);
            await navigator.clipboard.writeText(md);
            const event = new CustomEvent('toast', {
                detail: { message: 'Syllabus copied!', type: 'success' }
            });
            window.dispatchEvent(event);
        } catch (error) {
            const event = new CustomEvent('toast', {
                detail: { message: 'Copy failed', type: 'error' }
            });
            window.dispatchEvent(event);
        }
    };

    // Renk değiştirme fonksiyonu
    const handleColorChange = (preset: typeof COLOR_PRESETS[0]) => {
        updateCourseMeta(course.id, {
            color: preset.bg,
            customColor: preset.hex,
            bgGradient: preset.gradient
        });
        setShowColorPicker(false);
        const event = new CustomEvent('toast', {
            detail: { message: 'Course color updated', type: 'success' }
        });
        window.dispatchEvent(event);
    };

    // Sadece gelecekteki sınavları al (negatif gün gösterme)
    const upcomingExams = (course.exams || []).filter(exam => {
        const examDate = new Date(exam.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return examDate >= today;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const nextExamInfo = (() => {
        if (upcomingExams.length === 0) return null;
        const nextExam = upcomingExams[0];
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const examDate = new Date(nextExam.date);
        const days = Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
        return { days, title: nextExam.title, time: nextExam.time };
    })();

    // Sınavlara kalan gün hesaplama (midterm ve final için)
    const examCountdowns = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        return upcomingExams.map(exam => {
            const examDate = new Date(exam.date);
            const days = Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
            return { ...exam, daysLeft: days };
        });
    }, [upcomingExams]);

    return (
        <div className="animate-fade-in pb-20">
            <ConfirmationModal
                isOpen={!!deleteModalData}
                onClose={() => setDeleteModalData(null)}
                onConfirm={confirmDelete}
                title="Delete Task"
                message="Are you sure you want to delete this task? This action cannot be undone."
            />

            <div className={`relative ${course.bgGradient} p-6 md:p-10 overflow-hidden`}>
                <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full transform translate-x-10 -translate-y-10 blur-3xl"></div>
                <div className="relative z-10 w-full flex flex-col gap-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold mb-3 inline-block shadow-sm">
                                {course.code}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold text-white shadow-black drop-shadow-lg">{course.title}</h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4">                        <div className="flex gap-2 items-center flex-wrap">
                        {/* Save Status */}
                        <div
                            className={`px-3 py-2 rounded-xl text-xs font-bold backdrop-blur-md transition-colors shadow-sm ${isDirty ? 'bg-amber-500/80 text-white' : isSaving ? 'bg-indigo-500/80 text-white' : 'bg-white/20 text-white'
                                }`}
                        >
                            {isSaving ? (
                                <span className="flex items-center gap-1">
                                    <Loader2 size={14} className="animate-spin" /> Saving...
                                </span>
                            ) : isDirty ? (
                                <span className="flex items-center gap-1">Unsaved</span>
                            ) : (
                                <span className="flex items-center gap-1">
                                    <Check size={14} /> Saved
                                </span>
                            )}
                        </div>

                        {/* Syllabus Copy */}
                        <button
                            onClick={copySyllabus}
                            className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 backdrop-blur-md transition-all shadow-sm hover:scale-105"
                        >
                            <Copy size={14} /> Syllabus
                        </button>

                        {/* Color Picker Button */}
                        <div className="relative">
                            <button
                                onClick={() => setShowColorPicker(prev => !prev)}
                                className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 backdrop-blur-md transition-all shadow-sm hover:scale-105"
                                title="Change Course Color"
                            >
                                <Palette size={14} />
                                <div
                                    className="w-3 h-3 rounded-full border border-white/50 shadow-sm"
                                    style={{ backgroundColor: course.customColor || '#3b82f6' }}
                                />
                            </button>

                            {/* Color Palette Dropdown */}
                            {showColorPicker && (
                                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-3 z-50 animate-fade-in min-w-[200px] border border-slate-100 dark:border-slate-700">
                                    <p className="text-xs font-bold text-gray-600 dark:text-gray-300 mb-2">Select Color</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {COLOR_PRESETS.map(preset => (
                                            <button
                                                key={preset.hex}
                                                onClick={() => handleColorChange(preset)}
                                                className={`w-full aspect-square rounded-lg transition-transform hover:scale-110 shadow-sm ${course.customColor === preset.hex ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800' : ''
                                                    }`}
                                                style={{ backgroundColor: preset.hex }}
                                                title={preset.name}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Exam Countdown Buttons - Midterm then Final */}
                        {examCountdowns.slice(0, 2).map(exam => (
                            <div
                                key={exam.id}
                                className={`px-3 py-2 rounded-xl backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-default ${exam.daysLeft <= 3
                                    ? 'bg-red-500/80 animate-pulse'
                                    : exam.daysLeft <= 7
                                        ? 'bg-orange-500/70'
                                        : 'bg-white/20'
                                    }`}
                                title={`${exam.title} - ${new Date(exam.date).toLocaleDateString('en-US')}`}
                            >
                                <ClockIcon size={14} />
                                <span>{exam.title.includes('Vize') || exam.title.includes('Midterm') ? 'Midterm' : exam.title.includes('Final') ? 'Final' : exam.title}</span>
                                <span className="bg-white/20 px-1.5 py-0.5 rounded-md font-black">{exam.daysLeft}d</span>
                            </div>
                        ))}

                        {/* Exam Calendar Button - For detailed list */}
                        {upcomingExams.length > 0 && (
                            <button
                                onClick={() => setShowExamManager(prev => !prev)}
                                className="bg-white/10 backdrop-blur-md hover:bg-white/20 px-3 py-2 rounded-xl border border-white/20 flex items-center gap-2 text-white transition-all hover:scale-105"
                                title="Exam Details"
                            >
                                <Calendar size={14} />
                                <ChevronDown size={14} className={`transition-transform ${showExamManager ? 'rotate-180' : ''}`} />
                            </button>
                        )}
                    </div>

                        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg">
                            <div className="text-right">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Progress</p>
                                <p className="text-xl font-bold text-slate-800 dark:text-white">%{progress}</p>
                            </div>
                            <CircularProgress percentage={progress} colorClass={course.color.split(' ')[0].replace('bg-', 'text-')} size={40} />
                        </div>
                    </div>

                    {/* Sınav Listesi - Sadece Görüntüleme */}
                    {showExamManager && upcomingExams.length > 0 && (
                        <div className="bg-white dark:bg-dark-surface rounded-xl p-4 shadow-xl border border-slate-100 dark:border-slate-700 animate-fade-in mt-2">
                            <h3 className="text-sm font-bold text-slate-700 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center gap-2">
                                <Calendar size={14} /> Upcoming Exams
                            </h3>
                            <div className="space-y-2">
                                {upcomingExams.map(exam => {
                                    const examDate = new Date(exam.date);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const daysLeft = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

                                    return (
                                        <div
                                            key={exam.id}
                                            className={`flex items-center justify-between p-3 rounded-lg ${daysLeft <= 3
                                                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                                                : daysLeft <= 7
                                                    ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
                                                    : 'bg-slate-50 dark:bg-slate-800'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: course.customColor || '#3b82f6' }}
                                                />
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 dark:text-white">{exam.title}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {examDate.toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            day: 'numeric',
                                                            month: 'long'
                                                        })}
                                                        {exam.time && ` • ${exam.time}`}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`text-right ${daysLeft <= 3
                                                ? 'text-red-600 dark:text-red-400'
                                                : daysLeft <= 7
                                                    ? 'text-orange-600 dark:text-orange-400'
                                                    : 'text-slate-600 dark:text-slate-400'
                                                }`}>
                                                <span className="text-lg font-bold">{daysLeft}</span>
                                                <span className="text-xs block">days</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 max-w-4xl mx-auto space-y-4 -mt-6 relative z-20">
                {localUnits.map((unit, unitIdx) => {
                    const unitCompleted = unit.tasks.filter(t => completedTasks.has(t.id)).length;
                    const isAllDone = unitCompleted === unit.tasks.length && unit.tasks.length > 0;
                    const isOpen = openUnits.has(unitIdx);

                    return (
                        <div
                            key={unitIdx}
                            className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-all hover:shadow-md"
                        >
                            <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors" onClick={() => toggleUnit(unitIdx)}>
                                <div className="flex items-center gap-3 flex-1">
                                    <div className={`p-2 rounded-lg ${isAllDone ? 'bg-green-100 text-green-600 dark:bg-green-900/20' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
                                        }`}>
                                        {isAllDone ? <CheckCircle size={20} /> : <BookOpen size={20} />}
                                    </div>
                                    <h3 className={`font-medium select-none ${isAllDone ? 'text-slate-500 line-through' : 'text-slate-800 dark:text-slate-200'
                                        }`}>
                                        {unit.title}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-4 pl-4">
                                    <span className="text-xs text-slate-400 font-medium">
                                        {unitCompleted} / {unit.tasks.length}
                                    </span>
                                    <span className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                        ▼
                                    </span>
                                </div>
                            </div>

                            <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                <div className="overflow-hidden">
                                    <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-black/20">
                                        {unit.tasks.map((task, taskIdx) => (
                                            <div
                                                key={task.id}
                                                draggable={editingTaskId !== task.id}
                                                onDragStart={() => handleDragStart(unitIdx, taskIdx)}
                                                onDragEnter={() => handleDragEnter(unitIdx, taskIdx)}
                                                onDragOver={event => event.preventDefault()}
                                                onDrop={event => {
                                                    event.preventDefault();
                                                    handleDrop(unitIdx, taskIdx);
                                                }}
                                                onDragEnd={handleDragEnd}
                                                className={`flex items-center gap-3 p-4 pl-6 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group relative ${dragTarget?.taskIdx === taskIdx && dragTarget.unitIdx === unitIdx ? 'border-t-2 border-t-indigo-500' : ''
                                                    } ${dragSource?.taskIdx === taskIdx && dragSource.unitIdx === unitIdx ? 'opacity-50 bg-slate-100 dark:bg-slate-800' : ''}`}
                                            >
                                                <div className="text-slate-300 dark:text-slate-600 cursor-grab hover:text-slate-500 active:cursor-grabbing">
                                                    <GripVertical size={16} />
                                                </div>
                                                <div onClick={() => toggleTask(task.id)} className="cursor-pointer shrink-0">
                                                    <Checkmark checked={completedTasks.has(task.id)} />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    {editingTaskId === task.id ? (
                                                        <input
                                                            ref={editInputRef}
                                                            type="text"
                                                            value={editingText}
                                                            onChange={e => setEditingText(e.target.value)}
                                                            onBlur={() => saveEditing(unitIdx, taskIdx)}
                                                            onKeyDown={e => e.key === 'Enter' && saveEditing(unitIdx, taskIdx)}
                                                            className="w-full px-2 py-1 bg-white dark:bg-slate-700 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <p
                                                                    onClick={() => startEditing(task)}
                                                                    className={`text-sm cursor-text truncate transition-all relative ${completedTasks.has(task.id)
                                                                        ? 'text-slate-400'
                                                                        : 'text-slate-700 dark:text-slate-300'
                                                                        }`}
                                                                >
                                                                    {task.text}
                                                                    <span
                                                                        className={`absolute left-0 top-1/2 h-0.5 bg-slate-400 dark:bg-slate-500 transition-all duration-500 ease-in-out ${completedTasks.has(task.id) ? 'w-full opacity-100' : 'w-0 opacity-0'
                                                                            }`}
                                                                    ></span>
                                                                </p>
                                                                <button
                                                                    onClick={e => {
                                                                        e.stopPropagation();
                                                                        window.open(
                                                                            `https://www.google.com/search?q=${encodeURIComponent(task.text)}`,
                                                                            '_blank'
                                                                        );
                                                                    }}
                                                                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-blue-500 transition-all"
                                                                    title="Quick Search on Google"
                                                                >
                                                                    <Globe size={12} />
                                                                </button>
                                                                {task.dueDate && (
                                                                    <span className={`text-[10px] flex items-center gap-1 px-1.5 py-0.5 rounded ${new Date(task.dueDate) < new Date()
                                                                        ? 'bg-red-100 text-red-500'
                                                                        : 'bg-slate-100 text-slate-500'
                                                                        }`}>
                                                                        <Calendar size={10} /> {new Date(task.dueDate).toLocaleDateString()}
                                                                    </span>
                                                                )}
                                                                {task.tags?.map(tag => (
                                                                    <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-500 rounded hidden md:inline-block">
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            {task.subtasks && task.subtasks.length > 0 && (
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                                                                        <div
                                                                            className="h-full bg-green-400"
                                                                            style={{
                                                                                width: `${(task.subtasks.filter(sub => sub.completed).length / task.subtasks.length) * 100}%`
                                                                            }}
                                                                        ></div>
                                                                    </div>
                                                                    <span className="text-[10px] text-slate-400">
                                                                        {task.subtasks.filter(sub => sub.completed).length}/{task.subtasks.length}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => onOpenTaskDetails(task)}
                                                        className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                                                        title="Details & Notes"
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteModalData({ unitIdx, taskIdx })}
                                                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                        title="Delete Task"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {unit.tasks.length === 0 && (
                                            <p className="p-4 text-center text-sm text-slate-400 italic">No tasks in this unit yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div className="bg-white dark:bg-dark-surface p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 mt-6">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Add New Task (to Last Unit)</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTaskText}
                            onChange={e => setNewTaskText(e.target.value)}
                            placeholder="Task description..."
                            className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                        />
                        <button
                            onClick={handleAddTask}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                            <Plus size={18} />
                            Add
                        </button>
                    </div>
                </div>
            </div>

            {isDirty && (
                <div className="fixed bottom-20 md:bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 hover:scale-105 transition-all font-bold disabled:opacity-70 disabled:scale-100"
                    >
                        {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            )}
        </div>
    );
};
