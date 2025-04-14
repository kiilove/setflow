"use client";
import { Table } from "../../../components/ui/Table";

export const CategoriesTable = ({
  categories,
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
      header: "카테고리명",
      cell: (row) => row.name,
      sortable: true,
    },
    {
      id: "group",
      header: "그룹",
      cell: (row) => row.group || "-",
      sortable: true,
    },
    {
      id: "description",
      header: "설명",
      cell: (row) => row.description || "-",
      sortable: true,
    },
    {
      id: "specFields",
      header: "사양 필드",
      cell: (row) => (row.specFields?.length || 0) + "개",
      sortable: true,
    },
    {
      id: "actions",
      header: "작업",
      cell: (row) => (
        <div className="flex gap-1">
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
      width: "100px",
    },
  ];

  return (
    <Table
      columns={columns}
      data={categories}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
    />
  );
};
