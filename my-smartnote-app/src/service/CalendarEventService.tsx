import httpRequest from "@/utils/httpRequest";

export interface CalendarEventRequest {
  userId: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  color: string;
}

export interface CalendarEventResponse {
  eventId: number;
  userId: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  color : string;
  createdAt: string;
}

export interface ApiResponse<T> {
  code: number;
  result: T;
}

export const createEvent = async (
  eventData: CalendarEventRequest
): Promise<CalendarEventResponse> => {
  try {
    const response = await httpRequest.post<ApiResponse<CalendarEventResponse>>(
      "/calendar-events",
      eventData
    );
    return response.data.result;
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error("Failed to create calendar event");
  }
};

export const getEventsByUser = async (
    userId: number
  ): Promise<CalendarEventResponse[]> => {
    try {
      const response = await httpRequest.get<CalendarEventResponse[]>(
        `/calendar-events/user/${userId}`
      );
      console.log("User events:", response.data); // <- giờ response.data là mảng đúng rồi
      return response.data;
    } catch (error) {
      console.error("Error fetching user events:", error);
      throw new Error("Failed to fetch calendar events for user");
    }
  };
  