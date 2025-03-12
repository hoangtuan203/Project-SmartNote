import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import AvatarDefault from "../../assets/avatar_default.png";
import Notification from "../notification/Notification";
import { IoAddSharp } from "react-icons/io5";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { Notification as NotificationType, ListNotification } from "@/service/NotificationService";

const Header = () => {
  const [notification, setNotification] = useState<NotificationType[]>([]);



  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [currentTitle, setCurrentTitle] = useState("Dashboard");

  const emailUser = localStorage.getItem("email") || "Guest";
  const avatarUser = localStorage.getItem("avatar") || "/default-avatar.png"; // Ảnh mặc định nếu không có

  // State lưu thông tin user
  const [user,        ] = useState({
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
      setCurrentTitle(`Note: ${location.pathname.split("/")[2]}`);
    } else if (location.pathname.startsWith("/task/")) {
      setCurrentTitle(`Task: ${location.pathname.split("/")[2]}`);
    } else {
      setCurrentTitle(pathToTitle[location.pathname] || "Home");
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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifications = await ListNotification(1, 5); // Lấy 5 thông báo mới nhất
        console.log("Fetched notifications:", notifications);
        setNotification(notifications);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };
  
    fetchNotifications();
  }, []);
  



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
          <button className="text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
            <FiShare2 className="text-xl" />
          </button>

          {/* Thông báo */}
          <Notification notifications={notification} />

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 relative"
          >
            {/* Nút đóng modal */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-500"
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Tiêu đề */}
            <h2 className="text-xl font-semibold mb-4 text-center">
              Tạo Trang Mới
            </h2>

            {/* Danh sách tùy chọn */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  navigate("/note/create");
                  setShowModal(false); // Ẩn modal khi tạo note
                }}
                className="w-full bg-gray-200 text-black py-3 rounded-md hover:bg-gray-300 transition-colors"
              >
                📒 Tạo Note
              </button>
              <button
                onClick={() => {
                  navigate("/calendar/create");
                  setShowModal(false); // Ẩn modal khi tạo calendar
                }}
                className="w-full bg-gray-200 text-black py-3 rounded-md hover:bg-gray-300 transition-colors"
              >
                📅 Tạo Calendar
              </button>
              <button
                onClick={() => {
                  navigate("/task/create");
                  setShowModal(false); // Ẩn modal khi tạo task
                }}
                className="w-full bg-gray-200 text-black py-3 rounded-md hover:bg-gray-300 transition-colors"
              >
                ✅ Tạo Task
              </button>
            </div>

            {/* Lịch sử - Yesterday */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Yesterday</h3>
              <ul className="space-y-2">
                {history
                  .filter((item) => item.time === "Yesterday")
                  .map((item) => (
                    <li
                      key={item.id}
                      className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                      onClick={() => navigate(`/${item.type}/${item.id}`)}
                    >
                      <strong>{item.title}</strong>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Lịch sử - Past Week */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Past Week</h3>
              <ul className="space-y-2">
                {history
                  .filter((item) => item.time === "Past Week")
                  .map((item) => (
                    <li
                      key={item.id}
                      className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
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
