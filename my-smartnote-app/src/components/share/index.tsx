import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Lock, Copy } from "lucide-react";
import { sendInvitation, generateInviteLink } from "@/service/InviteService";
import { toast } from "react-toastify"; // Import toast để hiển thị thông báo
import "react-toastify/dist/ReactToastify.css"; // Import CSS của toastify
import { ToastContainer } from "react-toastify";
interface ShareHomeProps {
  shareId: { type: "note" | "task"; id: number } | null;
}
const ShareHome: React.FC<ShareHomeProps> = ({ shareId }) => {
  const [notificationCount, setNotificationCount] = useState(5);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const accessOptions = ["FULL_ACCESS", "READ_ONLY", "COMMENT_ONLY"];
  const generalOptions = ["Only people invited", "Anyone with the link"];

  const [selectedAccess, setSelectedAccess] = useState(accessOptions[0]);
  const [selectedGeneral, setSelectedGeneral] = useState(generalOptions[0]);
  const [inviteLink, setInviteLink] = useState("");
  const username = localStorage.getItem("username");
  const emailUser = localStorage.getItem("email");
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleInvite = async () => {
    if (!email) {
      toast.error("Vui lòng nhập email hoặc nhóm để mời.");
      return;
    }

    try {
      console.log(selectedAccess);
      await sendInvitation(email, selectedAccess);
      toast.success("Invitation sent successfully!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to send invitation");
    }
  };

  const handleGenerateLink = async () => {
    try {
      if (!shareId) {
        alert(
          "Không có nội dung nào được chọn để chia sẻ. Vui lòng chọn một ghi chú hoặc nhiệm vụ."
        );
        return;
      }

      console.log("Generating link for:", shareId);

      // Phân biệt noteId hay taskId dựa trên type
      const link = await generateInviteLink(
        selectedAccess,
        shareId.type === "note" ? shareId.id : undefined, // noteId
        shareId.type === "task" ? shareId.id : undefined // taskId
      );
      console.log("Liên kết đã tạo:", link);
      setInviteLink(link);
      await navigator.clipboard.writeText(link);
      // alert("Liên kết đã được tạo!");
    } catch (error) {
      alert("Không thể tạo liên kết mời");
    }
  };

  const handleCopyLink = async () => {
    if (!inviteLink) {
      await handleGenerateLink();
    }
    if (inviteLink) {
      try {
        console.log("Sao chép liên kết:", inviteLink);
        await navigator.clipboard.writeText(inviteLink);
        alert("Liên kết đã được sao chép!");
      } catch (error) {
        alert("Không thể sao chép liên kết");
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <ToastContainer position="top-right" autoClose={3000} />
      <button
        className="text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="relative">
          <Share2 className="text-xl" />
          {notificationCount > 0 && (
            <span className="absolute -top-3 -right-5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-1">
              {notificationCount}
            </span>
          )}
        </div>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-md overflow-hidden z-10 mt-4"
          style={{ width: "auto", minWidth: "300px" }}
        >
          <div className="flex justify-between px-4 py-2 border-b border-gray-300">
            <button className="text-black font-semibold">Share</button>
            <button className="text-gray-600">Publish</button>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Email or group, separated by commas"
                className="bg-gray-100 text-black flex-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button className="bg-blue-600 text-white" onClick={handleInvite}>
                Invite
              </Button>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                N
              </div>
              <div className="flex-1">
                <span className="block font-semibold">{username}(You)</span>
                <span className="block text-gray-500 text-sm">{emailUser}</span>
              </div>
              <select
                className="text-gray-500 bg-white border rounded-md px-2 py-1"
                value={selectedAccess}
                onChange={(e) => setSelectedAccess(e.target.value)}
              >
                {accessOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Lock className="w-5 h-5 text-gray-500" />
              <select
                className="text-gray-500 bg-white border rounded-md px-2 py-1"
                value={selectedGeneral}
                onChange={(e) => setSelectedGeneral(e.target.value)}
              >
                {generalOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between items-center mt-4">
              <button className="text-gray-500">Learn about sharing</button>
              <Button
                className="bg-gray-200 text-black flex items-center gap-1"
                onClick={handleCopyLink}
              >
                <Copy className="w-5 h-5" /> Copy link
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareHome;
