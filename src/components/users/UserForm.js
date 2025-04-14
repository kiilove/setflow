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
} from "lucide-react";
import { departments } from "../../data/userInitialData";
import PhoneInput from "../common/PhoneInput";
import DateInput from "../common/DateInput";
import EmployeeIdInput from "../common/EmployeeIdInput";
import ProfileImageUpload from "./ProfileImageUpload";
import useImageUpload from "../../hooks/useImageUpload";
import { deleteFileFromStorage } from "../../hooks/storageUtils";

const UserForm = ({ user, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    employeeId: "",
    joinDate: "",
    status: "재직중",
    role: "사용자",
    location: "",
    ...user,
  });

  const [errors, setErrors] = useState({});
  const [imageChanged, setImageChanged] = useState(false);
  const [previousImageUrl, setPreviousImageUrl] = useState(
    user?.profileImage || null
  );

  // 이미지 업로드 훅 사용
  const {
    imagePreview,
    isCompressed,
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
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    if (!formData.position.trim()) newErrors.position = "직책을 입력해주세요";
    if (!formData.employeeId.trim())
      newErrors.employeeId = "사원번호를 입력해주세요";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        let profileImageUrl = user?.profileImage;

        // 이미지가 변경된 경우에만 처리
        if (imageChanged) {
          // 이미지가 삭제된 경우 (resetImage 호출 후)
          if (!imagePreview && previousImageUrl) {
            try {
              await deleteFileFromStorage(previousImageUrl);
              console.log("기존 프로필 이미지 삭제 완료:", previousImageUrl);
              profileImageUrl = null;
            } catch (error) {
              console.error("기존 프로필 이미지 삭제 중 오류 발생:", error);
              // 오류가 발생해도 계속 진행
            }
          }
          // 새 이미지가 업로드된 경우
          else if (imagePreview) {
            // 새 이미지 업로드
            const newImageUrl = await uploadImage("users/profiles");

            // 업로드 성공 및 기존 이미지가 있으면 기존 이미지 삭제
            if (
              newImageUrl &&
              previousImageUrl &&
              newImageUrl !== previousImageUrl
            ) {
              try {
                await deleteFileFromStorage(previousImageUrl);
                console.log("기존 프로필 이미지 삭제 완료:", previousImageUrl);
              } catch (error) {
                console.error("기존 프로필 이미지 삭제 중 오류 발생:", error);
                // 오류가 발생해도 계속 진행
              }
            }

            profileImageUrl = newImageUrl;
          }
        }

        // 폼 데이터와 이미지 URL 결합
        const userData = {
          ...formData,
          profileImage: profileImageUrl,
        };

        // createdAt, updatedAt은 useFirestore에서 처리하므로 여기서는 제거

        onSubmit(userData);
      } catch (error) {
        console.error("사용자 등록 중 오류 발생:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 프로필 이미지 업로드 - 새로운 컴포넌트 사용 */}
        <div className="md:col-span-2 flex justify-center">
          <ProfileImageUpload
            imagePreview={imagePreview}
            onImageSelect={handleImageSelect}
            onReset={resetImage}
            isCompressed={isCompressed}
            isUploading={isUploading}
            error={imageError}
          />
        </div>

        {/* 기본 정보 */}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              <span className="flex items-center">
                <User className="mr-1 text-primary h-4 w-4" />
                이름 *
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
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              <span className="flex items-center">
                <Mail className="mr-1 text-blue-500 h-4 w-4" />
                이메일 *
              </span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.email ? "border-destructive" : "border-input"
              } bg-background focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div>
            <PhoneInput
              id="phone"
              name="phone"
              label="전화번호"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="010-0000-0000"
            />
          </div>
        </div>

        {/* 직무 정보 */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium mb-1"
            >
              <span className="flex items-center">
                <Building2 className="mr-1 text-purple-500 h-4 w-4" />
                부서 *
              </span>
            </label>
            <select
              id="department"
              name="department"
              value={formData.department || ""}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.department ? "border-destructive" : "border-input"
              } bg-background focus:outline-none focus:ring-2 focus:ring-primary`}
            >
              <option value="">부서 선택</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="mt-1 text-sm text-destructive">
                {errors.department}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium mb-1"
            >
              <span className="flex items-center">
                <Briefcase className="mr-1 text-amber-500 h-4 w-4" />
                직책 *
              </span>
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position || ""}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.position ? "border-destructive" : "border-input"
              } bg-background focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            {errors.position && (
              <p className="mt-1 text-sm text-destructive">{errors.position}</p>
            )}
          </div>

          <div>
            <EmployeeIdInput
              id="employeeId"
              name="employeeId"
              label="사원번호"
              value={formData.employeeId || ""}
              onChange={handleChange}
              required={true}
              isEditing={isEditing}
            />
          </div>
        </div>
      </div>

      {/* 추가 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <DateInput
            id="joinDate"
            name="joinDate"
            label="입사일"
            value={formData.joinDate || ""}
            onChange={handleChange}
            placeholder="YYYY-MM-DD"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            <span className="flex items-center">
              <Shield className="mr-1 text-cyan-500 h-4 w-4" />
              상태
            </span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status || "재직중"}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="재직중">재직중</option>
            <option value="휴직중">휴직중</option>
            <option value="퇴사">퇴사</option>
          </select>
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium mb-1">
            <span className="flex items-center">
              <Shield className="mr-1 text-indigo-500 h-4 w-4" />
              권한
            </span>
          </label>
          <select
            id="role"
            name="role"
            value={formData.role || "사용자"}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="사용자">일반 사용자</option>
            <option value="편집자">편집자</option>
            <option value="관리자">관리자</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            <span className="flex items-center">
              <MapPin className="mr-1 text-pink-500 h-4 w-4" />
              위치
            </span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="예: 본사 3층"
          />
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end space-x-3 pt-4">
        <Link
          to="/users"
          className={`px-4 py-2 rounded-md ${getButtonVariantClass("outline")}`}
        >
          <span className="flex items-center">
            <X className="mr-2 h-4 w-4" />
            취소
          </span>
        </Link>
        <button
          type="submit"
          className={`px-4 py-2 rounded-md ${getButtonVariantClass("primary")}`}
          disabled={isUploading}
        >
          <span className="flex items-center">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "수정 완료" : "사용자 등록"}
          </span>
        </button>
      </div>
    </form>
  );
};

export default UserForm;
