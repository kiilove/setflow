"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChartLine,
  FaCalculator,
  FaMoneyBillWave,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";

const FinanceDepreciation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // 예시 감가상각 데이터
  const depreciationData = [
    {
      id: 1,
      assetName: "노트북 Dell XPS 15",
      assetId: "AST-001",
      category: "컴퓨터",
      purchaseDate: "2022-05-15",
      purchaseValue: "₩2,500,000",
      depreciationMethod: "정액법",
      usefulLife: "3년",
      salvageValue: "₩250,000",
      currentValue: "₩1,750,000",
      depreciationRate: "30%",
    },
    {
      id: 2,
      assetName: "서버 Dell PowerEdge",
      assetId: "AST-005",
      category: "서버",
      purchaseDate: "2021-03-15",
      purchaseValue: "₩8,500,000",
      depreciationMethod: "정액법",
      usefulLife: "5년",
      salvageValue: "₩850,000",
      currentValue: "₩5,950,000",
      depreciationRate: "20%",
    },
    {
      id: 3,
      assetName: "네트워크 스위치",
      assetId: "AST-008",
      category: "네트워크장비",
      purchaseDate: "2021-06-10",
      purchaseValue: "₩3,200,000",
      depreciationMethod: "정액법",
      usefulLife: "5년",
      salvageValue: "₩320,000",
      currentValue: "₩2,304,000",
      depreciationRate: "20%",
    },
    {
      id: 4,
      assetName: "프린터 HP LaserJet",
      assetId: "AST-003",
      category: "사무기기",
      purchaseDate: "2021-11-10",
      purchaseValue: "₩750,000",
      depreciationMethod: "정액법",
      usefulLife: "4년",
      salvageValue: "₩75,000",
      currentValue: "₩581,250",
      depreciationRate: "25%",
    },
    {
      id: 5,
      assetName: "태블릿 iPad Pro",
      assetId: "AST-004",
      category: "모바일기기",
      purchaseDate: "2023-01-05",
      purchaseValue: "₩1,200,000",
      depreciationMethod: "정액법",
      usefulLife: "3년",
      salvageValue: "₩120,000",
      currentValue: "₩1,080,000",
      depreciationRate: "33%",
    },
  ];

  // 카테고리 목록
  const categories = [
    ...new Set(depreciationData.map((item) => item.category)),
  ];

  // 검색 및 필터링된 감가상각 목록
  const filteredData = depreciationData.filter(
    (item) =>
      item.assetName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === "" || item.category === filterCategory)
  );

  return (
    <PageContainer title="자산 감가상각">
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
            "primary"
          )}`}
        >
          <FaCalculator className="h-4 w-4" />
          <span>감가상각</span>
        </Link>
        <Link
          to="/finance/costs"
          className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
            "secondary"
          )}`}
        >
          <FaMoneyBillWave className="h-4 w-4" />
          <span>비용 분석</span>
        </Link>
      </div>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          {/* 검색 */}
          <div className="relative">
            <input
              type="text"
              placeholder="자산 검색..."
              className="w-full md:w-64 pl-10 pr-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>

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
        </div>
      </div>

      {/* 감가상각 목록 테이블 */}
      <div className="rounded-lg border border-border bg-card p-4 shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                자산
              </th>
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
                구매일
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                구매가
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                감가상각 방법
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                내용연수
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                잔존가치
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                현재가치
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-muted/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {item.assetName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {item.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {item.purchaseDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {item.purchaseValue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {item.depreciationMethod}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {item.usefulLife}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {item.salvageValue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {item.currentValue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 감가상각 정보 */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-4">
            감가상각 방법
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-md font-medium text-foreground mb-2">
                정액법 (Straight-Line)
              </h4>
              <p className="text-foreground/80">
                자산의 내용연수 동안 매년 동일한 금액을 감가상각하는 방법입니다.
                계산식: (취득가액 - 잔존가치) ÷ 내용연수
              </p>
            </div>
            <div>
              <h4 className="text-md font-medium text-foreground mb-2">
                정률법 (Declining Balance)
              </h4>
              <p className="text-foreground/80">
                자산의 장부가액에 일정한 상각률을 곱하여 감가상각하는 방법으로,
                초기에 더 많은 금액이 상각됩니다.
              </p>
            </div>
            <div>
              <h4 className="text-md font-medium text-foreground mb-2">
                연수합계법 (Sum-of-Years-Digits)
              </h4>
              <p className="text-foreground/80">
                내용연수의 합계를 분모로 하고, 남은 내용연수를 분자로 하여
                감가상각하는 방법입니다.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-4">
            카테고리별 내용연수
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-foreground/80">컴퓨터 및 노트북</span>
              <span className="text-foreground">3년</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/80">서버 및 네트워크 장비</span>
              <span className="text-foreground">5년</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/80">모바일 기기</span>
              <span className="text-foreground">3년</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/80">사무기기</span>
              <span className="text-foreground">4년</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/80">소프트웨어 라이센스</span>
              <span className="text-foreground">3년</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/80">가구</span>
              <span className="text-foreground">7년</span>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default FinanceDepreciation;
