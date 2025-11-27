import {
    BarChart3,
    Calendar,
    LayoutDashboard,
    Moon,
    Plus,
    Search,
    Settings as SettingsIcon,
    Sun as SunIcon,
    X
} from 'lucide-react';

import { AmbientSoundPlayer } from '@/components/features/Productivity/AmbientSoundPlayer';
import { PomodoroTimer } from '@/components/features/Productivity/PomodoroTimer';
import { usePlannerContext } from '@/context/AppContext';
import { getCourseProgress } from '@/utils/course';

interface SidebarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    activeView: string;
    onNavigate: (view: string) => void;
    onOpenSettings: () => void;
    onCreateCourse: () => void;
    darkMode: boolean;
    toggleDarkMode: () => void;
    totalProgress: number;
    isOpen: boolean;
}

export const Sidebar = ({
    searchQuery,
    onSearchChange,
    activeView,
    onNavigate,
    onOpenSettings,
    onCreateCourse,
    darkMode,
    toggleDarkMode,
    totalProgress,
    isOpen
}: SidebarProps) => {
    const { courses, completedTasks } = usePlannerContext();
    const regularCourses = courses.filter(course => course.id !== 'personal');
    const personalCourses = courses.filter(course => course.id === 'personal');

    const handleNavigate = (view: string) => {
        onNavigate(view);
    };

    return (
        <aside
            className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-50 w-72 h-full bg-white dark:bg-dark-surface border-r border-slate-200 dark:border-slate-700 transition-transform duration-300 flex flex-col`}
        >
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center mb-1">
                    <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Gelişim Asistanı</h1>
                    <button onClick={onOpenSettings} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <SettingsIcon size={18} />
                    </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Öğrenci Planlayıcı v2.1</p>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Görev veya etiket ara..."
                        value={searchQuery}
                        onChange={event => onSearchChange(event.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                <div className="space-y-3">
                    <PomodoroTimer onOpenSettings={onOpenSettings} />
                    <AmbientSoundPlayer />
                </div>

                <div>
                    <button
                        onClick={() => handleNavigate('overview')}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeView === 'overview'
                            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        <LayoutDashboard size={20} />
                        Genel Bakış
                    </button>
                    <button
                        onClick={() => handleNavigate('daily')}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl mt-1 transition-colors ${activeView === 'daily'
                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        <SunIcon size={20} />
                        Günün Odak Planı
                    </button>
                    <button
                        onClick={() => handleNavigate('statistics')}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl mt-1 transition-colors ${activeView === 'statistics'
                            ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        <BarChart3 size={20} />
                        İstatistikler
                    </button>
                    <button
                        onClick={() => handleNavigate('calendar')}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl mt-1 transition-colors ${activeView === 'calendar'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        <Calendar size={20} />
                        Aylık Takvim
                    </button>
                </div>

                <div>
                    <div className="flex items-center justify-between px-3 mb-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dersler</h3>
                        <button onClick={onCreateCourse} className="text-indigo-500 hover:text-indigo-700 text-xs flex items-center gap-1">
                            <Plus size={12} /> Yeni
                        </button>
                    </div>
                    <div className="space-y-1">
                        {regularCourses.map(course => {
                            const progress = getCourseProgress(course, completedTasks);
                            return (
                                <button
                                    key={course.id}
                                    onClick={() => handleNavigate(course.id)}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors group ${activeView === course.id
                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${course.color}`}></div>
                                        <span className="truncate max-w-[120px]">{course.title}</span>
                                    </div>
                                    <span className="text-xs text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">{progress}%</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Kişisel & Hedefler</h3>
                    {personalCourses.map(course => {
                        const progress = getCourseProgress(course, completedTasks);
                        return (
                            <button
                                key={course.id}
                                onClick={() => handleNavigate(course.id)}
                                className={`w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors ${activeView === course.id
                                    ? 'bg-slate-800 text-white dark:bg-white dark:text-black'
                                    : 'text-slate-700 dark:text-slate-200 hover:border-slate-400'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                    <span>{course.title}</span>
                                </div>
                                <span className="text-xs opacity-70">{progress}%</span>
                            </button>
                        );
                    })}
                </div>
            </nav>

            <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        {darkMode ? <SunIcon size={20} /> : <Moon size={20} />}
                    </button>
                    <div className="text-xs text-slate-400">%{totalProgress} Tamamlandı</div>
                </div>
            </div>
        </aside>
    );
};
