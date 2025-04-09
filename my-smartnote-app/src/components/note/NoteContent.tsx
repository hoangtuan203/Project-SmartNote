import { useState } from "react";
import { functionsList } from "./SlashCommand";
import {Note } from "@/service/NoteService";
import EditableDiv from "./EditableDiv";
const NoteContent = ({
  noteId,
}: {
  noteId?: number | null;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const [noteData, setNoteData] = useState<Note | null>(null); // Lưu thông tin ghi chú

  return (
    <>
      <EditableDiv
       
        handleSlashCommand={() => console.log("Slash command triggered")}
        content={noteData?.content || ""}
        noteId={noteId}
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
