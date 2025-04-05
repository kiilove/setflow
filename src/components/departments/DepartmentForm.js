"use client";

import { useState } from "react";
import { getButtonVariantClass } from "../../utils/themeUtils";
import { Building2, Save, X, MapPin } from "lucide-react";
import DepartmentIconSelector from "./DepartmentIconSelector";

const DepartmentForm = ({
  department,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    manager: "",
    location: "",
    description: "",
    icon: "Building",
    iconColor: "bg-blue-100",
    iconTextColor: "text-blue-500",
    iconColorName: "파랑",
    ...department,
  });

  const [errors, setErrors] = useState({});
  const [selectedIcon, setSelectedIcon] = useState(formData.icon || "Building");
  const [selectedColor, setSelectedColor] = useState({
    name: formData.iconColorName || "파랑",
    bg: formData.iconColor || "bg-blue-100",
    text: formData.iconTextColor || "text-blue-500",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "부서 이름을 입력해주세요.";
    if (!formData.manager.trim())
      newErrors.manager = "관리자 이름을 입력해주세요.";
    if (!formData.location.trim())
      newErrors.location = "부서 위치를 입력해주세요.";
    if (!formData.description.trim())
      newErrors.description = "부서 설명을 입력해주세요.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // 아이콘 정보 추가
      const updatedFormData = {
        ...formData,
        icon: selectedIcon,
        iconColor: selectedColor.bg,
        iconTextColor: selectedColor.text,
        iconColorName: selectedColor.name,
      };
      onSubmit(updatedFormData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            <span className="flex items-center">
              <Building2 className="mr-1 text-primary h-4 w-4" />
              부서 이름 *
            </span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.name ? "border-destructive" : "border-input"
            } bg-background focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="manager" className="block text-sm font-medium mb-1">
            <span className="flex items-center">
              <Building2 className="mr-1 text-primary h-4 w-4" />
              관리자 이름 *
            </span>
          </label>
          <input
            type="text"
            id="manager"
            name="manager"
            value={formData.manager}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.manager ? "border-destructive" : "border-input"
            } bg-background focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.manager && (
            <p className="mt-1 text-sm text-destructive">{errors.manager}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            <span className="flex items-center">
              <MapPin className="mr-1 text-primary h-4 w-4" />
              부서 위치 *
            </span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.location ? "border-destructive" : "border-input"
            } bg-background focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.location && (
            <p className="mt-1 text-sm text-destructive">{errors.location}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            <span className="flex items-center">
              <Building2 className="mr-1 text-primary h-4 w-4" />
              부서 설명 *
            </span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.description ? "border-destructive" : "border-input"
            } bg-background focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-destructive">
              {errors.description}
            </p>
          )}
        </div>

        {/* 부서 아이콘 선택기 추가 */}
        <DepartmentIconSelector
          selectedIcon={selectedIcon}
          selectedColor={selectedColor}
          onSelectIcon={(icon) => setSelectedIcon(icon)}
          onSelectColor={(color) => setSelectedColor(color)}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 rounded-md ${getButtonVariantClass("outline")}`}
        >
          <span className="flex items-center">
            <X className="mr-2 h-4 w-4" />
            취소
          </span>
        </button>
        <button
          type="submit"
          className={`px-4 py-2 rounded-md ${getButtonVariantClass("primary")}`}
        >
          <span className="flex items-center">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "수정 완료" : "저장"}
          </span>
        </button>
      </div>
    </form>
  );
};

export default DepartmentForm;
