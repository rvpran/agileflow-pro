import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Stack,
  IconButton,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import Column from './Column';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import useTasks from '../hooks/useTasks';
import type { TaskStatus, Task } from '../types/Task';

const columns: { label: string; status: TaskStatus }[] = [
  { label: 'TO DO', status: 'todo' },
  { label: 'IN PROGRESS', status: 'in-progress' },
  { label: 'DONE', status: 'done' },
];

export default function Board() {
  const {
    tasks,
    allTasks,
    filters,
    setFilters,
    loading,
    error,
    createTask,
    updateTaskStatus,
    deleteTask,
    refreshTasks,
  } = useTasks();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id.toString();
    const task = tasks.find((t) => t.id === taskId);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over || active.id === over.id) {
      return;
    }

    const taskId = active.id.toString();
    const targetStatus = over.id.toString() as TaskStatus;
    const task = tasks.find((t) => t.id === taskId);

    if (task && task.status !== targetStatus) {
      updateTaskStatus(taskId, targetStatus);
    }
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 3,
            py: 2,
            borderBottom: '1px solid #dfe1e6',
            bgcolor: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" sx={{ color: '#172b4d' }}>
              My Kanban Board
            </Typography>
            <Chip
              label={`${tasks.length} of ${allTasks.length} issues`}
              variant="outlined"
              size="small"
              sx={{
                fontWeight: 500,
                color: '#5e6c84',
                borderColor: '#dfe1e6',
              }}
            />
          </Box>

          <Stack direction="row" spacing={1}>
            <IconButton onClick={refreshTasks} disabled={loading} size="small">
              <RefreshIcon />
            </IconButton>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsFormOpen(true)}
              size="small"
            >
              Create
            </Button>
          </Stack>
        </Box>

        <TaskFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        {error && (
          <Box sx={{ px: 3, py: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            height: error ? 'calc(100vh - 200px)' : 'calc(100vh - 140px)', // Adjusted for filters
            padding: '16px',
            gap: '16px',
          }}
        >
          {columns.map((col) => (
            <Box
              key={col.status}
              sx={{
                flex: '1 1 0',
                minWidth: 0,
              }}
            >
              <Column
                status={col.status}
                label={col.label}
                tasks={tasks.filter((t) => t.status === col.status)}
                onDeleteTask={deleteTask}
              />
            </Box>
          ))}
        </Box>

        <DragOverlay style={{ zIndex: 99999 }}>
          {activeTask ? (
            <Box
              sx={{ boxShadow: '0 20px 40px rgba(0,0,0,0.3)', opacity: 0.95 }}
            >
              <TaskCard task={activeTask} />
            </Box>
          ) : null}
        </DragOverlay>

        <TaskForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={createTask}
        />
      </DndContext>
    </Box>
  );
}
