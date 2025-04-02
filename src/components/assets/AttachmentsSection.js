"use client";
import {
  FaUpload,
  FaTrash,
  FaFile,
  FaFileImage,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
} from "react-icons/fa";

const AttachmentsSection = ({
  attachments,
  handleFileUpload,
  removeAttachment,
  formatFileSize,
}) => {
  // 파일 타입에 따른 아이콘 선택
  const getFileIcon = (fileType) => {
    if (fileType.includes("image"))
      return <FaFileImage className="h-5 w-5 text-blue-500" />;
    if (fileType.includes("pdf"))
      return <FaFilePdf className="h-5 w-5 text-red-500" />;
    if (fileType.includes("word") || fileType.includes("document"))
      return <FaFileWord className="h-5 w-5 text-blue-700" />;
    if (fileType.includes("excel") || fileType.includes("spreadsheet"))
      return <FaFileExcel className="h-5 w-5 text-green-600" />;
    return <FaFile className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6">
        <div
          className="relative flex flex-col items-center justify-center h-40 border-2 border-dashed
          rounded-lg transition-all duration-300 border-border hover:border-primary/30 hover:bg-primary/5"
        >
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
          >
            <FaUpload className="w-10 h-10 mb-3 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              파일 업로드
            </span>
            <span className="mt-1 text-xs text-muted-foreground">
              또는 여기에 파일을 끌어다 놓으세요
            </span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              multiple
              onChange={handleFileUpload}
              className="sr-only"
            />
          </label>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">
          PNG, JPG, PDF, DOC, XLS 최대 10MB
        </p>
      </div>

      {/* 첨부파일 목록 */}
      {attachments.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium text-foreground mb-3">
            첨부된 파일 ({attachments.length})
          </h4>
          <div className="bg-background/50 rounded-lg border border-border overflow-hidden">
            <ul className="divide-y divide-border">
              {attachments.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center p-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="mr-3">{getFileIcon(file.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {file.date}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(file.id)}
                    className="ml-4 flex-shrink-0 p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    aria-label="파일 삭제"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentsSection;
