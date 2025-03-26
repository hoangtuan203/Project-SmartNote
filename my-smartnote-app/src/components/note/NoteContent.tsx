import React, { useEffect, useState } from "react";
import { functionsList } from "./SlashCommand";
import { getNoteImages, NoteImage } from "@/service/NoteImageService";
import { useLocation } from "react-router-dom";
import { Note } from "@/service/NoteService";
import EditableDiv from "./EditableDiv";
const NoteContent = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const location = useLocation();
  const note: Note | null = location.state || null;
  const noteId = note?.noteId ?? -1;

  const [images, setImages] = useState<NoteImage[]>([]); // Lưu danh sách ảnh

  useEffect(() => {
    const loadImages = async () => {
      if (noteId === -1) return; // Nếu noteId không hợp lệ, không tải ảnh

      try {
        const data = await getNoteImages(noteId); // Gọi API lấy ảnh
        console.log("Loaded images:", data);

        if (!Array.isArray(data)) {
          throw new Error("Invalid API response format");
        }

        // Xử lý để chỉ lấy filename từ imageUrl
        const processedImages: NoteImage[] = data.map((img) => ({
          imageId: img.imageId,
          noteId: img.noteId,
          imageUrl: img.imageUrl.split("/").pop() || "", // Lấy filename từ đường dẫn
        }));

        console.log("Processed images:", processedImages);
        setImages(processedImages);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    loadImages();
  }, [noteId]);

  const handleKeyDown = (e: React.FormEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const node = range.startContainer;
    let charBeforeCursor = "";

    if (node.nodeType === Node.TEXT_NODE && node.textContent) {
      charBeforeCursor = node.textContent[range.startOffset - 1] || "";
    }

    if (charBeforeCursor === "/") {
      const rect = range.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
      setShowMenu(true);
    } else {
      setShowMenu(false);
    }
  };

  return (
    <>
      <EditableDiv
        images={images}
        handleSlashCommand={() => console.log("Slash command triggered")}
      />

      {showMenu && (
        <div
          className="absolute bg-white rounded-xl shadow-lg p-4 w-72 z-50"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          <input
            type="text"
            placeholder="Filter..."
            className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
          />
          {functionsList.map((group, index) => (
            <div key={index} className="mb-2">
              <h3 className="text-sm font-semibold text-gray-500">
                {group.category}
              </h3>
              {group.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100 cursor-pointer"
                >
                  {item.icon}
                  <span className="text-gray-800">{item.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default NoteContent;
