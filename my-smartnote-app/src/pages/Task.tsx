import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import TaskList from "../components/Task/TaskList";
import { Button } from "@/components/ui/button";

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

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate(); // ✅ Dùng useNavigate để điều hướng

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold ml-4">Quản lý Công Việc</h1>
        <Button 
          className="bg-blue-500 mr-4 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={() => navigate("/task/createTask")} // ✅ Chuyển đến trang /createTask
        >
          + Thêm Công Việc
        </Button>
      </div>

      <TaskList tasks={tasks} onToggleTask={toggleTask} onDeleteTask={deleteTask} />
    </div>
  );
}
