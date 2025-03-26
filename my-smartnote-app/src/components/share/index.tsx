import  { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Lock, Copy } from 'lucide-react';

const ShareHome = () => {
    const [notificationCount, setNotificationCount] = useState(5);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const accessOptions = ["Full access", "View only", "Comment only"];
    const generalOptions = ["Only people invited", "Anyone with the link"];

    const [selectedAccess, setSelectedAccess] = useState(accessOptions[0]);
    const [selectedGeneral, setSelectedGeneral] = useState(generalOptions[0]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

    return (
        <div className="relative" ref={dropdownRef}>
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
                <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-md overflow-hidden z-10 mt-4" style={{ width: 'auto', minWidth: '300px' }}>
                    <div className="flex justify-between px-4 py-2 border-b border-gray-300">
                        <button className="text-black font-semibold">Share</button>
                        <button className="text-gray-600">Publish</button>
                    </div>
                    <div className="p-4">
                        <Input placeholder="Email or group, separated by commas" className="bg-gray-100 text-black mb-2" />
                        <Button className="w-full bg-blue-600 text-white">Invite</Button>
                        <div className="flex items-center gap-2 mt-4">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">N</div>
                            <div className="flex-1">
                                <span className="block font-semibold">Nguyễn Hoàng Tuấn (You)</span>
                                <span className="block text-gray-500 text-sm">nguyenhoangtuan12102003@gmail.com</span>
                            </div>
                            <select className="text-gray-500 bg-white border rounded-md px-2 py-1" value={selectedAccess} onChange={(e) => setSelectedAccess(e.target.value)}>
                                {accessOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <Lock className="w-5 h-5 text-gray-500" />
                            <select className="text-gray-500 bg-white border rounded-md px-2 py-1" value={selectedGeneral} onChange={(e) => setSelectedGeneral(e.target.value)}>
                                {generalOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <button className="text-gray-500">Learn about sharing</button>
                            <Button className="bg-gray-200 text-black flex items-center gap-1">
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
