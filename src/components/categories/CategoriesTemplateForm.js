"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getButtonVariantClass } from "../../utils/themeUtils";
import {
  Save,
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  GripVertical,
  RefreshCw,
} from "lucide-react";
import specTemplates from "../../data/specTemplates";

const CategoriesTemplateForm = ({ initialData, onSubmit, onCancel }) => {
  const [fields, setFields] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    if (initialData && initialData.fields) {
      setFields(initialData.fields);
    }
  }, [initialData]);

  // 필드 추가 핸들러
  const addField = () => {
    const newField = {
      id: "",
      label: "",
      value: "",
      type: "text",
    };

    setFields([...fields, newField]);
    setHasChanges(true);
  };

  // 필드 삭제 핸들러
  const removeField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
    setHasChanges(true);
  };

  // 필드 변경 핸들러
  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...fields];
    updatedFields[index] = {
      ...updatedFields[index],
      [field]: value,
    };

    // ID가 비어있고 레이블이 있으면 ID 자동 생성
    if (field === "label" && value && !updatedFields[index].id) {
      updatedFields[index].id = value
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");
    }

    setFields(updatedFields);
    setHasChanges(true);
  };

  // 필드 위치 이동 핸들러
  const moveField = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === fields.length - 1)
    ) {
      return;
    }

    const updatedFields = [...fields];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    // 두 항목의 위치를 교환
    [updatedFields[index], updatedFields[newIndex]] = [
      updatedFields[newIndex],
      updatedFields[index],
    ];

    setFields(updatedFields);
    setHasChanges(true);
  };

  // 드래그 앤 드롭 핸들러
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFields(items);
    setHasChanges(true);
  };

  // 기본 템플릿으로 초기화
  const resetToDefaultTemplate = () => {
    if (initialData && initialData.categoryName) {
      const defaultTemplate = specTemplates[initialData.categoryName] || [];
      setFields(defaultTemplate);
      setHasChanges(true);
      setShowResetConfirm(false);
    }
  };

  // 저장 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();

    // 필드 ID 중복 체크
    const ids = fields.map((field) => field.id).filter(Boolean);
    const hasDuplicates = ids.some((id, index) => ids.indexOf(id) !== index);

    if (hasDuplicates) {
      alert("필드 ID가 중복되었습니다. 모든 필드 ID는 고유해야 합니다.");
      return;
    }

    // 필드 ID와 레이블이 비어있는지 체크
    const hasEmptyFields = fields.some((field) => !field.label);

    if (hasEmptyFields) {
      alert("모든 필드는 레이블이 필요합니다.");
      return;
    }

    // 자동으로 ID 생성
    const finalFields = fields.map((field) => {
      if (!field.id && field.label) {
        return {
          ...field,
          id: field.label
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, ""),
        };
      }
      return field;
    });

    // 부모 컴포넌트에 데이터 전달
    onSubmit({
      categoryId: initialData.categoryId,
      categoryName: initialData.categoryName,
      fields: finalFields,
    });
  };

  // 초기화 확인 모달
  const ResetConfirmModal = () => {
    if (!showResetConfirm) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6">
          <h3 className="text-lg font-semibold mb-4">기본 템플릿으로 초기화</h3>
          <p className="text-muted-foreground mb-6">
            현재 편집 중인 모든 사양 필드가 기본 템플릿으로 초기화됩니다. 이
            작업은 되돌릴 수 없습니다. 계속하시겠습니까?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${getButtonVariantClass(
                "outline"
              )}`}
            >
              취소
            </button>
            <button
              type="button"
              onClick={resetToDefaultTemplate}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${getButtonVariantClass(
                "destructive"
              )}`}
            >
              초기화
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-md">
      {/* 초기화 확인 모달 */}
      <ResetConfirmModal />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            사양 필드 ({fields.length})
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${getButtonVariantClass(
                "outline"
              )}`}
              title="기본 템플릿으로 초기화"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              기본값으로 초기화
            </button>
            <button
              type="button"
              onClick={addField}
              className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${getButtonVariantClass(
                "secondary"
              )}`}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              필드 추가
            </button>
          </div>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-md">
            <p className="text-muted-foreground">
              아직 정의된 사양 필드가 없습니다. '필드 추가' 버튼을 클릭하여 새
              필드를 추가하세요.
            </p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="fields">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {fields.map((field, index) => (
                    <Draggable
                      key={index}
                      draggableId={`field-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="border border-border rounded-md p-4 bg-background"
                        >
                          <div className="flex items-start gap-2">
                            <div
                              {...provided.dragHandleProps}
                              className="mt-2 p-1 cursor-grab text-muted-foreground hover:text-foreground"
                            >
                              <GripVertical className="h-4 w-4" />
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">
                                  필드 ID{" "}
                                  <span className="text-destructive">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={field.id || ""}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      index,
                                      "id",
                                      e.target.value
                                    )
                                  }
                                  placeholder="field_id"
                                  className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                />
                                <p className="text-xs text-muted-foreground">
                                  비워두면 자동 생성됩니다
                                </p>
                              </div>

                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">
                                  레이블{" "}
                                  <span className="text-destructive">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={field.label || ""}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      index,
                                      "label",
                                      e.target.value
                                    )
                                  }
                                  placeholder="필드 레이블"
                                  className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">
                                  필드 타입
                                </label>
                                <select
                                  value={field.type || "text"}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      index,
                                      "type",
                                      e.target.value
                                    )
                                  }
                                  className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                >
                                  <option value="text">텍스트</option>
                                  <option value="number">숫자</option>
                                  <option value="date">날짜</option>
                                  <option value="select">선택</option>
                                  <option value="checkbox">체크박스</option>
                                </select>
                              </div>
                            </div>

                            <div className="flex flex-col space-y-1">
                              <button
                                type="button"
                                onClick={() => moveField(index, "up")}
                                disabled={index === 0}
                                className={`p-1.5 rounded-md ${
                                  index === 0
                                    ? "text-muted-foreground cursor-not-allowed"
                                    : "text-primary hover:bg-primary/5"
                                }`}
                                title="위로 이동"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => moveField(index, "down")}
                                disabled={index === fields.length - 1}
                                className={`p-1.5 rounded-md ${
                                  index === fields.length - 1
                                    ? "text-muted-foreground cursor-not-allowed"
                                    : "text-primary hover:bg-primary/5"
                                }`}
                                title="아래로 이동"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => removeField(index)}
                                className="p-1.5 rounded-md text-destructive hover:bg-destructive/5"
                                title="삭제"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        {/* 버튼 */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${getButtonVariantClass(
              "outline"
            )}`}
          >
            <X className="mr-2 -ml-1 h-4 w-4" />
            취소
          </button>
          <button
            type="submit"
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${getButtonVariantClass(
              "primary"
            )}`}
          >
            <Save className="mr-2 -ml-1 h-4 w-4" />
            저장
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoriesTemplateForm;
