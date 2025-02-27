import { useState, useRef, useEffect } from "react";
// import { Plus, Image, MessageCircle, X, Paperclip, Send } from "lucide-react";

const SLASH_COMMANDS = [
  { label: "Text", symbol: "T" },
  { label: "Heading 1", symbol: "#" },
  { label: "Heading 2", symbol: "##" },
  { label: "Heading 3", symbol: "###" },
  { label: "Bulleted list", symbol: "-" },
  { label: "Numbered list", symbol: "1." },
  { label: "To-do list", symbol: "[]" },
  { label: "Toggle list", symbol: ">" },
];

export default function CreateNote() {
  const [title, setTitle] = useState("Untitled Note");
  const [content, setContent] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState(SLASH_COMMANDS);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        setShowMenu(true);
        setFilteredCommands(SLASH_COMMANDS);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCommandSelect = (command: { label: string; symbol: string }) => {
    setContent((prev) => prev + `\n${command.symbol} `);
    setShowMenu(false);
  };

  return (
    <div className="w-full min-h-screen px-10 py-6 bg-white text-black shadow-lg">
      {/* Tiêu đề ghi chú */}
      <input
        className="w-full text-3xl font-bold border-none outline-none bg-transparent"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Khu vực soạn thảo ghi chú */}
      <div className="relative">
        <textarea
          ref={editorRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-80 mt-5 p-4 text-lg outline-none border rounded-md"
        />

        {showMenu && (
          <div className="absolute top-14 left-4 w-64 bg-white shadow-md rounded-md border">
            <div className="p-2 text-gray-500 text-sm">Basic blocks</div>
            {filteredCommands.map((cmd) => (
              <div
                key={cmd.label}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                onClick={() => handleCommandSelect(cmd)}
              >
                <span>{cmd.label}</span>
                <span className="text-gray-400">{cmd.symbol}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}