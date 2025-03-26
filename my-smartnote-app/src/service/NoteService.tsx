import httpRequest from "@/utils/httpRequest";
export interface Note {
  createdAt: string | number | Date;
  noteId: number;
  userId: number;
  title: string;
  content: string;
  is_pinned: boolean | null;
  color: string;
}

export interface NoteRequest {
  userId: number;
  title: string;
  content: string;
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NoteResponse {
  code?: number;
  message?: string;
  result?: {
    totalPages: number;
    totalElements: number;
    notes: Note[];
  };
}

export interface ApiResponse<T> {
  code?: number;
  message?: string;
  result?: T;
}

export interface NoteResponseCreate {
  code?: number;
  message?: string;
  result?: Note;
}

// Lấy tất cả ghi chú (gọi API từ controller @GetMapping("/getAll"))
export const getAllNotes = async (): Promise<Note[]> => {
  try {
    const response = await httpRequest.get<ApiResponse<Note[]>>("/note/getAll");

    // Kiểm tra phản hồi từ API
    // console.log("API response (getAllNotes):", response.data);

    if (response.data.code === 1000) {
      return response.data.result || [];
    } else {
      throw new Error("Failed to fetch all notes");
    }
  } catch (error) {
    console.error("Error fetching all notes:", error);
    throw new Error("Failed to fetch all notes");
  }
};

export const fetchNotes = async (
  page: number = 1,
  size: number = 5
): Promise<NoteResponse["result"] | undefined> => {
  try {
    const response = await httpRequest.get<NoteResponse>("/note", {
      params: { page, size },
    });

    console.log("API response (fetchNotes):", response.data);

    return response.data.result;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw new Error("Failed to fetch notes");
  }
};

export const saveNote = async (
  noteData: NoteRequest,
  images?: File[]
): Promise<Note> => {
  try {
    const formData = new FormData();
    formData.append("note", JSON.stringify(noteData));

    if (images) {
      images.forEach((image) => formData.append("images", image));
    }

    const response = await httpRequest.post<NoteResponseCreate>(
      "/note/save",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log("API response (saveNote):", response.data);

    if (response.data?.result) {
      return response.data.result;
    } else {
      throw new Error("API response does not contain a valid note");
    }
  } catch (error) {
    console.error("Error saving note:", error);
    throw new Error("Failed to save note");
  }
};

export const updateNote = async (
  noteId: number,
  noteData: Partial<NoteRequest>,
  images?: File[]
): Promise<Note> => {
  try {
    const formData = new FormData();
    formData.append("note", JSON.stringify(noteData));

    if (images) {
      images.forEach((image) => formData.append("images", image));
    }

    const response = await httpRequest.put<NoteResponseCreate>(
      `/note/update/${noteId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log("API response (updateNote):", response.data);

    if (response.data?.result) {
      return response.data.result;
    } else {
      throw new Error("API response does not contain a valid note");
    }
  } catch (error) {
    console.error("Error updating note:", error);
    throw new Error("Failed to update note");
  }
};

export const getImageUrl = async (filename: string): Promise<string> => {
  try {
    const response = await httpRequest.get(`/images/${filename}`, {
      responseType: "blob", // Quan trọng để tải ảnh dưới dạng binary
    });

    // Tạo URL từ blob
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    return ""; // Trả về chuỗi rỗng nếu lỗi để tránh crash UI
  }
};
