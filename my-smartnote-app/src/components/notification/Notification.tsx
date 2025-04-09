import { useState, useRef, useEffect } from "react";
import { RiNotification2Line } from "react-icons/ri";
import { ListNotification, GetMessageNotifications, deleteNotification, Notification as NotificationType } from "@/service/NotificationService";

interface NotificationProps {
  notifications: NotificationType[];
  onDelete: (id: number) => void;

}

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

const Notification = ({ notifications, onDelete }: NotificationProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [realTimeNotifications, setRealTimeNotifications] = useState<NotificationType[]>(notifications);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userId = localStorage.getItem("userId")
  // Xử lý click ngoài để đóng dropdown
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

  useEffect(() => {
    const fetchInitialNotifications = async () => {
      const initialNotifications = await ListNotification(1, 5, Number(userId) );
      setRealTimeNotifications(initialNotifications);
    };
    fetchInitialNotifications();
  }, [userId]);

  useEffect(() => {
    GetMessageNotifications((message: string) => {
      const newNotification: NotificationType = {
        id: Date.now(), 
        message,
        time: new Date().toISOString(),
      };

      setRealTimeNotifications((prev) => [...prev, newNotification]);
    });
  }, []);


  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <RiNotification2Line className="text-xl" />
        {realTimeNotifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {realTimeNotifications.length}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-10">
          <ul className="max-h-60 overflow-y-auto">
            {realTimeNotifications.length > 0 ? (
              realTimeNotifications.map((noti) => (
                <li
                  key={noti.id}
                  className="px-4 py-3 border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition relative"
                >
                  <p className="text-sm">{noti.message}</p>
                  <span className="text-xs text-gray-500">{timeAgo(noti.time)}</span>
                  <button
                    onClick={() => deleteNotification(noti.id)}
                    className="absolute bottom-2 right-2 text-gray-500 hover:text-red-500 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-center text-sm text-gray-500">
                Không có thông báo
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notification;