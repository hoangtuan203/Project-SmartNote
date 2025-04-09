import httpRequest from "@/utils/httpRequest";

export interface Comment {
  createdAt: string | number | Date;
  commentId: number;
  userId: number;
  username: string;
  noteId: number;
  content: string;
}

export interface CommentRequest {
  userId: number;
  noteId: number;
  content: string;
}

export interface CommentResponse {
  message? : string;
  code?: number;
  result?: Comment;
}

export interface CommentResponseGetList {
  code: number;
  message: string;
  result: Comment[]; // ✅ danh sách comment
}

export const fetchComments = async (
  quantity: number,
  userId: number
): Promise<CommentResponseGetList | undefined> => {
  try {
    const response = await httpRequest.get<CommentResponseGetList>(
      "/comment/list",
      {
        params: { quantity, userId },
      }
    );

    // Kiểm tra mã code trong phản hồi để đảm bảo thành công
    if (response.data.code === 1000) {
      return response.data; // Trả về đối tượng CommentResponseGetList nếu thành công
    } else {
      console.error("Error fetching comments:", response.data.message);
      throw new Error(response.data.message || "Failed to fetch comments");
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments");
  }
};
export const saveComment = async (
  comment: CommentRequest
): Promise<CommentResponse> => {
  try {
    const response = await httpRequest.post<CommentResponse>(
      "/comment/save",
      comment
    );
    return response.data; // ✅ chỉ return data
  } catch (error) {
    console.error("Error saving comment:", error);
    throw new Error("Failed to save comment");
  }
};

// Xóa comment
export const deleteComment = async (id: number): Promise<boolean> => {
  try {
    const response = await httpRequest.delete(`/comment/delete/${id}`);
    return response.data?.result ?? false;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw new Error("Failed to delete comment");
  }
};

//update comment 
export const updateComment = async (
  commentId: number,
  comment: CommentRequest
): Promise<CommentResponse> => {
  try {
    const response = await httpRequest.put<CommentResponse>(
      `/comment/update`,
      comment,
      {
        params: { commentId }, // Gửi commentId qua query param
      }
    );

    if (response.data.code === 1000) {
      return response.data;
    } else {
      console.error("Error updating comment:", response.data);
      throw new Error(response.data.message || "Failed to update comment");
    }
  } catch (error) {
    console.error("Error updating comment:", error);
    throw new Error("Failed to update comment");
  }
};
