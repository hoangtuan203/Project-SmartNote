import httpRequest from "@/utils/httpRequest";

export interface Task {
 taskId : number;
 userId : number;
 username : string;
 title : string;
 description : string;
 dueDate : string;
 status : string;
 priority : string;
 createdAt : string;
}

interface TaskResponse {
  code?: number;
  result?: {
    totalPages: number;
    totalElements: number;
    tasks: Task[];
  };
}


export const fetchTask = async (page: number = 1, size: number = 5): Promise<Task[]> => {
    try {
      const response = await httpRequest.get<TaskResponse>("/task", {
        params: { page, size },
      });
  
      return response.data.result?.tasks || []; 
    } catch (error) {
      console.error("Error fetching task:", error);
      throw new Error("Failed to fetch tasks");
    }
  };
  