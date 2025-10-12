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
    chatSessions: [],
    currentChatId: null,
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
    createNewChat: (state) => {
      // Save current chat if it has messages
      if (state.messages.length > 0) {
        const newChatSession = {
          id: Date.now().toString(),
          title: state.messages.find(msg => msg.role === 'user')?.content.slice(0, 30) + '...' || 'New Chat',
          messages: [...state.messages],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        state.chatSessions.unshift(newChatSession);
      }
      
      // Create new chat
      const newChatId = Date.now().toString();
      state.currentChatId = newChatId;
      state.messages = [];
    },
    switchToChat: (state, action) => {
      const chatId = action.payload;
      const chatSession = state.chatSessions.find(chat => chat.id === chatId);
      
      if (chatSession) {
        // Save current chat if it has messages
        if (state.messages.length > 0 && state.currentChatId) {
          const currentChatIndex = state.chatSessions.findIndex(chat => chat.id === state.currentChatId);
          if (currentChatIndex !== -1) {
            state.chatSessions[currentChatIndex].messages = [...state.messages];
            state.chatSessions[currentChatIndex].updatedAt = new Date().toISOString();
          }
        }
        
        // Switch to selected chat
        state.currentChatId = chatId;
        state.messages = [...chatSession.messages];
      }
    },
    deleteChat: (state, action) => {
      const chatId = action.payload;
      state.chatSessions = state.chatSessions.filter(chat => chat.id !== chatId);
      
      // If we're deleting the current chat, clear messages
      if (state.currentChatId === chatId) {
        state.messages = [];
        state.currentChatId = null;
      }
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

export const { addMessage, clearMessages, createNewChat, switchToChat, deleteChat, updateLastMessage, setError, clearError } = chatSlice.actions;
export default chatSlice.reducer;
