import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatHistory } from "../../redux/slices/chatSlice";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import ChatInterface from "./ChatInterface";

const ChatPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  
  useEffect(() => {
    if (user?._id && user?.activeOrganization?._id) {
      dispatch(fetchChatHistory());
    }
  }, [dispatch, user?._id, user?.activeOrganization?._id]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="flex flex-1 bg-white h-full overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
      
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64 xl:w-80'}`}>
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={toggleSidebar}
        />
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 xl:w-80 transform transition-transform duration-300 ease-in-out lg:hidden ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar 
          isCollapsed={false} 
          onToggleCollapse={toggleMobileSidebar}
        />
      </div>
    
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <button
            onClick={toggleMobileSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">AI Chat</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
        
        <ChatInterface />
      </div>
    </div>
  );
};

export default ChatPage;
