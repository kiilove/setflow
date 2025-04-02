"use client";

import { useState, useRef, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { userData } from "../../data/mockData"; // mockData에서 userData 가져오기

// 달력 아이콘 SVG 컴포넌트 추가
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const AssignmentSection = ({ formData, handleChange }) => {
  // 사용자 검색 관련 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // 검색 결과 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 검색어 변경 시 결과 필터링
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filteredResults = userData.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(filteredResults);
    setShowResults(true);
  }, [searchTerm]);

  // 검색창 초기화 및 사용자 정보 삭제
  const clearUserSelection = () => {
    const assignedToEvent = { target: { name: "assignedTo", value: "" } };
    const departmentEvent = { target: { name: "department", value: "" } };
    const emailEvent = { target: { name: "email", value: "" } };
    const roleEvent = { target: { name: "role", value: "" } };

    handleChange(assignedToEvent);
    handleChange(departmentEvent);
    handleChange(emailEvent);
    handleChange(roleEvent);

    setSearchTerm("");
  };

  // 검색 결과에서 사용자 선택
  const handleSelectUser = (user) => {
    const assignedToEvent = {
      target: { name: "assignedTo", value: user.name },
    };
    const departmentEvent = {
      target: { name: "department", value: user.department },
    };
    const emailEvent = {
      target: { name: "email", value: user.email },
    };
    const roleEvent = { target: { name: "role", value: user.role } };

    handleChange(assignedToEvent);
    handleChange(departmentEvent);
    handleChange(emailEvent);
    handleChange(roleEvent);

    // 검색창에 선택한 사용자 이름 표시
    setSearchTerm(user.name);
    setShowResults(false);
  };

  // 날짜 입력 필드 클릭 핸들러
  const handleDateInputClick = (e) => {
    e.stopPropagation();

    // 다른 열린 달력 닫기
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach((input) => {
      if (input !== e.target) {
        input.blur();
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="assignedTo"
            className="block text-sm font-medium text-foreground"
          >
            할당 대상
          </label>
          <div className="relative" ref={searchRef}>
            <div className="flex">
              <input
                type="text"
                id="searchUser"
                name="assignedTo"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // 검색어가 변경되면 사용자 정보 초기화
                  if (
                    formData.assignedTo &&
                    e.target.value !== formData.assignedTo
                  ) {
                    clearUserSelection();
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  // 다른 열린 달력 닫기
                  const dateInputs =
                    document.querySelectorAll('input[type="date"]');
                  dateInputs.forEach((input) => input.blur());
                }}
                className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                placeholder="사용자 검색 (이름, 부서, 이메일)"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {formData.assignedTo && (
                  <button
                    type="button"
                    onClick={clearUserSelection}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <FaTimes />
                  </button>
                )}
                {!formData.assignedTo && (
                  <FaSearch className="text-muted-foreground pointer-events-none" />
                )}
              </div>
            </div>

            {showResults && searchResults.length > 0 && (
              <div className="absolute z-[70] mt-1 w-full bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="px-4 py-2 hover:bg-muted cursor-pointer flex flex-col"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectUser(user);
                    }}
                  >
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.department} | {user.email}
                    </span>
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
            부서
          </label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department || ""}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            placeholder="부서명"
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
          <select
            id="location"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            onClick={(e) => {
              e.stopPropagation();
              // 다른 열린 달력 닫기
              const dateInputs =
                document.querySelectorAll('input[type="date"]');
              dateInputs.forEach((input) => input.blur());
            }}
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          >
            <option value="">위치 선택</option>
            <option value="본사 1층">본사 1층</option>
            <option value="본사 2층">본사 2층</option>
            <option value="본사 3층">본사 3층</option>
            <option value="본사 4층">본사 4층</option>
            <option value="지사 1층">지사 1층</option>
            <option value="지사 2층">지사 2층</option>
            <option value="데이터센터">데이터센터</option>
            <option value="창고">창고</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="assignedDate"
            className="block text-sm font-medium text-foreground"
          >
            할당일
          </label>
          <div className="relative">
            <input
              type="date"
              id="assignedDate"
              name="assignedDate"
              value={formData.assignedDate || ""}
              onChange={handleChange}
              onClick={handleDateInputClick}
              className="w-full rounded-md border border-input bg-background px-4 py-2 pr-10 text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
            <CalendarIcon />
          </div>
        </div>
      </div>

      {/* 이메일 필드는 숨김 처리 (데이터만 저장) */}
      <input type="hidden" name="email" value={formData.email || ""} />
      <input type="hidden" name="role" value={formData.role || ""} />
    </div>
  );
};

export default AssignmentSection;
