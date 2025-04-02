"use client";

import { useState } from "react";
import {
  FaFilter,
  FaDownload,
  FaChartBar,
  FaChartPie,
  FaTable,
} from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";

const ReportsAssets = () => {
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [viewMode, setViewMode] = useState("table"); // 'table', 'bar', 'pie'

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

  // 예시 위치 목록
  const locations = [
    "본사 1층",
    "본사 2층",
    "본사 3층",
    "본사 4층",
    "지사 1층",
    "지사 2층",
    "데이터센터",
    "창고",
  ];

  // 예시 자산 데이터
  const assetData = [
    {
      category: "컴퓨터",
      count: 45,
      value: 67500000,
      locations: {
        "본사 1층": 10,
        "본사 2층": 15,
        "본사 3층": 12,
        "본사 4층": 8,
      },
    },
    {
      category: "주변기기",
      count: 78,
      value: 15600000,
      locations: {
        "본사 1층": 18,
        "본사 2층": 22,
        "본사 3층": 20,
        "본사 4층": 18,
      },
    },
    {
      category: "모바일기기",
      count: 32,
      value: 19200000,
      locations: {
        "본사 1층": 8,
        "본사 2층": 10,
        "본사 3층": 9,
        "본사 4층": 5,
      },
    },
    {
      category: "사무기기",
      count: 24,
      value: 9600000,
      locations: {
        "본사 1층": 6,
        "본사 2층": 7,
        "본사 3층": 6,
        "본사 4층": 5,
      },
    },
    {
      category: "서버",
      count: 12,
      value: 48000000,
      locations: {
        데이터센터: 12,
      },
    },
    {
      category: "네트워크장비",
      count: 18,
      value: 9000000,
      locations: {
        "본사 1층": 3,
        "본사 2층": 3,
        "본사 3층": 3,
        "본사 4층": 3,
        데이터센터: 6,
      },
    },
    {
      category: "소프트웨어",
      count: 56,
      value: 28000000,
      locations: {
        전사: 56,
      },
    },
    {
      category: "가구",
      count: 37,
      value: 7400000,
      locations: {
        "본사 1층": 9,
        "본사 2층": 10,
        "본사 3층": 8,
        "본사 4층": 10,
      },
    },
  ];

  // 필터링된 데이터
  const filteredData = assetData.filter(
    (item) =>
      (filterCategory === "" || item.category === filterCategory) &&
      (filterLocation === "" ||
        (item.locations[filterLocation] !== undefined &&
          item.locations[filterLocation] > 0))
  );

  // 총계 계산
  const totalCount = filteredData.reduce((sum, item) => sum + item.count, 0);
  const totalValue = filteredData.reduce((sum, item) => sum + item.value, 0);

  return (
    <PageContainer title="자산 보고서">
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

          {/* 위치 필터 */}
          <div className="relative">
            <select
              className="w-full md:w-48 pl-10 pr-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              <option value="">모든 위치</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1 px-3 py-2 rounded-md ${
              viewMode === "table"
                ? getButtonVariantClass("primary")
                : getButtonVariantClass("secondary")
            }`}
          >
            <FaTable className="h-4 w-4" />
            <span>테이블</span>
          </button>
          <button
            onClick={() => setViewMode("bar")}
            className={`flex items-center gap-1 px-3 py-2 rounded-md ${
              viewMode === "bar"
                ? getButtonVariantClass("primary")
                : getButtonVariantClass("secondary")
            }`}
          >
            <FaChartBar className="h-4 w-4" />
            <span>막대 차트</span>
          </button>
          <button
            onClick={() => setViewMode("pie")}
            className={`flex items-center gap-1 px-3 py-2 rounded-md ${
              viewMode === "pie"
                ? getButtonVariantClass("primary")
                : getButtonVariantClass("secondary")
            }`}
          >
            <FaChartPie className="h-4 w-4" />
            <span>파이 차트</span>
          </button>
          <button
            className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
              "secondary"
            )}`}
          >
            <FaDownload className="h-4 w-4" />
            <span>내보내기</span>
          </button>
        </div>
      </div>

      {/* 요약 정보 */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-2">
            총 자산 수
          </h3>
          <p className="text-2xl font-bold text-primary">{totalCount}개</p>
          <p className="text-sm text-muted-foreground mt-1">
            {filterCategory ? `${filterCategory} 카테고리의 ` : ""}
            {filterLocation ? `${filterLocation} 위치의 ` : ""}
            자산 수
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-2">
            총 자산 가치
          </h3>
          <p className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">
            {new Intl.NumberFormat("ko-KR", {
              style: "currency",
              currency: "KRW",
            }).format(totalValue)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {filterCategory ? `${filterCategory} 카테고리의 ` : ""}
            {filterLocation ? `${filterLocation} 위치의 ` : ""}
            자산 가치
          </p>
        </div>
      </div>

      {/* 데이터 시각화 */}
      {viewMode === "table" ? (
        // 테이블 뷰
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
                  자산 수
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  자산 가치
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  비율 (수량)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  비율 (가치)
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
                    {item.count}개
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {new Intl.NumberFormat("ko-KR", {
                      style: "currency",
                      currency: "KRW",
                    }).format(item.value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {((item.count / totalCount) * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {((item.value / totalValue) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : viewMode === "bar" ? (
        // 막대 차트 뷰 (간단한 예시)
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-4">
            카테고리별 자산 분포
          </h3>
          <div className="h-64 flex items-end space-x-4">
            {filteredData.map((item, index) => {
              const heightPercentage =
                (item.count / Math.max(...filteredData.map((d) => d.count))) *
                100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-primary rounded-t"
                    style={{ height: `${heightPercentage}%` }}
                  ></div>
                  <div className="mt-2 text-xs text-muted-foreground text-center">
                    {item.category}
                  </div>
                  <div className="text-sm text-foreground">{item.count}개</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // 파이 차트 뷰 (간단한 예시)
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-4">
            카테고리별 자산 가치 분포
          </h3>
          <div className="flex justify-center mb-4">
            <div className="w-64 h-64 rounded-full border-8 border-muted relative">
              {/* 실제로는 차트 라이브러리를 사용하여 파이 차트를 구현해야 합니다 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-foreground text-lg">파이 차트 예시</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-4 h-4 mr-2"
                  style={{
                    backgroundColor: `hsl(${(index * 30) % 360}, 70%, 50%)`,
                  }}
                ></div>
                <div>
                  <div className="text-sm text-foreground">{item.category}</div>
                  <div className="text-xs text-muted-foreground">
                    {((item.value / totalValue) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default ReportsAssets;
