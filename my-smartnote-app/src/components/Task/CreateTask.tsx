import { useState, useCallback } from "react";
import { Input } from "@nextui-org/react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { Combobox } from "@headlessui/react";
import { DateValue } from "@internationalized/date";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { createTask, Task } from "@/service/TaskService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
const priorityLevels = ["Cao", "Trung bình", "Thấp"];
const statusLevels = ["Đang hoàn thành", "Đã hoàn thành", "Đang thực hiện"];

export default function CreateTask() {
  const [date, setDate] = React.useState<Date>();
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: null as DateValue | null,
    priority: "Thấp",
    status: "Đang thực hiện",
    assignee: "",
  });


  const [priorityQuery, setPriorityQuery] = useState("");
  const [statusQuery, setStatusQuery] = useState("");

  const filteredPriorities = priorityLevels.filter((level) =>
    level.toLowerCase().includes(priorityQuery.toLowerCase())
  );

  const filteredStatus = statusLevels.filter((level) =>
    level.toLowerCase().includes(statusQuery.toLowerCase())
  );
  const location = useLocation();
  const taskToEdit = location.state?.task as Task | undefined;
  
  React.useEffect(() => {
    if (taskToEdit) {
      setNewTask({
        title: taskToEdit.title,
        description: taskToEdit.description,
        dueDate: null, // Không cần dùng trong state này vì dùng date riêng
        priority: taskToEdit.priority,
        status: taskToEdit.status,
        assignee: taskToEdit.username || "",
      });
      setDate(new Date(taskToEdit.dueDate));
    }
  }, [taskToEdit]);

  //create task
  const handleAddTask = useCallback(async () => {
    if (!newTask.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề công việc");
      return;
    }

    if (!newTask.description.trim()) {
      toast.error("Vui lòng nhập mô tả công việc");
      return;
    }

    if (!date) {
      toast.error("Vui lòng chọn ngày hết hạn");
      return;
    }
    const userId = Number(localStorage.getItem("userId")) || undefined;

    const formattedDueDate = date ? date.toISOString() : undefined;

    try {
      const createdTask = await createTask({
        userId: userId,
        title: newTask.title,
        description: newTask.description,
        dueDate: formattedDueDate,
        priority: newTask.priority,
        status: newTask.status,
        assignee: newTask.description,
      });
      toast.success("Task created successfully");
      // navigate("/task/")
      if (createdTask) {
        setNewTask({
          title: "",
          description: "",
          dueDate: null,
          priority: "Thấp",
          status: "Đang thực hiện",
          assignee: ""
        });

      } else {
        throw new Error("Task creation failed");
      }
    } catch {
      toast.error("Failed to create task");
    }
  }, [newTask, date]);

  return (
    <div className="flex items-center justify-center ">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-6 transition-transform transform">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          📝 Thêm Công Việc
        </h2>

        <div className="space-y-4">
          <Input
            placeholder="Tiêu đề công việc"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full"
          />

          <Textarea
            placeholder="Mô tả công việc"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="w-full h-40" // Điều chỉnh chiều cao
          />

          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "w-full border border-gray-300 rounded-lg py-2 px-3 pr-10 flex items-center justify-between cursor-pointer text-gray-700",
                  !date && "text-muted-foreground"
                )}
              >
                <span>{date ? format(date, "PPP") : "Chọn Ngày Hết Hạn"}</span>
                <CalendarIcon className="w-5 h-5 text-gray-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/** Combobox for Priority */}
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
                <div className="relative">
                  <Combobox.Input
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 pr-10 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    onChange={(event) => setPriorityQuery(event.target.value)}
                    placeholder="Chọn mức độ ưu tiên..."
                  />
                  <Combobox.Button className="absolute inset-y-0 right-2 flex items-center pr-2">
                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  </Combobox.Button>
                </div>
                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-300 z-10">
                  {filteredPriorities.length === 0 ? (
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

          {/** Combobox for Status */}
          <div className="relative w-full">
            <label className="block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <Combobox
              value={newTask.status}
              onChange={(value) =>
                setNewTask({ ...newTask, status: value ?? "Đang hoàn thành" })
              }
            >
              <div className="relative mt-1">
                <div className="relative">
                  <Combobox.Input
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 pr-10 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    onChange={(event) => setStatusQuery(event.target.value)}
                    placeholder="Chọn trạng thái..."
                  />
                  <Combobox.Button className="absolute inset-y-0 right-2 flex items-center pr-2">
                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  </Combobox.Button>
                </div>
                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-300 z-10">
                  {filteredStatus.length === 0 ? (
                    <div className="cursor-default select-none px-4 py-2 text-gray-700">
                      Không tìm thấy
                    </div>
                  ) : (
                    filteredStatus.map((status) => (
                      <Combobox.Option
                        key={status}
                        value={status}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 px-4 ${
                            active ? "bg-blue-500 text-white" : "text-gray-900"
                          }`
                        }
                      >
                        {status}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </div>
            </Combobox>
          </div>

          {/** Input for Assignee (Người thực hiện) */}
          <div className="relative w-full">
            <label className="block text-sm font-medium text-gray-700">
              Người thực hiện
            </label>
            <Input
              placeholder="Nhập tên người thực hiện..."
              value={newTask.assignee}
              onChange={(e) =>
                setNewTask({ ...newTask, assignee: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>

          <Button
            color="primary"
            className="w-full flex items-center gap-2 bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition duration-300 shadow-lg transform hover:scale-105"
            onClick={handleAddTask}
          >
            <PlusIcon className="w-6 h-6" /> Thêm Công Việc
          </Button>
        </div>
      </div>
    </div>
  );
}
