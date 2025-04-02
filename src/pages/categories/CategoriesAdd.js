"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSave, FaTimes, FaPlus } from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";
import specTemplates from "../../data/specTemplates";

const CategoriesAdd = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    specFields: [],
  });

  // 기존 템플릿 목록 생성
  const existingTemplates = Object.keys(specTemplates);

  // 템플릿 선택 상태
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // 템플릿 선택 시 해당 템플릿의 필드 로드
  useEffect(() => {
    if (selectedTemplate && specTemplates[selectedTemplate]) {
      setFormData((prev) => ({
        ...prev,
        specFields: [
          ...specTemplates[selectedTemplate].map((field) => ({
            id: field.id,
            label: field.label,
            type: "text", // 기본 타입은 text로 설정
          })),
        ],
      }));
    }
  }, [selectedTemplate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecFieldChange = (index, field, value) => {
    const updatedFields = [...formData.specFields];
    updatedFields[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      specFields: updatedFields,
    }));
  };

  const addSpecField = () => {
    setFormData((prev) => ({
      ...prev,
      specFields: [...prev.specFields, { id: "", label: "", type: "text" }],
    }));
  };

  const removeSpecField = (index) => {
    const updatedFields = [...formData.specFields];
    updatedFields.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      specFields: updatedFields,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 사양 필드의 id 값이 비어있으면 자동으로 생성
    const finalSpecFields = formData.specFields.map((field) => {
      if (!field.id) {
        // 한글 레이블을 영문 id로 변환 (간단한 예시)
        // 실제로는 더 복잡한 변환 로직이 필요할 수 있음
        const generatedId = field.label.toLowerCase().replace(/\s+/g, "");
        return { ...field, id: generatedId };
      }
      return field;
    });

    // 최종 데이터 준비
    const finalFormData = {
      ...formData,
      specFields: finalSpecFields,
    };

    // 여기에 카테고리 추가 및 템플릿 저장 로직 구현
    console.log("카테고리 추가:", finalFormData);
    alert("카테고리가 추가되었습니다.");
    // 폼 초기화 또는 리디렉션
  };

  return (
    <PageContainer title="카테고리 추가">
      <div className="rounded-lg border border-border bg-card p-6 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">
              기본 정보
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  카테고리명 <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-border bg-input px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  설명
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-border bg-input px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* 템플릿 선택 */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">
              템플릿 선택
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="template"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  기존 템플릿에서 불러오기
                </label>
                <select
                  id="template"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-border bg-input px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">직접 입력</option>
                  {existingTemplates.map((template) => (
                    <option key={template} value={template}>
                      {template}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-muted-foreground">
                  기존 템플릿을 선택하면 해당 템플릿의 필드가 자동으로
                  로드됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* 사양 필드 */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-foreground">사양 필드</h3>
              <button
                type="button"
                onClick={addSpecField}
                className="inline-flex items-center px-3 py-1 rounded-md text-sm text-primary hover:text-primary/80 border border-primary/30 hover:bg-primary/5"
              >
                <FaPlus className="mr-1 h-3 w-3" />
                필드 추가
              </button>
            </div>

            {formData.specFields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>
                  사양 필드가 없습니다. 필드를 추가하거나 템플릿을 선택하세요.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.specFields.map((field, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-md border border-border bg-background"
                  >
                    <div className="flex-grow">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">
                            필드 ID
                          </label>
                          <input
                            type="text"
                            value={field.id}
                            onChange={(e) =>
                              handleSpecFieldChange(index, "id", e.target.value)
                            }
                            placeholder="영문 소문자, 숫자, 언더스코어만 사용"
                            className="mt-1 block w-full rounded-md border border-border bg-input px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                          <p className="mt-1 text-xs text-muted-foreground">
                            비워두면 자동 생성됩니다
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">
                            필드명 <span className="text-destructive">*</span>
                          </label>
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) =>
                              handleSpecFieldChange(
                                index,
                                "label",
                                e.target.value
                              )
                            }
                            required
                            className="mt-1 block w-full rounded-md border border-border bg-input px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground">
                            필드 유형
                          </label>
                          <select
                            value={field.type}
                            onChange={(e) =>
                              handleSpecFieldChange(
                                index,
                                "type",
                                e.target.value
                              )
                            }
                            className="mt-1 block w-full rounded-md border border-border bg-input px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                          >
                            <option value="text">텍스트</option>
                            <option value="number">숫자</option>
                            <option value="date">날짜</option>
                            <option value="select">선택</option>
                            <option value="checkbox">체크박스</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => removeSpecField(index)}
                        className="p-2 text-destructive hover:text-destructive/80 bg-destructive/5 hover:bg-destructive/10 rounded-md"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-3">
            <Link
              to="/categories"
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${getButtonVariantClass(
                "secondary"
              )}`}
            >
              <FaTimes className="mr-2 -ml-1 h-4 w-4" />
              취소
            </Link>
            <button
              type="submit"
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${getButtonVariantClass(
                "primary"
              )}`}
            >
              <FaSave className="mr-2 -ml-1 h-4 w-4" />
              저장
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};

export default CategoriesAdd;
