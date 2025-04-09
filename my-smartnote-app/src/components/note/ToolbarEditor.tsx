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
  onSelectTextFormat: (text: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  visible,
  position,
  onSelectTextFormat,
}) => {
  if (!visible) return null;

  const wrapSelectedText = (tag: string, style?: Record<string, string>) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.extractContents();

    const newElement = document.createElement(tag);
    newElement.appendChild(selectedText);

    if (style) {
      Object.entries(style).forEach(([key, value]) => {
        newElement.style.setProperty(key, value);
      });
    }

    range.deleteContents();
    range.insertNode(newElement);

    selection.removeAllRanges();
    selection.addRange(range);
  };

  const changeTextColor = (color: string) => {
    wrapSelectedText("span");
    document
      .getSelection()
      ?.focusNode?.parentElement?.style.setProperty("color", color);
  };

  const changeBackgroundColor = (color: string) => {
    wrapSelectedText("span");
    document
      .getSelection()
      ?.focusNode?.parentElement?.style.setProperty("background-color", color);
  };

  const alignSelectedText = (alignment: "left" | "center" | "right") => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedContent = range.extractContents();

    const div = document.createElement("div");
    div.style.textAlign = alignment;
    div.appendChild(selectedContent);

    range.deleteContents();
    range.insertNode(div);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(div);
    selection.addRange(newRange);
  };

  const applyTextFormat = (format: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
  
    const range = selection.getRangeAt(0);
    const selectedContent = range.extractContents();
    console.log("Selected content:", selectedContent);
  
    let newElement: HTMLElement;
  
    switch (format) {
      case "p":
      case "h1":
      case "h2":
      case "blockquote":
      case "pre":
        newElement = document.createElement(format);
        newElement.appendChild(selectedContent);
        break;
  
      case "bulleted": {
        newElement = document.createElement("ul");
        const lines = splitContentIntoLines(selectedContent);
  
        if (lines.length === 1) {
          // Chỉ có một dòng
          const liBullet = document.createElement("li");
          liBullet.appendChild(lines[0] || document.createTextNode(" "));
          newElement.appendChild(liBullet);
        } else if (lines.length >= 2) {
          // Có từ hai dòng trở lên
          const firstLineText = lines[0].textContent || "";
          const secondLineText = lines[1].textContent || "";
          const isIndented = /^\s+/.test(secondLineText);
  
          if (!isIndented) {
            // Hai dòng thẳng hàng -> tạo hai <li> riêng biệt
            lines.forEach((line) => {
              const liBullet = document.createElement("li");
              liBullet.appendChild(line || document.createTextNode(" "));
              newElement.appendChild(liBullet);
            });
          } else {
            // Dòng thứ hai thụt vào -> tạo <li> cấp 1 và <li> cấp 2
            const liLevel1 = document.createElement("li");
            liLevel1.appendChild(lines[0] || document.createTextNode(" "));
  
            const nestedUl = document.createElement("ul");
            nestedUl.style.listStyleType = "circle"; // Chấm trắng cho cấp 2
            const liLevel2 = document.createElement("li");
            liLevel2.textContent = secondLineText.trim(); // Loại bỏ khoảng trắng đầu dòng
            nestedUl.appendChild(liLevel2);
  
            liLevel1.appendChild(nestedUl);
            newElement.appendChild(liLevel1);
  
            // Xử lý các dòng còn lại (nếu có)
            for (let i = 2; i < lines.length; i++) {
              const additionalLi = document.createElement("li");
              additionalLi.appendChild(lines[i] || document.createTextNode(" "));
              newElement.appendChild(additionalLi);
            }
          }
        }
        break;
      }
  
      case "numbered": {
        newElement = document.createElement("ol");
        const lines = splitContentIntoLines(selectedContent);
  
        if (lines.length === 1) {
          const liNumber = document.createElement("li");
          liNumber.appendChild(lines[0] || document.createTextNode(" "));
          newElement.appendChild(liNumber);
        } else if (lines.length >= 2) {
          const firstLineText = lines[0].textContent || "";
          const secondLineText = lines[1].textContent || "";
          const isIndented = /^\s+/.test(secondLineText);
  
          if (!isIndented) {
            // Hai dòng thẳng hàng -> tạo hai <li> riêng biệt
            lines.forEach((line) => {
              const liNumber = document.createElement("li");
              liNumber.appendChild(line || document.createTextNode(" "));
              newElement.appendChild(liNumber);
            });
          } else {
            // Dòng thứ hai thụt vào -> tạo <li> cấp 1 và <li> cấp 2
            const liLevel1 = document.createElement("li");
            liLevel1.appendChild(lines[0] || document.createTextNode(" "));
  
            const nestedOl = document.createElement("ol");
            nestedOl.style.listStyleType = "lower-alpha"; // a, b, c cho cấp 2
            const liLevel2 = document.createElement("li");
            liLevel2.textContent = secondLineText.trim();
            nestedOl.appendChild(liLevel2);
  
            liLevel1.appendChild(nestedOl);
            newElement.appendChild(liLevel1);
  
            for (let i = 2; i < lines.length; i++) {
              const additionalLi = document.createElement("li");
              additionalLi.appendChild(lines[i] || document.createTextNode(" "));
              newElement.appendChild(additionalLi);
            }
          }
        }
        break;
      }
  
      default:
        newElement = document.createElement("span");
        newElement.appendChild(selectedContent);
        break;
    }
  
    range.deleteContents();
    range.insertNode(newElement);
  
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(newElement);
    newRange.collapse(false);
    selection.addRange(newRange);
  
    onSelectTextFormat(format);
  };
  
  // Hàm hỗ trợ tách nội dung thành các dòng
  const splitContentIntoLines = (content: DocumentFragment): (DocumentFragment | Text)[] => {
    const lines: (DocumentFragment | Text)[] = [];
    const nodes = Array.from(content.childNodes);
  
    nodes.forEach((node) => {
      if (node.nodeName === "BR") {
        lines.push(document.createTextNode(""));
      } else if (node.nodeType === Node.TEXT_NODE) {
        const text = (node as Text).textContent || "";
        const splitLines = text.split("\n").filter((line) => line !== "");
        splitLines.forEach((line, index) => {
          const lineFragment = document.createTextNode(line);
          lines.push(lineFragment);
          if (index < splitLines.length - 1) {
            lines.push(document.createTextNode(""));
          }
        });
      } else {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(node.cloneNode(true));
        lines.push(fragment);
      }
    });
  
    return lines;
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
      <TextOptions onSelectTextFormat={applyTextFormat} />

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

      <button
        onClick={() => alignSelectedText("left")}
        className="p-2 rounded-md text-gray-700 hover:bg-gray-200 active:bg-gray-300"
      >
        <BiAlignLeft className="text-xl" />
      </button>

      <button
        onClick={() => alignSelectedText("center")}
        className="p-2 rounded-md text-gray-700 hover:bg-gray-200 active:bg-gray-300"
      >
        <BiAlignMiddle className="text-xl" />
      </button>

      <button
        onClick={() => alignSelectedText("right")}
        className="p-2 rounded-md text-gray-700 hover:bg-gray-200 active:bg-gray-300"
      >
        <BiAlignRight className="text-xl" />
      </button>
    </div>
  );
};

export default Toolbar;
