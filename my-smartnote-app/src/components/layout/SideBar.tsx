import React, { useState, useEffect } from "react";
import { FaSignOutAlt, FaChevronDown, FaBars } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { RiGitRepositoryPrivateLine, RiShareForwardLine } from "react-icons/ri";
import { Activity, BarChart } from "lucide-react";
import { GoTasklist } from "react-icons/go";
import { FaRegNoteSticky } from "react-icons/fa6";
import { GrHomeRounded } from "react-icons/gr";
import { fetchRecentNotes } from "@/service/RecentNoteService";
import { RecentNote } from "@/service/RecentNoteService";
import { IoMailUnreadOutline } from "react-icons/io5";
import { getListSharesByApprove, ShareResponse } from "@/service/ShareService";
import { getNoteById } from "@/service/NoteService";
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPrivateOpen, setIsPrivateOpen] = useState(false);
  const [recentNotes, setRecentNotes] = useState<RecentNote[]>([]);
  const { darkMode, toggleDarkMode } = useTheme();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shares, setShares] = useState<ShareResponse[]>([]);
  const navigate = useNavigate();

  // Hàm rút gọn tiêu đề
  const truncateTitle = (title: string, maxLength: number = 20) => {
    if (title.length <= maxLength) return title;
    return `${title.slice(0, maxLength)}...`;
  };

  useEffect(() => {
    const loadRecentNotes = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          console.error("userId is null or undefined");
          return; // Dừng lại nếu không có userId
        }

        const userIdConvertNumber = Number(userId);
        if (isNaN(userIdConvertNumber)) {
          console.error("userId is not a valid number:", userId);
          return; // Dừng lại nếu không phải số
        }

        const notes = await fetchRecentNotes(10, userIdConvertNumber);
        setRecentNotes(notes);
      } catch (error) {
        console.error("Failed to fetch recent notes:", error);
      }
    };

    loadRecentNotes();
  }, []);

  //fetch list share
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userIdConvertNumber = Number(userId);
    const fetchShares = async () => {
      try {
        const data = await getListSharesByApprove(userIdConvertNumber);
        setShares(data);
      } catch (error) {
        console.error("Error fetching shares:", error);
      }
    };
    fetchShares();
  }, []);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const togglePrivateSection = () => {
    if (isCollapsed) {
      setIsCollapsed(false); // Mở sidebar nếu đang thu gọn
      setTimeout(() => setIsPrivateOpen(true), 300); // Đợi sidebar mở xong rồi mới mở Private
    } else {
      setIsPrivateOpen(!isPrivateOpen);
    }
  };

  const handClickNote = async (noteId: number) => {
    try {
      localStorage.removeItem("recentNote");
      const note = await getNoteById(noteId);
      localStorage.setItem("recentNote", JSON.stringify(note.result));
      navigate(`/note/${noteId}`, { state: note.result });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu note:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("avatar");
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
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
            {/* <img
              src={Logo}
              alt="Logo"
              className="w-20 h-auto transition-all" // Phóng to ảnh
              style={{ background: "transparent" }} // Đảm bảo không có nền
            /> */}
            <span className="text-l font-bold">Smart Note</span>
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
              id: 1,
              path: "/",
              label: "Home",
              icon: <GrHomeRounded className="text-xl" />,
            },
            {
              id: 2,
              path: "/inbox",
              label: "Inbox",
              icon: <IoMailUnreadOutline className="text-xl" />,
            },
            {
              id: 3,
              path: "/note",
              label: "Notes",
              icon: <FaRegNoteSticky className="text-xl" />,
            },
            {
              id: 4,
              path: "/calendar",
              label: "Calendar",
              icon: <IoCalendarOutline className="text-xl" />,
            },
            {
              id: 5,
              path: "/task",
              label: "Tasks",
              icon: <GoTasklist className="text-xl" />,
            },
            {
              id: 6,
              path: "/statistical",
              label: "Statistical",
              icon: <Activity className="text-xl" />,
            }
           
          ].map(({ id, path, label, icon }) => (
            <li key={id}>
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
            className={`flex items-center justify-between w-full p-2 rounded-md transition-all 
              ${
                !isPrivateOpen ? "hover:bg-gray-300 dark:hover:bg-gray-700" : ""
              }`}
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
            <div className="ml-4 mt-2 max-h-40 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
              <ul className="space-y-2">
                {recentNotes.length > 0 ? (
                  recentNotes.map((note) => (
                    <li key={note.id}>
                      <button
                        onClick={() => handClickNote(note.noteId)}
                        className="flex items-center gap-3 p-2 rounded-md transition-all hover:bg-gray-400 dark:hover:bg-gray-600 w-full text-left text-sm"
                        title={note.note_title}
                      >
                        {!isCollapsed && (
                          <span>{truncateTitle(note.note_title)}</span>
                        )}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-gray-500 dark:text-gray-400">
                    {!isCollapsed && "No recent notes"}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Shared Section */}
        {/* Shared Section */}
        <div className="mt-4">
          <button
            onClick={() => setIsShareOpen(!isShareOpen)}
            className="flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            <div className="flex items-center gap-3">
              <RiShareForwardLine className="text-xl" />
              {!isCollapsed && <span>Shared</span>}
            </div>
            {!isCollapsed && (
              <FaChevronDown
                className={`transition-transform ${
                  isShareOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          {isShareOpen && (
            <div className="ml-4 mt-2 space-y-2">
              {shares.length > 0 ? (
                <ul>
                  {shares.map((share) => (
                    <li key={share.shareId}>
                      <button
                        onClick={() => handClickNote(share.noteId)}
                        className="w-full text-left p-2 rounded-md transition-all hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2"
                      >
                        {share.type === "NOTE" ? (
                          <FaRegNoteSticky className="text-lg" />
                        ) : (
                          <GoTasklist className="text-lg" />
                        )}
                        {!isCollapsed && (
                          <span>{truncateTitle(share.title)}</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  No shared notes available
                </p>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Footer - Theme Toggle & Logout */}
      <div className="border-t mt-4 pt-4">
        {/* <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 p-2 w-full rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          {darkMode ? (
            <FaSun className="text-xl" />
          ) : (
            <FaMoon className="text-xl" />
          )}
          {!isCollapsed && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
        </button> */}
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
