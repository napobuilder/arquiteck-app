import { create } from 'zustand';
import { persist }  from 'zustand/middleware';
import { 
    Client, Project, InboxTask, FocusTask, Goal, Building, User 
} from '../types/index.ts';

// Interfaz del estado
interface AppState {
    clients: Client[];
    projects: Project[];
    inboxTasks: InboxTask[];
    focusTasks: FocusTask[];
    goals: Goal[];
    distractions: string[];
    cityData: Building[];
    totalPomodoros: number;

    user: User;

    activeView: string;
    focusBreaks: number;


    // Estado de la UI
    taskToPlan: InboxTask | null;
    taskToEdit: FocusTask | null;
    editingClient: Client | null;
    editingProject: Project | null;
    isCustomTimeModalOpen: boolean;
    isSettingsModalOpen: boolean;

    // Acciones
    addClient: (name: string) => void;
    updateClient: (updatedClient: Client) => void;
    addProject: (name: string, clientId: number) => void;
    updateProject: (id: number, key: string, value: any) => void;
    updateProjectDetails: (updatedProject: Project) => void;
    updateGoal: (id: 'income' | 'focus', newTarget: number) => void;
    updateFocusTask: (updatedTask: FocusTask) => void;
    updateUser: (updatedUser: User) => void;
    commitToFocus: (taskData: any) => void;
    updateFocusTaskPomodoros: (taskId: number, pomodoros: number) => void;
    incrementTotalPomodoros: () => void;

    incrementFocusBreaks: () => void;
    logDistraction: (reason: string) => void;
    deleteTask: (id: number) => void;
    toggleComplete: (id: number) => void;
    addToInbox: (name: string) => void;
    deleteFromInbox: (id: number) => void;

    setActiveView: (view: string) => void;
    setTaskToPlan: (task: InboxTask | null) => void;
    setTaskToEdit: (task: FocusTask | null) => void;
    setEditingClient: (client: Client | null) => void;
    setEditingProject: (project: Project | null) => void;
    openCustomTimeModal: () => void;
    openSettingsModal: () => void;
    closeCustomTimeModal: (minutes?: number) => void;
    closeSettingsModal: () => void;
}

// Creación del store con persistencia
export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            // --- ESTADO INICIAL ---
            clients: [],
            projects: [],
            inboxTasks: [],
            focusTasks: [],
            goals: [{ id: 'income', target: 2000 }, { id: 'focus', target: 20 }],
            distractions: [],
            cityData: [],
            totalPomodoros: 0,
            user: { name: "Usuario", avatarLetter: "U" },

            activeView: 'dashboard',
            focusBreaks: 0,


            taskToPlan: null,
            taskToEdit: null,
            editingClient: null,
            editingProject: null,
            isCustomTimeModalOpen: false,
            isSettingsModalOpen: false,

            // --- ACCIONES ---
            addClient: (name) => set(state => ({ clients: [...state.clients, { id: Date.now(), name }] })),
            updateClient: (updatedClient) => set(state => ({
                clients: state.clients.map(c => c.id === updatedClient.id ? updatedClient : c),
                editingClient: null
            })),
            addProject: (name, clientId) => set(state => ({
                projects: [...state.projects, { id: Date.now(), clientId, name, billingType: 'task', retainerValue: 0 }]
            })),
            updateProject: (id, key, value) => set(state => ({
                projects: state.projects.map(p => p.id === id ? { ...p, [key]: value } : p)
            })),
            updateProjectDetails: (updatedProject) => set(state => ({
                projects: state.projects.map(p => p.id === updatedProject.id ? { ...p, name: updatedProject.name } : p),
                editingProject: null
            })),
            updateGoal: (id, newTarget) => set(state => ({
                goals: state.goals.map(g => g.id === id ? { ...g, target: newTarget } : g)
            })),
            updateFocusTask: (updatedTask) => set(state => ({
                focusTasks: state.focusTasks.map(t => t.id === updatedTask.id ? updatedTask : t),
                taskToEdit: null
            })),
            updateUser: (updatedUser) => set({ user: updatedUser, isSettingsModalOpen: false }),

            commitToFocus: (taskData) => {
                let { projects, clients } = get();
                let projectId = -2; // Default para tareas personales

                if (taskData.focusType === 'billable' || taskData.focusType === 'internal') {
                    let project = projects.find(p => p.name === taskData.projectName);
                    if (!project) {
                        let clientId = -1; // Default para interno
                        if (taskData.focusType === 'billable') {
                            let client = clients.find(c => c.name === taskData.clientName);
                            if (!client) {
                                client = { id: Date.now(), name: taskData.clientName };
                                set(state => ({ clients: [...state.clients, client] }));
                            }
                            clientId = client.id;
                        }
                        project = { id: Date.now(), clientId, name: taskData.projectName, billingType: 'task', retainerValue: 0 };
                        set(state => ({ projects: [...state.projects, project] }));
                    }
                    projectId = project.id;
                }

                const newTask: FocusTask = { id: taskData.id, projectId: projectId, name: taskData.name, pomodoros: 0, completed: false, value: taskData.value, paid: false, priority: taskData.priority };

                set(state => ({
                    focusTasks: [newTask, ...state.focusTasks],
                    inboxTasks: taskData.isFromInbox ? state.inboxTasks.filter(t => t.id !== taskData.id) : state.inboxTasks
                }));
            },

            updateFocusTaskPomodoros: (taskId, pomodoros) => set(state => ({
                focusTasks: state.focusTasks.map(task => task.id === taskId ? { ...task, pomodoros: pomodoros } : task)
            })),
            incrementTotalPomodoros: () => set(state => ({ totalPomodoros: state.totalPomodoros + 1 })),

            incrementFocusBreaks: () => set(state => ({ focusBreaks: state.focusBreaks + 1 })),
            logDistraction: (reason) => set(state => ({
                distractions: [...state.distractions, reason],
                isPauseModalOpen: false
            })),
            deleteTask: (id) => set(state => ({ focusTasks: state.focusTasks.filter(t => t.id !== id) })),
            toggleComplete: (id) => set(state => ({
                focusTasks: state.focusTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
            })),
            addToInbox: (name) => set(state => ({ inboxTasks: [...state.inboxTasks, { id: Date.now(), name }] })),
            deleteFromInbox: (id) => set(state => ({ inboxTasks: state.inboxTasks.filter(t => t.id !== id) })),

            setActiveView: (view) => set({ activeView: view }),
            setTaskToPlan: (task) => set({ taskToPlan: task }),
            setTaskToEdit: (task) => set({ taskToEdit: task }),
            setEditingClient: (client) => set({ editingClient: client }),
            setEditingProject: (project) => set({ editingProject: project }),
            openCustomTimeModal: () => set({ isCustomTimeModalOpen: true }),
            openSettingsModal: () => set({ isSettingsModalOpen: true }),

            closeCustomTimeModal: (minutes) => {
                if (minutes) { /* This action will be handled by timerStore now */ }
                set({ isCustomTimeModalOpen: false });
            },
            closeSettingsModal: () => set({ isSettingsModalOpen: false }),
        }),
        {
            name: 'arquiteck-storage', // Nombre para el localStorage
            getStorage: () => localStorage, // Usar localStorage para la persistencia
        }
    )
);