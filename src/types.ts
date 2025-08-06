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

export interface InboxTask {
  id: number;
  name: string;
}

export interface FocusTask {
  id: number;
  projectId: number;
  name: string;
  completed: boolean;
  pomodoros: number;
  value: number;
  paid: boolean;
}

export type AnyTask = InboxTask | FocusTask;
