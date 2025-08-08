import React from 'react';
import { useTimerStore } from '../store/timerStore';
import { Play, Pause } from 'lucide-react';

const TimerDisplay = () => {
    const timer = useTimerStore(state => state.timer);
    const activeTaskId = useTimerStore(state => state.activeTaskId);
    const pomodoroDuration = useTimerStore(state => state.pomodoroDuration);
    const isTimerActive = useTimerStore(state => state.isTimerActive);
    const toggleTimer = useTimerStore(state => state.toggleTimer);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const isCustomTimeActive = ![5*60, 15*60, 25*60].includes(pomodoroDuration);

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{formatTime(timer)}</span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Botones de control del temporizador */}
                <button onClick={() => toggleTimer(activeTaskId!)} className="text-[#00ADB5] hover:text-[#00c5cf]">
                    {isTimerActive ? <Pause size={20} /> : <Play size={20} />}
                </button>
            </div>
        </div>
    );
};

export default TimerDisplay;