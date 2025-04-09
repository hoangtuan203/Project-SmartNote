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
  assignee: string;
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
  size: number,
  userId : number
): Promise<TaskResponse["result"]> => {
  try {
    const response = await httpRequest.get<TaskResponse>("/task", {
      params: { page, size, userId },
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

export const fetchAllTask = async (): Promise<TaskResponse["result"]> => {
  try {
    const response = await httpRequest.get<TaskResponse>("/task/getAll", {});
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

//delete task by id
export const deleteTask = async (taskId: number): Promise<boolean> => {
  try {
    const response = await httpRequest.delete(`/task/delete/${taskId}`);

    if (response.data.code === 1000) {
      return true;  // Task deletion was successful
    }

    throw new Error(response.data.message || "Xóa công việc thất bại");
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task");
  }
};
