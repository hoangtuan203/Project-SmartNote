import React, { useRef, useEffect, useState } from "react";
import { handleToolbar, createImageWithToolbar } from "./HandleToolbar";
import { getImageUrl } from "@/service/NoteService";

export interface NoteImage {
  imageId: number;
  imageUrl: string;
  noteId: number;
}

interface ImageUploaderProps {
  images: NoteImage[];
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const urls = await Promise.all(
          images.map(async (image) => await getImageUrl(image.imageUrl))
        );
        setImageUrls(urls);
      } catch (error) {
        console.error("Failed to load images:", error);
      }
    };

    if (images.length > 0) {
      fetchImages();
    }
  }, [images]);

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

  useEffect(() => {
    if (contentRef.current && imageUrls.length > 0) {
      imageUrls.forEach((url) => {
        if (contentRef.current) {
          createImageWithToolbar(url, contentRef.current);
        }
      });
    }
  }, [imageUrls]);

  return (
    <div
      ref={contentRef}
      className="border p-4 min-h-[200px] rounded-md bg-gray-100"
      contentEditable={true}
    >
      Paste an image here or view loaded images...
    </div>
  );
};

export default ImageUploader;
