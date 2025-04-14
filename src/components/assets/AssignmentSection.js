"use client";

import { useState, useEffect } from "react";
import { FaUser, FaBuilding, FaMapMarkerAlt } from "react-icons/fa";
import DateInput from "../common/DateInput";
import PhoneInput from "../common/PhoneInput";
import { useFirestore } from "../../hooks/useFirestore";

/**
 * 자산 할당 정보 입력 섹션
 * @param {Object} props
 * @param {Object} props.formData - 폼 데이터
 * @param {Function} props.handleChange - 입력 변경 핸들러
 * @param {boolean} props.isInForm - 폼 내부에 있는지 여부
 */
const AssignmentSection = ({ formData, handleChange, isInForm = false }) => {
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [departmentSuggestions, setDepartmentSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [showDepartmentSuggestions, setShowDepartmentSuggestions] =
    useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const { getCollection } = useFirestore("assets");

  // 기존 자산 데이터에서 사용자, 부서, 위치 정보 로드
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const assets = await getCollection();

        // 사용자 목록 추출
        const users = [
          ...new Set(assets.map((asset) => asset.assignedTo).filter(Boolean)),
        ];
        setUserSuggestions(users);

        // 부서 목록 추출
        const departments = [
          ...new Set(assets.map((asset) => asset.department).filter(Boolean)),
        ];
        setDepartmentSuggestions(departments);

        // 위치 목록 추출
        const locations = [
          ...new Set(assets.map((asset) => asset.location).filter(Boolean)),
        ];
        setLocationSuggestions(locations);
      } catch (error) {
        console.error("자동완성 데이터 로드 중 오류:", error);
      }
    };

    loadSuggestions();
  }, [getCollection]);

  // 필터링된 제안 목록
  const filteredUserSuggestions = userSuggestions.filter((user) =>
    user.toLowerCase().includes((formData.assignedTo || "").toLowerCase())
  );

  const filteredDepartmentSuggestions = departmentSuggestions.filter((dept) =>
    dept.toLowerCase().includes((formData.department || "").toLowerCase())
  );

  const filteredLocationSuggestions = locationSuggestions.filter((loc) =>
    loc.toLowerCase().includes((formData.location || "").toLowerCase())
  );

  // 제안 선택 핸들러
  const handleSelectSuggestion = (field, value) => {
    const event = {
      target: {
        name: field,
        value: value,
      },
    };
    handleChange(event);

    // 제안 목록 닫기
    if (field === "assignedTo") setShowUserSuggestions(false);
    else if (field === "department") setShowDepartmentSuggestions(false);
    else if (field === "location") setShowLocationSuggestions(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="assignedTo"
            className="block text-sm font-medium text-muted-foreground"
          >
            담당자 <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaUser className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo || ""}
              onChange={handleChange}
              onFocus={() => setShowUserSuggestions(true)}
              onBlur={() =>
                setTimeout(() => setShowUserSuggestions(false), 200)
              }
              required
              placeholder="담당자 이름"
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {/* 사용자 자동완성 목록 */}
            {showUserSuggestions && filteredUserSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredUserSuggestions.map((user, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-muted cursor-pointer"
                    onMouseDown={() =>
                      handleSelectSuggestion("assignedTo", user)
                    }
                  >
                    {user}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="department"
            className="block text-sm font-medium text-muted-foreground"
          >
            부서 <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaBuilding className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department || ""}
              onChange={handleChange}
              onFocus={() => setShowDepartmentSuggestions(true)}
              onBlur={() =>
                setTimeout(() => setShowDepartmentSuggestions(false), 200)
              }
              required
              placeholder="부서명"
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {/* 부서 자동완성 목록 */}
            {showDepartmentSuggestions &&
              filteredDepartmentSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredDepartmentSuggestions.map((dept, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-muted cursor-pointer"
                      onMouseDown={() =>
                        handleSelectSuggestion("department", dept)
                      }
                    >
                      {dept}
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>

        <PhoneInput
          id="contactNumber"
          name="contactNumber"
          label="연락처"
          value={formData.contactNumber || ""}
          onChange={handleChange}
          placeholder="010-0000-0000"
        />

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-muted-foreground"
          >
            이메일
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            placeholder="example@company.com"
            className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-muted-foreground"
          >
            직책
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role || ""}
            onChange={handleChange}
            placeholder="직책"
            className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-muted-foreground"
          >
            위치 <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaMapMarkerAlt className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              onFocus={() => setShowLocationSuggestions(true)}
              onBlur={() =>
                setTimeout(() => setShowLocationSuggestions(false), 200)
              }
              required
              placeholder="자산 위치"
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {/* 위치 자동완성 목록 */}
            {showLocationSuggestions &&
              filteredLocationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredLocationSuggestions.map((loc, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-muted cursor-pointer"
                      onMouseDown={() =>
                        handleSelectSuggestion("location", loc)
                      }
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>

        <DateInput
          id="assignedDate"
          name="assignedDate"
          label="할당일"
          value={formData.assignedDate}
          onChange={handleChange}
          required
        />

        <DateInput
          id="dueDate"
          name="dueDate"
          label="반납 예정일"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>

      {isInForm && (
        <div className="space-y-2 mt-4">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-muted-foreground"
          >
            비고
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
            rows={3}
            placeholder="추가 정보를 입력하세요"
            className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}
    </div>
  );
};

export default AssignmentSection;
