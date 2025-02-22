import React, { useState } from "react";
import { FaSun, FaMoon, FaSignOutAlt, FaChevronDown, FaBars } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { CgTemplate } from "react-icons/cg";
import { RiGitRepositoryPrivateLine } from "react-icons/ri";
import { BsTrash2 } from "react-icons/bs";
import { GoTasklist } from "react-icons/go";
import { FaRegNoteSticky } from "react-icons/fa6";
import { GrHomeRounded } from "react-icons/gr";
import { HiOutlineUserCircle } from "react-icons/hi2";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPrivateOpen, setIsPrivateOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const togglePrivateSection = () => setIsPrivateOpen(!isPrivateOpen);
  const handleLogout = () => navigate("/login");

  return (
    <div
      className={`h-screen p-4 flex flex-col transition-all duration-300 shadow-lg
      ${isCollapsed ? "w-20" : "w-64"}
      ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
    >
      {/* Header - User Info */}
      <div className="flex items-center justify-between mb-4">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <HiOutlineUserCircle className="text-4xl" />
            <span className="text-lg font-semibold">Hoàng Tuấn</span>
          </div>
        )}
        <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-200">
          <FaBars />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-3">
          {[
            { path: "/", label: "Home", icon: <GrHomeRounded className="text-xl" /> },
            { path: "/note", label: "Notes", icon: <FaRegNoteSticky className="text-xl" /> },
            { path: "/calendar", label: "Calendar", icon: <IoCalendarOutline className="text-xl" /> },
            { path: "/task", label: "Tasks", icon: <GoTasklist className="text-xl" /> },
            { path: "/trash", label: "Trash", icon: <BsTrash2 className="text-xl" /> },
            { path: "/template", label: "Template", icon: <CgTemplate className="text-xl" /> },
          ].map(({ path, label, icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-md transition-all 
                  ${isActive ? "bg-blue-500 text-white" : "hover:bg-gray-300 dark:hover:bg-gray-700"}`
                }
              >
                {icon}
                {!isCollapsed && <span>{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Private Section */}
        <div className="mt-4">
          <button
            onClick={togglePrivateSection}
            className="flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            <div className="flex items-center gap-3">
              <RiGitRepositoryPrivateLine className="text-xl" />
              {!isCollapsed && <span>Private</span>}
            </div>
            {!isCollapsed && (
              <FaChevronDown className={`transition-transform ${isPrivateOpen ? "rotate-180" : ""}`} />
            )}
          </button>
          {isPrivateOpen && (
            <ul className="ml-4 mt-2 space-y-2">
              {[
                { path: "/private/documents", label: "Documents" },
                { path: "/private/photos", label: "Photos" },
                { path: "/private/settings", label: "Settings" },
              ].map(({ path, label }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-2 rounded-md transition-all 
                      ${isActive ? "bg-blue-500 text-white" : "hover:bg-gray-300 dark:hover:bg-gray-700"}`
                    }
                  >
                    {!isCollapsed && <span>{label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      {/* Footer - Theme Toggle & Logout */}
      <div className="border-t mt-4 pt-4">
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 p-2 w-full rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
          {!isCollapsed && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 w-full rounded-md text-red-500 hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          <FaSignOutAlt className="text-xl" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
