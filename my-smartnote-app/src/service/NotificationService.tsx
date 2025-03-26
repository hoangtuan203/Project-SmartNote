import httpRequest from "@/utils/httpRequest";

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

export const ListNotification = async (page: number = 1, size: number = 10): Promise<Notification[]> => {
  try {
    const response = await httpRequest.get<NotificationResponse>("/notifications", {
      params: { page, size },
    });


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


export const GetMessageNotifications = (callback: (message: string) => void) => {
  const socket = new WebSocket("ws://localhost:8080/ws");

  socket.onopen = () => {
    console.log("WebSocket connected!");
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("Received message from WebSocket:", data);
      if (data.content) {
        // Hiển thị thông báo hệ thống
        showNotification(data.content);
        callback(data.content);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected!");
  };
};

// Hàm hiển thị thông báo hệ thống
const showNotification = (message: string) => {
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
