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
    time?: string; // Saat bilgisi (HH:mm formatında)
}

export interface LectureNote {
    id: string;
    name: string;
    fileName: string;
    fileData: string; // Base64 encoded PDF
    uploadDate: string;
    unitTitle?: string; // Hangi unitten olduğu
}

export interface Course {
    id: string;
    code: string;
    title: string;
    color: string;
    customColor?: string; // Kullanıcının seçtiği hex renk
    bgGradient: string;
    units: Unit[];
    examDate?: string;
    exams: Exam[];
    lectureNotes?: LectureNote[];
}

export interface PomodoroSettings {
    workDuration: number; // dakika
    shortBreakDuration: number; // dakika
    longBreakDuration: number; // dakika
    sessionsBeforeLongBreak: number; // kaç pomodoro sonra uzun mola
}

export type CompletionHistory = Record<string, string>;
