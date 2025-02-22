import { useState } from "react";
import { Input, DatePicker, Select, SelectItem, Textarea } from "@nextui-org/react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { DateValue } from "@internationalized/date"; // Import the correct type

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: string;
  assignee: string;
  tags: string[];
  completed: boolean;
}

interface CreateTaskProps {
  onAddTask: (task: Task) => void;
}

export default function CreateTask({ onAddTask }: CreateTaskProps) {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: null as DateValue | null, // Use DateValue type
    priority: "Thấp",
    assignee: "",
    tags: [] as string[],
  });

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
  
    // Chuyển đổi DateValue sang Date
    const formattedDueDate = newTask.dueDate ? new Date(newTask.dueDate.toString()) : null;
  
    onAddTask({
      id: Date.now(),
      ...newTask,
      dueDate: formattedDueDate, // ✅ Chuyển về kiểu Date | null
      completed: false,
    });
  
    // Reset form
    setNewTask({
      title: "",
      description: "",
      dueDate: null,
      priority: "Thấp",
      assignee: "",
      tags: [],
    });
  };
  

  return (
    <div className="p-6 border border-gray-300 rounded-xl max-w-lg bg-white shadow-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Thêm Công Việc</h2>

      <Input
        label="Tiêu đề công việc"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        className="mb-4"
      />

      <Textarea
        label="Mô tả công việc"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        className="mb-4"
      />

      <DatePicker
        className="w-full mb-4"
        value={newTask.dueDate}
        onChange={(date) => setNewTask({ ...newTask, dueDate: date ?? null })}
      />

      <Select
        label="Mức độ ưu tiên"
        selectedKeys={[newTask.priority]}
        onSelectionChange={(keys) => setNewTask({ ...newTask, priority: Array.from(keys)[0] as string })}
        className="w-full mb-4"
      >
        <SelectItem key="Cao" value="Cao">Cao</SelectItem>
        <SelectItem key="Trung bình" value="Trung bình">Trung bình</SelectItem>
        <SelectItem key="Thấp" value="Thấp">Thấp</SelectItem>
      </Select>

      <Input
        label="Người thực hiện"
        value={newTask.assignee}
        onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
        className="mb-4"
      />

      <Input
        label="Gán tag (cách nhau bằng dấu phẩy)"
        value={newTask.tags.join(", ")}
        onChange={(e) => setNewTask({ ...newTask, tags: e.target.value.split(",").map(tag => tag.trim()) })}
        className="mb-4"
      />

      <Button 
        color="primary" 
        className="w-full flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        onClick={handleAddTask}
      >
        <PlusIcon className="w-5 h-5" /> Thêm Công Việc
      </Button>
    </div>
  );
}

