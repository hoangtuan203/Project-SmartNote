import httpRequest from "@/utils/httpRequest";


export interface Comment{
    createdAt: string | number | Date;
    commentId: number;
    userId: number;
    noteId :number ;
    content : string;
}

export interface CommentResponse{
    code?: number;
    result?: Comment[];
}

export const fetchComments = async (quantity: number): Promise<CommentResponse['result'] | undefined> => {
    try {
        const response = await httpRequest.get<CommentResponse>("/comment/list", {
            params: { quantity },
        });

        return response.data.result;
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw new Error("Failed to fetch comments");
    }
};

export const saveComment = async (
    comment: Omit<Comment, "commentId" | "createdAt">
  ): Promise<Comment | undefined> => {
    try {
      const response = await httpRequest.post<CommentResponse>("/comment/save", comment);
  
      // Trả về đối tượng comment từ result
      return response.data.result ? response.data.result[0] : undefined;
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
