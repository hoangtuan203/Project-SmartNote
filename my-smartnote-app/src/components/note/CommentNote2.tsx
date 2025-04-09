// import { deleteComment, fetchComments, saveComment } from "@/service/CommentService";
// import { formatDistanceToNow } from "date-fns";
// import { AtSign, X } from "lucide-react";
// import { useEffect, useRef, useState } from "react";

// function CommentNote(){
//     const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);
//     const [comments, setComments] = useState<Comment[]>([]);
//     const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
//     const commentBoxRef = useRef<HTMLDivElement>(null);
//     const userId = localStorage.getItem("userId") || "unknown";
//     const username = localStorage.getItem("username")
//     const [commentText, setCommentText] = useState("");
//     const [attachedFile, setAttachedFile] = useState<File | null>(null);
//     const emojiPickerRef = useRef<HTMLDivElement>(null);

//     const [showMentionList, setShowMentionList] = useState(false);


//     const loadComment = async () => {
//         try {
//           const data = await fetchComments(5); // Số lượng comment muốn lấy
//           if (data) {
//             setComments(data);
//           }
//         } catch (error) {
//           console.error("Error loading comments:", error);
//         }
//       };
//     const handleDeleteComment = async (id: number) => {
//         try {
//           const result = await deleteComment(id);
//           if (result) {
//             // Nếu xóa thành công, cập nhật lại danh sách comment
//             setComments((prevComments) =>
//               prevComments.filter((comment) => comment.commentId !== id)
//             );
//             console.log("Comment deleted successfully!");
//           } else {
//             console.error("Failed to delete comment from server.");
//           }
//         } catch (error) {
//           console.error("Error deleting comment:", error);
//         }
//       };
//       const handleAddComment = async () => {
//         console.log("handleAddComment");
    
//         if (!commentText.trim() && !attachedFile) return;
    
//         const newComment: Omit<Comment, "commentId" | "createdAt"> = {
//           content: commentText,
//           userId: Number(userId),
//           noteId: noteId,
//         };
    
//         try {
//           const savedComment = await saveComment(newComment);
    
//           if (savedComment) {
//             console.log("Comment saved successfully:", savedComment);
//             // Sau khi lưu thành công, gọi hàm load lại danh sách comment
//             setComments((prevComments) => [savedComment, ...prevComments]);
//             setCommentText("");
//             setAttachedFile(null);
//           } else {
//             console.error("Comment saving failed: No result returned");
//           }
//         } catch (error) {
//           console.error("Error adding comment:", error);
//         }
//       };


//       useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//           if (
//             commentBoxRef.current &&
//             !commentBoxRef.current.contains(event.target as Node)
//           ) {
//             setIsCommentBoxVisible(false);
//           }
//         };
    
//         if (isCommentBoxVisible) {
//           document.addEventListener("mousedown", handleClickOutside);
//         }
    
//         return () => {
//           document.removeEventListener("mousedown", handleClickOutside);
//         };
//       }, [isCommentBoxVisible]);
    
      
//   const toggleMentionList = () => {
  
//   };

//   //paste images

//   const handleMentionSelect = (
//     mention: string,
//     type: "people" | "note",
//     noteId?: number
//   ) => {
//     let mentionText;

//     if (type === "note" && noteId) {
//       mentionText = `<span 
//       class="bd inline-flex items-center gap-1 px-1.5 py-0.5 bg-muted/20 border border-gray-400 rounded-md cursor-pointer transition-all duration-300 hover:bg-accent/30 hover:border-gray-600"
//       onclick="window.open('/note/${noteId}', '_blank')">
//         📄 ${mention}
//       </span>`;
//     } else {
//       mentionText = `<span 
//       class="inline-flex items-center gap-1 px-1.5 py-0.5 text-black- rounded-md">
//         @${mention}
//       </span>`;
//     }

//     // Cập nhật nội dung comment bằng HTML
//     setCommentText((prev) => `${prev} ${mentionText} `);
//     setShowMentionList(false);
//   };
//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files) {
//       const newFiles = Array.from(files).filter(
//         (file) => file.size <= 5 * 1024 * 1024
//       ); // Giới hạn 5MB
//       if (newFiles.length > 0) {
//         setAttachedFiles((prevFiles) => [...prevFiles, ...newFiles]);
//       } else {
//         alert("File quá lớn! Vui lòng chọn file dưới 5MB.");
//       }
//     }
//   };

//     return(

//         {isCommentBoxVisible && (
//             <div className="mt-8">
//               {comments.map((comment, index) => (
//                 <div
//                   key={`${comment.commentId}-${index}`} // Đảm bảo key duy nhất
//                   className="flex items-start gap-3 mb-3 relative group"
//                 >
//                   {/* Avatar */}
//                   <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full text-white overflow-hidden">
//                     {localStorage.getItem("avatar") ? (
//                       <img
//                         src={localStorage.getItem("avatar") || ""}
//                         alt="Avatar"
//                         className="w-full h-full object-cover rounded-full"
//                       />
//                     ) : (
//                       <span className="text-sm font-bold">N</span>
//                     )}
//                   </div>
    
