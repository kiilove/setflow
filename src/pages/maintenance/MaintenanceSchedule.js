"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, List, Plus, Search, Filter } from "lucide-react";
import PageContainer from "../../components/common/PageContainer";
import {
  getButtonVariantClass,
  getStatusColorClass,
} from "../../utils/themeUtils";
import { dataService } from "../../data/mockData";

const MaintenanceSchedule = () => {
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'calendar'
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortBy, setSortBy] = useState("scheduledDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();

  // 유지보수 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await dataService.getMaintenance();

        // 예정된 유지보수만 필터링
        const scheduledMaintenance = data.filter(
          (item) => item.status === "예정" || item.status === "진행중"
        );

        setScheduleData(scheduledMaintenance);
      } catch (error) {
        console.error(
          "유지보수 일정을 불러오는 중 오류가 발생했습니다:",
          error
        );
      } finally {
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
        schedule.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterPriority === "" || schedule.priority === filterPriority) &&
      (filterType === "" || schedule.type === filterType)
  );

  // 정렬
  const sortedSchedules = [...filteredSchedules].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "scheduledDate") {
      comparison = new Date(a.scheduledDate) - new Date(b.scheduledDate);
    } else if (sortBy === "assetName") {
      comparison = a.assetName.localeCompare(b.assetName);
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

  // 유지보수 유형 목록 (중복 제거)
  const maintenanceTypes = [...new Set(scheduleData.map((item) => item.type))];

  // 달력 관련 함수
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const getMonthName = (date) => {
    return date.toLocaleString("default", { month: "long" });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  // 달력 데이터 생성
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  // 달력에 표시할 날짜 배열 생성
  const calendarDays = [];

  // 이전 달의 날짜 추가
  const prevMonthDays = getDaysInMonth(year, month - 1);
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: prevMonthDays - i,
      currentMonth: false,
      date: new Date(year, month - 1, prevMonthDays - i),
    });
  }

  // 현재 달의 날짜 추가
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      currentMonth: true,
      date: new Date(year, month, i),
    });
  }

  // 다음 달의 날짜 추가 (42개 셀을 채우기 위해)
  const remainingDays = 42 - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      day: i,
      currentMonth: false,
      date: new Date(year, month + 1, i),
    });
  }

  // 날짜 형식 변환 함수
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 특정 날짜의 일정 가져오기
  const getSchedulesForDate = (date) => {
    const formattedDate = formatDate(date);
    return scheduleData.filter(
      (schedule) => schedule.scheduledDate === formattedDate
    );
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
                <List className="h-4 w-4" />
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
                <Calendar className="h-4 w-4" />
                <span>캘린더</span>
              </button>
            </div>
            <Link
              to="/maintenance/add"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors flex items-center"
            >
              <Plus className="mr-1 h-4 w-4" />
              일정 추가
            </Link>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="자산명, 기술자 또는 유형 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">모든 유형</option>
              {maintenanceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
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
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      비고
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center">
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
                        className="hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() =>
                          navigate(`/maintenance/detail/${schedule.id}`)
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {schedule.scheduledDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {schedule.assetName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {schedule.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {schedule.technician}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              schedule.priority === "높음"
                                ? getStatusColorClass("destructive")
                                : schedule.priority === "중간"
                                ? getStatusColorClass("warning")
                                : getStatusColorClass("success")
                            }`}
                          >
                            {schedule.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(
                              schedule.status
                            )}`}
                          >
                            {schedule.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm max-w-xs truncate">
                          {schedule.notes}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
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
          // 캘린더 보기
          <div className="rounded-lg border border-border bg-card p-4 shadow-md">
            <div className="mb-4 flex justify-between items-center">
              <button
                onClick={handlePrevMonth}
                className="text-muted-foreground hover:text-foreground"
              >
                이전 달
              </button>
              <h3 className="text-xl font-semibold text-foreground">
                {getMonthName(currentMonth)} {year}
              </h3>
              <button
                onClick={handleNextMonth}
                className="text-muted-foreground hover:text-foreground"
              >
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
              {calendarDays.map((day, index) => {
                const dateSchedules = getSchedulesForDate(day.date);
                return (
                  <div
                    key={index}
                    className={`p-2 min-h-[100px] border border-border ${
                      !day.currentMonth
                        ? "bg-muted/20 text-muted-foreground"
                        : dateSchedules.length > 0
                        ? "bg-muted/30"
                        : ""
                    }`}
                  >
                    <div
                      className={`text-right text-sm ${
                        !day.currentMonth
                          ? "text-muted-foreground/50"
                          : "text-muted-foreground"
                      }`}
                    >
                      {day.day}
                    </div>
                    {dateSchedules.map((schedule) => (
                      <Link
                        key={schedule.id}
                        to={`/maintenance/detail/${schedule.id}`}
                        className={`mt-1 p-1 text-xs rounded block ${
                          schedule.priority === "높음"
                            ? "bg-destructive/20 text-destructive hover:bg-destructive/30"
                            : schedule.priority === "중간"
                            ? "bg-warning/20 text-warning hover:bg-warning/30"
                            : "bg-success/20 text-success hover:bg-success/30"
                        }`}
                      >
                        {schedule.assetName} - {schedule.type}
                      </Link>
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
