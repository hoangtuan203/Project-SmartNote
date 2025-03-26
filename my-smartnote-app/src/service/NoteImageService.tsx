import httpRequest from "@/utils/httpRequest";

export interface NoteImage {
  imageId: number;
  imageUrl: string;
  noteId: number;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export const getNoteImages = async (noteId: number): Promise<NoteImage[]> => {
  try {
    const response = await httpRequest.get<ApiResponse<NoteImage[]>>(
      "/note/getImages",
      {
        params: { noteId },
      }
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

export const deleteNoteImage = async (imageId: number): Promise<boolean> => {
  try {
    const response = await httpRequest.delete<ApiResponse<boolean>>(
      `/note/deleteImage/${imageId}`
    );

    if (response.data.code === 1000 && response.data.result) {
      return true;
    } else {
      throw new Error(response.data.message || "Failed to delete note image");
    }
  } catch (error) {
    console.error("Error deleting note image:", error);
    throw new Error("Failed to delete note image");
  }
};
