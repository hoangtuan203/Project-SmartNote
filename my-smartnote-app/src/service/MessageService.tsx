import httpRequest from "@/utils/httpRequest";
export interface Message {
  id?: number;
  senderEmail: string;
  receiverEmail: string;
  content: string;
  timestamp?: string;
}

export const fetchMessages = async (
  sender: string,
  receiver: string
): Promise<Message[]> => {
  const response = await httpRequest.get("/messages", {
    params: { sender, receiver },
  });
  return response.data;
};

export const sendMessage = async (message: Message): Promise<Message> => {
  const response = await httpRequest.post("/messages", message);
  return response.data;
};
