export interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  category: string;
  color: number;
  author: Partial<Author>;
}

export interface LinkedIn {
  name: string;
  location: string;
  url: string;
  image: string;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  linkedin: string;
  createdAt: string;
  updatedAt: string;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: {
    currentPage: number;
    resPerPage: number;
    totalPages: number;
    totalTasks: number;
  };
}

export interface TasksState extends TasksResponse {
  loading: boolean;
  error: string | null;
  categories: string[];
}

export interface FetchTasksParams {
  page?: string;
  limit?: string;
  keyowrd?: string;
  category?: string;
  completed?: string;
}
