import httpRequest from "@/utils/httpRequest";


export interface ShareResponse {
    shareId: number;
    entityId: number;  
    title: string;
    type: "NOTE" | "TASK";
    status: string;
    requestTime: string;
    ghostName: string;
    permission: string;
    tokenShare: string;
    userId : number;
    noteId: number ;
    taskId: number ;
}


interface ShareResponseData {
    code?: number;
    message?: string;
    result?: ShareResponse[];
}

export const getListShares = async (userId: number): Promise<ShareResponse[]> => {
    try {
        // Truyền userId dưới dạng query parameter
        const response = await httpRequest.get<ShareResponseData>(`/share?userId=${userId}`);
        return response.data?.result || [];
    } catch (error) {
        console.error("Error fetching share list:", error);
        if (error instanceof Error) {
            throw new Error(error.message || "Network error");
        }
        throw new Error("Unexpected error occurred");
    }
};

export const getListSharesByApprove = async (userId: number): Promise<ShareResponse[]> => {
    try {
        const response = await httpRequest.get<ShareResponseData>(`/share/getListShareApprove?userId=${userId}`);
        return response.data?.result || [];
    } catch (error) {
        console.error("Error fetching share list:", error);
        if (error instanceof Error) {
            throw new Error(error.message || "Network error");
        }
        throw new Error("Unexpected error occurred");
    }
};