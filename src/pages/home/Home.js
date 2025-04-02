"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dataService } from "../../data/mockData";
import {
  getStatusColorClass,
  getButtonVariantClass,
} from "../../utils/themeUtils";

const Home = () => {
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [recentAssets, setRecentAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 대시보드 요약 데이터 가져오기
        const summaryData = await dataService.getDashboardSummary();
        setDashboardSummary(summaryData);

        // 최근 자산 데이터 가져오기
        const assetsData = await dataService.getAssets();
        // 최근 추가된 5개 자산만 표시
        setRecentAssets(assetsData.slice(0, 5));

        setLoading(false);
      } catch (error) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">자산 관리 시스템</h1>
        <div className="flex gap-3">
          <Link
            to="/assets"
            className={`${getButtonVariantClass(
              "primary"
            )} px-4 py-2 rounded-md transition-colors`}
          >
            자산 관리
          </Link>
          <Link
            to="/settings"
            className={`${getButtonVariantClass(
              "outline"
            )} px-4 py-2 rounded-md transition-colors`}
          >
            설정
          </Link>
        </div>
      </div>

      {/* 요약 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                총 자산
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {dashboardSummary?.totalAssets || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-emerald-500 dark:text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                총 자산 가치
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {formatCurrency(dashboardSummary?.totalValue || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-500/10 dark:bg-amber-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-amber-500 dark:text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                유지보수 비용
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {formatCurrency(
                  dashboardSummary?.maintenanceCostsThisYear || 0
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-rose-500/10 dark:bg-rose-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-rose-500 dark:text-rose-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                비활성 자산
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {dashboardSummary?.inactiveAssets || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 최근 자산 및 활동 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 자산 */}
        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">최근 자산</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    자산명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    위치
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      <Link
                        to={`/assets/${asset.id}`}
                        className="text-primary hover:underline"
                      >
                        {asset.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {asset.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(
                          asset.status
                        )}`}
                      >
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {asset.location}
                    </td>
                  </tr>
                ))}
                {recentAssets.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-sm text-center text-muted-foreground"
                    >
                      자산 데이터가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-border bg-muted/50">
            <Link
              to="/assets"
              className="text-primary hover:underline text-sm font-medium"
            >
              모든 자산 보기 →
            </Link>
          </div>
        </div>

        {/* 최근 활동 */}
        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">최근 활동</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    활동
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    자산
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    사용자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    날짜
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {dashboardSummary?.recentActivities.map((activity) => (
                  <tr
                    key={activity.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {activity.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {activity.assetName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {activity.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {new Date(activity.date).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {!dashboardSummary?.recentActivities ||
                  (dashboardSummary.recentActivities.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-sm text-center text-muted-foreground"
                      >
                        최근 활동이 없습니다.
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-border bg-muted/50">
            <Link
              to="/activities"
              className="text-primary hover:underline text-sm font-medium"
            >
              모든 활동 보기 →
            </Link>
          </div>
        </div>
      </div>

      {/* 빠른 액세스 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            자산 관리
          </h3>
          <p className="text-muted-foreground mb-4">
            자산 목록을 확인하고 새 자산을 추가하거나 기존 자산을 관리합니다.
          </p>
          <Link
            to="/assets"
            className={`${getButtonVariantClass(
              "outline"
            )} w-full px-4 py-2 rounded-md transition-colors flex justify-center items-center`}
          >
            자산 관리
          </Link>
        </div>

        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            유지보수
          </h3>
          <p className="text-muted-foreground mb-4">
            예정된 유지보수 작업을 확인하고 새 유지보수 일정을 추가합니다.
          </p>
          <Link
            to="/maintenance"
            className={`${getButtonVariantClass(
              "outline"
            )} w-full px-4 py-2 rounded-md transition-colors flex justify-center items-center`}
          >
            유지보수 관리
          </Link>
        </div>

        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            재무 관리
          </h3>
          <p className="text-muted-foreground mb-4">
            자산 가치, 감가상각, 유지보수 비용 등 재무 정보를 확인합니다.
          </p>
          <Link
            to="/finance"
            className={`${getButtonVariantClass(
              "outline"
            )} w-full px-4 py-2 rounded-md transition-colors flex justify-center items-center`}
          >
            재무 관리
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
