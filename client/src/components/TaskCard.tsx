import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useDraggable } from '@dnd-kit/core';
import type { Task } from '../types/Task';

interface Props {
  task: Task;
  onDelete?: (taskId: string) => void;
}

export default function TaskCard({ task, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const transformStyle = transform
    ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
    : undefined;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#de350b';
      case 'medium':
        return '#ff8b00';
      case 'low':
        return '#36b37e';
      default:
        return '#6b778c';
    }
  };

  const getDateInfo = (dateString: string) => {
    const dueDate = new Date(dateString);
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const due = new Date(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate()
    );

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = dueDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    let status = 'normal';
    let backgroundColor = 'transparent';
    let textColor = '#6b778c';
    let label = formattedDate;

    if (diffDays < 0) {
      // Overdue
      status = 'overdue';
      backgroundColor = '#ffebe6';
      textColor = '#de350b';
      label = `${formattedDate} (${Math.abs(diffDays)} days overdue)`;
    } else if (diffDays === 0) {
      // Due today
      status = 'today';
      backgroundColor = '#fff3cd';
      textColor = '#856404';
      label = `${formattedDate} (Today)`;
    } else if (diffDays === 1) {
      // Due tomorrow
      status = 'tomorrow';
      backgroundColor = '#cce5ff';
      textColor = '#0066cc';
      label = `${formattedDate} (Tomorrow)`;
    } else if (diffDays <= 3) {
      // Due soon
      status = 'soon';
      backgroundColor = '#e6f3ff';
      textColor = '#0052cc';
      label = `${formattedDate} (${diffDays} days)`;
    }

    return {
      status,
      backgroundColor,
      textColor,
      label,
      isOverdue: diffDays < 0,
      isToday: diffDays === 0,
      isSoon: diffDays <= 3 && diffDays > 0,
    };
  };

  const dateInfo = getDateInfo(task.dueDate);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();

    if (onDelete) {
      if (window.confirm(`Delete task "${task.title}"?`)) {
        onDelete(task.id);
      }
    }
  };

  const dragHandlers = {
    ...listeners,
    onPointerDown: (e: React.PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-delete-button]')) {
        return;
      }
      listeners?.onPointerDown?.(e);
    },
  };

  return (
    <Card
      ref={setNodeRef}
      {...dragHandlers}
      {...attributes}
      sx={{
        transform: transformStyle,
        opacity: isDragging ? 0.9 : 1,
        zIndex: isDragging ? 9999 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : 'transform 0.2s ease',
        position: isDragging ? 'relative' : 'static',

        bgcolor: 'white',
        border: dateInfo.isOverdue ? '2px solid #de350b' : '1px solid #dfe1e6',
        borderRadius: 1,
        userSelect: 'none',
        touchAction: 'none',
        boxShadow: isDragging
          ? '0 20px 40px rgba(0,0,0,0.3)'
          : '0 1px 3px rgba(0,0,0,0.1)',

        '&:hover': {
          bgcolor: isDragging ? 'white' : '#f4f5f7',
          borderColor: isDragging
            ? dateInfo.isOverdue
              ? '#de350b'
              : '#0052cc'
            : '#c1c7d0',
          boxShadow: isDragging
            ? '0 20px 40px rgba(0,0,0,0.3)'
            : '0 2px 4px rgba(0,0,0,0.1)',
        },
        '&:active': {
          cursor: 'grabbing',
        },
      }}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        {dateInfo.isOverdue && (
          <Box
            sx={{
              bgcolor: '#ffebe6',
              color: '#de350b',
              fontSize: '10px',
              fontWeight: 600,
              textAlign: 'center',
              py: 0.5,
              mb: 1,
              borderRadius: 0.5,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            OVERDUE
          </Box>
        )}

        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: '#172b4d',
            mb: 1,
            lineHeight: 1.3,
            pointerEvents: 'none',
          }}
        >
          {task.title}
        </Typography>

        {task.description && (
          <Typography
            variant="body2"
            sx={{
              color: '#6b778c',
              fontSize: '12px',
              mb: 1,
              lineHeight: 1.3,
              pointerEvents: 'none',
            }}
          >
            {task.description}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1,
          }}
        >
          <Chip
            label={task.priority.toUpperCase()}
            size="small"
            sx={{
              height: 16,
              fontSize: '10px',
              fontWeight: 600,
              bgcolor: getPriorityColor(task.priority),
              color: 'white',
              pointerEvents: 'none',
              '& .MuiChip-label': {
                px: 0.5,
              },
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box
              sx={{
                bgcolor: dateInfo.backgroundColor,
                color: dateInfo.textColor,
                fontSize: '10px',
                fontWeight: dateInfo.isOverdue || dateInfo.isToday ? 700 : 500,
                px: 1,
                py: 0.25,
                borderRadius: 0.5,
                border: dateInfo.isOverdue
                  ? `1px solid ${dateInfo.textColor}`
                  : 'none',
                pointerEvents: 'none',
                textAlign: 'center',
                minWidth: 'fit-content',
                whiteSpace: 'nowrap',
              }}
            >
              {dateInfo.label}
            </Box>

            {onDelete && (
              <IconButton
                data-delete-button="true"
                size="small"
                onClick={handleDelete}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                sx={{
                  width: 20,
                  height: 20,
                  opacity: 0.6,
                  zIndex: 10,
                  position: 'relative',
                  '&:hover': {
                    opacity: 1,
                    bgcolor: '#ffebe6',
                    color: '#de350b',
                    transform: 'scale(1.1)',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                }}
              >
                <DeleteIcon sx={{ fontSize: 14 }} />
              </IconButton>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
