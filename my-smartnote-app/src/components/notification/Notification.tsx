import { useState, useRef, useEffect } from "react";
import { RiNotification2Line } from "react-icons/ri";
import { Notification as NotificationType } from "@/service/NotificationService"; // Đổi tên để tránh trùng với component Notification

interface NotificationProps {
  notifications: NotificationType[]; // Sử dụng kiểu dữ liệu đã định nghĩa trong service
}

// Hàm tính toán thời gian đã trôi qua
const timeAgo = (time: string | number) => {
  const timestamp = typeof time === "string" ? Date.parse(time) : time;
  const now = new Date();
  const diff = now.getTime() - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} ngày trước`;
  if (hours > 0) return `${hours} giờ trước`;
  if (minutes > 0) return `${minutes} phút trước`;
  return "Vừa xong";
};

const Notification = ({ notifications }: NotificationProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Icon thông báo */}
      <button
        className="relative text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <RiNotification2Line className="text-xl" />
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown danh sách thông báo */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-10">
          <ul className="max-h-60 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((noti) => (
                <li
                  key={noti.id}
                  className="px-4 py-3 border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <p className="text-sm">{noti.message}</p>
                  <span className="text-xs text-gray-500">
                    {timeAgo(noti.time)}
                  </span>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-center text-sm text-gray-500">Không có thông báo</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notification;
