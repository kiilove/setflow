"use client";

import { Checkbox } from "../ui/checkbox";
import { Trash2 } from "lucide-react";
import { getStatusColorClass } from "../../utils/themeUtils";

const AssetCard = ({
  asset,
  onClick,
  onDelete,
  isSelected,
  onSelect,
  formatCurrency,
  formatDate,
}) => {
  return (
    <div
      className={`group relative bg-card rounded-lg border border-border p-4 shadow-sm transition-all hover:shadow-md cursor-pointer ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      {/* 체크박스 */}
      <div className="absolute top-2 right-2">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* 삭제 버튼 */}
      <button
        className="absolute top-2 right-10 p-1 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(e);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {/* 자산 정보 */}
      <div className="space-y-3">
        {/* 상태 */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${getStatusColorClass(
              asset.status || "미지정"
            )}`}
          />
          <span className="text-sm font-medium text-foreground">
            {asset.status || "미지정"}
          </span>
        </div>

        {/* 자산명 */}
        <h3 className="text-lg font-semibold text-foreground truncate">
          {asset.name}
        </h3>

        {/* 카테고리 */}
        <p className="text-sm text-muted-foreground">{asset.category}</p>

        {/* 위치 및 담당자 */}
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            위치: {asset.location || "-"}
          </p>
          <p className="text-sm text-muted-foreground">
            담당자: {asset.assignedTo || "-"}
          </p>
        </div>

        {/* 구매 정보 */}
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            구매일: {formatDate(asset.purchaseDate)}
          </p>
          <p className="text-sm text-muted-foreground">
            구매가: {formatCurrency(asset.purchasePrice)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
