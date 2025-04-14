"use client";

import { FaTable, FaTh } from "react-icons/fa";

/**
 * 데이터 뷰 전환 컴포넌트 (테이블/그리드)
 * @param {Object} props
 * @param {string} props.view - 현재 뷰 모드 ('table' 또는 'grid')
 * @param {Function} props.onViewChange - 뷰 모드 변경 핸들러
 */
const DataViewToggle = ({ view = "table", onViewChange }) => {
  return (
    <div className="flex border border-input rounded-md overflow-hidden h-10">
      <button
        className={`px-3 flex items-center justify-center ${
          view === "table"
            ? "bg-primary text-primary-foreground"
            : "bg-background text-muted-foreground"
        } h-full w-10`}
        onClick={() => onViewChange && onViewChange("table")}
        title="테이블 뷰"
      >
        <FaTable className="h-3.5 w-3.5" />
      </button>
      <button
        className={`px-3 flex items-center justify-center ${
          view === "grid"
            ? "bg-primary text-primary-foreground"
            : "bg-background text-muted-foreground"
        } h-full w-10`}
        onClick={() => onViewChange && onViewChange("grid")}
        title="그리드 뷰"
      >
        <FaTh className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default DataViewToggle;
