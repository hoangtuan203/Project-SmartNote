import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Comment {
  id: number;
  user: string;
  content: string;
  time: string;
}

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Xử lý thêm comment
  const handleAddComment = () => {
    if (!commentText.trim()) return;
    
    const newComment: Comment = {
      id: comments.length + 1,
      user: "Nguyễn Hoàng Tuấn",
      content: commentText,
      time: "Just now",
    };

    setComments([newComment, ...comments]); // Thêm comment mới lên đầu
    setCommentText(""); // Reset input
    setIsTyping(false); // Ẩn ô nhập
  };

  return (
    <div className="w-full max-w-2xl p-4 bg-black text-white rounded-md">
      <h2 className="text-2xl font-bold mb-4">New page</h2>

      {/* Danh sách comment */}
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full">
            <span className="text-sm font-bold">N</span>
          </div>
          <div>
            <p className="text-sm font-semibold">{comment.user} <span className="text-gray-400">{comment.time}</span></p>
            <p className="text-base">{comment.content}</p>
          </div>
        </div>
      ))}

      {/* Ô nhập comment */}
      {isTyping ? (
        <div className="flex items-center gap-2 mt-3">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-600 rounded-md bg-gray-800 text-white outline-none"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
          />
          <Button onClick={handleAddComment} className="bg-blue-600 hover:bg-blue-700">
            Comment
          </Button>
        </div>
      ) : (
        <button
          className="flex items-center gap-2 text-gray-400 hover:text-white mt-3"
          onClick={() => setIsTyping(true)}
        >
          <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full">
            <span className="text-sm font-bold">N</span>
          </div>
          Add a comment...
        </button>
      )}
    </div>
  );
}   