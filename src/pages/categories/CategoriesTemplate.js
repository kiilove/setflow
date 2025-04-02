"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaSave,
  FaTimes,
  FaPlus,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaGripVertical,
} from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";
import specTemplates from "../../data/specTemplates";

const CategoriesTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 카테고리 데이터 (실제로는 API에서 가져올 것)
  const categoriesData = [
    { id: 1, name: "데스크탑", description: "데스크탑 컴퓨터" },
    { id: 2, name: "노트북", description: "노트북 컴퓨터" },
    { id: 3, name: "모니터", description: "모니터 및 디스플레이" },
    { id: 4, name: "모바일기기", description: "태블릿, 스마트폰 등" },
    { id: 5, name: "주변기기", description: "키보드, 마우스 등" },
    { id: 6, name: "사무기기", description: "프린터, 스캐너, 복사기 등" },
    { id: 7, name: "서버", description: "서버 장비" },
    {
      id: 8,
      name: "네트워크장비",
      description: "라우터, 스위치, 액세스 포인트 등",
    },
    {
      id: 9,
      name: "소프트웨어",
      description: "운영체제, 응용프로그램, 라이센스 등",
    },
    { id: 10, name: "가구", description: "책상, 의자, 캐비닛 등" },
    { id: 11, name: "기타", description: "기타 자산" },
  ];

  // 현재 카테고리 찾기
  const category = categoriesData.find((cat) => cat.id === Number.parseInt(id));

  // 템플릿 필드 상태
  const [fields, setFields] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  // 카테고리 데이터 로드
  useEffect(() => {
    if (category) {
      // specTemplates에서 해당 카테고리의 템플릿 가져오기
      const template = specTemplates[category.name] || [];

      // 필드 타입 추가 (기본값은 text)
      const fieldsWithType = template.map((field) => ({
        ...field,
        type: field.type || "text",
      }));

      setFields(fieldsWithType);
    }
  }, [category]);

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

  // 저장 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();

    // 필드 ID 중복 체크
    const ids = fields.map((field) => field.id);
    const hasDuplicates = ids.some((id, index) => ids.indexOf(id) !== index);

    if (hasDuplicates) {
      alert("필드 ID가 중복되었습니다. 모든 필드 ID는 고유해야 합니다.");
      return;
    }

    // 필드 ID와 레이블이 비어있는지 체크
    const hasEmptyFields = fields.some((field) => !field.id || !field.label);

    if (hasEmptyFields) {
      alert("모든 필드는 ID와 레이블이 필요합니다.");
      return;
    }

    // 여기서 실제로는 API를 통해 서버에 저장
    console.log("템플릿 저장:", {
      categoryId: category.id,
      categoryName: category.name,
      fields: fields,
    });

    // 성공 메시지 표시
    alert("사양 템플릿이 저장되었습니다.");
    setHasChanges(false);

    // 카테고리 목록 페이지로 이동
    navigate("/categories");
  };

  // 취소 핸들러
  const handleCancel = () => {
    if (hasChanges) {
      const confirm = window.confirm(
        "변경 사항이 있습니다. 정말 취소하시겠습니까?"
      );
      if (!confirm) return;
    }

    navigate("/categories");
  };

  if (!category) {
    return (
      <PageContainer title="사양 템플릿 편집">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground">
            카테고리를 찾을 수 없습니다
          </h3>
          <p className="text-muted-foreground mt-2">
            요청하신 카테고리 ID가 존재하지 않습니다.
          </p>
          <Link
            to="/categories"
            className={`mt-4 inline-flex items-center px-4 py-2 rounded-md ${getButtonVariantClass(
              "primary"
            )}`}
          >
            카테고리 목록으로 돌아가기
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={`사양 템플릿 편집: ${category.name}`}>
      <div className="mb-6">
        <p className="text-muted-foreground">
          {category.name} 카테고리의 사양 템플릿을 편집합니다. 이 템플릿은 자산
          등록 시 해당 카테고리를 선택했을 때 표시될 사양 필드를 정의합니다.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-foreground">
              사양 필드 ({fields.length})
            </h3>
            <button
              type="button"
              onClick={addField}
              className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${getButtonVariantClass(
                "secondary"
              )}`}
            >
              <FaPlus className="mr-1.5 h-3 w-3" />
              필드 추가
            </button>
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
                                <FaGripVertical />
                              </div>

                              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    필드 ID{" "}
                                    <span className="text-destructive">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={field.id}
                                    onChange={(e) =>
                                      handleFieldChange(
                                        index,
                                        "id",
                                        e.target.value
                                      )
                                    }
                                    placeholder="field_id"
                                    className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    레이블{" "}
                                    <span className="text-destructive">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={field.label}
                                    onChange={(e) =>
                                      handleFieldChange(
                                        index,
                                        "label",
                                        e.target.value
                                      )
                                    }
                                    placeholder="필드 레이블"
                                    className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    필드 타입
                                  </label>
                                  <select
                                    value={field.type}
                                    onChange={(e) =>
                                      handleFieldChange(
                                        index,
                                        "type",
                                        e.target.value
                                      )
                                    }
                                    className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
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
                                  <FaArrowUp className="h-3.5 w-3.5" />
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
                                  <FaArrowDown className="h-3.5 w-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => removeField(index)}
                                  className="p-1.5 rounded-md text-destructive hover:bg-destructive/5"
                                  title="삭제"
                                >
                                  <FaTrash className="h-3.5 w-3.5" />
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
              onClick={handleCancel}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${getButtonVariantClass(
                "secondary"
              )}`}
            >
              <FaTimes className="mr-2 -ml-1 h-4 w-4" />
              취소
            </button>
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

      <div className="mt-6">
        <Link
          to={`/categories/edit/${id}`}
          className={`inline-flex items-center px-4 py-2 rounded-md ${getButtonVariantClass(
            "outline"
          )}`}
        >
          카테고리 정보 편집
        </Link>
      </div>
    </PageContainer>
  );
};

export default CategoriesTemplate;
