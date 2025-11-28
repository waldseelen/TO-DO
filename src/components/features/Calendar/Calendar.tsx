import { AlertTriangle, Calendar as CalendarIcon, CheckCircle2, ChevronLeft, ChevronRight, Circle, GraduationCap } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

import { usePlannerContext } from '@/context/AppContext';
import { Course, Exam, Task } from '@/types';

interface CalendarProps {
    onSelectCourse?: (courseId: string) => void;
}

interface DayTasks {
    completed: Array<{ task: Task; course: Course }>;
    pending: Array<{ task: Task; course: Course }>;
    total: number;
}

interface DayExam {
    exam: Exam;
    course: Course;
}

const DAYS_TR = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const MONTHS_TR = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export const Calendar: React.FC<CalendarProps> = ({ onSelectCourse }) => {
    const { courses, completedTasks, completionHistory } = usePlannerContext();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Ayın ilk ve son günlerini hesapla
    const { firstDayOfMonth, daysInMonth, year, month } = useMemo(() => {
        const y = currentDate.getFullYear();
        const m = currentDate.getMonth();
        const first = new Date(y, m, 1);
        const days = new Date(y, m + 1, 0).getDate();
        // Pazartesi'den başla (0 = Pzt, 6 = Paz)
        let firstDay = first.getDay() - 1;
        if (firstDay < 0) firstDay = 6;
        return { firstDayOfMonth: firstDay, daysInMonth: days, year: y, month: m };
    }, [currentDate]);

    // Tüm görevleri tarihe göre grupla
    const tasksByDate = useMemo(() => {
        const map: Record<string, DayTasks> = {};

        courses.forEach(course => {
            course.units.forEach(unit => {
                unit.tasks.forEach(task => {
                    // Due date'e göre grupla
                    if (task.dueDate) {
                        const dateKey = task.dueDate;
                        if (!map[dateKey]) {
                            map[dateKey] = { completed: [], pending: [], total: 0 };
                        }
                        const isCompleted = completedTasks.has(task.id);
                        if (isCompleted) {
                            map[dateKey].completed.push({ task, course });
                        } else {
                            map[dateKey].pending.push({ task, course });
                        }
                        map[dateKey].total++;
                    }
                });
            });
        });

        // Tamamlanma geçmişinden de ekle (due date olmayan ama tamamlanan görevler)
        Object.entries(completionHistory).forEach(([taskId, dateStr]) => {
            // Görevin zaten due date ile eklenip eklenmediğini kontrol et
            let alreadyAdded = false;
            courses.forEach(course => {
                course.units.forEach(unit => {
                    unit.tasks.forEach(task => {
                        if (task.id === taskId && task.dueDate) {
                            alreadyAdded = true;
                        }
                    });
                });
            });

            if (!alreadyAdded) {
                // Tarihi YYYY-MM-DD formatına çevir
                const d = new Date(dateStr as string);
                const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

                // Görevi bul
                courses.forEach(course => {
                    course.units.forEach(unit => {
                        unit.tasks.forEach(task => {
                            if (task.id === taskId) {
                                if (!map[dateKey]) {
                                    map[dateKey] = { completed: [], pending: [], total: 0 };
                                }
                                map[dateKey].completed.push({ task, course });
                                map[dateKey].total++;
                            }
                        });
                    });
                });
            }
        });

        return map;
    }, [courses, completedTasks, completionHistory]);

    // Sınavları tarihe göre grupla
    const examsByDate = useMemo(() => {
        const map: Record<string, DayExam[]> = {};

        courses.forEach(course => {
            (course.exams || []).forEach(exam => {
                const dateKey = exam.date;
                if (!map[dateKey]) {
                    map[dateKey] = [];
                }
                map[dateKey].push({ exam, course });
            });
        });

        return map;
    }, [courses]);

    // Takvim günlerini oluştur
    const calendarDays = useMemo(() => {
        const days: Array<{ day: number | null; dateKey: string | null; isToday: boolean; isPast: boolean }> = [];
        const today = new Date();
        const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        // Önceki aydan boş günler
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({ day: null, dateKey: null, isToday: false, isPast: false });
        }

        // Ayın günleri
        for (let d = 1; d <= daysInMonth; d++) {
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dayDate = new Date(year, month, d);
            days.push({
                day: d,
                dateKey,
                isToday: dateKey === todayKey,
                isPast: dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())
            });
        }

        return days;
    }, [firstDayOfMonth, daysInMonth, year, month]);

    // Ay değiştir
    const changeMonth = useCallback((delta: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
        setSelectedDate(null);
    }, []);

    // Bugüne git
    const goToToday = useCallback(() => {
        setCurrentDate(new Date());
        setSelectedDate(null);
    }, []);

    // Seçili günün görevleri
    const selectedDayTasks = selectedDate ? tasksByDate[selectedDate] : null;
    const selectedDayExams = selectedDate ? examsByDate[selectedDate] : null;

    // Aylık istatistikler
    const monthlyStats = useMemo(() => {
        let completed = 0;
        let pending = 0;

        calendarDays.forEach(({ dateKey }) => {
            if (dateKey && tasksByDate[dateKey]) {
                completed += tasksByDate[dateKey].completed.length;
                pending += tasksByDate[dateKey].pending.length;
            }
        });

        return { completed, pending, total: completed + pending };
    }, [calendarDays, tasksByDate]);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Başlık */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <CalendarIcon className="w-7 h-7 text-blue-500" />
                    Aylık Takvim
                </h1>
                <button
                    onClick={goToToday}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Bugün
                </button>
            </div>

            {/* Aylık İstatistikler */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">{monthlyStats.completed}</div>
                    <div className="text-sm text-green-700 dark:text-green-300">Tamamlanan</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{monthlyStats.pending}</div>
                    <div className="text-sm text-orange-700 dark:text-orange-300">Bekleyen</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{monthlyStats.total}</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">Toplam</div>
                </div>
            </div>

            {/* Yaklaşan Sınavlar */}
            {(() => {
                const today = new Date();
                const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                const upcomingExams: Array<{ exam: Exam; course: Course; date: string }> = [];

                const sortedDates = Object.keys(examsByDate)
                    .filter(date => date >= todayKey)
                    .sort((a, b) => a.localeCompare(b))
                    .slice(0, 5);

                sortedDates.forEach(date => {
                    const exams = examsByDate[date];
                    if (exams) {
                        exams.forEach(e => upcomingExams.push({ ...e, date }));
                    }
                });

                if (upcomingExams.length === 0) return null;

                return (
                    <div className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                        <h3 className="text-sm font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                            <AlertTriangle size={16} />
                            Yaklaşan Sınavlar
                        </h3>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {upcomingExams.map(({ exam, course, date }) => {
                                const examDate = new Date(date + 'T00:00:00');
                                const daysLeft = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                                return (
                                    <div
                                        key={exam.id}
                                        onClick={() => onSelectCourse?.(course.id)}
                                        className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg cursor-pointer hover:shadow-md transition-all border-l-4"
                                        style={{ borderLeftColor: course.customColor || '#ef4444' }}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                {course.code} - {exam.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {examDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                                {exam.time && ` • ${exam.time}`}
                                            </p>
                                        </div>
                                        <div className={`text-xs font-bold px-2 py-1 rounded-full ${daysLeft <= 3 ? 'bg-red-500 text-white' :
                                                daysLeft <= 7 ? 'bg-orange-500 text-white' :
                                                    'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                            }`}>
                                            {daysLeft}g
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })()}

            {/* Ay Navigasyonu */}
            <div className="flex items-center justify-between mb-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <button
                    onClick={() => changeMonth(-1)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {MONTHS_TR[month]} {year}
                </h2>
                <button
                    onClick={() => changeMonth(1)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
            </div>

            {/* Takvim Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                {/* Gün başlıkları */}
                <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
                    {DAYS_TR.map(day => (
                        <div
                            key={day}
                            className="py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Takvim günleri */}
                <div className="grid grid-cols-7">
                    {calendarDays.map((dayInfo, index) => {
                        const { day, dateKey, isToday, isPast } = dayInfo;
                        const dayTasks = dateKey ? tasksByDate[dateKey] : null;
                        const dayExams = dateKey ? examsByDate[dateKey] : null;
                        const hasCompleted = dayTasks && dayTasks.completed.length > 0;
                        const hasPending = dayTasks && dayTasks.pending.length > 0;
                        const hasExam = dayExams && dayExams.length > 0;
                        const isSelected = dateKey === selectedDate;

                        return (
                            <button
                                key={index}
                                onClick={() => dateKey && setSelectedDate(isSelected ? null : dateKey)}
                                disabled={!day}
                                className={`
                  relative min-h-[80px] p-2 border-b border-r border-gray-100 dark:border-gray-700
                  transition-all duration-200
                  ${!day ? 'bg-gray-50 dark:bg-gray-900/50 cursor-default' : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer'}
                  ${isToday ? 'bg-blue-50 dark:bg-blue-900/30' : ''}
                  ${isSelected ? 'ring-2 ring-blue-500 ring-inset bg-blue-100 dark:bg-blue-900/50' : ''}
                  ${hasExam && !isPast ? 'bg-red-50 dark:bg-red-900/20' : ''}
                  ${isPast && !isToday ? 'opacity-60' : ''}
                `}
                            >
                                {day && (
                                    <>
                                        <span
                                            className={`
                        text-sm font-medium
                        ${isToday ? 'bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center' : ''}
                        ${!isToday && isPast ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}
                      `}
                                        >
                                            {day}
                                        </span>

                                        {/* Sınav göstergeleri - ders renginde ve belirgin */}
                                        {hasExam && (
                                            <div className="absolute top-1 right-1 flex flex-col gap-0.5">
                                                {dayExams.map(({ exam, course }) => (
                                                    <div
                                                        key={exam.id}
                                                        className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-white text-[9px] font-bold shadow-sm"
                                                        style={{ backgroundColor: course.customColor || '#ef4444' }}
                                                        title={`${course.title}: ${exam.title}`}
                                                    >
                                                        <GraduationCap size={10} />
                                                        <span className="hidden sm:inline">{course.code}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Görev göstergeleri */}
                                        {dayTasks && dayTasks.total > 0 && (
                                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                                {hasCompleted && (
                                                    <div className="flex items-center gap-0.5">
                                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                                        <span className="text-xs text-green-600 dark:text-green-400">
                                                            {dayTasks.completed.length}
                                                        </span>
                                                    </div>
                                                )}
                                                {hasPending && (
                                                    <div className="flex items-center gap-0.5">
                                                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                                                        <span className="text-xs text-orange-600 dark:text-orange-400">
                                                            {dayTasks.pending.length}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Seçili Günün Görevleri ve Sınavları */}
            {selectedDate && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {new Date(selectedDate + 'T00:00:00').toLocaleDateString('tr-TR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </h3>

                    {/* Sınavlar */}
                    {selectedDayExams && selectedDayExams.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                                <GraduationCap size={16} /> Sınavlar
                            </h4>
                            <div className="space-y-2">
                                {selectedDayExams.map(({ exam, course }) => (
                                    <div
                                        key={exam.id}
                                        onClick={() => onSelectCourse?.(course.id)}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-200 dark:border-red-800"
                                    >
                                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                {exam.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {course.title} {exam.time && `• ${exam.time}`}
                                            </p>
                                        </div>
                                        <div
                                            className="w-4 h-4 rounded-full flex-shrink-0 ring-2 ring-white dark:ring-gray-800"
                                            style={{ backgroundColor: course.customColor || '#ef4444' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedDayTasks && selectedDayTasks.total > 0 ? (
                        <div className="space-y-3">
                            {/* Tamamlanan görevler */}
                            {selectedDayTasks.completed.map(({ task, course }) => (
                                <div
                                    key={task.id}
                                    onClick={() => onSelectCourse?.(course.id)}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white line-through">
                                            {task.text}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {course.title}
                                        </p>
                                    </div>
                                    <div
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: course.customColor || '#3b82f6' }}
                                    />
                                </div>
                            ))}

                            {/* Bekleyen görevler */}
                            {selectedDayTasks.pending.map(({ task, course }) => (
                                <div
                                    key={task.id}
                                    onClick={() => onSelectCourse?.(course.id)}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                                >
                                    <Circle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {task.text}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {course.title}
                                        </p>
                                    </div>
                                    <div
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: course.customColor || '#3b82f6' }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : !selectedDayExams?.length && (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                            Bu tarihte etkinlik bulunmuyor
                        </p>
                    )}
                </div>
            )}

            {/* Renk Açıklaması */}
            <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Tamamlanan</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span>Bekleyen</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>Sınav</span>
                </div>
            </div>

            {/* Ders Renkleri Legend */}
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Ders Renkleri</h4>
                <div className="flex flex-wrap gap-3">
                    {courses.filter(c => c.exams && c.exams.length > 0).map(course => (
                        <div
                            key={course.id}
                            onClick={() => onSelectCourse?.(course.id)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <div
                                className="w-3 h-3 rounded-full ring-1 ring-gray-200 dark:ring-gray-600"
                                style={{ backgroundColor: course.customColor || '#3b82f6' }}
                            />
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                {course.code}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
