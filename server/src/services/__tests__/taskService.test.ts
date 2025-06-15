import { createTaskService } from '../taskService';
import { TaskRepository } from '../../repositories/taskRepository';

const mockRepository: jest.Mocked<TaskRepository> = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('TaskService', () => {
  let service: any;

  beforeEach(() => {
    service = createTaskService(mockRepository);
    jest.clearAllMocks();
  });

  it('should create a task with valid data', async () => {
    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'medium' as const,
      dueDate: new Date('2025-12-31'),
    };

    const mockCreatedTask = {
      _id: '123',
      title: 'Test Task',
      description: 'Test Description',
      status: 'todo' as const,
      priority: 'medium' as const,
      dueDate: new Date('2025-12-31'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRepository.create.mockResolvedValue(mockCreatedTask as any);

    const result = await service.createTask(taskData);

    expect(mockRepository.create).toHaveBeenCalledWith(taskData);
    expect(result).toEqual(mockCreatedTask);
  });

  it('should throw error for empty title', async () => {
    const taskData = {
      title: '',
      priority: 'medium' as const,
      dueDate: new Date('2025-12-31'),
    };
    await expect(service.createTask(taskData)).rejects.toThrow('Title is required');
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error for past due date', async () => {
    const taskData = {
      title: 'Test Task',
      priority: 'medium' as const,
      dueDate: new Date('2020-01-01'), // Past date
    };
    await expect(service.createTask(taskData)).rejects.toThrow('Due date must be in the future');
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('should get all tasks', async () => {
    const mockTasks = [
      { 
        _id: '1', 
        title: 'Task 1', 
        description: 'Description 1',
        status: 'todo' as const,
        priority: 'medium' as const,
        dueDate: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { 
        _id: '2', 
        title: 'Task 2', 
        description: 'Description 2',
        status: 'done' as const,
        priority: 'high' as const,
        dueDate: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockRepository.findAll.mockResolvedValue(mockTasks as any);

    const result = await service.getAllTasks();

    expect(mockRepository.findAll).toHaveBeenCalledWith({});
    expect(result).toEqual(mockTasks);
    expect(result).toHaveLength(2);
  });

  it('should get tasks with priority filter', async () => {
    const filter = { priority: 'high' as const };
    const mockTasks = [{ 
      _id: '1', 
      title: 'High Priority Task', 
      description: 'Description',
      status: 'todo' as const,
      priority: 'high' as const,
      dueDate: new Date('2025-12-31'),
      createdAt: new Date(),
      updatedAt: new Date(),
    }];

    mockRepository.findAll.mockResolvedValue(mockTasks as any);

    const result = await service.getAllTasks(filter);

    expect(mockRepository.findAll).toHaveBeenCalledWith({ priority: 'high' });
    expect(result).toEqual(mockTasks);
  });

  it('should get task by id', async () => {
    const mockTask = { 
      _id: '123', 
      title: 'Found Task',
      description: 'Description',
      status: 'todo' as const,
      priority: 'medium' as const,
      dueDate: new Date('2025-12-31'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockRepository.findById.mockResolvedValue(mockTask as any);

    const result = await service.getTaskById('123');

    expect(mockRepository.findById).toHaveBeenCalledWith('123');
    expect(result).toEqual(mockTask);
  });

  it('should update a task', async () => {
    const updateData = { title: 'Updated Task' };
    const mockUpdatedTask = { 
      _id: '123', 
      title: 'Updated Task',
      description: 'Description',
      status: 'todo' as const,
      priority: 'medium' as const,
      dueDate: new Date('2025-12-31'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockRepository.update.mockResolvedValue(mockUpdatedTask as any);

    const result = await service.updateTask('123', updateData);

    expect(mockRepository.update).toHaveBeenCalledWith('123', updateData);
    expect(result).toEqual(mockUpdatedTask);
  });

  it('should delete a task', async () => {
    mockRepository.delete.mockResolvedValue(true);

    const result = await service.deleteTask('123');

    expect(mockRepository.delete).toHaveBeenCalledWith('123');
    expect(result).toBe(true);
  });
});