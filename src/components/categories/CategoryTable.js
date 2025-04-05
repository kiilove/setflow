"use client";
import { Link } from "react-router-dom";
import { getStatusColorClass } from "../../utils/themeUtils";

const CategoryTable = ({
  categories,
  renderCategoryIcon,
  formatResidualValue,
  handleDelete,
  sortBy,
  sortOrder,
  handleSort,
  loading,
}) => {
  return (
    <div className="bg-card rounded-lg shadow overflow-hidden border border-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted">
              <th
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  카테고리명
                  {sortBy === "name" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-1"
                    >
                      {sortOrder === "asc" ? (
                        <path d="m18 15-6-6-6 6" />
                      ) : (
                        <path d="m6 9 6 6 6-6" />
                      )}
                    </svg>
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("count")}
              >
                <div className="flex items-center">
                  자산 수
                  {sortBy === "count" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-1"
                    >
                      {sortOrder === "asc" ? (
                        <path d="m18 15-6-6-6 6" />
                      ) : (
                        <path d="m6 9 6 6 6-6" />
                      )}
                    </svg>
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("years")}
              >
                <div className="flex items-center">
                  감가상각
                  {sortBy === "years" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-1"
                    >
                      {sortOrder === "asc" ? (
                        <path d="m18 15-6-6-6 6" />
                      ) : (
                        <path d="m6 9 6 6 6-6" />
                      )}
                    </svg>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                설명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((category) => (
              <tr
                key={category.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-full mr-3 ${
                        category.iconColor || "bg-gray-100"
                      } ${category.iconTextColor || "text-gray-500"}`}
                    >
                      {renderCategoryIcon(category)}
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(
                      "active"
                    )}`}
                  >
                    {category.count || 0}개
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(
                      "processing"
                    )}`}
                  >
                    {category.depreciation?.years || 0}년/
                    {formatResidualValue(category.depreciation)}
                  </span>
                </td>
                <td className="px-6 py-4 max-w-xs truncate">
                  {category.description || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <Link
                      to={`/assets?category=${category.name}`}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="자산 보기"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="7" height="7" x="3" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="14" rx="1" />
                        <rect width="7" height="7" x="3" y="14" rx="1" />
                      </svg>
                    </Link>
                    <Link
                      to={`/categories/template/${category.id}`}
                      className="text-primary hover:text-primary/80 transition-colors"
                      title="사양 템플릿 편집"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                    </Link>
                    <Link
                      to={`/categories/edit/${category.id}`}
                      className="text-yellow-500 hover:text-yellow-700 transition-colors"
                      title="카테고리 편집"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      title="카테고리 삭제"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-sm text-center text-muted-foreground"
                >
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                      카테고리 데이터를 불러오는 중...
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
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
                      검색 결과가 없습니다.
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;
