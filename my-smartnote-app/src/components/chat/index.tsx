import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Inbox, User, CheckCircle, MoreVertical } from "lucide-react";
import { getListShares, ShareResponse } from "@/service/ShareService";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { approveAccess } from "@/service/InviteService";

const ChatHome = () => {
  const [shares, setShares] = useState<ShareResponse[]>([]);
  const [roles, setRoles] = useState<{ [key: number]: string }>({});
  const listRoles = {
    1: "FULL_ACCESS",
    2: "READ_ONLY",
    3: "COMMENT_ONLY",
  };

  useEffect(() => {
    const fetchShares = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const userIdConvertNumber = Number(userId);
        
        const data = await getListShares(userIdConvertNumber);

        data.sort((a, b) => new Date(b.requestTime).getTime() - new Date(a.requestTime).getTime());
        setShares(data);
      } catch (error) {
        console.error("Error fetching shares:", error);
      }
    };
    fetchShares();
  }, []);

  const handleApprove = async (id: number, token: string) => {
    try {
      await approveAccess(token, true);
      setShares((prevShares) =>
        prevShares.map((share) =>
          share.shareId === id ? { ...share, status: "ACCEPTED" } : share
        )
      );
      console.log(`Approved request ${id} with role: ${roles[id] || "Can view"}`);
    } catch (error) {
      console.error("Error approving access:", error);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex justify-center items-start">
      {/* Full-screen container */}
      <div className="w-full h-full bg-white rounded-none shadow-none p-0 m-0">
        {/* Header */}
        <div className="w-full flex items-center justify-between text-gray-900 mb-6 border-b pb-3 px-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-black">
            Inbox
          </h2>
          <Inbox className="w-7 h-7 text-black" />
        </div>
  
        {/* Scrollable List with increased spacing */}
        <ScrollArea className="max-h-[calc(100vh-120px)] overflow-y-auto space-y-8 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100 px-6">
          {shares.map((share) => (
            <Card
              key={share.shareId}
              className="relative m-1 bg-white text-gray-900 shadow-md rounded-2xl p-5 transition hover:shadow-lg"
            >
              <CardContent className="flex flex-col gap-4">
                {/* Thông tin người gửi */}
                <div className="flex items-start gap-3">
                  <User className="w-10 h-10 text-gray-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {share.ghostName} requested access to
                    </p>
                    <p className="text-lg font-bold text-black-600">
                      {share.title}
                    </p>
                    {share.status === "PENDING" && (
                      <div className="mt-2 w-full min-w-[300px] bg-yellow-100 text-yellow-700 text-sm p-3 rounded-lg shadow-inner whitespace-nowrap">
                        ⚠ Make sure you trust this external user before sharing
                        any content.
                      </div>
                    )}
                  </div>
                  <MoreVertical className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-800 transition" />
                </div>
  
                {/* Chọn vai trò và nút duyệt */}
                {share.status === "PENDING" ? (
                  <div className="w-fit min-w-[250px] max-w-[300px] mx-auto grid grid-cols-[0.7fr_auto] gap-2 items-center">
                    {/* Role Selection */}
                    <Select
                      value={roles[share.shareId] || share.permission} // Giá trị mặc định lấy từ DB
                      onValueChange={(value) =>
                        setRoles({ ...roles, [share.shareId]: value }) // Lưu role mới vào state
                      }
                    >
                      <SelectTrigger className="w-full border rounded-lg px-2 py-2 text-sm bg-gray-50 hover:bg-gray-100 transition">
                        {roles[share.shareId] || share.permission}{" "}
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(listRoles).map(([key, role]) => (
                          <SelectItem key={key} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
  
                    {/* Approve Button */}
                    <Button
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
                      onClick={() => handleApprove(share.shareId, share.tokenShare)}
                    >
                      Approve
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 mt-2">
                    <CheckCircle className="w-6 h-6" />
                    <p className="text-sm font-semibold">
                      ✅ Approved by You on {share.requestTime}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default ChatHome;
