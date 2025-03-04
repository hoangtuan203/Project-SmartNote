import { useState } from "react";
import { Input, DatePicker, Textarea } from "@nextui-org/react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { Combobox } from "@headlessui/react";
import { DateValue } from "@internationalized/date";

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

const priorityLevels = ["Cao", "Trung bình", "Thấp"];

export default function CreateTask({ onAddTask }: CreateTaskProps) {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: null as DateValue | null,
    priority: "Thấp",
    assignee: "",
    tags: [] as string[],
  });

  const [query, setQuery] = useState("");

  const filteredPriorities =
    query === ""
      ? priorityLevels
      : priorityLevels.filter((level) =>
          level.toLowerCase().includes(query.toLowerCase())
        );

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const formattedDueDate = newTask.dueDate
      ? new Date(newTask.dueDate.toString())
      : null;

    onAddTask({
      id: Date.now(),
      ...newTask,
      dueDate: formattedDueDate,
      completed: false,
    });

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
    <div className="flex items-center justify-center min-h-screen  p-4">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-6 transition-all duration-300 transform hover:scale-105">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          📝 Thêm Công Việc
        </h2>

        <div className="space-y-4">
          <Input
            label="Tiêu đề công việc"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full"
          />

          <Textarea
            label="Mô tả công việc"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="w-full"
          />

          <DatePicker
            className="w-full"
            value={newTask.dueDate}
            onChange={(date) =>
              setNewTask({ ...newTask, dueDate: date ?? null })
            }
          />

          {/* Combobox cho mức độ ưu tiên */}
          <div className="relative w-full">
            <label className="block text-sm font-medium text-gray-700">
              Mức độ ưu tiên
            </label>
            <Combobox
              value={newTask.priority}
              onChange={(value) =>
                setNewTask({ ...newTask, priority: value ?? "Thấp" })
              }
            >
                <div className="relative mt-1">
                <div className="relative w-full cursor-default rounded-lg bg-white py-2 px-3 text-left shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <Combobox.Input
                    className="w-full border-none focus:ring-0 text-gray-900"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Chọn mức độ ưu tiên..."
                  />
                </div>
                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  {filteredPriorities.length === 0 && query !== "" ? (
                    <div className="cursor-default select-none px-4 py-2 text-gray-700">
                      Không tìm thấy
                    </div>
                  ) : (
                    filteredPriorities.map((priority) => (
                      <Combobox.Option
                        key={priority}
                        value={priority}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 px-4 ${
                            active ? "bg-blue-500 text-white" : "text-gray-900"
                          }`
                        }
                      >
                        {priority}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </div>
            </Combobox>
          </div>

          <Input
            label="Người thực hiện"
            value={newTask.assignee}
            onChange={(e) =>
              setNewTask({ ...newTask, assignee: e.target.value })
            }
            className="w-full"
          />

          <Input
            label="Gán tag (cách nhau bằng dấu phẩy)"
            value={newTask.tags.join(", ")}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                tags: e.target.value.split(",").map((tag) => tag.trim()),
              })
            }
            className="w-full"
          />

          <Button
            color="primary"
            className="w-full flex items-center gap-2 bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition duration-300 transform  shadow-lg"
            onClick={handleAddTask}
          >
            <PlusIcon className="w-6 h-6" /> Thêm Công Việc
          </Button>
        </div>
      </div>
    </div>
  );
}
