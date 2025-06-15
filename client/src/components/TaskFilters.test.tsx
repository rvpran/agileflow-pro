import { render, screen, fireEvent } from '@testing-library/react';
import TaskFilters from './TaskFilters';
import type { TaskFilters as TaskFiltersType } from './TaskFilters';

describe('TaskFilters Component', () => {
  const mockOnFiltersChange = jest.fn();
  const mockOnClearFilters = jest.fn();

  const defaultProps = {
    filters: {} as TaskFiltersType,
    onFiltersChange: mockOnFiltersChange,
    onClearFilters: mockOnClearFilters,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render filters button', () => {
    render(<TaskFilters {...defaultProps} />);

    expect(screen.getByText('Filters')).toBeTruthy();
    expect(screen.getByRole('button', { name: /filters/i })).toBeTruthy();
  });

  it('should show filter options when filters button is clicked', () => {
    render(<TaskFilters {...defaultProps} />);

    const filtersButton = screen.getByRole('button', { name: /filters/i });

    fireEvent.click(filtersButton);

    expect(screen.getByText('Filter Tasks')).toBeTruthy();

    expect(screen.getByRole('combobox')).toBeTruthy();

    const dateInputs = screen
      .getAllByDisplayValue('')
      .filter((input) => input.getAttribute('type') === 'date');
    expect(dateInputs).toHaveLength(2);

    expect(filtersButton).toBeTruthy();
  });

  it('should display active filters as chips', () => {
    const filtersWithValues: TaskFiltersType = {
      priority: 'high',
      dueDateFrom: '2025-06-15',
      dueDateTo: '2025-06-20',
    };

    const propsWithFilters = {
      ...defaultProps,
      filters: filtersWithValues,
    };

    render(<TaskFilters {...propsWithFilters} />);

    expect(screen.getByText('Priority: HIGH')).toBeTruthy();
    expect(screen.getByText(/From:/)).toBeTruthy();
    expect(screen.getByText(/To:/)).toBeTruthy();

    expect(screen.getByRole('button', { name: /clear all/i })).toBeTruthy();
  });

  it('should call onClearFilters when clear all button is clicked', () => {
    const filtersWithValues: TaskFiltersType = {
      priority: 'high',
      dueDateFrom: '2025-06-15',
    };

    const propsWithFilters = {
      ...defaultProps,
      filters: filtersWithValues,
    };

    render(<TaskFilters {...propsWithFilters} />);

    const clearButton = screen.getByRole('button', { name: /clear all/i });
    fireEvent.click(clearButton);

    expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
  });
});
