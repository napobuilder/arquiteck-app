import React, { useState } from 'react';
import { Inbox, Plus, Send, Trash2 } from 'lucide-react';
import type { InboxTask } from '../types';

interface InboxWidgetProps {
  inboxTasks: InboxTask[];
  onAddTask: (taskName: string) => void;
  onPlanTask: (task: InboxTask) => void;
  onDeleteTask: (taskId: number) => void;
}

const InboxWidget: React.FC<InboxWidgetProps> = ({ inboxTasks, onAddTask, onPlanTask, onDeleteTask }) => {
  const [taskName, setTaskName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;
    onAddTask(taskName);
    setTaskName('');
  };

  return (
    <div className="bg-[#101116] p-6 rounded-2xl h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Inbox size={18} className="text-[#6C7581]" />
        <h3 className="text-sm font-medium text-[#6C7581]">Buzón de Entrada</h3>
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-3">
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="¿Qué tienes en mente?"
          className="bg-[#14171E] flex-1 text-sm rounded-md px-3 py-2 placeholder-[#6C7581] text-[#E0E3E8] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
        />
        <button type="submit" className="bg-[#00ADB5] text-white p-2 rounded-md hover:bg-[#00c5cf]">
          <Plus size={20} />
        </button>
      </form>
      <div className="space-y-2 overflow-y-auto flex-1 pr-2">
        {inboxTasks.length > 0 ? inboxTasks.map(task => (
          <div key={task.id} className="bg-[#14171E] p-2.5 rounded-lg flex items-center justify-between">
            <p className="text-sm text-[#E0E3E8]">{task.name}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => onPlanTask(task)} title="Enviar a Plan de Foco" className="text-[#6C7581] hover:text-[#00ADB5]">
                <Send size={16} />
              </button>
              <button onClick={() => onDeleteTask(task.id)} title="Eliminar Tarea" className="text-[#6C7581] hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center text-sm text-[#6C7581] pt-8">Buzón vacío. ¡Bien hecho!</div>
        )}
      </div>
    </div>
  );
};

export default InboxWidget;