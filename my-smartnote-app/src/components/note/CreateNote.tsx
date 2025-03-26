import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Image,
  MessageCircle,
  X,
  Paperclip,
  Send,
  AtSign,
} from "lucide-react";
import { Note, NoteRequest, saveNote, updateNote } from "@/service/NoteService";
import { debounce } from "lodash";
import {
  fetchComments,
  Comment,
  saveComment,
  deleteComment,
} from "@/service/CommentService";
import { formatDistanceToNow } from "date-fns";
import { getAllNotes } from "@/service/NoteService";
import { getAllUser } from "@/service/UserService";
import NoteContent from "@/components/note/NoteContent";
import { getNoteImages, NoteImage } from "@/service/NoteImageService";
export default function CreateNote() {
  const [noteContent, setNoteContent] = useState("");
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

  const contentRef = useRef<HTMLDivElement | null>(null);

  const location = useLocation();
  const note: Note | null = location.state || null;

  const noteId = note?.noteId ?? -1;
  const userId = localStorage.getItem("userId") || "unknown";
  const [showMentionList, setShowMentionList] = useState(false);
  const [mentionPeopleList, setMentionPeopleList] = useState<string[]>([]);
  const [mentionNoteList, setMentionNoteList] = useState<
    { id: number; title: string }[]
  >([]);

  // Hàm chèn placeholder vào dòng hiện tại
  const loadUserNote = async () => {
    try {
      const data = await getAllUser(1, 5); // Lấy 5 user đầu tiên
      if (data) {
        const userList = data.users.map((user) => `${user.fullName}`);
        setMentionPeopleList(userList); // Cập nhật danh sách People
      }
    } catch (error) {
      console.error("Error loading user note:", error);
    }
  };

  const loadNotes = async () => {
    try {
      const data = await getAllNotes(); // Lấy tất cả các ghi chú
      if (data) {
        const noteList = data.map((note) => ({
          id: note.noteId, // Lấy ra noteId
          title: note.title, // Lấy ra title
        }));
        setMentionNoteList(noteList); // Cập nhật danh sách Notes với cả id và title
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };


  const samplePeopleList =
    mentionPeopleList.length > 0
      ? mentionPeopleList
      : [
          "Nguyễn Hoàng Tuấn (You)",
          "0552_Vũ Ngọc Tú",
          "0545_Trịnh Quang Trường",
          "Invite...",
        ];

  const sampleNoteList =
    mentionNoteList.length > 0
      ? mentionNoteList
      : [
          "Used To",
          "Chức năng Smart Note",
          "Chia công việc TKGD",
          "Teamspace Home",
          "Learn English",
        ];

  const username = localStorage.getItem("username");
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setNoteContent(note.content);
    }
  }, [note]);

  // Load comments
  const loadComment = async () => {
    try {
      const data = await fetchComments(5); // Số lượng comment muốn lấy
      if (data) {
        setComments(data);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  useEffect(() => {
    loadComment();
    loadUserNote();
    loadNotes();
  }, []);

  // useEffect(() => {
  //   const autoSave = debounce(async () => {
  //     try {
  //       // Load ảnh mới nhất trước khi lưu
  //       // const imagesData = await getNoteImages(noteId);
  //       // setNoteImages(imagesData);

  //       // Kiểm tra nếu userId hợp lệ
  //       const userIdNumber = userId ? Number(userId) : null;
  //       if (!userIdNumber) {
  //         console.error("Invalid userId");
  //         return;
  //       }

  //       const noteData: Omit<Note, "noteId"> = {
  //         title,
  //         content: noteContent,
  //         userId: userIdNumber,
  //         createdAt: new Date().toISOString(), // Đảm bảo kiểu string
  //         is_pinned: false,
  //         color: "#ffffff",
  //       };

  //       const imagesArray = imagesData?.length ? imagesData : undefined;

  //       if (!noteId || noteId === -1) {
  //         const newNote = await saveNote(noteData as NoteRequest);
  //         console.log("newNote", newNote);
  //         noteId = newNote.noteId;
  //         localStorage.setItem("noteId", noteId.toString());
  //       } else {
  //         await updateNote(noteId, noteData as NoteRequest, imagesArray);
  //       }
  //     } catch (error) {
  //       console.error("Auto-save failed:", error);
  //     }
  //   }, 6000);

  //   autoSave();
  //   return () => {
  //     autoSave.cancel();
  //   };
  // }, [title, noteContent, noteId]); // Đưa `noteId` vào dependencies để đảm bảo ảnh được cập nhật
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

  //delete comment
  const handleDeleteComment = async (id: number) => {
    try {
      const result = await deleteComment(id);
      if (result) {
        // Nếu xóa thành công, cập nhật lại danh sách comment
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.commentId !== id)
        );
        console.log("Comment deleted successfully!");
      } else {
        console.error("Failed to delete comment from server.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const toggleMentionList = () => {
    setShowMentionList(!showMentionList);

    // Nếu đang mở danh sách, thì tải lại cả People và Notes
    if (!showMentionList) {
      loadUserNote();
      loadNotes();
    }
  };

  //paste images

  const handleMentionSelect = (
    mention: string,
    type: "people" | "note",
    noteId?: number
  ) => {
    let mentionText;

    if (type === "note" && noteId) {
      mentionText = `<span 
      class="bd inline-flex items-center gap-1 px-1.5 py-0.5 bg-muted/20 border border-gray-400 rounded-md cursor-pointer transition-all duration-300 hover:bg-accent/30 hover:border-gray-600"
      onclick="window.open('/note/${noteId}', '_blank')">
        📄 ${mention}
      </span>`;
    } else {
      mentionText = `<span 
      class="inline-flex items-center gap-1 px-1.5 py-0.5 text-black- rounded-md">
        @${mention}
      </span>`;
    }

    // Cập nhật nội dung comment bằng HTML
    setCommentText((prev) => `${prev} ${mentionText} `);
    setShowMentionList(false);
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

  //save comment data
  const handleAddComment = async () => {
    console.log("handleAddComment");

    if (!commentText.trim() && !attachedFile) return;

    const newComment: Omit<Comment, "commentId" | "createdAt"> = {
      content: commentText,
      userId: Number(userId),
      noteId: noteId,
    };

    try {
      const savedComment = await saveComment(newComment);

      if (savedComment) {
        console.log("Comment saved successfully:", savedComment);
        // Sau khi lưu thành công, gọi hàm load lại danh sách comment
        setComments((prevComments) => [savedComment, ...prevComments]);
        setCommentText("");
        setAttachedFile(null);
      } else {
        console.error("Comment saving failed: No result returned");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="w-full min-h-screen px-10 py-6 bg-white text-black">
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
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
          {comments.map((comment, index) => (
            <div
              key={`${comment.commentId}-${index}`} // Đảm bảo key duy nhất
              className="flex items-start gap-3 mb-3 relative group"
            >
              {/* Avatar */}
              <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full text-white overflow-hidden">
                {localStorage.getItem("avatar") ? (
                  <img
                    src={localStorage.getItem("avatar") || ""}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-sm font-bold">N</span>
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <span className="text-black">{username}</span>
                  <span className="text-gray-400 text-xs">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </p>
                <p className="text-base">{comment.content}</p>
              </div>

              {/* Nút xoá (ẩn khi không hover) */}
              <X
                size={16}
                className="text-red-500 cursor-pointer hidden group-hover:block absolute right-0 top-1"
                onClick={() => handleDeleteComment(comment.commentId)}
              />
            </div>
          ))}

          {/* Ô nhập comment */}
          <div className="flex flex-col gap-2 bg-gray-100 p-2 rounded-lg relative">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full text-white overflow-hidden">
                {localStorage.getItem("avatar") ? (
                  <img
                    src={localStorage.getItem("avatar") || ""}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-sm font-bold">N</span>
                )}
              </div>

              <div
                className={`flex-1 p-2 bg-gray-100 text-black border-none outline-none placeholder-gray-400 ${
                  !commentText ? "placeholder" : ""
                }`}
                contentEditable
                dangerouslySetInnerHTML={{ __html: commentText }}
                onInput={(e) => setCommentText(e.currentTarget.innerHTML)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              ></div>

              <AtSign
                size={16}
                className="text-gray-400 cursor-pointer"
                onClick={toggleMentionList}
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

              {/* Mention List Popup */}
              {showMentionList && (
                <div className="absolute top-16 left-0 bg-white border rounded-lg shadow-md p-2 w-64 z-10">
                  {/* Phần tiêu đề People */}
                  <div className="text-gray-600 font-semibold mb-1">People</div>
                  <div className="max-h-32 overflow-y-auto">
                    {samplePeopleList.map((person, index) => (
                      <div
                        key={`people-${index}`}
                        className="p-2 hover:bg-gray-100 cursor-pointer rounded flex items-center space-x-2"
                        onClick={() => handleMentionSelect(person, "people")}
                      >
                        <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-white">{person.charAt(0)}</span>
                        </span>
                        <span>{person}</span>
                      </div>
                    ))}
                  </div>

                  {/* Đường phân cách */}
                  <hr className="my-2 border-gray-300" />

                  {/* Phần tiêu đề Link to Page */}
                  <div className="text-gray-600 font-semibold mb-1">
                    Link to page
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    {sampleNoteList.map((note, index) => {
                      const noteTitle =
                        typeof note === "string" ? note : note.title;
                      const noteId =
                        typeof note === "object" && note !== null
                          ? note.id
                          : undefined;

                      return (
                        <div
                          key={`note-${index}`}
                          className="p-2 hover:bg-gray-100 cursor-pointer rounded flex items-center space-x-2"
                          onClick={() =>
                            handleMentionSelect(noteTitle, "note", noteId)
                          }
                        >
                          <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            📄
                          </span>
                          <span className="underline text-blue-600 hover:text-blue-800">
                            {noteTitle}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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

      <div>
        <NoteContent/>
      </div>
    </div>
  );
}
