"use client";

import { Link, useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { getStatusColorClass } from "../../utils/themeUtils";

const MaintenanceTable = ({
  maintenanceData,
  loading,
  sortBy,
  sortOrder,
  handleSort,
  handleDelete,
}) => {
  const navigate = useNavigate();

  // 행 클릭 핸들러
  const handleRowClick = (id) => {
    navigate(`/maintenance/detail/${id}`);
  };

  // 정렬 아이콘 렌더링
  const renderSortIcon = (column) => {
    if (sortBy === column) {
      return sortOrder === "asc" ? (
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
          <path d="m18 15-6-6-6 6" />
        </svg>
      ) : (
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
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    }
    return null;
  };

  // 정렬 가능한 헤더 셀 렌더링
  const SortableHeader = ({ column, label }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center">
        {label}
        {renderSortIcon(column)}
      </div>
    </th>
  );

  // 상태에 따른 색상 클래스 가져오기
  const getMaintenanceStatusClass = (status) => {
    switch (status) {
      case "예정":
        return getStatusColorClass("info");
      case "진행중":
        return getStatusColorClass("warning");
      case "완료":
        return getStatusColorClass("success");
      case "취소":
        return getStatusColorClass("destructive");
      default:
        return getStatusColorClass("default");
    }
  };

  // 우선순위에 따른 색상 클래스 가져오기
  const getPriorityColorClass = (priority) => {
    switch (priority) {
      case "높음":
        return getStatusColorClass("destructive");
      case "중간":
        return getStatusColorClass("warning");
      case "낮음":
        return getStatusColorClass("success");
      default:
        return getStatusColorClass("default");
    }
  };

  return (
    <div className="bg-card rounded-lg shadow overflow-hidden border border-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted">
              <SortableHeader column="assetName" label="자산명" />
              <SortableHeader column="type" label="유형" />
              <SortableHeader column="status" label="상태" />
              <SortableHeader column="scheduledDate" label="예정일" />
              <SortableHeader column="completedDate" label="완료일" />
              <SortableHeader column="technician" label="기술자" />
              <SortableHeader column="priority" label="우선순위" />
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center">
                  <div className="flex justify-center items-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2 text-muted-foreground">
                      로딩 중...
                    </span>
                  </div>
                </td>
              </tr>
            ) : maintenanceData.length > 0 ? (
              maintenanceData.map((maintenance) => (
                <tr
                  key={maintenance.id}
                  className="hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(maintenance.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {maintenance.assetName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {maintenance.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMaintenanceStatusClass(
                        maintenance.status
                      )}`}
                    >
                      {maintenance.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {maintenance.scheduledDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {maintenance.completedDate || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {maintenance.technician}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColorClass(
                        maintenance.priority
                      )}`}
                    >
                      {maintenance.priority}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex space-x-2">
                      <Link
                        to={`/maintenance/edit/${maintenance.id}`}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(maintenance.id, maintenance.assetName);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="px-6 py-8 text-sm text-center text-muted-foreground"
                >
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
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenanceTable;
