"use client";
import DataViewToggle from "./DataViewToggle";
import { Trash2 } from "lucide-react";

/**
 * 목록 페이지의 액션 컴포넌트
 * @param {Object} props
 * @param {string} props.viewMode - 현재 뷰 모드 ('table' 또는 'grid')
 * @param {Function} props.onViewChange - 뷰 모드 변경 핸들러
 * @param {Array} props.selectedItems - 선택된 항목 ID 배열
 * @param {Function} props.onDeleteSelected - 선택된 항목 삭제 핸들러
 * @param {React.ReactNode} props.children - 추가 액션 컴포넌트
 */
const ListActions = ({
  viewMode,
  onViewChange,
  selectedItems = [],
  onDeleteSelected,
  children,
}) => {
  return (
    <div className="flex items-center gap-2">
      {selectedItems.length > 0 && (
        <button
          onClick={onDeleteSelected}
          className="bg-destructive/10 hover:bg-destructive/20 text-destructive px-4 py-2 h-10 rounded-md transition-colors flex items-center"
        >
          <Trash2 className="mr-1.5 h-4 w-4" />
          선택 삭제 ({selectedItems.length})
        </button>
      )}
      {children}
      <DataViewToggle view={viewMode} onViewChange={onViewChange} />
    </div>
  );
};

export default ListActions;
