"use client";
import DataTable from "./DataTable";
import DataGrid from "./DataGrid";

/**
 * 목록 페이지의 컨텐츠 컴포넌트
 * @param {Object} props
 * @param {string} props.viewMode - 현재 뷰 모드 ('table' 또는 'grid')
 * @param {Array} props.data - 표시할 데이터 배열
 * @param {Array} props.columns - 테이블 컬럼 정의 배열
 * @param {Function} props.renderGridItem - 그리드 아이템 렌더링 함수
 * @param {Array} props.selectedItems - 선택된 항목 ID 배열
 * @param {Function} props.onSelectItem - 항목 선택 핸들러
 * @param {Function} props.onSelectAll - 전체 선택 핸들러
 * @param {Object} props.sortConfig - 정렬 설정 {key, direction}
 * @param {Function} props.onSort - 정렬 핸들러
 * @param {boolean} props.loading - 로딩 상태
 * @param {string} props.emptyMessage - 데이터 없을 때 표시할 메시지
 * @param {Function} props.onItemClick - 항목 클릭 핸들러
 * @param {Object} props.clickableColumn - 클릭 가능한 컬럼 설정
 * @param {Function} props.renderActions - 액션 렌더링 함수
 * @param {number} props.currentPage - 현재 페이지
 * @param {number} props.totalPages - 전체 페이지 수
 * @param {Function} props.onPageChange - 페이지 변경 핸들러
 * @param {number} props.pageSize - 페이지당 항목 수
 * @param {number} props.totalItems - 전체 항목 수
 */
const ListContent = ({
  viewMode,
  data,
  columns,
  renderGridItem,
  selectedItems,
  onSelectItem,
  onSelectAll,
  sortConfig,
  onSort,
  loading,
  emptyMessage,
  onItemClick,
  clickableColumn,
  renderActions,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
}) => {
  return (
    <>
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
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
          {emptyMessage}
        </div>
      ) : viewMode === "table" ? (
        <DataTable
          data={data}
          columns={columns}
          showCheckbox={true}
          selectedItems={selectedItems}
          onSelectItem={onSelectItem}
          onSelectAll={onSelectAll}
          clickableColumn={clickableColumn}
          sortConfig={sortConfig}
          onSort={onSort}
          loading={loading}
          emptyMessage={emptyMessage}
          actions={renderActions}
          pagination={true}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          pageSize={pageSize}
          totalItems={totalItems}
        />
      ) : (
        <div>
          <DataGrid
            data={data}
            renderItem={renderGridItem}
            loading={loading}
            emptyMessage={emptyMessage}
          />

          {/* 그리드 뷰에서도 페이지네이션 표시 */}
          {data.length > 0 && (
            <div className="mt-4 px-1">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {totalItems > 0
                    ? `전체 ${totalItems}개 중 ${
                        (currentPage - 1) * pageSize + 1
                      }-${Math.min(currentPage * pageSize, totalItems)}번 항목`
                    : "표시할 항목이 없습니다"}
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 h-8 rounded border border-input bg-background hover:bg-muted transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center"
                  >
                    이전
                  </button>
                  <span className="px-3 h-8 flex items-center justify-center">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-2 h-8 rounded border border-input bg-background hover:bg-muted transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center"
                  >
                    다음
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ListContent;
