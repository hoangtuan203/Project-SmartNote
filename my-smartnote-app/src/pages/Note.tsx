import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { fetchNotes, Note } from "@/service/NoteService";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
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

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleDoubleClick = (note: Note) => {
    setRecentNote(note);
    localStorage.setItem("recentNote", JSON.stringify(note));
    const userId = localStorage.getItem("userId");
    saveRecentNote(Number(userId), note.noteId)
      .then(() => console.log("Lưu recent note thành công:", note.noteId))
      .catch((error) => console.error("Lỗi khi lưu recent note:", error));
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
    if (storedNote) setRecentNote(JSON.parse(storedNote));
    loadNotes();
  }, [currentPage]);

  const toggleFavorite = (id: number) => {
    const updatedNotes = notes.map((note) =>
      note.noteId === id ? { ...note, is_pinned: !note.is_pinned } : note
    );
    setNotes(updatedNotes);
    setFavorites(updatedNotes.filter((note) => note.is_pinned));
  };

  if (loading) {
    return (
      <p className="text-center text-lg font-medium text-gray-500 dark:text-gray-400">
        Loading notes...
      </p>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Favorite Notes Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Favorite Notes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.length > 0 ? (
            favorites.map((note) => (
              <div
                key={note.noteId}
                className={`rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border dark:border-gray-700 ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                } flex flex-col h-full`}
                onDoubleClick={() => handleDoubleClick(note)}
              >
                <div
                  className={`flex justify-between items-center py-3 px-5 font-semibold ${
                    colorMap[note.color] || "bg-gray-500"
                  } text-white`}
                >
                  {note.title}
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
                      <DropdownMenu.Content className="bg-white shadow-md rounded-lg p-2 min-w-[160px] dark:bg-gray-800">
                        <DropdownMenu.Item
                          className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Chỉnh sửa note:", note.noteId);
                          }}
                        >
                          ✏️ Chỉnh sửa
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="px-3 py-2 hover:bg-red-100 dark:hover:bg-red-700 text-red-600 dark:text-red-400 cursor-pointer rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Xóa note:", note.noteId);
                          }}
                        >
                          🗑️ Xóa
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
                <div className="p-5 flex-grow">
                  <p className="text-gray-600 dark:text-gray-300">
                    {note.content}
                  </p>
                </div>
                <div className="flex justify-between items-center px-5 py-3 border-t dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 mt-auto">
                  <span>🕑 {new Date(note.createdAt).toLocaleString()}</span>
                  <button
                    className="text-2xl"
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
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No favorite notes yet
            </p>
          )}
        </div>
      </section>

      {/* Divider */}
      <hr className="my-8 border-t border-gray-200 dark:border-gray-700" />

      {/* All Notes Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            All Notes
          </h2>
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note.noteId}
              className={`rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border dark:border-gray-700 ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              } flex flex-col h-full`}
              onDoubleClick={() => handleDoubleClick(note)}
            >
              <div
                className={`flex justify-between items-center py-3 px-5 font-semibold ${
                  colorMap[note.color] || "bg-gray-500"
                } text-white`}
              >
                {note.title}
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
                    <DropdownMenu.Content className="bg-white shadow-md rounded-lg p-2 min-w-[160px] dark:bg-gray-800">
                      <DropdownMenu.Item
                        className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Chỉnh sửa note:", note.noteId);
                        }}
                      >
                        ✏️ Chỉnh sửa
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        className="px-3 py-2 hover:bg-red-100 dark:hover:bg-red-700 text-red-600 dark:text-red-400 cursor-pointer rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Xóa note:", note.noteId);
                        }}
                      >
                        🗑️ Xóa
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
              <div className="p-5 flex-grow">
                <p className="text-gray-600 dark:text-gray-300">
                  {note.content}
                </p>
              </div>
              <div className="flex justify-between items-center px-5 py-3 border-t dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 mt-auto">
                <span>🕑 {new Date(note.createdAt).toLocaleString()}</span>
                <button
                  className="text-2xl"
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
          ))}
        </div>
      </section>
    </div>
  );
}

export default NoteComponent;
