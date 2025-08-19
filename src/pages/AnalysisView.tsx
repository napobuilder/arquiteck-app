import React, { useMemo } from 'react';
import { Phone, Mail, WifiOff, Lightbulb, HelpCircle } from 'lucide-react';
import { useStore } from '../store/store';
import { useTimerStore } from '../features/timer/store/timerStore';
import type { FocusTask, Project, Client, CompletedPomodoro } from '../types';

interface AnalysisViewProps {
    distractions: string[];
    focusBreaks: number;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ distractions, focusBreaks }) => {
    const focusTasks = useStore(state => state.focusTasks);
    const projects = useStore(state => state.projects);
    const clients = useStore(state => state.clients);
    const completedPomodoros = useStore(state => state.completedPomodoros); // New

    const distractionCounts = useMemo(() => {
        return distractions.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }, [distractions]);

    const sortedDistractions = useMemo(() => {
        return Object.entries(distractionCounts).sort(([, a], [, b]) => b - a);
    }, [distractionCounts]);

    const completedTasks = useMemo(() => focusTasks.filter(task => task.completed), [focusTasks]);

    const totalFocusTime = useMemo(() => {
        return completedPomodoros.reduce((total, pomodoro) => total + pomodoro.duration, 0);
    }, [completedPomodoros]);

    const totalIncome = useMemo(() => {
        return completedPomodoros.reduce((total, pomodoro) => total + pomodoro.value, 0);
    }, [completedPomodoros]);

    const tasksCompletedByDay = useMemo(() => {
        const dailyCounts: Record<string, number> = {};
        completedTasks.forEach(task => {
            if (task.completedAt) {
                const date = new Date(task.completedAt).toLocaleDateString();
                dailyCounts[date] = (dailyCounts[date] || 0) + 1;
            }
        });
        return Object.entries(dailyCounts).sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime());
    }, [completedTasks]);

    const iconMap: Record<string, React.ElementType> = {
        'Llamada': Phone,
        'Email Urgente': Mail,
        'Redes Sociales': WifiOff,
        'Otra Idea': Lightbulb,
    };

    console.log('AnalysisView - focusTasks:', focusTasks); // Debug log
    console.log('AnalysisView - completedTasks:', completedTasks); // Debug log
    console.log('AnalysisView - totalFocusTime:', totalFocusTime); // Debug log
    console.log('AnalysisView - totalIncome:', totalIncome); // Debug log
    console.log('AnalysisView - tasksCompletedByDay:', tasksCompletedByDay); // Debug log
    console.log('AnalysisView - projects:', projects); // Debug log

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#E0E3E8] mb-6">Análisis de Productividad</h2>
            <div className="bg-[#101116] p-6 rounded-2xl mb-8"> {/* Added mb-8 for spacing */}
                <h3 className="text-lg font-semibold text-white mb-4">Ladrones de Foco</h3>
                {sortedDistractions.length === 0 ? (
                    <p className="text-gray-500">No se han registrado interrupciones. ¡Sigue así!</p>
                ) : (
                    <div className="space-y-3">
                        {sortedDistractions.map(([reason, count]) => {
                            const Icon = iconMap[reason] || HelpCircle;
                            return (
                                <div key={reason} className="flex items-center justify-between bg-[#14171E] p-3 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Icon className="text-[#6C7581]" size={20} />
                                        <span className="text-white">{reason}</span>
                                    </div>
                                    <span className="font-bold text-lg text-white">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="bg-[#101116] p-6 rounded-2xl mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Métricas de Enfoque</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#14171E] p-3 rounded-lg">
                        <p className="text-sm text-[#6C7581]">Tiempo Total de Enfoque</p>
                        <p className="text-xl font-bold text-white">{totalFocusTime} minutos</p>
                    </div>
                    <div className="bg-[#14171E] p-3 rounded-lg">
                        <p className="text-sm text-[#6C7581]">Ingresos Acumulados (Tareas)</p>
                        <p className="text-xl font-bold text-white">${totalIncome.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="bg-[#101116] p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-white mb-4">Tareas Completadas por Día</h3>
                {tasksCompletedByDay.length === 0 ? (
                    <p className="text-gray-500">No hay tareas completadas registradas.</p>
                ) : (
                    <div className="space-y-3">
                        {tasksCompletedByDay.map(([date, count]) => (
                            <div key={date} className="flex items-center justify-between bg-[#14171E] p-3 rounded-lg">
                                <span className="text-white">{date}</span>
                                <span className="font-bold text-lg text-white">{count} tareas</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalysisView;