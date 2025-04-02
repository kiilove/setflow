"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChartLine,
  FaCalculator,
  FaMoneyBillWave,
  FaFilter,
} from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";

const FinanceCosts = () => {
  const [filterYear, setFilterYear] = useState("2023");
  const [filterQuarter, setFilterQuarter] = useState("");

  // 예시 비용 데이터
  const costSummary = {
    totalCosts: "₩12,450,000",
    acquisitionCosts: "₩8,700,000",
    maintenanceCosts: "₩2,850,000",
    operationalCosts: "₩900,000",
  };

  // 예시 월별 비용 데이터
  const monthlyCosts = [
    {
      month: "1월",
      acquisition: 2500000,
      maintenance: 250000,
      operational: 75000,
    },
    { month: "2월", acquisition: 0, maintenance: 320000, operational: 75000 },
    {
      month: "3월",
      acquisition: 1200000,
      maintenance: 180000,
      operational: 75000,
    },
    { month: "4월", acquisition: 0, maintenance: 250000, operational: 75000 },
    {
      month: "5월",
      acquisition: 3500000,
      maintenance: 150000,
      operational: 75000,
    },
    { month: "6월", acquisition: 0, maintenance: 450000, operational: 75000 },
    {
      month: "7월",
      acquisition: 1500000,
      maintenance: 350000,
      operational: 75000,
    },
    { month: "8월", acquisition: 0, maintenance: 200000, operational: 75000 },
    { month: "9월", acquisition: 0, maintenance: 150000, operational: 75000 },
    { month: "10월", acquisition: 0, maintenance: 200000, operational: 75000 },
    { month: "11월", acquisition: 0, maintenance: 150000, operational: 75000 },
    { month: "12월", acquisition: 0, maintenance: 200000, operational: 75000 },
  ];

  // 예시 카테고리별 비용 데이터
  const categoryCosts = [
    {
      category: "컴퓨터",
      acquisition: 4500000,
      maintenance: 850000,
      operational: 300000,
    },
    {
      category: "서버",
      acquisition: 2000000,
      maintenance: 1200000,
      operational: 450000,
    },
    {
      category: "네트워크장비",
      acquisition: 1200000,
      maintenance: 350000,
      operational: 150000,
    },
    {
      category: "모바일기기",
      acquisition: 800000,
      maintenance: 150000,
      operational: 0,
    },
    {
      category: "사무기기",
      acquisition: 200000,
      maintenance: 300000,
      operational: 0,
    },
  ];

  // 분기별 필터링
  const getQuarterMonths = (quarter) => {
    switch (quarter) {
      case "Q1":
        return ["1월", "2월", "3월"];
      case "Q2":
        return ["4월", "5월", "6월"];
      case "Q3":
        return ["7월", "8월", "9월"];
      case "Q4":
        return ["10월", "11월", "12월"];
      default:
        return monthlyCosts.map((item) => item.month);
    }
  };

  const filteredMonthlyCosts = filterQuarter
    ? monthlyCosts.filter((item) =>
        getQuarterMonths(filterQuarter).includes(item.month)
      )
    : monthlyCosts;

  return (
    <PageContainer title="자산 비용 분석">
      <div className="mb-6 flex flex-wrap gap-4">
        <Link
          to="/finance"
          className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
            "secondary"
          )}`}
        >
          <FaChartLine className="h-4 w-4" />
          <span>재무 개요</span>
        </Link>
        <Link
          to="/finance/depreciation"
          className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
            "secondary"
          )}`}
        >
          <FaCalculator className="h-4 w-4" />
          <span>감가상각</span>
        </Link>
        <Link
          to="/finance/costs"
          className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
            "primary"
          )}`}
        >
          <FaMoneyBillWave className="h-4 w-4" />
          <span>비용 분석</span>
        </Link>
      </div>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
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

          {/* 분기 필터 */}
          <div className="relative"></div>

          {/* 분기 필터 */}
          <div className="relative">
            <select
              className="w-full md:w-48 pl-10 pr-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={filterQuarter}
              onChange={(e) => setFilterQuarter(e.target.value)}
            >
              <option value="">전체 기간</option>
              <option value="Q1">1분기 (1월-3월)</option>
              <option value="Q2">2분기 (4월-6월)</option>
              <option value="Q3">3분기 (7월-9월)</option>
              <option value="Q4">4분기 (10월-12월)</option>
            </select>
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* 비용 요약 카드 */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-2">총 비용</h3>
          <p className="text-2xl font-bold text-primary">
            {costSummary.totalCosts}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            모든 자산 관련 비용
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-2">
            취득 비용
          </h3>
          <p className="text-2xl font-bold text-sky-500 dark:text-sky-400">
            {costSummary.acquisitionCosts}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            신규 자산 구매 비용
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-2">
            유지보수 비용
          </h3>
          <p className="text-2xl font-bold text-amber-500 dark:text-amber-400">
            {costSummary.maintenanceCosts}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            수리 및 유지보수 비용
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-2">
            운영 비용
          </h3>
          <p className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">
            {costSummary.operationalCosts}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            라이센스 및 기타 운영 비용
          </p>
        </div>
      </div>

      {/* 월별 비용 차트 */}
      <div className="rounded-lg border border-border bg-card p-4 shadow-md mb-6">
        <h3 className="text-lg font-medium text-foreground mb-4">
          월별 비용 분석
        </h3>
        <div className="h-64">
          {/* 실제로는 차트 라이브러리를 사용하여 시각화할 수 있습니다 */}
          <div className="h-full flex items-end space-x-2">
            {filteredMonthlyCosts.map((item, index) => {
              const total =
                item.acquisition + item.maintenance + item.operational;
              const maxValue = 4000000; // 최대값 기준
              const height = (total / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col-reverse">
                    <div
                      className="w-full bg-sky-500 dark:bg-sky-600"
                      style={{
                        height: `${(item.acquisition / maxValue) * 100}%`,
                      }}
                    ></div>
                    <div
                      className="w-full bg-amber-500 dark:bg-amber-600"
                      style={{
                        height: `${(item.maintenance / maxValue) * 100}%`,
                      }}
                    ></div>
                    <div
                      className="w-full bg-emerald-500 dark:bg-emerald-600"
                      style={{
                        height: `${(item.operational / maxValue) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {item.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-4 flex justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-sky-500 dark:bg-sky-600 mr-2"></div>
            <span className="text-sm text-foreground/80">취득 비용</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-amber-500 dark:bg-amber-600 mr-2"></div>
            <span className="text-sm text-foreground/80">유지보수 비용</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-emerald-500 dark:bg-emerald-600 mr-2"></div>
            <span className="text-sm text-foreground/80">운영 비용</span>
          </div>
        </div>
      </div>

      {/* 카테고리별 비용 테이블 */}
      <div className="rounded-lg border border-border bg-card p-4 shadow-md">
        <h3 className="text-lg font-medium text-foreground mb-4">
          카테고리별 비용 분석
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
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
                  취득 비용
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  유지보수 비용
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  운영 비용
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  총 비용
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categoryCosts.map((item, index) => {
                const total =
                  item.acquisition + item.maintenance + item.operational;
                return (
                  <tr key={index} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {new Intl.NumberFormat("ko-KR", {
                        style: "currency",
                        currency: "KRW",
                      }).format(item.acquisition)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {new Intl.NumberFormat("ko-KR", {
                        style: "currency",
                        currency: "KRW",
                      }).format(item.maintenance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {new Intl.NumberFormat("ko-KR", {
                        style: "currency",
                        currency: "KRW",
                      }).format(item.operational)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      {new Intl.NumberFormat("ko-KR", {
                        style: "currency",
                        currency: "KRW",
                      }).format(total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
};

export default FinanceCosts;
