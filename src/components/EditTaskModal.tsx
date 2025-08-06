import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EditTaskModal = ({ isOpen, onClose, onSave, task }: any) => {
   const [name, setName] = useState('');
   const [priority, setPriority] = useState('medium');

   useEffect(() => {
       if (task) {
           setName(task.name);
           setPriority(task.priority);
       }
   }, [task]);

   if (!isOpen) return null;

   const handleSave = () => {
       onSave({ ...task, name, priority });
   };

   return (
       <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
           <div className="bg-[#14171E] rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl relative">
               <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20} /></button>
               <h2 className="text-xl font-bold text-white mb-6">Editar Tarea</h2>
               <div className="space-y-4">
                   <div>
                       <label className="text-sm text-gray-400">Nombre de la Tarea</label>
                       <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-[#242933] w-full text-sm rounded-md px-3 py-2 mt-1 text-[#E0E3E8] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]" />
                   </div>
                    <div>
                       <label className="text-sm text-gray-400">Prioridad</label>
                        <div className="flex items-center gap-2 mt-2">
                           {(['low', 'medium', 'high'] as const).map(p => <button key={p} type="button" onClick={() => setPriority(p)} className={`flex-1 p-2 rounded-md text-sm ${priority === p ? 'bg-[#00ADB5] text-black font-bold' : 'bg-[#242933] text-white'}`}>{p.charAt(0).toUpperCase() + p.slice(1)}</button>)}
                       </div>
                   </div>
               </div>
               <div className="flex justify-end mt-8">
                   <button onClick={handleSave} className="px-6 py-2 rounded-lg text-sm font-bold text-black bg-[#00ADB5] hover:bg-[#00c5cf]">Guardar Cambios</button>
               </div>
           </div>
       </div>
   );
};

export default EditTaskModal;