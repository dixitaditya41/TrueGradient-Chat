import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";


export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      localStorage.setItem("token", data.token);
      return data; // { _id, username, email, activeOrganization, token }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);


export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/signup", formData);
      localStorage.setItem("token", data.token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);


export const googleAuth = createAsyncThunk(
  "auth/googleAuth",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/google", { token });
      localStorage.setItem("token", data.token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Google login failed");
    }
  }
);


export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found");
   
      const { data } = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data; // { _id, username, email, activeOrganization }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch user");
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    updateActiveOrganization: (state, action) => {
      if (state.user) {
        state.user.activeOrganization = action.payload;
      }
    },
    updateActiveOrganizationName: (state, action) => {
      if (state.user && state.user.activeOrganization) {
        state.user.activeOrganization.name = action.payload;
      }
    },
    updateCredits: (state, action) => {
      if (state.user) {
        state.user.credits = action.payload;
      }
    },
    addOrganization: (state, action) => {
      if (state.user) {
        state.user.organizations.push(action.payload);
        state.user.activeOrganization = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          _id: action.payload._id,
          username: action.payload.username,
          email: action.payload.email,
          activeOrganization: action.payload.activeOrganization,
          organizations: action.payload.organizations || [],
          credits: action.payload.credits,
        };
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = {
          _id: action.payload._id,
          username: action.payload.username,
          email: action.payload.email,
          activeOrganization: action.payload.activeOrganization,
          organizations: action.payload.organizations || [],
          credits: action.payload.credits,
        };
        state.token = action.payload.token;
      })

      
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.user = {
          _id: action.payload._id,
          username: action.payload.username,
          email: action.payload.email,
          activeOrganization: action.payload.activeOrganization,
          organizations: action.payload.organizations || [],
          credits: action.payload.credits,
        };
        state.token = action.payload.token;
      })
      
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          _id: action.payload._id,
          username: action.payload.username,
          email: action.payload.email,
          activeOrganization: action.payload.activeOrganization,
          organizations: action.payload.organizations,
          credits: action.payload.credits,
        };
      })
  },
});

export const { logout, updateActiveOrganization, updateActiveOrganizationName, updateCredits, addOrganization } = authSlice.actions;
export default authSlice.reducer;
