"use client";
import { useState, useEffect } from "react";
import { FaExchangeAlt, FaInfoCircle, FaTimes, FaSave } from "react-icons/fa";
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
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [departmentSuggestions, setDepartmentSuggestions] = useState([]);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [showDepartmentSuggestions, setShowDepartmentSuggestions] =
    useState(false);

  // 이전 할당 데이터 로드
  useEffect(() => {
    const loadAssignmentData = async () => {
      try {
        const assignments = await getCollection();

        // 사용자 목록 추출
        const users = [
          ...new Set(assignments.map((a) => a.assignedTo).filter(Boolean)),
        ];
        setUserSuggestions(users);

        // 부서 목록 추출
        const departments = [
          ...new Set(assignments.map((a) => a.department).filter(Boolean)),
        ];
        setDepartmentSuggestions(departments);
      } catch (error) {
        console.error("할당 데이터 로드 오류:", error);
      }
    };

    loadAssignmentData();
  }, [getCollection]);

  if (!showAssignModal || !asset) return null;

  // 모달 내부 클릭 시 이벤트 전파 중지
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  // 사용자 선택 핸들러
  const handleSelectUser = (user) => {
    const event = {
      target: {
        name: "assignedTo",
        value: user,
      },
    };
    handleAssignmentChange(event);
    setShowUserSuggestions(false);

    // 해당 사용자의 최근 할당 정보 찾기
    const userAssignment = userSuggestions.find((a) => a.assignedTo === user);
    if (userAssignment) {
      // 부서 정보 자동 설정
      if (userAssignment.department) {
        const deptEvent = {
          target: {
            name: "department",
            value: userAssignment.department,
          },
        };
        handleAssignmentChange(deptEvent);
      }
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
    user
      .toLowerCase()
      .includes((assignmentFormData.assignedTo || "").toLowerCase())
  );

  // 필터링된 부서 제안
  const filteredDepartmentSuggestions = departmentSuggestions.filter((dept) =>
    dept
      .toLowerCase()
      .includes((assignmentFormData.department || "").toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setShowAssignModal(false)}
    >
      <div
        className="bg-background rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={handleModalContentClick}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center">
              <FaExchangeAlt className="mr-2 text-primary" />
              자산 할당
            </h2>
            <button
              onClick={() => setShowAssignModal(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
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
                  {/* 담당자 입력 필드 (자동완성 기능 추가) */}
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
                        onChange={handleUserInputChange}
                        onFocus={() => setShowUserSuggestions(true)}
                        onBlur={() =>
                          setTimeout(() => setShowUserSuggestions(false), 200)
                        }
                        required
                        placeholder="담당자 이름"
                        className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {showUserSuggestions &&
                        filteredUserSuggestions.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                            {filteredUserSuggestions.map((user, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 cursor-pointer hover:bg-muted"
                                onMouseDown={() => handleSelectUser(user)}
                              >
                                {user}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* 부서 입력 필드 (자동완성 기능 추가) */}
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
                      {showDepartmentSuggestions &&
                        filteredDepartmentSuggestions.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                            {filteredDepartmentSuggestions.map(
                              (dept, index) => (
                                <div
                                  key={index}
                                  className="px-4 py-2 cursor-pointer hover:bg-muted"
                                  onMouseDown={() =>
                                    handleSelectDepartment(dept)
                                  }
                                >
                                  {dept}
                                </div>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* 나머지 할당 필드 */}
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
        </div>
      </div>
    </div>
  );
};

export default AssignModal;
