import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Calendar, Tag, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchTask, Task } from "@/service/TaskService";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../Pagination";

function getDaysLeft(dueDate: string) {
  if (!dueDate) return "Không xác định";

  const now = new Date();
  const deadline = new Date(dueDate);

  // Kiểm tra nếu ngày không hợp lệ
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

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const tasksPerPage = 5;

  // Hàm thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  const handleDoubleClick = (id: number) => {
    navigate(`/task/${id}`);
  };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTask(currentPage, tasksPerPage);
        console.log("Tasks:", data);
        setTasks(data?.tasks || []); // Cập nhật danh sách công việc
        setTotalPages(data?.totalPages ? data.totalPages : 0);
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    };
    loadTasks();
  }, [currentPage]);

  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();

    if (dateA !== dateB) {
      return dateA - dateB;
    }
    return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
  });

  return (
    <div className="w-full h-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTasks.map((task, index) => (
          <Card
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer transition hover:shadow-lg"
            onDoubleClick={() => handleDoubleClick(task.taskId)}
          >
            <div
              className={`py-2 px-4 rounded-t-lg ${
                priorityHeaderColors[task.priority] || "bg-gray-200 text-black"
              }`}
            >
              <div className="flex justify-between items-center">
                <h2
                  className={
                    task.status === "completed"
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
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Xóa task:", task.taskId);
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PaginationComponent */}
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
