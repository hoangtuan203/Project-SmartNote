"use client";

import React, { useState, useEffect, useRef } from "react";
import Calendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@fullcalendar/core/locales/vi";
import { DatePickerComponent } from "./DatePickerComponent";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { fetchHolidays, HolidayEvent } from "@/service/CalendarService";
import { Task } from "@/service/TaskService";
import FullCalendar from "@fullcalendar/react";
import { createEvent, getEventsByUser } from "@/service/CalendarEventService";
import dayjs from "dayjs";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end?: Date | string | null;
  description?: string;
  location?: string;
  assignee?: string;
  color?: string;
}

interface CalendarComponentProps {
  tasks: Task[];
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ tasks }) => {
  const [calendarEvents, setCalendarEvents] = useState<HolidayEvent[]>([]);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const calendarRef = useRef<Calendar | null>(null);

  const getPriorityColor = (priority: string, completed: string) => {
    if (completed) return "#9CA3AF";
    return priority === "Cao"
      ? "#EF4444"
      : priority === "Trung bình"
      ? "#F59E0B"
      : "#10B981";
  };

  useEffect(() => {
    if (tasks.length > 0) {
      setCalendarEvents(
        tasks.map((task) => ({
          id: task.taskId.toString(),
          title: task.title,
          start: task.dueDate,
          color: getPriorityColor(task.priority, task.status),
          description: task.description,
          assignee: task.assignee,
        }))
      );
    }
  }, [tasks]);

  useEffect(() => {
    const loadHolidays = async () => {
      if (accessToken) {
        const holidays = await fetchHolidays(accessToken);
        setCalendarEvents((prev) => [...prev, ...holidays]);
      } else {
        console.error("Lỗi: Không tìm thấy access token!");
      }
    };

    loadHolidays();
  }, []);

  useEffect(() => {
    const fetchUserEvents = async () => {
      const userId = localStorage.getItem("userId");
      console.log("userId :", userId);

      try {
        const events = await getEventsByUser(Number(userId));
        console.log("events :", events);
        const mappedEvents = events.map((e) => ({
          id: e.eventId.toString(),
          title: e.title,
          start: e.start_time,
          end: e.end_time,
          color: e.color || "#3B82F6",
          description: e.description,
          location: e.location,
          assignee: "Bạn",
        }));
        setCalendarEvents((prev) => [...prev, ...mappedEvents]);
      } catch (error) {
        console.error("Lỗi khi load sự kiện từ user:", error);
      }
    };

    fetchUserEvents();
  }, []);

  const addEvent = async () => {
    const userId = parseInt(localStorage.getItem("userId") || "0");

    if (!userId || !newEventTitle || !selectedDate || !startTime || !endTime) {
      console.error("Thiếu thông tin cần thiết để tạo sự kiện");
      return;
    }

    try {
      const startDateTime = `${selectedDate}T${startTime}:00`;
      const endDateTime = `${selectedDate}T${endTime}:00`;

      const newEventData = {
        userId,
        title: newEventTitle,
        description: description || "Sự kiện mới",
        startTime: startDateTime,
        endTime: endDateTime,
        location: location || "Không xác định",
        color: "#3B82F6",
      };

      const createdEvent = await createEvent(newEventData);

      setCalendarEvents((prev) => [
        ...prev,
        {
          id: createdEvent.eventId.toString(),
          title: createdEvent.title,
          start: createdEvent.start_time,
          end: createdEvent.end_time,
          color: newEventData.color,
          description: createdEvent.description,
          location: createdEvent.location,
          assignee: "Bạn",
        },
      ]);

      setNewEventTitle("");
      setSelectedDate("");
      setStartTime("09:00");
      setEndTime("10:00");
      setLocation("");
      setDescription("");
    } catch (error) {
      console.error("Lỗi khi tạo sự kiện:", error);
    }
  };

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start || clickInfo.event.startStr,
      end: clickInfo.event.end || clickInfo.event.endStr || null,
      description: clickInfo.event.extendedProps.description,
      location: clickInfo.event.extendedProps.location,
      assignee: clickInfo.event.extendedProps.assignee,
      color: clickInfo.event.backgroundColor,
    });
    setIsEventDialogOpen(true);
  };

  const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newView = event.target.value;
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(newView);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Thêm sự kiện</Button>
          </DialogTrigger>
          <DialogContent className="p-4 space-y-4">
            <h3 className="text-lg font-semibold">Tạo Sự Kiện Mới</h3>
            <Input
              type="text"
              placeholder="Nhập tiêu đề sự kiện"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Mô tả"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Địa điểm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <DatePickerComponent
              onDateSelect={(date: Date) =>
                setSelectedDate(date.toLocaleDateString("sv-SE"))
              }
            />
            <div className="flex gap-2">
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
            <Button onClick={addEvent} className="w-full">
              Thêm
            </Button>
          </DialogContent>
        </Dialog>
        <select
          className="border rounded-md p-1"
          onChange={handleViewChange}
          defaultValue="dayGridMonth"
        >
          <option value="dayGridMonth">Tháng</option>
          <option value="timeGridWeek">Tuần</option>
          <option value="timeGridDay">Ngày</option>
        </select>
      </div>

      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Chi tiết sự kiện</h3>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                <Input type="text" value={selectedEvent.title} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <Input
                  type="text"
                  value={selectedEvent.description || "Không có mô tả"}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Địa điểm</label>
                <Input
                  type="text"
                  value={selectedEvent.location || "Không xác định"}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Thời gian bắt đầu</label>
                <Input
                  type="text"
                  value={
                    selectedEvent.start
                      ? dayjs(selectedEvent.start).format("YYYY-MM-DD HH:mm")
                      : "Không xác định"
                  }
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Thời gian kết thúc</label>
                <Input
                  type="text"
                  value={
                    selectedEvent.end
                      ? dayjs(selectedEvent.end).format("YYYY-MM-DD HH:mm")
                      : "Không xác định"
                  }
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Người thực hiện</label>
                <Input
                  type="text"
                  value={selectedEvent.assignee || "Không xác định"}
                  readOnly
                />
              </div>
            </div>
          )}
          <Button
            onClick={() => setIsEventDialogOpen(false)}
            className="w-full"
            variant="secondary"
          >
            Đóng
          </Button>
        </DialogContent>
      </Dialog>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        eventClick={handleEventClick}
        eventContent={(eventInfo) => (
          <div className="flex items-center w-full h-full p-1">
            {/* Colored bar on the left */}
            <div
              className="w-1 h-full rounded-l-md mr-1"
              style={{
                backgroundColor: eventInfo.event.backgroundColor || "#3B82F6",
              }}
            />
            <div className="flex-1 overflow-hidden">
              {/* Event title */}
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {eventInfo.event.title}
              </div>
              {/* Assignee and time */}
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-300 mt-0.5">
                {eventInfo.event.extendedProps.assignee && (
                  <span className="flex items-center">
                    <span className="mr-1">👤</span>
                    <span className="truncate">
                      {eventInfo.event.extendedProps.assignee}
                    </span>
                  </span>
                )}
                <span className="flex items-center">
                  <span className="mr-1">⌚</span>
                  <span>
                    {(() => {
                      const rawDate = eventInfo.event.start;
                      if (!rawDate) return "Không có thời gian";

                      const date = new Date(rawDate);
                      if (isNaN(date.getTime())) return "Ngày không hợp lệ";

                      const hours = date.getHours().toString().padStart(2, "0");
                      const minutes = date
                        .getMinutes()
                        .toString()
                        .padStart(2, "0");

                      return `${hours}:${minutes}`;
                    })()}
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        height="auto"
        timeZone="Asia/Ho_Chi_Minh"
        locale="vi"
        eventDisplay="block"
        eventTextColor="#000000"
        eventBorderColor="transparent" // Remove default border
        eventBackgroundColor="transparent" // Let custom styling handle the background
        eventClassNames="rounded-md shadow-sm bg-opacity-80" // Add rounded corners and shadow
        eventDidMount={(info) => {
          // Apply background color to the entire event block
          if (info.event.backgroundColor) {
            info.el.style.backgroundColor = `${info.event.backgroundColor}20`; // 20% opacity for background
          }
        }}
      />
    </div>
  );
};

export default CalendarComponent;