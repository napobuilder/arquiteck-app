import { create } from 'zustand';
import { persist }  from 'zustand/middleware';
import { 
    Client, Project, InboxTask, FocusTask, Goal, Building, User, CompletedPomodoro 
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
    completedPomodoros: CompletedPomodoro[]; // New property

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

    shortBreakDuration: number;
    longBreakDuration: number;
    pomodorosUntilLongBreak: number;
    isFocusSoundEnabled: boolean;
    isPomodoroEndSoundEnabled: boolean;
    soundVolume: number;
    theme: 'light' | 'dark';

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

    setShortBreakDuration: (minutes: number) => void;
    setLongBreakDuration: (minutes: number) => void;
    setPomodorosUntilLongBreak: (count: number) => void;
    toggleFocusSound: () => void;
    togglePomodoroEndSound: () => void;
    setSoundVolume: (volume: number) => void;
    setTheme: (theme: 'light' | 'dark') => void;
    addBuildingToCity: (clientId: number, projectId: number, focusTaskId: number) => void;
    resetState: () => void; // New action for resetting state
    addCompletedPomodoro: (pomodoro: CompletedPomodoro) => void; // New action
}

// Define initial state outside the store creation for easy reset
const initialState = {
    clients: [],
    projects: [],
    inboxTasks: [],
    focusTasks: [],
    goals: [{ id: 'income', target: 2000 }, { id: 'focus', target: 20 }] as Goal[],
    distractions: [],
    cityData: [],
    totalPomodoros: 0,
    completedPomodoros: [], // Initialize as empty array
    user: { name: "Usuario", avatarLetter: "U" },

    activeView: 'dashboard',
    focusBreaks: 0,

    taskToPlan: null,
    taskToEdit: null,
    editingClient: null,
    editingProject: null,
    isCustomTimeModalOpen: false,
    isSettingsModalOpen: false,

    shortBreakDuration: 5,
    longBreakDuration: 15,
    pomodorosUntilLongBreak: 4,
    isFocusSoundEnabled: false,
    isPomodoroEndSoundEnabled: true,
    soundVolume: 0.5,
    theme: 'dark' as 'light' | 'dark',
};

