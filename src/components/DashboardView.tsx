import React, { useMemo } from 'react';
import { Calendar, ChevronDown, ArrowRight } from 'lucide-react';
import type { Client, Project, InboxTask, FocusTask } from '../types';
import InboxWidget from './InboxWidget';

interface DashboardViewProps {
  clients: Client[];
  projects: Project[];
  inboxTasks: InboxTask[];
  focusTasks: FocusTask[];
  taskToPlan: InboxTask | null;
  handlers: any; // Simplificado por brevedad, idealmente se tiparía cada handler
  focusBreaks: number;
}

const DashboardView: React.FC<DashboardViewProps> = ({ clients, projects, inboxTasks, focusTasks, taskToPlan, handlers, focusBreaks }) => {
  const totalRevenueMonth = useMemo(() => {
    return focusTasks.filter(t => t.paid).reduce((sum, task) => sum + task.value, 0);
  }, [focusTasks]);

  const completedTasksCount = focusTasks.filter(t => t.completed).length;
  const totalTasksCount = focusTasks.length;
  const progressPercentage = totalTasksCount > 0 ? Math.round(completedTasksCount / totalTasksCount * 100) : 0;
  const focusHours = (focusTasks.reduce((acc, t) => acc + t.pomodoros, 0) * 25 / 60).toFixed(1);

  const upcomingTasks = focusTasks.filter(t => !t.completed).slice(0, 5);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#E0E3E8]">Dashboard</h2>
          <p className="text-[#6C7581]">Visión general de tu progreso y enfoque.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#101116] rounded-lg p-2">
          <Calendar size={16} className="text-[#6C7581]" />
          <span className="text-[#E0E3E8] text-sm">Agosto, 2025</span>
          <ChevronDown size={16} className="text-[#6C7581]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <InboxWidget
            inboxTasks={inboxTasks}
            onAddTask={handlers.handleAddToInbox}
            onPlanTask={handlers.handleSelectTaskToPlan}
            onDeleteTask={handlers.handleDeleteFromInbox}
          />
        </div>
        <div className="bg-[#101116] p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-4">Plan de Foco para Hoy</h3>
          {upcomingTasks.length > 0 ? (
            <ul className="space-y-3">
              {upcomingTasks.map(task => (
                <li key={task.id} className="text-sm text-gray-300 flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                  {task.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No hay tareas de foco planeadas.</p>
          )}
          <button 
            onClick={() => handlers.setActiveView('foco')} 
            className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600/40 transition-colors">
            Ir al Plan de Foco <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#101116] p-6 rounded-2xl">
          <p className="text-sm font-medium text-[#6C7581]">Ingresos (Mes)</p>
          <p className="text-3xl font-bold text-white mt-2">${totalRevenueMonth.toFixed(2)}</p>
          <p className="text-sm text-green-400 mt-1">Total facturado</p>
        </div>
        <div className="bg-[#101116] p-6 rounded-2xl">
          <p className="text-sm font-medium text-[#6C7581]">Tareas Completadas</p>
          <p className="text-3xl font-bold text-[#E0E3E8] mt-2">{completedTasksCount} / {totalTasksCount}</p>
          <p className="text-sm text-[#6C7581] mt-1">{progressPercentage}% de progreso</p>
        </div>
        <div className="bg-[#101116] p-6 rounded-2xl">
          <p className="text-sm font-medium text-[#6C7581]">Horas de Foco (Hoy)</p>
          <p className="text-3xl font-bold text-white mt-2">{focusHours}h</p>
          <p className="text-sm text-[#6C7581] mt-1">Meta: 5h</p>
        </div>
      </div>
    </>
  );
};

export default DashboardView;