//                   <div className="flex-1">
//                     <p className="text-sm font-semibold flex items-center gap-2">
//                       <span className="text-black">{username}</span>
//                       <span className="text-gray-400 text-xs">
//                         {formatDistanceToNow(new Date(comment.createdAt), {
//                           addSuffix: true,
//                         })}
//                       </span>
//                     </p>
//                     <p className="text-base">{comment.content}</p>
//                   </div>
    
//                   {/* Nút xoá (ẩn khi không hover) */}
//                   <X
//                     size={16}
//                     className="text-red-500 cursor-pointer hidden group-hover:block absolute right-0 top-1"
//                     onClick={() => handleDeleteComment(comment.commentId)}
//                   />
//                 </div>
//               ))}
    
//               {/* Ô nhập comment */}
//               <div className="flex flex-col gap-2 bg-gray-100 p-2 rounded-lg relative">
//                 <div className="flex items-center gap-2">
//                   <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full text-white overflow-hidden">
//                     {localStorage.getItem("avatar") ? (
//                       <img
//                         src={localStorage.getItem("avatar") || ""}
//                         alt="Avatar"
//                         className="w-full h-full object-cover rounded-full"
//                       />
//                     ) : (
//                       <span className="text-sm font-bold">N</span>
//                     )}
//                   </div>
    
//                   <div
//                     className={`flex-1 p-2 bg-gray-100 text-black border-none outline-none placeholder-gray-400 ${
//                       !commentText ? "placeholder" : ""
//                     }`}
//                     contentEditable
//                     dangerouslySetInnerHTML={{ __html: commentText }}
//                     onInput={(e) => setCommentText(e.currentTarget.innerHTML)}
//                     onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
//                   ></div>
    
//                   <AtSign
//                     size={16}
//                     className="text-gray-400 cursor-pointer"
//                     onClick={toggleMentionList}
//                   />
    
//                   <input
//                     type="file"
//                     multiple
//                     className="hidden"
//                     ref={fileInputRef}
//                     onChange={handleFileUpload}
//                   />
//                   <Paperclip
//                     size={16}
//                     className="text-gray-400 cursor-pointer"
//                     onClick={() => fileInputRef.current?.click()}
//                   />
//                   <Send
//                     size={16}
//                     className="text-gray-400 cursor-pointer"
//                     onClick={handleAddComment}
//                   />
    
//                   {/* Mention List Popup */}
//                   {showMentionList && (
//                     <div className="absolute top-16 left-0 bg-white border rounded-lg shadow-md p-2 w-64 z-10">
//                       {/* Phần tiêu đề People */}
//                       <div className="text-gray-600 font-semibold mb-1">People</div>
//                       <div className="max-h-32 overflow-y-auto">
//                         {samplePeopleList.map((person, index) => (
//                           <div
//                             key={`people-${index}`}
//                             className="p-2 hover:bg-gray-100 cursor-pointer rounded flex items-center space-x-2"
//                             onClick={() => handleMentionSelect(person, "people")}
//                           >
//                             <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//                               <span className="text-white">{person.charAt(0)}</span>
//                             </span>
//                             <span>{person}</span>
//                           </div>
//                         ))}
//                       </div>
    
//                       {/* Đường phân cách */}
//                       <hr className="my-2 border-gray-300" />
    
//                       {/* Phần tiêu đề Link to Page */}
//                       <div className="text-gray-600 font-semibold mb-1">
//                         Link to page
//                       </div>
//                       <div className="max-h-32 overflow-y-auto">
//                         {sampleNoteList.map((note, index) => {
//                           const noteTitle =
//                             typeof note === "string" ? note : note.title;
//                           const noteId =
//                             typeof note === "object" && note !== null
//                               ? note.id
//                               : undefined;
    
//                           return (
//                             <div
//                               key={`note-${index}`}
//                               className="p-2 hover:bg-gray-100 cursor-pointer rounded flex items-center space-x-2"
//                               onClick={() =>
//                                 handleMentionSelect(noteTitle, "note", noteId)
//                               }
//                             >
//                               <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//                                 📄
//                               </span>
//                               <span className="underline text-blue-600 hover:text-blue-800">
//                                 {noteTitle}
//                               </span>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}
//                 </div>
    
//                 {/* Hiển thị file đính kèm bên trong input comment */}
//                 {attachedFiles.length > 0 && (
//                   <div className="mt-2 flex items-center gap-2 flex-wrap">
//                     {attachedFiles.map((file, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center gap-2 p-2 border rounded-lg bg-gray-200 text-sm"
//                       >
//                         {/* Icon file dựa trên định dạng */}
//                         <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-lg">
//                           {file.type.includes("excel") ? (
//                             <span className="text-green-400 font-bold">XLSX</span>
//                           ) : file.type.includes("pdf") ? (
//                             <span className="text-red-400 font-bold">PDF</span>
//                           ) : (
//                             <span className="text-blue-400 font-bold">FILE</span>
//                           )}
//                         </div>
//                         {/* Tên file */}
//                         <p className="truncate max-w-[100px]">{file.name}</p>
    
//                         {/* Nút xóa file */}
//                         <X
//                           size={16}
//                           className="text-red-500 cursor-pointer"
//                           onClick={() =>
//                             setAttachedFiles(
//                               attachedFiles.filter((_, i) => i !== index)
//                             )
//                           }
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//     )
// }
// export default CommentNote;