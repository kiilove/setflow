"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

// SortableItem 컴포넌트
const SortableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const CategoriesTemplateForm = ({ initialData, onSubmit, onCancel }) => {
  const [fields, setFields] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex(
          (_, index) => `field-${index}` === active.id
        );
        const newIndex = items.findIndex(
          (_, index) => `field-${index}` === over.id
        );

        return arrayMove(items, oldIndex, newIndex);
      });
      setHasChanges(true);
    }
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map((_, index) => `field-${index}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <SortableItem key={`field-${index}`} id={`field-${index}`}>
                    <div className="flex items-center gap-2 p-4 border rounded-lg bg-background">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) =>
                            handleFieldChange(index, "label", e.target.value)
                          }
                          placeholder="필드 레이블"
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => moveField(index, "up")}
                          disabled={index === 0}
                          className="p-2 rounded-md hover:bg-muted"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveField(index, "down")}
                          disabled={index === fields.length - 1}
                          className="p-2 rounded-md hover:bg-muted"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeField(index)}
                          className="p-2 rounded-md hover:bg-muted text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${getButtonVariantClass(
              "outline"
            )}`}
          >
            <X className="mr-1.5 h-4 w-4" />
            취소
          </button>
          <button
            type="submit"
            disabled={!hasChanges}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${getButtonVariantClass(
              "default"
            )}`}
          >
            <Save className="mr-1.5 h-4 w-4" />
            저장
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoriesTemplateForm;
