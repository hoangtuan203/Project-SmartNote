import httpRequest from "@/utils/httpRequest";

export interface Notification {
  id: number;
  message: string;
  time: string;
}

interface NotificationResponse {
  code?: number;
  message?: string;
  result?: Notification[];
}

export const ListNotification = async (page: number = 1, size: number = 5): Promise<Notification[]> => {
  try {
    const response = await httpRequest.get<NotificationResponse>("/notifications", {
      params: { page, size },
    });

    console.log("Notification response:", response.data.result);

    return response.data.result && response.data.result.length > 0 ? response.data.result : [];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return []; 
  }
};
