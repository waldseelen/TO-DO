import { Bot, Globe, GripVertical, MoreVertical, Trash2, Youtube } from 'lucide-react';
import React, { memo, useEffect, useRef } from 'react';

import { Checkmark } from '@/components/ui/Checkmark';
import { Task } from '@/types';

interface TaskItemProps {
    task: Task;
    unitIdx: number;
    taskIdx: number;
    isCompleted: boolean;
    isEditing: boolean;
    editingText: string;
    isDragSource: boolean;
    isDragTarget: boolean;
    onToggleTask: (taskId: string) => void;
    onStartEditing: (task: Task) => void;
    onEditingTextChange: (text: string) => void;
    onSaveEditing: (unitIdx: number, taskIdx: number) => void;
    onOpenDetails: (task: Task) => void;
    onDelete: (unitIdx: number, taskIdx: number) => void;
    onDragStart: (unitIdx: number, taskIdx: number) => void;
    onDragEnter: (unitIdx: number, taskIdx: number) => void;
    onDrop: (unitIdx: number, taskIdx: number) => void;
    onDragEnd: () => void;
}

// Custom comparison function to prevent unnecessary re-renders
const arePropsEqual = (prevProps: TaskItemProps, nextProps: TaskItemProps): boolean => {
    // Only re-render if these specific props change
    return (
        prevProps.task.id === nextProps.task.id &&
        prevProps.task.text === nextProps.task.text &&
        prevProps.task.status === nextProps.task.status &&
        prevProps.isCompleted === nextProps.isCompleted &&
        prevProps.isEditing === nextProps.isEditing &&
        prevProps.editingText === nextProps.editingText &&
        prevProps.isDragSource === nextProps.isDragSource &&
        prevProps.isDragTarget === nextProps.isDragTarget &&
        prevProps.unitIdx === nextProps.unitIdx &&
        prevProps.taskIdx === nextProps.taskIdx &&
        // Compare subtasks if they exist
        JSON.stringify(prevProps.task.subtasks) === JSON.stringify(nextProps.task.subtasks) &&
        JSON.stringify(prevProps.task.tags) === JSON.stringify(nextProps.task.tags)
    );
};

export const TaskItem = memo(function TaskItem({
    task,
    unitIdx,
    taskIdx,
    isCompleted,
    isEditing,
    editingText,
    isDragSource,
    isDragTarget,
    onToggleTask,
    onStartEditing,
    onEditingTextChange,
    onSaveEditing,
    onOpenDetails,
    onDelete,
    onDragStart,
    onDragEnter,
    onDrop,
    onDragEnd
}: TaskItemProps) {
    const editInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [isEditing]);

    const handleDragStart = () => onDragStart(unitIdx, taskIdx);
    const handleDragEnter = () => onDragEnter(unitIdx, taskIdx);
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        onDrop(unitIdx, taskIdx);
    };

    return (
        <div
            draggable={!isEditing}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={onDragEnd}
            className={`flex items-center gap-3 p-4 pl-6 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group relative ${isDragTarget ? 'border-t-2 border-t-indigo-500' : ''
                } ${isDragSource ? 'opacity-50 bg-slate-100 dark:bg-slate-800' : ''}`}
        >
            <div className="text-slate-300 dark:text-slate-600 cursor-grab hover:text-slate-500 active:cursor-grabbing">
                <GripVertical size={16} />
            </div>
            <button
                onClick={() => onToggleTask(task.id)}
                className="cursor-pointer shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2"
                aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
            >
                <Checkmark checked={isCompleted} />
            </button>

            <div className="flex-1 min-w-0">
                {isEditing ? (
                    <input
                        ref={editInputRef}
                        type="text"
                        value={editingText}
                        onChange={e => onEditingTextChange(e.target.value)}
                        onBlur={() => onSaveEditing(unitIdx, taskIdx)}
                        onKeyDown={e => e.key === 'Enter' && onSaveEditing(unitIdx, taskIdx)}
                        className="w-full px-2 py-1 bg-white dark:bg-slate-700 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                ) : (
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <p
                                onClick={() => onStartEditing(task)}
                                className={`text-sm cursor-text truncate transition-all relative ${isCompleted
                                        ? 'text-slate-400'
                                        : 'text-slate-700 dark:text-slate-300'
                                    }`}
                            >
                                {task.text}
                                <span
                                    className={`absolute left-0 top-1/2 h-0.5 bg-slate-400 dark:bg-slate-500 transition-all duration-500 ease-in-out ${isCompleted ? 'w-full opacity-100' : 'w-0 opacity-0'
                                        }`}
                                ></span>
                            </p>
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    window.open(
                                        `https://www.google.com/search?q=${encodeURIComponent(task.text)}`,
                                        '_blank'
                                    );
                                }}
                                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-3 md:p-1 text-slate-300 hover:text-blue-500 transition-all"
                                title="Quick Search on Google"
                                aria-label={`Search on Google for ${task.text}`}
                            >
                                <Globe size={16} />
                            </button>
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    window.open(
                                        `https://www.youtube.com/results?search_query=${encodeURIComponent(task.text)}`,
                                        '_blank'
                                    );
                                }}
                                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-3 md:p-1 text-slate-300 hover:text-red-500 transition-all"
                                title="Quick Search on YouTube"
                                aria-label={`Search on YouTube for ${task.text}`}
                            >
                                <Youtube size={16} />
                            </button>
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    window.open(
                                        `https://chatgpt.com/?q=${encodeURIComponent(task.text)}`,
                                        '_blank'
                                    );
                                }}
                                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-3 md:p-1 text-slate-300 hover:text-emerald-500 transition-all"
                                title="Ask ChatGPT"
                                aria-label={`Ask ChatGPT about ${task.text}`}
                            >
                                <Bot size={16} />
                            </button>
                            {task.tags?.map(tag => (
                                <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-500 rounded hidden md:inline-block">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        {task.subtasks && task.subtasks.length > 0 && (
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-400"
                                        style={{
                                            width: `${(task.subtasks.filter(sub => sub.completed).length / task.subtasks.length) * 100}%`
                                        }}
                                    ></div>
                                </div>
                                <span className="text-[10px] text-slate-400">
                                    {task.subtasks.filter(sub => sub.completed).length}/{task.subtasks.length}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onOpenDetails(task)}
                    className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                    title="Details & Notes"
                >
                    <MoreVertical size={16} />
                </button>
                <button
                    onClick={() => onDelete(unitIdx, taskIdx)}
                    className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    title="Delete Task"
                    aria-label="Delete Task"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}, arePropsEqual);
