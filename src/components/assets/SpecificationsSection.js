"use client";
import { useEffect, useState, useCallback } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { getButtonVariantClass } from "../../utils/themeUtils";
import { useFirestore } from "../../hooks/useFirestore";

const SpecificationsSection = ({
  specFields,
  handleSpecChange,
  customFields,
  handleCustomFieldChange,
  addCustomField,
  removeCustomField,
  formData,
  handleChange,
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { getCollection } = useFirestore("categories");

  // Firestore에서 카테고리 데이터 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCollection();
        setCategories(data);
      } catch (error) {
        console.error(
          "카테고리 데이터를 불러오는 중 오류가 발생했습니다:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [getCollection]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (e) => {
    // 기본 handleChange 함수를 호출하여 formData의 category 업데이트
    handleChange(e);
  };

  // 선택된 카테고리 데이터 찾기
  useEffect(() => {
    if (formData.category && categories.length > 0) {
      const category = categories.find((cat) => cat.name === formData.category);
      setSelectedCategory(category);
    } else {
      setSelectedCategory(null);
    }
  }, [formData.category, categories]);

  // 사양 필드 업데이트를 위한 콜백 함수 정의
  const handleSpecFieldsUpdate = useCallback((newSpecFields) => {
    console.log("사양 필드 업데이트:", newSpecFields);
  }, []);

  // 카테고리가 변경될 때 사양 템플릿 업데이트
  useEffect(() => {
    if (selectedCategory) {
      // 선택된 카테고리에 specFields가 있는 경우
      if (
        selectedCategory.specFields &&
        selectedCategory.specFields.length > 0
      ) {
        // 기존 사양 값 유지
        const existingSpecs = formData.specifications || {};

        // 새 템플릿에 기존 값 적용
        const newSpecFields = selectedCategory.specFields.map((field) => ({
          ...field,
          value: existingSpecs[field.id] || "",
        }));

        // 사양 필드 업데이트
        handleSpecFieldsUpdate(newSpecFields);
      } else {
        // 카테고리에 specFields가 없는 경우 빈 배열로 설정
        handleSpecFieldsUpdate([]);
      }
    }
  }, [selectedCategory, formData.specifications, handleSpecFieldsUpdate]);

  // 사양 필드 직접 업데이트 함수
  const updateSpecFields = (newSpecFields) => {
    // 부모 컴포넌트에서 전달받은 specFields 상태 업데이트 함수가 없는 경우
    // 콘솔에 로그만 출력
    console.log("사양 필드 업데이트:", newSpecFields);
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* 카테고리 선택 드롭다운은 CategorySection으로 이동했으므로 여기서는 제거 */}

      {/* 사양 정보 (템플릿 기반) */}
      {specFields.length > 0 && (
        <div className="mb-8">
          <div className="bg-primary/5 rounded-lg p-4 mb-4">
            <p className="text-sm text-foreground">
              선택한 카테고리에 맞는 사양 정보를 입력하세요. 이 정보는 자산 관리
              및 검색에 활용됩니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label
                  htmlFor={`spec_${field.id}`}
                  className="block text-sm font-medium text-foreground"
                >
                  {field.label}
                </label>
                <input
                  type="text"
                  id={`spec_${field.id}`}
                  value={field.value}
                  onChange={(e) => handleSpecChange(field.id, e.target.value)}
                  placeholder={`${field.label} 입력`}
                  className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 커스텀 사양 필드 */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-medium text-foreground">
            추가 사양 정보
          </h3>
          <button
            type="button"
            onClick={addCustomField}
            className={`${getButtonVariantClass(
              "outline"
            )} inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors`}
          >
            <FaPlus className="mr-2 -ml-1 h-3 w-3" />
            필드 추가
          </button>
        </div>

        {customFields.length > 0 ? (
          <div className="space-y-4">
            {customFields.map((field, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-md bg-muted/30 border border-border"
              >
                <div className="flex-1 space-y-2">
                  <label className="block text-xs font-medium text-muted-foreground">
                    필드명
                  </label>
                  <input
                    type="text"
                    placeholder="필드명"
                    value={field.name}
                    onChange={(e) =>
                      handleCustomFieldChange(index, "name", e.target.value)
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="block text-xs font-medium text-muted-foreground">
                    값
                  </label>
                  <input
                    type="text"
                    placeholder="값"
                    value={field.value}
                    onChange={(e) =>
                      handleCustomFieldChange(index, "value", e.target.value)
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCustomField(index)}
                  className="mt-8 p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="필드 삭제"
                >
                  <FaTrash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-dashed border-border bg-muted/20">
            <p className="text-sm text-muted-foreground text-center mb-3">
              필드 추가 버튼을 클릭하여 추가 사양 정보를 입력할 수 있습니다.
            </p>
            <button
              type="button"
              onClick={addCustomField}
              className={`${getButtonVariantClass(
                "outline"
              )} inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors`}
            >
              <FaPlus className="mr-2 -ml-1 h-3 w-3" />
              필드 추가
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecificationsSection;
