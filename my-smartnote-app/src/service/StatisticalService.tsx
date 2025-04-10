import httpRequest from "@/utils/httpRequest";

// Response models
export interface TaskByDateResponse {
    day: string;      // Changed from "date"
    completed: number; // Changed from "count"
}

export interface CompletionRatioResponse {
    status: string; // Changed from "date"
    count: number;  // Changed from "completedCount"
}

export interface TaskByPriorityResponse {
    day: string;      // Changed from "priority"
    completed: number; // Changed from "count"
}

export interface OverdueTaskResponse {
    date: string;
    count: number;
}

// Hàm gọi API
export const getTasksByDay = async (userId: number): Promise<TaskByDateResponse[]> => {
    try {
        const response = await httpRequest.get<TaskByDateResponse[]>(
            `/statistical/by-day?userId=${userId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching tasks by day:", error);
        throw error;
    }
};

// 2. Lấy tỷ lệ hoàn thành
export const getCompletionRatio = async (userId: number): Promise<CompletionRatioResponse[]> => {
    try {
        const response = await httpRequest.get<CompletionRatioResponse[]>(
            `/statistical/completion-ratio?userId=${userId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching completion ratio:", error);
        throw error;
    }
};

// 3. Thống kê theo độ ưu tiên
export const getTasksByPriority = async (userId: number): Promise<TaskByPriorityResponse[]> => {
    try {
        const response = await httpRequest.get<TaskByPriorityResponse[]>(
            `/statistical/by-priority?userId=${userId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching tasks by priority:", error);
        throw error;
    }
};

// 4. Danh sách task quá hạn
export const getOverdueTasks = async (userId: number): Promise<OverdueTaskResponse[]> => {
    try {
        const response = await httpRequest.get<OverdueTaskResponse[]>(
            `/statistical/overdue?userId=${userId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching overdue tasks:", error);
        throw error;
    }
};