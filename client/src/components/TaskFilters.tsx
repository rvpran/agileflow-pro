import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Stack,
  Collapse,
  Typography,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import type { TaskPriority } from '../types/Task';

export interface TaskFilters {
  priority?: TaskPriority;
  dueDateFrom?: string;
  dueDateTo?: string;
}

interface Props {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  onClearFilters: () => void;
}

export default function TaskFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = !!(
    filters.priority ||
    filters.dueDateFrom ||
    filters.dueDateTo
  );

  const shouldShowFilters = isExpanded || hasActiveFilters;

  const handlePriorityChange = (priority: TaskPriority | '') => {
    onFiltersChange({
      ...filters,
      priority: priority || undefined,
    });
  };

  const handleDateFromChange = (date: string) => {
    onFiltersChange({
      ...filters,
      dueDateFrom: date || undefined,
    });
  };

  const handleDateToChange = (date: string) => {
    onFiltersChange({
      ...filters,
      dueDateTo: date || undefined,
    });
  };

  const handleClearAll = () => {
    onClearFilters();
    setIsExpanded(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priority) count++;
    if (filters.dueDateFrom) count++;
    if (filters.dueDateTo) count++;
    return count;
  };

  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderBottom: '1px solid #dfe1e6',
        px: 3,
        py: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<FilterIcon />}
            onClick={() => setIsExpanded(!isExpanded)}
            variant={hasActiveFilters ? 'contained' : 'outlined'}
            size="small"
            sx={{
              bgcolor: hasActiveFilters ? 'primary.main' : 'transparent',
              color: hasActiveFilters ? 'white' : 'text.primary',
            }}
          >
            Filters
            {getActiveFiltersCount() > 0 && (
              <Chip
                label={getActiveFiltersCount()}
                size="small"
                sx={{
                  ml: 1,
                  height: 18,
                  bgcolor: hasActiveFilters
                    ? 'rgba(255,255,255,0.3)'
                    : 'primary.main',
                  color: hasActiveFilters ? 'white' : 'white',
                  '& .MuiChip-label': { fontSize: '11px', px: 0.5 },
                }}
              />
            )}
          </Button>

          {hasActiveFilters && (
            <Stack direction="row" spacing={1}>
              {filters.priority && (
                <Chip
                  label={`Priority: ${filters.priority.toUpperCase()}`}
                  size="small"
                  onDelete={() => handlePriorityChange('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.dueDateFrom && (
                <Chip
                  label={`From: ${new Date(filters.dueDateFrom).toLocaleDateString()}`}
                  size="small"
                  onDelete={() => handleDateFromChange('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.dueDateTo && (
                <Chip
                  label={`To: ${new Date(filters.dueDateTo).toLocaleDateString()}`}
                  size="small"
                  onDelete={() => handleDateToChange('')}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Stack>
          )}
        </Box>
        {hasActiveFilters && (
          <Button
            startIcon={<ClearIcon />}
            onClick={handleClearAll}
            size="small"
            color="error"
            variant="text"
          >
            Clear All
          </Button>
        )}
      </Box>

      <Collapse in={shouldShowFilters}>
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0' }}>
          <Typography variant="subtitle2" sx={{ mb: 2, color: '#5e6c84' }}>
            Filter Tasks
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={filters.priority || ''}
                label="Priority"
                onChange={(e) =>
                  handlePriorityChange(e.target.value as TaskPriority)
                }
              >
                <MenuItem value="">All Priorities</MenuItem>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Due Date From"
              type="date"
              value={filters.dueDateFrom || ''}
              onChange={(e) => handleDateFromChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ minWidth: 180 }}
            />
            <TextField
              label="Due Date To"
              type="date"
              value={filters.dueDateTo || ''}
              onChange={(e) => handleDateToChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ minWidth: 180 }}
            />
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}
