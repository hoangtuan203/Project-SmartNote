import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, Image, MessageCircle, X, Paperclip, Send } from "lucide-react";

interface Comment {
  id: number;
  user: string;
  content: string;
  time: string;
}

export default function CreateNote() {
  const [title, setTitle] = useState("Untitled Note");
  const [icon, setIcon] = useState("📝");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [coverImage, setCoverImage] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  // const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  // const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);
  const commentBoxRef = useRef<HTMLDivElement>(null);

  // Ẩn comment box khi bấm ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commentBoxRef.current &&
        !commentBoxRef.current.contains(event.target as Node)
      ) {
        setIsCommentBoxVisible(false);
      }
    };

    if (isCommentBoxVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCommentBoxVisible]);

  // Xử lý chọn ảnh
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Xử lý chọn file đính kèm cho comment
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(
        (file) => file.size <= 5 * 1024 * 1024
      ); // Giới hạn 5MB
      if (newFiles.length > 0) {
        setAttachedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      } else {
        alert("File quá lớn! Vui lòng chọn file dưới 5MB.");
      }
    }
  };

  const handleDeleteComment = (id: number) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== id)
    );
  };

  // Ẩn Emoji Picker khi bấm ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Xử lý thêm comment
  const handleAddComment = () => {
    if (!commentText.trim() && !attachedFile) return;

    const newComment: Comment = {
      id: comments.length + 1,
      user: "Nguyễn Hoàng Tuấn",
      content: commentText,
      time: "Just now",
    };

    setComments([newComment, ...comments]);
    setCommentText("");
    setAttachedFile(null);
  };

  return (
    <div className="w-full min-h-screen px-10 py-6 bg-white text-black shadow-lg">
      {/* Ảnh bìa nếu có */}
      {coverImage && (
        <div className="relative mb-4">
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-60 object-cover rounded-md"
          />
          <Button
            variant="ghost"
            className="absolute top-2 right-2 bg-white rounded-full p-1"
            onClick={() => setCoverImage("")}
          >
            <X size={20} />
          </Button>
        </div>
      )}

      {/* Tiêu đề có thể chỉnh sửa */}
      <div className="flex items-center gap-2">
        <span
          className="text-3xl cursor-pointer"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          {icon}
        </span>
        <input
          className="w-full text-3xl font-bold border-none outline-none bg-transparent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute z-10 bg-white border rounded-md shadow-lg p-2"
        >
          <EmojiPicker
            onEmojiClick={(emoji) => {
              setIcon(emoji.emoji);
              setShowEmojiPicker(false);
            }}
          />
        </div>
      )}

      {/* Các nút tùy chọn */}
      <div className="flex gap-3 mt-3 text-gray-500">
        <Button
          variant="ghost"
          className="flex items-center gap-1"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Image size={16} /> Add icon
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-1"
          onClick={() => fileInputRef.current?.click()}
        >
          <Plus size={16} /> Add cover
        </Button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />

        <Button
          variant="ghost"
          className="flex items-center gap-1"
          onClick={() => setIsCommentBoxVisible((prev) => !prev)}
        >
          <MessageCircle size={16} /> Comment
        </Button>
      </div>

      {/* Danh sách comment */}
      {isCommentBoxVisible && (
        <div className="mt-8">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start gap-3 mb-3 relative group"
            >
              {/* Avatar */}
              <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full text-white">
                <span className="text-sm font-bold">N</span>
              </div>

              {/* Nội dung comment */}
              <div className="flex-1">
                <p className="text-sm font-semibold">
                  {comment.user}{" "}
                  <span className="text-gray-400">{comment.time}</span>
                </p>
                <p className="text-base">{comment.content}</p>
              </div>

              {/* Nút xoá (ẩn khi không hover) */}
              <X
                size={16}
                className="text-red-500 cursor-pointer hidden group-hover:block absolute right-0 top-1"
                onClick={() => handleDeleteComment(comment.id)}
              />
            </div>
          ))}

          {/* Ô nhập comment */}
          {/* Ô nhập comment */}
          <div className="flex flex-col gap-2 bg-gray-100 p-2 rounded-lg relative">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full text-white">
                <span className="text-sm font-bold">N</span>
              </div>
              <input
                type="text"
                className="flex-1 p-2 bg-gray-100 text-black border-none outline-none placeholder-gray-400"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              />
              <input
                type="file"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />

              <Paperclip
                size={16}
                className="text-gray-400 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              />
              <Send
                size={16}
                className="text-gray-400 cursor-pointer"
                onClick={handleAddComment}
              />
            </div>

            {/* Hiển thị file đính kèm bên trong input comment */}
            {attachedFiles.length > 0 && (
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                {attachedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 border rounded-lg bg-gray-200 text-sm"
                  >
                    {/* Icon file dựa trên định dạng */}
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-lg">
                      {file.type.includes("excel") ? (
                        <span className="text-green-400 font-bold">XLSX</span>
                      ) : file.type.includes("pdf") ? (
                        <span className="text-red-400 font-bold">PDF</span>
                      ) : (
                        <span className="text-blue-400 font-bold">FILE</span>
                      )}
                    </div>

                    {/* Tên file */}
                    <p className="truncate max-w-[100px]">{file.name}</p>

                    {/* Nút xóa file */}
                    <X
                      size={16}
                      className="text-red-500 cursor-pointer"
                      onClick={() =>
                        setAttachedFiles(
                          attachedFiles.filter((_, i) => i !== index)
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Khu vực soạn thảo ghi chú */}
      <div
        contentEditable={true}
        className="w-full min-h-80 mt-5 p-4 text-lg outline-none rounded-md"
      />
    </div>
  );
}
