import { useTheme } from "@/context/ThemeContext";

const Home = () => {
  const { darkMode } = useTheme(); // Lấy trạng thái dark mode từ context

  return (
    <div className={`p-6 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Lời chào */}
      <h1 className="text-3xl font-bold">Good afternoon, Nguyễn Hoàng Tuấn</h1>

      {/* Recently Visited */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Recently visited</h2>
        <div className="grid grid-cols-5 gap-4">
          {[
            { title: "New page", time: "16m ago" },
            { title: "Smart Project - Ứng dụng ghi ...", time: "23h ago" },
            { title: "Vocabulary", time: "Dec 27, 2024" },
            { title: "Used To", time: "Dec 23, 2024" },
            { title: "Learn English", time: "Jan 14" },
          ].map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}
            >
              <p className="font-semibold">{item.title}</p>
              <p className="text-gray-500 text-sm">{item.time}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Learn */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Learn</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { title: "The ultimate guide to Notion templates", time: "5m read" },
            { title: "Customize & style your content", time: "9m read" },
            { title: "Getting started with projects and tasks", time: "8m read" },
            { title: "Using Notion AI to your impact", time: "3m read" },
          ].map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}
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
        <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
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
