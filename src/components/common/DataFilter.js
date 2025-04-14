"use client";

import { useState } from "react";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";

/**
 * 재사용 가능한 데이터 필터 컴포넌트
 * @param {Object} props
 * @param {string} props.searchValue - 검색어
 * @param {Function} props.onSearchChange - 검색어 변경 핸들러
 * @param {Array} props.filters - 필터 정의 배열 [{id, label, options, value}]
 * @param {Function} props.onFilterChange - 필터 변경 핸들러 (filterId, value) => void
 * @param {Function} props.onResetFilters - 필터 초기화 핸들러
 * @param {string} props.searchPlaceholder - 검색 입력란 플레이스홀더
 * @param {React.ReactNode} props.children - 추가 필터 컴포넌트
 */
const DataFilter = ({
  searchValue = "",
  onSearchChange,
  filters = [],
  onFilterChange,
  onResetFilters,
  searchPlaceholder = "검색...",
  children,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  // 활성화된 필터 개수 계산
  const activeFilterCount = filters.filter(
    (filter) => filter.value && filter.value !== ""
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 검색 입력란 */}
        <div className="relative flex-grow">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 h-10 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* 필터 토글 버튼 */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 h-10 border border-input rounded-md bg-background hover:bg-muted transition-colors flex items-center justify-center sm:justify-start"
        >
          <FaFilter className="mr-1.5 h-3.5 w-3.5" />
          필터
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* 추가 컴포넌트 */}
        {children}
      </div>

      {/* 필터 패널 */}
      {showFilters && (
        <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium flex items-center">
              <FaFilter className="mr-2 text-muted-foreground" />
              필터 옵션
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={onResetFilters}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center"
              >
                <FaTimes className="mr-1" />
                초기화
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filters.map((filter) => (
              <div key={filter.id}>
                <label
                  htmlFor={filter.id}
                  className="block text-sm font-medium text-muted-foreground mb-1"
                >
                  {filter.label}
                </label>
                <select
                  id={filter.id}
                  value={filter.value || ""}
                  onChange={(e) =>
                    onFilterChange && onFilterChange(filter.id, e.target.value)
                  }
                  className="w-full px-3 h-10 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">전체 {filter.label}</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataFilter;
