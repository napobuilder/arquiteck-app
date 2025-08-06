import React, { useState, useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import type { Client, Project, FocusTask } from '../types';

interface FinancesViewProps {
  clients: Client[];
  projects: Project[];
  tasks: FocusTask[];
  onUpdateTasks: (tasks: FocusTask[]) => void;
  onDeleteClient: (clientId: number) => void;
}

const FinancesView: React.FC<FinancesViewProps> = ({ clients, projects, tasks, onUpdateTasks, onDeleteClient }) => {
  const [expandedClient, setExpandedClient] = useState<number | null>(null);

  const financialData = useMemo(() => {
    return clients.map(client => {
      const clientProjects = projects.filter(p => p.clientId === client.id);
      const clientTasks = tasks.filter(task => clientProjects.some(p => p.id === task.projectId));
      const totalRevenue = clientTasks.reduce((sum, task) => sum + (task.paid ? task.value : 0), 0);
      const pendingRevenue = clientTasks.reduce((sum, task) => sum + (!task.paid ? task.value : 0), 0);
      return {
        ...client,
        totalRevenue,
        pendingRevenue,
        projects: clientProjects.map(p => ({ ...p, tasks: tasks.filter(t => t.projectId === p.id) }))
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [clients, projects, tasks]);

  const togglePaidStatus = (taskId: number) => {
    onUpdateTasks(tasks.map(t => t.id === taskId ? { ...t, paid: !t.paid } : t));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#E0E3E8]">Finanzas</h2>
          <p className="text-[#6C7581]">Resumen de ingresos y facturación por cliente.</p>
        </div>
      </div>
      <div className="space-y-4">
        {financialData.map(client => (
          <div key={client.id} className="bg-[#101116] rounded-2xl p-4">
            <div className="grid grid-cols-4 gap-4 items-center cursor-pointer" onClick={() => setExpandedClient(expandedClient === client.id ? null : client.id)}>
              <h3 className="text-lg font-semibold text-[#E0E3E8] col-span-1">{client.name}</h3>
              <p className="text-lg font-semibold text-green-400 text-right">${client.totalRevenue.toFixed(2)}</p>
              <p className="text-lg font-semibold text-yellow-400 text-right">${client.pendingRevenue.toFixed(2)}</p>
              <div className="flex justify-end">
                <button onClick={(e) => { e.stopPropagation(); onDeleteClient(client.id); }} className="text-red-500 hover:text-red-400">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            {expandedClient === client.id && (
              <div className="mt-4 pl-4 border-l-2 border-white/10 space-y-3">
                {client.projects.map((project: Project & { tasks: FocusTask[] }) => (
                  <div key={project.id}>
                    <h4 className="font-semibold text-[#00ADB5] mb-2">{project.name}</h4>
                    <div className="space-y-2">
                      {project.tasks.map((task: FocusTask) => (
                        <div key={task.id} className="grid grid-cols-10 gap-2 items-center bg-[#14171E] p-2 rounded-md">
                          <p className="col-span-6 text-sm text-white">{task.name}</p>
                          <p className="col-span-1 text-sm text-center text-white/70">{task.pomodoros}</p>
                          <p className="col-span-1 text-sm font-semibold text-right text-white">${task.value.toFixed(2)}</p>
                          <div className="col-span-2 flex justify-end">
                            <button onClick={() => togglePaidStatus(task.id)} className={`text-xs font-bold py-1 px-3 rounded-full ${task.paid ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                              {task.paid ? 'Pagado' : 'Pendiente'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancesView;