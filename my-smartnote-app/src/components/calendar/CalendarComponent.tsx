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
  const [calendarEvents, setCalendarEvents] = useState<HolidayEvent[]>([]);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const accessToken = localStorage.getItem("accessToken");
  const calendarRef = useRef<Calendar | null>(null);

  // Lấy màu sắc theo mức độ ưu tiên
  const getPriorityColor = (priority: string, completed: boolean) => {
    if (completed) return "#9CA3AF"; // Xám cho task hoàn thành
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
          id: task.id.toString(),
          title: task.title,
          start: task.dueDate,
          color: getPriorityColor(task.priority, task.completed),
          description: task.description,
        }))
      );
    }
  }, [tasks]);

  useEffect(() => {
    const loadHolidays = async () => {
      if (accessToken) {
        console.log("access token", accessToken);
        const holidays = await fetchHolidays(accessToken);
        setCalendarEvents((prev) => [...prev, ...holidays]);
      } else {
        console.error("Lỗi: Không tìm thấy access token!");
      }
    };

    loadHolidays();
  }, []);

  const addEvent = () => {
    if (newEventTitle && selectedDate) {
      const newEvent = {
        id: (calendarEvents.length + 1).toString(),
        title: newEventTitle,
        start: selectedDate,
        color: "#3B82F6",
        description: "Sự kiện mới",
      };
      setCalendarEvents([...calendarEvents, newEvent]);
      setNewEventTitle("");
      setSelectedDate("");
    }
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
            <DatePickerComponent
              onDateSelect={(date: Date) =>
                setSelectedDate(date.toLocaleDateString("sv-SE"))
              }
            />

            <Button onClick={addEvent} className="w-full">
              Thêm
            </Button>
          </DialogContent>
          <div className="flex justify-between items-center mb-2">
           
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
        </Dialog>
      </div>

      <Calendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        eventContent={(eventInfo) => (
          <div
            className="p-1 text-white text-sm rounded-md shadow-md"
            style={{
              backgroundColor: eventInfo.event.extendedProps.color,
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
          right: "",
        }}
        height="auto"
        timeZone="Asia/Ho_Chi_Minh"
        locale="vi"
      />
    </div>
  );
};

export default CalendarComponent;
