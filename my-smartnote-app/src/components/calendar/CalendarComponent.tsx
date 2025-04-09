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
  const getPriorityColor = (priority: string, completed: string) => {
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

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        eventContent={(eventInfo) => (
          <div className="flex items-center w-full p-1">
            {/* Thanh màu bên trái giống Google Calendar */}
            <div
              className="w-1 h-full mr-2 rounded"
              style={{
                backgroundColor: eventInfo.event.backgroundColor,
              }}
            />
            <div className="flex-1 overflow-hidden">
              {/* Tiêu đề task */}
              <div className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                {eventInfo.event.title}
              </div>

              {/* Mô tả task */}
              {/* <div className="text-sm text-gray-700 dark:text-gray-400 mt-1 truncate">
                {eventInfo.event.extendedProps.description}
              </div> */}

              {/* Người thực hiện task */}
              <div className="text-xs text-gray-500 dark:text-gray-300 mt-1 truncate">
                <span className="font-semibold">👤</span>
                {eventInfo.event.extendedProps.assignee}
              </div>

              {/* Thời gian (nếu có) */}
              <div className="text-xs text-gray-500 dark:text-gray-300 mt-1 truncate">
                <span className="font-semibold">⌚ </span>
                {(() => {
                  const rawDate = eventInfo.event.extendedProps.start;
                  if (!rawDate) return "Không có thời gian"; // Kiểm tra nếu không có dữ liệu

                  const date = new Date(rawDate);
                  if (isNaN(date.getTime())) return "Ngày không hợp lệ"; // Kiểm tra nếu ngày bị lỗi

                  const hours = date.getHours().toString().padStart(2, "0");
                  const minutes = date.getMinutes().toString().padStart(2, "0");

                  return `${hours}:${minutes}`;
                })()}
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
        eventDisplay="block" // Đảm bảo sự kiện hiển thị dưới dạng khối
        eventTextColor="#000000" // Màu chữ đen để tương phản với nền
      />
    </div>
  );
};

export default CalendarComponent;
