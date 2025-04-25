"use client";

import { useState, useEffect } from "react";
// 임포트 경로 수정
import { uploadToStorage } from "../utils/fileUtils";

/**
 * 이미지 업로드 및 압축을 위한 커스텀 훅
 * @param {Object} options 옵션 객체
 * @param {boolean} options.compress 이미지 압축 여부 (기본값: true)
 * @param {number} options.maxSizeMB 최대 이미지 크기 (MB) (기본값: 1)
 * @param {number} options.maxWidthOrHeight 최대 너비 또는 높이 (기본값: 1920)
 * @param {string} options.initialImageUrl 초기 이미지 URL
 * @returns {Object} 이미지 업로드 관련 상태 및 함수
 */
const useImageUpload = (options = {}) => {
  const {
    compress = true,
    maxSizeMB = 1,
    maxWidthOrHeight = 1920,
    initialImageUrl = null,
  } = options;

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialImageUrl);
  const [isCompressed, setIsCompressed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  // 초기 이미지 URL이 변경되면 미리보기 업데이트
  useEffect(() => {
    if (initialImageUrl) {
      setImagePreview(initialImageUrl);
    }
  }, [initialImageUrl]);

  // 이미지 압축 함수
  const compressImage = async (file) => {
    try {
      // 동적으로 browser-image-compression 라이브러리 로드
      const imageCompression = await import("browser-image-compression").then(
        (module) => module.default
      );

      const options = {
        maxSizeMB,
        maxWidthOrHeight,
        useWebWorker: true,
      };

      return await imageCompression(file, options);
    } catch (error) {
      console.error("이미지 압축 중 오류 발생:", error);
      throw error;
    }
  };

  // 이미지 선택 핸들러
  const handleImageSelect = async (file) => {
    if (!file) return;

    try {
      setError(null);

      // 이미지 크기 검증 및 압축
      if (compress && file.size > maxSizeMB * 1024 * 1024) {
        // 압축 옵션이 활성화되어 있고 크기가 제한을 초과하는 경우
        const compressedFile = await compressImage(file);
        setImageFile(compressedFile);
        setImagePreview(URL.createObjectURL(compressedFile));
        setIsCompressed(true);
      } else {
        // 압축이 필요 없거나 비활성화된 경우
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setIsCompressed(false);
      }
    } catch (error) {
      console.error("이미지 처리 오류:", error);
      setError("이미지를 처리하는 중 오류가 발생했습니다.");
    }
  };

  // 이미지 업로드 핸들러
  const uploadImage = async (path = "assets/images") => {
    // 파일이 없고 초기 이미지 URL이 있으면 그대로 반환
    if (!imageFile && initialImageUrl) {
      return initialImageUrl;
    }

    // 파일이 없으면 null 반환
    if (!imageFile) return null;

    setIsUploading(true);
    setError(null);

    try {
      // storageUtils의 uploadToStorage 함수 사용
      const downloadURL = await uploadToStorage(imageFile, path);

      setIsUploading(false);
      return downloadURL;
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생:", error);
      setError("이미지를 업로드하는 중 오류가 발생했습니다.");
      setIsUploading(false);
      return null;
    }
  };

  // 이미지 초기화 핸들러
  const resetImage = () => {
    if (imagePreview && imageFile) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    setIsCompressed(false);
    setError(null);
  };

  // 컴포넌트 언마운트 시 URL 객체 정리
  const cleanup = () => {
    if (imagePreview && imageFile) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  return {
    imageFile,
    imagePreview,
    isCompressed,
    isUploading,
    error,
    handleImageSelect,
    uploadImage,
    resetImage,
    cleanup,
    hasImage: !!imagePreview,
  };
};

export default useImageUpload;
