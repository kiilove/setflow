"use client";

import { FaChevronLeft, FaChevronRight, FaEllipsisH } from "react-icons/fa";

/**
 * 재사용 가능한 페이지네이션 컴포넌트
 * @param {Object} props
 * @param {number} props.currentPage - 현재 페이지 (1부터 시작)
 * @param {number} props.totalPages - 전체 페이지 수
 * @param {Function} props.onPageChange - 페이지 변경 핸들러 (pageNumber) => void
 * @param {number} props.siblingCount - 현재 페이지 양쪽에 표시할 페이지 수 (기본값: 1)
 * @param {number} props.totalItems - 전체 항목 수
 * @param {number} props.pageSize - 페이지당 항목 수
 * @param {boolean} props.showInfo - 항목 정보 표시 여부
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  totalItems,
  pageSize,
  showInfo = true,
}) => {
  // 페이지 번호가 유효하지 않은 경우
  if (currentPage < 1 || totalPages < 1) {
    return null;
  }

  // 페이지 범위 생성 함수
  const generatePageRange = () => {
    // 항상 표시할 첫 페이지와 마지막 페이지
    const firstPage = 1;
    const lastPage = totalPages;

    // 현재 페이지 주변에 표시할 페이지 범위
    const startPage = Math.max(firstPage, currentPage - siblingCount);
    const endPage = Math.min(lastPage, currentPage + siblingCount);

    // 표시할 페이지 배열
    const pages = [];

    // 첫 페이지 추가
    if (startPage > firstPage) {
      pages.push(firstPage);
      // 첫 페이지와 시작 페이지 사이에 간격이 있으면 생략 표시 추가
      if (startPage > firstPage + 1) {
        pages.push("ellipsis-start");
      }
    }

    // 중간 페이지 추가
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // 마지막 페이지 추가
    if (endPage < lastPage) {
      // 끝 페이지와 마지막 페이지 사이에 간격이 있으면 생략 표시 추가
      if (endPage < lastPage - 1) {
        pages.push("ellipsis-end");
      }
      pages.push(lastPage);
    }

    return pages;
  };

  // 페이지 범위
  const pages = generatePageRange();

  // 현재 표시 중인 항목 범위 계산
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, totalItems || 0);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
      {/* 항목 정보 */}
      {showInfo && totalItems !== undefined && (
        <div className="text-sm text-muted-foreground">
          {totalItems > 0
            ? `전체 ${totalItems}개 중 ${startItem}-${endItem}번 항목`
            : "표시할 항목이 없습니다"}
        </div>
      )}

      {/* 페이지 버튼 */}
      <div className="flex space-x-1">
        {/* 이전 페이지 버튼 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 h-8 rounded border border-input bg-background hover:bg-muted transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center"
          aria-label="이전 페이지"
        >
          <FaChevronLeft className="h-3 w-3" />
        </button>

        {/* 페이지 번호 버튼 */}
        {pages.map((page, index) => {
          // 생략 표시
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 h-8 flex items-center justify-center text-muted-foreground"
              >
                <FaEllipsisH className="h-3 w-3" />
              </span>
            );
          }

          // 페이지 번호 버튼
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 h-8 rounded border ${
                currentPage === page
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background hover:bg-muted border-input"
              } transition-colors`}
            >
              {page}
            </button>
          );
        })}

        {/* 다음 페이지 버튼 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-2 h-8 rounded border border-input bg-background hover:bg-muted transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center"
          aria-label="다음 페이지"
        >
          <FaChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
