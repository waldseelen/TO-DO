import { createContext, Dispatch, SetStateAction, useCallback, useContext, useMemo, useState } from 'react';

import { useCompletionSound } from '@/hooks/useCompletionSound';
import { useCourseData } from '@/hooks/useCourseData';
import { useTaskManager } from '@/hooks/useTaskManager';
import { CompletionHistory, Course, Task } from '@/types';

// Separate interfaces for state and dispatch
interface PlannerStateValue {
    courses: Course[];
    completedTasks: Set<string>;
    completionHistory: CompletionHistory;
    soundEnabled: boolean;
    showConfetti: boolean;
}

interface PlannerDispatchValue {
    toggleTask: (taskId: string) => void;
    undo: () => void;
    updateCourse: (courseId: string, units: Course['units']) => void;
    updateCourseMeta: (courseId: string, meta: Partial<Course>) => void;
    updateTaskStatus: (taskId: string, status: 'todo' | 'in-progress' | 'review' | 'done') => void;
    addTaskToCourse: (courseId: string, text: string, options?: { dueDate?: string; isPriority?: boolean; status?: Task['status']; unitId?: string }) => void;
    createNewCourse: () => Course;
    deleteCourse: (courseId: string) => void;
    setCourses: Dispatch<SetStateAction<Course[]>>;
    hydrateTasks: (taskIds: string[], history: CompletionHistory) => void;
    setSoundEnabled: (enabled: boolean) => void;
}

// Combined interface for backwards compatibility
interface PlannerContextValue extends PlannerStateValue, PlannerDispatchValue { }

// Create separate contexts
const PlannerStateContext = createContext<PlannerStateValue | null>(null);
const PlannerDispatchContext = createContext<PlannerDispatchValue | null>(null);
// Keep legacy context for backwards compatibility
const PlannerContext = createContext<PlannerContextValue | null>(null);

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {
        courses,
        updateCourse,
        updateCourseMeta,
        updateTaskStatus,
        addTaskToCourse,
        createNewCourse,
        deleteCourse,
        setCourses
    } = useCourseData();
    const { completedTasks, completionHistory, toggleTask: originalToggleTask, undo, hydrateTasks } = useTaskManager();
    const { soundEnabled, setSoundEnabled, playCompletionSound, playSuccessSound } = useCompletionSound();
    const [showConfetti, setShowConfetti] = useState(false);

    // Play sound when task is completed
    const toggleTask = useCallback((taskId: string) => {
        const wasCompleted = completedTasks.has(taskId);
        originalToggleTask(taskId);

        // Also update status
        if (!wasCompleted) {
            updateTaskStatus(taskId, 'done');
        } else {
            updateTaskStatus(taskId, 'todo');
        }

        if (!wasCompleted) {
            playCompletionSound();

            // Check if course is completed
            setTimeout(() => {
                for (const course of courses) {
                    let allDone = true;
                    for (const unit of course.units) {
                        for (const task of unit.tasks) {
                            const isThisTask = task.id === taskId;
                            const isCompleted = isThisTask ? true : completedTasks.has(task.id);
                            if (!isCompleted) {
                                allDone = false;
                                break;
                            }
                        }
                        if (!allDone) break;
                    }
                    if (allDone && course.units.length > 0) {
                        // Check if this task belongs to this course
                        const taskBelongsToCourse = course.units.some(u => u.tasks.some(t => t.id === taskId));
                        if (taskBelongsToCourse) {
                            playSuccessSound();
                            setShowConfetti(true);
                            setTimeout(() => setShowConfetti(false), 2500);
                            break;
                        }
                    }
                }
            }, 100);
        }
    }, [completedTasks, originalToggleTask, playCompletionSound, playSuccessSound, courses, updateTaskStatus]);

    // Synchronize status update with completedTasks
    const handleUpdateTaskStatus = useCallback((taskId: string, status: Task['status']) => {
        updateTaskStatus(taskId, status);

        const isCompleted = completedTasks.has(taskId);
        if (status === 'done' && !isCompleted) {
            toggleTask(taskId);
        } else if (status !== 'done' && isCompleted) {
            toggleTask(taskId);
        }
    }, [updateTaskStatus, completedTasks, toggleTask]);

    // Memoize state value (changes when state changes)
    const stateValue = useMemo<PlannerStateValue>(
        () => ({
            courses,
            completedTasks,
            completionHistory,
            soundEnabled,
            showConfetti
        }),
        [courses, completedTasks, completionHistory, soundEnabled, showConfetti]
    );

    // Memoize dispatch value (stable reference - rarely changes)
    const dispatchValue = useMemo<PlannerDispatchValue>(
        () => ({
            toggleTask,
            undo,
            updateCourse,
            updateCourseMeta,
            updateTaskStatus: handleUpdateTaskStatus,
            addTaskToCourse,
            createNewCourse,
            deleteCourse,
            setCourses,
            hydrateTasks,
            setSoundEnabled
        }),
        [
            toggleTask,
            undo,
            updateCourse,
            updateCourseMeta,
            handleUpdateTaskStatus,
            addTaskToCourse,
            createNewCourse,
            deleteCourse,
            setCourses,
            hydrateTasks,
            setSoundEnabled
        ]
    );

    // Combined value for legacy hook
    const combinedValue = useMemo<PlannerContextValue>(
        () => ({
            ...stateValue,
            ...dispatchValue
        }),
        [stateValue, dispatchValue]
    );

    return (
        <PlannerStateContext.Provider value={stateValue}>
            <PlannerDispatchContext.Provider value={dispatchValue}>
                <PlannerContext.Provider value={combinedValue}>
                    {children}
                </PlannerContext.Provider>
            </PlannerDispatchContext.Provider>
        </PlannerStateContext.Provider>
    );
};

// Hook for components that only need state (will re-render when state changes)
export const usePlannerState = () => {
    const context = useContext(PlannerStateContext);
    if (!context) {
        throw new Error('usePlannerState must be used within PlannerProvider');
    }
    return context;
};

// Hook for components that only need dispatch functions (stable - won't cause re-renders)
export const usePlannerDispatch = () => {
    const context = useContext(PlannerDispatchContext);
    if (!context) {
        throw new Error('usePlannerDispatch must be used within PlannerProvider');
    }
    return context;
};

// Legacy hook for backwards compatibility (returns everything)
export const usePlannerContext = () => {
    const context = useContext(PlannerContext);
    if (!context) {
        throw new Error('usePlannerContext must be used within PlannerProvider');
    }
    return context;
};
