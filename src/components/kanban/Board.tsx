import { Course, Task } from '@/types';
import {
    defaultDropAnimationSideEffects,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    DropAnimation,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import {
    Filter,
    Plus
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Virtuoso } from 'react-virtuoso';

import { TaskCard } from './TaskCard';

// Column configuration
const COLUMNS = [
    { id: 'todo', title: 'To Do', dotColor: 'bg-purple-500' },
    { id: 'in-progress', title: 'In Progress', dotColor: 'bg-blue-500' },
    { id: 'review', title: 'Review', dotColor: 'bg-amber-500' },
    { id: 'done', title: 'Done', dotColor: 'bg-emerald-500' },
];

interface KanbanBoardProps {
    courses: Course[];
    onTaskUpdate: (taskId: string, newStatus: Task['status']) => void;
    onOpenTask: (task: Task) => void;
    hideFilter?: boolean;
    onAddTask?: (status: Task['status']) => void;
}

// Virtualization threshold - use virtualization for lists larger than this
const VIRTUALIZATION_THRESHOLD = 15;

// Column Component with optional virtualization
const Column = ({
    column,
    tasks,
    onOpenTask,
    onAddTask
}: {
    column: typeof COLUMNS[0];
    tasks: any[];
    onOpenTask: (task: Task) => void;
    onAddTask?: (status: Task['status']) => void;
}) => {
    const { setNodeRef } = useSortable({
        id: column.id,
        data: { type: 'Column', id: column.id },
        disabled: true,
    });

    const taskIds = useMemo(() => tasks.map(t => t.id), [tasks]);
    const useVirtualization = tasks.length > VIRTUALIZATION_THRESHOLD;

    // Render a single task item (used by both virtualized and non-virtualized lists)
    const renderTaskItem = useCallback((index: number) => {
        const task = tasks[index];
        return (
            <div key={task.id} className="pb-2">
                <TaskCard
                    task={task}
                    onOpenDetails={onOpenTask}
                    courseName={task['courseCode'] || task['displayLabel']}
                    courseColor={task['courseColor']}
                />
            </div>
        );
    }, [tasks, onOpenTask]);

    return (
        <div ref={setNodeRef} className="flex flex-col min-w-[260px] max-h-[calc(100vh-280px)]">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`} />
                    <h3 className="font-semibold text-sm text-white">{column.title}</h3>
                    <span className="text-xs text-slate-400 bg-[#2a2438] px-2 py-0.5 rounded-full">
                        {tasks.length}
                    </span>
                </div>
                <button
                    onClick={() => onAddTask && onAddTask(column.id as Task['status'])}
                    className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded"
                >
                    <Plus size={14} />
                </button>
            </div>

            {/* Tasks - Virtualized or Regular */}
            <SortableContext items={taskIds}>
                {useVirtualization ? (
                    // Virtualized list for large task counts
                    <Virtuoso
                        className="flex-1 overflow-y-auto custom-scrollbar pr-1"
                        totalCount={tasks.length}
                        itemContent={renderTaskItem}
                        overscan={5}
                        style={{ height: 'calc(100vh - 340px)' }}
                    />
                ) : (
                    // Regular list for smaller task counts (preserves dnd-kit full compatibility)
                    <div className="flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1">
                        {tasks.map((task, index) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onOpenDetails={onOpenTask}
                                courseName={task['courseCode'] || task['displayLabel']}
                                courseColor={task['courseColor']}
                            />
                        ))}
                    </div>
                )}
            </SortableContext>

            {tasks.length === 0 && (
                <div className="h-16 border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center text-slate-500 text-xs">
                    Drop tasks here
                </div>
            )}
        </div>
    );
};

// Main Board Component
export const KanbanBoard = ({ courses, onTaskUpdate, onOpenTask, hideFilter = false, onAddTask }: KanbanBoardProps) => {
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

    const allTasks = useMemo(() => {
        let tasks: any[] = [];
        courses.forEach(c => {
            c.units.forEach(u => {
                u.tasks.forEach(t => {
                    tasks.push({
                        ...t,
                        courseId: c.id,
                        courseCode: c.code,
                        courseColor: c.customColor ? '' : c.color.split(' ')[0],
                        courseCustomColor: c.customColor,
                        displayLabel: hideFilter ? u.title : c.code // Show Unit title in single course view
                    });
                });
            });
        });
        return tasks;
    }, [courses, hideFilter]);

    const filteredTasks = useMemo(() => {
        if (!selectedCourse) return allTasks;
        return allTasks.filter(t => t.courseId === selectedCourse);
    }, [allTasks, selectedCourse]);

    const tasksByStatus = useMemo(() => {
        const groups: Record<string, any[]> = {
            'todo': [],
            'in-progress': [],
            'review': [],
            'done': []
        };

        filteredTasks.forEach(task => {
            const status = task.status || 'todo';
            if (groups[status]) {
                groups[status].push(task);
            } else {
                groups['todo'].push(task);
            }
        });

        return groups;
    }, [filteredTasks]);

    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
        useSensor(TouchSensor)
    );

    const onDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === 'Task') {
            setActiveTask(event.active.data.current.task);
        }
    };

    const onDragEnd = (event: DragEndEvent) => {
        setActiveTask(null);
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const columnIds = COLUMNS.map(c => c.id);
        let newStatus: Task['status'] | undefined;

        if (columnIds.includes(overId)) {
            newStatus = overId as Task['status'];
        } else {
            const overTask = filteredTasks.find(t => t.id === overId);
            if (overTask) {
                newStatus = overTask.status || 'todo';
            }
        }

        if (newStatus && activeTask && activeTask.status !== newStatus) {
            onTaskUpdate(activeId, newStatus);
        }
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: '0.5' } },
        }),
    };

    return (
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
            {/* Course Filter */}
            {!hideFilter && (
                <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Filter size={16} />
                        <span className="text-sm font-medium">Filter:</span>
                    </div>
                    <button
                        onClick={() => setSelectedCourse(null)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${!selectedCourse
                            ? 'bg-purple-500 text-white'
                            : 'bg-[#2a2438] text-slate-300 hover:bg-[#352f42]'
                            }`}
                    >
                        All Courses ({allTasks.length})
                    </button>
                    {courses.map(course => {
                        const count = allTasks.filter(t => t.courseId === course.id).length;
                        return (
                            <button
                                key={course.id}
                                onClick={() => setSelectedCourse(course.id)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${selectedCourse === course.id
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-[#2a2438] text-slate-300 hover:bg-[#352f42]'
                                    }`}
                            >
                                {course.code || course.title} ({count})
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Kanban Columns */}
            <div className="grid grid-cols-4 gap-4 h-full">
                {COLUMNS.map(column => (
                    <Column
                        key={column.id}
                        column={column}
                        tasks={tasksByStatus[column.id]}
                        onOpenTask={onOpenTask}
                        onAddTask={onAddTask}
                    />
                ))}
            </div>

            {createPortal(
                <DragOverlay dropAnimation={dropAnimation}>
                    {activeTask && (
                        <TaskCard
                            task={activeTask}
                            courseName={(activeTask as any).courseCode || (activeTask as any).displayLabel}
                            courseColor={(activeTask as any).courseColor}
                            isOverlay={true}
                        />
                    )}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
};
