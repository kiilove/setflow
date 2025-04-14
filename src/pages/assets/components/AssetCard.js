"use client";

import { FaEdit, FaTrash } from "react-icons/fa";
import { getStatusColorClass } from "../../../utils/themeUtils";

/**
 * 자산 카드 컴포넌트 (그리드 뷰용)
 */
const AssetCard = ({
  asset,
  onClick,
  onDelete,
  isSelected,
  onSelect,
  formatCurrency,
  formatDate,
}) => {
  // 이벤트 전파 방지
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete();
  };

  // 체크박스 클릭 시 이벤트 전파 방지
  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onSelect(!isSelected);
  };

  return (
    <div
      className="bg-card border border-border rounded-lg shadow-sm hover:shadow transition-shadow overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        {/* 체크박스 */}
        <div className="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxClick}
            onClick={(e) => e.stopPropagation()}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>

        {/* 이미지 */}
        <div className="h-40 bg-muted flex items-center justify-center">
          {asset.image ? (
            <img
              src={asset.image || "/placeholder.svg"}
              alt={asset.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/placeholder.svg?height=160&width=320";
                e.target.alt = "이미지를 불러올 수 없습니다";
              }}
            />
          ) : (
            <div className="text-muted-foreground text-sm flex flex-col items-center justify-center">
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
                className="mb-2 opacity-20"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              이미지 없음
            </div>
          )}
        </div>

        {/* 상태 배지 */}
        <div className="absolute top-2 right-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(
              asset.status || "미지정"
            )}`}
          >
            {asset.status || "미지정"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-foreground mb-1 line-clamp-1">
          {asset.name || "이름 없음"}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          {asset.category || "카테고리 없음"}
        </p>

        <div className="space-y-1 text-xs text-muted-foreground">
          <p>위치: {asset.location || "-"}</p>
          <p>담당자: {asset.assignedTo || "-"}</p>
          <p>구매일: {formatDate(asset.purchaseDate)}</p>
          <p>가격: {formatCurrency(asset.purchasePrice)}</p>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex justify-between">
          <button
            onClick={handleDeleteClick}
            className="text-destructive hover:text-destructive/80 transition-colors"
          >
            <FaTrash className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <FaEdit className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
