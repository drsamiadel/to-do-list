import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/lib/redux/features/authSlice";
import tasksReducer from "@/lib/redux/features/tasks/tasksSlice";

export const store = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      tasks: tasksReducer,
    },
  });
};

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
