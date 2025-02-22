import { useState, useEffect } from "react";
import CalendarComponent from "../components/calendar/CalendarComponent";

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  assignee: string;
  tags: string[];
  completed: boolean;
}

const Calendar = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  return (
    <div className="p-4">
      <CalendarComponent tasks={tasks} />
    </div>
  );
};

export default Calendar;
