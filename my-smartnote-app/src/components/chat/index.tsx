import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Inbox, User, Trash2 } from 'lucide-react';
import { useNavigate } from "react-router-dom";
const ChatHome = () => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState<number | null>(null);

    // Hàm xử lý chuyển file
    const handleFileClick = (id: number) => {
        navigate(`/note/${id}`);
    };

    return (
        <div className="relative p-4 w-full">
            {/* Hộp Inbox luôn hiển thị */}
            <div className="w-full bg-white rounded-2xl shadow-xl p-4">
                <div className="flex items-center justify-between text-black mb-4">
                    <h2 className="text-xl font-semibold">Inbox</h2>
                    <Inbox className="w-6 h-6" />
                </div>
                <ScrollArea className="max-h-screen">
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((id) => (
                            <Card
                                key={id}
                                className={`relative bg-white text-black shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
                                    hovered === id ? 'border-2 border-blue-500' : ''
                                }`}
                                onMouseEnter={() => setHovered(id)}
                                onMouseLeave={() => setHovered(null)}
                                onClick={() => handleFileClick(id)}
                            >
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <User className="w-6 h-6 mr-2 text-gray-700" />
                                        <span className="text-sm font-medium">User {id} requested access to</span>
                                    </div>
                                    {hovered === id && (
                                        <Trash2 className="w-5 h-5 text-gray-500 hover:text-red-600 transition-colors duration-300" />
                                    )}
                                </CardContent>
                                <p className="text-xs text-gray-500 mt-1 ml-4">Chia công việc TKGD</p>
                                <p className="text-xs text-gray-400 ml-4 pb-4 pt-2">Approved by You on Mar {id}, 2025, 2:09 PM</p>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default ChatHome;
