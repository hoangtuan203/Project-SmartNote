import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Calendar, Tag, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchTaskFilter, Task, updateTaskStatus, deleteTask } from "@/service/TaskService"; // Thay fetchTask bằng fetchTaskFilter
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../Pagination";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Combobox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Input } from "@nextui-org/react";

function getDaysLeft(dueDate: string) {
  if (!dueDate) return "Không xác định";

  const now = new Date();
  const deadline = new Date(dueDate);

  if (isNaN(deadline.getTime())) {
    console.error("Ngày không hợp lệ:", dueDate);
    return "Ngày không hợp lệ";
  }

  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `Quá hạn ${Math.abs(diffDays)} ngày`;
  }
  return ` Còn ${diffDays} ngày`;
}

const priorityOrder: Record<string, number> = {
  Cao: 3,
  "Trung Bình": 2,
  Thấp: 1,
};

const priorityHeaderColors: Record<string, string> = {
  Cao: "bg-red-400 text-black",
  "Trung Bình": "bg-yellow-400 text-black",
  Thấp: "bg-green-400 text-black",
};

const priorityLevels = ["Tất cả", "Cao", "Trung Bình", "Thấp"];

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const tasksPerPage = 5;

  // State cho bộ lọc
  const [filterPriority, setFilterPriority] = useState("Tất cả");
  const [filterTitle, setFilterTitle] = useState("");
  const [priorityQuery, setPriorityQuery] = useState("");

  const filteredPriorities = priorityLevels.filter((level) =>
    level.toLowerCase().includes(priorityQuery.toLowerCase())
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDoubleClick = (task: Task) => {
    navigate(`/task/${task.taskId}`, { state: { task } });
  };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const convertUserIdNumber = Number(userId);
        const data = await fetchTaskFilter(
          currentPage,
          tasksPerPage,
          convertUserIdNumber,
          filterPriority,
          filterTitle
        );
        setTasks(data?.tasks || []);
        setTotalPages(data?.totalPages ? data.totalPages : 0);
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    };
    loadTasks();
  }, [currentPage, filterPriority, filterTitle]); // Thêm filterPriority và filterTitle vào dependencies

  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();

    if (dateA !== dateB) {
      return dateA - dateB;
    }
    return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
  });

  const handleStatusChange = async (taskId: number) => {
    try {
      const success = await updateTaskStatus(taskId);
      if (success) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.taskId === taskId
              ? { ...task, status: "Đã hoàn thành" }
              : task
          )
        );
        toast.success("Cập nhật trạng thái thành công");
      } else {
        toast.error("Không thể cập nhật trạng thái");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  return (
    <div className="w-full h-full p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Thanh công cụ với nút Thêm và bộ lọc */}
      <div className="flex justify-between items-center mb-4">
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600"
          onClick={() => navigate("/task/create")}
        >
          Thêm Công Việc
        </Button>
        <div className="flex items-center gap-4">
          {/* Lọc theo Priority */}
          <div className="relative w-48">
            <Combobox
              value={filterPriority}
              onChange={(value) => setFilterPriority(value ?? "Tất cả")}
            >
              <div className="relative">
                <Combobox.Input
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 pr-10 focus:ring-2 focus:ring-blue-500"
                  onChange={(event) => setPriorityQuery(event.target.value)}
                  placeholder="Lọc theo ưu tiên..."
                />
                <Combobox.Button className="absolute inset-y-0 right-2 flex items-center pr-2">
                  <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                </Combobox.Button>
              </div>
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
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
            </Combobox>
          </div>

          {/* Lọc theo tên Task */}
          <Input
            placeholder="Lọc theo tên task..."
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
            className="w-48"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTasks.map((task, index) => (
          <Card
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer transition hover:shadow-lg"
            onDoubleClick={() => handleDoubleClick(task)}
          >
            <div
              className={`py-2 px-4 rounded-t-lg ${
                priorityHeaderColors[task.priority] || "bg-gray-200 text-black"
              }`}
            >
              <div className="flex justify-between items-center">
                <input
                  type="checkbox"
                  checked={task.status === "Đã hoàn thành"}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleStatusChange(task.taskId);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4"
                />
                <h2
                  className={
                    task.status === "Đã hoàn thành" // Đồng bộ với status
                      ? "line-through"
                      : "font-semibold"
                  }
                >
                  {task.title}
                </h2>

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="text-black" />
                    </Button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="bg-white shadow-lg rounded-md p-2 min-w-[150px]">
                      <DropdownMenu.Item
                        className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Chỉnh sửa task:", task.taskId);
                        }}
                      >
                        ✏️ Chỉnh sửa
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        className="px-2 py-1 hover:bg-red-100 text-red-500 cursor-pointer rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Xóa task:", task.taskId);
                        }}
                      >
                        🗑️ Xóa
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            </div>

            <CardContent className="flex flex-col gap-2 p-4">
              <p className="text-sm text-gray-600">{task.description}</p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <User size={16} /> {task.username}
              </p>
              <div className="flex justify-between items-center mt-2">
                <div
                  className={`flex items-center gap-1 text-gray-500 ${
                    getDaysLeft(task.dueDate).includes("Quá hạn")
                      ? "text-red-500 font-semibold"
                      : ""
                  }`}
                >
                  <Calendar size={16} /> {getDaysLeft(task.dueDate)}
                </div>
                <div
                  className={`flex items-center gap-1 font-semibold ${
                    task.priority === "Cao"
                      ? "text-red-500"
                      : task.priority === "Trung Bình"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  <Tag size={16} /> {task.priority}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500"
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      const success = await deleteTask(task.taskId);
                      toast.success("Task deleted successfully");
                      if (success) {
                        setTasks((prevTasks) =>
                          prevTasks.filter((t) => t.taskId !== task.taskId)
                        );
                      }
                    } catch (error) {
                      console.error("Error deleting task:", error);
                    }
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}