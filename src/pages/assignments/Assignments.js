"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaDownload } from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import { getStatusColorClass } from "../../utils/themeUtils";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("assetName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // 예시 할당 데이터
  useEffect(() => {
    // 실제 구현에서는 API 호출로 대체
    const mockAssignments = [
      {
        id: 1,
        assetName: "노트북 Dell XPS 15",
        assetId: "AST-001",
        assignedTo: "김철수",
        department: "개발팀",
        assignedDate: "2022-05-20",
        dueDate: "2024-05-20",
        status: "할당됨",
      },
      {
        id: 2,
        assetName: "모니터 LG 27인치",
        assetId: "AST-002",
        assignedTo: "이영희",
        department: "마케팅팀",
        assignedDate: "2022-06-25",
        dueDate: "2024-06-25",
        status: "할당됨",
      },
      {
        id: 3,
        assetName: "태블릿 iPad Pro",
        assetId: "AST-004",
        assignedTo: "박지민",
        department: "디자인팀",
        assignedDate: "2023-01-10",
        dueDate: "2023-04-10",
        status: "반납 예정",
      },
      {
        id: 4,
        assetName: "스마트폰 Galaxy S22",
        assetId: "AST-008",
        assignedTo: "최민수",
        department: "영업팀",
        assignedDate: "2023-02-15",
        dueDate: "2025-02-15",
        status: "할당됨",
      },
      {
        id: 5,
        assetName: "노트북 MacBook Pro",
        assetId: "AST-012",
        assignedTo: "정다운",
        department: "디자인팀",
        assignedDate: "2023-03-05",
        dueDate: "2025-03-05",
        status: "할당됨",
      },
    ];
    setAssignments(mockAssignments);
  }, []);

  // 정렬 처리
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // 검색 및 필터링된 할당 목록
  const filteredAssignments = assignments.filter(
    (assignment) =>
      (assignment.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.assignedTo
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        assignment.department
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        assignment.assetId.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "" || assignment.status === filterStatus)
  );

  // 정렬
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "assetName") {
      comparison = a.assetName.localeCompare(b.assetName);
    } else if (sortBy === "assetId") {
      comparison = a.assetId.localeCompare(b.assetId);
    } else if (sortBy === "assignedTo") {
      comparison = a.assignedTo.localeCompare(b.assignedTo);
    } else if (sortBy === "department") {
      comparison = a.department.localeCompare(b.department);
    } else if (sortBy === "assignedDate") {
      comparison = new Date(a.assignedDate) - new Date(b.assignedDate);
    } else if (sortBy === "dueDate") {
      comparison = new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sortBy === "status") {
      comparison = a.status.localeCompare(b.status);
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  // 페이지네이션
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAssignments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedAssignments.length / itemsPerPage);

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">자산 할당</h1>
          <div className="flex gap-2">
            <button className="bg-muted hover:bg-muted/80 text-muted-foreground px-4 py-2 rounded-md transition-colors flex items-center">
              <FaDownload className="mr-1 h-4 w-4" />
              내보내기
            </button>
            <Link
              to="/assignments/add"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors flex items-center"
            >
              <FaPlus className="mr-1 h-4 w-4" />
              할당 등록
            </Link>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="자산, 사용자 또는 부서 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">모든 상태</option>
                <option value="할당됨">할당됨</option>
                <option value="반납 예정">반납 예정</option>
                <option value="반납됨">반납됨</option>
              </select>
            </div>
          </div>
        </div>

        {/* 할당 목록 테이블 */}
        <div className="bg-card rounded-lg shadow overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("assetName")}
                  >
                    <div className="flex items-center">
                      자산명
                      {sortBy === "assetName" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-1"
                        >
                          {sortOrder === "asc" ? (
                            <path d="m18 15-6-6-6 6" />
                          ) : (
                            <path d="m6 9 6 6 6-6" />
                          )}
                        </svg>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("assetId")}
                  >
                    <div className="flex items-center">
                      자산 ID
                      {sortBy === "assetId" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-1"
                        >
                          {sortOrder === "asc" ? (
                            <path d="m18 15-6-6-6 6" />
                          ) : (
                            <path d="m6 9 6 6 6-6" />
                          )}
                        </svg>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("assignedTo")}
                  >
                    <div className="flex items-center">
                      할당 대상
                      {sortBy === "assignedTo" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-1"
                        >
                          {sortOrder === "asc" ? (
                            <path d="m18 15-6-6-6 6" />
                          ) : (
                            <path d="m6 9 6 6 6-6" />
                          )}
                        </svg>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("department")}
                  >
                    <div className="flex items-center">
                      부서
                      {sortBy === "department" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-1"
                        >
                          {sortOrder === "asc" ? (
                            <path d="m18 15-6-6-6 6" />
                          ) : (
                            <path d="m6 9 6 6 6-6" />
                          )}
                        </svg>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("assignedDate")}
                  >
                    <div className="flex items-center">
                      할당일
                      {sortBy === "assignedDate" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-1"
                        >
                          {sortOrder === "asc" ? (
                            <path d="m18 15-6-6-6 6" />
                          ) : (
                            <path d="m6 9 6 6 6-6" />
                          )}
                        </svg>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("dueDate")}
                  >
                    <div className="flex items-center">
                      만료일
                      {sortBy === "dueDate" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-1"
                        >
                          {sortOrder === "asc" ? (
                            <path d="m18 15-6-6-6 6" />
                          ) : (
                            <path d="m6 9 6 6 6-6" />
                          )}
                        </svg>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      상태
                      {sortBy === "status" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-1"
                        >
                          {sortOrder === "asc" ? (
                            <path d="m18 15-6-6-6 6" />
                          ) : (
                            <path d="m6 9 6 6 6-6" />
                          )}
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentItems.map((assignment) => (
                  <tr
                    key={assignment.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {assignment.assetName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {assignment.assetId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {assignment.assignedTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {assignment.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {assignment.assignedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {assignment.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(
                          assignment.status
                        )}`}
                      >
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Link
                          to={`/assignments/view/${assignment.id}`}
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </Link>
                        <Link
                          to={`/assignments/edit/${assignment.id}`}
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </Link>
                        <button
                          className="text-destructive hover:text-destructive/80 transition-colors"
                          onClick={() => {
                            if (
                              window.confirm(
                                `${assignment.assetName}의 할당을 반납 처리하시겠습니까?`
                              )
                            ) {
                              console.log(`할당 반납: ${assignment.id}`);
                            }
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 12h18" />
                            <path d="M3 6h18" />
                            <path d="M3 18h18" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {currentItems.length === 0 && (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-8 text-sm text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mb-2 text-muted-foreground/60"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" x2="12" y1="8" y2="12" />
                          <line x1="12" x2="12.01" y1="16" y2="16" />
                        </svg>
                        검색 결과가 없습니다.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 페이지네이션 */}
        {sortedAssignments.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              총 {sortedAssignments.length}개의 할당
            </div>
            <div className="flex space-x-1">
              <button
                className="px-3 py-1 rounded border border-input bg-background hover:bg-muted transition-colors disabled:opacity-50"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                이전
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`px-3 py-1 rounded border ${
                      currentPage === pageNum
                        ? "bg-primary text-primary-foreground"
                        : "border-input bg-background hover:bg-muted transition-colors"
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                className="px-3 py-1 rounded border border-input bg-background hover:bg-muted transition-colors disabled:opacity-50"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Assignments;
