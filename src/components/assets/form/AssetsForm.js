"use client";

import { useState, useEffect, useRef } from "react";
import {
  Save,
  X,
  Layers,
  Info,
  CreditCard,
  MapPin,
  Cpu,
  ImageIcon,
  FileText,
} from "lucide-react";
import { getButtonVariantClass } from "../../../utils/themeUtils";
import { useDeviceDetect } from "../../../hooks/useDeviceDetect";
import { useFirestore } from "../../../hooks/useFirestore";
import { useNavigate } from "react-router-dom";
import { useMessageContext } from "../../../context/MessageContext";
import PageContainer from "../../common/PageContainer";
import { getStatusColorClass } from "../../../utils/themeUtils";
import { useImageUpload } from "../../../hooks/useImageUpload";
import { useFileUpload } from "../../../hooks/useFileUpload";

// Form sections
import BasicInfoSection from "./sections/BasicInfoSection";
import CategorySection from "./sections/CategorySection";
import PurchaseInfoSection from "./sections/PurchaseInfoSection";
import SpecificationsSection from "./sections/SpecificationsSection";
import DepreciationSection from "./sections/DepreciationSection";
import AssignmentSection from "./sections/AssignmentSection";
import LocationAssignmentSection from "./sections/LocationAssignmentSection";
import ImageUploadSection from "./sections/ImageUploadSection";
import FileUploadSection from "./sections/FileUploadSection";
import NotesSection from "./sections/NotesSection";
import FormNavigation from "./FormNavigation";

/**
 * 자산 등록/수정 폼 컴포넌트
 * @param {Object} props
 * @param {Object} props.initialData - 초기 데이터
 * @param {Function} props.onSubmit - 제출 핸들러
 * @param {Function} props.onCancel - 취소 핸들러
 * @param {boolean} props.isSubmitting - 제출 중 상태
 */
const AssetsForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState(initialData || {});
  const [activeSection, setActiveSection] = useState("category");
  const { isMobile } = useDeviceDetect();
  const [confirmSubmit, setConfirmSubmit] = useState(false); // 제출 확인 상태 추가
  const { getCollection } = useFirestore("categories");
  const navigate = useNavigate();
  const { showMessage } = useMessageContext();

  // 컴포넌트 최상단에 스크롤 관련 ref를 추가하고,
  // FormNavigation에 전달하여 더 정확한 스크롤 처리를 할 수 있도록 합니다.
  const formContainerRef = useRef(null);

  // 사양 필드 상태
  const [specFields, setSpecFields] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [categories, setCategories] = useState([]);

  // 이미지 업로드 훅 사용 (압축 옵션 활성화)
  const {
    imagePreview,
    isCompressed,
    isUploading: isImageUploading,
    error: imageError,
    handleImageSelect,
    uploadImage,
    resetImage,
    cleanup: cleanupImage,
    hasImage,
  } = useImageUpload({
    compress: true, // 압축 활성화 (필요에 따라 false로 설정 가능)
    maxSizeMB: 1, // 최대 1MB
    maxWidthOrHeight: 1920,
    initialImageUrl: initialData?.image, // 초기 이미지 URL 설정
  });

  // 파일 업로드 훅 사용
  const {
    files,
    totalSizeFormatted,
    sizePercentage,
    isUploading: isFilesUploading,
    error: filesError,
    handleFileSelect,
    removeFile,
    uploadFiles,
    formatFileSize,
    cleanup: cleanupFiles,
  } = useFileUpload({
    maxFileSize: 2, // 개별 파일 최대 2MB
    maxTotalSize: 10, // 총 파일 최대 10MB
    initialFiles: initialData?.attachments || [], // 초기 파일 목록 설정
  });

  // Firestore에서 카테고리 데이터 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCollection();
        setCategories(data);
      } catch (error) {
        console.error(
          "카테고리 데이터를 불러오는 중 오류가 발생했습니다:",
          error
        );
      }
    };

    fetchCategories();
  }, [getCollection]);

  // 초기 데이터가 변경되면 폼 데이터 업데이트
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);

      // 커스텀 사양 필드 설정
      if (initialData.customSpecifications) {
        const customFieldsArray = Object.entries(
          initialData.customSpecifications
        ).map(([name, value]) => ({
          name,
          value,
        }));
        setCustomFields(customFieldsArray);
      }
    }
  }, [initialData]);

  // 컴포넌트 언마운트 시 리소스 정리
  useEffect(() => {
    return () => {
      cleanupImage();
      cleanupFiles();
    };
  }, [cleanupImage, cleanupFiles]);

  // 카테고리 변경 시 사양 필드 업데이트
  useEffect(() => {
    if (formData.category && categories.length > 0) {
      const selectedCategory = categories.find(
        (cat) => cat.name === formData.category
      );
      if (selectedCategory && selectedCategory.specFields) {
        updateSpecFieldsFromCategory(
          selectedCategory.specFields,
          formData.specifications || {}
        );
      } else {
        setSpecFields([]);
      }
    }
  }, [formData.category, categories]);

  // 카테고리에 따른 사양 필드 업데이트 함수
  const updateSpecFieldsFromCategory = (
    categorySpecFields,
    existingSpecs = {}
  ) => {
    if (categorySpecFields && categorySpecFields.length > 0) {
      // 새 템플릿에 기존 값 적용
      const newSpecFields = categorySpecFields.map((field) => ({
        ...field,
        value: existingSpecs[field.id] || "",
      }));

      setSpecFields(newSpecFields);

      // formData의 specifications 업데이트 - 기존 값 유지
      const updatedSpecs = { ...existingSpecs };
      newSpecFields.forEach((field) => {
        // 기존 값이 없는 경우에만 빈 문자열로 초기화
        if (updatedSpecs[field.id] === undefined) {
          updatedSpecs[field.id] = "";
        }
      });

      setFormData((prev) => ({
        ...prev,
        specifications: updatedSpecs,
      }));
    } else {
      setSpecFields([]);
    }
  };

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 사양 정보 변경 핸들러
  const handleSpecChange = (id, value) => {
    const updatedFields = specFields.map((field) =>
      field.id === id ? { ...field, value } : field
    );
    setSpecFields(updatedFields);

    // formData의 specifications 업데이트
    const updatedSpecs = { ...formData.specifications } || {};
    updatedSpecs[id] = value;

    setFormData({
      ...formData,
      specifications: updatedSpecs,
    });
  };

  // 커스텀 필드 변경 핸들러
  const handleCustomFieldChange = (index, key, value) => {
    const updatedFields = [...customFields];
    updatedFields[index][key] = value;
    setCustomFields(updatedFields);

    // formData의 customSpecifications 업데이트
    const updatedCustomSpecs = {};
    updatedFields.forEach((field) => {
      if (field.name) {
        updatedCustomSpecs[field.name] = field.value;
      }
    });

    setFormData({
      ...formData,
      customSpecifications: updatedCustomSpecs,
    });
  };

  // 커스텀 필드 추가 핸들러
  const addCustomField = () => {
    setCustomFields([...customFields, { name: "", value: "" }]);
  };

  // 커스텀 필드 삭제 핸들러
  const removeCustomField = (index) => {
    const updatedFields = [...customFields];
    updatedFields.splice(index, 1);
    setCustomFields(updatedFields);

    // formData의 customSpecifications 업데이트
    const updatedCustomSpecs = {};
    updatedFields.forEach((field) => {
      if (field.name) {
        updatedCustomSpecs[field.name] = field.value;
      }
    });

    setFormData({
      ...formData,
      customSpecifications: updatedCustomSpecs,
    });
  };

  // 키 다운 이벤트 핸들러 - 엔터키 제출 방지
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
      // 다음 입력 필드로 포커스 이동 (선택 사항)
      const form = e.target.form;
      if (form) {
        const index = Array.prototype.indexOf.call(form.elements, e.target);
        if (index !== -1 && form.elements[index + 1]) {
          form.elements[index + 1].focus();
        }
      }
    }
  };

  const handleCategoryChange = (category) => {
    setFormData((prev) => ({
      ...prev,
      category,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. 이미지 업로드 (있는 경우)
      const imageUrl = await uploadImage();

      // 2. 첨부 파일 업로드
      const allFiles = await uploadFiles();

      // 3. 자산 데이터 저장
      const assetData = {
        ...formData,
        image: imageUrl,
        attachments: allFiles,
      };

      // 부모 컴포넌트의 onSubmit 함수 호출
      onSubmit(assetData);
    } catch (error) {
      console.error("자산 저장 중 오류 발생:", error);
      // 에러 처리 (메시지 컨텍스트가 있다면 사용)
      if (showMessage) {
        showMessage(
          "저장 실패",
          "자산 정보를 저장하는 중 오류가 발생했습니다."
        );
      } else {
        alert("자산 정보를 저장하는 중 오류가 발생했습니다.");
      }
    }
  };

  // 폼 내용에 이미지 및 파일 업로드 섹션 추가
  return (
    <div className="flex gap-6">
      {/* 네비게이션 사이드바 */}
      <FormNavigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        containerRef={formContainerRef}
      />

      {/* 폼 내용 */}
      <div
        ref={formContainerRef}
        className={`flex-1 ${isMobile ? "pb-16" : ""}`}
      >
        <form
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          className="space-y-8"
        >
          {/* 카테고리 섹션 */}
          <div
            className="bg-card rounded-lg border border-border p-6 shadow-sm scroll-mt-24"
            data-section="category"
            id="section-category"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span className="inline-block p-2 rounded-md bg-purple-50 dark:bg-purple-900/20 mr-2">
                <Layers className="h-5 w-5 text-purple-500" strokeWidth={1.5} />
              </span>
              카테고리
            </h2>
            <CategorySection
              formData={formData}
              handleChange={handleChange}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {/* 기본 정보 섹션 */}
          <div
            className="bg-card rounded-lg border border-border p-6 shadow-sm scroll-mt-24"
            data-section="basic"
            id="section-basic"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span className="inline-block p-2 rounded-md bg-blue-50 dark:bg-blue-900/20 mr-2">
                <Info className="h-5 w-5 text-blue-500" strokeWidth={1.5} />
              </span>
              기본 정보
            </h2>
            <BasicInfoSection formData={formData} handleChange={handleChange} />
          </div>

          {/* 구매 정보 섹션 */}
          <div
            className="bg-card rounded-lg border border-border p-6 shadow-sm scroll-mt-24"
            data-section="purchase"
            id="section-purchase"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span className="inline-block p-2 rounded-md bg-green-50 dark:bg-green-900/20 mr-2">
                <CreditCard
                  className="h-5 w-5 text-green-500"
                  strokeWidth={1.5}
                />
              </span>
              구매 정보
            </h2>
            <PurchaseInfoSection
              formData={formData}
              handleChange={handleChange}
            />
          </div>

          {/* 위치 및 할당 정보 섹션 */}
          <div
            className="bg-card rounded-lg border border-border p-6 shadow-sm scroll-mt-24"
            data-section="location"
            id="section-location"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span className="inline-block p-2 rounded-md bg-amber-50 dark:bg-amber-900/20 mr-2">
                <MapPin className="h-5 w-5 text-amber-500" strokeWidth={1.5} />
              </span>
              위치 및 할당 정보
            </h2>
            <AssignmentSection
              formData={formData}
              handleChange={handleChange}
              isInForm={true}
            />
          </div>

          {/* 사양 정보 섹션 */}
          <div
            className="bg-card rounded-lg border border-border p-6 shadow-sm scroll-mt-24"
            data-section="specs"
            id="section-specs"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span className="inline-block p-2 rounded-md bg-red-50 dark:bg-red-900/20 mr-2">
                <Cpu className="h-5 w-5 text-red-500" strokeWidth={1.5} />
              </span>
              사양 정보
            </h2>
            <SpecificationsSection
              specFields={specFields}
              handleSpecChange={handleSpecChange}
              customFields={customFields}
              handleCustomFieldChange={handleCustomFieldChange}
              addCustomField={addCustomField}
              removeCustomField={removeCustomField}
              formData={formData}
              handleChange={handleChange}
              handleSpecFieldsUpdate={setSpecFields}
            />
          </div>

          {/* 이미지 및 첨부 파일 섹션 */}
          <div
            className="bg-card rounded-lg border border-border p-6 shadow-sm scroll-mt-24"
            data-section="files"
            id="section-files"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span className="inline-block p-2 rounded-md bg-indigo-50 dark:bg-indigo-900/20 mr-2">
                <ImageIcon
                  className="h-5 w-5 text-indigo-500"
                  strokeWidth={1.5}
                />
              </span>
              이미지 및 첨부 파일
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploadSection
                imagePreview={imagePreview}
                onImageSelect={handleImageSelect}
                onReset={resetImage}
                isCompressed={isCompressed}
                isUploading={isImageUploading}
                error={imageError}
              />
              <FileUploadSection
                files={files}
                onFileSelect={handleFileSelect}
                onRemoveFile={removeFile}
                totalSizeFormatted={totalSizeFormatted}
                sizePercentage={sizePercentage}
                isUploading={isFilesUploading}
                error={filesError}
                formatFileSize={formatFileSize}
              />
            </div>
          </div>

          {/* 비고 섹션 */}
          <div
            className="bg-card rounded-lg border border-border p-6 shadow-sm scroll-mt-24"
            data-section="notes"
            id="section-notes"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span className="inline-block p-2 rounded-md bg-teal-50 dark:bg-teal-900/20 mr-2">
                <FileText className="h-5 w-5 text-teal-500" strokeWidth={1.5} />
              </span>
              비고
            </h2>
            <NotesSection
              notes={formData.notes || ""}
              handleChange={handleChange}
            />
          </div>

          {/* 버튼 그룹 */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className={`${getButtonVariantClass(
                "outline"
              )} px-4 py-2 flex items-center`}
            >
              <X className="mr-1.5 h-4 w-4" />
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isImageUploading || isFilesUploading}
              className={`${getButtonVariantClass(
                "primary"
              )} px-4 py-2 flex items-center`}
            >
              {isSubmitting || isImageUploading || isFilesUploading ? (
                <>
                  <div className="mr-2 h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="mr-1.5 h-4 w-4" />
                  저장
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetsForm;
