import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import TaskList from "@/components/Task/TaskList";
import { Combobox } from "@headlessui/react";
import { ChevronDownIcon } from "lucide-react";
import { Input } from "@nextui-org/react";

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

const priorityLevels = ["Cao", "Trung Bình", "Thấp", "Tất cả"];

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate(); // ✅ Dùng useNavigate để điều hướng


  const [filterPriority, setFilterPriority] = useState("Tất cả");
  const [filterTitle, setFilterTitle] = useState("");
  const [priorityQuery, setPriorityQuery] = useState("");

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesPriority =
      filterPriority === "Tất cả" || task.priority === filterPriority;
    const matchesTitle = task.title
      .toLowerCase()
      .includes(filterTitle.toLowerCase());
    return matchesPriority && matchesTitle;
  });

  const filteredPriorities = priorityLevels.filter((level) =>
    level.toLowerCase().includes(priorityQuery.toLowerCase())
  );

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-4">

      
      </div>

      <TaskList/>
    </div>
  );
}
