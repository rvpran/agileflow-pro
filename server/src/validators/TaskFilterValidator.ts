import { TaskPriority } from '../models/Task';
import { TaskFilterDto, TaskQueryParams } from '../dto/TaskFilterDto';

export interface TaskFilterValidator {
  validateAndTransform(queryParams: TaskQueryParams): TaskFilterDto;
}

export const createTaskFilterValidator = (): TaskFilterValidator => ({
  validateAndTransform(queryParams: TaskQueryParams): TaskFilterDto {
    const filter: TaskFilterDto = {};

    if (queryParams.priority) {
      if (
        !Object.values(TaskPriority).includes(
          queryParams.priority as TaskPriority
        )
      ) {
        throw new Error(
          `Invalid priority. Must be one of: ${Object.values(TaskPriority).join(', ')}`
        );
      }
      filter.priority = queryParams.priority as TaskPriority;
    }

    if (queryParams.dueDateFrom) {
      const fromDate = new Date(queryParams.dueDateFrom);
      if (isNaN(fromDate.getTime())) {
        throw new Error('Invalid dueDateFrom format. Use YYYY-MM-DD');
      }
      filter.dueDateFrom = queryParams.dueDateFrom;
    }

    if (queryParams.dueDateTo) {
      const toDate = new Date(queryParams.dueDateTo);
      if (isNaN(toDate.getTime())) {
        throw new Error('Invalid dueDateTo format. Use YYYY-MM-DD');
      }
      filter.dueDateTo = queryParams.dueDateTo;
    }

    if (filter.dueDateFrom && filter.dueDateTo) {
      if (new Date(filter.dueDateFrom) > new Date(filter.dueDateTo)) {
        throw new Error('dueDateFrom cannot be after dueDateTo');
      }
    }

    return filter;
  },
});
