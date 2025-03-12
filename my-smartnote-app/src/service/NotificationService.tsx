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

    console.log("Notification response:", response.data);

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
