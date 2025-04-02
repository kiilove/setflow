"use client";

import { useState, useEffect } from "react";
import {
  FaChartLine,
  FaChartPie,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTools,
  FaExclamationTriangle,
} from "react-icons/fa";

const DashboardAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    assetTrends: [],
    valueAnalysis: {},
    utilizationRates: [],
    maintenanceAnalysis: {},
    predictiveAnalysis: {},
  });
  const [timeRange, setTimeRange] = useState("year");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실제 API 호출 대신 더미 데이터 사용
    fetchAnalyticsData(timeRange);
  }, [timeRange]);

  const fetchAnalyticsData = async (range) => {
    // 실제 구현에서는 API 호출로 대체
    setTimeout(() => {
      setAnalyticsData({
        assetTrends: generateAssetTrendsData(range),
        valueAnalysis: {
          totalValue: 125750000,
          depreciationValue: 32450000,
          currentValue: 93300000,
          valueByCategory: [
            { category: "컴퓨터", value: 45000000, percentage: 35.8 },
            { category: "서버", value: 35000000, percentage: 27.8 },
            { category: "네트워크장비", value: 18000000, percentage: 14.3 },
            { category: "모바일기기", value: 12000000, percentage: 9.5 },
            { category: "사무기기", value: 8500000, percentage: 6.8 },
            { category: "소프트웨어", value: 5000000, percentage: 4.0 },
            { category: "가구", value: 2250000, percentage: 1.8 },
          ],
        },
        utilizationRates: [
          { category: "컴퓨터", rate: 92 },
          { category: "서버", rate: 98 },
          { category: "네트워크장비", rate: 95 },
          { category: "모바일기기", rate: 85 },
          { category: "사무기기", rate: 78 },
        ],
        maintenanceAnalysis: {
          totalMaintenanceCost: 5870000,
          costByCategory: [
            { category: "컴퓨터", cost: 1250000, percentage: 21.3 },
            { category: "서버", cost: 2350000, percentage: 40.0 },
            { category: "네트워크장비", cost: 950000, percentage: 16.2 },
            { category: "모바일기기", cost: 420000, percentage: 7.2 },
            { category: "사무기기", cost: 900000, percentage: 15.3 },
          ],
          maintenanceFrequency: [
            { month: "1월", count: 12 },
            { month: "2월", count: 8 },
            { month: "3월", count: 15 },
            { month: "4월", count: 10 },
            { month: "5월", count: 7 },
            { month: "6월", count: 14 },
            { month: "7월", count: 18 },
            { month: "8월", count: 9 },
            { month: "9월", count: 11 },
            { month: "10월", count: 13 },
            { month: "11월", count: 16 },
            { month: "12월", count: 20 },
          ],
        },
        predictiveAnalysis: {
          assetReplacement: [
            { quarter: "Q1 2024", count: 15, estimatedCost: 12500000 },
            { quarter: "Q2 2024", count: 22, estimatedCost: 18700000 },
            { quarter: "Q3 2024", count: 18, estimatedCost: 15200000 },
            { quarter: "Q4 2024", count: 25, estimatedCost: 21500000 },
          ],
          maintenanceForecast: [
            { quarter: "Q1 2024", count: 35, estimatedCost: 1750000 },
            { quarter: "Q2 2024", count: 42, estimatedCost: 2100000 },
            { quarter: "Q3 2024", count: 38, estimatedCost: 1900000 },
            { quarter: "Q4 2024", count: 45, estimatedCost: 2250000 },
          ],
        },
      });
      setLoading(false);
    }, 1000);
  };

  // 시간 범위에 따른 자산 추이 데이터 생성
  const generateAssetTrendsData = (range) => {
    if (range === "year") {
      return [
        {
          period: "1월",
          total: 220,
          active: 180,
          maintenance: 25,
          inactive: 15,
        },
        {
          period: "2월",
          total: 225,
          active: 182,
          maintenance: 28,
          inactive: 15,
        },
        {
          period: "3월",
          total: 230,
          active: 185,
          maintenance: 30,
          inactive: 15,
        },
        {
          period: "4월",
          total: 235,
          active: 190,
          maintenance: 28,
          inactive: 17,
        },
        {
          period: "5월",
          total: 240,
          active: 195,
          maintenance: 25,
          inactive: 20,
        },
        {
          period: "6월",
          total: 245,
          active: 198,
          maintenance: 27,
          inactive: 20,
        },
        {
          period: "7월",
          total: 248,
          active: 200,
          maintenance: 28,
          inactive: 20,
        },
        {
          period: "8월",
          total: 250,
          active: 202,
          maintenance: 28,
          inactive: 20,
        },
        {
          period: "9월",
          total: 252,
          active: 205,
          maintenance: 27,
          inactive: 20,
        },
        {
          period: "10월",
          total: 254,
          active: 205,
          maintenance: 29,
          inactive: 20,
        },
        {
          period: "11월",
          total: 255,
          active: 200,
          maintenance: 30,
          inactive: 25,
        },
        {
          period: "12월",
          total: 256,
          active: 198,
          maintenance: 32,
          inactive: 26,
        },
      ];
    } else if (range === "quarter") {
      return [
        {
          period: "1분기",
          total: 230,
          active: 185,
          maintenance: 30,
          inactive: 15,
        },
        {
          period: "2분기",
          total: 245,
          active: 198,
          maintenance: 27,
          inactive: 20,
        },
        {
          period: "3분기",
          total: 252,
          active: 205,
          maintenance: 27,
          inactive: 20,
        },
        {
          period: "4분기",
          total: 256,
          active: 198,
          maintenance: 32,
          inactive: 26,
        },
      ];
    } else {
      return [
        {
          period: "2020",
          total: 180,
          active: 150,
          maintenance: 20,
          inactive: 10,
        },
        {
          period: "2021",
          total: 210,
          active: 175,
          maintenance: 25,
          inactive: 10,
        },
        {
          period: "2022",
          total: 235,
          active: 190,
          maintenance: 30,
          inactive: 15,
        },
        {
          period: "2023",
          total: 256,
          active: 198,
          maintenance: 32,
          inactive: 26,
        },
      ];
    }
  };

  // 숫자 포맷팅 함수
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="bg-card text-card-foreground rounded-lg shadow-md p-6 border border-border theme-transition mb-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            {/* 실제 구현에서는 차트 라이브러리 사용 */}
            <div className="h-full flex items-end space-x-2">
              {analyticsData.assetTrends.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
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
                      style={{ height: `${(item.active / item.total) * 100}%` }}
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

      {/* 자산 가치 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <div className="flex items-center">
                    <div className="w-full bg-muted rounded-full h-4 mr-2 theme-transition">
                      <div
                        className={`h-4 rounded-full ${
                          item.rate >= 90
                            ? "bg-green-500"
                            : item.rate >= 80
                            ? "bg-blue-500"
                            : item.rate >= 70
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${item.rate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-foreground theme-transition min-w-[40px]">
                      {item.rate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <h4 className="text-md font-medium text-foreground theme-transition mb-4">
              활용률 분석
            </h4>
            <div className="p-4 rounded-lg bg-muted/50 theme-transition">
              <p className="text-sm text-foreground theme-transition mb-2">
                자산 활용률은 전체적으로{" "}
                <span className="font-medium text-green-500">양호</span>한
                수준입니다. 서버와 네트워크 장비의 활용률이 가장 높으며,
                사무기기의 활용률이 상대적으로 낮습니다.
              </p>
              <p className="text-sm text-foreground theme-transition">
                <span className="font-medium text-yellow-500">개선 필요:</span>{" "}
                사무기기의 활용률을 높이기 위한 재배치 또는 업그레이드를
                고려해볼 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 유지보수 분석 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
        <div className="p-4 border-b border-border theme-transition flex items-center">
          <FaTools className="mr-2 text-yellow-500" />
          <h3 className="text-lg font-medium text-foreground theme-transition">
            유지보수 분석
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
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
                          className="bg-yellow-500 h-2.5 rounded-full"
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
              <div className="mt-4 p-4 rounded-lg bg-muted/50 theme-transition">
                <p className="text-sm text-foreground theme-transition">
                  총 유지보수 비용:{" "}
                  <span className="font-medium">
                    {formatCurrency(
                      analyticsData.maintenanceAnalysis.totalMaintenanceCost
                    )}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-foreground theme-transition mb-4">
                월별 유지보수 빈도
              </h4>
              <div className="h-64">
                {/* 실제 구현에서는 차트 라이브러리 사용 */}
                <div className="h-full flex items-end space-x-1">
                  {analyticsData.maintenanceAnalysis.maintenanceFrequency.map(
                    (item, index) => {
                      const maxCount = Math.max(
                        ...analyticsData.maintenanceAnalysis.maintenanceFrequency.map(
                          (i) => i.count
                        )
                      );
                      const height = (item.count / maxCount) * 100;

                      return (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center"
                        >
                          <div
                            className="w-full bg-yellow-500 rounded-t-sm"
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className="mt-2 text-xs text-muted-foreground theme-transition">
                            {item.month}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 예측 분석 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
        <div className="p-4 border-b border-border theme-transition flex items-center">
          <FaCalendarAlt className="mr-2 text-purple-500" />
          <h3 className="text-lg font-medium text-foreground theme-transition">
            예측 분석
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-foreground theme-transition mb-4">
                자산 교체 예측
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border theme-transition">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider theme-transition">
                        분기
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider theme-transition">
                        교체 예정 자산
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider theme-transition">
                        예상 비용
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border theme-transition">
                    {analyticsData.predictiveAnalysis.assetReplacement.map(
                      (item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground theme-transition">
                            {item.quarter}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground theme-transition">
                            {item.count}개
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground theme-transition">
                            {formatCurrency(item.estimatedCost)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 theme-transition">
                <div className="flex items-start">
                  <FaExclamationTriangle className="text-yellow-500 mt-0.5 mr-2" />
                  <p className="text-sm text-foreground theme-transition">
                    2024년 총 예상 교체 비용:{" "}
                    <span className="font-medium">
                      {formatCurrency(
                        analyticsData.predictiveAnalysis.assetReplacement.reduce(
                          (sum, item) => sum + item.estimatedCost,
                          0
                        )
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-foreground theme-transition mb-4">
                유지보수 예측
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border theme-transition">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider theme-transition">
                        분기
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider theme-transition">
                        예상 유지보수 건수
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider theme-transition">
                        예상 비용
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border theme-transition">
                    {analyticsData.predictiveAnalysis.maintenanceForecast.map(
                      (item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground theme-transition">
                            {item.quarter}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground theme-transition">
                            {item.count}건
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground theme-transition">
                            {formatCurrency(item.estimatedCost)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 theme-transition">
                <p className="text-sm text-foreground theme-transition">
                  <span className="font-medium">분석 결과:</span> 3분기에 비해
                  4분기에 유지보수 건수가 약 18% 증가할 것으로 예상됩니다. 이에
                  따른 예산 및 인력 계획을 미리 수립하는 것이 좋습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
