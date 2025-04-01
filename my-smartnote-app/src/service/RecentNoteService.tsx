import httpRequest from "@/utils/httpRequest";

export interface RecentNote {
  id: string;
  userId: string;
  noteId: number;
  note_title: string;
  last_opend: string;
}

interface RecentNoteResponse {
  code?: number;
  message?: string;
  result?: RecentNote[];
}

export const fetchRecentNotes = async (
  quantity: number
): Promise<RecentNote[]> => {
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

export const saveRecentNote = async (
  userId: number,
  noteId: number
): Promise<RecentNote[]> => {
  try {
    console.log("Saving recent note");
    const response = await httpRequest.post<RecentNoteResponse>(
      `/recent-note/save`, // ✅ URL
      null, // Không có body
      {
        params: { userId, noteId }, // ✅ Truyền tham số dưới dạng params
      }
    );
    return response.data?.result || [];
  } catch (error) {
    console.error("Error saving recent note:", error);

    if (error instanceof Error) {
      throw new Error(error.message || "Network error");
    }

    throw new Error("Unexpected error occurred");
  }
};
