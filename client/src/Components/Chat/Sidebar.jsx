import React, { useState } from "react";
import { Plus, MessageSquare, ChevronLeft, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessages } from "../../redux/slices/chatSlice";

const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.chat);

  const handleNewChat = () => {
    dispatch(clearMessages());
  };

  const getChatTitle = (messages) => {
    if (!messages || messages.length === 0) return "New Chat";
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    return firstUserMessage ? firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "") : "New Chat";
  };

  const getLastMessage = (messages) => {
    if (!messages || messages.length === 0) return "";
    const lastMessage = messages[messages.length - 1];
    return lastMessage.content.slice(0, 50) + (lastMessage.content.length > 50 ? "..." : "");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return "Today";
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4">
        <button
          onClick={onToggleCollapse}
          className="mb-6 p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <button
          onClick={handleNewChat}
          className="mb-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
        </button>
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <MessageSquare size={16} className="text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 sm:w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">Conversations</h2>
          <button
            onClick={onToggleCollapse}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
        </div>
        
        <button
          onClick={handleNewChat}
          className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New Chat</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {messages.length > 0 ? (
          <div className="p-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
              <h3 className="font-semibold text-blue-900 text-sm mb-1">
                {getChatTitle(messages)}
              </h3>
              <p className="text-blue-700 text-xs mb-2">
                {getLastMessage(messages)}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-blue-600 text-xs">
                  {formatDate(messages[0]?.createdAt)}
                </span>
                <button
                  onClick={handleNewChat}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center text-gray-500">
              <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs text-gray-400 mt-1">Start a new chat to begin</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>AI Chat Assistant</p>
          <p className="mt-1">Powered by Gemini AI</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
