import { createContext, useContext, useMemo, Dispatch, SetStateAction } from 'react';

import { useCourseData } from '@/hooks/useCourseData';
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
  const { completedTasks, completionHistory, toggleTask, undo, hydrateTasks } = useTaskManager();

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
      hydrateTasks
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
      hydrateTasks
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
