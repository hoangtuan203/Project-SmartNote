import React, { useState } from "react";
import { BiParagraph, BiHeading, BiListUl, BiListOl, BiCodeBlock, BiChevronDown } from "react-icons/bi";

interface TextOptionsProps {
  onSelectTextFormat: (format: string) => void;
}

const textOptions = [
  { label: "Text", type: "p", icon: <BiParagraph className="text-lg" /> },
  { label: "Heading 1", type: "h1", icon: <BiHeading className="text-2xl" /> },
  { label: "Heading 2", type: "h2", icon: <BiHeading className="text-xl" /> },
  { label: "Bulleted List", type: "bulleted", icon: <BiListUl className="text-lg" /> },
  { label: "Numbered List", type: "numbered", icon: <BiListOl className="text-lg" /> },
  { label: "Quote", type: "blockquote", icon: <BiListOl className="text-lg" /> },
  { label: "Code", type: "pre", icon: <BiCodeBlock className="text-lg" /> }
];

const TextOptions: React.FC<TextOptionsProps> = ({ onSelectTextFormat }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(textOptions[0]);

  const handleSelectFormat = (type: string) => {
    const format = textOptions.find((option) => option.type === type);
    if (format) {
      setSelectedFormat(format);
      onSelectTextFormat(type); 
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center justify-between w-40 px-4 py-2 bg-white border rounded-lg shadow-md hover:bg-gray-100 transition-all"
      >
        <span className="font-medium">{selectedFormat.label}</span>
        <BiChevronDown className={`transition-transform ${showDropdown ? "rotate-180" : "rotate-0"}`} />
      </button>

      {showDropdown && (
        <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg border rounded-lg p-2 z-50 animate-fadeIn">
          {textOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => handleSelectFormat(option.type)}
              className="flex items-center gap-3 w-full text-left px-4 py-2 rounded-md hover:bg-gray-200 hover:scale-105 transition-all"
            >
              {option.icon}
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextOptions;
