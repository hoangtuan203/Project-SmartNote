export const handleToolbar = (
  e: React.ClipboardEvent<HTMLDivElement>,
  contentElement: HTMLDivElement
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
            createImageWithToolbar(imageUrl, contentElement);
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
  contentElement: HTMLDivElement
): HTMLDivElement => {
  const imgWrapper = document.createElement("div");
  imgWrapper.className = "relative group flex items-start justify-left gap-2 mb-4 mt-4";
  imgWrapper.setAttribute("contentEditable", "false");

  const imgContainer = document.createElement("div");
  imgContainer.className = "relative rounded-lg overflow-hidden inline-block";

  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = "Pasted image";
  img.className =
    "max-w-full max-h-full object-contain rounded-lg cursor-pointer transition-transform duration-200";

  let scale = 1; // Default scale
  let originalWidth = 0; // Store the original width of the image
  let originalHeight = 0; // Store the original height of the image

  // Wait for the image to load to get its original dimensions
  img.onload = () => {
    originalWidth = img.offsetWidth;
    originalHeight = img.offsetHeight;
    imgContainer.style.width = `${originalWidth}px`;
    imgContainer.style.height = `${originalHeight}px`;
    img.style.width = `${originalWidth}px`; // Ensure the image starts with the correct dimensions
    img.style.height = `${originalHeight}px`;
  };

  // Function to handle image resizing when dragging left or right
  let currentWidth = originalWidth; // Giá trị ban đầu khi load ảnh
  let currentHeight = originalHeight; // Giá trị ban đầu khi load ảnh

  const resizeImage = (e: MouseEvent, direction: "left" | "right") => {
    e.preventDefault();

    const diffX = e.pageX - startX;
    let scaleChange = diffX / 500; // Điều chỉnh độ nhạy của việc phóng to/thu nhỏ

    if (direction === "left") {
      scaleChange = -scaleChange; // Đảo chiều nếu kéo sang trái
    }

    scale = Math.max(0.5, Math.min(scale + scaleChange, 2)); // Giới hạn tỉ lệ tối thiểu 0.5 và tối đa 2

    // Tính toán chiều rộng và chiều cao mới
    const newWidth = originalWidth * scale;
    const newHeight = originalHeight * scale;

    // Cập nhật chiều rộng và chiều cao của ảnh và container
    img.style.width = `${Math.min(newWidth, imgContainer.offsetWidth)}px`;
    img.style.height = `${Math.min(newHeight, imgContainer.offsetHeight)}px`;

    imgContainer.style.width = `${newWidth}px`; // Cập nhật chiều rộng của container
    imgContainer.style.height = `${newHeight}px`; // Cập nhật chiều cao của container

    // Cập nhật kích thước của các handle resize
    leftHandle.style.height = `${newHeight}px`;
    rightHandle.style.height = `${newHeight}px`;

    // Lưu kích thước hiện tại sau khi thay đổi
    currentWidth = img.offsetWidth;
    currentHeight = img.offsetHeight;
    console.log("Current Image Width:", currentWidth);
    console.log("Current Image Height:", currentHeight);
    startX = e.pageX;
  };

  let isResizing = false;
  let startX = 0;

  const startResizing = (e: MouseEvent, direction: "left" | "right") => {
    // Only allow resizing if the event is triggered by a mouse click (not touch or other events)
    if (e.button !== 0) return; // Ensure it's a left mouse click
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

  // Add resize handles on both sides of the image
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

  const deleteBtn = document.createElement("button");
  deleteBtn.className =
    "bg-gray-200 text-gray-600 rounded p-1 text-sm hover:bg-red-500 hover:text-white transition-all duration-200";
  deleteBtn.innerText = "X";
  deleteBtn.addEventListener("click", () => {
    imgWrapper.remove();
  });

  const downloadBtn = document.createElement("button");
  downloadBtn.className =
    "bg-gray-200 text-gray-600 rounded p-1 text-sm hover:bg-blue-500 hover:text-white transition-all duration-200";
  downloadBtn.innerText = "⬇️";
  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "pasted-image.png";
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
