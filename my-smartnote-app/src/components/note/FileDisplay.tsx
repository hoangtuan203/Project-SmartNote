// FileDisplay.tsx
import { deleteFile } from "@/service/FileService";

interface FileDisplayProps {
  fileUrls: string[];
  fileNameView: string[];
  fileIds: number[];
  commentId: number;
  setFilesToDisplay: React.Dispatch<
    React.SetStateAction<{
      [commentId: number]: {
        urls: string[];
        names: string[];
        ids: number[];
      };
    }>
  >;
}

const FileDisplay = ({
  fileUrls,
  fileNameView,
  fileIds,
  commentId,
  setFilesToDisplay,
}: FileDisplayProps) => {
  const handleDeleteFile = async (index: number, fileId: number) => {
    try {
      const isDeleted = await deleteFile(fileId); // Call the deleteFile service
      if (isDeleted) {
        console.log("File deleted successfully!");
        setFilesToDisplay((prev) => {
          const prevFiles = prev[commentId];
          if (!prevFiles) return prev;

          const updatedFiles = {
            urls: prevFiles.urls.filter((_, i) => i !== index),
            names: prevFiles.names.filter((_, i) => i !== index),
            ids: prevFiles.ids.filter((_, i) => i !== index),
          };

          return {
            ...prev,
            [commentId]: updatedFiles,
          };
        });
      } else {
        console.log("File deletion failed.");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  if (!fileUrls || fileUrls.length === 0) return null;

  return (
    <div className="mt-2 ">
      {fileUrls.map((fileUrl, index) => {
        const fileName = fileNameView[index] || "Unknown File";
        const fileId = fileIds[index];
        const fileNameSplit = fileUrl.split("/").pop() || "Unknown File";
        const openLink = `http://localhost:8080/api/files/view/${fileNameSplit}`;

        return (
          <div
            key={fileId} // Use fileId as the key for uniqueness
            className="file-display inline-flex items-center ml-4 p-2 my-1 bg-gray-100 rounded-md"
            contentEditable={false}
            draggable={false}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m-9-3v12a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M5 5h2"
                />
              </svg>
            </span>
            <a
              href={openLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:underline cursor-pointer"
            >
              {fileName}
            </a>
          <span
              className="remove-file-btn text-red-600 ml-2 cursor-pointer hover:opacity-100 opacity-0 transition-opacity"
              style={{ fontSize: "16px", fontWeight: "bold" }}
              onClick={() => handleDeleteFile(index, fileId)}
            >
              ×
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default FileDisplay;