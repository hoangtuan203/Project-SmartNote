import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import AvatarDefault from "../../assets/avatar_default.png";
import Notification from "../notification/Notification";
import { IoAddSharp } from "react-icons/io5";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import {
  Notification as NotificationType,
  ListNotification,
  deleteNotification,
} from "@/service/NotificationService";
import ShareHome from "@/components/share/index";

const Header = () => {
  const [notification, setNotification] = useState<NotificationType[]>([]);

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [currentTitle, setCurrentTitle] = useState("Dashboard");

  const emailUser = localStorage.getItem("email") || "Guest";
  const avatarUser = localStorage.getItem("avatar") || "/default-avatar.png"; // Ảnh mặc định nếu không có

  interface ShareId {
    type: "note" | "task"; // Loại nội dung
    id: number; // ID của nội dung
  }

  const [shareId, setShareId] = useState<ShareId | null>(null);
  // State lưu thông tin user
  const [user] = useState({
    email: emailUser,
    avatar: avatarUser,
  });
  useEffect(() => {
    const pathToTitle: { [key: string]: string } = {
      "/": "Home",
      "/note": "Notes",
      "/calendar": "Calendar",
      "/task": "Tasks",
      "/trash": "Trash",
    };

    // Kiểm tra nếu đang xem chi tiết note/task
    if (location.pathname.startsWith("/note/")) {
      // const title = location.state.note.title
      const idFromPath = location.pathname.split("/")[2];
      const numericId = parseInt(idFromPath, 10);
      if (!isNaN(numericId)) {
        setCurrentTitle(`Private / ${idFromPath}`);
        setShareId({ type: "note", id: numericId }); // Lưu type là "note"
      } else {
        setCurrentTitle("New Note");
        setShareId(null);
      }
    } else if (location.pathname.startsWith("/task/")) {
      const idFromPath = location.pathname.split("/")[2];
      const numericId = parseInt(idFromPath, 10);
      if (!isNaN(numericId)) {
        setCurrentTitle(`Task : ${idFromPath}`);
        setShareId({ type: "task", id: numericId }); // Lưu type là "task"
      } else {
        setCurrentTitle("New Task");
        setShareId(null);
      }
    } else {
      setCurrentTitle(pathToTitle[location.pathname] || "Trang chủ");
      setShareId(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  // Giả lập dữ liệu lịch sử
  const history = [
    { id: 1, title: "Ghi chú họp nhóm", type: "note", time: "Yesterday" },
    {
      id: 2,
      title: "Lịch công việc tuần",
      type: "calendar",
      time: "Past Week",
    },
    {
      id: 3,
      title: "Task: Hoàn thành báo cáo",
      type: "task",
      time: "Past Week",
    },
  ];
  const fetchNotifications = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const userIdNumber = Number(userId); // Chuyển đổi userId sang số
      const notifications = await ListNotification(1, 5, userIdNumber); // Lấy 5 thông báo mới nhất
      setNotification(notifications);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleDeleteNotification = async (id: number) => {
    try {
      await deleteNotification(id); // Xoá thông báo
      fetchNotifications(); // Sau khi xoá, gọi lại hàm để tải lại thông báo
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="w-full bg-white dark:bg-gray-900 text-black dark:text-white p-2 flex justify-between items-center shadow-md">
        {/* Button mở modal */}

        <div className="flex items-center gap-4">
          {/* Nút Lùi */}
          <button
            onClick={() => navigate(-1)}
            className="bg-transparent text-black px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            <IoArrowBack className="text-xl" />
          </button>

          {/* Nút Tiến */}
          <button
            onClick={() => navigate(1)}
            className="bg-transparent text-black px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            <IoArrowForward className="text-xl" />
          </button>

          {/* Nút Thêm Mới */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-transparent text-black px-4 py-2 rounded-md flex items-center gap-3 hover:bg-gray-200 transition-colors"
          >
            <IoAddSharp className="text-2xl text-black" />
          </button>
        </div>

        <h2 className="text-xl font-semibold text-center flex-1">
          {currentTitle}
        </h2>

        {/* Các icon chức năng */}
        <div className="flex items-center gap-4">
          <ShareHome shareId={shareId} />

          {/* Thông báo */}
          <Notification
            notifications={notification}
            onDelete={handleDeleteNotification} // Gửi hàm xoá thông báo vào component Notification
          />
          {user.email !== "Guest" ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{user.email}</span>
              <img
                src={
                  user.avatar !== "/default-avatar.png"
                    ? user.avatar
                    : AvatarDefault
                }
                alt="Avatar"
                className="w-8 h-8 rounded-full border"
              />
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </header>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-96 relative animate-slideIn"
          >
            {/* Nút đóng modal */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-500 transition"
            >
              <FaTimes className="text-2xl" />
            </button>

            {/* Tiêu đề modal */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
              Tạo Trang Mới
            </h2>

            {/* Các nút chọn */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  navigate("/note/create");
                  setShowModal(false);
                }}
                className="w-full py-3 rounded-lg text-lg font-medium bg-gray-200 text-black hover:bg-gray-300 transition"
              >
                📒 Tạo Note
              </button>
              <button
                onClick={() => {
                  navigate("/note/create");
                  setShowModal(false);
                }}
                className="w-full py-3 rounded-lg text-lg font-medium bg-gray-200 text-black hover:bg-gray-300 transition"
              >
                📅 Tạo Calendar
              </button>
              <button
                onClick={() => {
                  navigate("/task/create");
                  setShowModal(false);
                }}
                className="w-full py-3 rounded-lg text-lg font-medium bg-gray-200 text-black hover:bg-gray-300 transition"
              >
                ✅ Tạo Task
              </button>
            </div>

            {/* Lịch sử gần đây */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Yesterday
              </h3>
              <ul className="space-y-2">
                {history
                  .filter((item) => item.time === "Yesterday")
                  .map((item) => (
                    <li
                      key={item.id}
                      className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                      onClick={() => {
                        navigate(`/${item.type}/${item.id}`);
                        setShowModal(false);
                      }}
                    >
                      <strong>{item.title}</strong>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Past Week
              </h3>
              <ul className="space-y-2">
                {history
                  .filter((item) => item.time === "Past Week")
                  .map((item) => (
                    <li
                      key={item.id}
                      className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                      onClick={() => navigate(`/${item.type}/${item.id}`)}
                    >
                      <strong>{item.title}</strong>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
