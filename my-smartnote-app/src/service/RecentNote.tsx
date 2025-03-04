import httpRequest from "@/utils/httpRequest";

export interface RecentNote {
  id: string;
  userId: string;
  noteId: string;
  note_title: string;
  lastOpened: string;
}

interface RecentNoteResponse {
  code?: number;
  message?: string;
  result?: RecentNote[];
}

export const fetchRecentNotes = async (quantity: number): Promise<RecentNote[]> => {
    try {
      const response = await httpRequest.get<RecentNoteResponse>(
        "/recent-note/getListByQuantity",
        {
          params: { quantity },
        }
      );
      
      return response.data?.result || []; // ✅ Fix lỗi truy cập result
    } catch (error) {
      console.error("Error fetching recent notes:", error);
  
      if (error instanceof Error) {
        throw new Error(error.message || "Network error");
      }
  
      throw new Error("Unexpected error occurred");
    }
  };
  

