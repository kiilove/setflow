"use client";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Pagination from "./Pagination";

/**
 * 재사용 가능한 데이터 테이블 컴포넌트
 * @param {Object} props
 * @param {Array} props.data - 표시할 데이터 배열
 * @param {Array} props.columns - 컬럼 정의 배열 [{id, header, accessor, sortable, className, render}]
 * @param {boolean} props.showCheckbox - 체크박스 표시 여부
 * @param {Array} props.selectedItems - 선택된 항목 ID 배열
 * @param {Function} props.onSelectItem - 항목 선택 핸들러 (id, checked) => void
 * @param {Function} props.onSelectAll - 전체 선택 핸들러 (checked) => void
 * @param {Function} props.onRowClick - 행 클릭 핸들러 (item, index) => void
 * @param {Object} props.clickableColumn - 클릭 가능한 컬럼 설정 {id, handler: (item) => void}
 * @param {Object} props.sortConfig - 정렬 설정 {key, direction}
 * @param {Function} props.onSort - 정렬 핸들러 (key, direction) => void
 * @param {boolean} props.loading - 로딩 상태
 * @param {string} props.emptyMessage - 데이터 없을 때 표시할 메시지
 * @param {React.ReactNode} props.actions - 테이블 액션 버튼
 * @param {boolean} props.pagination - 페이지네이션 사용 여부
 * @param {number} props.currentPage - 현재 페이지 (1부터 시작)
 * @param {number} props.totalPages - 전체 페이지 수
 * @param {Function} props.onPageChange - 페이지 변경 핸들러 (pageNumber) => void
 * @param {number} props.pageSize - 페이지당 항목 수
 * @param {number} props.totalItems - 전체 항목 수
 */
const DataTable = ({
  data = [],
  columns = [],
  showCheckbox = false,
  selectedItems = [],
  onSelectItem,
  onSelectAll,
  onRowClick,
  clickableColumn,
  sortConfig = { key: null, direction: null },
  onSort,
  loading = false,
  emptyMessage = "데이터가 없습니다.",
  actions,
  pagination = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  pageSize,
  totalItems,
}) => {
  // 전체 선택 상태 계산
  const allSelected = data.length > 0 && selectedItems.length === data.length;
  const someSelected =
    selectedItems.length > 0 && selectedItems.length < data.length;

  // 정렬 아이콘 렌더링 함수
  const renderSortIcon = (columnId) => {
    if (sortConfig.key !== columnId) {
      return <FaSort className="ml-1 text-gray-400 h-3 w-3" />;
    }
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="ml-1 text-primary h-3 w-3" />
    ) : (
      <FaSortDown className="ml-1 text-primary h-3 w-3" />
    );
  };

  // 정렬 핸들러
  const handleSort = (columnId) => {
    if (!onSort) return;

    let direction = "asc";
    if (sortConfig.key === columnId && sortConfig.direction === "asc") {
      direction = "desc";
    }
    onSort(columnId, direction);
  };

  // 행 클릭 핸들러
  const handleRowClick = (item, index, e) => {
    // 체크박스 클릭 시 이벤트 전파 방지
    if (e.target.type === "checkbox") return;

    // 클릭 가능한 컬럼이 지정되어 있고, 해당 컬럼을 클릭한 경우
    if (clickableColumn) {
      const cellIndex = Array.from(e.currentTarget.children).indexOf(
        e.target.closest("td")
      );
      const columnIndex = showCheckbox ? cellIndex - 1 : cellIndex;

      // 클릭 가능한 컬럼의 인덱스를 찾음
      const clickableColumnIndex = columns.findIndex(
        (col) => col.id === clickableColumn.id
      );

      if (columnIndex === clickableColumnIndex && clickableColumn.handler) {
        clickableColumn.handler(item);
        return;
      }
    }

    // 일반 행 클릭 핸들러
    if (onRowClick) {
      onRowClick(item, index);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow overflow-hidden border border-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted">
              {showCheckbox && (
                <th className="px-4 py-3 w-10">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      checked={allSelected}
                      ref={(input) => {
                        if (input) {
                          input.indeterminate = someSelected && !allSelected;
                        }
                      }}
                      onChange={(e) =>
                        onSelectAll && onSelectAll(e.target.checked)
                      }
                    />
                  </div>
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider ${
                    column.sortable ? "cursor-pointer" : ""
                  } ${column.className || ""}`}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable && renderSortIcon(column.id)}
                  </div>
                </th>
              ))}
              {actions && <th className="px-6 py-3 text-right">작업</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td
                  colSpan={
                    columns.length + (showCheckbox ? 1 : 0) + (actions ? 1 : 0)
                  }
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  <div className="flex justify-center items-center">
                    <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                    데이터를 불러오는 중...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length + (showCheckbox ? 1 : 0) + (actions ? 1 : 0)
                  }
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={item.id || index}
                  className={`hover:bg-muted/50 transition-colors ${
                    onRowClick || clickableColumn ? "cursor-pointer" : ""
                  }`}
                  onClick={(e) => handleRowClick(item, index, e)}
                >
                  {showCheckbox && (
                    <td
                      className="px-4 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                          checked={selectedItems.includes(item.id)}
                          onChange={(e) =>
                            onSelectItem &&
                            onSelectItem(item.id, e.target.checked)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        column.id === clickableColumn?.id
                          ? "text-primary hover:text-primary/80 font-medium"
                          : "text-foreground"
                      } ${column.className || ""}`}
                    >
                      {column.render
                        ? column.render(item)
                        : column.accessor
                        ? column.accessor(item)
                        : item[column.id]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div onClick={(e) => e.stopPropagation()}>
                        {typeof actions === "function"
                          ? actions(item)
                          : actions}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {pagination && !loading && data.length > 0 && (
        <div className="px-6 py-3 border-t border-border">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={totalItems}
            pageSize={pageSize}
          />
        </div>
      )}
    </div>
  );
};

export default DataTable;