// Creación del store con persistencia
export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            // --- ESTADO INICIAL ---
            ...initialState, // Use spread to initialize with initialState
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
                let assignedClientId = -2; // Default para tareas personales (sin cliente)

                if (taskData.focusType === 'billable' || taskData.focusType === 'internal') {
                    let project = projects.find(p => p.name === taskData.projectName);
                    if (!project) {
                        let clientIdToAssign = -1; // Default para interno
                        if (taskData.focusType === 'billable') {
                            let client = clients.find(c => c.name === taskData.clientName);
                            if (!client) {
                                client = { id: Date.now(), name: taskData.clientName };
                                set(state => ({ clients: [...state.clients, client] }));
                            }
                            clientIdToAssign = client.id;
                        }
                        assignedClientId = clientIdToAssign; // Asignar el clientId determinado
                        project = { id: Date.now(), clientId: clientIdToAssign, name: taskData.projectName, billingType: 'task', retainerValue: 0 };
                        set(state => ({ projects: [...state.projects, project] }));
                    } else {
                        assignedClientId = project.clientId; // Si el proyecto ya existe, usar su clientId
                    }
                    projectId = project.id;
                }

                const newTask: FocusTask = { id: taskData.id, projectId: projectId, clientId: assignedClientId, name: taskData.name, pomodoros: 0, completed: false, value: taskData.value, paid: false, priority: taskData.priority, completedAt: null };

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
                distractions: [...state.distractions, reason]
            })),
            deleteTask: (id) => set(state => ({ focusTasks: state.focusTasks.filter(t => t.id !== id) })),
            toggleComplete: (id) => set(state => ({
                focusTasks: state.focusTasks.map(t => {
                    const updatedTask = t.id === id
                        ? { ...t, completed: !t.completed, completedAt: t.completed ? null : Date.now() }
                        : t;
                    if (t.id === id) {
                        console.log('Task toggled complete/incomplete:', updatedTask); // Debug log
                    }
                    return updatedTask;
                })
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

            setShortBreakDuration: (minutes) => set({ shortBreakDuration: minutes }),
            setLongBreakDuration: (minutes) => set({ longBreakDuration: minutes }),
            setPomodorosUntilLongBreak: (count) => set({ pomodorosUntilLongBreak: count }),
            toggleFocusSound: () => set(state => ({ isFocusSoundEnabled: !state.isFocusSoundEnabled })),
            togglePomodoroEndSound: () => set(state => ({ isPomodoroEndSoundEnabled: !state.isPomodoroEndSoundEnabled })),
            setSoundVolume: (volume) => set({ soundVolume: volume }),
            setTheme: (theme) => set({ theme: theme }),

            resetState: () => { // New resetState action
                localStorage.removeItem('arquiteck-storage'); // Clear persisted data
                set(() => initialState); // Reset to initial state, replacing current state
            },

            addCompletedPomodoro: (pomodoro) => set(state => {
                return ({ 
                completedPomodoros: [...state.completedPomodoros, pomodoro]
            });
            }),

            addBuildingToCity: (clientId: number, projectId: number, focusTaskId: number) => {
                const { cityData, clients, projects, focusTasks } = get(); // Get clients, projects, focusTasks
                const viewBoxWidth = 800;
                const layerOrder: Building['layer'][] = ['back', 'mid', 'front'];
                const nextLayer = layerOrder[cityData.length % layerOrder.length];

                let newBuilding: Building | null = null;
                const MAX_ATTEMPTS = 20;

                // Find client, project, and task names
                const client = clients.find(c => c.id === clientId);
                const project = projects.find(p => p.id === projectId);
                const task = focusTasks.find(t => t.id === focusTaskId);

                let clientName = client?.name || '';
                let projectName = project?.name || '';
                const taskName = task?.name || 'Unknown Task';

                if (projectId === -2) { // Personal task
                    projectName = 'Personal';
                    clientName = ''; // No client for personal tasks
                } else if (clientId === -1) { // Internal project
                    clientName = 'Interno';
                }

                const buildingName = `${clientName ? clientName + ' - ' : ''}${projectName ? projectName + ' - ' : ''}${taskName}`;

                for (let i = 0; i < MAX_ATTEMPTS; i++) {
                    const potentialWidth = Math.floor(Math.random() * 40) + 40;
                    const potentialHeight = Math.floor(Math.random() * 150) + 50;
                    const potentialX = Math.floor(Math.random() * (viewBoxWidth - potentialWidth));

                    const proximityThreshold = 15;
                    const isTooClose = cityData.some(b => 
                        b.layer === nextLayer &&
                        potentialX < b.x + b.width + proximityThreshold &&
                        potentialX + potentialWidth + proximityThreshold > b.x
                    );

                    if (!isTooClose) {
                        newBuilding = {
                            id: Date.now(),
                            width: potentialWidth,
                            height: potentialHeight,
                            x: potentialX,
                            layer: nextLayer,
                            clientId: clientId, // Pass clientId
                            projectId: projectId, // Pass projectId
                            name: buildingName, // Pass constructed name
                            // Re-introducing these properties
                            heightClass: `h-${Math.floor(Math.random() * 3) + 1}`, // Example: h-1, h-2, h-3
                            colorClass: `color-${Math.floor(Math.random() * 5) + 1}`, // Example: color-1 to color-5
                            windowCount: Math.floor(Math.random() * 5) + 1, // Example: 1 to 5 windows
                        };
                        break;
                    }
                }

                if (newBuilding) {
                    set({ cityData: [...cityData, newBuilding] });
                }
              },
        }),
        {
            name: 'arquiteck-storage', // Nombre para el localStorage
            storage: {
                getItem: (name) => {
                    const storedValue = localStorage.getItem(name);
                    return storedValue ? JSON.parse(storedValue) : null;
                },
                setItem: (name, value) => {
                    localStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: (name) => localStorage.removeItem(name),
            },
        }
    )
);