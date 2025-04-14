"use client";

import { useState, useEffect } from "react";
import { getButtonVariantClass } from "../../utils/themeUtils";
import { Save, X, Plus } from "lucide-react";
import IconSelector from "./IconSelector";
import { useFirestore } from "../../hooks/useFirestore";

const CategoriesForm = ({ initialData, onSubmit, onCancel }) => {
  // 기본 상태 관리
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    group: initialData?.group || "",
    depreciation: initialData?.depreciation || {
      method: "declining-balance",
      years: 5,
      residualValueType: "fixed",
      residualValue: 1000,
    },
  });

  const [specFields, setSpecFields] = useState(initialData?.specFields || []);
  const [selectedIcon, setSelectedIcon] = useState(
    initialData?.icon || "Package"
  );
  const [selectedColor, setSelectedColor] = useState({
    name: initialData?.iconColorName || "기본",
    bg: initialData?.iconColor || "bg-gray-100",
    text: initialData?.iconTextColor || "text-gray-500",
  });

  // 기존 import 문 유지하고 useState 부분에 다음 상태 추가:
  const [groups, setGroups] = useState([]);
  const [newGroupInput, setNewGroupInput] = useState("");
  const [isAddingNewGroup, setIsAddingNewGroup] = useState(false);
  const { getCollection, addDocument } = useFirestore("categoryGroups");

  // 감가상각 방법 옵션
  const depreciationMethods = [
    { value: "straight-line", label: "정액법 (Straight-Line)" },
    { value: "declining-balance", label: "정률법 (Declining Balance)" },
    { value: "sum-of-years-digits", label: "연수합계법 (Sum-of-Years-Digits)" },
    {
      value: "units-of-production",
      label: "생산량비례법 (Units of Production)",
    },
  ];

  // 기본 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 사양 필드 변경 핸들러
  const handleSpecFieldChange = (index, field, value) => {
    const updatedFields = [...specFields];
    updatedFields[index][field] = value;
    setSpecFields(updatedFields);
  };

  // 사양 필드 추가
  const addSpecField = () => {
    setSpecFields([
      ...specFields,
      { id: "", label: "", type: "text", value: "" },
    ]);
  };

  // 사양 필드 제거
  const removeSpecField = (index) => {
    const newSpecFields = [...specFields];
    newSpecFields.splice(index, 1);
    setSpecFields(newSpecFields);
  };

  // 감가상각 필드 변경 처리
  const handleDepreciationChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      depreciation: {
        ...formData.depreciation,
        [name]:
          name === "years" || name === "residualValue"
            ? name === "residualValue" &&
              formData.depreciation.residualValueType === "fixed"
              ? Number.parseInt(value)
              : name === "years"
              ? Number.parseInt(value)
              : Number.parseFloat(value)
            : value,
      },
    });
  };

  // 잔존가치 유형 변경 처리
  const handleResidualValueTypeChange = (type) => {
    setFormData({
      ...formData,
      depreciation: {
        ...formData.depreciation,
        residualValueType: type,
        residualValue: type === "percentage" ? 10 : 1000,
      },
    });
  };

  // 그룹 데이터 로드를 위한 useEffect 추가:
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getCollection();
        setGroups(data);
      } catch (error) {
        console.error(
          "카테고리 그룹을 불러오는 중 오류가 발생했습니다:",
          error
        );
      }
    };

    fetchGroups();
  }, [getCollection]);

  // 그룹 관련 핸들러 함수 추가:
  const handleAddNewGroup = async () => {
    if (!newGroupInput.trim()) return;

    // 이미 존재하는 그룹인지 확인
    const existingGroup = groups.find(
      (g) => g.name.toLowerCase() === newGroupInput.trim().toLowerCase()
    );
    if (existingGroup) {
      // 이미 존재하는 그룹이면 해당 그룹 선택
      setFormData({
        ...formData,
        group: existingGroup.name,
      });
    } else {
      try {
        // 새 그룹 추가 - Firestore에 저장
        const newGroup = {
          name: newGroupInput.trim(),
          description: `${newGroupInput.trim()} 그룹`,
          icon: "Package",
          color: "bg-gray-100",
          textColor: "text-gray-500",
        };

        // Firestore에 그룹 추가
        const newGroupId = await addDocument(newGroup);

        // 상태 업데이트
        const groupWithId = { ...newGroup, id: newGroupId };
        setGroups([...groups, groupWithId]);
        setFormData({
          ...formData,
          group: newGroup.name,
        });
      } catch (error) {
        console.error("그룹 추가 중 오류가 발생했습니다:", error);
        alert("그룹 추가에 실패했습니다.");
      }
    }

    setNewGroupInput("");
    setIsAddingNewGroup(false);
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();

    // 사양 필드의 id 값이 비어있으면 자동으로 생성
    const usedBaseIds = {};
    const finalSpecFields = specFields.map((field) => {
      // 이미 ID가 있으면 그대로 사용
      if (field.id) return field;

      // 레이블이 있으면 레이블 기반으로 ID 생성
      if (field.label) {
        // 한글 레이블을 영문 id로 변환
        let baseId = field.label
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_]/g, "");

        // 빈 ID 처리
        if (!baseId) baseId = "field";

        // 기본 ID에 _id 접미사 추가
        baseId = baseId + "_id";

        // 중복 ID 처리
        if (!usedBaseIds[baseId]) {
          usedBaseIds[baseId] = 1;
          return { ...field, id: baseId };
        } else {
          // 이미 사용된 ID면 숫자 접미사 추가 (001, 002, ...)
          const count = usedBaseIds[baseId];
          usedBaseIds[baseId] = count + 1;
          const uniqueId = `${baseId}_${count.toString().padStart(3, "0")}`;
          return { ...field, id: uniqueId };
        }
      }

      // 레이블이 없으면 기본 ID 사용
      return { ...field, id: "field_id" };
    });

    // 최종 데이터 준비
    const finalFormData = {
      ...formData,
      specFields: finalSpecFields,
      icon: selectedIcon,
      iconColor: selectedColor.bg,
      iconTextColor: selectedColor.text,
      iconColorName: selectedColor.name,
    };

    // 부모 컴포넌트에 데이터 전달
    onSubmit(finalFormData);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div>
          <div className="flex items-center mb-4 pb-2 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">기본 정보</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {/* 카테고리 그룹 선택 필드 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                카테고리 그룹 <span className="text-destructive">*</span>
              </label>

              {/* 현재 그룹 목록 표시 */}
              <div className="flex flex-wrap gap-2 mb-3">
                {groups.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, group: group.name })
                    }
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      formData.group === group.name
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                    }`}
                  >
                    {group.name}
                  </button>
                ))}
              </div>

              {/* 새 그룹 추가 UI */}
              {isAddingNewGroup ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newGroupInput}
                    onChange={(e) => setNewGroupInput(e.target.value)}
                    placeholder="새 그룹 이름 입력"
                    className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddNewGroup())
                    }
                  />
                  <button
                    type="button"
                    onClick={handleAddNewGroup}
                    className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    추가
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewGroup(false);
                      setNewGroupInput("");
                    }}
                    className="px-3 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingNewGroup(true)}
                  className="inline-flex items-center px-3 py-1.5 rounded-md text-sm bg-muted hover:bg-muted/80 text-muted-foreground"
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />새 그룹 추가
                </button>
              )}

              {/* 선택된 그룹 표시 */}
              {formData.group && (
                <div className="mt-2 p-2 bg-muted/50 rounded-md">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">선택된 그룹:</span>{" "}
                    {formData.group}
                  </p>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                카테고리가 속할 그룹을 선택하거나 새로운 그룹을 추가하세요.
              </p>
            </div>

            {/* 카테고리명 입력 필드 */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground"
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
                className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
              <p className="text-xs text-muted-foreground">
                자산을 분류할 카테고리 이름을 입력하세요.
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-foreground"
              >
                설명
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
              <p className="text-xs text-muted-foreground">
                카테고리에 대한 간략한 설명을 입력하세요.
              </p>
            </div>

            {/* 아이콘 선택기 */}
            <IconSelector
              selectedIcon={selectedIcon}
              selectedColor={selectedColor}
              onSelectIcon={(icon) => setSelectedIcon(icon)}
              onSelectColor={(color) => setSelectedColor(color)}
            />
          </div>
        </div>

        {/* 감가상각 설정 */}
        <div>
          <div className="flex items-center mb-4 pb-2 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">
              감가상각 설정
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="method"
                className="block text-sm font-medium text-foreground"
              >
                감가상각 방법 <span className="text-destructive">*</span>
              </label>
              <select
                id="method"
                name="method"
                value={formData.depreciation.method}
                onChange={handleDepreciationChange}
                className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              >
                {depreciationMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                {formData.depreciation.method === "straight-line" &&
                  "정액법: 자산의 가치가 매년 동일한 금액으로 감가상각됩니다."}
                {formData.depreciation.method === "declining-balance" &&
                  "정률법: 자산의 장부가치에 일정 비율을 곱하여 감가상각됩니다."}
                {formData.depreciation.method === "sum-of-years-digits" &&
                  "연수합계법: 자산의 내용연수 합계를 기준으로 감가상각됩니다."}
                {formData.depreciation.method === "units-of-production" &&
                  "생산량비례법: 자산의 총 예상 생산량에 대한 실제 생산량 비율로 감가상각됩니다."}
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="years"
                className="block text-sm font-medium text-foreground"
              >
                내용연수 (년) <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                id="years"
                name="years"
                value={formData.depreciation.years}
                onChange={handleDepreciationChange}
                min={1}
                max={50}
                required
                className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
              <p className="text-xs text-muted-foreground">
                자산의 예상 사용 기간을 년 단위로 입력하세요.
              </p>
            </div>

            {/* 잔존가치 유형 선택 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                잔존가치 유형 <span className="text-destructive">*</span>
              </label>
              <div className="flex space-x-4 mb-3">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="residualValueType"
                    checked={
                      formData.depreciation.residualValueType === "percentage"
                    }
                    onChange={() => handleResidualValueTypeChange("percentage")}
                    className="h-4 w-4 text-primary border-border focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-foreground">
                    퍼센트 (%)
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="residualValueType"
                    checked={
                      formData.depreciation.residualValueType === "fixed"
                    }
                    onChange={() => handleResidualValueTypeChange("fixed")}
                    className="h-4 w-4 text-primary border-border focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-foreground">
                    정액 (원)
                  </span>
                </label>
              </div>
            </div>

            {/* 잔존가치 입력 필드 - 유형에 따라 다르게 표시 */}
            {formData.depreciation.residualValueType === "percentage" ? (
              <div className="space-y-2">
                <label
                  htmlFor="residualValue"
                  className="block text-sm font-medium text-foreground"
                >
                  잔존가치 (%) <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  id="residualValue"
                  name="residualValue"
                  value={formData.depreciation.residualValue}
                  onChange={handleDepreciationChange}
                  min={0}
                  max={100}
                  step="0.1"
                  required
                  className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
                <p className="text-xs text-muted-foreground">
                  내용연수 종료 후 자산의 예상 잔존가치를 원가 대비 백분율로
                  입력하세요.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <label
                  htmlFor="residualValue"
                  className="block text-sm font-medium text-foreground"
                >
                  잔존가치 (원) <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  id="residualValue"
                  name="residualValue"
                  value={formData.depreciation.residualValue}
                  onChange={handleDepreciationChange}
                  min={0}
                  required
                  className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
                <p className="text-xs text-muted-foreground">
                  내용연수 종료 후 자산의 예상 잔존가치를 원 단위로 입력하세요.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 사양 필드 */}
        <div>
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">사양 필드</h3>
            <button
              type="button"
              onClick={addSpecField}
              className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${getButtonVariantClass(
                "secondary"
              )}`}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              필드 추가
            </button>
          </div>

          {specFields.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-border rounded-md">
              <p className="text-muted-foreground">
                아직 정의된 사양 필드가 없습니다. '필드 추가' 버튼을 클릭하여 새
                필드를 추가하세요.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {specFields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-md border border-border bg-background"
                >
                  <div className="flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                          필드 ID
                        </label>
                        <input
                          type="text"
                          value={field.id || ""}
                          onChange={(e) =>
                            handleSpecFieldChange(index, "id", e.target.value)
                          }
                          placeholder="영문 소문자, 숫자, 언더스코어만 사용"
                          className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                        />
                        <p className="text-xs text-muted-foreground">
                          비워두면 자동 생성됩니다
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                          필드명 <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          value={field.label || ""}
                          onChange={(e) =>
                            handleSpecFieldChange(
                              index,
                              "label",
                              e.target.value
                            )
                          }
                          required
                          className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                          필드 유형
                        </label>
                        <select
                          value={field.type || "text"}
                          onChange={(e) =>
                            handleSpecFieldChange(index, "type", e.target.value)
                          }
                          className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                        >
                          <option value="text">텍스트</option>
                          <option value="number">숫자</option>
                          <option value="date">날짜</option>
                          <option value="select">선택</option>
                          <option value="checkbox">체크박스</option>
                          <option value="textarea">텍스트 영역</option>
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
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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

export default CategoriesForm;
