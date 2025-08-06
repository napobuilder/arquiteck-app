import React from 'react';
import { AlertTriangle } from 'lucide-react';

const StrictPauseModal = ({ isOpen, onResume, onBreakFocus, onLogDistraction }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-[#14171E] rounded-2xl p-8 max-w-md w-full border border-yellow-500/50 shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                    <AlertTriangle className="text-yellow-400" size={32} />
                    <h2 className="text-xl font-bold text-white">Interrupción de Foco</h2>
                </div>
                <p className="text-[#E0E3E8] mb-6">Has iniciado una sesión de trabajo profundo. ¿Qué te interrumpió?</p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                    {['Llamada', 'Email Urgente', 'Redes Sociales', 'Otra Idea'].map(reason => (
                        <button key={reason} onClick={() => onLogDistraction(reason)} className="text-center text-sm p-2 bg-[#242933] text-[#E0E3E8] rounded-md hover:bg-[#00ADB5]/20 transition-colors">{reason}</button>
                    ))}
                </div>
                <div className="flex justify-end gap-4">
                    <button onClick={onBreakFocus} className="px-4 py-2 rounded-lg text-sm font-semibold text-yellow-400">Romper Sesión</button>
                    <button onClick={onResume} className="px-6 py-2 rounded-lg text-sm font-bold text-black bg-[#00ADB5] hover:bg-[#00c5cf]">Continuar Foco</button>
                </div>
            </div>
        </div>
    );
};

export default StrictPauseModal;
