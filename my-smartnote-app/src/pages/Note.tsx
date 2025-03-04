import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { fetchNotes, Note } from "@/service/NoteService"; // Import hàm gọi API
import { useNavigate } from "react-router-dom";

function NoteComponent() {
  const { darkMode } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [favorites, setFavorites] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Hàm xử lý double click để điều hướng
  const handleDoubleClick = (id: number) => {
    navigate(`/note/${id}`);
  };

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        const data = await fetchNotes(1, 10); // Lấy 10 ghi chú từ API
        setNotes(data);

        console.log(
          "Notes Color List:",
          data.map((note) => note.createdAt)
        );

        setFavorites(data.filter((note) => note.is_pinned));
      } catch (error) {
        console.error("Failed to load notes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);

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
      className={`p-4 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      } min-h-screen`}
    >
      {/* Danh sách Ghi chú yêu thích */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Favorite Notes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.length > 0 ? (
            favorites.map((note) => (
              <div
              key={note.noteId}
              className={`p-4 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              }`}
              onDoubleClick={() => handleDoubleClick(note.noteId)} 
            >
                <h2 className="text-xl font-semibold flex items-center">
                  {note.is_pinned && (
                    <span className="text-yellow-400 font-bold">📌</span>
                  )}
                  {note.title}
                </h2>
                <p className="text-gray-400">{note.content}</p>
                <div className="text-right text-sm text-gray-500">
                  <span>{note.color || "No Color"}</span>
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
        <h2 className="text-xl font-semibold mb-2">All Notes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div
              key={note.noteId}
              className={`p-4 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              }`}

              onDoubleClick={() => handleDoubleClick(note.noteId)} 
            >
              <h2 className="text-xl font-semibold flex items-center">
                {note.is_pinned && (
                  <span className="text-yellow-400 font-bold mr-1">📌</span>
                )}
                {note.title}
              </h2>
              <p className="text-gray-400">{note.content}</p>

              {/* 🕒 Hiển thị ngày tạo ghi chú */}
              <div className="text-sm text-red-500 mt-2">
                Created: {new Date(note.createdAt).toLocaleString()}
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
          ))}
        </div>
      </div>
    </div>
  );
}

export default NoteComponent;
