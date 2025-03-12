import React, { useState, useEffect } from "react";
import {
  FaSun,
  FaMoon,
  FaSignOutAlt,
  FaChevronDown,
  FaBars,
} from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { CgTemplate } from "react-icons/cg";
import { RiGitRepositoryPrivateLine } from "react-icons/ri";
import { BsTrash2 } from "react-icons/bs";
import { GoTasklist } from "react-icons/go";
import { FaRegNoteSticky } from "react-icons/fa6";
import { GrHomeRounded } from "react-icons/gr";
import Logo from "../../assets/logo.png";
import { fetchRecentNotes } from "@/service/RecentNote";
import { RecentNote } from "@/service/RecentNote";
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPrivateOpen, setIsPrivateOpen] = useState(false);
  const [recentNotes, setRecentNotes] = useState<RecentNote[]>([]);
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecentNotes = async () => {
      try {
        const notes = await fetchRecentNotes(5); // Lấy 5 ghi chú gần nhất
        console.log("Recent notes fetched:", notes);
        setRecentNotes(notes);
      } catch (error) {
        console.error("Failed to fetch recent notes:", error);
      }
    };

    loadRecentNotes();
  }, []);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const togglePrivateSection = () => setIsPrivateOpen(!isPrivateOpen);
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("avatar");
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div
      className={`h-screen p-4 flex flex-col transition-all duration-300 shadow-lg
      ${isCollapsed ? "w-20" : "w-64"}
      ${darkMode ? "bg-gray-900 text-white" : "bg-gray-300 text-gray-900"}`}
    >
      {/* Header - Logo & Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="w-12 h-auto transition-all" />
            <span className="text-xl font-bold">Smart Note</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <FaBars />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-3">
          {[
            {
              path: "/",
              label: "Home",
              icon: <GrHomeRounded className="text-xl" />,
            },
            {
              path: "/note",
              label: "Notes",
              icon: <FaRegNoteSticky className="text-xl" />,
            },
            {
              path: "/calendar",
              label: "Calendar",
              icon: <IoCalendarOutline className="text-xl" />,
            },
            {
              path: "/task",
              label: "Tasks",
              icon: <GoTasklist className="text-xl" />,
            },
            {
              path: "/trash",
              label: "Trash",
              icon: <BsTrash2 className="text-xl" />,
            },
            {
              path: "/template",
              label: "Template",
              icon: <CgTemplate className="text-xl" />,
            },
          ].map(({ path, label, icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-md transition-all 
                  ${
                    isActive
                      ? "bg-gray-600 text-white"
                      : "hover:bg-gray-300 dark:hover:bg-gray-700"
                  }`
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
              <FaChevronDown
                className={`transition-transform ${
                  isPrivateOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          {isPrivateOpen && (
            <ul className="ml-4 mt-2 space-y-2">
              {recentNotes.length > 0 ? (
                recentNotes.map((note) => (
                  <li key={note.noteId}>
                    <button
                      onClick={() => navigate(`/note/${note.noteId}`)} // Điều hướng khi bấm vào note
                      className="flex items-center gap-3 p-2 rounded-md transition-all hover:bg-gray-300 dark:hover:bg-gray-700 w-full text-left"
                    >
                      {!isCollapsed && <span>{note.note_title}</span>}
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500 dark:text-gray-400">
                  {!isCollapsed && "No recent notes"}
                </li>
              )}
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
          {darkMode ? (
            <FaSun className="text-xl" />
          ) : (
            <FaMoon className="text-xl" />
          )}
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
