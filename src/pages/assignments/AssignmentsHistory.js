"use client";

import { useState } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import {
  getButtonVariantClass,
  getStatusColorClass,
} from "../../utils/themeUtils";

const AssignmentsHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  // 예시 할당 이력 데이터
  const assignmentHistory = [
    {
      id: 1,
      assetName: "노트북 Dell XPS 15",
      assetId: "AST-001",
      assignedTo: "김철수",
      department: "개발팀",
      type: "할당",
      date: "2022-05-20",
      notes: "개발팀 리더용 노트북 할당",
    },
    {
      id: 2,
      assetName: "모니터 LG 27인치",
      assetId: "AST-002",
      assignedTo: "이영희",
      department: "마케팅팀",
      type: "할당",
      date: "2022-06-25",
      notes: "마케팅팀 신규 입사자 장비 할당",
    },
    {
      id: 3,
      assetName: "키보드 Logitech",
      assetId: "AST-005",
      assignedTo: "박지민",
      department: "디자인팀",
      type: "할당",
      date: "2022-08-10",
      notes: "기존 키보드 고장으로 인한 교체",
    },
    {
      id: 4,
      assetName: "키보드 Logitech",
      assetId: "AST-005",
      assignedTo: "박지민",
      department: "디자인팀",
      type: "반납",
      date: "2022-12-15",
      notes: "부서 이동으로 인한 장비 반납",
    },
    {
      id: 5,
      assetName: "태블릿 iPad Pro",
      assetId: "AST-004",
      assignedTo: "최민수",
      department: "영업팀",
      type: "할당",
      date: "2023-01-10",
      notes: "영업 활동용 태블릿 할당",
    },
    {
      id: 6,
      assetName: "태블릿 iPad Pro",
      assetId: "AST-004",
      assignedTo: "최민수",
      department: "영업팀",
      type: "반납",
      date: "2023-03-20",
      notes: "퇴사로 인한 장비 반납",
    },
    {
      id: 7,
      assetName: "태블릿 iPad Pro",
      assetId: "AST-004",
      assignedTo: "박지민",
      department: "디자인팀",
      type: "할당",
      date: "2023-03-25",
      notes: "디자인 작업용 태블릿 재할당",
    },
  ];

  // 검색 및 필터링된 할당 이력 목록
  const filteredHistory = assignmentHistory.filter(
    (history) =>
      (history.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        history.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterType === "" || history.type === filterType)
  );

  return (
    <PageContainer title="자산 할당 이력">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          {/* 검색 */}
          <div className="relative">
            <input
              type="text"
              placeholder="자산 또는 사용자 검색..."
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
              <option value="할당">할당</option>
              <option value="반납">반납</option>
            </select>
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* 할당 이력 목록 테이블 */}
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
                사용자
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                부서
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                비고
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {filteredHistory.map((history) => (
              <tr key={history.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {history.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(
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
                  {history.assignedTo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {history.department}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {history.notes}
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

export default AssignmentsHistory;
