import React from 'react';
import { Play, Pause } from 'lucide-react';

const GlobalTimerBar = ({ activeTask, timer, isTimerActive, onToggleTimer }: any) => {
   const formatTime = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

   return (
       <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-[#101116] border-t border-white/5 h-16 flex items-center justify-between px-8 z-20">
           {activeTask ? (
               <>
                   <div className="flex items-center gap-4">
                       <p className="text-sm text-[#6C7581]">En Foco:</p>
                       <p className="font-bold text-white">{activeTask.name}</p>
                   </div>
                   <div className="flex items-center gap-6">
                       <p className="text-4xl font-bold text-white tracking-tighter">{formatTime(timer)}</p>
                       <button onClick={() => onToggleTimer(activeTask.id)} className="bg-[#00ADB5] text-black p-3 rounded-full hover:bg-[#00c5cf]">
                           {isTimerActive ? <Pause size={20} /> : <Play size={20} />}
                       </button>
                   </div>
               </>
           ) : (
               <p className="text-[#6C7581]">Selecciona una tarea para empezar a enfocarte.</p>
           )}
       </div>
   );
};

export default GlobalTimerBar;