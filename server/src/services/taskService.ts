import { ITask, TaskPriority, TaskStatus } from '../models/Task';
import { TaskRepository } from '../repositories/taskRepository';
import { TaskFilterDto } from '../dto/TaskFilterDto'; // NEW IMPORT

export interface CreateTaskData {
  title: string;
  status?: TaskStatus;
  description?: string;
  priority: TaskPriority;
  dueDate: Date;
}

export interface TaskQuery {
  priority?: string;
  dueDate?: {
    $gte?: Date;
    $lte?: Date;
  };
}

const validateTaskData = (data: CreateTaskData): void => {
  if (!data.title || data.title.trim().length === 0) {
    throw new Error('Title is required');
  }
  if (data.title.length > 100) {
    throw new Error('Title cannot exceed 100 characters');
  }
  if (!data.priority) {
    throw new Error('Priority is required');
  }
  if (!data.dueDate || data.dueDate <= new Date()) {
    throw new Error('Due date must be in the future');
  }
};

const buildQuery = (filter: TaskFilterDto): TaskQuery => {
  const query: TaskQuery = {};

  if (filter.priority) {
    query.priority = filter.priority;
  }

  if (filter.dueDateFrom || filter.dueDateTo) {
    query.dueDate = {};
    if (filter.dueDateFrom) {
      query.dueDate.$gte = new Date(filter.dueDateFrom);
    }
    if (filter.dueDateTo) {
      query.dueDate.$lte = new Date(filter.dueDateTo);
    }
  }

  return query;
};

export const createTaskService = (taskRepository: TaskRepository) => ({
  async createTask(data: CreateTaskData): Promise<ITask> {
    validateTaskData(data);
    return await taskRepository.create(data);
  },

  async getAllTasks(filter: TaskFilterDto = {}): Promise<ITask[]> {
    const query = buildQuery(filter);
    return await taskRepository.findAll(query);
  },

  async getTaskById(id: string): Promise<ITask | null> {
    return await taskRepository.findById(id);
  },

  async updateTask(
    id: string,
    data: Partial<CreateTaskData>
  ): Promise<ITask | null> {
    if (
      data.title !== undefined &&
      (!data.title || data.title.trim().length === 0)
    ) {
      throw new Error('Title cannot be empty');
    }
    if (data.title && data.title.length > 100) {
      throw new Error('Title cannot exceed 100 characters');
    }
    if (data.dueDate && data.dueDate <= new Date()) {
      throw new Error('Due date must be in the future');
    }

    return await taskRepository.update(id, data);
  },

  async deleteTask(id: string): Promise<boolean> {
    return await taskRepository.delete(id);
  },
});
