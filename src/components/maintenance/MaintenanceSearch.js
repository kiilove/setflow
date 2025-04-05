"use client";
import { Link } from "react-router-dom";
import { Search, Plus, Grid, List, Calendar } from "lucide-react";
import { getButtonVariantClass } from "../../utils/themeUtils";

const MaintenanceSearch = ({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  filterPriority,
  setFilterPriority,
  maintenanceTypes,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="자산명, 기술자 또는 유형 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-l-md border ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border"
              }`}
              aria-label="그리드 보기"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 border-t border-b ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border"
              }`}
              aria-label="리스트 보기"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`p-2 rounded-r-md border ${
                viewMode === "calendar"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border"
              }`}
              aria-label="캘린더 보기"
            >
              <Calendar className="h-4 w-4" />
            </button>
          </div>

          <Link
            to="/maintenance/add"
            className={`${getButtonVariantClass(
              "primary"
            )} inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors`}
          >
            <Plus className="mr-2 -ml-1 h-4 w-4" />
            유지보수 추가
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">모든 상태</option>
            <option value="예정">진행 예정</option>
            <option value="진행중">진행중</option>
            <option value="완료">완료</option>
            <option value="취소">취소</option>
          </select>
        </div>

        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">모든 유형</option>
            {maintenanceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">모든 우선순위</option>
            <option value="높음">높음</option>
            <option value="중간">중간</option>
            <option value="낮음">낮음</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceSearch;
