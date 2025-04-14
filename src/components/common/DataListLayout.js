"use client";

import { LoadingSpinner } from "../ui/LoadingSpinner";
import { EmptyState } from "../ui/EmptyState";

/**
 * 데이터 목록 레이아웃 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.title - 페이지 제목
 * @param {React.ReactNode} props.header - 헤더 컴포넌트
 * @param {React.ReactNode} props.filters - 필터 컴포넌트
 * @param {React.ReactNode} props.actions - 액션 버튼 컴포넌트
 * @param {string} props.viewMode - 뷰 모드 ('table' 또는 'grid')
 * @param {Function} props.onViewModeChange - 뷰 모드 변경 핸들러
 * @param {Function} props.renderTable - 테이블 렌더링 함수
 * @param {Function} props.renderGrid - 그리드 렌더링 함수
 * @param {React.ReactNode} props.pagination - 페이지네이션 컴포넌트
 * @param {boolean} props.loading - 로딩 상태
 * @param {React.ReactNode} props.emptyState - 빈 상태 컴포넌트
 * @param {boolean} props.isEmpty - 데이터가 비어있는지 여부
 * @param {React.ReactNode} props.children - 자식 컴포넌트
 * @returns {React.ReactNode} 데이터 목록 레이아웃
 */
export const DataListLayout = ({
  title,
  header,
  filters,
  actions,
  viewMode = "table",
  onViewModeChange,
  renderTable,
  renderGrid,
  pagination,
  loading = false,
  emptyState,
  isEmpty = false,
  children,
}) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        {header}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {filters}
          <div className="flex gap-2">
            {actions}
            {onViewModeChange && (
              <div className="flex border rounded">
                <button
                  type="button"
                  className={`px-3 py-1 ${
                    viewMode === "table"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                  onClick={() => onViewModeChange("table")}
                >
                  <i className="fas fa-list"></i>
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                  onClick={() => onViewModeChange("grid")}
                >
                  <i className="fas fa-th"></i>
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : isEmpty ? (
          emptyState || <EmptyState message="데이터가 없습니다." />
        ) : viewMode === "table" ? (
          renderTable && renderTable()
        ) : (
          renderGrid && renderGrid()
        )}

        {!loading && !isEmpty && pagination}

        {children}
      </div>
    </div>
  );
};
