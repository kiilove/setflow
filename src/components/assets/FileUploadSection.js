"use client";

import { useRef } from "react";
import { FaFile, FaTrash, FaPlus } from "react-icons/fa";

/**
 * 파일 업로드 섹션 컴포넌트
 * @param {Object} props
 * @param {Array} props.files - 선택된 파일 목록
 * @param {Function} props.onFileSelect - 파일 선택 핸들러
 * @param {Function} props.onRemoveFile - 파일 삭제 핸들러
 * @param {string} props.totalSizeFormatted - 포맷팅된 총 파일 크기
 * @param {number} props.sizePercentage - 크기 백분율
 * @param {boolean} props.isUploading - 업로드 중 여부
 * @param {string} props.error - 오류 메시지
 * @param {Function} props.formatFileSize - 파일 크기 포맷팅 함수
 */
const FileUploadSection = ({
  files,
  onFileSelect,
  onRemoveFile,
  totalSizeFormatted,
  sizePercentage,
  isUploading,
  error,
  formatFileSize,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(Array.from(e.target.files));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-foreground">
          첨부 파일
        </label>
        <span className="text-xs text-muted-foreground">
          {totalSizeFormatted} / 10MB
        </span>
      </div>

      {/* 용량 표시 프로그레스 바 */}
      <div className="w-full bg-muted rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${
            sizePercentage > 90
              ? "bg-destructive"
              : sizePercentage > 70
              ? "bg-amber-500"
              : "bg-primary"
          }`}
          style={{ width: `${sizePercentage}%` }}
        ></div>
      </div>

      {/* 파일 목록 */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {files.length > 0 ? (
          files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-2 border border-border rounded-md bg-background"
            >
              <div className="flex items-center space-x-2 overflow-hidden">
                <div className="flex-shrink-0">
                  {file.type?.startsWith("image/") &&
                  (file.preview || file.url) ? (
                    <img
                      src={file.preview || file.url}
                      alt={file.name}
                      className="h-10 w-10 object-cover rounded"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=40&width=40";
                      }}
                    />
                  ) : (
                    <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                      <FaFile className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemoveFile(file.id)}
                className="ml-2 text-muted-foreground hover:text-destructive"
                disabled={isUploading}
              >
                <FaTrash className="h-4 w-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 border border-dashed border-border rounded-md">
            <p className="text-sm text-muted-foreground">
              첨부된 파일이 없습니다
            </p>
          </div>
        )}
      </div>

      {/* 파일 추가 버튼 */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 text-sm border border-input rounded-md hover:bg-muted transition-colors flex items-center"
          disabled={isUploading}
        >
          <FaPlus className="mr-1.5 h-3 w-3" />
          파일 추가
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="hidden"
          disabled={isUploading}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        파일 크기 제한: 개별 2MB, 총 10MB
      </p>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default FileUploadSection;
