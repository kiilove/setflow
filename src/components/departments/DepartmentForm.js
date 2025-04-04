"use client";

import { useState, useEffect } from "react";
import { getButtonVariantClass } from "../../utils/themeUtils";
import {
  FaSave,
  FaTimes,
  FaBuilding,
  FaUser,
  FaMapMarkerAlt,
  FaFileAlt,
} from "react-icons/fa";

const DepartmentForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    manager: "",
    location: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // 초기 데이터 설정
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        manager: initialData.manager || "",
        location: initialData.location || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 필드가 수정되면 해당 필드를 touched로 표시
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // 에러 검증
    validateField(name, value);
  };

  // 단일 필드 유효성 검사
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "부서명은 필수 입력 항목입니다.";
        } else {
          delete newErrors.name;
        }
        break;
      case "manager":
        if (!value.trim()) {
          newErrors.manager = "관리자는 필수 입력 항목입니다.";
        } else {
          delete newErrors.manager;
        }
        break;
      case "location":
        if (!value.trim()) {
          newErrors.location = "위치는 필수 입력 항목입니다.";
        } else {
          delete newErrors.location;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 전체 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};
    const newTouched = {};

    // 모든 필드를 touched로 표시
    Object.keys(formData).forEach((key) => {
      newTouched[key] = true;
    });
    setTouched(newTouched);

    // 필수 필드 검증
    if (!formData.name.trim()) {
      newErrors.name = "부서명은 필수 입력 항목입니다.";
    }
    if (!formData.manager.trim()) {
      newErrors.manager = "관리자는 필수 입력 항목입니다.";
    }
    if (!formData.location.trim()) {
      newErrors.location = "위치는 필수 입력 항목입니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // 위치 옵션 목록
  const locationOptions = [
    "본사 1층",
    "본사 2층",
    "본사 3층",
    "본사 4층",
    "지사 1층",
    "지사 2층",
    "데이터센터",
    "창고",
    "기타",
  ];

  // 수정 모드 여부 확인 (initialData에 id가 있으면 수정 모드)
  const isEditing = initialData && initialData.id;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 부서명 */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="flex items-center text-sm font-medium text-foreground"
        >
          <FaBuilding className="mr-2 text-primary" />
          부서명 <span className="text-destructive ml-1">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="부서명을 입력하세요"
          className={`w-full px-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            touched.name && errors.name ? "border-destructive" : "border-input"
          }`}
        />
        {touched.name && errors.name && (
          <p className="text-destructive text-sm">{errors.name}</p>
        )}
      </div>

      {/* 관리자 */}
      <div className="space-y-2">
        <label
          htmlFor="manager"
          className="flex items-center text-sm font-medium text-foreground"
        >
          <FaUser className="mr-2 text-primary" />
          관리자 <span className="text-destructive ml-1">*</span>
        </label>
        <input
          type="text"
          id="manager"
          name="manager"
          value={formData.manager}
          onChange={handleChange}
          placeholder="관리자 이름을 입력하세요"
          className={`w-full px-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            touched.manager && errors.manager
              ? "border-destructive"
              : "border-input"
          }`}
        />
        {touched.manager && errors.manager && (
          <p className="text-destructive text-sm">{errors.manager}</p>
        )}
      </div>

      {/* 위치 */}
      <div className="space-y-2">
        <label
          htmlFor="location"
          className="flex items-center text-sm font-medium text-foreground"
        >
          <FaMapMarkerAlt className="mr-2 text-primary" />
          위치 <span className="text-destructive ml-1">*</span>
        </label>
        <select
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            touched.location && errors.location
              ? "border-destructive"
              : "border-input"
          }`}
        >
          <option value="">위치 선택</option>
          {locationOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {touched.location && errors.location && (
          <p className="text-destructive text-sm">{errors.location}</p>
        )}
      </div>

      {/* 설명 */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="flex items-center text-sm font-medium text-foreground"
        >
          <FaFileAlt className="mr-2 text-primary" />
          설명
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="부서에 대한 설명을 입력하세요"
          rows={4}
          className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* 버튼 그룹 */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${getButtonVariantClass(
            "outline"
          )}`}
        >
          <FaTimes className="mr-2 -ml-1 h-4 w-4" />
          취소
        </button>
        <button
          type="submit"
          className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${getButtonVariantClass(
            "primary"
          )}`}
        >
          <FaSave className="mr-2 -ml-1 h-4 w-4" />
          {isEditing ? "수정" : "저장"}
        </button>
      </div>
    </form>
  );
};

export default DepartmentForm;
