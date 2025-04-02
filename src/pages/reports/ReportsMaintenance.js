"use client";

import { useState } from "react";
import { FaFilter, FaDownload, FaChartBar } from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";

const ReportsMaintenance = () => {
  const [filterCategory, setFilterCategory] = useState("");
  const [filterYear, setFilterYear] = useState("2023");
  const [filterType, setFilterType] = useState("");

  // 예시 카테고리 목록
  const categories = [
    "컴퓨터",
    "주변기기",
    "모바일기기",
    "사무기기",
    "서버",
    "네트워크장비",
    "소프트웨어",
    "가구",
  ];

  // 예시 유지보수 유형
  const maintenanceTypes = ["정기점검", "수리", "업그레이드", "교체", "기타"];

  // 예시 유지보수 데이터
  const maintenanceData = [
    {
      category: "컴퓨터",
      totalCost: 1250000,
      recordCount: 25,
      types: {
        정기점검: { count: 15, cost: 450000 },
        수리: { count: 8, cost: 600000 },
        업그레이드: { count: 2, cost: 200000 },
      },
      monthlyCosts: {
        "1월": 120000,
        "2월": 80000,
        "3월": 150000,
        "4월": 100000,
        "5월": 80000,
        "6월": 120000,
        "7월": 150000,
        "8월": 100000,
        "9월": 80000,
        "10월": 120000,
        "11월": 80000,
        "12월": 70000,
      },
    },
    {
      category: "주변기기",
      totalCost: 580000,
      recordCount: 18,
      types: {
        정기점검: { count: 10, cost: 200000 },
        수리: { count: 6, cost: 280000 },
        교체: { count: 2, cost: 100000 },
      },
      monthlyCosts: {
        "1월": 50000,
        "2월": 30000,
        "3월": 60000,
        "4월": 40000,
        "5월": 50000,
        "6월": 60000,
        "7월": 70000,
        "8월": 40000,
        "9월": 50000,
        "10월": 40000,
        "11월": 50000,
        "12월": 40000,
      },
    },
    {
      category: "서버",
      totalCost: 2800000,
      recordCount: 12,
      types: {
        정기점검: { count: 4, cost: 800000 },
        수리: { count: 2, cost: 600000 },
        업그레이드: { count: 6, cost: 1400000 },
      },
      monthlyCosts: {
        "1월": 200000,
        "2월": 0,
        "3월": 400000,
        "4월": 0,
        "5월": 600000,
        "6월": 0,
        "7월": 800000,
        "8월": 0,
        "9월": 400000,
        "10월": 0,
        "11월": 200000,
        "12월": 200000,
      },
    },
    {
      category: "네트워크장비",
      totalCost: 950000,
      recordCount: 8,
      types: {
        정기점검: { count: 4, cost: 200000 },
        수리: { count: 2, cost: 350000 },
        업그레이드: { count: 2, cost: 400000 },
      },
      monthlyCosts: {
        "1월": 100000,
        "2월": 0,
        "3월": 150000,
        "4월": 0,
        "5월": 200000,
        "6월": 0,
        "7월": 300000,
        "8월": 0,
        "9월": 100000,
        "10월": 0,
        "11월": 50000,
        "12월": 50000,
      },
    },
    {
      category: "사무기기",
      totalCost: 420000,
      recordCount: 15,
      types: {
        정기점검: { count: 8, cost: 160000 },
        수리: { count: 7, cost: 260000 },
      },
      monthlyCosts: {
        "1월": 40000,
        "2월": 30000,
        "3월": 40000,
        "4월": 30000,
        "5월": 40000,
        "6월": 30000,
        "7월": 40000,
        "8월": 30000,
        "9월": 40000,
        "10월": 30000,
        "11월": 40000,
        "12월": 30000,
      },
    },
  ];

  // 필터링된 데이터
  const filteredData = maintenanceData.filter(
    (item) => filterCategory === "" || item.category === filterCategory
  );

  // 총계 계산
  const totalCost = filteredData.reduce((sum, item) => sum + item.totalCost, 0);
  const totalRecordCount = filteredData.reduce(
    (sum, item) => sum + item.recordCount,
    0
  );

  // 유형별 총계 계산
  const typeData = {};
  filteredData.forEach((item) => {
    Object.entries(item.types).forEach(([type, data]) => {
      if (!typeData[type]) {
        typeData[type] = { count: 0, cost: 0 };
      }
      typeData[type].count += data.count;
      typeData[type].cost += data.cost;
    });
  });

  // 월별 총계 계산
  const monthlyData = {};
  const months = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];
  months.forEach((month) => {
    monthlyData[month] = filteredData.reduce(
      (sum, item) => sum + (item.monthlyCosts[month] || 0),
      0
    );
  });

  return (
    <PageContainer title="유지보수 보고서">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          {/* 카테고리 필터 */}
          <div className="relative">
            <select
              className="w-full md:w-48 pl-10 pr-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">모든 카테고리</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>

          {/* 연도 필터 */}
          <div className="relative">
            <select
              className="w-full md:w-48 pl-10 pr-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="2023">2023년</option>
              <option value="2022">2022년</option>
              <option value="2021">2021년</option>
            </select>
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>

          {/* 유형 필터 */}
          <div className="relative">
            <select
              className="w-full md:w-48 pl-10 pr-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">모든 유형</option>
              {maintenanceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <button
          className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
            "secondary"
          )}`}
        >
          <FaDownload className="h-4 w-4" />
          <span>내보내기</span>
        </button>
      </div>

      {/* 요약 정보 */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-2">
            총 유지보수 비용
          </h3>
          <p className="text-2xl font-bold text-primary">
            {new Intl.NumberFormat("ko-KR", {
              style: "currency",
              currency: "KRW",
            }).format(totalCost)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {filterCategory ? `${filterCategory} 카테고리의 ` : ""}
            {filterYear}년 유지보수 비용
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-2">
            유지보수 건수
          </h3>
          <p className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">
            {totalRecordCount}건
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {filterCategory ? `${filterCategory} 카테고리의 ` : ""}
            {filterYear}년 유지보수 건수
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-2">
            평균 유지보수 비용
          </h3>
          <p className="text-2xl font-bold text-amber-500 dark:text-amber-400">
            {new Intl.NumberFormat("ko-KR", {
              style: "currency",
              currency: "KRW",
            }).format(totalRecordCount > 0 ? totalCost / totalRecordCount : 0)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {filterCategory ? `${filterCategory} 카테고리의 ` : ""}
            {filterYear}년 건당 평균 비용
          </p>
        </div>
      </div>

      {/* 월별 유지보수 비용 차트 */}
      <div className="rounded-lg border border-border bg-card p-4 shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-foreground">
            월별 유지보수 비용
          </h3>
          <div className="flex items-center">
            <FaChartBar className="text-primary mr-2" />
            <span className="text-muted-foreground">
              {filterYear}년 월별 비용
            </span>
          </div>
        </div>
        <div className="h-64 flex items-end space-x-2">
          {months.map((month) => {
            const monthCost = monthlyData[month] || 0;
            const maxMonthCost = Math.max(...Object.values(monthlyData));
            const heightPercentage =
              maxMonthCost > 0 ? (monthCost / maxMonthCost) * 100 : 0;
            return (
              <div key={month} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-primary rounded-t"
                  style={{ height: `${heightPercentage}%` }}
                ></div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {month}
                </div>
                <div className="text-xs text-foreground">
                  {new Intl.NumberFormat("ko-KR", {
                    style: "currency",
                    currency: "KRW",
                  }).format(monthCost)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 유형별 유지보수 테이블 */}
      <div className="rounded-lg border border-border bg-card p-4 shadow-md mb-6">
        <h3 className="text-lg font-medium text-foreground mb-4">
          유형별 유지보수 분석
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  유지보수 유형
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  건수
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  총 비용
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  평균 비용
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  비율 (비용)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Object.entries(typeData).map(([type, data], index) => (
                <tr key={index} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {data.count}건
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {new Intl.NumberFormat("ko-KR", {
                      style: "currency",
                      currency: "KRW",
                    }).format(data.cost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {new Intl.NumberFormat("ko-KR", {
                      style: "currency",
                      currency: "KRW",
                    }).format(data.count > 0 ? data.cost / data.count : 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {totalCost > 0
                      ? ((data.cost / totalCost) * 100).toFixed(1)
                      : 0}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 카테고리별 유지보수 테이블 */}
      <div className="rounded-lg border border-border bg-card p-4 shadow-md">
        <h3 className="text-lg font-medium text-foreground mb-4">
          카테고리별 유지보수 분석
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  카테고리
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  건수
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  총 비용
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  평균 비용
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  비율 (비용)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {item.recordCount}건
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {new Intl.NumberFormat("ko-KR", {
                      style: "currency",
                      currency: "KRW",
                    }).format(item.totalCost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {new Intl.NumberFormat("ko-KR", {
                      style: "currency",
                      currency: "KRW",
                    }).format(
                      item.recordCount > 0
                        ? item.totalCost / item.recordCount
                        : 0
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {totalCost > 0
                      ? ((item.totalCost / totalCost) * 100).toFixed(1)
                      : 0}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
};

export default ReportsMaintenance;
