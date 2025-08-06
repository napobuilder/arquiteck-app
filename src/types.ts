export interface Client { id: number; name: string; }
export interface Project { id: number; clientId: number; name: string; billingType: 'task' | 'retainer'; retainerValue: number; }
export interface Task { id: number; name: string; }
export interface InboxTask extends Task {}
export interface FocusTask extends Task { projectId: number; completed: boolean; pomodoros: number; value: number; paid: boolean; priority: 'low' | 'medium' | 'high'; }
export interface Goal { id: 'income' | 'focus'; target: number; }
export interface Building { id: number; heightClass: string; colorClass: string; windowCount: number; }
export interface User { name: string; avatarLetter: string; }