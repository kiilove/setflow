"use client";
import { Table } from "../../../components/ui/Table";
import { formatDate } from "../../../utils/dateUtils";

export const AssetsTable = ({
  assets,
  sortBy,
  sortOrder,
  onSort,
  selectedItems,
  onSelectItem,
  onSelectAll,
  isAllSelected,
  isIndeterminate,
  onDelete,
  onEdit,
  onView,
}) => {
  const columns = [
    {
      id: "select",
      header: (
        <input
          type="checkbox"
          checked={isAllSelected}
          ref={(el) => {
            if (el) {
              el.indeterminate = isIndeterminate;
            }
          }}
          onChange={(e) => onSelectAll(e.target.checked)}
          className="h-4 w-4"
        />
      ),
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedItems.includes(row.id)}
          onChange={(e) => onSelectItem(row.id, e.target.checked)}
          className="h-4 w-4"
        />
      ),
      width: "40px",
    },
    {
      id: "name",
      header: "자산명",
      cell: (row) => row.name,
      sortable: true,
    },
    {
      id: "category",
      header: "카테고리",
      cell: (row) => row.category,
      sortable: true,
    },
    {
      id: "status",
      header: "상태",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs ${getStatusColor(row.status)}`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      id: "location",
      header: "위치",
      cell: (row) => row.location || "-",
      sortable: true,
    },
    {
      id: "assignedTo",
      header: "할당 대상",
      cell: (row) => row.assignedTo || "-",
      sortable: true,
    },
    {
      id: "purchaseDate",
      header: "구매일",
      cell: (row) => formatDate(row.purchaseDate) || "-",
      sortable: true,
    },
    {
      id: "actions",
      header: "작업",
      cell: (row) => (
        <div className="flex gap-1">
          <button
            className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            onClick={() => onView(row.id)}
            title="상세 보기"
          >
            <i className="fas fa-eye"></i>
          </button>
          <button
            className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
            onClick={() => onEdit(row.id)}
            title="편집"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
            onClick={() => onDelete(row)}
            title="삭제"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
      width: "120px",
    },
  ];

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
    <Table
      columns={columns}
      data={assets}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
    />
  );
};
