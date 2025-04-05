"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import MaintenanceTable from "../../components/maintenance/MaintenanceTable";
import { dataService } from "../../data/mockData";
import MaintenanceStats from "../../components/maintenance/MaintenanceStats";
import MaintenanceGrid from "../../components/maintenance/MaintenanceGrid";
import MaintenanceSearch from "../../components/maintenance/MaintenanceSearch";
import MaintenanceEmptyState from "../../components/maintenance/MaintenanceEmptyState";

const Maintenance = () => {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [sortBy, setSortBy] = useState("scheduledDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list' or 'calendar'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 유지보수 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await dataService.getMaintenance();
        setMaintenanceData(data);
      } catch (error) {
        console.error(
          "유지보수 데이터를 불러오는 중 오류가 발생했습니다:",
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

  // 검색 및 필터링된 유지보수 목록
  const filteredMaintenance = maintenanceData.filter(
    (maintenance) =>
      (maintenance.assetName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        maintenance.technician
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        maintenance.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        maintenance.assetId
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (filterStatus === "" || maintenance.status === filterStatus) &&
      (filterType === "" || maintenance.type === filterType) &&
      (filterPriority === "" || maintenance.priority === filterPriority)
  );

  // 정렬
  const sortedMaintenance = [...filteredMaintenance].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "scheduledDate") {
      comparison = new Date(a.scheduledDate) - new Date(b.scheduledDate);
    } else if (sortBy === "completedDate") {
      // null 값 처리
      if (!a.completedDate) return 1;
      if (!b.completedDate) return -1;
      comparison = new Date(a.completedDate) - new Date(b.completedDate);
    } else if (sortBy === "assetName") {
      comparison = a.assetName.localeCompare(b.assetName);
    } else if (sortBy === "type") {
      comparison = a.type.localeCompare(b.type);
    } else if (sortBy === "technician") {
      comparison = a.technician.localeCompare(b.technician);
    } else if (sortBy === "status") {
      comparison = a.status.localeCompare(b.status);
    } else if (sortBy === "priority") {
      const priorityOrder = { 높음: 1, 중간: 2, 낮음: 3 };
      comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sortBy === "cost") {
      // null 값 처리
      if (a.cost === null) return 1;
      if (b.cost === null) return -1;
      comparison = Number(a.cost) - Number(b.cost);
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  // 페이지네이션 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedMaintenance.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(sortedMaintenance.length / itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 삭제 핸들러
  const handleDelete = (id, assetName) => {
    if (window.confirm(`${assetName}의 유지보수 기록을 삭제하시겠습니까?`)) {
      // 실제 구현에서는 API 호출
      console.log(`유지보수 ID ${id} 삭제`);

      // 목록에서 제거
      setMaintenanceData(maintenanceData.filter((item) => item.id !== id));
    }
  };

  // 유지보수 유형 목록 (중복 제거)
  const maintenanceTypes = [
    ...new Set(maintenanceData.map((item) => item.type)),
  ];

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
    return maintenanceData.filter(
      (schedule) => schedule.scheduledDate === formattedDate
    );
  };

  // 상태별 카운트 계산
  const scheduledCount = maintenanceData.filter(
    (item) => item.status === "예정"
  ).length;
  const inProgressCount = maintenanceData.filter(
    (item) => item.status === "진행중"
  ).length;
  const completedCount = maintenanceData.filter(
    (item) => item.status === "완료"
  ).length;

  if (loading) {
    return (
      <PageContainer title="유지보수 관리">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-muted-foreground">로딩 중...</span>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="유지보수 관리">
      <div className="space-y-6">
        {/* 요약 통계 */}
        <MaintenanceStats
          totalMaintenance={maintenanceData.length}
          scheduledCount={scheduledCount}
          inProgressCount={inProgressCount}
          completedCount={completedCount}
        />

        {/* 검색 및 필터 */}
        <MaintenanceSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          viewMode={viewMode}
          setViewMode={setViewMode}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterType={filterType}
          setFilterType={setFilterType}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          maintenanceTypes={maintenanceTypes}
        />

        {/* 유지보수 없음 */}
        {filteredMaintenance.length === 0 && !loading && (
          <MaintenanceEmptyState />
        )}

        {/* 유지보수 목록 - 그리드 뷰 */}
        {viewMode === "grid" && filteredMaintenance.length > 0 && (
          <MaintenanceGrid
            maintenanceData={currentItems}
            handleDelete={handleDelete}
          />
        )}

        {/* 유지보수 목록 - 테이블 뷰 */}
        {viewMode === "list" && filteredMaintenance.length > 0 && (
          <MaintenanceTable
            maintenanceData={currentItems}
            loading={loading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            handleSort={handleSort}
            handleDelete={handleDelete}
          />
        )}

        {/* 유지보수 목록 - 캘린더 뷰 */}
        {viewMode === "calendar" && filteredMaintenance.length > 0 && (
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
                          schedule.status === "완료"
                            ? "bg-success/20 text-success hover:bg-success/30"
                            : schedule.status === "진행중"
                            ? "bg-warning/20 text-warning hover:bg-warning/30"
                            : schedule.priority === "높음"
                            ? "bg-destructive/20 text-destructive hover:bg-destructive/30"
                            : "bg-primary/20 text-primary hover:bg-primary/30"
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

        {/* 페이지네이션 */}
        {filteredMaintenance.length > 0 && totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              총 {sortedMaintenance.length}개 항목 중 {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, sortedMaintenance.length)}개 표시
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-border bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이전
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md border ${
                      currentPage === pageNum
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border bg-card text-foreground hover:bg-muted"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border border-border bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Maintenance;
