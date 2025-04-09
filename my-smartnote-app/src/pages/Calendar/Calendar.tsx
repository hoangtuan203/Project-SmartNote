import { useState, useEffect } from "react";
import { fetchAllTask, Task } from "@/service/TaskService";
import CalendarComponent from "@/components/calendar/CalendarComponent";

const Calendar = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    const response = await fetchAllTask();
    const data = response?.tasks || [];

    setTasks(data);
    localStorage.setItem("tasks", JSON.stringify(data));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <CalendarComponent tasks={tasks} />
    </div>
  );
};

export default Calendar;
