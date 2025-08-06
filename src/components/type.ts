// src/types.ts

export interface Client {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  clientId: number;
  name: string;
}

export interface BaseTask {
  id: number;
  name: string;
}

export interface InboxTask extends BaseTask {}

export interface FocusTask extends BaseTask {
  projectId: number;
  completed: boolean;
  pomodoros: number;
  value: number;
  paid: boolean;
}

// Este tipo combina ambas tareas para la Paleta de Comandos
export type AnyTask = InboxTask | FocusTask;