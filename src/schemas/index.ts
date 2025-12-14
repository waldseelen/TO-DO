import { z } from 'zod';

// Subtask schema
export const SubtaskSchema = z.object({
    id: z.string(),
    text: z.string(),
    completed: z.boolean()
});

// Task schema
export const TaskSchema = z.object({
    id: z.string(),
    text: z.string(),
    title: z.string().optional(),
    status: z.enum(['todo', 'in-progress', 'review', 'done']).optional(),
    initialChecked: z.boolean().optional(),
    dueDate: z.string().optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional(),
    subtasks: z.array(SubtaskSchema).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    pomodoros: z.number().optional(),
    completedPomodoros: z.number().optional(),
    isPriority: z.boolean().optional(),
    hasPDF: z.boolean().optional(),
    pdfData: z.string().optional(),
    isFavorite: z.boolean().optional()
});

// Unit schema
export const UnitSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    tasks: z.array(TaskSchema)
});

// Exam schema
export const ExamSchema = z.object({
    id: z.string(),
    title: z.string(),
    date: z.string(),
    time: z.string().optional()
});

// Lecture Note schema
export const LectureNoteSchema = z.object({
    id: z.string(),
    name: z.string(),
    fileName: z.string(),
    fileData: z.string(),
    uploadDate: z.string(),
    unitTitle: z.string().optional()
});

// Course schema
export const CourseSchema = z.object({
    id: z.string(),
    code: z.string(),
    title: z.string(),
    color: z.string(),
    customColor: z.string().optional(),
    bgGradient: z.string(),
    units: z.array(UnitSchema),
    examDate: z.string().optional(),
    exams: z.array(ExamSchema),
    lectureNotes: z.array(LectureNoteSchema).optional()
});

// Array of courses schema
export const CoursesArraySchema = z.array(CourseSchema);

// Completed task IDs schema
export const CompletedTaskIdsSchema = z.array(z.string());

// Completion history schema (Record<string, string>)
export const CompletionHistorySchema = z.record(z.string(), z.string());

// Undo history schema (string[][])
export const UndoHistorySchema = z.array(z.array(z.string()));

// Pomodoro settings schema
export const PomodoroSettingsSchema = z.object({
    workDuration: z.number().min(1).max(120),
    shortBreakDuration: z.number().min(1).max(60),
    longBreakDuration: z.number().min(1).max(120),
    sessionsBeforeLongBreak: z.number().min(1).max(10)
});

// Type exports for use with schemas
export type TaskSchemaType = z.infer<typeof TaskSchema>;
export type CourseSchemaType = z.infer<typeof CourseSchema>;
export type UnitSchemaType = z.infer<typeof UnitSchema>;
