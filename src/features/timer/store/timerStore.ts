import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FocusTask, PomodoroNote } from '../../../types'; // Adjust path as needed
import startFocusSound from '/sonidos-app/startfocus.ogg'; // Import the sound file
import endPomodoroSound from '/sonidos-app/terminarpomodoro.ogg'; // Import the sound file

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
    resetTimerState: () => void; // Add this line
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
                console.log('toggleTimer called. activeTaskId:', activeTaskId, 'taskId:', taskId); // Debug log
                if (activeTaskId === taskId) {
                    console.log('toggleTimer - Pausing timer. Setting isPauseModalOpen to true.'); // Debug log
                    set({ isTimerActive: false, isPauseModalOpen: true });
                } else {
                    console.log('toggleTimer - Starting timer. Setting isTimerActive to true.'); // Debug log
                    set({ activeTaskId: taskId, timer: pomodoroDuration, isTimerActive: true });
                    const audio = new Audio(startFocusSound);
                    audio.play().catch(e => console.error("Error playing sound:", e));
                }
            },

            

            _endSession: () => {
                // Similar to _tick, this will need to interact with focusTasks in the main store.
                set(state => ({
                    isTimerActive: false,
                    activeTaskId: null,
                    isEndModalOpen: true,
                }));
                const audio = new Audio(endPomodoroSound);
                audio.play().catch(e => console.error("Error playing end pomodoro sound:", e));
            },

            closePauseModal: () => set({ isPauseModalOpen: false, isTimerActive: true }),

            resetTimerState: () => set((state) => ({
                timer: state.pomodoroDuration, // Reset to initial pomodoro duration
                isTimerActive: false,
                activeTaskId: null,
                isPauseModalOpen: false,
                isEndModalOpen: false,
            })),

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
            storage: {
                getItem: (name) => {
                    const storedValue = localStorage.getItem(name);
                    return storedValue ? JSON.parse(storedValue) : null;
                },
                setItem: (name, value) => {
                    localStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: (name) => localStorage.removeItem(name),
            },
                        partialize: (state) =>
                Object.fromEntries(
                    Object.entries(state).filter(([, value]) => typeof value !== 'function')
                ) as TimerState,
        }
    )
);