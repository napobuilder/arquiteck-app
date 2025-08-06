import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Play, Pause, Trash2, CheckCircle } from 'lucide-react';
import type { InboxTask } from '../types';

type FocusType = 'Billable' | 'Internal' | 'Personal' | null;

interface Task {
  id: number;
  type: FocusType;
  client?: string;
  project?: string;
  taskName: string;
  value?: number;
  completed: boolean;
  pomodoros: number;
}

interface FocusPlanViewProps {
  taskToPlan: InboxTask | null;
  onCommitTask: (taskData: any) => void;
}

const FocusPlanView: React.FC<FocusPlanViewProps> = ({ taskToPlan, onCommitTask }) => {
  const [focusType, setFocusType] = useState<FocusType>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [client, setClient] = useState('');
  const [project, setProject] = useState('');
  const [taskName, setTaskName] = useState('');
  const [value, setValue] = useState('');
  const [pomodoroDuration, setPomodoroDuration] = useState(1500);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [timer, setTimer] = useState(pomodoroDuration);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (taskToPlan) {
      setTaskName(taskToPlan.name);
    }
  }, [taskToPlan]);

  useEffect(() => {
    if (isTimerActive && activeTaskId !== null) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev > 1) return prev - 1;
          const updatedTasks = tasks.map(task =>
            task.id === activeTaskId ? { ...task, pomodoros: task.pomodoros + 1 } : task
          );
          setTasks(updatedTasks);
          setIsTimerActive(false);
          setActiveTaskId(null);
          return pomodoroDuration;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTimerActive, activeTaskId, tasks, pomodoroDuration]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName) return;

    if (taskToPlan) {
        onCommitTask({
            id: taskToPlan.id,
            clientName: client,
            projectName: project,
            name: taskName,
            value: parseFloat(value) || 0,
            isNew: false,
        });
    } else {
        const newTask: Task = {
            id: Date.now(),
            type: focusType,
            taskName,
            completed: false,
            pomodoros: 0,
        };

        if (focusType === 'Billable') {
            newTask.client = client;
            newTask.project = project;
            newTask.value = parseFloat(value);
        } else if (focusType === 'Internal') {
            newTask.project = project;
        }

        setTasks([...tasks, newTask]);
    }

    resetForm();
    setFocusType(null);
  };

  const resetForm = () => {
    setClient('');
    setProject('');
    setTaskName('');
    setValue('');
  };

  const handleCancel = () => {
    setFocusType(null);
    resetForm();
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleToggleTimer = (taskId: number) => {
    if (activeTaskId === taskId) {
      setIsTimerActive(!isTimerActive);
    } else {
      setActiveTaskId(taskId);
      setTimer(pomodoroDuration);
      setIsTimerActive(true);
    }
  };

  const handleSetPomodoroDuration = (duration: number) => {
    setPomodoroDuration(duration);
    setTimer(duration);
  };

  const handleCustomDuration = () => {
    const customMinutes = window.prompt('Enter custom duration in minutes:', '10');
    if (customMinutes) {
      const durationInSeconds = parseInt(customMinutes, 10) * 60;
      handleSetPomodoroDuration(durationInSeconds);
    }
  };

  const formatTime = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const activeTask = tasks.find(t => t.id === activeTaskId);

  const renderTaskForm = () => (
    <form onSubmit={handleAddTask} className="mb-6 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-bold mb-4 text-white">
        Añadir Nueva Tarea {focusType && `- ${focusType}`}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {focusType === 'Billable' && (
          <>
            <input type="text" placeholder="Cliente" value={client} onChange={(e) => setClient(e.target.value)} className="p-2 bg-gray-700 text-white rounded" />
            <input type="text" placeholder="Proyecto" value={project} onChange={(e) => setProject(e.target.value)} className="p-2 bg-gray-700 text-white rounded" />
          </>
        )}
        {focusType === 'Internal' && (
          <input type="text" placeholder="Proyecto Interno" value={project} onChange={(e) => setProject(e.target.value)} className="p-2 bg-gray-700 text-white rounded" />
        )}
        <input type="text" placeholder="Nombre de Tarea" value={taskName} onChange={(e) => setTaskName(e.target.value)} className="p-2 bg-gray-700 text-white rounded col-span-2" required />
        {focusType === 'Billable' && (
          <input type="number" placeholder="Valor ($)" value={value} onChange={(e) => setValue(e.target.value)} className="p-2 bg-gray-700 text-white rounded" />
        )}
      </div>
      <div className="flex items-center justify-between mt-4">
        <button type="button" onClick={handleCancel} className="text-gray-400 hover:text-white">&larr; Cambiar tipo de foco</button>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"><Plus className="mr-2" /> Añadir Tarea</button>
      </div>
    </form>
  );

  return (
    <div className="p-4 max-w-6xl mx-auto text-white grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold mb-4">Plan de Foco</h2>
        {!focusType ? (
          <div className="flex justify-center gap-4 my-8">
            <button onClick={() => setFocusType('Billable')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg">Facturable</button>
            <button onClick={() => setFocusType('Internal')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">Interno</button>
            <button onClick={() => setFocusType('Personal')} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg">Personal</button>
          </div>
        ) : (
          renderTaskForm()
        )}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Tareas para Hoy</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => handleSetPomodoroDuration(300)} className={`px-3 py-1 rounded-lg ${pomodoroDuration === 300 ? 'bg-blue-600' : 'bg-gray-700'}`}>5m</button>
            <button onClick={() => handleSetPomodoroDuration(900)} className={`px-3 py-1 rounded-lg ${pomodoroDuration === 900 ? 'bg-blue-600' : 'bg-gray-700'}`}>15m</button>
            <button onClick={() => handleSetPomodoroDuration(1500)} className={`px-3 py-1 rounded-lg ${pomodoroDuration === 1500 ? 'bg-blue-600' : 'bg-gray-700'}`}>25m</button>
            <button onClick={handleCustomDuration} className="px-3 py-1 rounded-lg bg-gray-700">Personalizado</button>
          </div>
        </div>
        <div className="space-y-2">
          {tasks.map(task => {
            const isTaskActive = activeTaskId === task.id;
            const progress = isTaskActive ? ((pomodoroDuration - timer) / pomodoroDuration) * 100 : 0;
            return (
              <div key={task.id} className={`relative bg-gray-800 p-3 rounded-lg flex items-center justify-between transition-all overflow-hidden ${isTaskActive ? 'ring-2 ring-blue-500' : ''}`}>
                <div className="absolute top-0 left-0 h-full bg-blue-500/20 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                <div className="relative z-10 flex items-center gap-3">
                  <button onClick={() => toggleTaskCompletion(task.id)} className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 ${task.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}>
                    {task.completed && <CheckCircle size={14} className="text-white"/>}
                  </button>
                  <div>
                    <p className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}>{task.taskName}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${task.type === 'Billable' ? 'bg-green-600/20 text-green-400' : task.type === 'Internal' ? 'bg-blue-600/20 text-blue-400' : 'bg-purple-600/20 text-purple-400'}`}>{task.type}</span>
                      {task.type === 'Billable' && <span>{task.client} / {task.project} - ${task.value}</span>}
                      {task.type === 'Internal' && <span>{task.project}</span>}
                    </div>
                  </div>
                </div>
                <div className="relative z-10 flex items-center gap-4">
                  <span className="text-sm font-semibold text-white">{task.pomodoros}</span>
                  <button onClick={() => handleToggleTimer(task.id)} className="text-blue-500 hover:text-blue-400">{isTaskActive && isTimerActive ? <Pause size={20} /> : <Play size={20} />}</button>
                  <button onClick={() => handleDeleteTask(task.id)} className="text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-gray-900/50 rounded-xl flex flex-col items-center justify-center p-6 h-full border border-white/10 shadow-inner">
        <h3 className="text-lg font-bold text-white mb-2">Sesión Activa</h3>
        <div className="text-center h-20">
          {activeTask ? (
            <>
              <p className="text-xl font-semibold text-white">{activeTask.taskName}</p>
              <p className="text-sm text-blue-400">{activeTask.client || activeTask.project}</p>
            </>
          ) : (
            <p className="text-gray-500 flex items-center justify-center h-full">Selecciona una tarea para iniciar</p>
          )}
        </div>
        <p className="text-7xl font-bold text-white tracking-tighter my-4">{formatTime(timer)}</p>
        <div className="flex items-center gap-4 text-sm">
          <p className="text-gray-400">Pomodoros: <span className="font-semibold text-white">{activeTask ? activeTask.pomodoros : '0'}</span></p>
        </div>
      </div>
    </div>
  );
};

export default FocusPlanView;