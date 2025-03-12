export interface HolidayEvent {
  id: string;
  title: string;
  start: string;
  color: string;
  description: string;
}

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: { date: string };
}

export const fetchHolidays = async (accessToken: string): Promise<HolidayEvent[]> => {
    console.log("accessToken", accessToken);    
    const calendarId = "vi.vietnamese#holiday@group.v.calendar.google.com";
    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`, 
          Accept: "application/json",
        },
      });
  
      console.log("data calendar :", response);
  
      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu từ Google Calendar");
      }
  
      const data: { items: GoogleCalendarEvent[] } = await response.json();
  
      return data.items.map((event: GoogleCalendarEvent) => ({
        id: event.id,
        title: event.summary,
        start: event.start.date,
        color: "#6B7280",
        description: "Ngày lễ tại Việt Nam",
      }));
    } catch (error) {
      console.error("Lỗi khi tải ngày lễ:", error);
      return [];
    }
  };
  