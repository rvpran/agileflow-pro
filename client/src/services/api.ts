import type { Task, CreateTaskData } from '../types/Task';

const API_BASE_URL = 'http://localhost:5000/api';

export interface ApiTaskFilters {
  priority?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformTask = (backendTask: any): Task => ({
  id: backendTask._id || backendTask.id,
  title: backendTask.title,
  status: backendTask.status,
  description: backendTask.description || '',
  priority: backendTask.priority,
  dueDate: backendTask.dueDate,
  createdAt: backendTask.createdAt,
  updatedAt: backendTask.updatedAt,
});

export const api = {
  async getTasks(filters?: ApiTaskFilters): Promise<Task[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.priority) {
        params.append('priority', filters.priority);
      }
      if (filters?.dueDateFrom) {
        params.append('dueDateFrom', filters.dueDateFrom);
      }
      if (filters?.dueDateTo) {
        params.append('dueDateTo', filters.dueDateTo);
      }

      const queryString = params.toString();
      const url = queryString
        ? `${API_BASE_URL}/tasks?${queryString}`
        : `${API_BASE_URL}/tasks`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();

      return (data.data || []).map(transformTask);
    } catch (error) {
      throw new Error(`Failed to fetch tasks from API: ${error}`);
    }
  },

  async createTask(taskData: CreateTaskData): Promise<Task> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error('Failed to create task');
      const data = await response.json();

      return transformTask(data.data);
    } catch (error) {
      throw new Error(`Failed to create new tasks from API: ${error}`);
    }
  },

  async updateTask(
    id: string,
    updates: Partial<CreateTaskData>
  ): Promise<Task> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update task');
      const data = await response.json();

      return transformTask(data.data);
    } catch (error) {
      throw new Error(`Failed to update tasks from API: ${error}`);
    }
  },

  async deleteTask(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete task');
    } catch (error) {
      throw new Error(`Failed to delete tasks from API: ${error}`);
    }
  },
};
