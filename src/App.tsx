
import {
    LayoutDashboard, Briefcase, BarChart, Building2, Settings, LogOut, Search, Bell, ChevronDown
} from 'lucide-react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

// Importa los tipos
import { Client, Project, InboxTask, FocusTask, Building, User } from './types/index.ts';

// Importa el store de Zustand
import { useStore } from './store/store';
import { useTimerStore } from './features/timer/store/timerStore';
import { useTimer } from './features/timer/hooks/useTimer';

// Importa los componentes y vistas
import DashboardView from './pages/DashboardView';
import ProjectsView from './pages/ProjectsView';
import AnalysisView from './pages/AnalysisView';
import MetropolisView from './pages/MetropolisView';
import NotesView from './pages/NotesView';
import StrictPauseModal from './components/StrictPauseModal';
import SessionEndModal from './components/SessionEndModal';
import EditTaskModal from './components/EditTaskModal';
import EditItemModal from './components/EditItemModal';
import CustomTimeModal from './components/CustomTimeModal';
import SettingsModal from './components/SettingsModal';
import GlobalTimerBar from './features/timer/components/GlobalTimerBar';
import * as ArquiteckLogo from './components/ArquiteckLogo';

const App = () => {
    const location = useLocation();
    // --- ESTADO Y ACCIONES DESDE ZUSTAND ---
    const focusTasks = useStore(state => state.focusTasks);
    const clients = useStore(state => state.clients);
    const projects = useStore(state => state.projects);
    const inboxTasks = useStore(state => state.inboxTasks);
    const goals = useStore(state => state.goals);
    const distractions = useStore(state => state.distractions);
    const cityData = useStore(state => state.cityData);
    const user = useStore(state => state.user);
    const focusBreaks = useStore(state => state.focusBreaks);
    const taskToPlan = useStore(state => state.taskToPlan);
    const taskToEdit = useStore(state => state.taskToEdit);
    const editingClient = useStore(state => state.editingClient);
    const editingProject = useStore(state => state.editingProject);
    const isCustomTimeModalOpen = useStore(state => state.isCustomTimeModalOpen);
    const isSettingsModalOpen = useStore(state => state.isSettingsModalOpen);
    const theme = useStore(state => state.theme); // New

    const addClient = useStore(state => state.addClient);
    const updateClient = useStore(state => state.updateClient);
    const addProject = useStore(state => state.addProject);
    const updateProject = useStore(state => state.updateProject);
    const updateProjectDetails = useStore(state => state.updateProjectDetails);
    const updateGoal = useStore(state => state.updateGoal);
    const updateFocusTask = useStore(state => state.updateFocusTask);
    const updateUser = useStore(state => state.updateUser);
    const commitToFocus = useStore(state => state.commitToFocus);
    const incrementFocusBreaks = useStore(state => state.incrementFocusBreaks);
    const logDistraction = useStore(state => state.logDistraction);
    const deleteTask = useStore(state => state.deleteTask);
    const toggleComplete = useStore(state => state.toggleComplete);
    const addToInbox = useStore(state => state.addToInbox);
    const deleteFromInbox = useStore(state => state.deleteFromInbox);
    const setActiveView = useStore(state => state.setActiveView);
    const setTaskToPlan = useStore(state => state.setTaskToPlan);
    const setTaskToEdit = useStore(state => state.setTaskToEdit);
    const setEditingClient = useStore(state => state.setEditingClient);
    const setEditingProject = useStore(state => state.setEditingProject);
    const openCustomTimeModal = useStore(state => state.openCustomTimeModal);
    const openSettingsModal = useStore(state => state.openSettingsModal);
    const closeCustomTimeModal = useStore(state => state.closeCustomTimeModal);
    const closeSettingsModal = useStore(state => state.closeSettingsModal);
    const updateFocusTaskPomodoros = useStore(state => state.updateFocusTaskPomodoros);
    const incrementTotalPomodoros = useStore(state => state.incrementTotalPomodoros);

    const pomodoroDuration = useTimerStore(state => state.pomodoroDuration);
    const activeTaskId = useTimerStore(state => state.activeTaskId);
    const timer = useTimerStore(state => state.timer);
    const isTimerActive = useTimerStore(state => state.isTimerActive);
    const isPauseModalOpen = useTimerStore(state => state.isPauseModalOpen);
    const isEndModalOpen = useTimerStore(state => state.isEndModalOpen);
    const lastCompletedTask = useTimerStore(state => state.lastCompletedTask);
    const pomodoroNotes = useTimerStore(state => state.pomodoroNotes);
    const toggleTimer = useTimerStore(state => state.toggleTimer);
    const closePauseModal = useTimerStore(state => state.closePauseModal);
    const closeEndModal = useTimerStore(state => state.closeEndModal);
    const setPomodoroDuration = useTimerStore(state => state.setPomodoroDuration);
    const setLastCompletedTask = useTimerStore(state => state.setLastCompletedTask);
    const setIsTimerActive = useTimerStore(state => state.setIsTimerActive);
    const setIsPauseModalOpen = useTimerStore(state => state.setIsPauseModalOpen);
    const setIsEndModalOpen = useTimerStore(state => state.setIsEndModalOpen);
    const setActiveTaskId = useTimerStore(state => state.setActiveTaskId);
    const setTimer = useTimerStore(state => state.setTimer);

    // --- LÓGICA DEL TEMPORIZADOR ---
    useTimer();

    // --- DERIVED STATE ---
    const userAvatarUrl = `https://placehold.co/40x40/00ADB5/FFFFFF?text=${user.avatarLetter}`;

    // --- HANDLERS ---
    const handleBreakFocus = () => {
        setIsPauseModalOpen(false);
        setIsTimerActive(false);
        incrementFocusBreaks();
    };

    const handlers = {
        handleCommitToFocus: commitToFocus,
        handleCreateClient: addClient,
        handleCreateProject: addProject,
        handleToggleTimer: toggleTimer,
        handleIncrementFocusBreaks: incrementFocusBreaks,
        handleLogDistraction: logDistraction,
        handleDeleteTask: deleteTask,
        handleToggleComplete: toggleComplete,
        handleAddToInbox: addToInbox,
        handleDeleteFromInbox: deleteFromInbox,
        handleSelectTaskToPlan: setTaskToPlan,
        clearTaskToPlan: () => setTaskToPlan(null),
        handleStartEdit: setTaskToEdit,
        handleUpdateFocusTask: updateFocusTask,
        handleStartEditClient: setEditingClient,
        handleUpdateClient: updateClient,
        handleStartEditProject: setEditingProject,
        handleUpdateProjectDetails: updateProjectDetails,
        handleOpenCustomTimeModal: openCustomTimeModal,
        handleUpdateGoal: updateGoal,
    };

    

    const NavLink = ({ icon: Icon, label, to }: { icon: React.ElementType, label: string, to: string }) => (
        <li>
            <Link to={to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${location.pathname === to ? 'bg-[#00ADB5]/10 text-[#00ADB5] font-semibold' : 'text-[#E0E3E8] hover:bg-[#14171E]'}`}>
                <Icon size={20} />
                <span>{label}</span>
            </Link>
        </li>
    );

    return (
        <>
            <StrictPauseModal />
            <SessionEndModal />
            <EditTaskModal
                isOpen={taskToEdit !== null}
                onClose={() => setTaskToEdit(null)}
                onSave={updateFocusTask}
                task={taskToEdit}
            />
            <EditItemModal
                isOpen={editingClient !== null}
                onClose={() => setEditingClient(null)}
                onSave={updateClient}
                item={editingClient}
                title="Editar Cliente"
                fieldLabel="Nombre del Cliente"
            />
            <EditItemModal
                isOpen={editingProject !== null}
                onClose={() => setEditingProject(null)}
                onSave={updateProjectDetails}
                item={editingProject}
                title="Editar Proyecto"
                fieldLabel="Nombre del Proyecto"
            />
            <CustomTimeModal />
            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={closeSettingsModal}
                onSave={updateUser}
                user={user}
            />
            <div className={`flex h-screen w-full bg-[#101116] font-sans text-[#E0E3E8] ${theme}`}>
                <aside className="w-64 bg-[#101116] flex-col p-4 border-r border-white/5 hidden md:flex">
                    <div className="flex items-center gap-3 mb-10 p-2">
                        <ArquiteckLogo.LogoMark size={40} accent="#00ADB5" />
                        <ArquiteckLogo.Wordmark titleSize="text-xl" darkText={false} />
                    </div>
                    <nav className="flex-1">
                        <h2 className="px-2 text-xs font-semibold text-[#6C7581] uppercase tracking-wider mb-2">Menu</h2>
                        <ul>
                            <NavLink icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
                            <NavLink icon={Briefcase} label="Proyectos" to="/projects" />
                            <NavLink icon={BarChart} label="Análisis" to="/analysis" />
                            <NavLink icon={Building2} label="Metrópolis" to="/metropolis" />
                            <NavLink icon={Bell} label="Notas" to="/notes" />
                        </ul>
                    </nav>
                    <div className="mt-auto pt-4">
                        <button onClick={openSettingsModal} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[#E0E3E8] hover:bg-[#14171E]">
                            <Settings size={20} />
                            <span>Configuración</span>
                        </button>
                        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[#E0E3E8] hover:bg-[#14171E]">
                            <LogOut size={20} />
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </aside>
                <div className="flex-1 flex flex-col">
                     <header className="flex items-center justify-between h-16 px-4 md:px-8 bg-[#101116] border-b border-white/5">
                        <div className="flex items-center justify-between gap-4 cursor-pointer w-full max-w-xs p-2 bg-[#242933] rounded-lg hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-2">
                                <Search className="text-[#6C7581]" size={18} />
                                <span className="text-[#6C7581] text-sm">Buscar o comandar...</span>
                            </div>
                            <div className="text-xs text-[#6C7581] border border-white/20 rounded px-1.5 py-0.5 hidden sm:block">⌘K</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="text-[#6C7581] hover:text-[#E0E3E8]"><Bell size={20}/></button>
                            <div className="w-px h-6 bg-[#6C7581]/50"></div>
                            <div onClick={openSettingsModal} className="flex items-center gap-3 cursor-pointer">
                                <img src={userAvatarUrl} alt="Avatar de usuario" className="w-8 h-8 rounded-full" />
                                <span className="text-[#E0E3E8] font-medium hidden sm:inline">{user.name}</span>
                                <ChevronDown size={16} className="text-[#6C7581]"/>
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#14171E] pb-20">
                        <Routes>
                            <Route path="/dashboard" element={<DashboardView />} />
                            <Route path="/projects" element={<ProjectsView />} />
                            <Route path="/analysis" element={<AnalysisView distractions={distractions} focusBreaks={focusBreaks} />} />
                            <Route path="/metropolis" element={<MetropolisView cityData={cityData} />} />
                            <Route path="/notes" element={<NotesView />} />
                            <Route path="*" element={<DashboardView />} /> {/* Default route */}
                        </Routes>
                    </main>
                    <GlobalTimerBar />
                </div>
            </div>
        </>
    );
};

export default App;