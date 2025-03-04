import httpRequest from "@/utils/httpRequest";

export interface Note {
  createdAt: string | number | Date;
  noteId: number;
  userId: string;
  title: string;
  content: string;
  is_pinned: boolean | null;
  color: string;
}

interface NoteResponse {
  code?: number;
  result?: {
    totalPages: number;
    totalElements: number;
    notes: Note[];
  };
}

export const fetchNotes = async (page: number = 1, size: number = 5): Promise<Note[]> => {
    try {
      const response = await httpRequest.get<NoteResponse>("/note", {
        params: { page, size },
      });
  
      return response.data.result?.notes || []; 
    } catch (error) {
      console.error("Error fetching notes:", error);
      throw new Error("Failed to fetch notes");
    }
  };
  
