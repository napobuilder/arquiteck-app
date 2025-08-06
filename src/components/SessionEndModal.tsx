import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const SessionEndModal = ({ isOpen, onSaveNote, taskName }: any) => {
   const [note, setNote] = useState('');
   if (!isOpen) return null;
   const handleSave = () => { onSaveNote(note); setNote(''); };
   return (
       <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"><div className="bg-[#14171E] rounded-2xl p-8 max-w-md w-full border border-[#00ADB5]/50 shadow-2xl"><div className="flex items-center gap-4 mb-4"><CheckCircle className="text-[#00ADB5]" size={32} /><h2 className="text-xl font-bold text-white">¡Pomodoro Completado!</h2></div><p className="text-[#E0E3E8] mb-4">Buen trabajo en: <span className="font-semibold text-white">{taskName}</span>. ¿Alguna nota sobre la sesión?</p><textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Ej: Terminé el componente principal, pero necesito refactorizar el estado..." className="w-full bg-[#242933] rounded-md p-3 text-sm h-24 mb-4 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"></textarea><div className="flex justify-end"><button onClick={handleSave} className="px-6 py-2 rounded-lg text-sm font-bold text-black bg-[#00ADB5] hover:bg-[#00c5cf]">Guardar y Continuar</button></div></div></div>
   );
};

export default SessionEndModal;