"use client";

import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FaArrowLeft, FaFilter, FaDownload } from "react-icons/fa";
import {
  getStatusColorClass,
  getButtonVariantClass,
} from "../../utils/themeUtils";
import PageContainer from "../../components/common/PageContainer";

const AssetsHistory = () => {
  const [searchParams] = useSearchParams();
  const assetId = searchParams.get("assetId") || "1"; // 기본값으로 ID 1 사용

  // 가상의 자산 데이터 (디자인 확인용)
  const asset = {
    id: 1,
    name: "Dell XPS 15",
    category: "노트북",
    status: "활성",
  };

  // 가상의 자산 이력 데이터
  const historyData = [
    {
      id: 1,
      date: "2022-03-15",
      type: "구매",
      description: "새 자산 구매",
      user: "김관리자",
      details: {
        price: 2200000,
        supplier: "(주)델컴퓨터",
        purchaseOrder: "PO-2022-0315",
      },
    },
    {
      id: 2,
      date: "2022-03-20",
      type: "할당",
      description: "김철수(개발팀)에게 할당",
      user: "박관리자",
      details: {
        assignee: "김철수",
        department: "개발팀",
        location: "본사 3층",
      },
    },
    {
      id: 3,
      date: "2022-09-10",
      type: "유지보수",
      description: "정기 점검 및 소프트웨어 업데이트",
      user: "이기술",
      details: {
        maintenanceType: "정기점검",
        cost: 50000,
        notes: "Windows 업데이트 및 드라이버 업데이트 완료",
      },
    },
    {
      id: 4,
      date: "2023-01-10",
      type: "유지보수",
      description: "하드웨어 점검 및 소프트웨어 업데이트",
      user: "박기술자",
      details: {
        maintenanceType: "정기점검",
        cost: 150000,
        notes: "메모리 모듈 청소 및 방열판 먼지 제거",
      },
    },
    {
      id: 5,
      date: "2023-06-15",
      type: "유지보수",
      description: "배터리 교체",
      user: "이수리",
      details: {
        maintenanceType: "수리",
        cost: 250000,
        parts: "Dell 정품 배터리",
        warranty: "1년",
      },
    },
    {
      id: 6,
      date: "2023-07-01",
      type: "상태변경",
      description: "상태 변경: 수리중 → 활성",
      user: "김관리자",
      details: {
        previousStatus: "수리중",
        newStatus: "활성",
        reason: "배터리 교체 완료",
      },
    },
  ];

  // 필터 상태
  const [filters, setFilters] = useState({
    type: "",
    dateFrom: "",
    dateTo: "",
    user: "",
  });

  // 필터링된 이력 데이터
  const filteredHistory = historyData.filter((item) => {
    if (filters.type && item.type !== filters.type) return false;
    if (filters.user && !item.user.includes(filters.user)) return false;
    if (filters.dateFrom && new Date(item.date) < new Date(filters.dateFrom))
      return false;
    if (filters.dateTo && new Date(item.date) > new Date(filters.dateTo))
      return false;
    return true;
  });

  // 필터 변경 핸들러
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 필터 초기화 핸들러
  const resetFilters = () => {
    setFilters({
      type: "",
      dateFrom: "",
      dateTo: "",
      user: "",
    });
  };

  // 이벤트 타입에 따른 배지 색상 클래스
  const getEventTypeClass = (type) => {
    switch (type) {
      case "구매":
        return getStatusColorClass("info");
      case "할당":
        return getStatusColorClass("active");
      case "유지보수":
        return getStatusColorClass("warning");
      case "상태변경":
        return getStatusColorClass("pending");
      case "반납":
        return getStatusColorClass("inactive");
      case "폐기":
        return getStatusColorClass("error");
      default:
        return getStatusColorClass("info");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <PageContainer title={`자산 이력 - ${asset.name}`}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          to={`/assets/detail/${assetId}`}
          className={`${getButtonVariantClass(
            "outline"
          )} inline-flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium`}
        >
          <FaArrowLeft className="mr-2 -ml-1 h-4 w-4" />
          자산 상세로 돌아가기
        </Link>
        <div className="flex gap-2">
          <button
            className={`${getButtonVariantClass(
              "outline"
            )} inline-flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium`}
          >
            <FaDownload className="mr-2 -ml-1 h-4 w-4" />
            내보내기
          </button>
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className="mb-6 rounded-lg border border-border bg-card p-4 shadow-md">
        <div className="flex items-center mb-4">
          <FaFilter className="mr-2 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground">필터</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              이벤트 유형
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">모든 유형</option>
              <option value="구매">구매</option>
              <option value="할당">할당</option>
              <option value="유지보수">유지보수</option>
              <option value="상태변경">상태변경</option>
              <option value="반납">반납</option>
              <option value="폐기">폐기</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="dateFrom"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              시작일
            </label>
            <input
              type="date"
              id="dateFrom"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor="dateTo"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              종료일
            </label>
            <input
              type="date"
              id="dateTo"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor="user"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              사용자
            </label>
            <input
              type="text"
              id="user"
              name="user"
              value={filters.user}
              onChange={handleFilterChange}
              placeholder="사용자 검색..."
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={resetFilters}
            className={`${getButtonVariantClass(
              "outline"
            )} px-3 py-1.5 rounded-md text-sm`}
          >
            필터 초기화
          </button>
        </div>
      </div>

      {/* 이력 타임라인 */}
      <div className="rounded-lg border border-border bg-card p-4 shadow-md">
        <h3 className="text-lg font-medium text-foreground mb-6">
          이력 타임라인
        </h3>

        <div className="relative">
          {/* 타임라인 중앙선 */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>

          <div className="space-y-8">
            {filteredHistory.map((item, index) => (
              <div key={item.id} className="relative pl-10">
                {/* 타임라인 원형 마커 */}
                <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-card border-4 border-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">
                    {filteredHistory.length - index}
                  </span>
                </div>

                {/* 이벤트 카드 */}
                <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getEventTypeClass(
                          item.type
                        )}`}
                      >
                        {item.type}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(item.date)}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      처리자: {item.user}
                    </span>
                  </div>

                  <h4 className="text-md font-medium text-foreground mb-2">
                    {item.description}
                  </h4>

                  {/* 상세 정보 */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {Object.entries(item.details).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-xs text-muted-foreground">
                            {key}:{" "}
                          </span>
                          <span className="text-sm text-foreground">
                            {typeof value === "number" &&
                            (key.toLowerCase().includes("price") ||
                              key.toLowerCase().includes("cost"))
                              ? new Intl.NumberFormat("ko-KR", {
                                  style: "currency",
                                  currency: "KRW",
                                }).format(value)
                              : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            필터 조건에 맞는 이력이 없습니다.
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default AssetsHistory;
