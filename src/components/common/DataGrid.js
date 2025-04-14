"use client";

/**
 * 재사용 가능한 데이터 그리드 컴포넌트
 * @param {Object} props
 * @param {Array} props.data - 표시할 데이터 배열
 * @param {Function} props.renderItem - 각 항목을 렌더링하는 함수 (item, index) => ReactNode
 * @param {boolean} props.loading - 로딩 상태
 * @param {string} props.emptyMessage - 데이터 없을 때 표시할 메시지
 * @param {string} props.className - 추가 클래스명
 */
const DataGrid = ({
  data = [],
  renderItem,
  loading = false,
  emptyMessage = "데이터가 없습니다.",
  className = "",
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
        <span className="text-muted-foreground">데이터를 불러오는 중...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
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
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}
    >
      {data.map((item, index) => renderItem(item, index))}
    </div>
  );
};

export default DataGrid;
