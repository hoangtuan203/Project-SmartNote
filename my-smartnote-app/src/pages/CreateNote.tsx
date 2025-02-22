import { useState } from "react";

const CreateNote = () => {
  const [noteTitle, setNoteTitle] = useState("");

  const handleSaveNote = () => {
    // Lưu ghi chú (có thể lưu vào backend hoặc state, tùy thuộc vào yêu cầu)
    alert(`Note with title "${noteTitle}" saved!`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Create New Note</h2>
      <input
        type="text"
        className="border p-2 w-full mb-4"
        placeholder="Enter note title"
        value={noteTitle}
        onChange={(e) => setNoteTitle(e.target.value)}
      />
      <button
        onClick={handleSaveNote}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Save Note
      </button>
    </div>
  );
};

export default CreateNote;
