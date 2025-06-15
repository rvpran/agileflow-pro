import { Box, Typography } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import type { Task, TaskStatus } from '../types/Task';

interface Props {
  label: string;
  status: TaskStatus;
  tasks: Task[];
  onDeleteTask?: (taskId: string) => void;
}

export default function Column({ label, status, tasks, onDeleteTask }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f4f5f7',
        borderRadius: 1,
        overflow: 'hidden',
        border: '1px solid #dfe1e6',
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
          bgcolor: '#f4f5f7',
          borderBottom: '1px solid #dfe1e6',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#5e6c84',
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {label} {tasks.length}
        </Typography>
      </Box>

      <Box
        ref={setNodeRef}
        sx={{
          flex: 1,
          bgcolor: isOver ? '#deebff' : '#f4f5f7',
          p: 1,
          border: isOver ? '2px dashed #0052cc' : 'none',
          transition: 'all 0.2s ease',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c7d0',
            borderRadius: '3px',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {tasks.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 6,
                color: '#97a0af',
              }}
            >
              <Typography variant="body2">
                {isOver ? 'Drop here' : 'No issues'}
              </Typography>
            </Box>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
}
