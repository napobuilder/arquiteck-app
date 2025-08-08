import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FocusTask, PomodoroNote } from '../../../types'; // Adjust path as needed

interface TimerState {
    pomodoroDuration: number;
    activeTaskId: number | null;
    timer: number;
    isTimerActive: boolean;
    isPauseModalOpen: boolean;
    isEndModalOpen: boolean;
    lastCompletedTask: FocusTask | null;
    pomodoroNotes: PomodoroNote[]; // Moved here as it's related to completed pomodoros

    // Actions
    toggleTimer: (taskId: number) => void;
    closePauseModal: () => void;
    closeEndModal: (note?: string) => void;
    setPomodoroDuration: (minutes: number) => void; // New action for clarity
    setLastCompletedTask: (task: FocusTask | null) => void; // New action for clarity
    setIsTimerActive: (isActive: boolean) => void; // New action for clarity
    setIsPauseModalOpen: (isOpen: boolean) => void; // New action for clarity
    setIsEndModalOpen: (isOpen: boolean) => void; // New action for clarity
    setActiveTaskId: (taskId: number | null) => void; // New action for clarity
    setTimer: (time: number) => void; // New action for clarity
}

export const useTimerStore = create<TimerState>()(
    persist(
        (set, get) => ({
            pomodoroDuration: 25 * 60,
            activeTaskId: null,
            timer: 25 * 60,
            isTimerActive: false,
            isPauseModalOpen: false,
            isEndModalOpen: false,
            lastCompletedTask: null,
            pomodoroNotes: [],

            toggleTimer: (taskId) => {
                const { activeTaskId, pomodoroDuration } = get();
                if (activeTaskId === taskId) {
                    set({ isTimerActive: false, isPauseModalOpen: true });
                } else {
                    set({ activeTaskId: taskId, timer: pomodoroDuration, isTimerActive: true });
                }
            },

            

            _endSession: () => {
                // Similar to _tick, this will need to interact with focusTasks in the main store.
                set(state => ({
                    isTimerActive: false,
                    activeTaskId: null,
                    isEndModalOpen: true,
                }));
            },

            closePauseModal: () => set({ isPauseModalOpen: false, isTimerActive: true }),

            closeEndModal: (note) => {
                if (note) {
                    const { lastCompletedTask } = get();
                    const newNote = { id: Date.now(), content: note, timestamp: Date.now(), taskName: lastCompletedTask?.name || 'Sin tarea' };
                    set(state => ({ pomodoroNotes: [newNote, ...state.pomodoroNotes] }));
                }
                set({ isEndModalOpen: false });
            },

            closeCustomTimeModal: (minutes) => {
                if (minutes) set({ pomodoroDuration: minutes * 60 });
                // The isCustomTimeModalOpen state is likely in the main store, so this action will need adjustment.
                // For now, it only handles setting pomodoroDuration.
            },
            setPomodoroDuration: (minutes) => set({ pomodoroDuration: minutes * 60 }),
            setLastCompletedTask: (task) => set({ lastCompletedTask: task }),
            setIsTimerActive: (isActive) => set({ isTimerActive: isActive }),
            setIsPauseModalOpen: (isOpen) => set({ isPauseModalOpen: isOpen }),
            setIsEndModalOpen: (isOpen) => set({ isEndModalOpen: isOpen }),
            setActiveTaskId: (taskId) => set({ activeTaskId: taskId }),
            setTimer: (time) => set({ timer: time }),
        }),
        {
            name: 'arquiteck-timer-storage',
            getStorage: () => localStorage,
            partialize: (state) =>
                Object.fromEntries(
                    Object.entries(state).filter(([key]) =>
                        ![
                            'toggleTimer',
                            'closePauseModal',
                            'closeEndModal',
                            'setPomodoroDuration',
                            'setLastCompletedTask',
                            'setIsTimerActive',
                            'setIsPauseModalOpen',
                            'setIsEndModalOpen',
                            'setActiveTaskId',
                            'setTimer',
                        ].includes(key)
                    )
                ),
        }
    )
);