"use client";

import { Link } from "react-router-dom";
import {
  FaPlus,
  FaClipboardList,
  FaTools,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaExclamationTriangle,
  FaArrowRight,
} from "react-icons/fa";

const DashboardActivity = ({ recentActivities, alerts }) => {
  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // 활동 타입에 따른 아이콘 및 색상
  const getActivityIcon = (type) => {
    switch (type) {
      case "add":
        return <FaPlus className="text-green-500" />;
      case "update":
        return <FaClipboardList className="text-blue-500" />;
      case "maintenance":
        return <FaTools className="text-yellow-500" />;
      case "assign":
        return <FaMapMarkerAlt className="text-purple-500" />;
      case "return":
        return <FaBoxOpen className="text-indigo-500" />;
      default:
        return <FaClipboardList className="text-gray-500" />;
    }
  };

  // 알림 심각도에 따른 색상
  const getAlertColor = (severity) => {
    switch (severity) {
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* 알림 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
        <div className="p-4 border-b border-border theme-transition">
          <h3 className="text-lg font-medium text-foreground theme-transition">
            알림
          </h3>
        </div>
        <div className="p-4">
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-md ${getAlertColor(alert.severity)}`}
                >
                  <div className="flex items-start">
                    <FaExclamationTriangle className="h-5 w-5 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm">{alert.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4 theme-transition">
              알림이 없습니다.
            </p>
          )}
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
        <div className="p-4 border-b border-border theme-transition">
          <h3 className="text-lg font-medium text-foreground theme-transition">
            최근 활동
          </h3>
        </div>
        <div className="p-4">
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground theme-transition">
                      <span className="font-medium">{activity.user}</span>님이
                      <span className="font-medium"> {activity.item}</span>
                      을(를)
                      {activity.type === "add" && " 추가했습니다."}
                      {activity.type === "update" && " 업데이트했습니다."}
                      {activity.type === "maintenance" &&
                        " 유지보수 요청했습니다."}
                      {activity.type === "assign" && " 할당했습니다."}
                      {activity.type === "return" && " 반납했습니다."}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 theme-transition">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4 theme-transition">
              최근 활동이 없습니다.
            </p>
          )}
        </div>
        <div className="p-4 border-t border-border theme-transition">
          <Link
            to="/assets/history"
            className="text-sm text-primary hover:text-primary/80 flex items-center justify-center"
          >
            모든 활동 보기
            <FaArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardActivity;
