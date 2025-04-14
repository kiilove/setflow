"use client";

import { useState } from "react";
import {
  FaFileAlt,
  FaDownload,
  FaPlus,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileCode,
  FaFileArchive,
  FaFileCsv,
  FaFilePowerpoint,
  FaFileVideo,
  FaFileAudio,
} from "react-icons/fa";
import { formatFileSize } from "../../../utils/fileUtils";

const DocumentsList = ({ documents = [] }) => {
  const [previewImage, setPreviewImage] = useState(null);

  // 파일 타입에 따른 아이콘 선택
  const getFileIcon = (fileType) => {
    if (!fileType)
      return <FaFileAlt className="h-8 w-8 text-muted-foreground" />;

    if (fileType.includes("pdf"))
      return <FaFilePdf className="h-8 w-8 text-red-500" />;
    if (fileType.includes("word") || fileType.includes("doc"))
      return <FaFileWord className="h-8 w-8 text-blue-500" />;
    if (
      fileType.includes("sheet") ||
      fileType.includes("excel") ||
      fileType.includes("xls")
    )
      return <FaFileExcel className="h-8 w-8 text-green-500" />;
    if (fileType.includes("image"))
      return <FaFileImage className="h-8 w-8 text-purple-500" />;
    if (
      fileType.includes("html") ||
      fileType.includes("javascript") ||
      fileType.includes("css") ||
      fileType.includes("json")
    )
      return <FaFileCode className="h-8 w-8 text-yellow-500" />;
    if (
      fileType.includes("zip") ||
      fileType.includes("rar") ||
      fileType.includes("tar") ||
      fileType.includes("gz")
    )
      return <FaFileArchive className="h-8 w-8 text-amber-500" />;
    if (fileType.includes("csv"))
      return <FaFileCsv className="h-8 w-8 text-green-700" />;
    if (
      fileType.includes("presentation") ||
      fileType.includes("powerpoint") ||
      fileType.includes("ppt")
    )
      return <FaFilePowerpoint className="h-8 w-8 text-orange-500" />;
    if (fileType.includes("video"))
      return <FaFileVideo className="h-8 w-8 text-blue-700" />;
    if (fileType.includes("audio"))
      return <FaFileAudio className="h-8 w-8 text-pink-500" />;

    return <FaFileAlt className="h-8 w-8 text-muted-foreground" />;
  };

  // 파일 다운로드 핸들러
  const handleDownload = (url, fileName) => {
    if (!url) return;

    // 이미지 파일인 경우 미리보기 표시
    if (
      url &&
      (url.match(/\.(jpeg|jpg|gif|png)$/) ||
        (fileName && fileName.match(/\.(jpeg|jpg|gif|png)$/)))
    ) {
      setPreviewImage(url);
      return;
    }

    // 다운로드 링크 생성
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 이미지 미리보기 닫기
  const closePreview = () => {
    setPreviewImage(null);
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <FaFileAlt className="mr-2 text-primary h-4 w-4" />
          첨부 파일
        </h3>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors font-medium flex items-center">
          <FaPlus className="mr-1 h-3 w-3" />
          추가
        </button>
      </div>

      {documents.length > 0 ? (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex justify-between items-center p-3 border border-border rounded-md hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center flex-1 min-w-0">
                {doc.type && doc.type.startsWith("image/") && doc.url ? (
                  <div className="h-10 w-10 bg-muted rounded flex items-center justify-center overflow-hidden mr-3">
                    <img
                      src={doc.url || "/placeholder.svg"}
                      alt={doc.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=40&width=40";
                      }}
                    />
                  </div>
                ) : (
                  <div className="mr-3">{getFileIcon(doc.type)}</div>
                )}
                <div className="min-w-0 flex-1">
                  <p
                    className="text-foreground font-medium truncate"
                    title={doc.name}
                  >
                    {doc.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(doc.size)}{" "}
                    {doc.date ? `• ${formatDate(doc.date)}` : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDownload(doc.url, doc.name)}
                className="text-primary hover:text-primary/80 transition-colors p-2 hover:bg-primary/5 rounded-full"
                title="다운로드"
              >
                <FaDownload className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground text-center py-8 border border-dashed border-border rounded-md">
          등록된 파일이 없습니다.
        </div>
      )}

      {/* 이미지 미리보기 모달 */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closePreview}
        >
          <div
            className="bg-background rounded-lg shadow-lg max-w-3xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex justify-between items-center border-b border-border">
              <h3 className="text-lg font-medium">이미지 미리보기</h3>
              <button
                onClick={closePreview}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="p-4 flex items-center justify-center">
              <img
                src={previewImage || "/placeholder.svg"}
                alt="미리보기"
                className="max-w-full max-h-[70vh] object-contain"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=300&width=300";
                  e.target.alt = "이미지를 불러올 수 없습니다";
                }}
              />
            </div>
            <div className="p-4 border-t border-border flex justify-end">
              <button
                onClick={() => handleDownload(previewImage)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md flex items-center"
              >
                <FaDownload className="mr-2 h-4 w-4" />
                다운로드
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsList;
