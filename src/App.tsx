import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';

import { Sidebar } from '@/components/features/Layout/Sidebar';
import { Overview } from '@/components/features/Overview/Overview';
import { DailyPlan } from '@/components/features/DailyPlan/DailyPlan';
import { SearchResults } from '@/components/features/Search/SearchResults';
import { CourseDetail } from '@/components/features/CourseDetail/CourseDetail';
import { TaskDetailModal } from '@/components/features/Task/TaskDetailModal';
import { SettingsModal } from '@/components/features/Settings/SettingsModal';
import { HeaderClock } from '@/components/HeaderClock';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { PlannerProvider, usePlannerContext } from '@/context/AppContext';
import { generateDailyMarkdown } from '@/utils/markdown';
import { Task } from '@/types';

const AppContent = () => {
  const {
    courses,
    completedTasks,
    completionHistory,
    createNewCourse,
    setCourses,
    hydrateTasks
  } = usePlannerContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'overview' | 'daily' | string>('overview');
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

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

  const handleNavigate = (view: string) => {
    setActiveView(view);
    setSearchQuery('');
    setMobileMenuOpen(false);
  };

  const handleCreateCourse = () => {
    const nextCourse = createNewCourse();
    handleNavigate(nextCourse.id);
  };

  const handleOpenTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setDetailsModalOpen(true);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setCourses(prevCourses =>
      prevCourses.map(course => ({
        ...course,
        units: course.units.map(unit => ({
          ...unit,
          tasks: unit.tasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
        }))
      }))
    );
  };

  const handleExportData = () => {
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
      
      const event = new CustomEvent('toast', { 
        detail: { message: 'Yedekleme tamamlandı!', type: 'success' } 
      });
      window.dispatchEvent(event);
    } catch (error) {
      const event = new CustomEvent('toast', { 
        detail: { message: 'Yedekleme başarısız oldu', type: 'error' } 
      });
      window.dispatchEvent(event);
    }
  };

  const handleExportToday = async () => {
    try {
      const markdown = generateDailyMarkdown(courses, completedTasks, completionHistory);
      await navigator.clipboard.writeText(markdown);
      
      const event = new CustomEvent('toast', { 
        detail: { message: 'Günlük başarıyla kopyalandı!', type: 'success' } 
      });
      window.dispatchEvent(event);
    } catch (error) {
      const event = new CustomEvent('toast', { 
        detail: { message: 'Kopyalama başarısız oldu', type: 'error' } 
      });
      window.dispatchEvent(event);
    }
  };

  const handleImportData = (event: ChangeEvent<HTMLInputElement>) => {
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
        
        const event = new CustomEvent('toast', { 
          detail: { message: 'Veriler başarıyla içe aktarıldı!', type: 'success' } 
        });
        window.dispatchEvent(event);
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
  };

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

      <HeaderClock />
      <ToastContainer />

      <Sidebar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeView={activeView}
        onNavigate={handleNavigate}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onCreateCourse={handleCreateCourse}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(prev => !prev)}
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
