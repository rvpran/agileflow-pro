import { TaskPriority } from '../models/Task';

export interface TaskFilterDto {
  priority?: TaskPriority;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export interface TaskQueryParams {
  priority?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}
