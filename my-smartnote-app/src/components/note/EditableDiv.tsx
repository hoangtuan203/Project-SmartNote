import React, { useRef, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import {
  getNoteById,
  NoteRequest,
  saveNote,
  updateNote,
} from "@/service/NoteService";
import { createImageWithToolbar } from "./HandleToolbar";
import Toolbar from "./ToolbarEditor";
import { debounce } from "lodash";
import { getNoteImages } from "@/service/NoteImageService";
import {
  deleteFile,
  getNoteFile,
  NoteFile,
  uploadFile,
} from "@/service/FileService";
import { Button } from "../ui/button";
import { Image, MessageCircle, Plus, Upload, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { NoteImage } from "./ImageUploader";
import { CommentNote } from "./CommentNote";
import { AiService } from "@/service/AIService";

interface EditableDivProps {
  handleSlashCommand: () => void;
  content: string; // Thêm prop content
  noteId?: number | null; // Thêm prop noteId
}

const EditableDiv: React.FC<EditableDivProps> = React.memo(
  ({ content, noteId }) => {
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [toolbarVisible, setToolbarVisible] = useState(false);
    const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
    const [selectedFormat, setSelectedFormat] = useState("p");

    const [noteContent, setNoteContent] = useState("");
    const [suggestedText, setSuggestedText] = useState("");
    const [noteImages, setNoteImages] = useState<string[]>([]);
    const userId = localStorage.getItem("userId") || "unknown";

    const [currentTitle, setCurrentTitle] = useState("New Page");
    const [initialLoad, setInitialLoad] = useState(true);
    const [imageId, setImageId] = useState<number[]>([]);
    const [fileId, setFileId] = useState<number[]>([]);


    const [caretPosition, setCaretPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    const previousValues = useRef({
      title: currentTitle,
      content: noteContent,
    });

    const [isHovered, setIsHovered] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [coverImage, setCoverImage] = useState("");
    const [icon, setIcon] = useState("");
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    //file uploads
    const fileUploadRef = useRef<HTMLInputElement>(null);
    const [fileUrls, setFileUrls] = useState<string[]>([]); // State cho fileUrls
    const [noteFiles, setNoteFiles] = useState<string[]>([]); // State cho noteFiles

    //speech text
    const [isListening, setIsListening] = useState(false);

    const insertTextAtCursor = (text: string) => {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));

      // Di chuyển con trỏ đến sau đoạn text vừa chèn
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    };

    const startListening = () => {
      const SpeechRecognitionConstructor =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionConstructor) {
        console.error("SpeechRecognition is not supported in this browser.");
        return;
      }

      const recognition = new SpeechRecognitionConstructor();
      recognition.lang = "vi-VN"; // hoặc 'en-US' tùy ngôn ngữ
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        insertTextAtCursor(` ${transcript}`);
      };

      recognition.onend = () => setIsListening(false);

      recognition.start();
      setIsListening(true);
    };
    const stopListening = () => {
      setIsListening(false);
      // Nếu dùng API cần lưu `recognition` lại thì mới stop được
    };

    const formatFileSize = (size: number) => {
      if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)}KB`;
      }
      return `${(size / (1024 * 1024)).toFixed(1)}MB`;
    };
    //comments
    const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);

    const insertFileIntoContent = (
      fileName: string,
      fileUrl: string,
      fileSize: number,
      fileId: number
    ) => {
      if (!contentRef.current) return;

      const fileDisplay = document.createElement("div");
      fileDisplay.setAttribute("contenteditable", "false");
      fileDisplay.className =
        "file-display inline-flex items-center p-2 my-1 bg-gray-100 rounded-md";
      fileDisplay.setAttribute("draggable", "false");

      const icon = document.createElement("span");
      icon.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m-9-3v12a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M5 5h2" /></svg>';

      const fileInfo = document.createElement("span");
      fileInfo.className = "text-gray-700 text-sm";
      fileInfo.textContent = `${fileName} ${formatFileSize(fileSize)}`;

      const fileNameSplit = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
      const openLink = `http://localhost:8080/api/files/view/${fileNameSplit}`;
      const fileLink = document.createElement("a");
      fileLink.href = fileUrl;
      fileLink.target = "_blank";
      fileLink.rel = "noopener noreferrer";
      fileLink.style.cursor = "pointer";
      fileLink.addEventListener("click", (e) => {
        e.preventDefault();
        window.open(openLink, "_blank");
      });

      const removeButton = document.createElement("span");
      removeButton.className =
        "remove-file-btn text-red-600 ml-2 cursor-pointer opacity-0 hover:opacity-100";
      removeButton.textContent = "×";
      removeButton.style.fontSize = "16px";
      removeButton.style.fontWeight = "bold";
      removeButton.addEventListener("click", async (e) => {
        e.stopPropagation(); // Ngăn sự kiện click lan truyền lên fileLink
        try {
          const isDeleted = await deleteFile(fileId); // Sử dụng fileId từ tham số
          if (isDeleted) {
            console.log("File deleted successfully!");
            fileDisplay.remove();
          } else {
            console.log("File deletion failed.");
          }
        } catch (error) {
          console.error("Error deleting file:", error);
        }
      });

      fileDisplay.addEventListener("mouseenter", () => {
        removeButton.style.opacity = "1";
      });
      fileDisplay.addEventListener("mouseleave", () => {
        removeButton.style.opacity = "0";
      });

      fileDisplay.appendChild(icon);
      fileDisplay.appendChild(fileInfo);
      fileDisplay.appendChild(removeButton);
      fileLink.appendChild(fileDisplay);

      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.insertNode(fileLink);
        range.insertNode(document.createElement("br"));

        range.setStartAfter(fileLink.nextSibling!);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        contentRef.current.appendChild(fileLink);
        contentRef.current.appendChild(document.createElement("br"));
      }
    };

    const displayFilesInContent = (
      fileUrls: string[],
      fileNameView: string[],
      fileIds: number[] // Thêm tham số fileIds
    ) => {
      if (!contentRef.current) return;
      fileUrls.forEach((fileUrl, index) => {
        const fileName = fileNameView[index] || "Unknown File";
        const fileId = fileIds[index]; // Lấy fileId tương ứng

        const fileDisplay = document.createElement("div");
        fileDisplay.setAttribute("contenteditable", "false");
        fileDisplay.className =
          "file-display inline-flex items-center p-2 my-1 bg-gray-100 rounded-md";
        fileDisplay.setAttribute("draggable", "false");

        const icon = document.createElement("span");
        icon.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m-9-3v12a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M5 5h2" /></svg>';

        const fileNameSplit = fileUrl.split("/").pop() || "Unknown File";
        const openLink = `http://localhost:8080/api/files/view/${fileNameSplit}`;

        const fileLink = document.createElement("a");
        fileLink.href = openLink;
        fileLink.target = "_blank";
        fileLink.rel = "noopener noreferrer";
        fileLink.style.cursor = "pointer";
        fileLink.textContent = fileName;

        // Thêm nút xóa
        const removeButton = document.createElement("span");
        removeButton.className =
          "remove-file-btn text-red-600 ml-2 cursor-pointer opacity-0 hover:opacity-100";
        removeButton.textContent = "×";
        removeButton.style.fontSize = "16px";
        removeButton.style.fontWeight = "bold";
        removeButton.addEventListener("click", async (e) => {
          e.preventDefault(); // Ngăn hành vi mặc định của liên kết (nếu có)
          try {
            const isDeleted = await deleteFile(fileId); // Gọi API xóa file với fileId
            if (isDeleted) {
              console.log("File deleted successfully!");
              fileDisplay.remove(); // Xóa fileDisplay khỏi giao diện
            } else {
              console.log("File deletion failed.");
            }
          } catch (error) {
            console.error("Error deleting file:", error);
          }
        });

        // Thêm hiệu ứng hover
        fileDisplay.addEventListener("mouseenter", () => {
          removeButton.style.opacity = "1";
        });
        fileDisplay.addEventListener("mouseleave", () => {
          removeButton.style.opacity = "0";
        });

        // Gắn các phần tử vào fileDisplay
        fileDisplay.appendChild(icon);
        fileDisplay.appendChild(fileLink);
        fileDisplay.appendChild(removeButton);

        if (contentRef.current) {
          contentRef.current.appendChild(fileDisplay);
          contentRef.current.appendChild(document.createElement("br"));
        }
      });

      // Thêm sự kiện keydown để xử lý Backspace
      if (contentRef.current) {
        contentRef.current.addEventListener("keydown", handleKeyDown);
      }
    };
    // Lấy dữ liệu note và hiển thị các file đã có
    const handleCommentSubmit = (content: string) => {
      console.log("New comment submitted:", content);
      // Xử lý lưu comment nếu cần (ví dụ: gọi API)
    };
    // Xử lý upload file mới
    const handleFileUpload = async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file = event.target.files?.[0];
      if (file) {
        try {
          const convertUserIdNumber = Number(localStorage.getItem("userId"));
          const response = await uploadFile(
            file,
            noteId as number,
            convertUserIdNumber,
            null
          );

          // Cập nhật state fileUrls
          setFileUrls((prev) => [...prev, response.fileUrl]);
          setNoteFiles((prev) => [...prev, response.fileUrl]);

          // Chèn file mới vào contentEditable div tại vị trí con trỏ
          insertFileIntoContent(
            response.fileName,
            response.fileUrl,
            file.size,
            response.fileId
          );

          console.log("File uploaded successfully:", response);
        } catch (error) {
          console.error("Error uploading file:", error);
          alert("Failed to upload file");
        }
      }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCurrentTitle(e.target.value);
    };

    // Hàm xử lý Backspace (giữ nguyên từ trước)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Backspace" && contentRef.current) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);

        const previousNode = range.startContainer.previousSibling;
        if (
          range.startOffset === 0 &&
          previousNode &&
          previousNode.nodeName === "DIV" &&
          (previousNode as HTMLElement).classList.contains("file-display")
        ) {
          event.preventDefault();
          const newRange = document.createRange();
          newRange.setStartBefore(previousNode);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }

        const currentNode = range.startContainer;
        const nextNode = range.startContainer.nextSibling;
        if (
          range.startOffset === 0 &&
          currentNode.nodeType === Node.TEXT_NODE &&
          currentNode.textContent?.length === 0 &&
          nextNode &&
          nextNode.nodeName === "DIV" &&
          (nextNode as HTMLElement).classList.contains("file-display")
        ) {
          event.preventDefault();
        }
      }
    };

    useEffect(() => {
      if (noteId !== null && noteId !== undefined && noteId > 0) {
        const getNoteData = async () => {
          try {
            const response = await getNoteById(noteId as number);
            if (response && response.result) {
              const note = response.result;

              setNoteContent(note.content || "");
              setCurrentTitle(note.title || "");

              const imagesData = await getNoteImages(noteId as number);
              const fetchImageId = imagesData
                ? imagesData.map((image: NoteImage) => image.imageId)
                : [];

              setImageId(fetchImageId);

              const fetchedImageUrls = imagesData
                ? imagesData.map((image: NoteImage) => image.imageUrl)
                : [];

              setImageUrls(fetchedImageUrls);
              setNoteImages(fetchedImageUrls);

              const filesData = await getNoteFile(
                noteId as number,
                null,
                "NOTE"
              );
              const fetchedFileUrls = filesData
                ? filesData.map((file: NoteFile) => file.fileUrl)
                : [];
              const fetchFilesName = filesData
                ? filesData.map((file: NoteFile) => file.fileName)
                : [];

              const fetchFileId = filesData
                ? filesData.map((file: NoteFile) => file.fileId)
                : [];

              setFileId(fetchFileId);
              if (contentRef.current) {
                const content = note.content || "";
                contentRef.current.innerHTML = content;
                displayFilesInContent(
                  fetchedFileUrls,
                  fetchFilesName,
                  fetchFileId
                );
              }
            }
          } catch (error) {
            console.error("Lỗi khi lấy dữ liệu ghi chú:", error);
          } finally {
            setInitialLoad(false);
          }
        };
        getNoteData();
      }
    }, []);

    useEffect(() => {
      const timeout = setTimeout(async () => {
        const text = contentRef.current?.innerText.trim() || "";
        if (text) {
          try {
            const suggestions = await AiService.suggest(text);
            if (suggestions.length > 0) {
              setSuggestedText(suggestions[0]);
            } else {
              setSuggestedText("");
            }
          } catch (error) {
            console.error("Error fetching suggestions", error);
            setSuggestedText("");
          }
        } else {
          setSuggestedText("");
        }
      }, 800); // Debounce 800ms

      return () => clearTimeout(timeout);
    }, [noteContent]);

    useEffect(() => {
      if (contentRef.current && initialLoad) {
        contentRef.current.innerHTML = content;
      }
    }, [content, initialLoad]);

    const handleInput = () => {
      if (contentRef.current) {
        // 1. Xóa file-display
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = contentRef.current.innerHTML;
        const fileDisplays = tempDiv.getElementsByClassName("file-display");
        while (fileDisplays.length > 0) {
          fileDisplays[0].parentNode?.removeChild(fileDisplays[0]);
        }
    
        // 2. Lấy text hiện đang gõ
        const selection = window.getSelection();
        if (selection && selection.focusNode) {
          if (selection.focusNode.nodeType === Node.TEXT_NODE) {
            const text = selection.focusNode.textContent?.trim() || "";
            setNoteContent(text);
          } else {
            const filteredText = tempDiv.textContent?.trim() || "";
            setNoteContent(filteredText);
          }
        }
    
        // 3. Lấy vị trí con trỏ (caret)
        const range = selection?.getRangeAt(0);
        if (range) {
          const rect = range.getBoundingClientRect();
          setCaretPosition({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
          });
        }
      }
    };
    

    const handleFormatChange = (format: string) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        console.log("No selection found");
        setSelectedFormat(format);
        return;
      }

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
            const liBullet = document.createElement("li");
            liBullet.appendChild(lines[0] || document.createTextNode(" "));
            newElement.appendChild(liBullet);
          } else if (lines.length >= 2) {
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
              nestedUl.style.listStyleType = "circle";
              const liLevel2 = document.createElement("li");
              liLevel2.textContent = secondLineText.trim();
              nestedUl.appendChild(liLevel2);

              liLevel1.appendChild(nestedUl);
              newElement.appendChild(liLevel1);

              for (let i = 2; i < lines.length; i++) {
                const additionalLi = document.createElement("li");
                additionalLi.appendChild(
                  lines[i] || document.createTextNode(" ")
                );
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
              lines.forEach((line) => {
                const liNumber = document.createElement("li");
                liNumber.appendChild(line || document.createTextNode(" "));
                newElement.appendChild(liNumber);
              });
            } else {
              const liLevel1 = document.createElement("li");
              liLevel1.appendChild(lines[0] || document.createTextNode(" "));

              const nestedOl = document.createElement("ol");
              nestedOl.style.listStyleType = "lower-alpha";
              const liLevel2 = document.createElement("li");
              liLevel2.textContent = secondLineText.trim();
              nestedOl.appendChild(liLevel2);

              liLevel1.appendChild(nestedOl);
              newElement.appendChild(liLevel1);

              for (let i = 2; i < lines.length; i++) {
                const additionalLi = document.createElement("li");
                additionalLi.appendChild(
                  lines[i] || document.createTextNode(" ")
                );
                newElement.appendChild(additionalLi);
              }
            }
          }
          break;
        }

        default:
          newElement = document.createElement("p");
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

      setSelectedFormat(format);
      setToolbarVisible(false);
      console.log(
        "Applied format:",
        format,
        "New element:",
        newElement.outerHTML
      );
    };

    // Hàm hỗ trợ tách nội dung thành các dòng
    const splitContentIntoLines = (
      content: DocumentFragment
    ): (DocumentFragment | Text)[] => {
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
        x: rect.x + window.scrollX + rect.width / 2 - 50, // Căn giữa toolbar
        y: rect.y + window.scrollY - 120, // Hiển thị phía trên vùng chọn
      });

      setToolbarVisible(true);
    };

    useEffect(() => {
      document.addEventListener("mouseup", handleSelection);
      return () => {
        document.removeEventListener("mouseup", handleSelection);
      };
    }, []);

    // Hàm xử lý dán ảnh
    const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
      if (!contentRef.current) return;

      event.preventDefault();

      const items = event.clipboardData.items;
      let isImageProcessed = false;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          isImageProcessed = true;
          const file = items[i].getAsFile();
          if (file) {
            const fileName = file.name;

            const reader = new FileReader();
            reader.onload = (e) => {
              if (!e.target?.result || !contentRef.current) return;

              const imageUrl = e.target.result as string;

              // Cập nhật state trước
              setNoteImages((prev) => {
                const newImages = [...prev, imageUrl];
                return newImages;
              });

              // Chèn ảnh vào DOM
              const imageId = noteImages.length + 1; // Dựa trên state hiện tại
              const imageElement = createImageWithToolbar(
                imageUrl,
                document.createElement("div"),
                imageId,
                fileName || `image-${imageId}`
              );

              imageElement.style.cursor = "pointer";
              imageElement.style.userSelect = "auto";
              imageElement.addEventListener("click", () => {
                window.open(imageUrl, "_blank");
              });

              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.insertNode(imageElement);

                const spacer = document.createElement("div");
                spacer.setAttribute("contenteditable", "true");
                spacer.style.minHeight = "20px";
                range.insertNode(spacer);

                range.setStartAfter(spacer);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
              } else {
                contentRef.current.appendChild(imageElement);
                const spacer = document.createElement("div");
                spacer.setAttribute("contenteditable", "true");
                spacer.style.minHeight = "20px";
                contentRef.current.appendChild(spacer);
              }

              autoSave(true, imageUrl, fileName);
            };
            reader.readAsDataURL(file);
          }
        }
      }

      if (!isImageProcessed) {
        const pastedData = event.clipboardData.getData("text");
        const processedContent = handlePasteLink(pastedData);
        if (processedContent === pastedData) {
          document.execCommand("insertText", false, pastedData);
          if (contentRef.current) {
            setNoteContent(contentRef.current.innerHTML);
          }
        }
      }
    };
    // Hàm autoSave
    const autoSave = debounce(
      async (isImage = false, newImageUrl = "", fileName = "") => {
        try {
          if (typeof noteId !== "number" || noteId < 0) return;

          let updatedImageUrls: string[] = [];

          if (!isImage) {
            const imagesData = await getNoteImages(noteId);
            updatedImageUrls = imagesData
              ? imagesData.map((image) => image.imageUrl)
              : [];
          } else {
            updatedImageUrls = [...noteImages];
          }

          let files: File[] = [];

          if (isImage && newImageUrl) {
            const imagesData = await getNoteImages(noteId);
            const dbImageUrls = imagesData
              ? imagesData.map((image) => image.imageUrl)
              : [];

            const isImageExistInDb = dbImageUrls.some(
              (url) =>
                url === newImageUrl || (fileName && url.includes(fileName))
            );

            if (!isImageExistInDb) {
              updatedImageUrls = [...noteImages];
              files = await Promise.all(
                [newImageUrl].map(async (url) => {
                  const response = await fetch(url);
                  const blob = await response.blob();
                  const filename =
                    fileName || url.split("/").pop() || "image.jpg";
                  return new File([blob], filename, { type: blob.type });
                })
              );

              // Sau khi lưu thành công, cập nhật noteImages với URL từ server
              const noteData: Partial<NoteRequest> = {
                title: currentTitle,
                content: noteContent,
                userId: Number(userId),
                color: "#ffffff",
                imageUrls: updatedImageUrls,
                updatedAt: new Date().toISOString().replace("Z", ""),
              };

              console.log("content data :", imageUrls);

              const response = await updateNote(noteId, noteData, files);

              if (response && response.imageUrls) {
                setNoteImages(response.imageUrls); // Cập nhật với URL từ server
              }
            } else {
              return;
            }
          }
          console.log(noteId);

          const noteData: Partial<NoteRequest> = {
            title: currentTitle,
            content: noteContent,
            userId: Number(userId),
            color: "#ffffff",
            updatedAt: new Date().toISOString().replace("Z", ""),
          };

          console.log("note id props :", noteId);
          if (!isImage) {
            noteData.imageUrls = noteImages;
          } else {
            noteData.imageUrls = updatedImageUrls;
          }

          if (noteId == null) {
            console.log("note id save :", noteId);
            noteData.imageUrls = updatedImageUrls;
            const newNote = await saveNote(noteData as NoteRequest);
            noteId = newNote.noteId;
            console.log("Save note success");
            localStorage.setItem("noteId", noteId.toString());
          } else {
            await updateNote(noteId, noteData, files.length > 0 ? files : []);
          }
        } catch (error) {
          console.error("Tự động lưu thất bại:", error);
        }
      },
      2000
    );

    useEffect(() => {
      if (initialLoad) return;

      if (
        currentTitle !== previousValues.current.title ||
        noteContent !== previousValues.current.content
      ) {
        autoSave(false);
        previousValues.current = { title: currentTitle, content: noteContent };
      }

      return () => {
        autoSave.cancel();
      };
    }, [currentTitle, noteContent]);

    // Hàm autoSave (giả định đã có)

    useEffect(() => {
      if (!imageContainerRef.current || !imageUrls.length) return;

      // Xóa nội dung cũ trước khi render ảnh mới
      imageContainerRef.current.innerHTML = "";

      for (let i = imageUrls.length - 1; i >= 0; i--) {
        const url = imageUrls[i];
        const filename = url.split("/").pop();
        const fullUrl = `http://localhost:8080/api/images/${filename}`;
        const currentImageId = imageId[i];

        const imageElement = createImageWithToolbar(
          fullUrl,
          document.createElement("div"),
          currentImageId,
          filename || `image-${i}`
        );

        imageElement.style.cursor = "pointer";
        imageElement.style.userSelect = "auto";
        imageElement.addEventListener("click", () => {
          window.open(fullUrl, "_blank");
        });

        if (imageContainerRef.current) {
          imageContainerRef.current.appendChild(imageElement);

          const spacer = document.createElement("div");
          spacer.style.height = "40px";
          spacer.style.cursor = "pointer";
          spacer.style.userSelect = "none";

          imageContainerRef.current.appendChild(spacer);
        }
      }
    }, [imageUrls]);

    //handle paste link
    const handlePasteLink = (pastedData: string): string => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = pastedData.match(urlRegex);

      if (urls && urls.length > 0) {
        let content = pastedData;
        urls.forEach((url) => {
          const link = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline cursor-pointer" onclick="window.open('${url}', '_blank'); return false;">${url}</a>`;
          content = content.replace(url, link);
        });

        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();

          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = content;
          while (tempDiv.firstChild) {
            range.insertNode(tempDiv.firstChild);
          }
        } else {
          if (contentRef.current) {
            contentRef.current.innerHTML += content;
          }
        }
        return content;
      }
      return pastedData;
    };

    return (
      <div className="relative">
        <div className="relative mx-auto mw-auto">
          <Toolbar
            visible={toolbarVisible}
            position={toolbarPosition}
            onSelectTextFormat={handleFormatChange}
          />
          {coverImage && (
            <div className="relative mb-4">
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-60 object-cover rounded-md"
              />
              <Button
                variant="ghost"
                className="absolute top-2 right-2 bg-white rounded-full p-1"
                onClick={() => setCoverImage("")}
              >
                <X size={20} />
              </Button>
            </div>
          )}

          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute z-10 bg-white border rounded-md shadow-lg p-2"
            >
              <EmojiPicker
                onEmojiClick={(emoji) => {
                  setIcon(emoji.emoji);
                  setShowEmojiPicker(false);
                }}
              />
            </div>
          )}

          <div className="mx-auto mr-[40px] w-full max-w-[1000px]">
            <div
              className="relative w-full"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div
                className={`flex gap-3 mt-3 text-gray-500 transition-opacity duration-200 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <Button
                  variant="ghost"
                  className="flex items-center gap-1"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Image size={16} /> Add icon
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus size={16} /> Add cover
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  // onChange={handleImageUpload}
                />
                <Button
                  variant="ghost"
                  className="flex items-center gap-1"
                  onClick={() => setIsCommentBoxVisible((prev) => !prev)}
                >
                  <MessageCircle size={16} /> Comment
                </Button>

                <Button
                  variant="ghost"
                  className="flex items-center gap-1"
                  onClick={() => fileUploadRef.current?.click()}
                >
                  <Upload size={16} /> Upload file
                </Button>
                <input
                  type="file"
                  className="hidden"
                  ref={fileUploadRef}
                  onChange={handleFileUpload} // Bạn nhớ tạo hàm handleFileUpload
                />
              </div>
              {/* Title Input */}
              <TextareaAutosize
                className="w-full text-3xl font-bold border-none outline-none bg-transparent resize-none break-words text-left"
                value={currentTitle}
                onChange={handleTitleChange}
                minRows={1}
              />
              {isCommentBoxVisible && (
                <CommentNote
                  initialComments={[]}
                  onCommentSubmit={handleCommentSubmit}
                  noteId={noteId !== null ? String(noteId) : null}
                />
              )}
            </div>
          </div>
        </div>
        <div className="relative w-full max-w-[1000px] mx-auto">
          <div
            ref={contentRef}
            contentEditable={true}
            tabIndex={0}
            className="p-8 rounded-md min-h-[200px] focus:outline-none w-full"
            onPaste={handlePaste}
            onMouseUp={handleSelection}
            onInput={handleInput}
            
          />
          {suggestedText && suggestedText !== noteContent && (
            <div className="absolute top-0 left-0 p-8 rounded-md min-h-[200px] w-full pointer-events-none text-gray-400 whitespace-pre-wrap break-words z-0">
              {suggestedText}
            </div>
          )}
        </div>

        <div
          className="max-w-[1000px] w-full mx-auto mt-2"
          ref={imageContainerRef}
        />
        {/* ghi âm */}
        <button
          onClick={isListening ? stopListening : startListening}
          className="fixed bottom-6 right-6 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full shadow-md transition-all z-50"
          title={isListening ? "Dừng ghi âm" : "Bấm để nói"}
        >
          {isListening ? "🛑" : "🎙️"}
        </button>
      </div>
    );
  }
);

export default EditableDiv;
