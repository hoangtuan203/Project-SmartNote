import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";
import { fetchRecentNotes, RecentNote } from "@/service/RecentNoteService";
import { formatTimeAgo } from "@/utils/formatTimeAgo";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const Home = () => {
  const { darkMode } = useTheme();
  const [recentNotes, setRecentNotes] = useState<RecentNote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Theo dõi vị trí hiện tại trong danh sách notes
  const username = localStorage.getItem("username");
  const notesPerPage = 5; // Số note hiển thị mỗi lần

  useEffect(() => {
    const loginSuccess = localStorage.getItem("loginSuccess");

    if (loginSuccess === "true") {
      toast.success("Login successful!");
      setTimeout(() => {
        localStorage.removeItem("loginSuccess");
      }, 8000);
    }

    const loadRecentNotes = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const userIdConvertNumber = Number(userId);
        const notes = await fetchRecentNotes(10, userIdConvertNumber); // Lấy 10 note
        setRecentNotes(notes);
      } catch (error) {
        console.error("Failed to fetch recent notes:", error);
      }
    };

    loadRecentNotes();
  }, []);

  // Hàm trượt sang trái
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Hàm trượt sang phải
  const handleNext = () => {
    if (currentIndex + notesPerPage < recentNotes.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Lấy 5 note hiện tại dựa trên currentIndex
  const visibleNotes = recentNotes.slice(
    currentIndex,
    currentIndex + notesPerPage
  );

  return (
    <div
      className={`p-6 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Lời chào */}
      <h1 className="text-3xl font-bold">{username}</h1>

      {/* Recently Visited */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Recently visited</h2>
        <div className="relative group">
          {/* Nút trượt trái */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              currentIndex === 0
                ? "cursor-not-allowed bg-gray-800"
                : "hover:bg-gray-600"
            }`}
          >
            &lt;
          </button>
          {/* Danh sách note */}
          <div className="grid grid-cols-5 gap-2">
            {visibleNotes.map((note) => (
              <div
                key={note.id}
                className={`p-4 rounded-lg w-48 h-32 flex flex-col justify-between ${
                  darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
                }`}
              >
                <p className="font-semibold">{note.note_title}</p>
                <p className="text-gray-500 text-sm">
                  {formatTimeAgo(note.last_opend)}
                </p>
              </div>
            ))}
          </div>

          {/* Nút trượt phải */}
          <button
            onClick={handleNext}
            disabled={currentIndex + notesPerPage >= recentNotes.length}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              currentIndex + notesPerPage >= recentNotes.length
                ? "cursor-not-allowed bg-gray-800"
                : "hover:bg-gray-600"
            }`}
          >
            &gt;
          </button>
        </div>
      </section>

      {/* Learn */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Learn</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              title: "The ultimate guide to Notion templates",
              time: "5m read",
            },
            { title: "Customize & style your content", time: "9m read" },
            {
              title: "Getting started with projects and tasks",
              time: "8m read",
            },
            { title: "Using Notion AI to your impact", time: "3m read" },
          ].map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
              }`}
            >
              <p className="font-semibold">{item.title}</p>
              <p className="text-gray-500 text-sm">{item.time}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Upcoming events</h2>
        <div
          className={`p-4 rounded-lg ${
            darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
          }`}
        >
          <p className="font-semibold">📅 Today, Feb 18</p>
          <p className="text-gray-500">My first meeting - 9 AM · Office</p>
          <p className="text-gray-500">Lunch - 1 PM · Restaurant</p>
          <button className="mt-2 bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600 transition">
            Join Meeting
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
