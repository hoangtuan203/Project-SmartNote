import React, { useRef, useEffect, useState } from "react";
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
