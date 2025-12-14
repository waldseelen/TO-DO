import { useCallback, useMemo } from 'react';

import { INITIAL_COMPLETED_TASK_IDS } from '@/data/initialData';
import { CompletionHistory } from '@/types';

import { useLocalStorage } from './useLocalStorage';

// Maximum number of undo actions to keep
const MAX_HISTORY_LENGTH = 15;

export const useTaskManager = () => {
    const [completedTaskIds, setCompletedTaskIds] = useLocalStorage<string[]>(
        'planner_completed',
        INITIAL_COMPLETED_TASK_IDS
    );
    const [completionHistory, setCompletionHistory] = useLocalStorage<CompletionHistory>(
        'planner_history',
        {}
    );
    // Persist undo history in localStorage with strict limit
    const [history, setHistory] = useLocalStorage<string[][]>(
        'planner_undo_history',
        []
    );

    const completedTasks = useMemo(() => new Set(completedTaskIds), [completedTaskIds]);

    const toggleTask = useCallback(
        (taskId: string) => {
            setCompletedTaskIds(prev => {
                const snapshot = [...prev];
                setHistory(historyPrev => {
                    const nextHistory = [...historyPrev, snapshot];
                    // Enforce strict limit to prevent localStorage quota issues
                    if (nextHistory.length > MAX_HISTORY_LENGTH) {
                        return nextHistory.slice(-MAX_HISTORY_LENGTH);
                    }
                    return nextHistory;
                });

                if (snapshot.includes(taskId)) {
                    setCompletionHistory(prevHistory => {
                        const { [taskId]: _removed, ...rest } = prevHistory;
                        return rest;
                    });
                    return snapshot.filter(id => id !== taskId);
                }

                setCompletionHistory(prevHistory => ({
                    ...prevHistory,
                    [taskId]: new Date().toISOString()
                }));

                return [...snapshot, taskId];
            });
        },
        [setCompletedTaskIds, setCompletionHistory, setHistory]
    );

    const undo = useCallback(() => {
        setHistory(prev => {
            if (prev.length === 0) {
                return prev;
            }
            const previousSnapshot = prev[prev.length - 1];
            setCompletedTaskIds(previousSnapshot);
            setCompletionHistory(currentHistory => {
                const nextHistory: CompletionHistory = {};
                previousSnapshot.forEach(id => {
                    if (currentHistory[id]) {
                        nextHistory[id] = currentHistory[id];
                    }
                });
                return nextHistory;
            });
            return prev.slice(0, -1);
        });
    }, [setCompletedTaskIds, setCompletionHistory, setHistory]);

    const hydrateTasks = useCallback(
        (taskIds: string[], history: CompletionHistory) => {
            setCompletedTaskIds(taskIds);
            setCompletionHistory(history);
            // Clear undo history on hydration to prevent conflicts
            setHistory([]);
        },
        [setCompletedTaskIds, setCompletionHistory, setHistory]
    );

    return {
        completedTasks,
        completionHistory,
        toggleTask,
        undo,
        hydrateTasks
    };
};
