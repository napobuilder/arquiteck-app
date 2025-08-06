import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EditItemModal = ({ isOpen, onClose, onSave, item, title, fieldLabel }: any) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (item) {
            setName(item.name);
        }
    }, [item]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ ...item, name });
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-[#14171E] rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20} /></button>
                <h2 className="text-xl font-bold text-white mb-6">{title}</h2>
                <div>
                    <label className="text-sm text-gray-400">{fieldLabel}</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-[#242933] w-full text-sm rounded-md px-3 py-2 mt-1 text-[#E0E3E8] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]" />
                </div>
                <div className="flex justify-end mt-8">
                    <button onClick={handleSave} className="px-6 py-2 rounded-lg text-sm font-bold text-black bg-[#00ADB5] hover:bg-[#00c5cf]">Guardar Cambios</button>
                </div>
            </div>
        </div>
    );
};

export default EditItemModal;