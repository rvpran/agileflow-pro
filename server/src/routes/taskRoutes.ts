import { Router } from 'express';
import { createTaskController } from '../controllers/taskController';
import { createTaskService } from '../services/taskService';
import { createTaskRepository } from '../repositories/taskRepository';
import { createTaskFilterValidator } from '../validators/TaskFilterValidator';

const taskRepository = createTaskRepository();
const taskService = createTaskService(taskRepository);
const taskFilterValidator = createTaskFilterValidator();
const taskController = createTaskController(taskService, taskFilterValidator);

const router = Router();

router.post('/', taskController.createTask);

router.get('/', taskController.getTasks);

router.get('/:id', taskController.getTaskById);

router.put('/:id', taskController.updateTask);

router.delete('/:id', taskController.deleteTask);

export default router;
