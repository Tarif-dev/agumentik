import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./taskAPI";

export const fetchTasks = createAsyncThunk("tasks/fetch", async (token) => {
  const res = await api.getTasks(token);
  return res.data;
});

export const addTask = createAsyncThunk(
  "tasks/add",
  async ({ data, token }) => {
    const res = await api.createTask(data, token);
    return res.data;
  },
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, data, token }) => {
    const res = await api.updateTask(id, data, token);
    return res.data;
  },
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async ({ id, token }) => {
    await api.deleteTask(id, token);
    return id;
  },
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
  },
  reducers: {
    taskAddedSync: (state, action) => {
      const exists = state.tasks.find((t) => t._id === action.payload._id);
      if (!exists) state.tasks.push(action.payload);
    },
    taskUpdatedSync: (state, action) => {
      const index = state.tasks.findIndex((t) => t._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    taskDeletedSync: (state, action) => {
      state.tasks = state.tasks.filter((t) => t._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (t) => t._id === action.payload._id,
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      });
  },
});

export const { taskAddedSync, taskUpdatedSync, taskDeletedSync } =
  taskSlice.actions;
export default taskSlice.reducer;
