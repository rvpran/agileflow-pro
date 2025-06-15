import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskForm from './TaskForm';
import type { Task } from '../types/Task';

describe('TaskForm Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
  };

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    priority: 'medium',
    dueDate: '2025-06-20',
    createdAt: '2025-06-14T10:30:00Z',
    updatedAt: '2025-06-14T10:30:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the task form dialog', () => {
    render(<TaskForm {...defaultProps} />);

    expect(screen.getByText('Create New Task')).toBeTruthy();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /create task/i })).toBeTruthy();
  });

  it('should submit form successfully with valid data', async () => {
    mockOnSubmit.mockResolvedValue(mockTask);

    render(<TaskForm {...defaultProps} />);

    const titleInput = screen.getByRole('textbox', { name: /task title/i });
    fireEvent.change(titleInput, { target: { value: 'New Task' } });

    const dateInput = screen.getByLabelText(/due date/i);
    fireEvent.change(dateInput, { target: { value: '2025-06-20' } });

    fireEvent.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    expect(mockOnClose).toHaveBeenCalled();
  });
});
