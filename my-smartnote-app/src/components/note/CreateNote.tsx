import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { Note } from "@/service/NoteService";
import { getAllNotes } from "@/service/NoteService";
import { getAllUser } from "@/service/UserService";
import NoteContent from "@/components/note/NoteContent";
import { co } from "node_modules/@fullcalendar/core/internal-common";
export default function CreateNote() {


 

  const location = useLocation();
  const note: Note | null = location.state || null;
  const pathParts = location.pathname.split("/"); // ["", "note", "26"] hoặc ["", "note"]
  const lastPart = pathParts[pathParts.length - 1];
  const noteId = lastPart && !isNaN(Number(lastPart)) ? Number(lastPart) : null; // Kiểm tra hợp lệ
  const [mentionPeopleList, setMentionPeopleList] = useState<string[]>([]);
  const [mentionNoteList, setMentionNoteList] = useState<
    { id: number; title: string }[]
  >([]);




  const loadUserNote = async () => {
    try {
      const data = await getAllUser(1, 5); // Lấy 5 user đầu tiên
      if (data) {
        const userList = data.users.map((user) => `${user.fullName}`);
        setMentionPeopleList(userList); // Cập nhật danh sách People
      }
    } catch (error) {
      console.error("Error loading user note:", error);
    }
  };

  const loadNotes = async () => {
    try {
      const data = await getAllNotes(); // Lấy tất cả các ghi chú
      if (data) {
        const noteList = data.map((note) => ({
          id: note.noteId, // Lấy ra noteId
          title: note.title, // Lấy ra title
        }));
        setMentionNoteList(noteList); // Cập nhật danh sách Notes với cả id và title
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  const samplePeopleList =
    mentionPeopleList.length > 0
      ? mentionPeopleList
      : [
          "Nguyễn Hoàng Tuấn (You)",
          "0552_Vũ Ngọc Tú",
          "0545_Trịnh Quang Trường",
          "Invite...",
        ];

  const sampleNoteList =
    mentionNoteList.length > 0
      ? mentionNoteList
      : [
          "Used To",
          "Chức năng Smart Note",
          "Chia công việc TKGD",
          "Teamspace Home",
          "Learn English",
        ];

 

  useEffect(() => {
    loadUserNote();
    loadNotes();
  }, []); 

  return (
    <div className="w-full min-h-screen px-10 py-6 bg-white text-black">
      <div>
        <NoteContent noteId={noteId} />
      </div>
    </div>
  );
}
