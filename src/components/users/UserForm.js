"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getButtonVariantClass } from "../../utils/themeUtils";
import {
  User,
  Mail,
  Building2,
  Briefcase,
  Shield,
  MapPin,
  Save,
  X,
  Calendar,
  Award,
  Phone,
  IdCard,
} from "lucide-react";
import { departments } from "../../data/userInitialData";
import PhoneInput from "../common/PhoneInput";
import DateInput from "../common/DateInput";
import RandomInput from "../common/RandomInput";
import ProfileImageUpload from "./ProfileImageUpload";
import useImageUpload from "../../hooks/useImageUpload";
import { deleteFileFromStorage } from "../../utils/fileUtils";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { sanitizeEmptyValues } from "../../utils/objectUtils";

const UserForm = ({
  user,
  onSubmit,
  onCancel,
  isEditing = false,
  departments = [],
  locations = [],
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    position: user?.position || "",
    title: user?.title || "",
    employeeNumber: user?.employeeNumber || "",
    department: user?.department || "",
    location: user?.location || "",
    phone: user?.phone || "",
    profileImage: user?.profileImage || "",
    extension: user?.extension || "",
    workType: user?.workType || "",
    joinDate: user?.joinDate || "",
    gender: user?.gender || "",
    notes: user?.notes || "",
  });

  const [errors, setErrors] = useState({});
  const [imageChanged, setImageChanged] = useState(false);
  const [previousImageUrl, setPreviousImageUrl] = useState(
    user?.profileImage || null
  );

  // 이미지 업로드 훅 사용
  const {
    imagePreview,
    isUploading,
    error: imageError,
    handleImageSelect: originalHandleImageSelect,
    uploadImage,
    resetImage: originalResetImage,
    cleanup: cleanupImage,
  } = useImageUpload({
    initialImageUrl: user?.profileImage || null,
    compress: true,
    maxSizeMB: 1,
    maxWidthOrHeight: 800,
  });

  // 이미지 선택 핸들러 래퍼 - 이미지 변경 상태 추적
  const handleImageSelect = (file) => {
    setImageChanged(true);
    originalHandleImageSelect(file);
  };

  // 이미지 초기화 핸들러 래퍼 - 이미지 변경 상태 추적
  const resetImage = () => {
    setImageChanged(true);
    originalResetImage();
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      cleanupImage();
    };
  }, [cleanupImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 부서가 변경되면 해당 부서의 locationId를 기반으로 위치 자동 설정
    if (name === "department") {
      const selectedDepartment = departments.find(
        (dept) => dept.name === value
      );
      if (selectedDepartment && selectedDepartment.locationId) {
        const selectedLocation = locations.find(
          (loc) => loc.id === selectedDepartment.locationId
        );
        if (selectedLocation) {
          setFormData((prev) => ({
            ...prev,
            [name]: value,
            location: selectedLocation.name,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            [name]: value,
            location: "",
          }));
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          location: "",
        }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "이름을 입력해주세요";
    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "유효한 이메일 형식이 아닙니다";
    }
    if (!formData.department) newErrors.department = "부서를 선택해주세요";
    if (!formData.gender) newErrors.gender = "성별을 선택해주세요";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrors({ submit: "유효성 검사 실패로 제출이 중단되었습니다" });
      return;
    }

    try {
      // 제출할 데이터 준비
      let submitData = { ...formData };

      // 이미지 처리
      if (imageChanged) {
        if (imagePreview) {
          const imageUrl = await uploadImage("users/profiles");
          submitData.profileImage = imageUrl;
        } else {
          submitData.profileImage = "";
        }
      }

      // 빈 값 처리
      submitData = sanitizeEmptyValues(submitData);

      // 폼 제출
      await onSubmit(submitData);
    } catch (error) {
      console.error("[사용자폼] 폼 제출 중 오류 발생:", error);
      setErrors({ submit: error.message });
    }
  };

  // 부서 변경 시 위치 자동 설정
  const handleDepartmentChange = (e) => {
    const selectedDepartment = departments.find(
      (dept) => dept.name === e.target.value
    );

    // 부서가 선택되었고 해당 부서에 연동된 위치가 있는 경우
    if (selectedDepartment && selectedDepartment.locationId) {
      const defaultLocation = locations.find(
        (loc) => loc.id === selectedDepartment.locationId
      );

      setFormData((prev) => ({
        ...prev,
        department: e.target.value,
        location: defaultLocation ? defaultLocation.name : prev.location,
      }));
    } else {
      // 부서가 선택되지 않았거나 연동된 위치가 없는 경우
      setFormData((prev) => ({
        ...prev,
        department: e.target.value,
      }));
    }
  };

  // 위치 변경 시
  const handleLocationChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      location: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">프로필 이미지</label>
        <ProfileImageUpload
          currentImage={formData.profileImage}
          onImageSelect={handleImageSelect}
          onReset={resetImage}
          imagePreview={imagePreview}
          isUploading={isUploading}
          error={imageError}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            사원번호 <span className="text-red-500">*</span>
          </label>
          <RandomInput
            name="employeeNumber"
            value={formData.employeeNumber}
            onChange={handleChange}
            type="number"
            length={6}
            showLengthSelector
            required
            placeholder="예: 123456"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            성별 <span className="text-red-500">*</span>
          </label>
          <select
            name="gender"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">성별 선택</option>
            <option value="남성">남성</option>
            <option value="여성">여성</option>
          </select>
          {errors.gender && (
            <p className="text-sm text-red-500">{errors.gender}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            이메일 <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">사내번호</label>
          <input
            type="tel"
            name="extension"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formData.extension}
            onChange={handleChange}
            placeholder="예: 1234"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">개인연락처</label>
          <PhoneInput
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="예: 010-1234-5678"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">직위</label>
          <input
            type="text"
            name="position"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formData.position}
            onChange={handleChange}
            placeholder="예: 사원, 대리, 과장 등"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">직책</label>
          <input
            type="text"
            name="title"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formData.title}
            onChange={handleChange}
            placeholder="예: 팀장, 부장 등"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            부서 <span className="text-red-500">*</span>
          </label>
          <select
            name="department"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formData.department}
            onChange={handleDepartmentChange}
            required
          >
            <option value="">부서 선택</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">위치</label>
          <select
            name="location"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formData.location}
            onChange={handleLocationChange}
            required
          >
            <option value="">위치 선택</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
          {formData.department && (
            <p className="text-xs text-muted-foreground mt-1">
              {departments.find((dept) => dept.name === formData.department)
                ?.locationId
                ? "부서에 연동된 위치가 자동으로 선택됩니다. 필요시 다른 위치를 선택할 수 있습니다."
                : "이 부서는 특정 위치와 연동되어 있지 않습니다. 위치를 선택해주세요."}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">근무형태</label>
          <select
            name="workType"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formData.workType}
            onChange={handleChange}
          >
            <option value="">근무형태 선택</option>
            <option value="정규직">정규직</option>
            <option value="시간제">시간제</option>
            <option value="계약직">계약직</option>
            <option value="임시직">임시직</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">입사일</label>
          <DateInput
            name="joinDate"
            value={formData.joinDate}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium">비고</label>
          <textarea
            name="notes"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="간단한 메모를 입력하세요"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent disabled:opacity-50"
        >
          <X className="h-4 w-4" />
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "저장 중..." : "저장"}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
