"use client";
import { formatDate } from "../../../utils/dateUtils";

export const AssetsGrid = ({
  assets,
  selectedItems,
  onSelectItem,
  onDelete,
  onEdit,
  onView,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "사용 가능":
        return "bg-green-100 text-green-800";
      case "사용 중":
        return "bg-blue-100 text-blue-800";
      case "수리 중":
        return "bg-yellow-100 text-yellow-800";
      case "폐기":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {assets.map((asset) => (
        <div
          key={asset.id}
          className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="p-4 border-b">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg truncate" title={asset.name}>
                {asset.name}
              </h3>
              <input
                type="checkbox"
                checked={selectedItems.includes(asset.id)}
                onChange={(e) => onSelectItem(asset.id, e.target.checked)}
                className="h-4 w-4"
              />
            </div>
            <p className="text-gray-500 text-sm mt-1">{asset.category}</p>
          </div>

          <div className="p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">상태:</span>
              <span
                className={`px-2 py-0.5 rounded text-xs ${getStatusColor(
                  asset.status
                )}`}
              >
                {asset.status}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-500">위치:</span>
              <span className="text-sm">{asset.location || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-500">할당 대상:</span>
              <span className="text-sm">{asset.assignedTo || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-500">구매일:</span>
              <span className="text-sm">
                {formatDate(asset.purchaseDate) || "-"}
              </span>
            </div>
          </div>

          <div className="p-4 border-t bg-gray-50 flex justify-between">
            <button
              className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
              onClick={() => onView(asset.id)}
              title="상세 보기"
            >
              <i className="fas fa-eye"></i>
            </button>
            <button
              className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
              onClick={() => onEdit(asset.id)}
              title="편집"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
              onClick={() => onDelete(asset)}
              title="삭제"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
