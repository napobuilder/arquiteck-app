
// src/App.tsx

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Briefcase, DollarSign, BrainCircuit, Settings, LogOut, Search, Bell, ChevronDown } from 'lucide-react';

// Importa los tipos
import type { Client, Project, InboxTask, FocusTask } from './types';

// Importa los componentes
import CommandPalette from './components/CommandPalette';
import DashboardView from './components/DashboardView';
import FinancesView from './components/FinancesView';
import FocusPlanView from './components/FocusPlanView';

const App = () => {
  // --- ESTADO CENTRALIZADO ---
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [inboxTasks, setInboxTasks] = useState<InboxTask[]>([]);
  const [focusTasks, setFocusTasks] = useState<FocusTask[]>([]);
  const [taskToPlan, setTaskToPlan] = useState<InboxTask | null>(null);
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'finances', 'foco'
  const [focusBreaks, setFocusBreaks] = useState(0);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // --- LOCAL STORAGE PERSISTENCE ---
  useEffect(() => {
    const savedState = localStorage.getItem('arquiteckAppState');
    if (savedState) {
      const { clients: savedClients, projects: savedProjects, inboxTasks: savedInboxTasks, focusTasks: savedFocusTasks, focusBreaks: savedFocusBreaks } = JSON.parse(savedState);
      setClients(savedClients || []);
      setProjects(savedProjects || []);
      setInboxTasks(savedInboxTasks || []);
      setFocusTasks(savedFocusTasks || []);
      setFocusBreaks(savedFocusBreaks || 0);
    }
  }, []);

  const handleSaveState = () => {
    const appState = JSON.stringify({ clients, projects, inboxTasks, focusTasks, focusBreaks });
    localStorage.setItem('arquiteckAppState', appState);
    alert('Estado guardado temporalmente!');
  };

  // --- MANEJADORES DE LÓGICA ---
  const handleCreateClient = (clientName: string): Client => {
    const newClient = { id: Date.now(), name: clientName };
    setClients(prev => [...prev, newClient]);
    return newClient;
  };
  const handleCreateProject = (projectName: string, clientId: number): Project => {
    const newProject = { id: Date.now(), clientId, name: projectName };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };
  const handleIncrementFocusBreaks = () => setFocusBreaks(prev => prev + 1);
  const handleResetFocusBreaks = () => setFocusBreaks(0);

  const handleDeleteClient = (clientId: number) => {
    const projectsToDelete = projects.filter(p => p.clientId === clientId).map(p => p.id);
    setFocusTasks(prev => prev.filter(t => !projectsToDelete.includes(t.projectId)));
    setProjects(prev => prev.filter(p => p.clientId !== clientId));
    setClients(prev => prev.filter(c => c.id !== clientId));
  };

  const handleCommitToFocus = (taskData: { id: number; clientName: string; projectName: string; name: string; value: number; isNew: boolean; }) => {
    let client = clients.find(c => c.name.toLowerCase() === taskData.clientName.toLowerCase());
    if (!client) client = handleCreateClient(taskData.clientName);

    let project = projects.find(p => p.name.toLowerCase() === taskData.projectName.toLowerCase() && p.clientId === client.id);
    if (!project) project = handleCreateProject(taskData.projectName, client.id);

    const newTask: FocusTask = {
      id: taskData.id,
      projectId: project.id,
      name: taskData.name,
      pomodoros: 0,
      completed: false,
      value: taskData.value,
      paid: false
    };

    setFocusTasks(prev => [newTask, ...prev]);

    if (!taskData.isNew) {
      setInboxTasks(prev => prev.filter(t => t.id !== taskData.id));
    }
    setTaskToPlan(null);
  };

  const handlers = {
    handleAddToInbox: (taskName: string) => { setInboxTasks(prev => [{ id: Date.now(), name: taskName }, ...prev]); setIsCommandPaletteOpen(false); },
    handleDeleteFromInbox: (taskId: number) => setInboxTasks(prev => prev.filter(t => t.id !== taskId)),
        handleSelectTaskToPlan: (task: InboxTask) => {
      setTaskToPlan(task);
      setActiveView('foco');
    },
    handleCommitToFocus,
    handleCreateClient,
    handleDeleteClient,
    handleCreateProject,
    setFocusTasks,
    handleIncrementFocusBreaks,
    handleResetFocusBreaks,
    setActiveView: (view: string) => { setActiveView(view); setIsCommandPaletteOpen(false); },
    handleSaveState,
  };

  const user = { name: "Napoleon B.", avatarUrl: "https://placehold.co/40x40/00ADB5/FFFFFF?text=N" };
  const NavLink = ({ icon: Icon, label, active = false, onClick = () => { } }: { icon: React.ElementType, label: string, active?: boolean, onClick?: () => void }) => (
    <li>
      <a href="#" onClick={(e) => { e.preventDefault(); onClick(); }} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${active ? 'bg-[#00ADB5]/10 text-[#00ADB5] font-semibold' : 'text-[#E0E3E8] hover:bg-[#14171E]'}`}>
        <Icon size={20} />
        <span>{label}</span>
      </a>
    </li>
  );

  return (
    <>
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} clients={clients} projects={projects} tasks={[...inboxTasks, ...focusTasks]} handlers={handlers} />
      <div className="flex h-screen w-full bg-[#101116] font-sans text-[#E0E3E8]">
        <aside className="w-64 bg-[#101116] flex flex-col p-4 border-r border-white/5">
          <div className="flex items-center gap-3 mb-10 p-2">
            <div className="w-10 h-10 bg-[#00ADB5] rounded-lg flex items-center justify-center"><span className="text-xl font-bold text-white">A</span></div>
            <h1 className="text-xl font-bold text-[#E0E3E8]">Arquiteck</h1>
          </div>
          <nav className="flex-1">
            <h2 className="px-2 text-xs font-semibold text-[#6C7581] uppercase tracking-wider mb-2">Menu</h2>
            <ul>
              <NavLink icon={LayoutDashboard} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
              <NavLink icon={DollarSign} label="Finanzas" active={activeView === 'finances'} onClick={() => setActiveView('finances')} />
              <NavLink icon={Briefcase} label="Proyectos" />
              <NavLink icon={BrainCircuit} label="Foco" active={activeView === 'foco'} onClick={() => setActiveView('foco')} />
            </ul>
          </nav>
          <div className="mt-auto pt-4">
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[#E0E3E8] hover:bg-[#14171E]"><Settings size={20} /><span>Configuración</span></button>
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[#E0E3E8] hover:bg-[#14171E]"><LogOut size={20} /><span>Cerrar Sesión</span></button>
          </div>
        </aside>
        <div className="flex-1 flex flex-col">
          <header className="flex items-center justify-between h-16 px-8 bg-[#101116] border-b border-white/5">
            <div className="flex items-center justify-between gap-4 cursor-pointer w-72 p-2 bg-[#242933] rounded-lg hover:bg-white/5 transition-colors" onClick={() => setIsCommandPaletteOpen(true)}>
              <div className="flex items-center gap-2"><Search className="text-[#6C7581]" size={18} /><span className="text-[#6C7581] text-sm">Buscar o comandar...</span></div>
              <div className="text-xs text-[#6C7581] border border-white/20 rounded px-1.5 py-0.5">⌘K</div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={handleSaveState} className="bg-[#00ADB5] text-white px-4 py-2 rounded-md text-sm hover:bg-[#00c5cf]">Guardar Estado</button>
              <button className="text-[#6C7581] hover:text-[#E0E3E8]"><Bell size={20} /></button>
              <div className="w-px h-6 bg-[#6C7581]/50"></div>
              <div className="flex items-center gap-3">
                <img src={user.avatarUrl} alt="Avatar de usuario" className="w-8 h-8 rounded-full" />
                <span className="text-[#E0E3E8] font-medium">{user.name}</span>
                <ChevronDown size={16} className="text-[#6C7581]" />
              </div>
            </div>
          </header>
          <main className="flex-1 p-8 overflow-y-auto bg-[#14171E]">
            {activeView === 'dashboard' && <DashboardView inboxTasks={inboxTasks} focusTasks={focusTasks} handlers={handlers} />}
            {activeView === 'finances' && <FinancesView clients={clients} projects={projects} tasks={focusTasks} onUpdateTasks={handlers.setFocusTasks} onDeleteClient={handlers.handleDeleteClient} />}
            {activeView === 'foco' && <FocusPlanView taskToPlan={taskToPlan} onCommitTask={handlers.handleCommitToFocus} />}
          </main>
        </div>
      </div>
    </>
  );
};

export default App;
