import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { fetchNotes, Note } from "@/service/NoteService"; // Import hàm gọi API
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react"; // Import icon menu 3 chấm
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import PaginationComponent from "@/components/Pagination";
import { saveRecentNote } from "@/service/RecentNoteService";
function NoteComponent() {
  const { darkMode } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [favorites, setFavorites] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [recentNote, setRecentNote] = useState<Note | null>(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const notePages = 5;

  // Hàm thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Hàm xử lý double click để điều hướng
  const handleDoubleClick = (note: Note) => {
    setRecentNote(note);
    localStorage.setItem("recentNote", JSON.stringify(note)); // Lưu vào localStorage
    // Gọi hàm saveRecentNote để lưu vào database
    const userId = localStorage.getItem("userId");
    console.log("userId: ", userId);
    saveRecentNote(Number(userId), note.noteId)
      .then(() => {
        console.log("Lưu recent note thành công:", note.noteId);
      })
      .catch((error) => {
        console.error("Lỗi khi lưu recent note:", error);
      });

    console.log("data note: ", JSON.stringify(note));

    navigate(`/note/${note.noteId}`, { state: note });
  };

  const colorMap: Record<string, string> = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
  };

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await fetchNotes(currentPage, notePages);

      setNotes(data?.notes || []);
      setTotalPages(data?.totalPages || 0);
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedNote = localStorage.getItem("recentNote");
    if (storedNote) {
      setRecentNote(JSON.parse(storedNote));
    }
    loadNotes();
  }, [currentPage]);

  const toggleFavorite = (id: number) => {
    const updatedNotes = notes.map((note) => {
      if (note.noteId === id) {
        return { ...note, is_pinned: !note.is_pinned };
      }
      return note;
    });

    setNotes(updatedNotes);
    setFavorites(updatedNotes.filter((note) => note.is_pinned));
  };

  if (loading) {
    return <p className="text-center text-lg">Loading notes...</p>;
  }

  return (
    <div
      className={`p-4`}
    >
      {/* Danh sách Ghi chú yêu thích */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Favorite Notes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.length > 0 ? (
            favorites.map((note) => (
              <div
                key={note.noteId}
                className={`rounded-md shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                }`}
                onDoubleClick={() => handleDoubleClick(note)}
              >
                <div
                  className={`flex justify-between items-center py-2 px-4 font-semibold text-black ${
                    colorMap[note.color] || "bg-gray-500"
                  }`}
                >
                  {note.title}
                  {/* Dropdown menu */}
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="text-white" />
                      </Button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content className="bg-white shadow-lg rounded-md p-2 min-w-[150px]">
                        <DropdownMenu.Item
                          className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                          onClick={(e) => {
                            e.stopPropagation(); // Ngăn chặn event click vào Card
                            console.log("Chỉnh sửa note:", note.noteId);
                          }}
                        >
                          ✏️ Chỉnh sửa
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="px-2 py-1 hover:bg-red-100 text-red-500 cursor-pointer rounded"
                          onClick={(e) => {
                            e.stopPropagation(); // Ngăn chặn event click vào Card
                            console.log("Xóa note:", note.noteId);
                          }}
                        >
                          🗑️ Xóa
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>

                <div className="p-4">
                  <p className="text-gray-400">{note.content}</p>

                  {/* 🕒 Hiển thị ngày tạo ghi chú */}
                  <div className="flex items-center text-sm text-red-500 mt-2">
                    🕑
                    {new Date(note.createdAt).toLocaleString()}
                  </div>
                  <div className="flex justify-end items-center mt-2">
                    <button
                      className="text-xl"
                      onClick={() => toggleFavorite(note.noteId)}
                    >
                      {note.is_pinned ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No favorite notes</p>
          )}
        </div>
      </div>

      {/* Đường kẻ phân cách */}
      <div
        className={`my-4 border-t-2 ${
          darkMode ? "border-gray-700" : "border-gray-300"
        }`}
      ></div>

      {/* Tất cả Ghi chú */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">All Notes</h2>
          {/* PaginationComponent */}
          <div className="mt-4">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div
              key={note.noteId}
              className={`rounded-md shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              }`}
              onDoubleClick={() => handleDoubleClick(note)}
            >
              <div
                className={`flex justify-between items-center py-2 px-4 font-semibold text-black ${
                  colorMap[note.color] || "bg-gray-500"
                }`}
              >
                {note.title}
                {/* Dropdown menu */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="text-white" />
                    </Button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="bg-white shadow-lg rounded-md p-2 min-w-[150px]">
                      <DropdownMenu.Item
                        className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn chặn event click vào Card
                          console.log("Chỉnh sửa note:", note.noteId);
                        }}
                      >
                        ✏️ Chỉnh sửa
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        className="px-2 py-1 hover:bg-red-100 text-red-500 cursor-pointer rounded"
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn chặn event click vào Card
                          console.log("Xóa note:", note.noteId);
                        }}
                      >
                        🗑️ Xóa
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
              <div className="p-4">
                <p className="text-gray-400">{note.content}</p>

                {/* 🕒 Hiển thị ngày tạo ghi chú */}
                <div className="flex items-center text-sm text-red-500 mt-2">
                  🕑
                  {new Date(note.createdAt).toLocaleString()}
                </div>

                <div className="flex justify-end items-center mt-2">
                  <button
                    className="text-xl"
                    onClick={() => toggleFavorite(note.noteId)}
                  >
                    {note.is_pinned ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NoteComponent;
