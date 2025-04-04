"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getButtonVariantClass } from "../../utils/themeUtils";
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  BadgeCheck,
  Calendar,
  Shield,
  Lock,
  Save,
  X,
} from "lucide-react";

const UserForm = ({ user, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    employeeId: "",
    joinDate: "",
    status: "active",
    permissions: "user",
    profileImage: null,
    ...user,
  });

  const [departments, setDepartments] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // 부서 목록 가져오기 (실제 구현에서는 API 호출)
    setDepartments([
      { id: 1, name: "개발팀" },
      { id: 2, name: "마케팅팀" },
      { id: 3, name: "디자인팀" },
      { id: 4, name: "영업팀" },
      { id: 5, name: "인사팀" },
      { id: 6, name: "재무팀" },
      { id: 7, name: "IT 인프라팀" },
      { id: 8, name: "고객지원팀" },
    ]);

    // 수정 모드일 경우 프로필 이미지 미리보기 설정
    if (isEditing && user?.profileImageUrl) {
      setPreviewImage(user.profileImageUrl);
    }
  }, [isEditing, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));

      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
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
      newErrors.employeeId = newErrors.position = "직책을 입력해주세요";
    if (!formData.employeeId.trim())
      newErrors.employeeId = "사원번호를 입력해주세요";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 프로필 이미지 업로드 */}
        <div className="md:col-span-2 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-border bg-muted mb-4">
            {previewImage ? (
              <img
                src={previewImage || "/placeholder.svg"}
                alt="프로필 미리보기"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                <User size={40} className="text-gray-400" />
              </div>
            )}
          </div>
          <label className="cursor-pointer">
            <span
              className={`px-4 py-2 rounded-md ${getButtonVariantClass(
                "secondary"
              )}`}
            >
              프로필 이미지 {isEditing ? "변경" : "업로드"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
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
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              <span className="flex items-center">
                <Phone className="mr-1 text-green-500 h-4 w-4" />
                전화번호
              </span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
              value={formData.department}
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
              value={formData.position}
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
            <label
              htmlFor="employeeId"
              className="block text-sm font-medium mb-1"
            >
              <span className="flex items-center">
                <BadgeCheck className="mr-1 text-red-500 h-4 w-4" />
                사원번호 *
              </span>
            </label>
            <input
              type="text"
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.employeeId ? "border-destructive" : "border-input"
              } bg-background focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            {errors.employeeId && (
              <p className="mt-1 text-sm text-destructive">
                {errors.employeeId}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 추가 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="joinDate" className="block text-sm font-medium mb-1">
            <span className="flex items-center">
              <Calendar className="mr-1 text-teal-500 h-4 w-4" />
              입사일
            </span>
          </label>
          <input
            type="date"
            id="joinDate"
            name="joinDate"
            value={formData.joinDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="active">재직중</option>
            <option value="inactive">퇴사</option>
            <option value="leave">휴직</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="permissions"
            className="block text-sm font-medium mb-1"
          >
            <span className="flex items-center">
              <Lock className="mr-1 text-indigo-500 h-4 w-4" />
              권한
            </span>
          </label>
          <select
            id="permissions"
            name="permissions"
            value={formData.permissions}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="user">일반 사용자</option>
            <option value="manager">관리자</option>
            <option value="admin">시스템 관리자</option>
          </select>
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
