import { Task, ITask } from '../models/Task';
import { TaskQuery } from '../services/taskService';

export interface TaskRepository {
  create(taskData: Partial<ITask>): Promise<ITask>;
  findAll(query?: TaskQuery): Promise<ITask[]>;
  findById(id: string): Promise<ITask | null>;
  update(id: string, data: Partial<ITask>): Promise<ITask | null>;
  delete(id: string): Promise<boolean>;
}

export const createTaskRepository = (): TaskRepository => ({
  async create(taskData: Partial<ITask>): Promise<ITask> {
    const task = new Task(taskData);
    return await task.save();
  },

  async findAll(query: TaskQuery = {}): Promise<ITask[]> {
    return await Task.find(query).sort({ createdAt: -1 });
  },

  async findById(id: string): Promise<ITask | null> {
    return await Task.findById(id);
  },

  async update(id: string, data: Partial<ITask>): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  async delete(id: string): Promise<boolean> {
    const result = await Task.findByIdAndDelete(id);
    return result !== null;
  },
});
