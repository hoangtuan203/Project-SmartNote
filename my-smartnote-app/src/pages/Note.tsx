import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

// Define a type for the note
interface NoteType {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  pinned: boolean;
  favorite: boolean;
}

function Note() {
  const { darkMode } = useTheme(); // Lấy trạng thái Dark Mode
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [favorites, setFavorites] = useState<NoteType[]>([]);

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchedNotes: NoteType[] = [
      { id: 1, title: "Note 1", content: "Content of Note 1", createdAt: new Date(), pinned: false, favorite: false },
      { id: 2, title: "Note 2", content: "Content of Note 2", createdAt: new Date(), pinned: true, favorite: false },
      { id: 3, title: "Note 3", content: "Content of Note 3", createdAt: new Date(Date.now() - 1000000000), pinned: false, favorite: false },
      { id: 4, title: "Note 4", content: "Content of Note 4", createdAt: new Date(Date.now() - 2000000000), pinned: true, favorite: true },
    ];

    const sortedNotes = fetchedNotes.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    setNotes(sortedNotes);
    setFavorites(sortedNotes.filter((note) => note.favorite));
  }, []);

  const toggleFavorite = (id: number) => {
    const updatedNotes = notes.map((note) => {
      if (note.id === id) {
        note.favorite = !note.favorite;
      }
      return note;
    });

    setNotes(updatedNotes);
    setFavorites(updatedNotes.filter((note) => note.favorite));
  };

  return (
    <div className={`p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen`}>
      {/* Danh sách Ghi chú yêu thích */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Favorite Notes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((note) => (
            <div key={note.id} className={`p-4 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
              <h2 className="text-xl font-semibold">
                {note.pinned && <span className="text-yellow-400 font-bold">📌</span>}
                {note.title}
              </h2>
              <p className="text-gray-400">{note.content}</p>
              <div className="text-right text-sm text-gray-500">
                <span>{note.createdAt.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Đường kẻ phân cách */}
      <div className={`my-4 border-t-2 ${darkMode ? "border-gray-700" : "border-gray-300"}`}></div>

      {/* Tất cả Ghi chú */}
      <div>
        <h2 className="text-xl font-semibold mb-2">All Notes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
            >
              <h2 className="text-xl font-semibold flex items-center">
                {note.pinned && <span className="text-yellow-400 font-bold mr-1">📌</span>}
                {note.title}
              </h2>
              <p className="text-gray-400">{note.content}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <span>{note.createdAt.toLocaleString()}</span>
                </div>
                <button className="text-xl" onClick={() => toggleFavorite(note.id)}>
                  {note.favorite ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Note;
