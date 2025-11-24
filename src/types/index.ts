export type Priority = 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  text: string;
  initialChecked?: boolean;
  dueDate?: string;
  notes?: string;
  tags?: string[];
  subtasks?: Subtask[];
  priority?: Priority;
}

export interface Unit {
  title: string;
  tasks: Task[];
}

export interface Exam {
  id: string;
  title: string;
  date: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  color: string;
  bgGradient: string;
  units: Unit[];
  examDate?: string;
  exams: Exam[];
}

export type CompletionHistory = Record<string, string>;
