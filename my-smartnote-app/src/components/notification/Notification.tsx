import { useState, useRef, useEffect } from "react";
import { RiNotification2Line } from "react-icons/ri";
interface NotificationProps {
  notifications: { id: number; message: string; time: string }[];
}

const Notification = ({ notifications }: NotificationProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Tạo ref cho dropdown

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
                  <span className="text-xs text-gray-500">{noti.time}</span>
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
