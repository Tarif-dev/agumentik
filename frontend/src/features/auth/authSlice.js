import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "./authAPI";

const token = localStorage.getItem("token");

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const res = await loginUser(data);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data || { message: "Login failed" },
    );
  }
});

export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await registerUser(data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Register failed" },
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: token || null,
    loading: false,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(register.fulfilled, (state, action) => {
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
