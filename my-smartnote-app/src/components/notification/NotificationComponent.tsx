import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onClose: () => void;
}

const iconMap = {
  success: <CheckCircle className="text-green-500" />,
  error: <AlertCircle className="text-red-500" />,
  warning: <AlertTriangle className="text-yellow-500" />,
  info: <Info className="text-blue-500" />,
};

const Notification: React.FC<NotificationProps> = ({
  message,
  type = "info",
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto close after 4s

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed top-5 right-5 flex items-center gap-3 p-4 shadow-lg rounded-xl text-white",
        {
          "bg-green-600": type === "success",
          "bg-red-600": type === "error",
          "bg-yellow-500": type === "warning",
          "bg-blue-600": type === "info",
        }
      )}
    >
      {iconMap[type]}
      <span>{message}</span>
      <button onClick={onClose} className="ml-auto text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Notification;
