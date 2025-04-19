"use client";
import { useState, useEffect } from "react";
import {
  FaExchangeAlt,
  FaInfoCircle,
  FaTimes,
  FaSave,
  FaSearch,
} from "react-icons/fa";
import { getButtonVariantClass } from "../../../utils/themeUtils";
import AssignmentSection from "../../../components/assets/AssignmentSection";
import { useFirestore } from "../../../hooks/useFirestore";

const AssignModal = ({
  showAssignModal,
  setShowAssignModal,
  asset,
  assignmentFormData,
  handleAssignmentChange,
  handleAssignmentSubmit,
  isSubmitting,
}) => {
  const { getCollection } = useFirestore("assignments");
  const { getCollection: getUserCollection } = useFirestore("users");
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [departmentSuggestions, setDepartmentSuggestions] = useState([]);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [showDepartmentSuggestions, setShowDepartmentSuggestions] =
    useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  // 사용자 선택 핸들러
  const handleSelectUser = (user) => {
    const event = {
      target: {
        name: "assignedTo",
        value: user.name,
      },
    };
    handleAssignmentChange(event);
    setShowUserSuggestions(false);
    setShowUserModal(false);
    setSearchTerm("");

    // 부서 정보 자동 설정
    if (user.department) {
      const deptEvent = {
        target: {
          name: "department",
          value: user.department,
        },
      };
      handleAssignmentChange(deptEvent);
    }
  };

  // 부서 선택 핸들러
  const handleSelectDepartment = (department) => {
    const event = {
      target: {
        name: "department",
        value: department,
      },
    };
    handleAssignmentChange(event);
    setShowDepartmentSuggestions(false);
  };

  // 사용자 입력 필드 핸들러
  const handleUserInputChange = (e) => {
    handleAssignmentChange(e);
    setShowUserSuggestions(true);
  };

  // 부서 입력 필드 핸들러
  const handleDepartmentInputChange = (e) => {
    handleAssignmentChange(e);
    setShowDepartmentSuggestions(true);
  };

  // 필터링된 사용자 제안
  const filteredUserSuggestions = userSuggestions.filter((user) =>
    user.name
      .toLowerCase()
      .includes((assignmentFormData.assignedTo || "").toLowerCase())
  );

  // 필터링된 부서 제안
  const filteredDepartmentSuggestions = departmentSuggestions.filter((dept) =>
    dept
      .toLowerCase()
      .includes((assignmentFormData.department || "").toLowerCase())
  );

  if (!showAssignModal || !asset) return null;

  // 모달 내부 클릭 시 이벤트 전파 중지
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={() => setShowAssignModal(false)}
    >
      <div
        className="bg-background rounded-lg p-6 w-full max-w-2xl"
        onClick={handleModalContentClick}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">자산 할당</h2>
          <button
            onClick={() => setShowAssignModal(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleAssignmentSubmit}>
          <div className="mb-6">
            <div className="flex items-center p-4 bg-primary/5 rounded-md border border-primary/20 mb-6">
              <FaInfoCircle className="text-primary mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">
                  {asset.name || "이름 없음"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {asset.serialNumber || "시리얼 번호 없음"} •{" "}
                  {asset.category || "카테고리 없음"}
                </p>
              </div>
            </div>

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
                    <input
                      type="text"
                      id="assignedTo"
                      name="assignedTo"
                      value={assignmentFormData.assignedTo || ""}
                      onChange={(e) => {
                        handleAssignmentChange(e);
                        setSearchTerm(e.target.value);
                        setShowUserSuggestions(true);
                      }}
                      onFocus={() => setShowUserSuggestions(true)}
                      onBlur={() =>
                        setTimeout(() => setShowUserSuggestions(false), 200)
                      }
                      required
                      placeholder="담당자 이름"
                      className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
                            onMouseDown={() => handleSelectUser(user)}
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
                    className="block text-sm font-medium text-muted-foreground"
                  >
                    부서 <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={assignmentFormData.department || ""}
                      onChange={handleDepartmentInputChange}
                      onFocus={() => setShowDepartmentSuggestions(true)}
                      onBlur={() =>
                        setTimeout(
                          () => setShowDepartmentSuggestions(false),
                          200
                        )
                      }
                      required
                      placeholder="부서명"
                      className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
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
                    value={assignmentFormData.position || ""}
                    onChange={handleAssignmentChange}
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
                    value={assignmentFormData.title || ""}
                    onChange={handleAssignmentChange}
                    placeholder="직책"
                    className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    readOnly
                  />
                </div>
              </div>

              <AssignmentSection
                isInForm={true}
                formData={assignmentFormData}
                handleChange={handleAssignmentChange}
              />
            </div>
          </div>

          <div className="border-t border-border pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowAssignModal(false);
              }}
              className="px-4 py-2 rounded-md border border-input bg-background hover:bg-muted transition-colors flex items-center"
            >
              <FaTimes className="mr-2 h-4 w-4" />
              취소
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md ${getButtonVariantClass(
                "primary"
              )} flex items-center`}
              disabled={isSubmitting}
              onClick={(e) => e.stopPropagation()}
            >
              {isSubmitting ? (
                <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
              ) : (
                <FaSave className="mr-2 h-4 w-4" />
              )}
              할당 완료
            </button>
          </div>
        </form>

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
                      onClick={() => handleSelectUser(user)}
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
    </div>
  );
};

export default AssignModal;
