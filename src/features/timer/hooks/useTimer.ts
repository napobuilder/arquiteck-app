import { useEffect, useRef } from 'react';
import { useTimerStore } from '../store/timerStore';
import { useStore } from '../../../store/store';
import { CompletedPomodoro } from '../../../types'; // New import
import endPomodoroSound from '/sonidos-app/terminarpomodoro.ogg'; // Import the sound file

// const FOCUS_SOUND_BEEP = "data:audio/wav;base64,UklGRl9vT1REP19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAAABAAAAAAAAAAA"; // A very short, low-volume beep
// const POMODORO_END_SOUND_BEEP = "data:audio/wav;base64,UklGRl9vT1REP19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAAABAAAAAAAAAAA"; // A very short, low-volume beep

export const useTimer = () => {
    const isTimerActive = useTimerStore(state => state.isTimerActive);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const focusSoundRef = useRef<HTMLAudioElement | null>(null);
    const pomodoroEndSoundRef = useRef<HTMLAudioElement | null>(null); // New ref for pomodoro end sound

    const isFocusSoundEnabled = useStore(state => state.isFocusSoundEnabled);
    const isPomodoroEndSoundEnabled = useStore(state => state.isPomodoroEndSoundEnabled); // New
    const soundVolume = useStore(state => state.soundVolume);

    useEffect(() => {
        if (!focusSoundRef.current) {
            focusSoundRef.current = new Audio("data:audio/wav;base64,UklGRl9vT1REP19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAAABAAAAAAAAAAA");
            focusSoundRef.current.loop = true;
        }
        focusSoundRef.current.volume = soundVolume;

        if (!pomodoroEndSoundRef.current) { // New
            pomodoroEndSoundRef.current = new Audio(endPomodoroSound);
        }
        pomodoroEndSoundRef.current.volume = soundVolume; // New
    }, [soundVolume]);

    useEffect(() => {
        if (isTimerActive) {
            // Play focus sound if enabled
            if (isFocusSoundEnabled && focusSoundRef.current) {
                focusSoundRef.current.play().catch(e => console.error("Error playing focus sound:", e));
            }

            intervalRef.current = setInterval(() => {
                const timerState = useTimerStore.getState();
                const mainState = useStore.getState();

                useTimerStore.setState((state) => ({ timer: state.timer - 1 }));

                if (timerState.timer <= 1) {
                    console.log('useTimer - Timer reached 0. Before setState - isPauseModalOpen:', timerState.isPauseModalOpen, 'isTimerActive:', timerState.isTimerActive); // Debug log
                    const taskToEnd = mainState.focusTasks.find(task => task.id === timerState.activeTaskId);
                    
                    if (timerState.activeTaskId !== null && taskToEnd) {
                        mainState.updateFocusTaskPomodoros(timerState.activeTaskId, taskToEnd.pomodoros + 1);
                        console.log('Updated task pomodoros:', taskToEnd.name, taskToEnd.pomodoros + 1); // Debug log
                    }
                    
                    mainState.incrementTotalPomodoros();
                    // Aquí es donde necesitamos llamar a addBuildingToCity con los datos correctos
                    if (taskToEnd) { // Solo añadir edificio si hay una tarea finalizada
                        mainState.addBuildingToCity(taskToEnd.clientId, taskToEnd.projectId, taskToEnd.id);

                        const newCompletedPomodoro: CompletedPomodoro = {
                            id: Date.now(),
                            taskId: taskToEnd.id,
                            duration: timerState.pomodoroDuration / 60, // Duración en minutos
                            timestamp: Date.now(),
                            value: taskToEnd.value || 0, // Asegurar un valor por defecto si no está definido
                            clientId: taskToEnd.clientId || -2, // Asegurar un valor por defecto
                            projectId: taskToEnd.projectId || -2, // Asegurar un valor por defecto
                        };
                        mainState.addCompletedPomodoro(newCompletedPomodoro);
                    }
                    console.log('Total pomodoros incremented. Current focusTasks:', mainState.focusTasks); // Debug log

                    if (isPomodoroEndSoundEnabled && pomodoroEndSoundRef.current) {
                        pomodoroEndSoundRef.current.play().catch(e => console.error("Error playing pomodoro end sound:", e));
                    }

                    useTimerStore.setState((state) => {
                        const newState = {
                            lastCompletedTask: taskToEnd || null,
                            isTimerActive: false,
                            activeTaskId: null,
                            isEndModalOpen: state.isPauseModalOpen ? false : true, // Only open if pause modal is not open
                            timer: timerState.pomodoroDuration
                        };
                        console.log('useTimer - Timer reached 0. After setState - newState:', newState); // Debug log
                        return newState;
                    });
                } // This closing brace was missing for the setInterval callback
            }, 1000); // Assuming a 1-second interval, this was missing
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (focusSoundRef.current) {
                focusSoundRef.current.pause();
                focusSoundRef.current.currentTime = 0;
            }
        }
    }, [isTimerActive, isFocusSoundEnabled, isPomodoroEndSoundEnabled, soundVolume]); // Correct dependency array for useEffect
};
