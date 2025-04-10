import { useEffect, useState, useRef } from "react";
import { fetchMessages, Message } from "@/service/MessageService";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Send } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const MessengerChat = ({
  otherUserEmail,
  otherUserName,
}: {
  otherUserEmail: string;
  otherUserName?: string;
}) => {
  const currentUserEmail = localStorage.getItem("email") as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const clientRef = useRef<Client | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        await fetch("/api/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (err) {
        console.error("Failed to fetch current user", err);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUserEmail) return;

    fetchMessages(currentUserEmail, otherUserEmail)
      .then(setMessages)
      .catch((err) => console.error("Failed to load messages", err));

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      onConnect: () => {
        client.subscribe("/topic/messages", (message) => {
          const data: Message = JSON.parse(message.body);
          const isRelevant =
            (data.senderEmail === currentUserEmail &&
              data.receiverEmail === otherUserEmail) ||
            (data.senderEmail === otherUserEmail &&
              data.receiverEmail === currentUserEmail);

          if (isRelevant) {
            setMessages((prev) => [...prev, data]);
          }
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [currentUserEmail, otherUserEmail]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !currentUserEmail) return;

    const msg: Message = {
      senderEmail: currentUserEmail,
      receiverEmail: otherUserEmail,
      content: input,
    };

    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination: "/app/chat",
        body: JSON.stringify(msg),
      });
      setInput("");
    } else {
      console.error("WebSocket is not connected.");
    }
  };
  return (
    <div className="flex flex-col h-screen bg-white text-black">
      {/* Header */}
      <div className="h-16 p-4 text-xl font-semibold border-b border-gray-200 bg-white shadow sticky top-0 z-10">
        💬 Chat with {otherUserName || otherUserEmail}
      </div>

      {/* Message list */}
      <div
        className="overflow-y-auto px-4 py-4 space-y-4 bg-gray-50"
        style={{ height: "calc(100vh - 64px - 72px)" }} // 64px header, 72px input
      >
        {messages
          .sort((a, b) => {
            // Xử lý trường hợp timestamp là null
            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0; // Chuyển thành số, nếu null thì dùng 0
            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return timeA - timeB; // Sắp xếp theo thời gian tăng dần
          })
          .map((msg, idx) => {
            const isCurrentUser = msg.senderEmail === currentUserEmail; // Người gửi là current user
            return (
              <div
                key={idx}
                className={`flex flex-col ${
                  isCurrentUser ? "items-end" : "items-start"
                }`}
              >
                <div className="text-xs text-gray-500 mb-1">
                  {isCurrentUser ? "You" : msg.senderEmail}
                </div>
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md ${
                    isCurrentUser
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-300 text-black rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {msg.timestamp
                    ? dayjs(msg.timestamp).fromNow()
                    : "Time not available"}
                </div>
              </div>
            );
          })}
        <div ref={scrollRef}></div>
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 p-3 flex gap-2 bg-white sticky bottom-0 z-10 h-[64px]">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MessengerChat;
