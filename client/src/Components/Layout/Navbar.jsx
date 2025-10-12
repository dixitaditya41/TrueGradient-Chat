import React, { useState, useEffect } from "react";
import { Bell, ChevronDown, Plus, LogOut, Settings, UserRound, UserPlus, Coins, Edit } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateActiveOrganization, updateActiveOrganizationName, addOrganization } from "../../redux/slices/authSlice";
import { markAllNotificationsRead, fetchNotifications, addNotification } from "../../redux/slices/notificationsSlice";
import { fetchUserOrgs, createOrg, inviteToOrg, switchOrganization, renameOrg } from "../../redux/slices/orgSlice";
import { fetchChatHistory } from "../../redux/slices/chatSlice";
import { io } from "socket.io-client";
import InviteModal from "../Modals/InviteModal";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: orgs } = useSelector((state) => state.orgs);
  const { items: notifications, unreadCount } = useSelector((state) => state.notifications);
  const [showOrgMenu, setShowOrgMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!user?._id) return;

    const socket = io(import.meta.env.VITE_APP_SOCKET_URL || "http://localhost:5000", {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      forceNew: true,
      timeout: 5000
    });

    socket.on("connect", () => {
      socket.emit("register", user._id);
    });

    socket.on("notification", (data) => {
      dispatch(addNotification(data));
    });

    return () => socket.disconnect();
  }, [dispatch, user?._id]);

  useEffect(() => {
    dispatch(fetchUserOrgs());
    dispatch(fetchNotifications());
  }, [dispatch]);


  useEffect(() => {
    if (user?._id) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, user?._id]);


  const handleCreateOrg = async () => {
    if (!inputValue.trim()) return;
    try {
      const result = await dispatch(createOrg(inputValue.trim())).unwrap();
      // Update auth state with new organization
      dispatch(addOrganization(result));
      // Refresh organization list to keep orgSlice in sync
      dispatch(fetchUserOrgs());
      setShowCreateModal(false);
      setInputValue("");
    } catch (error) {
      console.error("Failed to create organization:", error);
    }
  };

  const handleInvite = () => {
    if (!inputValue.trim() || !user?.activeOrganization?._id) return;
    dispatch(inviteToOrg({ orgId: user.activeOrganization._id, email: inputValue.trim() }));
    setShowInviteModal(false);
    setInputValue("");
  };

  const handleRename = () => {
    if (!inputValue.trim() || !user?.activeOrganization?._id) return;
    const newName = inputValue.trim();
    dispatch(updateActiveOrganizationName(newName));
    dispatch(renameOrg({ orgId: user.activeOrganization._id, newName }));
    setShowRenameModal(false);
    setInputValue("");
  };

  const handleSwitchOrg = (org) => {
    if (user?.activeOrganization?._id === org._id) {
      setShowOrgMenu(false);
      return;
    }
    dispatch(updateActiveOrganization(org));
    dispatch(switchOrganization(org._id));
    dispatch(fetchChatHistory());
    setShowOrgMenu(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex items-center justify-between bg-white border-b px-4 sm:px-6 py-3 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-4">
        <h1 className="text-lg font-semibold text-gray-800">AI Chat</h1>

        <div className="relative hidden sm:block">
          <button
            onClick={() => setShowOrgMenu(!showOrgMenu)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition"
          >
            <span>{user?.activeOrganization?.name || "Select Organization"}</span>
            <ChevronDown size={16} />
          </button>

          {showOrgMenu && (
            <div className="absolute left-0 mt-2 w-56 bg-white border shadow-lg rounded-lg overflow-hidden z-50">
              <div className="py-1">
                {user?.organizations?.map((org) => (
                  <button
                    key={org._id}
                    onClick={() => handleSwitchOrg(org)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${user?.activeOrganization?._id === org._id ? "bg-blue-50 text-blue-600" : "text-gray-700"
                      }`}
                  >
                    {org.name}
                  </button>
                ))}
              </div>
              <div className="border-t">
                <button
                  onClick={() => {
                    setShowCreateModal(true);
                    setShowOrgMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Plus size={14} /> Create Organization
                </button>
                {user?.activeOrganization && (
                  <button
                    onClick={() => {
                      setShowInviteModal(true);
                      setShowOrgMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <UserPlus size={14} /> Invite Member
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 relative">
        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-blue-50 rounded-full">
          <Coins size={16} className="text-blue-500" />
          <span className="text-xs sm:text-sm font-semibold text-blue-600 hidden sm:block">
            {user?.credits || 1249}
          </span>
          <span className="text-xs font-semibold text-blue-600 sm:hidden">
            {user?.credits || 1249}
          </span>
        </div>
        <div className="relative">
        <button
  onClick={() => setShowNotifs(!showNotifs)}
  className="relative text-gray-700 hover:bg-gray-50 p-2 rounded-md transition"
>
  <Bell size={20} />
  {unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
      {unreadCount}
    </span>
  )}
</button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white shadow-lg rounded-lg border z-50">
              <div className="flex justify-between items-center p-4 border-b">
                <span className="font-semibold text-gray-800">Notifications</span>
                <button
                  onClick={() => dispatch(markAllNotificationsRead())}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Mark all as read
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">No new notifications</p>
                ) : (
                  <div className="divide-y">
                    {notifications.map((n) => (
                      <div
                        key={n._id || n.id || Math.random()}
                        className={`px-4 py-3 hover:bg-gray-50 transition ${!n.read ? "bg-blue-50" : ""
                          }`}
                      >
                        <p className="text-sm text-gray-700">{n.message}</p>
                        {!n.read && (
                          <span className="inline-block mt-1 w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <UserRound size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user?.username || user?.email || "2320403225"}
            </span>
            <ChevronDown size={16} className="text-gray-700" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white border shadow-lg rounded-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b bg-gray-50">
                <p className="text-sm font-medium text-gray-800">{user?.username || "User"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <button
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
              >
                <Settings size={16} /> Settings
              </button>
              {user?.activeOrganization && (
                <button
                  onClick={() => {
                    setShowRenameModal(true);
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <Edit size={16} /> Rename Organization
                </button>
              )}
              <button
                onClick={() => dispatch(logout())}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
      <InviteModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setInputValue("");
        }}
        title="Create New Organization"
        inputLabel="Organization Name"
        placeholder="e.g. TrueGradient.AI"
        inputValue={inputValue}
        onInputChange={setInputValue}
        confirmLabel="Create"
        onConfirm={handleCreateOrg}
        disableConfirm={!inputValue.trim()}
      />

      <InviteModal
        isOpen={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          setInputValue("");
        }}
        title="Invite Member"
        inputLabel="Email Address"
        placeholder="e.g. user@example.com"
        inputValue={inputValue}
        onInputChange={setInputValue}
        confirmLabel="Send Invite"
        onConfirm={handleInvite}
        disableConfirm={!inputValue.trim()}
      />

      <InviteModal
        isOpen={showRenameModal}
        onClose={() => {
          setShowRenameModal(false);
          setInputValue("");
        }}
        title="Rename Organization"
        inputLabel="New Organization Name"
        placeholder={user?.activeOrganization?.name || "Organization Name"}
        inputValue={inputValue}
        onInputChange={setInputValue}
        confirmLabel="Rename"
        onConfirm={handleRename}
        disableConfirm={!inputValue.trim()}
      />
    </div>
  );
};

export default Navbar;