import { useState, useEffect } from 'react';
import { X, Volume2, Sun, Moon } from 'lucide-react'; // Added Volume2, Sun, Moon
import { useStore } from '../store/store'; // Added useStore

const SettingsModal = ({ isOpen, onClose, onSave, user }: any) => { // user prop will be removed later
    const [name, setName] = useState('');
    const [avatarLetter, setAvatarLetter] = useState('');

    const {
        shortBreakDuration, setShortBreakDuration,
        longBreakDuration, setLongBreakDuration,
        pomodorosUntilLongBreak, setPomodorosUntilLongBreak,
        isFocusSoundEnabled, toggleFocusSound,
        isPomodoroEndSoundEnabled, togglePomodoroEndSound,
        soundVolume, setSoundVolume,
        theme, setTheme,
    } = useStore();

    useEffect(() => {
        if (user) {
            setName(user.name);
            setAvatarLetter(user.avatarLetter);
        }
    }, [user]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ name, avatarLetter: avatarLetter.toUpperCase() });
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-[#14171E] rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20} /></button>
                <h2 className="text-xl font-bold text-white mb-6">Configuración</h2>

                <div className="space-y-6">
                    {/* Profile Settings */}
                    <div className="pb-4 border-b border-white/5">
                        <h3 className="text-lg font-semibold text-white mb-3">Perfil</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400">Nombre de Usuario</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-[#242933] w-full text-sm rounded-md px-3 py-2 mt-1 text-[#E0E3E8] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">Letra del Avatar (1 caracter)</label>
                                <input type="text" value={avatarLetter} onChange={(e) => setAvatarLetter(e.target.value.slice(0, 1))} maxLength={1} className="bg-[#242933] w-full text-sm rounded-md px-3 py-2 mt-1 text-[#E0E3E8] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]" />
                            </div>
                        </div>
                    </div>

                    {/* Timer Settings */}
                    <div className="pb-4 border-b border-white/5">
                        <h3 className="text-lg font-semibold text-white mb-3">Temporizador Pomodoro</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400">Duración Pausa Corta (minutos)</label>
                                <input type="number" value={shortBreakDuration} onChange={(e) => setShortBreakDuration(parseInt(e.target.value) || 0)} className="bg-[#242933] w-full text-sm rounded-md px-3 py-2 mt-1 text-[#E0E3E8] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">Duración Pausa Larga (minutos)</label>
                                <input type="number" value={longBreakDuration} onChange={(e) => setLongBreakDuration(parseInt(e.target.value) || 0)} className="bg-[#242933] w-full text-sm rounded-md px-3 py-2 mt-1 text-[#E0E3E8] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">Pomodoros hasta Pausa Larga</label>
                                <input type="number" value={pomodorosUntilLongBreak} onChange={(e) => setPomodorosUntilLongBreak(parseInt(e.target.value) || 0)} className="bg-[#242933] w-full text-sm rounded-md px-3 py-2 mt-1 text-[#E0E3E8] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]" />
                            </div>
                        </div>
                    </div>

                    {/* Sound Settings */}
                    <div className="pb-4 border-b border-white/5">
                        <h3 className="text-lg font-semibold text-white mb-3">Sonido</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-400">Sonido de Enfoque</label>
                                <button onClick={toggleFocusSound} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#14171E] ${isFocusSoundEnabled ? 'bg-[#00ADB5]' : 'bg-gray-600'}`}>
                                    <span className={`transform transition ease-in-out duration-200 ${isFocusSoundEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 rounded-full bg-white`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-400">Sonido Fin de Pomodoro</label>
                                <button onClick={togglePomodoroEndSound} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#14171E] ${isPomodoroEndSoundEnabled ? 'bg-[#00ADB5]' : 'bg-gray-600'}`}>
                                    <span className={`transform transition ease-in-out duration-200 ${isPomodoroEndSoundEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 rounded-full bg-white`} />
                                </button>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Volumen</label>
                                <div className="flex items-center gap-2">
                                    <Volume2 size={18} className="text-gray-400" />
                                    <input type="range" min="0" max="1" step="0.1" value={soundVolume} onChange={(e) => setSoundVolume(parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#00ADB5]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Appearance Settings */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Apariencia</h3>
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-400">Modo Oscuro</label>
                            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#14171E] ${theme === 'dark' ? 'bg-[#00ADB5]' : 'bg-gray-600'}`}>
                                <span className={`transform transition ease-in-out duration-200 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 rounded-full bg-white`} />
                            </button>
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

export default SettingsModal;