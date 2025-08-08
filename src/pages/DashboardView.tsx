import React, { useState, useMemo, useCallback } from 'react';

import { useStore } from '../store/store';
import { useTimerStore } from '../features/timer/store/timerStore';
import { Rocket, Home, DollarSign, Plus, Edit2, CheckCircle, Trash2, Play, Pause } from 'lucide-react';
import type { InboxTask, FocusTask, Client, Project } from '../types/index.ts';
import InboxWidget from '../components/InboxWidget';
import ComboBox from '../components/ComboBox';
import TimerDisplay from '../features/timer/components/TimerDisplay';

const DashboardView = () => {
    const clients = useStore(state => state.clients);
    const projects = useStore(state => state.projects);
    const focusTasks = useStore(state => state.focusTasks);
    const inboxTasks = useStore(state => state.inboxTasks);
    const taskToPlan = useStore(state => state.taskToPlan);

    const commitToFocus = useStore(state => state.commitToFocus);
    const addClient = useStore(state => state.addClient);
    const addProject = useStore(state => state.addProject);
    const incrementFocusBreaks = useStore(state => state.incrementFocusBreaks);
    const logDistraction = useStore(state => state.logDistraction);
    const deleteTask = useStore(state => state.deleteTask);
    const toggleComplete = useStore(state => state.toggleComplete);
    const addToInbox = useStore(state => state.addToInbox);
    const deleteFromInbox = useStore(state => state.deleteFromInbox);
    const setTaskToPlan = useStore(state => state.setTaskToPlan);
    const setEditingClient = useStore(state => state.setEditingClient);
    const setEditingProject = useStore(state => state.setEditingProject);
    const openCustomTimeModal = useStore(state => state.openCustomTimeModal);
    const updateGoal = useStore(state => state.updateGoal);
    const updateFocusTask = useStore(state => state.updateFocusTask);
    const updateClient = useStore(state => state.updateClient);
    const updateProjectDetails = useStore(state => state.updateProjectDetails);

    const activeTaskId = useTimerStore(state => state.activeTaskId);
    const toggleTimer = useTimerStore(state => state.toggleTimer);
    const pomodoroDuration = useTimerStore(state => state.pomodoroDuration);
    const timer = useTimerStore(state => state.timer);
    const setPomodoroDuration = useTimerStore(state => state.setPomodoroDuration);

    const [focusType, setFocusType] = useState<'billable' | 'internal' | 'personal' | null>(null);
    const [planningClient, setPlanningClient] = useState('');
    const [planningProject, setPlanningProject] = useState('');
    const [planningName, setPlanningName] = useState(taskToPlan ? taskToPlan.name : '');
    const [planningValue, setPlanningValue] = useState('');
    const [planningPriority, setPlanningPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [isDropZoneActive, setIsDropZoneActive] = useState(false);
    const [dragOverContext, setDragOverContext] = useState<string | null>(null);
    
    const selectedProjectForPlanning = useMemo(() => projects.find((p: Project) => p.name === planningProject), [projects, planningProject]);

    const billableProjects = useMemo(() => {
        const selectedClientId = clients.find(c => c.name === planningClient)?.id;
        if (!selectedClientId) return [];
        return projects.filter(p => p.clientId === selectedClientId);
    }, [clients, projects, planningClient]);

    const internalProjects = useMemo(() => {
        return projects.filter(p => p.clientId === -1);
    }, [projects]);

    const resetForm = useCallback(() => {
        setFocusType(null); setPlanningClient(''); setPlanningProject(''); setPlanningName(''); setPlanningValue(''); setPlanningPriority('medium');
        setTaskToPlan(null);
    }, [setTaskToPlan]);

    const handleCommit = (e: React.FormEvent) => {
        e.preventDefault(); if (!planningName.trim()) return;
        const taskData = { id: taskToPlan ? taskToPlan.id : Date.now(), name: planningName, clientName: planningClient, projectName: planningProject, value: focusType === 'billable' && selectedProjectForPlanning?.billingType === 'task' ? parseFloat(planningValue) || 0 : 0, priority: planningPriority, focusType, isFromInbox: !!taskToPlan };
        commitToFocus(taskData);
        resetForm();
    };
    
    const handleDrop = (e: React.DragEvent, context: 'billable' | 'internal' | 'personal' | null = null) => {
        e.preventDefault();
        e.stopPropagation();
        const taskJSON = e.dataTransfer.getData('application/json');
        if (taskJSON) {
            const task = JSON.parse(taskJSON);
            setTaskToPlan(task);
            if (context) {
                setFocusType(context);
            }
        }
        setIsDropZoneActive(false);
        setDragOverContext(null);
    };
    
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDropZoneActive(true);
    };

    const handleContextDragEnter = (context: string) => {
        setDragOverContext(context);
    };

    

    const PriorityIndicator = ({ priority }: { priority: 'low' | 'medium' | 'high' }) => {
        const colors = { low: 'bg-blue-500', medium: 'bg-yellow-500', high: 'bg-red-500' };
        return <div className={`w-2.5 h-2.5 rounded-full ${colors[priority]}`} title={`Prioridad: ${priority}`}></div>;
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6"><div><h2 className="text-2xl font-bold text-[#E0E3E8]">Dashboard</h2><p className="text-[#6C7581]">Tu centro de operaciones para capturar y ejecutar.</p></div></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <InboxWidget inboxTasks={inboxTasks} onAddTask={addToInbox} onPlanTask={setTaskToPlan} onDeleteTask={deleteFromInbox} />
                <div 
                    className={`bg-[#101116] shadow-lg p-6 rounded-2xl transition-all ${isDropZoneActive ? 'ring-2 ring-[#00ADB5] ring-dashed' : ''}`}
                    onDrop={(e) => handleDrop(e, null)}
                    onDragOver={handleDragOver}
                    onDragLeave={() => setIsDropZoneActive(false)}
                >
                    <h3 className="font-bold text-[#E0E3E8] text-lg mb-4">Plan de Foco</h3>
                    {!focusType && !taskToPlan ? (<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <button onDrop={(e) => handleDrop(e, 'billable')} onDragEnter={() => handleContextDragEnter('billable')} onDragLeave={() => setDragOverContext(null)} className={`p-4 bg-[#14171E] rounded-lg transition-all ${dragOverContext === 'billable' ? 'scale-105 ring-2 ring-[#00ADB5]' : 'hover:bg-[#00ADB5]/20'}`}><DollarSign className="mx-auto mb-2"/>Facturable</button>
                        <button onDrop={(e) => handleDrop(e, 'internal')} onDragEnter={() => handleContextDragEnter('internal')} onDragLeave={() => setDragOverContext(null)} className={`p-4 bg-[#14171E] rounded-lg transition-all ${dragOverContext === 'internal' ? 'scale-105 ring-2 ring-[#00ADB5]' : 'hover:bg-[#00ADB5]/20'}`}><Rocket className="mx-auto mb-2"/>Interno</button>
                        <button onDrop={(e) => handleDrop(e, 'personal')} onDragEnter={() => handleContextDragEnter('personal')} onDragLeave={() => setDragOverContext(null)} className={`p-4 bg-[#14171E] rounded-lg transition-all ${dragOverContext === 'personal' ? 'scale-105 ring-2 ring-[#00ADB5]' : 'hover:bg-[#00ADB5]/20'}`}><Home className="mx-auto mb-2"/>Personal</button>
                    </div>) : (
                        <form onSubmit={handleCommit} className="space-y-3">
                            { !focusType && taskToPlan && <p className="text-center text-yellow-400 bg-yellow-400/10 p-3 rounded-lg">Planificando tarea del buzón: "{taskToPlan.name}". Por favor, asigna un contexto.</p>}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center"><button type="button" onClick={() => setFocusType('billable')} className={`p-4 rounded-lg transition-colors ${focusType === 'billable' ? 'bg-[#00ADB5]/20 ring-2 ring-[#00ADB5]' : 'bg-[#14171E] hover:bg-[#00ADB5]/10'}`}><DollarSign className="mx-auto mb-2"/>Facturable</button><button type="button" onClick={() => setFocusType('internal')} className={`p-4 rounded-lg transition-colors ${focusType === 'internal' ? 'bg-[#00ADB5]/20 ring-2 ring-[#00ADB5]' : 'bg-[#14171E] hover:bg-[#00ADB5]/10'}`}><Rocket className="mx-auto mb-2"/>Interno</button><button type="button" onClick={() => setFocusType('personal')} className={`p-4 rounded-lg transition-colors ${focusType === 'personal' ? 'bg-[#00ADB5]/20 ring-2 ring-[#00ADB5]' : 'bg-[#14171E] hover:bg-[#00ADB5]/10'}`}><Home className="mx-auto mb-2"/>Personal</button></div>
                            {focusType === 'billable' && (<div className="flex flex-col md:flex-row gap-2"><ComboBox items={clients} value={planningClient} onChange={setPlanningClient} onCreate={addClient} placeholder="Cliente" className="w-full md:w-1/2" /><ComboBox items={billableProjects} value={planningProject} onChange={setPlanningProject} onCreate={(name: string) => addProject(name, clients.find((c: Client) => c.name === planningClient)?.id)} placeholder="Proyecto" disabled={!planningClient} className="w-full md:w-1/2" /></div>)}
                            {focusType === 'internal' && <ComboBox items={internalProjects} value={planningProject} onChange={setPlanningProject} onCreate={(name: string) => addProject(name, -1)} placeholder="Proyecto Interno" />}
                            <div className="flex items-center gap-2"><input type="text" value={planningName} onChange={(e) => setPlanningName(e.target.value)} placeholder="Nombre de la nueva tarea..." className="bg-[#242933] flex-1 text-sm rounded-md px-3 py-2 placeholder-[#6C7581] text-[#E0E3E8] focus:outline-none focus:ring-2 focus:ring-[#00ADB5]" />{focusType === 'billable' && selectedProjectForPlanning?.billingType === 'task' && <input type="number" value={planningValue} onChange={(e) => setPlanningValue(e.target.value)} placeholder="Valor ($)" className="bg-[#242933] w-24 text-sm rounded-md px-3 py-2" />}<div className="flex items-center gap-1 bg-[#242933] p-2 rounded-md">{(['low', 'medium', 'high'] as const).map(p => <button key={p} type="button" onClick={() => setPlanningPriority(p)} className={`w-4 h-4 rounded-full ${p === 'low' ? 'bg-blue-500' : p === 'medium' ? 'bg-yellow-500' : 'bg-red-500'} ${planningPriority === p ? 'ring-2 ring-white' : ''}`}></button>)}</div><button type="submit" className="bg-[#00ADB5] text-white p-2 rounded-md hover:bg-[#00c5cf] disabled:bg-gray-500" disabled={!focusType}><Plus size={20} /></button></div>
                            <button type="button" onClick={resetForm} className="text-xs text-[#6C7581] hover:text-white">← Cancelar</button>
                        </form>
                    )}
                     <div className="flex justify-between items-center mt-6 mb-2"><h4 className="text-sm font-semibold text-white">Tareas para Hoy</h4><div className="flex items-center gap-2 text-sm bg-[#242933] p-1 rounded-md">{[5, 15, 25].map(min => <button key={min} onClick={() => setPomodoroDuration(min)} className={`px-2 py-1 rounded ${pomodoroDuration === min * 60 ? 'bg-[#00ADB5] text-black font-bold' : 'hover:bg-white/10'}`}>{min}m</button>)}<button onClick={openCustomTimeModal} className={`px-2 py-1 rounded ${![5*60, 15*60, 25*60].includes(pomodoroDuration) ? 'bg-[#00ADB5] text-black font-bold' : 'hover:bg-white/10'}`}>{![5*60, 15*60, 25*60].includes(pomodoroDuration) ? `${pomodoroDuration / 60}m` : '...'}</button></div></div>
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-2 mt-4">
                        {focusTasks.length === 0 && <p className="text-center text-gray-500 py-8">Crea una nueva tarea para empezar.</p>}
                            {[...focusTasks].sort((a: FocusTask, b: FocusTask) => { const p = { high: 0, medium: 1, low: 2 }; return p[a.priority] - p[b.priority]; }).map((task: FocusTask) => {
                            const project = projects.find((p: Project) => p.id === task.projectId);
                            const client = clients.find((c: Client) => c.id === project?.clientId);
                            const isTaskActive = activeTaskId === task.id;
                            const progress = isTaskActive ? ((pomodoroDuration - timer) / pomodoroDuration) * 100 : 0;
                            return (
                                <div key={task.id} className={`group relative bg-[#242933] p-3 rounded-lg flex items-center justify-between transition-all overflow-hidden ${isTaskActive ? 'ring-2 ring-[#00ADB5]' : ''}`}>
                                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00ADB5]/30 to-[#00ADB5]/5 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                                    <div className="relative z-10 flex items-center gap-3"><PriorityIndicator priority={task.priority} /><button onClick={() => toggleComplete(task.id)} className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 ${task.completed ? 'bg-[#00ADB5] border-[#00ADB5]' : 'border-[#6C7581]'}`}>{task.completed && <CheckCircle size={14} className="text-white"/>}</button><div><p className={`font-medium ${task.completed ? 'text-[#6C7581] line-through' : 'text-[#E0E3E8]'}`}>{task.name}</p><p className="text-xs text-[#6C7581]">{client?.name ? `${client.name} / ${project?.name}` : project?.name || "Personal"}</p></div></div>
                                    <div className="relative z-10 flex items-center gap-2"><span className="text-sm font-semibold text-white/80">{task.value > 0 ? `${task.value}` : ''}</span><span className="text-sm font-semibold text-white">{task.pomodoros}</span>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setEditingClient(task)} disabled={isTaskActive} className="text-[#6C7581] hover:text-white disabled:opacity-20"><Edit2 size={16} /></button>
                                            <button onClick={() => deleteTask(task.id)} className="text-[#6C7581] hover:text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                        <button onClick={() => toggleTimer(task.id)} className="text-[#00ADB5] hover:text-[#00c5cf]">{isTaskActive ? <Pause size={20} /> : <Play size={20} />}</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardView;