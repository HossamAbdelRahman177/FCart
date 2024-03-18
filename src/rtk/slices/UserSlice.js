import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

import axios from "axios";
import { API } from "App";

export const register = createAsyncThunk(
  "register/user",
  async (values, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/auth/signup`, values);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const login = createAsyncThunk(
  "login/user",
  async (values, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/auth/signin`, values);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
const UserSlice = createSlice({
  name: "user",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.setItem("user", null);
      return {
        ...state,
        user: null,
      };
    },

  },
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state) => {
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state) => {
      state.error = null;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.error = action.payload;
    });
    builder.addCase(login.pending, (state) => {
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.error = null;
      let decodedToken = jwtDecode(action.payload.token);

      state.user = {
        ...action.payload.user,
        id: decodedToken.id,
        token: action.payload.token,

      };
      localStorage.setItem("user", JSON.stringify(state.user));
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export const { logout } = UserSlice.actions;

export default UserSlice.reducer;
