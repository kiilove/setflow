"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaChartLine, FaCalculator, FaMoneyBillWave } from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";

const Finance = () => {
  // 예시 재무 데이터
  const financialData = {
    totalAssetValue: "₩125,750,000",
    depreciationValue: "₩32,450,000",
    currentValue: "₩93,300,000",
    maintenanceCosts: "₩5,870,000",
    acquisitionCosts: "₩45,200,000",
    disposalValue: "₩1,250,000",
  };

  // 예시 자산 카테고리별 가치 데이터
  const categoryValues = [
    { category: "컴퓨터", value: 45000000, percentage: 35.8 },
    { category: "서버", value: 35000000, percentage: 27.8 },
    { category: "네트워크장비", value: 18000000, percentage: 14.3 },
    { category: "모바일기기", value: 12000000, percentage: 9.5 },
    { category: "사무기기", value: 8500000, percentage: 6.8 },
    { category: "소프트웨어", value: 5000000, percentage: 4.0 },
    { category: "가구", value: 2250000, percentage: 1.8 },
  ];

  return (
    <PageContainer title="자산 재무 관리">
      <div className="mb-6 flex flex-wrap gap-4">
        <Link
          to="/finance"
          className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
            "primary"
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
            "secondary"
          )}`}
        >
          <FaMoneyBillWave className="h-4 w-4" />
          <span>비용 분석</span>
        </Link>
      </div>

      {/* 재무 요약 카드 */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-2">
            총 자산 가치
          </h3>
          <p className="text-2xl font-bold text-primary">
            {financialData.totalAssetValue}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            모든 자산의 취득 가치 합계
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-2">
            감가상각 금액
          </h3>
          <p className="text-2xl font-bold text-destructive">
            {financialData.depreciationValue}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            누적 감가상각 금액
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-2">
            현재 자산 가치
          </h3>
          <p className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">
            {financialData.currentValue}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            감가상각 후 현재 가치
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 카테고리별 자산 가치 */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-4">
            카테고리별 자산 가치
          </h3>
          <div className="space-y-4">
            {categoryValues.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-foreground">{item.category}</span>
                  <span className="text-foreground">
                    {new Intl.NumberFormat("ko-KR", {
                      style: "currency",
                      currency: "KRW",
                    }).format(item.value)}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs text-muted-foreground mt-1">
                  {item.percentage}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 비용 요약 */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-4">
            비용 요약
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-md font-medium text-foreground mb-2">
                유지보수 비용
              </h4>
              <p className="text-2xl font-bold text-amber-500 dark:text-amber-400">
                {financialData.maintenanceCosts}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                연간 유지보수 및 수리 비용
              </p>
            </div>
            <div>
              <h4 className="text-md font-medium text-foreground mb-2">
                취득 비용
              </h4>
              <p className="text-2xl font-bold text-sky-500 dark:text-sky-400">
                {financialData.acquisitionCosts}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                올해 신규 자산 취득 비용
              </p>
            </div>
            <div>
              <h4 className="text-md font-medium text-foreground mb-2">
                처분 가치
              </h4>
              <p className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">
                {financialData.disposalValue}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                폐기 및 판매된 자산의 회수 가치
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 재무 보고서 링크 */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link
          to="/reports/assets"
          className="rounded-lg border border-border bg-card p-4 shadow-md hover:bg-accent transition-colors"
        >
          <h3 className="mb-2 text-xl font-semibold text-foreground">
            자산 보고서
          </h3>
          <p className="text-muted-foreground">
            자산 취득 및 현재 가치에 대한 상세 보고서
          </p>
        </Link>
        <Link
          to="/reports/depreciation"
          className="rounded-lg border border-border bg-card p-4 shadow-md hover:bg-accent transition-colors"
        >
          <h3 className="mb-2 text-xl font-semibold text-foreground">
            감가상각 보고서
          </h3>
          <p className="text-muted-foreground">
            자산별 감가상각 일정 및 현재 가치 보고서
          </p>
        </Link>
        <Link
          to="/reports/maintenance"
          className="rounded-lg border border-border bg-card p-4 shadow-md hover:bg-accent transition-colors"
        >
          <h3 className="mb-2 text-xl font-semibold text-foreground">
            비용 보고서
          </h3>
          <p className="text-muted-foreground">
            유지보수 및 운영 비용에 대한 상세 보고서
          </p>
        </Link>
      </div>
    </PageContainer>
  );
};

export default Finance;
