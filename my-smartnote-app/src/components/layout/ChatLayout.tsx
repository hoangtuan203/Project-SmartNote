import React from "react";
import { Home, MessageSquare, Users, Settings, Bell } from "lucide-react";

const ChatLayout = () => {
  return (
    <div className="bg-gray-800 text-white fixed bottom-0 left-0 w-full h-16 flex justify-around items-center shadow-lg">
      {/* Home */}
      <div className="flex flex-col items-center hover:text-gray-300">
        <Home className="w-6 h-6" />
        <span className="text-xs">Home</span>
      </div>

      {/* Chat */}
      <div className="flex flex-col items-center hover:text-gray-300">
        <MessageSquare className="w-6 h-6" />
        <span className="text-xs">Chat</span>
      </div>

      {/* Friends */}
      <div className="flex flex-col items-center hover:text-gray-300">
        <Users className="w-6 h-6" />
        <span className="text-xs">Friends</span>
      </div>

      {/* Notifications */}
      <div className="flex flex-col items-center hover:text-gray-300">
        <Bell className="w-6 h-6" />
        <span className="text-xs">Notifications</span>
      </div>

      {/* Settings */}
      <div className="flex flex-col items-center hover:text-gray-300">
        <Settings className="w-6 h-6" />
        <span className="text-xs">Settings</span>
      </div>
    </div>
  );
};

export default ChatLayout;
