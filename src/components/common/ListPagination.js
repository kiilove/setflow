"use client";

/**
 * 목록 페이지의 페이지네이션 컴포넌트
 * @param {Object} props
 * @param {number} props.pageSize - 페이지당 항목 수
 * @param {Function} props.onPageSizeChange - 페이지 크기 변경 핸들러
 * @param {Array} props.pageSizeOptions - 페이지 크기 옵션 배열
 */
const ListPagination = ({
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}) => {
  return (
    <div className="flex justify-end items-center gap-2">
      <span className="text-sm text-muted-foreground">페이지당 항목 수:</span>
      <select
        value={pageSize}
        onChange={onPageSizeChange}
        className="px-2 h-8 rounded border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        {pageSizeOptions.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ListPagination;
