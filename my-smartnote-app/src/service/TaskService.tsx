import httpRequest from "@/utils/httpRequest";

export interface Task {
  taskId: number;
  userId: number;
  username: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  priority: string;
  createdAt: string;
}

interface TaskResponse {
  code?: number;
  result?: {
    totalPages: number;
    totalElements: number;
    tasks: Task[];
  };
}

interface TaskCreateResponse {
  code?: number;
  message?: string;
  result?: Task;
}

export const fetchTask = async (
  page: number,
  size: number
): Promise<TaskResponse["result"]> => {
  try {
    const response = await httpRequest.get<TaskResponse>("/task", {
      params: { page, size },
    });

    if (response.data.code === 1000) {
      return response.data.result!;
    }

    throw new Error("Không thể lấy danh sách công việc");
  } catch (error) {
    console.error("Error fetching task:", error);
    throw new Error("Failed to fetch tasks");
  }
};

export const createTask = async (taskData: Partial<Task>): Promise<Task> => {
  try {
    const response = await httpRequest.post<TaskCreateResponse>(
      "/task/create",
      taskData
    );

    if (response.data.code === 1000) {
      return response.data.result!;
    }

    throw new Error(response.data.message || "Tạo công việc thất bại");
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Failed to create task");
  }
};
