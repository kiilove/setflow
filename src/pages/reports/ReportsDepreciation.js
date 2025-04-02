"use client";

import { useState } from "react";
import { FaFilter, FaDownload, FaChartLine } from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";

const ReportsDepreciation = () => {
  const [filterCategory, setFilterCategory] = useState("");
  const [filterYear, setFilterYear] = useState("2023");

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

  // 예시 감가상각 데이터
  const depreciationData = [
    {
      category: "컴퓨터",
      originalValue: 67500000,
      currentValue: 47250000,
      depreciationAmount: 20250000,
      depreciationRate: 30,
      yearlyDepreciation: {
        2021: 6750000,
        2022: 6750000,
        2023: 6750000,
        2024: 6750000,
        2025: 6750000,
      },
    },
    {
      category: "주변기기",
      originalValue: 15600000,
      currentValue: 10920000,
      depreciationAmount: 4680000,
      depreciationRate: 30,
      yearlyDepreciation: {
        2021: 1560000,
        2022: 1560000,
        2023: 1560000,
        2024: 1560000,
        2025: 1560000,
      },
    },
    {
      category: "모바일기기",
      originalValue: 19200000,
      currentValue: 13440000,
      depreciationAmount: 5760000,
      depreciationRate: 30,
      yearlyDepreciation: {
        2021: 1920000,
        2022: 1920000,
        2023: 1920000,
        2024: 1920000,
        2025: 1920000,
      },
    },
    {
      category: "사무기기",
      originalValue: 9600000,
      currentValue: 7200000,
      depreciationAmount: 2400000,
      depreciationRate: 25,
      yearlyDepreciation: {
        2021: 800000,
        2022: 800000,
        2023: 800000,
        2024: 800000,
        2025: 800000,
      },
    },
    {
      category: "서버",
      originalValue: 48000000,
      currentValue: 38400000,
      depreciationAmount: 9600000,
      depreciationRate: 20,
      yearlyDepreciation: {
        2021: 3200000,
        2022: 3200000,
        2023: 3200000,
        2024: 3200000,
        2025: 3200000,
      },
    },
    {
      category: "네트워크장비",
      originalValue: 9000000,
      currentValue: 7200000,
      depreciationAmount: 1800000,
      depreciationRate: 20,
      yearlyDepreciation: {
        2021: 600000,
        2022: 600000,
        2023: 600000,
        2024: 600000,
        2025: 600000,
      },
    },
    {
      category: "소프트웨어",
      originalValue: 28000000,
      currentValue: 19600000,
      depreciationAmount: 8400000,
      depreciationRate: 30,
      yearlyDepreciation: {
        2021: 2800000,
        2022: 2800000,
        2023: 2800000,
        2024: 2800000,
        2025: 2800000,
      },
    },
    {
      category: "가구",
      originalValue: 7400000,
      currentValue: 6290000,
      depreciationAmount: 1110000,
      depreciationRate: 15,
      yearlyDepreciation: {
        2021: 370000,
        2022: 370000,
        2023: 370000,
        2024: 370000,
        2025: 370000,
      },
    },
  ];

  // 필터링된 데이터
  const filteredData = depreciationData.filter(
    (item) => filterCategory === "" || item.category === filterCategory
  );

  // 총계 계산
  const totalOriginalValue = filteredData.reduce(
    (sum, item) => sum + item.originalValue,
    0
  );
  const totalCurrentValue = filteredData.reduce(
    (sum, item) => sum + item.currentValue,
    0
  );
  const totalDepreciationAmount = filteredData.reduce(
    (sum, item) => sum + item.depreciationAmount,
    0
  );
  const totalYearlyDepreciation = filteredData.reduce(
    (sum, item) => sum + (item.yearlyDepreciation[filterYear] || 0),
    0
  );

  return (
    <PageContainer title="감가상각 보고서">
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
              <option value="2021">2021년</option>
              <option value="2022">2022년</option>
              <option value="2023">2023년</option>
              <option value="2024">2024년</option>
              <option value="2025">2025년</option>
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
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-2">
            원래 자산 가치
          </h3>
          <p className="text-2xl font-bold text-primary">
            {new Intl.NumberFormat("ko-KR", {
              style: "currency",
              currency: "KRW",
            }).format(totalOriginalValue)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {filterCategory ? `${filterCategory} 카테고리의 ` : ""}총 취득 가치
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-2">
            현재 자산 가치
          </h3>
          <p className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">
            {new Intl.NumberFormat("ko-KR", {
              style: "currency",
              currency: "KRW",
            }).format(totalCurrentValue)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {filterCategory ? `${filterCategory} 카테고리의 ` : ""}감가상각 후
            가치
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-2">
            총 감가상각액
          </h3>
          <p className="text-2xl font-bold text-rose-500 dark:text-rose-400">
            {new Intl.NumberFormat("ko-KR", {
              style: "currency",
              currency: "KRW",
            }).format(totalDepreciationAmount)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {filterCategory ? `${filterCategory} 카테고리의 ` : ""}누적
            감가상각액
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-2">
            {filterYear}년 감가상각액
          </h3>
          <p className="text-2xl font-bold text-amber-500 dark:text-amber-400">
            {new Intl.NumberFormat("ko-KR", {
              style: "currency",
              currency: "KRW",
            }).format(totalYearlyDepreciation)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {filterCategory ? `${filterCategory} 카테고리의 ` : ""}
            {filterYear}년 감가상각액
          </p>
        </div>
      </div>

      {/* 감가상각 차트 (간단한 예시) */}
      <div className="rounded-lg border border-border bg-card p-4 shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-foreground">
            연도별 감가상각 추이
          </h3>
          <div className="flex items-center">
            <FaChartLine className="text-primary mr-2" />
            <span className="text-muted-foreground">감가상각 추이</span>
          </div>
        </div>
        <div className="h-64 flex items-end space-x-8">
          {["2021", "2022", "2023", "2024", "2025"].map((year) => {
            const yearlyTotal = filteredData.reduce(
              (sum, item) => sum + (item.yearlyDepreciation[year] || 0),
              0
            );
            const maxYearlyTotal = Math.max(
              ...["2021", "2022", "2023", "2024", "2025"].map((y) =>
                filteredData.reduce(
                  (sum, item) => sum + (item.yearlyDepreciation[y] || 0),
                  0
                )
              )
            );
            const heightPercentage = (yearlyTotal / maxYearlyTotal) * 100;
            return (
              <div key={year} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full ${
                    year === filterYear ? "bg-primary" : "bg-muted"
                  } rounded-t`}
                  style={{ height: `${heightPercentage}%` }}
                ></div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {year}년
                </div>
                <div className="text-sm text-foreground">
                  {new Intl.NumberFormat("ko-KR", {
                    style: "currency",
                    currency: "KRW",
                  }).format(yearlyTotal)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 감가상각 테이블 */}
      <div className="rounded-lg border border-border bg-card p-4 shadow-md overflow-x-auto">
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
                원래 가치
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                현재 가치
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                감가상각액
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                감가상각률
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                {filterYear}년 감가상각액
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
                  {new Intl.NumberFormat("ko-KR", {
                    style: "currency",
                    currency: "KRW",
                  }).format(item.originalValue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {new Intl.NumberFormat("ko-KR", {
                    style: "currency",
                    currency: "KRW",
                  }).format(item.currentValue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {new Intl.NumberFormat("ko-KR", {
                    style: "currency",
                    currency: "KRW",
                  }).format(item.depreciationAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {item.depreciationRate}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {new Intl.NumberFormat("ko-KR", {
                    style: "currency",
                    currency: "KRW",
                  }).format(item.yearlyDepreciation[filterYear] || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
};

export default ReportsDepreciation;
