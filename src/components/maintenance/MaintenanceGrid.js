"use client";
import { Link } from "react-router-dom";
import {
  Edit,
  Trash2,
  Calendar,
  PenToolIcon as Tool,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  getButtonVariantClass,
  getStatusColorClass,
} from "../../utils/themeUtils";

const MaintenanceGrid = ({ maintenanceData, handleDelete }) => {
  if (maintenanceData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          표시할 유지보수 기록이 없습니다.
        </p>
      </div>
    );
  }

  // 상태에 따른 아이콘 렌더링
  const renderStatusIcon = (status) => {
    switch (status) {
      case "완료":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "진행중":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "예정":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "취소":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Tool className="h-5 w-5 text-gray-500" />;
    }
  };

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {maintenanceData.map((maintenance) => (
        <div
          key={maintenance.id}
          className="rounded-lg border border-border bg-card p-4 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-full ${
                maintenance.status === "완료"
                  ? "bg-green-100 text-green-500"
                  : maintenance.status === "진행중"
                  ? "bg-yellow-100 text-yellow-500"
                  : maintenance.status === "예정"
                  ? "bg-blue-100 text-blue-500"
                  : "bg-red-100 text-red-500"
              }`}
            >
              {renderStatusIcon(maintenance.status)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-foreground">
                  {maintenance.assetName}
                </h3>
                <div className="flex space-x-1">
                  <div className="group relative">
                    <Link
                      to={`/maintenance/edit/${maintenance.id}`}
                      className="text-primary hover:text-primary/80 p-1.5 rounded-md hover:bg-primary/5"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      유지보수 편집
                    </div>
                  </div>

                  <div className="group relative">
                    <button
                      className="text-destructive hover:text-destructive/80 p-1.5 rounded-md hover:bg-destructive/5"
                      onClick={() =>
                        handleDelete(maintenance.id, maintenance.assetName)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      유지보수 삭제
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                {maintenance.type}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMaintenanceStatusClass(
                    maintenance.status
                  )}`}
                >
                  {maintenance.status}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColorClass(
                    maintenance.priority
                  )}`}
                >
                  {maintenance.priority}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(
                    "processing"
                  )}`}
                >
                  {maintenance.technician}
                </span>
              </div>
              <div className="mt-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">예정일:</span>
                  <span>{maintenance.scheduledDate}</span>
                </div>
                {maintenance.completedDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">완료일:</span>
                    <span>{maintenance.completedDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to={`/maintenance/detail/${maintenance.id}`}
              className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${getButtonVariantClass(
                "secondary"
              )}`}
            >
              <Tool className="mr-1.5 h-3.5 w-3.5" />
              상세 정보
            </Link>
            <Link
              to={`/assets/${maintenance.assetId}`}
              className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${getButtonVariantClass(
                "outline"
              )}`}
            >
              자산 보기
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MaintenanceGrid;
