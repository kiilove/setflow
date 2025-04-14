"use client";

import { useRef } from "react";
import { FaImage } from "react-icons/fa";

/**
 * 이미지 업로드 섹션 컴포넌트
 * @param {Object} props
 * @param {string} props.imagePreview - 이미지 미리보기 URL
 * @param {Function} props.onImageSelect - 이미지 선택 핸들러
 * @param {Function} props.onReset - 이미지 초기화 핸들러
 * @param {boolean} props.isCompressed - 이미지 압축 여부
 * @param {boolean} props.isUploading - 업로드 중 여부
 * @param {string} props.error - 오류 메시지
 */
const ImageUploadSection = ({
  imagePreview,
  onImageSelect,
  onReset,
  isCompressed,
  isUploading,
  error,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-foreground">
        자산 이미지
      </label>

      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
        {imagePreview ? (
          <div className="space-y-4">
            <div className="aspect-square max-h-64 mx-auto overflow-hidden rounded-md">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="이미지 미리보기"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=300&width=300";
                  e.target.alt = "이미지를 불러올 수 없습니다";
                }}
              />
            </div>
            <div className="flex justify-center space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-sm border border-input rounded-md hover:bg-muted transition-colors"
                disabled={isUploading}
              >
                변경
              </button>
              <button
                type="button"
                onClick={onReset}
                className="px-3 py-1.5 text-sm border border-destructive text-destructive rounded-md hover:bg-destructive/10 transition-colors"
                disabled={isUploading}
              >
                삭제
              </button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-8 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <FaImage className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-1">
              이미지를 업로드하려면 클릭하세요
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, GIF (최대 1MB)
            </p>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />
      </div>

      {isCompressed && (
        <p className="text-xs text-amber-500">
          이미지가 1MB 제한에 맞게 자동으로 압축되었습니다.
        </p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default ImageUploadSection;
