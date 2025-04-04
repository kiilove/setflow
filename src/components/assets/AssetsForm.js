"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { getButtonVariantClass } from "../../utils/themeUtils";
import { formatFileSize } from "../../utils/fileUtils";
import specTemplates from "../../data/specTemplates";
import {
  Save,
  X,
  Tag,
  ClipboardList,
  Settings,
  DollarSign,
  User,
  TrendingDown,
  Paperclip,
  FileText,
} from "lucide-react";

// 컴포넌트 임포트
import CategorySection from "./CategorySection";
import BasicInfoSection from "./BasicInfoSection";
import PurchaseInfoSection from "./PurchaseInfoSection";
import AssignmentSection from "./AssignmentSection";
import SpecificationsSection from "./SpecificationsSection";
import ImageUploadSection from "./ImageUploadSection";
import AttachmentsSection from "./AttachmentsSection";
import NotesSection from "./NotesSection";
import DepreciationSection from "./DepreciationSection";

const AssetsForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData);

  // 섹션 참조 생성
  const sectionRefs = {
    1: useRef(null),
    2: useRef(null),
    3: useRef(null),
    4: useRef(null),
    5: useRef(null),
    6: useRef(null),
    7: useRef(null),
    8: useRef(null),
  };

  // 이미지 업로드 및 미리보기 상태
  const [imagePreview, setImagePreview] = useState(
    initialData.imageUrl || null
  );
  const [imageFile, setImageFile] = useState(null);

  // 첨부파일 상태
  const [attachments, setAttachments] = useState(initialData.attachments || []);

  // 사양 필드 상태 (템플릿 + 커스텀 필드)
  const [specFields, setSpecFields] = useState([]);

  // 커스텀 필드 상태
  const [customFields, setCustomFields] = useState(
    Object.entries(initialData.customSpecifications || {}).map(
      ([name, value]) => ({ name, value })
    )
  );

  // 활성화된 섹션 상태
  const [activeSection, setActiveSection] = useState(1);

  // 모바일 상태
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 날짜 입력 필드 관련 이벤트 처리
  useEffect(() => {
    // 날짜 입력 필드 외부 클릭 시 달력 닫기
    const handleClickOutside = (e) => {
      const dateInputs = document.querySelectorAll('input[type="date"]');
      dateInputs.forEach((input) => {
        // 클릭된 요소가 현재 날짜 입력 필드가 아니면 포커스 제거
        if (input !== e.target && !input.contains(e.target)) {
          input.blur();
        }
      });
    };

    // 다른 입력 필드 클릭 시 열린 달력 닫기
    const handleInputFocus = (e) => {
      if (e.target.type !== "date") {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach((input) => input.blur());
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("focusin", handleInputFocus);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("focusin", handleInputFocus);
    };
  }, []);

  // 섹션 이동 함수
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionRefs[sectionId]?.current) {
      sectionRefs[sectionId].current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // 카테고리 변경 시 사양 템플릿 업데이트
  useEffect(() => {
    if (formData.category && specTemplates[formData.category]) {
      // 기존 값 유지하면서 템플릿 업데이트
      const templateFields = specTemplates[formData.category].map((field) => {
        const existingValue =
          formData.specifications && formData.specifications[field.id];
        return {
          ...field,
          value:
            existingValue !== undefined ? existingValue : field.value || "",
        };
      });
      setSpecFields(templateFields);
    } else {
      setSpecFields([]);
    }
  }, [formData.category]);

  // 카테고리 변경 시 감가상각 정보 업데이트 (기존 값이 없을 경우에만)
  useEffect(() => {
    if (formData.category && !formData.depreciation.method) {
      // 여기서는 카테고리별 기본 감가상각 정보를 설정할 수 있습니다.
      const defaultDepreciation = {
        데스크탑: {
          method: "straight-line",
          years: 4,
          residualValueType: "percentage",
          residualValue: 10,
        },
        노트북: {
          method: "straight-line",
          years: 3,
          residualValueType: "fixed",
          residualValue: 1000,
        },
        모니터: {
          method: "straight-line",
          years: 5,
          residualValueType: "percentage",
          residualValue: 5,
        },
        모바일기기: {
          method: "straight-line",
          years: 2,
          residualValueType: "fixed",
          residualValue: 1000,
        },
        주변기기: {
          method: "straight-line",
          years: 3,
          residualValueType: "percentage",
          residualValue: 10,
        },
        사무기기: {
          method: "straight-line",
          years: 5,
          residualValueType: "fixed",
          residualValue: 1000,
        },
        서버: {
          method: "straight-line",
          years: 4,
          residualValueType: "percentage",
          residualValue: 12,
        },
        네트워크장비: {
          method: "straight-line",
          years: 3,
          residualValueType: "fixed",
          residualValue: 1000,
        },
        소프트웨어: {
          method: "straight-line",
          years: 1,
          residualValueType: "fixed",
          residualValue: 0,
        },
        가구: {
          method: "straight-line",
          years: 7,
          residualValueType: "percentage",
          residualValue: 2,
        },
        기타: {
          method: "straight-line",
          years: 5,
          residualValueType: "fixed",
          residualValue: 1000,
        },
      };

      if (defaultDepreciation[formData.category]) {
        setFormData((prev) => ({
          ...prev,
          depreciation: defaultDepreciation[formData.category],
        }));
      }
    }
  }, [formData.category]);

  // 일반 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 감가상각 필드 변경 핸들러
  const handleDepreciationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      depreciation: {
        ...prev.depreciation,
        [name]:
          name === "years" || name === "residualValue"
            ? name === "residualValue" &&
              prev.depreciation.residualValueType === "fixed"
              ? Number.parseInt(value)
              : name === "years"
              ? Number.parseInt(value)
              : Number.parseFloat(value)
            : value,
      },
    }));
  };

  // 사양 필드 변경 핸들러
  const handleSpecChange = (id, value) => {
    setSpecFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, value } : field))
    );

    // formData의 specifications 업데이트
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [id]: value,
      },
    }));
  };

  // 커스텀 필드 변경 핸들러
  const handleCustomFieldChange = (index, field, value) => {
    const updatedFields = [...customFields];
    if (field === "name") {
      updatedFields[index].name = value;
    } else {
      updatedFields[index].value = value;

      // formData의 specifications 업데이트
      if (updatedFields[index].name) {
        setFormData((prev) => ({
          ...prev,
          specifications: {
            ...prev.specifications,
            [updatedFields[index].name]: value,
          },
        }));
      }
    }
    setCustomFields(updatedFields);
  };

  // 커스텀 필드 추가 핸들러
  const addCustomField = () => {
    setCustomFields([...customFields, { name: "", value: "" }]);
  };

  // 커스텀 필드 삭제 핸들러
  const removeCustomField = (index) => {
    const updatedFields = [...customFields];

    // formData에서도 해당 필드 제거
    if (updatedFields[index].name) {
      setFormData((prev) => {
        const updatedSpecs = { ...prev.specifications };
        delete updatedSpecs[updatedFields[index].name];
        return {
          ...prev,
          specifications: updatedSpecs,
        };
      });
    }

    updatedFields.splice(index, 1);
    setCustomFields(updatedFields);
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 리셋 핸들러
  const resetImage = () => {
    setImagePreview(initialData.imageUrl || null);
    setImageFile(null);
  };

  // 첨부파일 업로드 핸들러
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newAttachments = files.map((file) => ({
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
        date: new Date().toISOString().split("T")[0],
      }));
      setAttachments((prev) => [...prev, ...newAttachments]);
    }
  };

  // 첨부파일 삭제 핸들러
  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
  };

  // 필수 필드 검증 함수 추가
  const validateForm = () => {
    const requiredFields = [
      "name",
      "category",
      "serialNumber",
      "purchaseDate",
      "purchasePrice",
    ];
    const errors = [];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors.push(
          `${
            field === "name"
              ? "자산명"
              : field === "category"
              ? "카테고리"
              : field === "serialNumber"
              ? "시리얼 번호"
              : field === "purchaseDate"
              ? "구매일"
              : field === "purchasePrice"
              ? "구매가격"
              : field
          }은(는) 필수 입력 항목입니다.`
        );
      }
    });

    return errors;
  };

  // 폼 제출 핸들러 수정
  const handleSubmit = (e) => {
    e.preventDefault();

    // 필수 필드 검증
    const errors = validateForm();
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    // 사양 정보 수집
    const specifications = {};

    // 템플릿 사양 필드 수집
    specFields.forEach((field) => {
      if (field.value) {
        specifications[field.id] = field.value;
      }
    });

    // 커스텀 필드 수집
    customFields.forEach((field) => {
      if (field.name && field.value) {
        specifications[field.name] = field.value;
      }
    });

    // 최종 데이터 준비
    const finalFormData = {
      ...formData,
      specifications,
      image: imageFile,
      imagePreview,
      attachments,
    };

    // 부모 컴포넌트에 데이터 전달
    onSubmit(finalFormData);
  };

  // 섹션 데이터 - 사용자 스토리에 맞게 순서 재구성
  const sections = [
    {
      id: 1,
      title: "카테고리 선택",
      icon: <Tag className="h-5 w-5 text-purple-500" />,
    },
    {
      id: 2,
      title: "기본 정보",
      icon: <ClipboardList className="h-5 w-5 text-blue-500" />,
    },
    {
      id: 3,
      title: "사양 정보",
      icon: <Settings className="h-5 w-5 text-green-500" />,
    },
    {
      id: 4,
      title: "구매 정보",
      icon: <DollarSign className="h-5 w-5 text-yellow-500" />,
    },
    {
      id: 5,
      title: "할당 정보",
      icon: <User className="h-5 w-5 text-red-500" />,
    },
    {
      id: 6,
      title: "감가상각",
      icon: <TrendingDown className="h-5 w-5 text-cyan-500" />,
    },
    {
      id: 7,
      title: "이미지 및 첨부파일",
      icon: <Paperclip className="h-5 w-5 text-indigo-500" />,
    },
    {
      id: 8,
      title: "비고",
      icon: <FileText className="h-5 w-5 text-pink-500" />,
    },
  ];

  // 모바일 상태 업데이트
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [currentSection, setCurrentSection] = useState(1);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = Number.parseInt(entry.target.id.split("-")[1]);
            setCurrentSection(sectionId);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    for (let i = 1; i <= sections.length; i++) {
      const section = document.getElementById(`section-${i}`);
      if (section) {
        observer.observe(section);
      }
    }

    return () => {
      for (let i = 1; i <= sections.length; i++) {
        const section = document.getElementById(`section-${i}`);
        if (section) {
          observer.unobserve(section);
        }
      }
    };
  }, [sections]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 ">
      {/* 데스크탑: 왼쪽 사이드바 (sticky) */}
      {!isMobile && (
        <div
          className="hidden md:block w-64 sticky top-0 max-h-screen overflow-y-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
          style={{ maxHeight: "600px" }}
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            등록 단계
          </h2>
          <div className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full flex items-center p-2 rounded-md transition-colors ${
                  currentSection === section.id
                    ? "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <div className="flex items-center justify-center w-8 h-8">
                  {section.icon}
                </div>
                <span className="ml-2">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 메인 폼 영역 */}
      <div className={`lg:w-3/4 ${isMobile ? "mb-14" : ""}`}>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 카테고리 선택 (새로운 섹션) */}
          <div
            id="section-1"
            ref={sectionRefs[1]}
            className="transition-all duration-300 opacity-100"
          >
            <div className="rounded-lg border border-border bg-card p-6 shadow-md">
              <div className="flex items-center mb-4 pb-2 border-b border-border">
                <Tag className="mr-3 h-5 w-5 text-purple-500" />
                <h2 className="text-xl font-semibold text-foreground">
                  카테고리 선택
                </h2>
              </div>
              <CategorySection
                formData={formData}
                handleChange={handleChange}
              />
            </div>
          </div>

          {/* 기본 정보 */}
          <div
            id="section-2"
            ref={sectionRefs[2]}
            className="transition-all duration-300 opacity-100"
          >
            <div className="rounded-lg border border-border bg-card p-6 shadow-md">
              <div className="flex items-center mb-4 pb-2 border-b border-border">
                <ClipboardList className="mr-3 h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-foreground">
                  기본 정보
                </h2>
              </div>
              <BasicInfoSection
                formData={formData}
                handleChange={handleChange}
              />
            </div>
          </div>

          {/* 사양 정보 */}
          <div
            id="section-3"
            ref={sectionRefs[3]}
            className="transition-all duration-300 opacity-100"
          >
            <div className="rounded-lg border border-border bg-card p-6 shadow-md">
              <div className="flex items-center mb-4 pb-2 border-b border-border">
                <Settings className="mr-3 h-5 w-5 text-green-500" />
                <h2 className="text-xl font-semibold text-foreground">
                  사양 정보
                </h2>
              </div>
              <SpecificationsSection
                specFields={specFields}
                handleSpecChange={handleSpecChange}
                customFields={customFields}
                handleCustomFieldChange={handleCustomFieldChange}
                addCustomField={addCustomField}
                removeCustomField={removeCustomField}
                formData={formData}
                handleChange={handleChange}
              />
            </div>
          </div>

          {/* 구매 정보 */}
          <div
            id="section-4"
            ref={sectionRefs[4]}
            className="transition-all duration-300 opacity-100"
          >
            <div className="rounded-lg border border-border bg-card p-6 shadow-md">
              <div className="flex items-center mb-4 pb-2 border-b border-border">
                <DollarSign className="mr-3 h-5 w-5 text-yellow-500" />
                <h2 className="text-xl font-semibold text-foreground">
                  구매 정보
                </h2>
              </div>
              <PurchaseInfoSection
                formData={formData}
                handleChange={handleChange}
              />
            </div>
          </div>

          {/* 할당 정보 */}
          <div
            id="section-5"
            ref={sectionRefs[5]}
            className="transition-all duration-300 opacity-100"
          >
            <div className="rounded-lg border border-border bg-card p-6 shadow-md">
              <div className="flex items-center mb-4 pb-2 border-b border-border">
                <User className="mr-3 h-5 w-5 text-red-500" />
                <h2 className="text-xl font-semibold text-foreground">
                  할당 정보
                </h2>
              </div>
              <AssignmentSection
                formData={formData}
                handleChange={handleChange}
              />
            </div>
          </div>

          {/* 감가상각 정보 */}
          <div
            id="section-6"
            ref={sectionRefs[6]}
            className="transition-all duration-300 opacity-100"
          >
            <div className="rounded-lg border border-border bg-card p-6 shadow-md">
              <div className="flex items-center mb-4 pb-2 border-b border-border">
                <TrendingDown className="mr-3 h-5 w-5 text-cyan-500" />
                <h2 className="text-xl font-semibold text-foreground">
                  감가상각 정보
                </h2>
              </div>
              <DepreciationSection
                formData={formData}
                handleChange={handleChange}
                handleDepreciationChange={handleDepreciationChange}
              />
            </div>
          </div>

          {/* 이미지 및 첨부파일 */}
          <div
            id="section-7"
            ref={sectionRefs[7]}
            className="transition-all duration-300 opacity-100"
          >
            <div className="rounded-lg border border-border bg-card p-6 shadow-md">
              <div className="flex items-center mb-4 pb-2 border-b border-border">
                <Paperclip className="mr-3 h-5 w-5 text-indigo-500" />
                <h2 className="text-xl font-semibold text-foreground">
                  이미지 및 첨부파일
                </h2>
              </div>
              <div className="space-y-6">
                <ImageUploadSection
                  imagePreview={imagePreview}
                  handleImageUpload={handleImageUpload}
                  resetImage={resetImage}
                />
                <div className="border-t border-border pt-6">
                  <AttachmentsSection
                    attachments={attachments}
                    handleFileUpload={handleFileUpload}
                    removeAttachment={removeAttachment}
                    formatFileSize={formatFileSize}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 비고 */}
          <div
            id="section-8"
            ref={sectionRefs[8]}
            className="transition-all duration-300 opacity-100"
          >
            <div className="rounded-lg border border-border bg-card p-6 shadow-md">
              <div className="flex items-center mb-4 pb-2 border-b border-border">
                <FileText className="mr-3 h-5 w-5 text-pink-500" />
                <h2 className="text-xl font-semibold text-foreground">비고</h2>
              </div>
              <NotesSection
                notes={formData.notes}
                handleChange={handleChange}
              />
            </div>
          </div>

          {/* 네비게이션 버튼 */}
          <div className="flex justify-end items-center space-x-3 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className={`${getButtonVariantClass(
                "outline"
              )} inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              <X className="mr-2 -ml-1 h-4 w-4" />
              취소
            </button>
            <button
              type="submit"
              className={`${getButtonVariantClass(
                "primary"
              )} inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              <Save className="mr-2 -ml-1 h-4 w-4" />
              저장
            </button>
          </div>
        </form>
      </div>

      {/* 모바일 네비게이션: 하단에 아이콘만 표시 */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md px-2 py-1 flex justify-around items-center">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`p-2 rounded-full flex items-center justify-center w-10 h-10 ${
                currentSection === section.id
                  ? "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              aria-label={section.title}
            >
              {section.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetsForm;
