import { createContext, useContext, useMemo, Dispatch, SetStateAction, useCallback, useState } from 'react';

import { useCourseData } from '@/hooks/useCourseData';
import { useCompletionSound } from '@/hooks/useCompletionSound';
import { useTaskManager } from '@/hooks/useTaskManager';
import { CompletionHistory, Course } from '@/types';

interface PlannerContextValue {
  courses: Course[];
  completedTasks: Set<string>;
  completionHistory: CompletionHistory;
  toggleTask: (taskId: string) => void;
  undo: () => void;
  updateCourse: (courseId: string, units: Course['units']) => void;
  updateCourseMeta: (courseId: string, meta: Partial<Course>) => void;
  addTaskToCourse: (courseId: string, text: string) => void;
  createNewCourse: () => Course;
  setCourses: Dispatch<SetStateAction<Course[]>>;
  hydrateTasks: (taskIds: string[], history: CompletionHistory) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  showConfetti: boolean;
}

const PlannerContext = createContext<PlannerContextValue | null>(null);

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    courses,
    updateCourse,
    updateCourseMeta,
    addTaskToCourse,
    createNewCourse,
    setCourses
  } = useCourseData();
  const { completedTasks, completionHistory, toggleTask: originalToggleTask, undo, hydrateTasks } = useTaskManager();
  const { soundEnabled, setSoundEnabled, playCompletionSound, playSuccessSound } = useCompletionSound();
  const [showConfetti, setShowConfetti] = useState(false);

  // Görev tamamlandığında ses çal
  const toggleTask = useCallback((taskId: string) => {
    const wasCompleted = completedTasks.has(taskId);
    originalToggleTask(taskId);
    
    if (!wasCompleted) {
      playCompletionSound();
      
      // Ders tamamlandı mı kontrol et
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
  }, [completedTasks, originalToggleTask, playCompletionSound, playSuccessSound, courses]);

  const value = useMemo(
    () => ({
      courses,
      completedTasks,
      completionHistory,
      toggleTask,
      undo,
      updateCourse,
      updateCourseMeta,
      addTaskToCourse,
      createNewCourse,
      setCourses,
      hydrateTasks,
      soundEnabled,
      setSoundEnabled,
      showConfetti
    }),
    [
      courses,
      completedTasks,
      completionHistory,
      toggleTask,
      undo,
      updateCourse,
      updateCourseMeta,
      addTaskToCourse,
      createNewCourse,
      setCourses,
      hydrateTasks,
      soundEnabled,
      setSoundEnabled,
      showConfetti
    ]
  );

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
};

export const usePlannerContext = () => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlannerContext must be used within PlannerProvider');
  }
  return context;
};
