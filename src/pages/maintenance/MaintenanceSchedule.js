"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaCalendarAlt, FaListUl } from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import {
  getButtonVariantClass,
  getStatusColorClass,
} from "../../utils/themeUtils";

const MaintenanceSchedule = () => {
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'calendar'
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [sortBy, setSortBy] = useState("scheduledDate");
  const [sortOrder, setSortOrder] = useState("asc");

  // 예시 유지보수 일정 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 데이터 로딩 시뮬레이션
        setTimeout(() => {
          const mockData = [
            {
              id: 1,
              assetName: "노트북 Dell XPS 15",
              assetId: "AST-001",
              type: "정기점검",
              scheduledDate: "2023-08-15",
              technician: "박기술자",
              priority: "중간",
              notes: "분기별 정기 점검",
            },
            {
              id: 2,
              assetName: "프린터 HP LaserJet",
              assetId: "AST-003",
              type: "정기점검",
              scheduledDate: "2023-08-20",
              technician: "이수리",
              priority: "낮음",
              notes: "토너 교체 및 정기 점검",
            },
            {
              id: 3,
              assetName: "서버 Dell PowerEdge",
              assetId: "AST-005",
              type: "업그레이드",
              scheduledDate: "2023-09-05",
              technician: "김엔지니어",
              priority: "높음",
              notes: "메모리 및 스토리지 업그레이드",
            },
            {
              id: 4,
              assetName: "네트워크 스위치",
              assetId: "AST-008",
              type: "정기점검",
              scheduledDate: "2023-09-10",
              technician: "박기술자",
              priority: "중간",
              notes: "네트워크 성능 점검",
            },
            {
              id: 5,
              assetName: "UPS 시스템",
              assetId: "AST-015",
              type: "배터리 교체",
              scheduledDate: "2023-09-15",
              technician: "이수리",
              priority: "높음",
              notes: "UPS 배터리 수명 만료로 인한 교체",
            },
          ];
          setScheduleData(mockData);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error(
          "유지보수 일정을 불러오는 중 오류가 발생했습니다:",
          error
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 정렬 처리
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // 검색 및 필터링된 일정 목록
  const filteredSchedules = scheduleData.filter(
    (schedule) =>
      (schedule.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.assetId.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterPriority === "" || schedule.priority === filterPriority)
  );

  // 정렬
  const sortedSchedules = [...filteredSchedules].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "scheduledDate") {
      comparison = new Date(a.scheduledDate) - new Date(b.scheduledDate);
    } else if (sortBy === "assetName") {
      comparison = a.assetName.localeCompare(b.assetName);
    } else if (sortBy === "assetId") {
      comparison = a.assetId.localeCompare(b.assetId);
    } else if (sortBy === "type") {
      comparison = a.type.localeCompare(b.type);
    } else if (sortBy === "technician") {
      comparison = a.technician.localeCompare(b.technician);
    } else if (sortBy === "priority") {
      const priorityOrder = { 높음: 1, 중간: 2, 낮음: 3 };
      comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  // 우선순위에 따른 상태 색상 클래스 가져오기
  const getPriorityColorClass = (priority) => {
    switch (priority) {
      case "높음":
        return getStatusColorClass("destructive");
      case "중간":
        return getStatusColorClass("warning");
      case "낮음":
        return getStatusColorClass("success");
      default:
        return getStatusColorClass("default");
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">유지보수 일정</h1>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1 px-3 py-2 rounded-md ${
                  viewMode === "list"
                    ? getButtonVariantClass("primary")
                    : getButtonVariantClass("secondary")
                }`}
              >
                <FaListUl className="h-4 w-4" />
                <span>목록</span>
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`flex items-center gap-1 px-3 py-2 rounded-md ${
                  viewMode === "calendar"
                    ? getButtonVariantClass("primary")
                    : getButtonVariantClass("secondary")
                }`}
              >
                <FaCalendarAlt className="h-4 w-4" />
                <span>캘린더</span>
              </button>
            </div>
            <Link
              to="/maintenance/add"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors flex items-center"
            >
              <FaPlus className="mr-1 h-4 w-4" />
              일정 추가
            </Link>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-3">
            <div className="relative">
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
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="자산명, 자산 ID, 유형 또는 기술자 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <div className="relative">
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
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">모든 우선순위</option>
                <option value="높음">높음</option>
                <option value="중간">중간</option>
                <option value="낮음">낮음</option>
              </select>
            </div>
          </div>
        </div>

        {viewMode === "list" ? (
          // 목록 보기
          <div className="bg-card rounded-lg shadow overflow-hidden border border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("scheduledDate")}
                    >
                      <div className="flex items-center">
                        예정일
                        {sortBy === "scheduledDate" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            {sortOrder === "asc" ? (
                              <path d="m18 15-6-6-6 6" />
                            ) : (
                              <path d="m6 9 6 6 6-6" />
                            )}
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("assetName")}
                    >
                      <div className="flex items-center">
                        자산명
                        {sortBy === "assetName" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            {sortOrder === "asc" ? (
                              <path d="m18 15-6-6-6 6" />
                            ) : (
                              <path d="m6 9 6 6 6-6" />
                            )}
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("assetId")}
                    >
                      <div className="flex items-center">
                        자산 ID
                        {sortBy === "assetId" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            {sortOrder === "asc" ? (
                              <path d="m18 15-6-6-6 6" />
                            ) : (
                              <path d="m6 9 6 6 6-6" />
                            )}
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("type")}
                    >
                      <div className="flex items-center">
                        유형
                        {sortBy === "type" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            {sortOrder === "asc" ? (
                              <path d="m18 15-6-6-6 6" />
                            ) : (
                              <path d="m6 9 6 6 6-6" />
                            )}
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("technician")}
                    >
                      <div className="flex items-center">
                        기술자
                        {sortBy === "technician" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            {sortOrder === "asc" ? (
                              <path d="m18 15-6-6-6 6" />
                            ) : (
                              <path d="m6 9 6 6 6-6" />
                            )}
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("priority")}
                    >
                      <div className="flex items-center">
                        우선순위
                        {sortBy === "priority" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            {sortOrder === "asc" ? (
                              <path d="m18 15-6-6-6 6" />
                            ) : (
                              <path d="m6 9 6 6 6-6" />
                            )}
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      비고
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center">
                        <div className="flex justify-center items-center">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <span className="ml-2 text-muted-foreground">
                            로딩 중...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : sortedSchedules.length > 0 ? (
                    sortedSchedules.map((schedule) => (
                      <tr
                        key={schedule.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {schedule.scheduledDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {schedule.assetName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {schedule.assetId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {schedule.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {schedule.technician}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColorClass(
                              schedule.priority
                            )}`}
                          >
                            {schedule.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">{schedule.notes}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <Link
                              to={`/maintenance/edit/${schedule.id}`}
                              className="text-primary hover:text-primary/80 transition-colors"
                            >
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
                              >
                                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                              </svg>
                            </Link>
                            <button
                              className="text-destructive hover:text-destructive/80 transition-colors"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `${schedule.assetName}의 유지보수 일정을 삭제하시겠습니까?`
                                  )
                                ) {
                                  console.log(`일정 삭제: ${schedule.id}`);
                                }
                              }}
                            >
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
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                <line x1="10" x2="10" y1="11" y2="17" />
                                <line x1="14" x2="14" y1="11" y2="17" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-6 py-8 text-sm text-center text-muted-foreground"
                      >
                        <div className="flex flex-col items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mb-2 text-muted-foreground/60"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" x2="12" y1="8" y2="12" />
                            <line x1="12" x2="12.01" y1="16" y2="16" />
                          </svg>
                          검색 결과가 없습니다.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // 캘린더 보기 (간단한 예시)
          <div className="rounded-lg border border-border bg-card p-4 shadow-md">
            <div className="mb-4 flex justify-between items-center">
              <button className="text-muted-foreground hover:text-foreground">
                이전 달
              </button>
              <h3 className="text-xl font-semibold text-foreground">
                2023년 8월
              </h3>
              <button className="text-muted-foreground hover:text-foreground">
                다음 달
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <div
                  key={day}
                  className="p-2 text-center font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                const date = `2023-08-${day.toString().padStart(2, "0")}`;
                const daySchedules = scheduleData.filter(
                  (s) => s.scheduledDate === date
                );
                return (
                  <div
                    key={day}
                    className={`p-2 min-h-[100px] border border-border ${
                      daySchedules.length > 0 ? "bg-muted/30" : ""
                    }`}
                  >
                    <div className="text-right text-sm text-muted-foreground">
                      {day}
                    </div>
                    {daySchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className={`mt-1 p-1 text-xs rounded ${
                          schedule.priority === "높음"
                            ? "bg-destructive/20 text-destructive"
                            : schedule.priority === "중간"
                            ? "bg-warning/20 text-warning"
                            : "bg-success/20 text-success"
                        }`}
                      >
                        {schedule.assetName} - {schedule.type}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default MaintenanceSchedule;
