"use client";

import { useState } from "react";
import { getButtonVariantClass } from "../../utils/themeUtils";
import { Save, X, Building } from "lucide-react";
import DepartmentIconSelector from "./DepartmentIconSelector";

const DepartmentForm = ({ initialData, onSubmit, onCancel }) => {
  // 기본 상태 관리
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    locationId: initialData?.locationId || "",
  });

  const [selectedIcon, setSelectedIcon] = useState(
    initialData?.icon || "Building"
  );
  const [selectedColor, setSelectedColor] = useState({
    name: initialData?.iconColorName || "기본",
    bg: initialData?.iconColor || "bg-gray-100",
    text: initialData?.iconTextColor || "text-gray-500",
  });

  const [errors, setErrors] = useState({});
  const [locations, setLocations] = useState([
    { id: "loc1", name: "본사" },
    { id: "loc2", name: "서울 지사" },
    { id: "loc3", name: "부산 지사" },
    // 실제로는 API에서 가져올 위치 데이터
  ]);

  // 기본 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "부서명을 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // 최종 데이터 준비
      const finalFormData = {
        ...formData,
        icon: selectedIcon,
        iconColor: selectedColor.bg,
        iconTextColor: selectedColor.text,
        iconColorName: selectedColor.name,
      };

      // 부모 컴포넌트에 데이터 전달
      onSubmit(finalFormData);
    }
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
            {/* 부서명 입력 필드 */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground"
              >
                부서명 <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    errors.name ? "border-destructive" : "border-input"
                  } bg-background px-4 py-2 pl-10 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors`}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Building className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
              <p className="text-xs text-muted-foreground">
                조직 내 부서의 공식 명칭을 입력하세요.
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
                부서에 대한 간략한 설명을 입력하세요.
              </p>
            </div>

            {/* 위치 선택 필드 */}
            <div className="space-y-2">
              <label
                htmlFor="locationId"
                className="block text-sm font-medium text-foreground"
              >
                위치
              </label>
              <select
                id="locationId"
                name="locationId"
                value={formData.locationId}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              >
                <option value="">위치 선택</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                부서가 위치한 장소를 선택하세요.
              </p>
            </div>

            {/* 아이콘 선택기 */}
            <DepartmentIconSelector
              selectedIcon={selectedIcon}
              selectedColor={selectedColor}
              onSelectIcon={(icon) => setSelectedIcon(icon)}
              onSelectColor={(color) => setSelectedColor(color)}
            />
          </div>
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

export default DepartmentForm;
