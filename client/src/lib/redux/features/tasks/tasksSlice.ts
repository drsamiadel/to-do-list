import api from "@/lib/api";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";
import {
  FetchTasksParams,
  Task,
  TasksResponse,
  TasksState,
} from "../../../../../@types/types";

const initialState: TasksState = {
  tasks: [],
  pagination: {
    currentPage: 1,
    resPerPage: 10,
    totalPages: 0,
    totalTasks: 0,
  },
  loading: true,
  error: null,
  categories: [],
};

const fetchTasks = createAsyncThunk<TasksResponse, FetchTasksParams>(
  "tasks/fetchTasks",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get("/tasks", { params });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

const fetchCategories = createAsyncThunk<string[], void, { state: TasksState }>(
  "tasks/fetchCategories",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await api.get("/tasks/categories");

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

const toggleCompleted = createAsyncThunk<Task, Task, { state: TasksState }>(
  "tasks/toggleCompleted",
  async (task, { getState, rejectWithValue }) => {
    try {
      const response = await api.put(`/tasks/${task._id}`, {
        completed: !task.completed,
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task"
      );
    }
  }
);

const editTask = createAsyncThunk<Task, Partial<Task>, { state: TasksState }>(
  "tasks/editTask",
  async (task, { getState, rejectWithValue }) => {
    try {
      const response = await api.put(`/tasks/${task._id}`, task);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task"
      );
    }
  }
);

const deleteTask = createAsyncThunk<void, string, { state: TasksState }>(
  "tasks/deleteTask",
  async (id, { getState, rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

const createTask = createAsyncThunk<Task, Partial<Task>, { state: TasksState }>(
  "tasks/createTask",
  async (task, { getState, rejectWithValue }) => {
    try {
      const response = await api.post("/tasks", task);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add task"
      );
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(
        (task) => task._id === action.payload._id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTasks.fulfilled,
        (state, action: PayloadAction<TasksResponse>) => {
          state.loading = false;
          state.tasks = action.payload.tasks;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(
        fetchTasks.rejected,
        (
          state,
          action: PayloadAction<
            unknown,
            string,
            {
              arg: FetchTasksParams;
              requestId: string;
              requestStatus: "rejected";
              aborted: boolean;
              condition: boolean;
            } & ({ rejectedWithValue: true } | { rejectedWithValue: false }),
            SerializedError
          >
        ) => {
          state.loading = false;
          state.error = (action.payload as string) || "Something went wrong";
        }
      )
      .addCase(toggleCompleted.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(
        toggleCompleted.rejected,
        (
          state,
          action: PayloadAction<
            unknown,
            string,
            {
              requestId: string;
              requestStatus: "rejected";
              aborted: boolean;
              condition: boolean;
            } & ({ rejectedWithValue: true } | { rejectedWithValue: false }),
            SerializedError
          >
        ) => {
          state.loading = false;
          state.error = (action.payload as string) || "Something went wrong";
        }
      )
      .addCase(editTask.fulfilled, (state, action) => {
        console.log(action.payload);
        console.log(state.tasks);
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(
        editTask.rejected,
        (
          state,
          action: PayloadAction<
            unknown,
            string,
            {
              requestId: string;
              requestStatus: "rejected";
              aborted: boolean;
              condition: boolean;
            } & ({ rejectedWithValue: true } | { rejectedWithValue: false }),
            SerializedError
          >
        ) => {
          state.loading = false;
          state.error = (action.payload as string) || "Something went wrong";
        }
      )
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(
          (task) => task._id !== action.meta.arg
        );
      })
      .addCase(
        deleteTask.rejected,
        (
          state,
          action: PayloadAction<
            unknown,
            string,
            {
              requestId: string;
              requestStatus: "rejected";
              aborted: boolean;
              condition: boolean;
            } & ({ rejectedWithValue: true } | { rejectedWithValue: false }),
            SerializedError
          >
        ) => {
          state.loading = false;
          state.error = (action.payload as string) || "Something went wrong";
        }
      )
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks = [action.payload, ...state.tasks];
      })
      .addCase(
        createTask.rejected,
        (
          state,
          action: PayloadAction<
            unknown,
            string,
            {
              requestId: string;
              requestStatus: "rejected";
              aborted: boolean;
              condition: boolean;
            } & ({ rejectedWithValue: true } | { rejectedWithValue: false }),
            SerializedError
          >
        ) => {
          state.loading = false;
          state.error = (action.payload as string) || "Something went wrong";
        }
      )
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(
        fetchCategories.rejected,
        (
          state,
          action: PayloadAction<
            unknown,
            string,
            {
              requestId: string;
              requestStatus: "rejected";
              aborted: boolean;
              condition: boolean;
            } & ({ rejectedWithValue: true } | { rejectedWithValue: false }),
            SerializedError
          >
        ) => {
          state.loading = false;
          state.error = (action.payload as string) || "Something went wrong";
        }
      );

    return builder;
  },
});

export const { addTask, updateTask, removeTask } = tasksSlice.actions;

export {
  fetchTasks,
  toggleCompleted,
  editTask,
  deleteTask,
  createTask,
  fetchCategories,
};

export default tasksSlice.reducer;
