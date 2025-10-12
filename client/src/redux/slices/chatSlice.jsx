import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";


export const fetchChatHistory = createAsyncThunk(
  "chat/fetchChatHistory",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/chat");
      return data.messages || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch chat history");
    }
  }
);


export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ message, onStream }, { rejectWithValue, getState }) => {
    try {
      const { data } = await api.post("/chat/send", { message });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to send message");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    loading: false,
    sending: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    updateLastMessage: (state, action) => {
      if (state.messages.length > 0) {
        const lastMessage = state.messages[state.messages.length - 1];
        if (lastMessage.role === 'assistant') {
          lastMessage.content = action.payload;
        }
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        
        const cleanContent = action.payload.message
          .replace(/\*\*/g, '') // Remove double asterisks
          .replace(/\*/g, '') // Remove single asterisks
          .replace(/\n\n\n+/g, '\n\n') // Remove excessive line breaks
          .trim();
        
        const assistantMessage = {
          role: 'assistant',
          content: cleanContent,
          createdAt: new Date().toISOString()
        };
        state.messages.push(assistantMessage);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
      });
  }
});

export const { addMessage, clearMessages, updateLastMessage, setError, clearError } = chatSlice.actions;
export default chatSlice.reducer;
