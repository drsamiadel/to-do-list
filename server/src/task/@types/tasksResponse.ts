import { Task } from '../schemas/task.schema';

export type TasksResponse = {
  tasks: Task[];
  pagination: {
    currentPage: number;
    resPerPage: number;
    totalTasks: number;
    totalPages: number;
  };
};
