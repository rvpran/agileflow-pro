import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  FormHelperText,
} from '@mui/material';
import type { TaskPriority, CreateTaskData, Task } from '../types/Task';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (taskData: CreateTaskData) => Promise<Task>;
}

interface ValidationErrors {
  title?: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  general?: string;
}

type ValidatedFields = 'title' | 'description' | 'priority' | 'dueDate';

export default function TaskForm({ open, onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(formData.dueDate);

      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }

    return newErrors;
  };

  const handleBlur = (field: ValidatedFields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateForm();
    setErrors(newErrors);
  };

  const handleChange = (field: ValidatedFields, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePriorityChange = (value: TaskPriority) => {
    setFormData((prev) => ({ ...prev, priority: value }));

    if (errors.priority) {
      setErrors((prev) => ({ ...prev, priority: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = validateForm();
    setErrors(newErrors);
    setTouched({
      title: true,
      description: true,
      priority: true,
      dueDate: true,
    });

    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      await onSubmit(formData);

      // Reset form on success
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
      });
      setTouched({});
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : 'Failed to create task. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
      });
      setTouched({});
      setErrors({});
      onClose();
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  const isFormValid = Object.keys(validateForm()).length === 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle sx={{ pb: 1 }}>Create New Task</DialogTitle>

        <DialogContent>
          {errors.general && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.general}
            </Alert>
          )}

          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}
          >
            <TextField
              label="Task Title *"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              error={touched.title && !!errors.title}
              helperText={
                touched.title && errors.title
                  ? errors.title
                  : `${formData.title.length}/100 characters`
              }
              required
              fullWidth
              disabled={loading}
              inputProps={{ maxLength: 100 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-error': {
                    '& fieldset': {
                      borderColor: 'error.main',
                      borderWidth: 2,
                    },
                  },
                },
              }}
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              error={touched.description && !!errors.description}
              helperText={
                touched.description && errors.description
                  ? errors.description
                  : 'Optional'
              }
              multiline
              rows={3}
              fullWidth
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-error': {
                    '& fieldset': {
                      borderColor: 'error.main',
                      borderWidth: 2,
                    },
                  },
                },
              }}
            />

            <FormControl
              fullWidth
              disabled={loading}
              error={touched.priority && !!errors.priority}
            >
              <InputLabel
                sx={{
                  color:
                    touched.priority && errors.priority
                      ? 'error.main'
                      : undefined,
                  '&.Mui-focused': {
                    color:
                      touched.priority && errors.priority
                        ? 'error.main'
                        : 'primary.main',
                  },
                }}
              >
                Priority *
              </InputLabel>
              <Select
                value={formData.priority}
                label="Priority *"
                onChange={(e) =>
                  handlePriorityChange(e.target.value as TaskPriority)
                }
                onBlur={() => handleBlur('priority')}
                sx={{
                  '&.Mui-error': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'error.main',
                      borderWidth: 2,
                    },
                  },
                }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
              {touched.priority && errors.priority && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.priority}
                </FormHelperText>
              )}
            </FormControl>

            <TextField
              label="Due Date *"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              onBlur={() => handleBlur('dueDate')}
              error={touched.dueDate && !!errors.dueDate}
              helperText={
                touched.dueDate && errors.dueDate
                  ? errors.dueDate
                  : 'Select a future date'
              }
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: minDate }}
              required
              fullWidth
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-error': {
                    '& fieldset': {
                      borderColor: 'error.main',
                      borderWidth: 2,
                    },
                  },
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={loading} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !isFormValid}
            sx={{
              minWidth: 120,
              '&:disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'action.disabled',
              },
            }}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
