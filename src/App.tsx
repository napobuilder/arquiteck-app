import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
    LayoutDashboard, Briefcase, BarChart, Building2, Settings, LogOut, Search, Bell, ChevronDown, X
} from 'lucide-react';

// Importa los tipos
import type { Client, Project, InboxTask, FocusTask, Goal, Building, User } from './types';

// Importa los componentes y vistas
import DashboardView from './pages/DashboardView';
import ProjectsView from './pages/ProjectsView';
import AnalysisView from './pages/AnalysisView';
import MetropolisView from './pages/MetropolisView';
import StrictPauseModal from './components/StrictPauseModal';
import SessionEndModal from './components/SessionEndModal';
import EditTaskModal from './components/EditTaskModal';
import EditItemModal from './components/EditItemModal';
import CustomTimeModal from './components/CustomTimeModal';
import SettingsModal from './components/SettingsModal';
import GlobalTimerBar from './components/GlobalTimerBar';

const App = () => {
    // --- ESTADO CENTRALIZADO ---
    const useStickyState = (defaultValue: any, key: string) => {
        const [value, setValue] = useState(() => {
            try {
                const stickyValue = window.localStorage.getItem(key);
                return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
            } catch (error) {
                console.error(`Error parsing localStorage key "${key}":`, error);
                return defaultValue;
            }
        });
        useEffect(() => {
            try {
                window.localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error(`Error setting localStorage key "${key}":`, error);
            }
        }, [key, value]);
        return [value, setValue];
    };

    const [clients, setClients] = useStickyState([], 'clients');
    const [projects, setProjects] = useStickyState([], 'projects');
    const [inboxTasks, setInboxTasks] = useStickyState([], 'inboxTasks');
    const [focusTasks, setFocusTasks] = useStickyState([], 'focusTasks');
    const [goals, setGoals] = useStickyState([{ id: 'income', target: 2000 }, { id: 'focus', target: 20 }], 'goals');
    const [distractions, setDistractions] = useStickyState([], 'distractions');
    const [cityData, setCityData] = useStickyState([], 'cityData');
    const [totalPomodoros, setTotalPomodoros] = useStickyState(0, 'totalPomodoros');
    const [user, setUser] = useStickyState({ name: "Usuario", avatarLetter: "U" }, 'userProfile');
    
    const [taskToPlan, setTaskToPlan] = useState<InboxTask | null>(null);
    const [taskToEdit, setTaskToEdit] = useState<FocusTask | null>(null);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isCustomTimeModalOpen, setIsCustomTimeModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');
    const [focusBreaks, setFocusBreaks] = useState(0);
    
    // --- ESTADO DEL TEMPORIZADOR (LIFTED STATE) ---
    const [pomodoroDuration, setPomodoroDuration] = useState(25 * 60);
    const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
    const [timer, setTimer] = useState(pomodoroDuration);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
    const [isEndModalOpen, setIsEndModalOpen] = useState(false);
    const [lastCompletedTask, setLastCompletedTask] = useState<FocusTask | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const currentTotal = focusTasks.reduce((sum: number, task: FocusTask) => sum + task.pomodoros, 0);
        const newPomodoros = currentTotal - totalPomodoros;
        if (newPomodoros > 0) {
            const buildingsToAdd = Math.floor((totalPomodoros % 5 + newPomodoros) / 5);
            if (buildingsToAdd > 0) {
                const newBuildings: Building[] = [...Array(buildingsToAdd)].map(() => {
                    const heights = ['h-full', 'h-5/6', 'h-4/6', 'h-3/6'];
                    const colors = ['bg-purple-500', 'bg-purple-600', 'bg-pink-500', 'bg-indigo-500'];
                    return { 
                        id: Date.now() + Math.random(), 
                        heightClass: heights[Math.floor(Math.random() * heights.length)],
                        colorClass: colors[Math.floor(Math.random() * colors.length)],
                        windowCount: Math.floor(Math.random() * 10) + 5,
                    };
                });
                setCityData((prev: Building[]) => [...prev, ...newBuildings]);
            }
        }
        setTotalPomodoros(currentTotal);
    }, [focusTasks, totalPomodoros, setCityData, setTotalPomodoros]);

    useEffect(() => {
        if (isTimerActive && activeTaskId !== null) {
            intervalRef.current = setInterval(() => {
                setTimer(prev => {
                    if (prev > 1) return prev - 1;
                    const taskToEnd = focusTasks.find((task: FocusTask) => task.id === activeTaskId);
                    setLastCompletedTask(taskToEnd || null);
                    const updatedTasks = focusTasks.map((task: FocusTask) => task.id === activeTaskId ? { ...task, pomodoros: task.pomodoros + 1 } : task);
                    setFocusTasks(updatedTasks);
                    setIsTimerActive(false); setActiveTaskId(null); setIsEndModalOpen(true);
                    return pomodoroDuration;
                });
            }, 1000);
        } else { if (intervalRef.current) clearInterval(intervalRef.current); }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isTimerActive, activeTaskId, focusTasks, pomodoroDuration, setFocusTasks]);
    
    const handleToggleTimer = (taskId: number) => {
        if (activeTaskId === taskId) { setIsTimerActive(false); setIsPauseModalOpen(true); } 
        else { setActiveTaskId(taskId); setTimer(pomodoroDuration); setIsTimerActive(true); }
    };

    // --- MANEJADORES DE LÓGICA ---
    const handleCreateClient = (name: string) => setClients((prev: Client[]) => [...prev, { id: Date.now(), name }]);
    const handleUpdateClient = (updatedClient: Client) => { setClients((prev: Client[]) => prev.map(c => c.id === updatedClient.id ? updatedClient : c)); setEditingClient(null); };
    const handleCreateProject = (name: string, clientId: number) => setProjects((prev: Project[]) => [...prev, { id: Date.now(), clientId, name, billingType: 'task', retainerValue: 0 }]);
    const handleUpdateProject = (id: number, key: string, value: any) => setProjects((prev: Project[]) => prev.map(p => p.id === id ? {...p, [key]: value} : p));
    const handleUpdateProjectDetails = (updatedProject: Project) => { setProjects((prev: Project[]) => prev.map(p => p.id === updatedProject.id ? { ...p, name: updatedProject.name } : p)); setEditingProject(null); };
    const handleUpdateGoal = (id: 'income' | 'focus', newTarget: number) => setGoals((prev: Goal[]) => prev.map(g => g.id === id ? {...g, target: newTarget} : g));
    const handleUpdateFocusTask = (updatedTask: FocusTask) => { setFocusTasks((prev: FocusTask[]) => prev.map(t => t.id === updatedTask.id ? updatedTask : t)); setTaskToEdit(null); };
    const handleUpdateUser = (updatedUser: User) => { setUser(updatedUser); setIsSettingsModalOpen(false); };

    const handleCommitToFocus = (taskData: any) => {
        let projectId = -2; // Default for personal tasks
        if (taskData.focusType === 'billable' || taskData.focusType === 'internal') {
            let project = projects.find((p: Project) => p.name === taskData.projectName);
            if (!project) {
                let clientId = -1; // Default for internal
                if (taskData.focusType === 'billable') {
                    let client = clients.find((c: Client) => c.name === taskData.clientName);
                    if (!client) { client = { id: Date.now(), name: taskData.clientName }; setClients((p: Client[]) => [...p, client]); }
                    clientId = client.id;
                }
                project = { id: Date.now(), clientId, name: taskData.projectName, billingType: 'task', retainerValue: 0 };
                setProjects((p: Project[]) => [...p, project]);
            }
            projectId = project.id;
        }
        const newTask: FocusTask = { id: taskData.id, projectId: projectId, name: taskData.name, pomodoros: 0, completed: false, value: taskData.value, paid: false, priority: taskData.priority };
        setFocusTasks((prev: FocusTask[]) => [newTask, ...prev]);
        if (taskData.isFromInbox) setInboxTasks((prev: InboxTask[]) => prev.filter(t => t.id !== taskData.id));
    };
    
    const handlers = {
        handleCommitToFocus, handleCreateClient, handleCreateProject, setActiveView, handleToggleTimer,
        handleIncrementFocusBreaks: () => setFocusBreaks(prev => prev + 1),
        handleLogDistraction: (reason: string) => { setDistractions((prev: string[]) => [...prev, reason]); setIsPauseModalOpen(false); },
        handleDeleteTask: (id: number) => setFocusTasks((prev: FocusTask[]) => prev.filter(t => t.id !== id)),
        handleToggleComplete: (id: number) => setFocusTasks((prev: FocusTask[]) => prev.map(t => t.id === id ? {...t, completed: !t.completed} : t)),
        handleAddToInbox: (name: string) => setInboxTasks((prev: InboxTask[]) => [...prev, {id: Date.now(), name}]),
        handleDeleteFromInbox: (id: number) => setInboxTasks((prev: InboxTask[]) => prev.filter(t => t.id !== id)),
        handleSelectTaskToPlan: (task: InboxTask) => { setTaskToPlan(task); },
        clearTaskToPlan: () => setTaskToPlan(null),
        handleStartEdit: (task: FocusTask) => setTaskToEdit(task),
        handleUpdateFocusTask,
        handleStartEditClient: (client: Client) => setEditingClient(client),
        handleUpdateClient,
        handleStartEditProject: (project: Project) => setEditingProject(project),
        handleUpdateProjectDetails,
        handleOpenCustomTimeModal: () => setIsCustomTimeModalOpen(true),
    };
    
    const timerState = { activeTaskId, timer, pomodoroDuration, setPomodoroDuration };
    const activeTask = focusTasks.find((t: FocusTask) => t.id === activeTaskId);
    const userAvatarUrl = `https://placehold.co/40x40/00ADB5/FFFFFF?text=${user.avatarLetter}`;

    const NavLink = ({ icon: Icon, label, active = false, onClick = () => {} }: any) => (<li><a href="#" onClick={(e) => {e.preventDefault(); onClick();}} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${active ? 'bg-[#00ADB5]/10 text-[#00ADB5] font-semibold' : 'text-[#E0E3E8] hover:bg-[#14171E]'}`}><Icon size={20} /><span>{label}</span></a></li>);

    return (
        <>
            <StrictPauseModal isOpen={isPauseModalOpen} onResume={() => { setIsPauseModalOpen(false); setIsTimerActive(true); }} onBreakFocus={() => { setIsPauseModalOpen(false); setActiveTaskId(null); setTimer(pomodoroDuration); handlers.handleIncrementFocusBreaks(); }} onLogDistraction={handlers.handleLogDistraction} />
            <SessionEndModal isOpen={isEndModalOpen} taskName={lastCompletedTask?.name} onSaveNote={(note: string) => { console.log(`Nota para ${lastCompletedTask?.name}: ${note}`); setIsEndModalOpen(false); }} />
            <EditTaskModal isOpen={taskToEdit !== null} onClose={() => setTaskToEdit(null)} onSave={handleUpdateFocusTask} task={taskToEdit} />
            <EditItemModal isOpen={editingClient !== null} onClose={() => setEditingClient(null)} onSave={handleUpdateClient} item={editingClient} title="Editar Cliente" fieldLabel="Nombre del Cliente" />
            <EditItemModal isOpen={editingProject !== null} onClose={() => setEditingProject(null)} onSave={handleUpdateProjectDetails} item={editingProject} title="Editar Proyecto" fieldLabel="Nombre del Proyecto" />
            <CustomTimeModal isOpen={isCustomTimeModalOpen} onClose={() => setIsCustomTimeModalOpen(false)} onSave={(minutes: number) => { setPomodoroDuration(minutes * 60); setIsCustomTimeModalOpen(false); }} />
            <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} onSave={handleUpdateUser} user={user} />
            <div className="flex h-screen w-full bg-[#101116] font-sans text-[#E0E3E8]">
                <aside className="w-64 bg-[#101116] flex-col p-4 border-r border-white/5 hidden md:flex">
                    <div className="flex items-center gap-3 mb-10 p-2"><div className="w-10 h-10 bg-[#00ADB5] rounded-lg flex items-center justify-center"><span className="text-xl font-bold text-white">A</span></div><h1 className="text-xl font-bold text-[#E0E3E8]">Arquiteck</h1></div>
                    <nav className="flex-1"><h2 className="px-2 text-xs font-semibold text-[#6C7581] uppercase tracking-wider mb-2">Menu</h2>
                        <ul>
                            <NavLink icon={LayoutDashboard} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
                            <NavLink icon={Briefcase} label="Proyectos" active={activeView === 'projects'} onClick={() => setActiveView('projects')} />
                            <NavLink icon={BarChart} label="Análisis" active={activeView === 'analysis'} onClick={() => setActiveView('analysis')} />
                            <NavLink icon={Building2} label="Metrópolis" active={activeView === 'metropolis'} onClick={() => setActiveView('metropolis')} />
                        </ul>
                    </nav>
                    <div className="mt-auto pt-4"><button onClick={() => setIsSettingsModalOpen(true)} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[#E0E3E8] hover:bg-[#14171E]"><Settings size={20} /><span>Configuración</span></button><button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[#E0E3E8] hover:bg-[#14171E]"><LogOut size={20} /><span>Cerrar Sesión</span></button></div>
                </aside>
                <div className="flex-1 flex flex-col">
                     <header className="flex items-center justify-between h-16 px-4 md:px-8 bg-[#101116] border-b border-white/5">
                        <div className="flex items-center justify-between gap-4 cursor-pointer w-full max-w-xs p-2 bg-[#242933] rounded-lg hover:bg-white/5 transition-colors"><div className="flex items-center gap-2"><Search className="text-[#6C7581]" size={18} /><span className="text-[#6C7581] text-sm">Buscar o comandar...</span></div><div className="text-xs text-[#6C7581] border border-white/20 rounded px-1.5 py-0.5 hidden sm:block">⌘K</div></div>
                        <div className="flex items-center gap-4"><button className="text-[#6C7581] hover:text-[#E0E3E8]"><Bell size={20}/></button><div className="w-px h-6 bg-[#6C7581]/50"></div><div onClick={() => setIsSettingsModalOpen(true)} className="flex items-center gap-3 cursor-pointer"><img src={userAvatarUrl} alt="Avatar de usuario" className="w-8 h-8 rounded-full" /><span className="text-[#E0E3E8] font-medium hidden sm:inline">{user.name}</span><ChevronDown size={16} className="text-[#6C7581]"/></div></div>
                    </header>
                    <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#14171E] pb-20">
                        {activeView === 'dashboard' && <DashboardView clients={clients} projects={projects} focusTasks={focusTasks} onUpdateTasks={setFocusTasks} inboxTasks={inboxTasks} handlers={handlers} timerState={timerState} taskToPlan={taskToPlan} />}
                        {activeView === 'projects' && <ProjectsView clients={clients} projects={projects} onCreateClient={handleCreateClient} onCreateProject={handleCreateProject} onUpdateProject={handleUpdateProject} onStartEditClient={handlers.handleStartEditClient} onStartEditProject={handlers.handleStartEditProject} />}
                        {activeView === 'analysis' && <AnalysisView distractions={distractions} />}
                        {activeView === 'metropolis' && <MetropolisView cityData={cityData} />}
                    </main>
                    <GlobalTimerBar 
                        activeTask={activeTask}
                        timer={timer}
                        isTimerActive={isTimerActive}
                        onToggleTimer={handleToggleTimer}
                    />
                </div>
            </div>
        </>
    );
};

export default App;
