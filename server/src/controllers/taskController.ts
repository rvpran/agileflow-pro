import { Request, Response } from 'express';
import { TaskFilterValidator } from '../validators/TaskFilterValidator';

export const createTaskController = (
  taskService: any,
  taskFilterValidator: TaskFilterValidator
) => ({
  async getTasks(req: Request, res: Response) {
    try {
      const filter = taskFilterValidator.validateAndTransform(req.query);
      const tasks = await taskService.getAllTasks(filter);
      res.json({ success: true, data: tasks });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown error occurred while creatig';
      res.status(400).json({ success: false, error: errorMessage });
    }
  },

  async createTask(req: Request, res: Response) {
    try {
      const task = await taskService.createTask(req.body);
      res.status(201).json({ success: true, data: task });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown error occurred while creating';
      res.status(400).json({ success: false, error: errorMessage });
    }
  },

  async getTaskById(req: Request, res: Response) {
    try {
      const task = await taskService.getTaskById(req.params.id);
      if (!task) {
        return res
          .status(404)
          .json({ success: false, error: 'Task not found' });
      }
      res.json({ success: true, data: task });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown error occurred while fetching';
      res.status(400).json({ success: false, error: errorMessage });
    }
  },

  async updateTask(req: Request, res: Response) {
    try {
      const task = await taskService.updateTask(req.params.id, req.body);
      if (!task) {
        return res
          .status(404)
          .json({ success: false, error: 'Task not found' });
      }
      res.json({ success: true, data: task });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown error occurred while updating';
      res.status(400).json({ success: false, error: errorMessage });
    }
  },

  async deleteTask(req: Request, res: Response) {
    try {
      const deleted = await taskService.deleteTask(req.params.id);
      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, error: 'Task not found' });
      }
      res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown error occurred while deleting';
      res.status(400).json({ success: false, error: errorMessage });
    }
  },
});
