import React, { useRef, useCallback, useEffect, useState } from "react";
import { NoteImage } from "./ImageUploader";
import { getImageUrl } from "@/service/NoteService";
import { createImageWithToolbar, handleToolbar } from "./HandleToolbar";

interface EditableDivProps {
  handleSlashCommand: () => void;
  images: NoteImage[];
}

const EditableDiv: React.FC<EditableDivProps> = React.memo(
  ({ handleSlashCommand, images }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState<string>(""); 
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    // Xử lý nhập văn bản
    const handleInput = useCallback(() => {
      if (contentRef.current) {
        setContent(contentRef.current.innerHTML);
      }
    }, []);

    // Xử lý khi nhấn phím "/"
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "/") {
          event.preventDefault();
          handleSlashCommand();
        }
      },
      [handleSlashCommand]
    );

    // Load ảnh từ danh sách images
    useEffect(() => {
      const fetchImages = async () => {
        try {
          const urls = await Promise.all(
            images.map(async (image) => await getImageUrl(image.imageUrl))
          );
          setImageUrls((prevUrls) =>
            JSON.stringify(prevUrls) === JSON.stringify(urls) ? prevUrls : urls
          );
        } catch (error) {
          console.error("Failed to load images:", error);
        }
      };

      if (images.length > 0) {
        fetchImages();
      }
    }, [images]);

    // Xử lý sự kiện paste (dán nội dung vào)
    useEffect(() => {
      const handlePaste = (e: ClipboardEvent) => {
        if (contentRef.current) {
          handleToolbar(
            e as unknown as React.ClipboardEvent<HTMLDivElement>,
            contentRef.current
          );
        }
      };

      document.addEventListener("paste", handlePaste as EventListener);
      return () => {
        document.removeEventListener("paste", handlePaste as EventListener);
      };
    }, []);

    // Thêm ảnh vào nội dung
    useEffect(() => {
      if (contentRef.current && imageUrls.length > 0) {
        imageUrls.forEach((url) => {
          if (contentRef.current) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              const img = document.createElement("img");
              img.src = url;
              img.alt = "image";
              img.style.maxWidth = "100%"; // Optional: style for image

              // Chèn ảnh vào vị trí con trỏ hiện tại
              range.deleteContents();
              range.insertNode(img);

              // Đặt con trỏ sau ảnh
              const br = document.createElement("br");
              range.insertNode(br);
              range.setStartAfter(br);
              range.setEndAfter(br);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }
        });
      }
    }, [imageUrls]);

    // Xử lý sự kiện Enter để xuống dòng dưới ảnh
    const handleKeyDownEnter = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" && contentRef.current) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const br = document.createElement("br");
            range.insertNode(br);
            range.setStartAfter(br);
            range.setEndAfter(br);
            selection.removeAllRanges();
            selection.addRange(range);
            event.preventDefault(); // Ngăn ngừa hành vi mặc định
          }
        }
      },
      []
    );

    return (
      <div
        ref={contentRef}
        contentEditable={true}
        tabIndex={0}
        className="p-4 rounded-md min-h-[100px] focus:outline-none"
        onInput={handleInput} // Cập nhật nội dung khi nhập
        onKeyDown={(event) => {
          handleKeyDown(event);
          handleKeyDownEnter(event); // Xử lý Enter để xuống dòng dưới ảnh
        }}
      />
    );
  }
);

export default EditableDiv;
