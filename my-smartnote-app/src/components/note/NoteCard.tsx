// import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
// import { Button } from "../ui/button";
// import { MoreVertical } from "lucide-react";
// import { FaHeart, FaRegHeart } from "react-icons/fa";

// function NoteCard({ note, darkMode, colorMap, toggleFavorite, handleDoubleClick }) {
//     return (
//       <div
//         className={`rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 ${
//           darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
//         }`}
//         onDoubleClick={() => handleDoubleClick(note)}
//       >
//         <div className={`flex justify-between items-center py-3 px-5 font-semibold ${colorMap[note.color] || "bg-gray-500"} text-white`}>
//           {note.title}
//           <DropdownMenu.Root>
//             <DropdownMenu.Trigger asChild>
//               <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
//                 <MoreVertical className="text-white" />
//               </Button>
//             </DropdownMenu.Trigger>
//             <DropdownMenu.Portal>
//               <DropdownMenu.Content className="bg-white shadow-lg rounded-lg p-2 min-w-[160px] dark:bg-gray-800">
//                 <DropdownMenu.Item className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded" onClick={(e) => e.stopPropagation()}>
//                   ✏️ Edit
//                 </DropdownMenu.Item>
//                 <DropdownMenu.Item className="px-3 py-2 hover:bg-red-100 text-red-500 dark:hover:bg-red-700 dark:text-red-400 cursor-pointer rounded" onClick={(e) => e.stopPropagation()}>
//                   🗑️ Delete
//                 </DropdownMenu.Item>
//               </DropdownMenu.Content>
//             </DropdownMenu.Portal>
//           </DropdownMenu.Root>
//         </div>
//         <div className="p-5">
//           <p className="text-gray-600 dark:text-gray-300">{note.content}</p>
//           <div className="flex items-center text-sm text-red-500 mt-2">
//             🕑 {new Date(note.createdAt).toLocaleString()}
//           </div>
//           <div className="flex justify-end items-center mt-3">
//             <button className="text-xl" onClick={() => toggleFavorite(note.noteId)}>
//               {note.is_pinned ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400" />}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }
  