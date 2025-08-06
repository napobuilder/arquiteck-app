import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface StrictPauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onBreakFocus: () => void;
}

const StrictPauseModal: React.FC<StrictPauseModalProps> = ({ isOpen, onResume, onBreakFocus }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-[#14171E] rounded-2xl p-8 max-w-md w-full border border-yellow-500/50 shadow-2xl shadow-yellow-500/10">
        <div className="flex items-center gap-4 mb-4">
          <AlertTriangle className="text-yellow-400" size={32} />
          <h2 className="text-xl font-bold text-white">Interrupción de Foco</h2>
        </div>
        <p className="text-[#E0E3E8] mb-6">
          Has iniciado una sesión de trabajo profundo. Romper tu racha ahora puede afectar tu concentración. ¿Estás seguro de que quieres detenerte?
        </p>
        <div className="flex justify-end gap-4">
          <button onClick={onBreakFocus} className="px-4 py-2 rounded-lg text-sm font-semibold text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors">
            Romper Sesión
          </button>
          <button onClick={onResume} className="px-6 py-2 rounded-lg text-sm font-bold text-black bg-[#00ADB5] hover:bg-[#00c5cf] transition-colors">
            Continuar Foco
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrictPauseModal;