"use client";

import { useState } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import {
  getStatusColorClass,
  getButtonVariantClass,
} from "../../utils/themeUtils";

const MaintenanceHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  // 예시 유지보수 이력 데이터
  const maintenanceHistory = [
    {
      id: 1,
      assetName: "노트북 Dell XPS 15",
      assetId: "AST-001",
      type: "정기점검",
      date: "2022-08-15",
      technician: "박기술자",
      cost: "₩50,000",
      description: "하드웨어 점검 및 소프트웨어 업데이트",
    },
    {
      id: 2,
      assetName: "프린터 HP LaserJet",
      assetId: "AST-003",
      type: "수리",
      date: "2022-09-20",
      technician: "이수리",
      cost: "₩120,000",
      description: "용지 걸림 센서 교체",
    },
    {
      id: 3,
      assetName: "서버 Dell PowerEdge",
      assetId: "AST-005",
      type: "업그레이드",
      date: "2022-11-10",
      technician: "김엔지니어",
      cost: "₩800,000",
      description: "메모리 증설 및 RAID 구성 변경",
    },
    {
      id: 4,
      assetName: "노트북 Dell XPS 15",
      assetId: "AST-001",
      type: "수리",
      date: "2023-01-05",
      technician: "이수리",
      cost: "₩200,000",
      description: "키보드 교체",
    },
    {
      id: 5,
      assetName: "프린터 HP LaserJet",
      assetId: "AST-003",
      type: "정기점검",
      date: "2023-02-15",
      technician: "박기술자",
      cost: "₩50,000",
      description: "정기 유지보수 및 토너 교체",
    },
    {
      id: 6,
      assetName: "태블릿 iPad Pro",
      assetId: "AST-004",
      type: "수리",
      date: "2023-06-15",
      technician: "이수리",
      cost: "₩150,000",
      description: "배터리 교체",
    },
  ];

  // 검색 및 필터링된 유지보수 이력 목록
  const filteredHistory = maintenanceHistory.filter(
    (history) =>
      (history.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        history.technician.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterType === "" || history.type === filterType)
  );

  // 유지보수 유형에 따른 상태 색상 클래스 가져오기
  const getMaintenanceTypeClass = (type) => {
    switch (type) {
      case "정기점검":
        return getStatusColorClass("success");
      case "수리":
        return getStatusColorClass("warning");
      case "업그레이드":
        return getStatusColorClass("info");
      default:
        return getStatusColorClass("default");
    }
  };

  return (
    <PageContainer title="유지보수 이력">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          {/* 검색 */}
          <div className="relative">
            <input
              type="text"
              placeholder="자산 또는 기술자 검색..."
              className="w-full md:w-64 pl-10 pr-4 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>

          {/* 유형 필터 */}
          <div className="relative">
            <select
              className="w-full md:w-48 pl-10 pr-4 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">모든 유형</option>
              <option value="정기점검">정기점검</option>
              <option value="수리">수리</option>
              <option value="업그레이드">업그레이드</option>
            </select>
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* 유지보수 이력 목록 테이블 */}
      <div className="rounded-lg border border-border bg-card p-4 shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                날짜
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                유형
              </th>
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
                자산 ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                기술자
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                비용
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                설명
              </th>
            </tr>
          </thead>
          <tbody className=" divide-y divide-border">
            {filteredHistory.map((history) => (
              <tr key={history.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {history.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getMaintenanceTypeClass(
                      history.type
                    )}`}
                  >
                    {history.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {history.assetName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {history.assetId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {history.technician}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {history.cost}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {history.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="mt-4 flex justify-center">
        <nav className="flex items-center space-x-2">
          <button
            className={`px-3 py-1 rounded-md ${getButtonVariantClass(
              "secondary"
            )} disabled:opacity-50`}
          >
            이전
          </button>
          <button
            className={`px-3 py-1 rounded-md ${getButtonVariantClass(
              "primary"
            )}`}
          >
            1
          </button>
          <button
            className={`px-3 py-1 rounded-md ${getButtonVariantClass(
              "secondary"
            )}`}
          >
            2
          </button>
          <button
            className={`px-3 py-1 rounded-md ${getButtonVariantClass(
              "secondary"
            )}`}
          >
            다음
          </button>
        </nav>
      </div>
    </PageContainer>
  );
};

export default MaintenanceHistory;
