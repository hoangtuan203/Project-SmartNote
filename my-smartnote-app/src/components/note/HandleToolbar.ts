import { deleteImage } from "@/service/NoteService";

export const handleToolbar = (
  e: React.ClipboardEvent<HTMLDivElement>,
  contentElement: HTMLDivElement,
  imageId : number
) => {
  const clipboardItems = e.clipboardData.items;
  for (let i = 0; i < clipboardItems.length; i++) {
    const item = clipboardItems[i];
    if (item.type.startsWith("image/")) {
      const file = item.getAsFile();
      if (file) {
        const reader = new FileReader();

        reader.onload = (event: ProgressEvent<FileReader>) => {
          if (event.target?.result && contentElement) {
            const imageUrl = event.target.result as string;
            createImageWithToolbar(imageUrl, contentElement, imageId);
          }
        };

        reader.readAsDataURL(file);
        e.preventDefault();
      }
    }
  }
};

// Hàm này cũng cần nhận HTMLDivElement thay vì RefObject
export const createImageWithToolbar = (
  imageUrl: string,
  contentElement: HTMLDivElement,
  imageId : number,
  fileName : string = "pasted-image.png"
): HTMLDivElement => {
  const imgWrapper = document.createElement("div");
  imgWrapper.className =
    "relative group flex items-start justify-left gap-2 mb-4 mt-4";
  imgWrapper.setAttribute("contentEditable", "false");

  const imgContainer = document.createElement("div");
  imgContainer.className = "relative rounded-lg overflow-hidden inline-block";

  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = "Pasted image";
  img.className =
    "max-w-full max-h-full object-contain rounded-lg cursor-pointer transition-transform duration-200";

  let scale = 1;
  let originalWidth = 0;
  let originalHeight = 0;

  img.onload = () => {
    originalWidth = img.offsetWidth;
    originalHeight = img.offsetHeight;
    imgContainer.style.width = `${originalWidth}px`;
    imgContainer.style.height = `${originalHeight}px`;
    img.style.width = `${originalWidth}px`;
    img.style.height = `${originalHeight}px`;
  };

  


  const resizeImage = (e: MouseEvent, direction: "left" | "right") => {
    e.preventDefault();

    const diffX = e.pageX - startX;
    let scaleChange = diffX / 500;

    if (direction === "left") {
      scaleChange = -scaleChange;
    }

    scale = Math.max(0.5, Math.min(scale + scaleChange, 2));

    const newWidth = originalWidth * scale;
    const newHeight = originalHeight * scale;

    img.style.width = `${Math.min(newWidth, imgContainer.offsetWidth)}px`;
    img.style.height = `${Math.min(newHeight, imgContainer.offsetHeight)}px`;

    imgContainer.style.width = `${newWidth}px`;
    imgContainer.style.height = `${newHeight}px`;

    leftHandle.style.height = `${newHeight}px`;
    rightHandle.style.height = `${newHeight}px`;


    startX = e.pageX;
  };

  let isResizing = false;
  let startX = 0;

  const startResizing = (e: MouseEvent, direction: "left" | "right") => {
    if (e.button !== 0) return;
    isResizing = true;
    startX = e.pageX;
    document.addEventListener("mousemove", (event: MouseEvent) => {
      if (isResizing) {
        resizeImage(event, direction);
      }
    });
    document.addEventListener("mouseup", stopResizing);
  };

  const stopResizing = () => {
    isResizing = false;
    document.removeEventListener("mousemove", (event: MouseEvent) => {
      if (isResizing) {
        resizeImage(event, "left");
      }
    });
    document.removeEventListener("mousemove", (event: MouseEvent) => {
      if (isResizing) {
        resizeImage(event, "right");
      }
    });
    document.removeEventListener("mouseup", stopResizing);
  };

  const leftHandle = document.createElement("div");
  leftHandle.className =
    "absolute left-0 top-0 h-full w-2 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-200 cursor-ew-resize";
  leftHandle.addEventListener("mousedown", (e) => startResizing(e, "left"));

  const rightHandle = document.createElement("div");
  rightHandle.className =
    "absolute right-0 top-0 h-full w-2 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-200 cursor-ew-resize";
  rightHandle.addEventListener("mousedown", (e) => startResizing(e, "right"));

  // Toolbar setup
  const toolbar = document.createElement("div");
  toolbar.className =
    "absolute top-2 right-2 flex flex-col gap-1 p-1 bg-white rounded-md shadow-md opacity-0 transition-opacity duration-200";

  imgWrapper.addEventListener("mouseenter", () => {
    toolbar.style.opacity = "1";
  });

  imgWrapper.addEventListener("mouseleave", () => {
    toolbar.style.opacity = "0";
  });



  // Delete button
  const deleteBtn = document.createElement("button");
  console.log("image Id delete : ", imageId)
  deleteBtn.className =
    "bg-gray-200 text-gray-600 rounded p-1 text-sm hover:bg-red-500 hover:text-white transition-all duration-200";
  deleteBtn.innerText = "X";
  
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Ngăn click lan ra ngoài
    deleteImage(imageId); // Gọi hàm xoá trong backend hoặc state
    imgWrapper.remove(); // Xoá ảnh ngay trên giao diện
  });
  

  // Download button
  const downloadBtn = document.createElement("button");
  downloadBtn.className =
    "bg-gray-200 text-gray-600 rounded p-1 text-sm hover:bg-blue-500 hover:text-white transition-all duration-200";
  downloadBtn.innerText = "⬇️";
  downloadBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Ngăn mở ảnh
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = fileName;
    link.click();
  });
  const expandBtn = document.createElement("button");
  expandBtn.className =
    "bg-gray-200 text-gray-600 rounded p-1 text-sm hover:bg-green-500 hover:text-white transition-all duration-200";
  expandBtn.innerText = "🔍";
  expandBtn.addEventListener("click", () => {
    const expandedOverlay = document.createElement("div");
    expandedOverlay.className =
      "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50";

    const expandedImg = document.createElement("img");
    expandedImg.src = imageUrl;
    expandedImg.alt = "Expanded image";
    expandedImg.className = "max-w-full max-h-full rounded-lg";

    expandedOverlay.appendChild(expandedImg);
    expandedOverlay.addEventListener("click", () => {
      expandedOverlay.remove();
    });

    document.body.appendChild(expandedOverlay);
  });

  toolbar.appendChild(deleteBtn);
  toolbar.appendChild(downloadBtn);
  toolbar.appendChild(expandBtn);

  imgContainer.appendChild(leftHandle);
  imgContainer.appendChild(img);
  imgContainer.appendChild(rightHandle);
  imgWrapper.appendChild(imgContainer);
  imgWrapper.appendChild(toolbar);

  contentElement.appendChild(imgWrapper);
  return imgWrapper;
};
