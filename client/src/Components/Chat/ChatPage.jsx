import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatHistory } from "../../redux/slices/chatSlice";
import Sidebar from "./Sidebar";
import ChatInterface from "./ChatInterface";

const ChatPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  
  useEffect(() => {
    if (user?._id && user?.activeOrganization?._id) {
      dispatch(fetchChatHistory());
    }
  }, [dispatch, user?._id, user?.activeOrganization?._id]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex flex-1 bg-white">
      
      <div className={`${sidebarCollapsed ? 'hidden' : 'block'} sm:block`}>
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={toggleSidebar}
        />
      </div>
    
      <ChatInterface />
    </div>
  );
};

export default ChatPage;
