import React from "react";
import {
  BiBold,
  BiItalic,
  BiUnderline,
  BiAlignLeft,
  BiAlignMiddle,
  BiAlignRight,
} from "react-icons/bi";
import ColorPicker from "./ColorPicker";
import TextOptions from "./TextOptions";

interface ToolbarProps {
  visible: boolean;
  position: { x: number; y: number };
  onSelectTextFormat  : (text: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ visible, position, onSelectTextFormat  }) => {
  if (!visible) return null;

  const wrapSelectedText = (tag: string) => {
    const selection = window.getSelection();
    console.log(selection);
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.extractContents();

    // Nếu là danh sách, cần xử lý riêng
    if (tag === "bulleted" || tag === "numbered") {
      const listTag = tag === "bulleted" ? "ul" : "ol";
      const list = document.createElement(listTag);
      const listItem = document.createElement("li");

      listItem.appendChild(selectedText);
      list.appendChild(listItem);
      range.deleteContents();
      range.insertNode(list);

    } else {
      // Các thẻ tiêu đề, đoạn văn, blockquote, code
      const newElement = document.createElement(tag);
      newElement.appendChild(selectedText);
      range.deleteContents();
      range.insertNode(newElement);
    }

    // Giữ nguyên vùng chọn sau khi thay đổi
    selection.removeAllRanges();
    selection.addRange(range);
  };

  // Thay đổi màu chữ
  const changeTextColor = (color: string) => {
    wrapSelectedText("span");
    document
      .getSelection()
      ?.focusNode?.parentElement?.style.setProperty("color", color);
  };

  // Thay đổi màu nền chữ
  const changeBackgroundColor = (color: string) => {
    wrapSelectedText("span");
    document
      .getSelection()
      ?.focusNode?.parentElement?.style.setProperty("background-color", color);
  };

  return (
    <div
      className="absolute bg-white shadow-xl rounded-lg flex items-center space-x-2 px-4 py-2 border z-50 transition-opacity duration-200"
      style={{
        top: position.y,
        left: position.x,
        transform: "translate(-50%, -120%)",
      }}
    >
      {/* Tùy chọn định dạng văn bản */}
      <TextOptions onSelectTextFormat={onSelectTextFormat} />

      {/* In đậm */}
      <button
        onClick={() => wrapSelectedText("b")}
        className="p-2 rounded-md text-gray-700 hover:bg-gray-200 active:bg-gray-300"
      >
        <BiBold className="text-xl" />
      </button>

      {/* In nghiêng */}
      <button
        onClick={() => wrapSelectedText("i")}
        className="p-2 rounded-md text-gray-700 hover:bg-gray-200 active:bg-gray-300"
      >
        <BiItalic className="text-xl" />
      </button>

      {/* Gạch chân */}
      <button
        onClick={() => wrapSelectedText("u")}
        className="p-2 rounded-md text-gray-700 hover:bg-gray-200 active:bg-gray-300"
      >
        <BiUnderline className="text-xl" />
      </button>

      {/* Chọn màu chữ và màu nền */}
      <ColorPicker
        onSelectTextColor={changeTextColor}
        onSelectBgColor={changeBackgroundColor}
      />

      {/* Căn lề trái */}
      <button
        onClick={() => wrapSelectedText("div")}
        className="p-2 rounded-md text-gray-700 hover:bg-gray-200 active:bg-gray-300"
      >
        <BiAlignLeft className="text-xl" />
      </button>

      {/* Căn giữa */}
      <button
        onClick={() => wrapSelectedText("div")}
        className="p-2 rounded-md text-gray-700 hover:bg-gray-200 active:bg-gray-300"
      >
        <BiAlignMiddle className="text-xl" />
      </button>

      {/* Căn lề phải */}
      <button
        onClick={() => wrapSelectedText("div")}
        className="p-2 rounded-md text-gray-700 hover:bg-gray-200 active:bg-gray-300"
      >
        <BiAlignRight className="text-xl" />
      </button>
    </div>
  );
};

export default Toolbar;
