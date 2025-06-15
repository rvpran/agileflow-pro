import { createTaskRepository } from '../taskRepository';
import { Task } from '../../models/Task';

jest.mock('../../models/Task');
const MockedTask = Task as jest.MockedClass<typeof Task>;

describe('TaskRepository', () => {
  let repository: any;

  beforeEach(() => {
    repository = createTaskRepository();
    jest.clearAllMocks();
  });

  it('should create a new task', async () => {
    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      status: 'todo',
      priority: 'medium',
    };

    const mockSave = jest.fn().mockResolvedValue({
      _id: '123',
      ...taskData,
    });

    MockedTask.mockImplementation(() => ({
      save: mockSave,
    }) as any);

    const result = await repository.create(taskData);

    expect(MockedTask).toHaveBeenCalledWith(taskData);
    expect(mockSave).toHaveBeenCalled();
    expect(result._id).toBe('123');
  });

  it('should find all tasks', async () => {
    const mockTasks = [
      { _id: '1', title: 'Task 1', status: 'todo' },
      { _id: '2', title: 'Task 2', status: 'done' },
    ];

    const mockSort = jest.fn().mockResolvedValue(mockTasks);
    const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
    MockedTask.find = mockFind;

    const result = await repository.findAll();

    expect(MockedTask.find).toHaveBeenCalledWith({});
    expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(result).toEqual(mockTasks);
    expect(result).toHaveLength(2);
  });

  it('should find task by id', async () => {
    const mockTask = { _id: '123', title: 'Found Task' };
    MockedTask.findById = jest.fn().mockResolvedValue(mockTask);

    const result = await repository.findById('123');

    expect(MockedTask.findById).toHaveBeenCalledWith('123');
    expect(result).toEqual(mockTask);
  });

  it('should update a task', async () => {
    const updatedTask = { _id: '123', title: 'Updated Task' };
    MockedTask.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedTask);

    const result = await repository.update('123', { title: 'Updated Task' });

    expect(MockedTask.findByIdAndUpdate).toHaveBeenCalledWith(
      '123',
      { title: 'Updated Task' },
      { new: true, runValidators: true }
    );
    expect(result).toEqual(updatedTask);
  });
});