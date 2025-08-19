export interface Client { 
    id: number; 
    name: string; 
}

export interface Project { 
    id: number; 
    clientId: number; 
    name: string; 
    billingType: 'task' | 'retainer'; 
    retainerValue: number; 
}

export interface Task { 
    id: number; 
    name: string; 
}

export interface InboxTask extends Task {}

export interface FocusTask extends Task { 
    projectId: number; 
    clientId: number; 
    completed: boolean; 
    pomodoros: number; 
    value: number; 
    paid: boolean; 
    priority: 'low' | 'medium' | 'high'; 
    completedAt: number | null; 
}

export interface Goal { 
    id: 'income' | 'focus'; 
    target: number; 
}

export interface Building { 
    id: number; 
    heightClass: string; 
    colorClass: string; 
    windowCount: number; 
    clientId: number; 
    projectId: number; 
    name: string; 
    x: number; 
    width: number; 
    height: number; 
    layer: 'back' | 'mid' | 'front'; 
}

export interface User { 
    name: string; 
    avatarLetter: string; 
}

export interface PomodoroNote{
    id: number;
    content: string;
    timestamp: number;
    taskName?: string;
}

export interface CompletedPomodoro {
    id: number;
    taskId: number;
    duration: number; // in minutes
    timestamp: number; // Date.now()
    value: number; // value of the task at the time of completion
    clientId: number;
    projectId: number;
}