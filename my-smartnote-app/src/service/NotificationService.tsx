import httpRequest from "@/utils/httpRequest";
import SockJS from "sockjs-client";
import { Client } from '@stomp/stompjs';
export interface Notification {
  id: number;
  message: string;
  time: string;
}

interface NotificationResponse {
  code?: number;
  message?: string;
  result?: {
    totalPages: number;
    totalElements: number;
    notifications: {
      notificationId: number;
      userId: number;
      message: string;
      isRead: boolean;
      createdAt: string;
    }[];
  };
}

export const ListNotification = async (
  page: number = 1,
  size: number = 10,
  userId: number
): Promise<Notification[]> => {
  try {
    const response = await httpRequest.get<NotificationResponse>(
      "/notifications",
      {
        params: { page, size, userId },
      }
    );

    if (response.data.result && response.data.result.notifications) {
      return response.data.result.notifications.map((item) => ({
        id: item.notificationId, // Đổi từ notificationId thành id
        message: item.message,
        time: item.createdAt, // Đổi từ createdAt thành time
    
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};


let stompClient: Client;

export const GetMessageNotifications = (callback: (message: string) => void) => {
  const socket = new SockJS("http://localhost:8080/ws");
  
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log(str),
    onConnect: () => {
      console.log("✅ STOMP connected!");

      stompClient.subscribe("/topic/notifications", (message) => {
        try {
          const data = JSON.parse(message.body);
          console.log("📩 Received notification:", data);

          if (data.content) {
            showNotification(data.content);
            callback(data.content);
          }
        } catch (err) {
          console.error("❌ Error parsing message:", err);
        }
      });
    },
    onStompError: (frame) => {
      console.error("❌ STOMP error:", frame);
    },
    onWebSocketError: (event) => {
      console.error("❌ WebSocket error:", event);
    },
  });

  stompClient.activate();
};

// Hàm hiển thị thông báo hệ thống
export const showNotification = (message: string) => {
  // Kiểm tra quyền thông báo
  if (Notification.permission === "granted") {
    new Notification("Thông báo mới", {
      body: message,
      icon: "/path/to/icon.png", // Đường dẫn đến icon của bạn
    });
  } else if (Notification.permission !== "denied") {
    // Yêu cầu quyền thông báo nếu chưa được cấp
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("Thông báo mới", {
          body: message,
          icon: "/path/to/icon.png",
        });
      }
    });
  }
};

export const deleteNotification = async (
  notificationId: number
): Promise<boolean> => {
  try {
    console.log("Deleting notification with ID:", notificationId);
    const response = await httpRequest.delete(
      `/notifications/delete/${notificationId}`
    );

    console.log("Response from delete notification:", response.data);

    if (response.data.code === 1000) {
      return true; // Task deletion was successful
    }

    throw new Error(response.data.message || "Xóa thông báo thất bại");
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task");
  }
};
