export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  description?: string;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  status?: TaskStatus;
  description?: string;
  priority: TaskPriority;
  dueDate: string;
}
