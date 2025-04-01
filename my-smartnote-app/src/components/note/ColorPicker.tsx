import React, { useState } from "react";
import { FaPalette } from "react-icons/fa";

interface ColorPickerProps {
  onSelectTextColor: (color: string) => void;
  onSelectBgColor: (color: string) => void;
}

const colors = [
  "#000000", "#E67C73", "#F6BF26", "#33B679",
  "#4285F4", "#B39DDB", "#D50000"
];

const bgColors = [
  "#FFFFFF", "#F28B82", "#FBBC04", "#FFF475",
  "#CCFF90", "#A7FFEB", "#CBF0F8"
];

const ColorPicker: React.FC<ColorPickerProps> = ({ onSelectTextColor, onSelectBgColor }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTextColor, setSelectedTextColor] = useState("#000000");
  const [selectedBgColor, setSelectedBgColor] = useState("#FFFFFF");

  const handleSelect = (color: string, isText: boolean) => {
    if (isText) {
      setSelectedTextColor(color);
      onSelectTextColor(color);
    } else {
      setSelectedBgColor(color);
      onSelectBgColor(color);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 border rounded-md shadow bg-white flex items-center space-x-2 hover:bg-gray-100 transition"
      >
        <FaPalette className="text-gray-600 text-lg" />
        <span className="w-5 h-5 rounded-full border" style={{ backgroundColor: selectedTextColor }}></span>
        <span className="w-5 h-5 rounded-full border" style={{ backgroundColor: selectedBgColor }}></span>
      </button>

      {showDropdown && (
        <div className="absolute mt-2 w-52 bg-white shadow-lg rounded-md p-3 z-50 border animate-fadeIn">
          <p className="text-gray-600 text-sm font-medium mb-2">Text Color</p>
          <div className="grid grid-cols-7 gap-2 mb-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleSelect(color, true)}
                className="w-6 h-6 rounded-full border hover:scale-110 hover:shadow-lg transition"
                style={{ backgroundColor: color }}
              ></button>
            ))}
          </div>

          <p className="text-gray-600 text-sm font-medium mb-2">Background Color</p>
          <div className="grid grid-cols-7 gap-2">
            {bgColors.map((color) => (
              <button
                key={color}
                onClick={() => handleSelect(color, false)}
                className="w-6 h-6 rounded-full border hover:scale-110 hover:shadow-lg transition"
                style={{ backgroundColor: color }}
              ></button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
