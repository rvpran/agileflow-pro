import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api'; // UPDATED IMPORT
import type { ApiTaskFilters } from '../services/api'; // UPDATED IMPORT
import type {
  Task,
  CreateTaskData,
  TaskStatus,
  TaskPriority,
} from '../types/Task';

export interface TaskFilters {
  priority?: TaskPriority;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export default function useTasks() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasLoadedRef = useRef(false);
  const loadingRef = useRef(false);

  const loadTasks = useCallback(async () => {
    if (loadingRef.current) {
      return;
    }

    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);

      const apiFilters: ApiTaskFilters = {};
      if (filters.priority) {
        apiFilters.priority = filters.priority;
      }
      if (filters.dueDateFrom) {
        apiFilters.dueDateFrom = filters.dueDateFrom;
      }
      if (filters.dueDateTo) {
        apiFilters.dueDateTo = filters.dueDateTo;
      }

      const fetchedTasks = await api.getTasks(apiFilters);

      const tasksWithIds = fetchedTasks.map((task) => ({
        ...task,
        id: task.id || `temp-${Date.now()}-${Math.random()}`,
      }));

      setAllTasks(tasksWithIds);
      hasLoadedRef.current = true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load tasks';
      setError(errorMessage);
      setAllTasks([]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [filters]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = async (taskData: CreateTaskData): Promise<Task> => {
    try {
      setError(null);

      const newTask = await api.createTask(taskData);

      const taskWithId = {
        ...newTask,
        id: newTask.id || `temp-${Date.now()}-${Math.random()}`,
      };

      setAllTasks((prev) => [taskWithId, ...prev]);
      return taskWithId;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    if (!taskId) {
      return;
    }

    const originalTasks = [...allTasks];
    setAllTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status } : task))
    );

    try {
      setError(null);
      const updatedTask = await api.updateTask(taskId, { status });

      setAllTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (err) {
      setAllTasks(originalTasks);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!taskId) {
      return;
    }

    const originalTasks = [...allTasks];
    setAllTasks((prev) => prev.filter((task) => task.id !== taskId));

    try {
      setError(null);
      await api.deleteTask(taskId);
    } catch (err) {
      setAllTasks(originalTasks);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
    }
  };

  const refreshTasks = useCallback(async () => {
    hasLoadedRef.current = false;
    await loadTasks();
  }, [loadTasks]);

  return {
    tasks: allTasks,
    allTasks,
    filters,
    setFilters, // When this changes, useEffect will trigger loadTasks
    loading,
    error,
    createTask,
    updateTaskStatus,
    deleteTask,
    refreshTasks,
  };
}
