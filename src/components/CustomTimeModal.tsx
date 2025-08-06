import React, { useState } from 'react';
import { X } from 'lucide-react';

const CustomTimeModal = ({ isOpen, onClose, onSave }: any) => {
   const [minutes, setMinutes] = useState('45');

   if (!isOpen) return null;

   const handleSave = () => {
       const numMinutes = parseInt(minutes, 10);
       if (!isNaN(numMinutes) && numMinutes > 0) {
           onSave(numMinutes);
       }
   };

   return (
       <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
           <div className="bg-[#14171E] rounded-2xl p-8 max-w-xs w-full border border-white/10 shadow-2xl relative">
               <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20} /></button>
               <h2 className="text-xl font-bold text-white mb-6">Tiempo Personalizado</h2>
               <div>
                   <label className="text-sm text-gray-400">Duración en minutos</label>
                   <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} className="bg-[#242933] w-full text-sm rounded-md px-3 py-2 mt-1 text-[#E0E3E8] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]" />
               </div>
               <div className="flex justify-end mt-8">
                   <button onClick={handleSave} className="px-6 py-2 rounded-lg text-sm font-bold text-black bg-[#00ADB5] hover:bg-[#00c5cf]">Establecer</button>
               </div>
           </div>
       </div>
   );
};

export default CustomTimeModal;