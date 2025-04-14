"use client";

import { useRef } from "react";
import { User, Camera } from "lucide-react";

/**
 * 프로필 이미지 업로드 컴포넌트
 * @param {Object} props
 * @param {string} props.imagePreview - 이미지 미리보기 URL
 * @param {Function} props.onImageSelect - 이미지 선택 핸들러
 * @param {Function} props.onReset - 이미지 초기화 핸들러
 * @param {boolean} props.isCompressed - 이미지 압축 여부
 * @param {boolean} props.isUploading - 업로드 중 여부
 * @param {string} props.error - 오류 메시지
 */
const ProfileImageUpload = ({
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
    <div className="flex flex-col items-center space-y-4">
      <label className="block text-sm font-medium text-foreground">
        프로필 이미지
      </label>

      <div className="relative">
        {/* 프로필 이미지 원형 컨테이너 */}
        <div
          className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-muted flex items-center justify-center relative"
          onClick={() => fileInputRef.current?.click()}
        >
          {imagePreview ? (
            <img
              src={imagePreview || "/placeholder.svg"}
              alt="프로필 이미지"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/placeholder.svg?height=128&width=128";
                e.target.alt = "이미지를 불러올 수 없습니다";
              }}
            />
          ) : (
            <User className="h-16 w-16 text-muted-foreground" />
          )}

          {/* 카메라 아이콘 오버레이 */}
          <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* 이미지 변경/삭제 버튼 */}
        {imagePreview && (
          <div className="mt-4 flex justify-center space-x-2">
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

      {!imagePreview && (
        <p className="text-sm text-muted-foreground text-center">
          이미지를 업로드하려면 클릭하세요
          <br />
          <span className="text-xs">PNG, JPG, GIF (최대 1MB)</span>
        </p>
      )}

      {isCompressed && (
        <p className="text-xs text-amber-500">
          이미지가 1MB 제한에 맞게 자동으로 압축되었습니다.
        </p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default ProfileImageUpload;
