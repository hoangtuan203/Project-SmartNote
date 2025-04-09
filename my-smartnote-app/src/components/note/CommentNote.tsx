// CommentNote.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Paperclip,
  AtSign,
  Upload,
  Smile,
  Check,
  MoreHorizontal,
  Send,
  Edit,
  X,
} from "lucide-react";
import {
  Comment,
  deleteComment,
  fetchComments,
  saveComment,
  updateComment,
} from "@/service/CommentService";
import {
  deleteFile,
  getNoteFile,
  NoteFile,
  uploadFile,
} from "@/service/FileService";
import FileDisplay from "./FileDisplay";

interface CommentNoteProps {
  initialComments?: Comment[];
  onCommentSubmit?: (content: string) => void;
  noteId?: string | null;
}

export const CommentNote: React.FC<CommentNoteProps> = ({
  initialComments = [],
  onCommentSubmit,
  noteId,
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null); // dùng để trigger input file
  const [attachedFile, setAttachedFile] = useState<File | null>(null); // Thêm state cho file đính kèm
  const avatarUrl = localStorage.getItem("avatar");
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [fileUrls, setFileUrls] = useState<string[]>([]); // State cho fileUrls
  const [fileId, setFileId] = useState<number[]>([]);

  const [filesToDisplay, setFilesToDisplay] = useState<{
    [commentId: number]: {
      urls: string[];
      names: string[];
      ids: number[];
    };
  }>({});

  const fileDisplayRef = useRef<HTMLDivElement | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const loadComments = async () => {
    if (!userId) return;

    try {
      const fetchedCommentsResponse = await fetchComments(5, Number(userId));

      if (fetchedCommentsResponse) {
        const fetchedComments = fetchedCommentsResponse.result;
        setComments(fetchedComments);

        const newFilesMap: {
          [commentId: number]: {
            urls: string[];
            names: string[];
            ids: number[];
          };
        } = {};

        for (const comment of fetchedComments) {
          const commentId = comment.commentId;

          try {
            const filesData = await getNoteFile(null, commentId, "COMMENT");

            const urls = filesData.map((file) => file.fileUrl);
            const names = filesData.map((file) => file.fileName);
            const ids = filesData.map((file) => file.fileId);

            newFilesMap[commentId] = { urls, names, ids };
          } catch (error) {
            console.warn(
              `Không thể lấy file cho commentId ${commentId}:`,
              error
            );
            newFilesMap[commentId] = { urls: [], names: [], ids: [] };
          }
        }

        setFilesToDisplay(newFilesMap);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  useEffect(() => {
    loadComments();
  }, [userId]); // Chỉ gọi lại khi userId thay đổi

  useEffect(() => {
    if (
      fileDisplayRef.current &&
      editingCommentId !== null &&
      filesToDisplay[editingCommentId]?.urls.length > 0
    ) {
      const { urls, names, ids } = filesToDisplay[editingCommentId];
      displayFilesInContent(urls, names, ids, editingCommentId);
    }
  }, [filesToDisplay, editingCommentId]);

  const handleAddComment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Ngăn submit form mặc định

    console.log("handleAddComment");
    if (!commentText.trim()) return;

    try {
      // Gửi comment và nhận lại response
      const response = await saveComment({
        content: commentText,
        userId: Number(userId),
        noteId: Number(noteId),
      });

      // Kiểm tra và xử lý response
      if (response?.code === 1000 && response?.result) {
        const savedComment = response.result;
        console.log("Comment saved successfully:", savedComment);

        const commentId = savedComment.commentId;

        // Cập nhật danh sách comment
        setComments((prevComments) => [savedComment, ...prevComments]);
        setCommentText("");

        console.log("abc", attachedFile);

        if (attachedFile) {
          await handleFileUpload(commentId); // Truyền commentId vào hàm upload file
        }

        // Gọi callback nếu được cung cấp
        if (onCommentSubmit) {
          onCommentSubmit(commentText);
        }
      } else {
        console.error("Comment saving failed: Invalid response", response);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  //update comment text + files
  const handleUpdateComment = async (commentId: number, editedText: string) => {
    if (!editedText.trim()) return;
  
    try {
      // Gửi comment cập nhật
      const response = await updateComment(commentId, {
        userId: Number(userId),
        noteId: Number(noteId),
        content: editedText,
      });
  
      if (response?.code === 1000 && response?.result) {
        const updatedComment = response.result;
        console.log("Comment updated successfully:", updatedComment);
  
        // Cập nhật comment trong danh sách
        setComments((prevComments) =>
          prevComments.map((c) =>
            c.commentId === commentId ? updatedComment : c
          )
        );
  
        // Nếu có file mới trong edit mode, upload và thêm vào filesToDisplay
        if (editFile) {
          const fileResponse = await uploadFile(
            editFile,
            null, // noteId để null vì đây là file của comment
            Number(userId),
            commentId
          );
  
          // Cập nhật filesToDisplay: giữ nguyên file cũ, thêm file mới
          setFilesToDisplay((prev) => {
            const currentFiles = prev[commentId] || { urls: [], names: [], ids: [] };
            // Lọc bỏ file tạm thời (id = -1)
            const filteredUrls = currentFiles.urls.filter((_, i) => currentFiles.ids[i] !== -1);
            const filteredNames = currentFiles.names.filter((_, i) => currentFiles.ids[i] !== -1);
            const filteredIds = currentFiles.ids.filter((id) => id !== -1);
  
            return {
              ...prev,
              [commentId]: {
                urls: [...filteredUrls, fileResponse.fileUrl],
                names: [...filteredNames, fileResponse.fileName],
                ids: [...filteredIds, fileResponse.fileId],
              },
            };
          });
  
          setEditFile(null); // Reset file tạm sau khi upload thành công
        }
  
        // Reset trạng thái chỉnh sửa
        setEditingCommentId(null);
        setEditText("");
  
        if (onCommentSubmit) {
          onCommentSubmit(editedText);
        }
      } else {
        console.error("Comment update failed: Invalid response", response);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (editingCommentId !== null) {
        // Đang ở chế độ chỉnh sửa, cập nhật editFile và filesToDisplay
        setEditFile(file); // Lưu file để upload sau
        setFilesToDisplay((prev) => {
          const currentFiles = prev[editingCommentId] || {
            urls: [],
            names: [],
            ids: [],
          };
          return {
            ...prev,
            [editingCommentId]: {
              urls: [...currentFiles.urls, URL.createObjectURL(file)], // Tạo URL tạm thời cho file
              names: [...currentFiles.names, file.name],
              ids: [...currentFiles.ids, -1], // ID tạm thời
            },
          };
        });
      } else {
        // Không ở chế độ chỉnh sửa, cập nhật attachedFile cho khu vực tạo comment mới
        setAttachedFile(file);
      }
    }
  };

  const handleFileUpload = async (commentId: number) => {
    if (attachedFile) {
      try {
        const convertUserIdNumber = Number(localStorage.getItem("userId"));
        const response = await uploadFile(
          attachedFile,
          null,
          convertUserIdNumber,
          commentId
        );

        // Cập nhật fileUrls và chèn file vào nội dung comment
        setFileUrls((prev) => [...prev, response.fileUrl]);
        insertFileIntoContent(
          response.fileName,
          response.fileUrl,
          attachedFile.size,
          response.fileId
        );

        setAttachedFile(null);

        console.log("File uploaded successfully:", response);
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file");
      }
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)}KB`;
    }
    return `${(size / (1024 * 1024)).toFixed(1)}MB`;
  };

  const insertFileIntoContent = (
    fileName: string,
    fileUrl: string,
    fileSize: number,
    fileId: number
  ) => {
    if (!contentRef.current) return;

    const fileDisplay = document.createElement("div");
    fileDisplay.setAttribute("contenteditable", "false");
    fileDisplay.className =
      "file-display inline-flex items-center p-2 my-1 bg-gray-100 rounded-md";
    fileDisplay.setAttribute("draggable", "false");

    const icon = document.createElement("span");
    icon.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m-9-3v12a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M5 5h2" /></svg>';

    const fileInfo = document.createElement("span");
    fileInfo.className = "text-gray-700 text-sm";
    fileInfo.textContent = `${fileName} ${formatFileSize(fileSize)}`;

    const fileNameSplit = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
    const openLink = `http://localhost:8080/api/files/view/${fileNameSplit}`;
    const fileLink = document.createElement("a");
    fileLink.href = fileUrl;
    fileLink.target = "_blank";
    fileLink.rel = "noopener noreferrer";
    fileLink.style.cursor = "pointer";
    fileLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(openLink, "_blank");
    });

    const removeButton = document.createElement("span");
    removeButton.className =
      "remove-file-btn text-red-600 ml-2 cursor-pointer opacity-0 hover:opacity-100";
    removeButton.textContent = "×";
    removeButton.style.fontSize = "16px";
    removeButton.style.fontWeight = "bold";
    removeButton.addEventListener("click", async (e) => {
      e.stopPropagation(); // Ngăn sự kiện click lan truyền lên fileLink
      try {
        const isDeleted = await deleteFile(fileId); // Sử dụng fileId từ tham số
        if (isDeleted) {
          console.log("File deleted successfully!");
          fileDisplay.remove();
        } else {
          console.log("File deletion failed.");
        }
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    });

    fileDisplay.appendChild(icon);
    fileDisplay.appendChild(fileInfo);
    fileDisplay.appendChild(removeButton);
    fileLink.appendChild(fileDisplay);

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.insertNode(fileLink);
      range.insertNode(document.createElement("br"));

      range.setStartAfter(fileLink.nextSibling!);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      contentRef.current.appendChild(fileLink);
      contentRef.current.appendChild(document.createElement("br"));
    }
  };

  const displayFilesInContent = (
    fileUrls: string[],
    fileNameView: string[],
    fileIds: number[],
    commentId: number // Thêm tham số commentId
  ) => {
    if (!fileDisplayRef.current) return;

    fileDisplayRef.current.innerHTML = ""; // Xóa cũ trước khi hiển thị

    fileUrls.forEach((fileUrl, index) => {
      const fileName = fileNameView[index] || "Unknown File";
      const fileId = fileIds[index]; // Lấy fileId tương ứng

      const fileDisplay = document.createElement("div");
      fileDisplay.setAttribute("contenteditable", "false");
      fileDisplay.className =
        "file-display inline-flex items-center p-2 my-1 bg-gray-100 rounded-md";
      fileDisplay.setAttribute("draggable", "false");

      const icon = document.createElement("span");
      icon.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m-9-3v12a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M5 5h2" /></svg>';

      const fileNameSplit = fileUrl.split("/").pop() || "Unknown File";
      const openLink = `http://localhost:8080/api/files/view/${fileNameSplit}`;

      const fileLink = document.createElement("a");
      fileLink.href = openLink;
      fileLink.target = "_blank";
      fileLink.rel = "noopener noreferrer";
      fileLink.style.cursor = "pointer";
      fileLink.textContent = fileName;

      // Thêm nút xóa
      const removeButton = document.createElement("span");
      removeButton.className =
        "remove-file-btn text-red-600 ml-2 cursor-pointer opacity-0 hover:opacity-100";
      removeButton.textContent = "×";
      removeButton.style.fontSize = "16px";
      removeButton.style.fontWeight = "bold";

      removeButton.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          const isDeleted = await deleteFile(fileId);
          if (isDeleted) {
            console.log("File deleted successfully!");
            fileDisplay.remove();

            // Cập nhật danh sách files của comment đó
            setFilesToDisplay((prev) => {
              const prevFiles = prev[commentId];
              if (!prevFiles) return prev;

              const updatedFiles = {
                urls: prevFiles.urls.filter((_, i) => i !== index),
                names: prevFiles.names.filter((_, i) => i !== index),
                ids: prevFiles.ids.filter((_, i) => i !== index),
              };

              return {
                ...prev,
                [commentId]: updatedFiles,
              };
            });
          } else {
            console.log("File deletion failed.");
          }
        } catch (error) {
          console.error("Error deleting file:", error);
        }
      });

      fileDisplay.addEventListener("mouseenter", () => {
        removeButton.style.opacity = "1";
      });
      fileDisplay.addEventListener("mouseleave", () => {
        removeButton.style.opacity = "0";
      });

      fileDisplay.appendChild(icon);
      fileDisplay.appendChild(fileLink);
      fileDisplay.appendChild(removeButton);

      if (fileDisplayRef.current) {
        fileDisplayRef.current.appendChild(fileDisplay);
        fileDisplayRef.current.appendChild(document.createElement("br"));
      }
    });
  };

  const formatTime = (createdAt: string | number | Date) => {
    const now = new Date();
    const commentDate = new Date(createdAt);
    const diffInSeconds = Math.floor(
      (now.getTime() - commentDate.getTime()) / 1000
    );

    // Just now
    if (diffInSeconds < 60) {
      return "Just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }

    // Use the default format (full date)
    return commentDate.toLocaleDateString();
  };
  const handleDelete = async (commentId: number) => {
    try {
      await deleteComment(commentId); // Đợi xóa thành công
      await loadComments(); // Sau đó load lại danh sách comments
    } catch (error) {
      console.error("Failed to delete comment or reload comments:", error);
      // Có thể thêm logic thông báo lỗi cho người dùng nếu cần
    }
  };

  return (
    <div className="comment-container border-t border-gray-200 pt-2 mt-2">
      {comments.length > 0 ? (
        <div className="space-y-2">
          {comments.map((comment) => (
            <div key={comment.commentId} className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium overflow-hidden">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Current User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "N"
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">
                      {username}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(comment.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => handleDelete(comment.commentId)}
                      title="Delete comment"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        setEditingCommentId(comment.commentId);
                        setEditText(comment.content);
                      }}
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
                {editingCommentId === comment.commentId ? (
                  <div className="relative">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 text-sm mt-2 border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-gray-300 pr-10"
                      rows={1}
                    />
                    <div className="absolute right-1 mb-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-gray-500 hover:text-gray-700"
                        title="Attach file"
                      >
                        <Paperclip size={16} />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        onChange={handleFileChange}
                      />
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700"
                        title="Tag a note"
                      >
                        <AtSign size={16} />
                      </button>
                      <span className="mx-1 text-gray-300">|</span>
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => {
                          if (editingCommentId !== null) {
                            handleUpdateComment(editingCommentId, editText);
                          }
                        }}
                        title="Accept edit"
                      >
                        <Send size={16} />
                      </button>
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setEditingCommentId(null)}
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-800 mt-1">
                    {comment.content}
                  </p>
                )}
                {/* Render files for this comment */}
                <FileDisplay
                  fileUrls={filesToDisplay[comment.commentId]?.urls || []}
                  fileNameView={filesToDisplay[comment.commentId]?.names || []}
                  fileIds={filesToDisplay[comment.commentId]?.ids || []}
                  commentId={comment.commentId}
                  setFilesToDisplay={setFilesToDisplay}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 py-2">No comments yet.</div>
      )}

      {/* Div để hiển thị file bên dưới danh sách comment */}

      {/* Ô nhập comment */}
      <div className="flex gap-2 mt-4">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Current User"
              className="w-full h-full object-cover"
            />
          ) : (
            "N"
          )}
        </div>
        <div className="flex-1">
          <form onSubmit={handleAddComment}>
            <div className="relative">
              <div className="relative w-full">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-gray-300 pr-28"
                  rows={1}
                />
                {attachedFile && (
                  <div className="absolute left-2 -bottom-6 text-xs bg-gray-100 px-2 py-1 rounded flex items-center gap-2 border">
                    <span className="truncate max-w-[180px]">
                      {attachedFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAttachedFile(null)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove file"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-500 hover:text-gray-700"
                  title="Attach file"
                >
                  <Paperclip size={16} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />

                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <AtSign size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => handleAddComment()}
                  className="text-blue-500 hover:text-blue-700"
                  title="Send comment"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
