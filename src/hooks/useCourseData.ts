import { useCallback } from 'react';

import { INITIAL_DATA } from '@/data/initialData';
import { Course, Task, Unit } from '@/types';

import { useLocalStorage } from './useLocalStorage';

export const useCourseData = () => {
  const [courses, setCourses] = useLocalStorage<Course[]>('planner_data_v2', INITIAL_DATA);

  const updateCourse = useCallback(
    (courseId: string, newUnits: Unit[]) => {
      setCourses(prev => prev.map(course => (course.id === courseId ? { ...course, units: newUnits } : course)));
    },
    [setCourses]
  );

  const updateCourseMeta = useCallback(
    (courseId: string, meta: Partial<Course>) => {
      setCourses(prev => prev.map(course => (course.id === courseId ? { ...course, ...meta } : course)));
    },
    [setCourses]
  );

  const addTaskToCourse = useCallback(
    (courseId: string, text: string) => {
      setCourses(prev =>
        prev.map(course => {
          if (course.id !== courseId) return course;
          if (course.units.length === 0) return course;

          const newUnits = [...course.units];
          const lastUnitIndex = newUnits.length - 1;
          const lastUnit = newUnits[lastUnitIndex];

          const newTask: Task = {
            id: `${courseId}-custom-${Date.now()}`,
            text
          };

          newUnits[lastUnitIndex] = {
            ...lastUnit,
            tasks: [...lastUnit.tasks, newTask]
          };

          return { ...course, units: newUnits };
        })
      );
    },
    [setCourses]
  );

  const createNewCourse = useCallback(() => {
    const newCourse: Course = {
      id: `custom-${Date.now()}`,
      code: 'NEW',
      title: 'Yeni Ders',
      color: 'bg-pink-500',
      bgGradient: 'from-pink-500 to-rose-500',
      exams: [],
      units: [{ title: 'Bölüm 1', tasks: [] }]
    };

    setCourses(prev => [...prev, newCourse]);
    return newCourse;
  }, [setCourses]);

  return {
    courses,
    updateCourse,
    updateCourseMeta,
    addTaskToCourse,
    createNewCourse,
    setCourses
  };
};
