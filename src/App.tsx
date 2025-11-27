import { Menu, X } from 'lucide-react';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';

import { Calendar } from '@/components/features/Calendar/Calendar';
import { CourseDetail } from '@/components/features/CourseDetail/CourseDetail';
import { DailyPlan } from '@/components/features/DailyPlan/DailyPlan';
import { Sidebar } from '@/components/features/Layout/Sidebar';
import { Overview } from '@/components/features/Overview/Overview';
import { QuickAddTask } from '@/components/features/QuickAdd/QuickAddTask';
import { SearchResults } from '@/components/features/Search/SearchResults';
import { SettingsModal } from '@/components/features/Settings/SettingsModal';
import { Statistics } from '@/components/features/Statistics/Statistics';
import { TaskDetailModal } from '@/components/features/Task/TaskDetailModal';
import { HeaderClock } from '@/components/HeaderClock';
import { BackupReminderBanner } from '@/components/ui/BackupReminderBanner';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { PlannerProvider, usePlannerContext } from '@/context/AppContext';
import { useBackupReminder } from '@/hooks/useBackupReminder';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useTheme } from '@/hooks/useTheme';
import { Task } from '@/types';
import { generateDailyMarkdown } from '@/utils/markdown';

const AppContent = () => {
    const {
        courses,
        completedTasks,
        completionHistory,
        createNewCourse,
        setCourses,
        hydrateTasks,
        undo
    } = usePlannerContext();

    // Tema yönetimi (artık localStorage'da saklanıyor)
    const { isDark, toggleDarkMode, mode: themeMode } = useTheme();

    // Yedekleme hatırlatıcısı
    const {
        shouldRemind: showBackupReminder,
        daysSinceBackup,
        formattedLastBackup,
        recordBackup,
        dismissReminder
    } = useBackupReminder();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeView, setActiveView] = useState<'overview' | 'daily' | 'statistics' | 'calendar' | string>('overview');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

    // Toplam ilerleme hesaplama
    const totalProgress = useMemo(() => {
        let total = 0;
        let done = 0;
        courses.forEach(course => {
            course.units.forEach(unit => {
                unit.tasks.forEach(task => {
                    total += 1;
                    if (completedTasks.has(task.id)) {
                        done += 1;
                    }
                });
            });
        });
        return total === 0 ? 0 : Math.round((done / total) * 100);
    }, [courses, completedTasks]);

    // Navigation handlers
    const handleNavigate = useCallback((view: string) => {
        setActiveView(view);
        setSearchQuery('');
        setMobileMenuOpen(false);
    }, []);

    const handleCreateCourse = useCallback(() => {
        const nextCourse = createNewCourse();
        handleNavigate(nextCourse.id);
    }, [createNewCourse, handleNavigate]);

    const handleOpenTaskDetails = useCallback((task: Task) => {
        setSelectedTask(task);
        setDetailsModalOpen(true);
    }, []);

    const handleTaskUpdate = useCallback((updatedTask: Task) => {
        setCourses(prevCourses =>
            prevCourses.map(course => ({
                ...course,
                units: course.units.map(unit => ({
                    ...unit,
                    tasks: unit.tasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
                }))
            }))
        );
    }, [setCourses]);

    // Export/Import handlers
    const handleExportData = useCallback(() => {
        try {
            const payload = {
                courses,
                completedTasks: Array.from(completedTasks),
                completionHistory,
                exportDate: new Date().toISOString(),
                version: '2.0'
            };
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = `planner-backup-${new Date().toISOString().slice(0, 10)}.json`;
            anchor.click();
            URL.revokeObjectURL(url);

            // Yedekleme tarihini kaydet
            recordBackup();

            const event = new CustomEvent('toast', {
                detail: { message: 'Yedekleme tamamlandı!', type: 'success' }
            });
            window.dispatchEvent(event);
        } catch (error) {
            console.error('Export error:', error);
            const event = new CustomEvent('toast', {
                detail: { message: 'Yedekleme başarısız oldu', type: 'error' }
            });
            window.dispatchEvent(event);
        }
    }, [courses, completedTasks, completionHistory, recordBackup]);

    const handleExportToday = useCallback(async () => {
        try {
            const markdown = generateDailyMarkdown(courses, completedTasks, completionHistory);
            await navigator.clipboard.writeText(markdown);

            const event = new CustomEvent('toast', {
                detail: { message: 'Günlük başarıyla kopyalandı!', type: 'success' }
            });
            window.dispatchEvent(event);
        } catch (error) {
            console.error('Export today error:', error);
            const event = new CustomEvent('toast', {
                detail: { message: 'Kopyalama başarısız oldu', type: 'error' }
            });
            window.dispatchEvent(event);
        }
    }, [courses, completedTasks, completionHistory]);

    const handleImportData = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            try {
                const data = JSON.parse(e.target?.result as string);

                if (!data.courses || !Array.isArray(data.courses)) {
                    throw new Error('Invalid data format');
                }

                setCourses(data.courses);

                if (data.completedTasks || data.completionHistory) {
                    hydrateTasks(data.completedTasks ?? [], data.completionHistory ?? {});
                }

                const toastEvent = new CustomEvent('toast', {
                    detail: { message: 'Veriler başarıyla içe aktarıldı!', type: 'success' }
                });
                window.dispatchEvent(toastEvent);
                setIsSettingsOpen(false);
            } catch (error) {
                console.error('Import error:', error);
                const toastEvent = new CustomEvent('toast', {
                    detail: { message: 'Dosya formatı hatalı!', type: 'error' }
                });
                window.dispatchEvent(toastEvent);
            }
        };

        reader.readAsText(file);
    }, [setCourses, hydrateTasks]);

    // Klavye kısayolları
    useKeyboardShortcuts([
        {
            key: 's',
            ctrl: true,
            description: 'Yedekle',
            callback: handleExportData
        },
        {
            key: 'z',
            ctrl: true,
            description: 'Geri Al',
            callback: undo
        },
        {
            key: 'k',
            ctrl: true,
            description: 'Arama',
            callback: () => document.querySelector<HTMLInputElement>('input[placeholder*="ara"]')?.focus()
        },
        {
            key: ',',
            ctrl: true,
            description: 'Ayarlar',
            callback: () => setIsSettingsOpen(true)
        },
        {
            key: 'd',
            ctrl: true,
            shift: true,
            description: 'Tema Değiştir',
            callback: toggleDarkMode
        },
        {
            key: 'n',
            ctrl: true,
            description: 'Yeni Görev',
            callback: () => setIsQuickAddOpen(true)
        },
        {
            key: 'Escape',
            description: 'Kapat',
            callback: () => {
                if (isQuickAddOpen) {
                    setIsQuickAddOpen(false);
                } else if (detailsModalOpen) {
                    setDetailsModalOpen(false);
                    setSelectedTask(null);
                } else if (isSettingsOpen) {
                    setIsSettingsOpen(false);
                } else if (mobileMenuOpen) {
                    setMobileMenuOpen(false);
                }
            },
            allowInInput: true
        }
    ]);

    const currentCourse = courses.find(course => course.id === activeView);

    const renderContent = () => {
        if (searchQuery) {
            return <SearchResults query={searchQuery} />;
        }

        if (activeView === 'overview') {
            return (
                <Overview
                    onNavigateCourse={courseId => handleNavigate(courseId)}
                    onNavigateDaily={() => handleNavigate('daily')}
                />
            );
        }

        if (activeView === 'daily') {
            return <DailyPlan />;
        }

        if (activeView === 'statistics') {
            return <Statistics />;
        }

        if (activeView === 'calendar') {
            return <Calendar onSelectCourse={handleNavigate} />;
        }

        if (currentCourse) {
            return <CourseDetail courseId={currentCourse.id} onOpenTaskDetails={handleOpenTaskDetails} />;
        }

        return <Overview onNavigateCourse={courseId => handleNavigate(courseId)} onNavigateDaily={() => handleNavigate('daily')} />;
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300 font-inter relative overflow-hidden">
            <TaskDetailModal
                isOpen={detailsModalOpen}
                onClose={() => {
                    setDetailsModalOpen(false);
                    setSelectedTask(null);
                }}
                task={selectedTask}
                onUpdate={handleTaskUpdate}
            />

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onExport={handleExportData}
                onImport={handleImportData}
                onExportToday={handleExportToday}
            />

            {/* Hızlı Görev Ekleme */}
            <QuickAddTask
                isOpen={isQuickAddOpen}
                onClose={() => setIsQuickAddOpen(false)}
            />

            {/* Yedekleme Hatırlatıcısı */}
            {showBackupReminder && (
                <BackupReminderBanner
                    daysSinceBackup={daysSinceBackup}
                    formattedLastBackup={formattedLastBackup}
                    onBackup={handleExportData}
                    onDismiss={dismissReminder}
                />
            )}

            <HeaderClock />
            <ToastContainer />

            <Sidebar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeView={activeView}
                onNavigate={handleNavigate}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onCreateCourse={handleCreateCourse}
                darkMode={isDark}
                toggleDarkMode={toggleDarkMode}
                totalProgress={totalProgress}
                isOpen={mobileMenuOpen}
            />

            <main className="flex-1 overflow-y-auto relative h-full w-full custom-scrollbar">
                <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-dark-surface border-b border-slate-100 dark:border-slate-700 sticky top-0 z-40">
                    <h1 className="font-bold text-indigo-600 dark:text-indigo-400">Gelişim Asistanı</h1>
                    <button
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                        className="p-2 text-slate-600 dark:text-slate-300"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
                <div className="min-h-full pb-20">{renderContent()}</div>
            </main>

            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}
        </div>
    );
};

const App = () => (
    <PlannerProvider>
        <AppContent />
    </PlannerProvider>
);

export default App;
