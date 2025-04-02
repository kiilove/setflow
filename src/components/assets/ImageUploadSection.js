"use client";
import { FaCamera, FaTrash } from "react-icons/fa";

const ImageUploadSection = ({
  imagePreview,
  handleImageUpload,
  resetImage,
}) => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div
            className={`
              relative flex flex-col items-center justify-center h-64 border-2 border-dashed 
              rounded-lg transition-all duration-300 
              ${
                imagePreview
                  ? "border-primary/30 bg-primary/5"
                  : "border-border hover:border-primary/30 hover:bg-primary/5"
              }
            `}
          >
            {!imagePreview ? (
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
              >
                <FaCamera className="w-12 h-12 mb-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  이미지 업로드
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  또는 여기에 파일을 끌어다 놓으세요
                </span>
                <input
                  id="image-upload"
                  name="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="자산 이미지 미리보기"
                  className="w-full h-full object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={resetImage}
                  className="absolute bottom-2 right-2 bg-destructive text-destructive-foreground p-2 rounded-full shadow-md hover:bg-destructive/90 transition-colors"
                  aria-label="이미지 제거"
                >
                  <FaTrash className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h4 className="text-md font-medium text-foreground mb-3">
            이미지 가이드라인
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            자산의 대표 이미지를 업로드하세요. 이 이미지는 자산 목록과 상세
            페이지에 표시됩니다.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs mr-2 mt-0.5">
                1
              </span>
              <span className="text-sm">
                이미지는 정면에서 촬영된 것이 좋습니다.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs mr-2 mt-0.5">
                2
              </span>
              <span className="text-sm">
                배경이 깨끗하고 자산이 잘 보이도록 촬영하세요.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs mr-2 mt-0.5">
                3
              </span>
              <span className="text-sm">
                이미지 크기는 5MB 이하여야 합니다.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadSection;
