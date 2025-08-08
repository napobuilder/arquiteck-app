import React from 'react';
import { useTimerStore } from '../features/timer/store/timerStore';

const NotesView: React.FC = () => {
  const pomodoroNotes = useTimerStore(state => state.pomodoroNotes);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-[#E0E3E8] mb-6">Mis Notas de Pomodoro</h2>
      <div className="space-y-4">
        {pomodoroNotes.length === 0 ? (
          <p className="text-center text-[#6C7581]">Aún no tienes notas de pomodoro. ¡Completa algunos para empezar a guardarlas!</p>
        ) : (
          pomodoroNotes.map((note) => (
            <div key={note.id} className="bg-[#101116] p-4 rounded-lg shadow-md border border-[#14171E]">
              <p className="text-sm text-[#6C7581] mb-1">{new Date(note.timestamp).toLocaleString()}</p>
              <p className="text-[#E0E3E8] text-base">{note.content}</p>
              {note.taskName && <p className="text-xs text-[#6C7581] mt-2">Tarea: {note.taskName}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesView;