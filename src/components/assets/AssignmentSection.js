"use client";

import { useState, useEffect } from "react";
import {
  FaUser,
  FaBuilding,
  FaMapMarkerAlt,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
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
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUnlimited, setIsUnlimited] = useState(false);

  const { getCollection } = useFirestore("assets");
  const { getCollection: getUserCollection } = useFirestore("users");

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

  // 사용자 목록 로드
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await getUserCollection();
        setUserSuggestions(users);
      } catch (error) {
        console.error("사용자 목록 로드 오류:", error);
      }
    };
    loadUsers();
  }, [getUserCollection]);

  // 사용자 검색 필터링
  const filteredUsers = userSuggestions.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 필터링된 제안 목록
  const filteredUserSuggestions = userSuggestions.filter((user) =>
    user.name.toLowerCase().includes((formData.assignedTo || "").toLowerCase())
  );

  const filteredDepartmentSuggestions = departmentSuggestions.filter((dept) =>
    dept.toLowerCase().includes((formData.department || "").toLowerCase())
  );

  const filteredLocationSuggestions = locationSuggestions.filter((loc) =>
    loc.toLowerCase().includes((formData.location || "").toLowerCase())
  );

  // 사용자 선택 핸들러
  const handleUserSelect = (user) => {
    handleChange({
      target: {
        name: "assignedUser",
        value: user.name,
      },
    });
    handleChange({
      target: {
        name: "assignedUserId",
        value: user.id,
      },
    });
    handleChange({
      target: {
        name: "department",
        value: user.department || "",
      },
    });
    handleChange({
      target: {
        name: "position",
        value: user.position || "",
      },
    });
    handleChange({
      target: {
        name: "title",
        value: user.title || "",
      },
    });
    setShowUserModal(false);
  };

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

  // 할당일 변경 핸들러
  const handleAssignedDateChange = (e) => {
    handleChange(e);

    // 할당일이 입력되면 반납 예정일을 365일 후로 설정
    if (e.target.value && !isUnlimited) {
      try {
        const assignedDate = new Date(e.target.value);

        // 날짜 유효성 검사
        if (isNaN(assignedDate.getTime())) {
          console.error("유효하지 않은 날짜입니다.");
          return;
        }

        const dueDate = new Date(assignedDate);
        dueDate.setDate(dueDate.getDate() + 365);

        // 반납 예정일이 유효한지 확인
        if (isNaN(dueDate.getTime())) {
          console.error("유효하지 않은 반납 예정일입니다.");
          return;
        }

        handleChange({
          target: {
            name: "dueDate",
            value: dueDate.toISOString().split("T")[0],
          },
        });
      } catch (error) {
        console.error("날짜 처리 중 오류가 발생했습니다:", error);
      }
    }
  };

  // 제한 없음 체크박스 핸들러
  const handleUnlimitedChange = (e) => {
    const checked = e.target.checked;
    setIsUnlimited(checked);

    if (checked) {
      handleChange({
        target: {
          name: "dueDate",
          value: "9999-12-31",
        },
      });
    } else if (formData.assignedDate) {
      // 체크 해제 시 할당일 기준으로 365일 후로 설정
      const assignedDate = new Date(formData.assignedDate);
      const dueDate = new Date(assignedDate);
      dueDate.setDate(dueDate.getDate() + 365);

      handleChange({
        target: {
          name: "dueDate",
          value: dueDate.toISOString().split("T")[0],
        },
      });
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="assignedTo"
            className="block text-sm font-medium text-foreground"
          >
            할당 대상 <span className="text-destructive">*</span>
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
              onChange={(e) => {
                handleChange(e);
                setSearchTerm(e.target.value);
                setShowUserSuggestions(true);
              }}
              onFocus={() => setShowUserSuggestions(true)}
              onBlur={() =>
                setTimeout(() => setShowUserSuggestions(false), 200)
              }
              required
              placeholder="담당자 이름"
              className="w-full pl-10 pr-10 py-2 rounded-md border border-input bg-background text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowUserModal(true)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <FaSearch className="h-4 w-4 text-muted-foreground hover:text-primary" />
            </button>

            {/* 사용자 자동완성 목록 */}
            {showUserSuggestions && filteredUsers.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredUsers.map((user, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-muted cursor-pointer"
                    onMouseDown={() => handleUserSelect(user)}
                  >
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.phone}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="department"
            className="block text-sm font-medium text-foreground"
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
              className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
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
          label="담당자 연락처"
          value={formData.contactNumber || ""}
          onChange={handleChange}
          placeholder="010-0000-0000"
        />

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground"
          >
            이메일
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            placeholder="example@company.com"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="position"
            className="block text-sm font-medium text-foreground"
          >
            직급
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position || ""}
            onChange={handleChange}
            placeholder="직급"
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-foreground"
          >
            직책
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            placeholder="직책"
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-foreground"
          >
            위치
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
              placeholder="자산 위치"
              className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        <DateInput
          id="assignedDate"
          name="assignedDate"
          label="할당일"
          value={formData.assignedDate || ""}
          onChange={handleAssignedDateChange}
          required
        />

        <div className="space-y-2">
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-foreground"
          >
            반납 예정일
          </label>
          <div className="flex items-center gap-2">
            <DateInput
              id="dueDate"
              name="dueDate"
              value={formData.dueDate || ""}
              onChange={handleChange}
              className="flex-1"
              disabled={isUnlimited}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="unlimited"
                checked={isUnlimited}
                onChange={handleUnlimitedChange}
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <label
                htmlFor="unlimited"
                className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
              >
                제한 없음
              </label>
            </div>
          </div>
        </div>
      </div>

      {isInForm && (
        <div className="space-y-2 mt-4">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-foreground"
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
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
      )}

      {/* 사용자 검색 모달 */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">사용자 검색</h3>
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setSearchTerm("");
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <div className="relative mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="이름 또는 전화번호로 검색..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="max-h-80 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <div
                    key={index}
                    className="p-3 border-b border-input hover:bg-muted cursor-pointer"
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.phone}
                    </div>
                    {user.department && (
                      <div className="text-sm text-muted-foreground">
                        {user.department}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentSection;
