import { useEffect, useState } from "react";
import MessengerChat from "./MessageChat"; // Giả sử MessengerChat cùng thư mục
import { getListSharesByApprove, ShareResponse } from "@/service/ShareService";
import { fetchMessages, Message } from "@/service/MessageService";

// Định nghĩa interface cho User
interface ChatUser {
  email: string;
  name?: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

const MessageHome = () => {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const currentUserEmail = localStorage.getItem("email") as string;

  useEffect(() => {
    const fetchUserShare = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await getListSharesByApprove(Number(userId));
        const shareData: ShareResponse[] = await response;

        // Lấy danh sách tin nhắn mới nhất cho từng user
        const chatUsersPromises = shareData.map(async (item) => {
          const messages: Message[] = await fetchMessages(
            currentUserEmail,
            item.ghostName
          );
          
          // Sắp xếp tin nhắn theo thời gian và lấy tin nhắn mới nhất
          const latestMessage = messages
            .sort((a, b) => {
              const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
              const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
              return timeB - timeA; // Sắp xếp giảm dần để lấy tin nhắn mới nhất
            })[0];

          return {
            email: item.ghostName,
            name: item.ghostName,
            lastMessage: latestMessage?.content || "No messages yet",
            lastMessageTime: latestMessage?.timestamp || item.requestTime,
          };
        });

        // Chờ tất cả các promise hoàn thành
        const chatUsers: ChatUser[] = await Promise.all(chatUsersPromises);

        setUsers(chatUsers); // Cập nhật danh sách users
        if (chatUsers.length > 0) {
          setSelectedUser(chatUsers[0]); // Chọn user đầu tiên mặc định
        }
      } catch (error) {
        console.error("Failed to fetch user shares or messages", error);
      }
    };

    fetchUserShare();
  }, [currentUserEmail]); // Thêm currentUserEmail vào dependency array nếu cần

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Danh sách user bên trái */}
      <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {users.map((user) => (
            <div
              key={user.email}
              onClick={() => setSelectedUser(user)}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedUser?.email === user.email ? "bg-gray-100" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{user.name || user.email}</h3>
                  <p className="text-sm text-gray-500 truncate max-w-[200px]">
                    {user.lastMessage || "No messages yet"}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {user.lastMessageTime
                    ? new Date(user.lastMessageTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Giao diện chat bên phải */}
      <div className="w-2/3">
        {selectedUser ? (
          <MessengerChat
            otherUserEmail={selectedUser.email}
            otherUserName={selectedUser.name}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageHome;