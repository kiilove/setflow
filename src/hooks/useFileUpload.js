"use client";

import { useState, useEffect } from "react";
import { uploadToStorage } from "../utils/fileUtils";

/**
 * 파일 업로드를 위한 커스텀 훅
 * @param {Object} options 옵션 객체
 * @param {number} options.maxFileSize 개별 파일 최대 크기 (MB) (기본값: 2)
 * @param {number} options.maxTotalSize 총 파일 최대 크기 (MB) (기본값: 10)
 * @param {Array} options.initialFiles 초기 파일 목록
 * @returns {Object} 파일 업로드 관련 상태 및 함수
 */
const useFileUpload = (options = {}) => {
  const { maxFileSize = 2, maxTotalSize = 10, initialFiles = [] } = options;

  const [files, setFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  // 초기 파일 목록 설정
  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      // ID가 없는 파일에 ID 추가
      const filesWithIds = initialFiles.map((file) => ({
        ...file,
        id:
          file.id ||
          `existing-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}`,
      }));
      setExistingFiles(filesWithIds);
    }
  }, [initialFiles]);

  // 파일 크기 포맷팅
  const formatFileSize = (bytes) => {
    if (bytes === 0 || !bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  // 파일 크기 검증
  const validateFiles = (newFiles) => {
    // 개별 파일 크기 검증
    const maxFileSizeBytes = maxFileSize * 1024 * 1024;
    const oversizedFiles = newFiles.filter(
      (file) => file.size > maxFileSizeBytes
    );

    if (oversizedFiles.length > 0) {
      return {
        valid: false,
        message: `다음 파일이 ${maxFileSize}MB 제한을 초과합니다: ${oversizedFiles
          .map((f) => f.name)
          .join(", ")}`,
      };
    }

    // 총 파일 크기 검증
    const maxTotalSizeBytes = maxTotalSize * 1024 * 1024;
    const existingSize = existingFiles.reduce(
      (sum, file) => sum + (file.size || 0),
      0
    );
    const newSize = newFiles.reduce((sum, file) => sum + file.size, 0);
    const currentSize = files.reduce((sum, file) => sum + file.size, 0);
    const totalSize = existingSize + currentSize + newSize;

    if (totalSize > maxTotalSizeBytes) {
      return {
        valid: false,
        message: `총 파일 크기가 ${maxTotalSize}MB 제한을 초과합니다.`,
      };
    }

    return { valid: true };
  };

  // 파일 선택 핸들러
  const handleFileSelect = (newFiles) => {
    if (!newFiles || newFiles.length === 0) return;

    setError(null);

    // 파일 크기 검증
    const validation = validateFiles(newFiles);
    if (!validation.valid) {
      setError(validation.message);
      return false;
    }

    // 미리보기 생성
    const filesWithPreview = newFiles.map((file) => ({
      file,
      id: `new-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
      isNew: true,
    }));

    setFiles((prev) => [...prev, ...filesWithPreview]);
    return true;
  };

  // 파일 삭제 핸들러
  const removeFile = (id) => {
    // 새로 추가된 파일인 경우
    const fileToRemove = files.find((file) => file.id === id);
    if (fileToRemove) {
      if (fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      setFiles(files.filter((file) => file.id !== id));
      return;
    }

    // 기존 파일인 경우
    setExistingFiles(existingFiles.filter((file) => file.id !== id));
  };

  // 파일 업로드 핸들러
  const uploadFiles = async (path = "assets/files") => {
    if (files.length === 0) {
      // 새 파일이 없으면 기존 파일만 반환
      return existingFiles;
    }

    setIsUploading(true);
    setError(null);

    try {
      const uploadPromises = files.map(async (item) => {
        if (!item.file) return item; // 이미 업로드된 파일은 건너뜀

        // storageUtils의 uploadToStorage 함수 사용
        const url = await uploadToStorage(item.file, path);

        return {
          id: item.id.replace("new-", ""),
          name: item.name,
          size: item.size,
          type: item.type,
          url: url,
          date: new Date().toISOString(),
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setIsUploading(false);

      // 기존 파일과 새로 업로드된 파일 병합
      return [...existingFiles, ...uploadedFiles];
    } catch (error) {
      console.error("파일 업로드 중 오류 발생:", error);
      setError("파일을 업로드하는 중 오류가 발생했습니다.");
      setIsUploading(false);
      return existingFiles; // 오류 발생 시 기존 파일만 반환
    }
  };

  // 모든 파일 초기화
  const resetFiles = () => {
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });

    setFiles([]);
    setExistingFiles([]);
    setError(null);
  };

  // 컴포넌트 언마운트 시 URL 객체 정리
  const cleanup = () => {
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
  };

  // 모든 파일 (기존 파일 + 새 파일)
  const allFiles = [...existingFiles, ...files];

  // 총 파일 크기 계산
  const totalSize = allFiles.reduce((sum, file) => sum + (file.size || 0), 0);
  const totalSizeFormatted = formatFileSize(totalSize);
  const sizePercentage = Math.min(
    (totalSize / (maxTotalSize * 1024 * 1024)) * 100,
    100
  );

  return {
    files: allFiles,
    newFiles: files,
    existingFiles,
    totalSize,
    totalSizeFormatted,
    sizePercentage,
    isUploading,
    error,
    handleFileSelect,
    removeFile,
    uploadFiles,
    resetFiles,
    cleanup,
    formatFileSize,
  };
};

export default useFileUpload;
