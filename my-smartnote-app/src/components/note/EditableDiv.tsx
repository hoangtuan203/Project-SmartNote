import React, { useRef, useCallback, useEffect, useState } from "react";
import { NoteImage } from "./ImageUploader";
import { getImageUrl } from "@/service/NoteService";
import { createImageWithToolbar, handleToolbar } from "./HandleToolbar";
import Toolbar from "./ToolbarEditor";

interface EditableDivProps {
  handleSlashCommand: () => void;
  images: NoteImage[];
}

const EditableDiv: React.FC<EditableDivProps> = React.memo(
  ({ handleSlashCommand, images }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [toolbarVisible, setToolbarVisible] = useState(false);
    const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
    const [selectedFormat, setSelectedFormat] = useState("p");

    // Hàm để nhận format từ `TextOptions`
    const handleFormatChange = (format: string) => {
      console.log("Applying format:", format);
      setSelectedFormat(format);
      applyFormat(format);
    };

    
    const applyFormat = (format: string) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        console.log("No selection found");
        return;
      }

      const range = selection.getRangeAt(0);
      const selectedText = range.extractContents();

      console.log("Selected text:", selectedText.textContent);

      let newElement;
      let listItem;
      let numberedItem;

      switch (format) {
        case "h1":
        case "h2":
        case "blockquote":
        case "p":
          newElement = document.createElement(format);
          break;
        case "bulleted":
          newElement = document.createElement("ul");
          listItem = document.createElement("li");
          listItem.appendChild(selectedText);
          newElement.appendChild(listItem);
          break;
        case "numbered":
          newElement = document.createElement("ol");
          numberedItem = document.createElement("li");
          numberedItem.appendChild(selectedText);
          newElement.appendChild(numberedItem);
          break;
        case "pre":
          newElement = document.createElement("pre");
          break;
        default:
          newElement = document.createElement("p");
      }

      newElement.appendChild(selectedText);
      range.deleteContents();
      range.insertNode(newElement);
      selection.removeAllRanges();
      selection.addRange(range);

      console.log("Inserted new element:", newElement.outerHTML);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();

        const selection = window.getSelection();
        if (!selection || !selection.rangeCount) return;

        const range = selection.getRangeAt(0);

        // Tạo phần tử tương ứng với format đã chọn
        const newElement = document.createElement(
          selectedFormat === "bulleted"
            ? "ul"
            : selectedFormat === "numbered"
            ? "ol"
            : selectedFormat === "blockquote"
            ? "blockquote"
            : selectedFormat
        );

        newElement.innerHTML = "<br>";

        range.insertNode(newElement);
        range.setStartAfter(newElement);
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);
      }
    };

    // Xử lý bôi đen văn bản -> Hiển thị toolbar
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        setToolbarVisible(false);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      if (rect.width === 0 && rect.height === 0) {
        setToolbarVisible(false);
        return;
      }

      setToolbarPosition({
        x: rect.x + window.scrollX + rect.width / 2, // Căn giữa theo chiều ngang
        y: rect.y + window.scrollY - 40, // Đẩy lên một chút
      });

      setToolbarVisible(true);
    };

    useEffect(() => {
      const editableDiv = contentRef.current;
      if (!editableDiv) return;

      editableDiv.addEventListener("mouseup", handleSelection);
      return () => {
        editableDiv.removeEventListener("mouseup", handleSelection);
      };
    }, []);

    useEffect(() => {
      document.addEventListener("mouseup", handleSelection);
      return () => {
        document.removeEventListener("mouseup", handleSelection);
      };
    }, []);

    //handle Paste
    const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
      if (!contentRef.current) return; // Kiểm tra contentRef trước khi dùng

      const items = event.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              if (!contentRef.current || !e.target?.result) return;

              const imageUrl = e.target.result as string;

              // Gọi createImageWithToolbar để dán ảnh có toolbar
              createImageWithToolbar(imageUrl, contentRef.current);

              // Tạo dòng mới sau ảnh
              const br = document.createElement("br");
              contentRef.current.appendChild(br);

              // Đặt con trỏ chuột xuống cuối ô nhập
              const range = document.createRange();
              const selection = window.getSelection();
              range.setStartAfter(br);
              range.collapse(true);
              selection?.removeAllRanges();
              selection?.addRange(range);
            };
            reader.readAsDataURL(file);
            event.preventDefault();
          }
        }
      }
    };

    useEffect(() => {
      const fetchImages = async () => {
        if (!contentRef.current) return;

        try {
          const urls = await Promise.all(
            images.map((image) => getImageUrl(image.imageUrl ?? ""))
          );

          urls.forEach((url) => {
            if (!contentRef.current) return;

            const imgElement = createImageWithToolbar(url, contentRef.current); // ✅ Nhận lại `imgWrapper`
            const br = document.createElement("br");
            contentRef.current.appendChild(br);
          });
        } catch (error) {
          console.error("Failed to load images:", error);
        }
      };

      if (images.length > 0) {
        fetchImages();
        console.log("Fetching images");
      }
    }, [images]);

    return (
      <div className="relative">
        {/* Ô nhập liệu (thu nhỏ width) */}
        <div className="relative max-w-[840px] w-full mx-auto">
          <Toolbar
            visible={toolbarVisible}
            position={toolbarPosition}
            onSelectTextFormat={handleFormatChange}
          />

          <div
            ref={contentRef}
            contentEditable={true}
            tabIndex={0}
            className="p-4 rounded-md min-h-[100px] focus:outline-none w-full relative"
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            onMouseUp={handleSelection} // Khi thả chuột, tính toán vị trí toolbar
          ></div>
        </div>

        {/* Hiển thị ảnh đã tải lên */}
        <div className="max-w-[1000px] w-full mx-auto mt-2">
          {imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt="Uploaded"
              className="w-full my-2 rounded-md"
            />
          ))}
        </div>
      </div>
    );
  }
);

export default EditableDiv;
