import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Calendar, Tag, Trash2, User } from "lucide-react";
import { useEffect } from "react";
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

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

// Hàm tính số ngày còn lại đến deadline
const getDaysLeft = (dueDate: string) => {
  const today = new Date();
  const deadline = new Date(dueDate);
  return Math.ceil(
    (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
};
export default function TaskList({
  tasks,
  onToggleTask,
  onDeleteTask,
}: TaskListProps) {
  const defaultTasks: Task[] = [
    {
      id: 1,
      title: "Thiết kế UI",
      description: "Hoàn thành giao diện React",
      dueDate: "2025-02-25",
      priority: "Cao",
      assignee: "Rạng",
      tags: ["UI/UX", "Frontend"],
      completed: false,
    },
    {
      id: 2,
      title: "API Backend",
      description: "Xây dựng API Laravel",
      dueDate: "2025-02-26",
      priority: "Trung bình",
      assignee: "Hải",
      tags: ["Backend", "API"],
      completed: false,
    },
    {
      id: 3,
      title: "Test ứng dụng",
      description: "Kiểm thử tính năng chính",
      dueDate: "2025-02-27",
      priority: "Cao",
      assignee: "Tùng",
      tags: ["Testing", "QA"],
      completed: true,
    },
    {
      id: 4,
      title: "Gửi báo cáo",
      description: "Tổng hợp báo cáo tuần",
      dueDate: "2025-02-28",
      priority: "Thấp",
      assignee: "Huy",
      tags: ["Báo cáo"],
      completed: false,
    },
    {
      id: 5,
      title: "Fix lỗi login",
      description: "Sửa lỗi đăng nhập",
      dueDate: "2025-02-29",
      priority: "Cao",
      assignee: "Rạng",
      tags: ["Bugfix"],
      completed: true,
    },
    {
      id: 6,
      title: "Cập nhật database",
      description: "Thêm bảng mới",
      dueDate: "2025-03-01",
      priority: "Trung bình",
      assignee: "Dũng",
      tags: ["Database"],
      completed: false,
    },
    {
      id: 7,
      title: "Refactor code",
      description: "Tối ưu mã nguồn",
      dueDate: "2025-03-02",
      priority: "Thấp",
      assignee: "Linh",
      tags: ["Refactor"],
      completed: false,
    },
    {
      id: 8,
      title: "Thiết lập CI/CD",
      description: "Cấu hình pipeline",
      dueDate: "2025-03-03",
      priority: "Cao",
      assignee: "Phong",
      tags: ["DevOps"],
      completed: false,
    },
    {
      id: 9,
      title: "Phân tích yêu cầu",
      description: "Xác định tính năng mới",
      dueDate: "2025-03-04",
      priority: "Trung bình",
      assignee: "Trí",
      tags: ["Phân tích"],
      completed: true,
    },
    {
      id: 10,
      title: "Viết tài liệu",
      description: "Cập nhật tài liệu hướng dẫn",
      dueDate: "2025-03-05",
      priority: "Thấp",
      assignee: "Hương",
      tags: ["Docs"],
      completed: false,
    },
  ];

  const allTasks = [...defaultTasks, ...tasks];
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(allTasks));
  }, [tasks]);
  // Sắp xếp theo số ngày còn lại
  const sortedTasks = allTasks.sort(
    (a, b) => getDaysLeft(a.dueDate) - getDaysLeft(b.dueDate)
  );

  return (
    <div className="w-full h-full p-4">
      {/* <CalendarComponent tasks={allTasks} /> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTasks.map((task) => (
          <Card
            key={task.id}
            className={`p-4 ${task.completed ? "bg-green-100" : ""}`}
          >
            <CardContent className="flex flex-col gap-2">
              <div className="flex justify-between">
                <h2
                  className={
                    task.completed
                      ? "line-through text-gray-500"
                      : "font-semibold"
                  }
                >
                  {task.title}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleTask(task.id)}
                >
                  {task.completed ? (
                    <CheckCircle className="text-green-600" />
                  ) : (
                    <Circle className="text-gray-400" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-600">{task.description}</p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <User size={16} /> {task.assignee}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Tag size={16} /> {task.tags.join(", ")}
              </p>

              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-1 text-gray-500">
                  <Calendar size={16} /> {task.dueDate} (
                  {getDaysLeft(task.dueDate)} ngày)
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    task.priority === "Cao"
                      ? "text-red-500 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  <Tag size={16} /> {task.priority}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500"
                  onClick={() => onDeleteTask(task.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
