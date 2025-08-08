import { useEffect, useRef } from 'react';
import { useTimerStore } from '../store/timerStore';
import { useStore } from '../../../store/store'; // Import the main store
import { FocusTask } from '../../../types';

interface UseTimerProps {
    focusTasks: FocusTask[];
    updateFocusTaskPomodoros: (taskId: number, pomodoros: number) => void;
    incrementTotalPomodoros: () => void;
}

export const useTimer = ({
    focusTasks,
    updateFocusTaskPomodoros,
    incrementTotalPomodoros
}: UseTimerProps) => {

    const {
        isTimerActive,
        timer,
        activeTaskId,
        pomodoroDuration,
        setLastCompletedTask,
        setIsTimerActive,
        setActiveTaskId,
        setIsEndModalOpen,
        setTimer
    } = useTimerStore(state => ({
        isTimerActive: state.isTimerActive,
        timer: state.timer,
        activeTaskId: state.activeTaskId,
        pomodoroDuration: state.pomodoroDuration,
        setLastCompletedTask: state.setLastCompletedTask,
        setIsTimerActive: state.setIsTimerActive,
        setActiveTaskId: state.setActiveTaskId,
        setIsEndModalOpen: state.setIsEndModalOpen,
        setTimer: state.setTimer,
    }));

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isTimerActive) {
            intervalRef.current = setInterval(() => {
                setTimer(timer - 1);
                if (timer - 1 <= 0) {
                    // Timer ended, update main store
                    const taskToEnd = focusTasks.find(task => task.id === activeTaskId);
                    setLastCompletedTask(taskToEnd || null);
                    if (activeTaskId !== null) {
                        updateFocusTaskPomodoros(activeTaskId, (taskToEnd?.pomodoros || 0) + 1);
                    }
                    incrementTotalPomodoros();
                    setIsTimerActive(false);
                    setActiveTaskId(null);
                    setIsEndModalOpen(true);
                    setTimer(pomodoroDuration);
                }
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isTimerActive, timer, activeTaskId, pomodoroDuration, focusTasks, setTimer, setIsTimerActive, setActiveTaskId, setIsEndModalOpen, setLastCompletedTask, updateFocusTaskPomodoros, incrementTotalPomodoros]);
};