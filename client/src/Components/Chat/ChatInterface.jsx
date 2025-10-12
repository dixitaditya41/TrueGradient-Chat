import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, addMessage } from "../../redux/slices/chatSlice";
import { updateActiveOrganizationName, updateCredits } from "../../redux/slices/authSlice";

const ChatInterface = () => {
  const dispatch = useDispatch();
  const { messages, sending, error } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  
  
  const hasInsufficientCredits = user?.credits <= 0;
  
  const [inputMessage, setInputMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const messagesEndRef = useRef(null);
  const maxChars = 2000;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  
  useEffect(() => {
    setCharCount(inputMessage.length);
  }, [inputMessage]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || sending || hasInsufficientCredits) return;

    const message = inputMessage.trim();
    setInputMessage("");

    
    const userMessage = {
      role: 'user',
      content: message,
      createdAt: new Date().toISOString()
    };
    dispatch(addMessage(userMessage));

    try {
      const result = await dispatch(sendMessage({ message })).unwrap();
      
      // Update credits in Redux state
      if (result.remainingCredits !== undefined) {
        dispatch(updateCredits(result.remainingCredits));
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      
      
      let errorContent = `Sorry, I encountered an error: ${err}`;
      if (err.includes('Insufficient credits')) {
        errorContent = ` Insufficient credits! You have ${user?.credits || 0} credits remaining. Please purchase more credits to continue chatting.`;
      }
      
      
      const errorMessage = {
        role: 'assistant',
        content: errorContent,
        createdAt: new Date().toISOString(),
        isError: true
      };
      dispatch(addMessage(errorMessage));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot size={32} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Welcome to AI Chat
              </h2>
              <p className="text-gray-600 mb-6">
                Start a conversation with your AI assistant. Ask questions, get help, or just chat!
              </p>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setInputMessage("Hello! How can you help me today?")}
                  className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Hello! How can you help me today?</span>
                </button>
                <button
                  onClick={() => setInputMessage("Explain a complex topic in simple terms")}
                  className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Explain a complex topic in simple terms</span>
                </button>
                <button
                  onClick={() => setInputMessage("Help me with a coding problem")}
                  className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Help me with a coding problem</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 sm:gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              
              <div className={`max-w-xs sm:max-w-2xl lg:max-w-3xl ${message.role === 'user' ? 'order-first' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(message.createdAt)}
                  </span>
                </div>
                
                <div
                  className={`p-4 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.isError
                      ? 'bg-red-50 border border-red-200 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-white" />
                </div>
              )}
            </div>
          ))
        )}
        
        {sending && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-700">AI Assistant</span>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

          
      <div className="border-t border-gray-200 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={hasInsufficientCredits ? "Insufficient credits to send messages..." : "Type your message..."}
              className="w-full p-3 sm:p-4 pr-16 sm:pr-20 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows={2}
              maxLength={maxChars}
              disabled={sending || hasInsufficientCredits}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || sending || charCount > maxChars || hasInsufficientCredits}
              className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              title={hasInsufficientCredits ? "Insufficient credits" : "Send message"}
            >
              <Send size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500">
                Press Enter to send, Shift+Enter for new line
              </p>
              {hasInsufficientCredits && (
                <p className="text-xs text-red-500 mt-1">
                  ⚠️ Insufficient credits ({user?.credits || 0} remaining)
                </p>
              )}
            </div>
            <span className={`text-xs ${charCount > maxChars ? 'text-red-500' : 'text-gray-500'}`}>
              {charCount}/{maxChars}
            </span>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
