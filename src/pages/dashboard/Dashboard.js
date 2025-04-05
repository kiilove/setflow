"use client";

import { useState, useEffect } from "react";
import {
  FaChartLine,
  FaChartPie,
  FaMoneyBillWave,
  FaTools,
  FaExclamationTriangle,
} from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import DashboardStats from "./DashboardStats";
import DashboardActivity from "./DashboardActivity";
import DashboardDistribution from "./DashboardDistribution";
import { getDashboardData } from "../../data/dashboardData";
import { getAnalyticsData } from "../../data/analyticsData";
import PageLoading from "../../components/common/PageLoading";
import FancyLoadingLogo from "../../components/common/FancyLoadingLogo";
import BounceLoadingLogo from "../../components/common/BounceLoadingLogo";

const Dashboard = () => {
  // 상태 관리
  const [dashboardData, setDashboardData] = useState({
    assetStats: { total: 0, active: 0, maintenance: 0, inactive: 0 },
    recentActivities: [],
    alerts: [],
    categoryDistribution: [],
    locationDistribution: [],
  });
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeRange, setTimeRange] = useState("year");
  const [loading, setLoading] = useState(true);

  // 모든 데이터 로드
  useEffect(() => {
    fetchAllData();
  }, []);

  // 시간 범위 변경 시 분석 데이터만 다시 로드
  useEffect(() => {
    if (!loading) {
      fetchAnalyticsData(timeRange);
    }
  }, [timeRange]);

  // 모든 데이터 가져오기
  const fetchAllData = async () => {
    setLoading(true);
    // 실제 구현에서는 API 호출로 대체
    setTimeout(() => {
      setDashboardData(getDashboardData());
      setAnalyticsData(getAnalyticsData("year"));
      setLoading(false);
    }, 1000);
  };

  // 분석 데이터만 가져오기
  const fetchAnalyticsData = async (range) => {
    setAnalyticsData(getAnalyticsData(range));
  };

  // 숫자 포맷팅 함수
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // 로딩 상태 표시
  if (loading) {
    return <PageLoading />;
  }

  return (
    <PageContainer title="대시보드">
      {/* 기본 대시보드 섹션 */}
      <div className="mb-10">
        {/* 통계 컴포넌트 */}
        <DashboardStats assetStats={dashboardData.assetStats} />

        {/* 활동 및 알림 컴포넌트 */}
        <DashboardActivity
          recentActivities={dashboardData.recentActivities}
          alerts={dashboardData.alerts}
        />

        {/* 자산 분포 컴포넌트 */}
        <DashboardDistribution
          categoryDistribution={dashboardData.categoryDistribution}
          locationDistribution={dashboardData.locationDistribution}
        />
      </div>

      {/* 분석 섹션 */}
      {analyticsData && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">자산 분석</h2>

          {/* 시간 범위 선택 */}
          <div className="flex justify-end mb-4">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setTimeRange("year")}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  timeRange === "year"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                } theme-transition`}
              >
                연간
              </button>
              <button
                onClick={() => setTimeRange("quarter")}
                className={`px-4 py-2 text-sm font-medium ${
                  timeRange === "quarter"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                } theme-transition`}
              >
                분기별
              </button>
              <button
                onClick={() => setTimeRange("multi-year")}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  timeRange === "multi-year"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                } theme-transition`}
              >
                다년간
              </button>
            </div>
          </div>

          {/* 자산 추이 분석 */}
          <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
            <div className="p-4 border-b border-border theme-transition flex items-center">
              <FaChartLine className="mr-2 text-primary" />
              <h3 className="text-lg font-medium text-foreground theme-transition">
                자산 추이 분석
              </h3>
            </div>
            <div className="p-4">
              <div className="h-80 w-full">
                {/* 차트 대신 간단한 시각화 */}
                <div className="h-full flex items-end space-x-2">
                  {analyticsData.assetTrends.map((item, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div className="w-full flex flex-col-reverse h-64">
                        <div
                          className="w-full bg-red-500"
                          style={{
                            height: `${(item.inactive / item.total) * 100}%`,
                          }}
                        ></div>
                        <div
                          className="w-full bg-yellow-500"
                          style={{
                            height: `${(item.maintenance / item.total) * 100}%`,
                          }}
                        ></div>
                        <div
                          className="w-full bg-green-500"
                          style={{
                            height: `${(item.active / item.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground theme-transition">
                        {item.period}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-center space-x-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 mr-2"></div>
                  <span className="text-sm text-foreground theme-transition">
                    사용 중
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
                  <span className="text-sm text-foreground theme-transition">
                    유지보수 중
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 mr-2"></div>
                  <span className="text-sm text-foreground theme-transition">
                    비활성
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 자산 가치 분석 및 활용률 분석 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 자산 가치 분석 */}
            <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
              <div className="p-4 border-b border-border theme-transition flex items-center">
                <FaMoneyBillWave className="mr-2 text-green-500" />
                <h3 className="text-lg font-medium text-foreground theme-transition">
                  자산 가치 분석
                </h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-muted/50 theme-transition">
                    <p className="text-sm text-muted-foreground theme-transition">
                      총 자산 가치
                    </p>
                    <p className="text-xl font-bold text-foreground theme-transition">
                      {formatCurrency(analyticsData.valueAnalysis.totalValue)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 theme-transition">
                    <p className="text-sm text-muted-foreground theme-transition">
                      감가상각 금액
                    </p>
                    <p className="text-xl font-bold text-red-500">
                      {formatCurrency(
                        analyticsData.valueAnalysis.depreciationValue
                      )}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 theme-transition">
                    <p className="text-sm text-muted-foreground theme-transition">
                      현재 자산 가치
                    </p>
                    <p className="text-xl font-bold text-green-500">
                      {formatCurrency(analyticsData.valueAnalysis.currentValue)}
                    </p>
                  </div>
                </div>

                <h4 className="text-md font-medium text-foreground theme-transition mb-4">
                  카테고리별 자산 가치
                </h4>
                <div className="space-y-3">
                  {analyticsData.valueAnalysis.valueByCategory.map(
                    (item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-foreground theme-transition">
                            {item.category}
                          </span>
                          <span className="text-sm text-foreground theme-transition">
                            {formatCurrency(item.value)}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5 theme-transition">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 theme-transition">
                          {item.percentage}%
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* 자산 활용률 분석 */}
            <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
              <div className="p-4 border-b border-border theme-transition flex items-center">
                <FaChartPie className="mr-2 text-blue-500" />
                <h3 className="text-lg font-medium text-foreground theme-transition">
                  자산 활용률 분석
                </h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {analyticsData.utilizationRates.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-muted/50 theme-transition"
                    >
                      <p className="text-sm text-muted-foreground theme-transition mb-2">
                        {item.category}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-foreground theme-transition">
                          {item.rate}%
                        </span>
                        <div className="w-24 bg-muted rounded-full h-2.5 theme-transition">
                          <div
                            className="bg-blue-500 h-2.5 rounded-full"
                            style={{ width: `${item.rate}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 유지보수 분석 및 예측 분석 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 유지보수 분석 */}
            <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
              <div className="p-4 border-b border-border theme-transition flex items-center">
                <FaTools className="mr-2 text-yellow-500" />
                <h3 className="text-lg font-medium text-foreground theme-transition">
                  유지보수 분석
                </h3>
              </div>
              <div className="p-4">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground theme-transition">
                    총 유지보수 비용
                  </p>
                  <p className="text-xl font-bold text-foreground theme-transition">
                    {formatCurrency(
                      analyticsData.maintenanceAnalysis.totalMaintenanceCost
                    )}
                  </p>
                </div>

                <h4 className="text-md font-medium text-foreground theme-transition mb-4">
                  카테고리별 유지보수 비용
                </h4>
                <div className="space-y-3">
                  {analyticsData.maintenanceAnalysis.costByCategory.map(
                    (item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-foreground theme-transition">
                            {item.category}
                          </span>
                          <span className="text-sm text-foreground theme-transition">
                            {formatCurrency(item.cost)}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5 theme-transition">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 theme-transition">
                          {item.percentage}%
                        </p>
                      </div>
                    )
                  )}
                </div>

                <h4 className="text-md font-medium text-foreground theme-transition mt-6 mb-4">
                  월별 유지보수 빈도
                </h4>
                <div className="h-40 w-full">
                  {/* 간단한 막대 차트 시각화 */}
                  <div className="h-full flex items-end space-x-1">
                    {analyticsData.maintenanceAnalysis.maintenanceFrequency.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex-1 bg-blue-500"
                          style={{ height: `${item.count * 3}px` }}
                        ></div>
                      )
                    )}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground theme-transition">
                    {analyticsData.maintenanceAnalysis.maintenanceFrequency.map(
                      (item, index) => (
                        <span key={index}>{item.month}</span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 예측 분석 */}
            <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
              <div className="p-4 border-b border-border theme-transition flex items-center">
                <FaExclamationTriangle className="mr-2 text-red-500" />
                <h3 className="text-lg font-medium text-foreground theme-transition">
                  예측 분석
                </h3>
              </div>
              <div className="p-4">
                <h4 className="text-md font-medium text-foreground theme-transition mb-4">
                  자산 교체 예측
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th className="px-5 py-3 border-b-2 border-border bg-card text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider theme-transition">
                          분기
                        </th>
                        <th className="px-5 py-3 border-b-2 border-border bg-card text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider theme-transition">
                          예상 건수
                        </th>
                        <th className="px-5 py-3 border-b-2 border-border bg-card text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider theme-transition">
                          예상 비용
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.predictiveAnalysis.assetReplacement.map(
                        (item, index) => (
                          <tr key={index}>
                            <td className="px-5 py-5 border-b border-border bg-card text-sm theme-transition">
                              {item.quarter}
                            </td>
                            <td className="px-5 py-5 border-b border-border bg-card text-sm theme-transition">
                              {item.count}
                            </td>
                            <td className="px-5 py-5 border-b border-border bg-card text-sm theme-transition">
                              {formatCurrency(item.estimatedCost)}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                <h4 className="text-md font-medium text-foreground theme-transition mt-6 mb-4">
                  유지보수 예측
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th className="px-5 py-3 border-b-2 border-border bg-card text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider theme-transition">
                          분기
                        </th>
                        <th className="px-5 py-3 border-b-2 border-border bg-card text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider theme-transition">
                          예상 건수
                        </th>
                        <th className="px-5 py-3 border-b-2 border-border bg-card text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider theme-transition">
                          예상 비용
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.predictiveAnalysis.maintenanceForecast.map(
                        (item, index) => (
                          <tr key={index}>
                            <td className="px-5 py-5 border-b border-border bg-card text-sm theme-transition">
                              {item.quarter}
                            </td>
                            <td className="px-5 py-5 border-b border-border bg-card text-sm theme-transition">
                              {item.count}
                            </td>
                            <td className="px-5 py-5 border-b border-border bg-card text-sm theme-transition">
                              {formatCurrency(item.estimatedCost)}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Dashboard;
