import httpRequest from "@/utils/httpRequest";

export interface NoteFile {
  fileId: number;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface FileResponse {
  fileId: number;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface ApiResponse<T> {
  code: number;
  result: T;
  message : string
}

export const uploadFile = async (
  file: File,
  noteId?: number | null,
  userId?: number | null,
  commentId?: number | null
): Promise<FileResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    console.log("commentId", commentId)
    // Thêm noteId nếu nó không phải null
    if (noteId !== null && noteId !== undefined) {
      formData.append("noteId", noteId.toString());
    }

    // Thêm userId nếu nó không phải null
    if (userId !== null && userId !== undefined) {
      formData.append("userId", userId.toString());
    }

    // Thêm commentId nếu nó không phải null
    if (commentId !== null && commentId !== undefined) {
      formData.append("commentId", commentId.toString());
    }

    const response = await httpRequest.post<ApiResponse<FileResponse>>(
      "/files/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.result;
  } catch (error) {
    console.error("Upload file failed:", error);
    throw new Error("Failed to upload file");
  }
};

export const getFileUrl = async (fileId: number): Promise<string> => {
  try {
    const response = await httpRequest.get<ApiResponse<string>>(`/files/${fileId}/url`);
    return response.data.result;
  } catch (error) {
    console.error("Get file URL failed:", error);
    throw new Error("Failed to get file URL");
  }
};

export const deleteFile = async (fileId: number): Promise<boolean> => {
  try {
    const response = await httpRequest.delete<ApiResponse<boolean>>(
      `/files/delete/${fileId}`
    );

    if (response.data.code === 1000) {
      // Success, file is deleted
      return response.data.result; // This should return true if delete was successful
    } else {
      // If there is an unexpected code, throw an error
      throw new Error("Failed to delete file");
    }
  } catch (error) {
    console.error("Delete file failed:", error);
    throw new Error("Failed to delete file");
  }
};

export const getNoteFile = async (
  noteId: number | null, 
  commentId: number | null, 
  fileType: "NOTE" | "COMMENT"
): Promise<NoteFile[]> => {
  try {
    // Tạo đối tượng params với fileType
    const params: Record<string, number | "NOTE" | "COMMENT"> = { fileType };

    // Thêm noteId vào params nếu không phải null
    if (noteId !== null) {
      params.noteId = noteId;
    }

    // Thêm commentId vào params nếu không phải null
    if (commentId !== null) {
      params.commentId = commentId;
    }

    const response = await httpRequest.get<ApiResponse<NoteFile[]>>(
      "/files/getFiles",
      { params }
    );

    if (response.data.code === 1000 && response.data.result) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || "Failed to fetch note images");
    }
  } catch (error) {
    console.error("Error fetching note images:", error);
    throw new Error("Failed to fetch note images");
  }
};
