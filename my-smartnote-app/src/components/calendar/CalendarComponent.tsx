import React, { useState, useEffect } from "react";
import Calendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import "@fullcalendar/core/locales/vi";

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  completed: boolean;
}

interface CalendarComponentProps {
  tasks: Task[];
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ tasks }) => {
  const [calendarEvents, setCalendarEvents] = useState<
    { id: string; title: string; start: string; color: string; description: string }[]
  >([]);

  // Hàm lấy màu sắc dựa trên mức độ ưu tiên
  const getPriorityColor = (priority: string, completed: boolean) => {
    if (completed) return "#9CA3AF"; // Màu xám cho task đã hoàn thành
    return priority === "Cao" ? "#EF4444" : priority === "Trung bình" ? "#F59E0B" : "#10B981";
  };

  useEffect(() => {
    if (tasks.length > 0) {
      setCalendarEvents(
        tasks.map((task) => ({
          id: task.id.toString(),
          title: task.title,
          start: task.dueDate,
          color: getPriorityColor(task.priority, task.completed),
          description: task.description,
        }))
      );
    }
  }, [tasks]);

  // Xử lý khi nhấn vào một ngày trên lịch
  const handleDateClick = (arg: DateClickArg) => {
    const title = prompt("Nhập tiêu đề sự kiện:");
    if (title) {
      const newEvent = {
        id: (calendarEvents.length + 1).toString(),
        title,
        start: arg.dateStr,
        color: "#3B82F6",
        description: "Sự kiện mới",
      };
      setCalendarEvents([...calendarEvents, newEvent]);
    }
  };

  return (
    <div className="  p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
      {/* <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
        📅 Quản lý Lịch Công Việc
      </h2> */}
      <Calendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        dateClick={handleDateClick}
        eventContent={(eventInfo) => (
          <div
            className="p-1 text-white text-sm rounded-md shadow-md"
            style={{
              backgroundColor: eventInfo.event.extendedProps.color,
              cursor: "pointer",
              padding: "5px",
            }}
          >
            <strong>{eventInfo.event.title}</strong>
            <br />
            <small>{eventInfo.event.extendedProps.description}</small>
          </div>
        )}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="auto"
        timeZone="Asia/Ho_Chi_Minh"
        locale="vi"
      />
    </div>
  );
};

export default CalendarComponent;
