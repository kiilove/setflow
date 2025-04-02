"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    // 실제 구현에서는 API 호출로 대체
    const fetchDepartments = async () => {
      try {
        // 예시 부서 데이터
        const data = [
          {
            id: 1,
            name: "개발팀",
            manager: "김철수",
            userCount: 12,
            assetCount: 45,
            location: "본사 3층",
            description: "소프트웨어 개발 및 유지보수 담당",
          },
          {
            id: 2,
            name: "마케팅팀",
            manager: "이영희",
            userCount: 8,
            assetCount: 24,
            location: "본사 2층",
            description: "마케팅 전략 및 홍보 담당",
          },
          {
            id: 3,
            name: "디자인팀",
            manager: "박지민",
            userCount: 6,
            assetCount: 18,
            location: "본사 2층",
            description: "UI/UX 디자인 및 그래픽 디자인 담당",
          },
          {
            id: 4,
            name: "영업팀",
            manager: "최민수",
            userCount: 10,
            assetCount: 30,
            location: "본사 1층",
            description: "영업 및 고객 관리 담당",
          },
          {
            id: 5,
            name: "인사팀",
            manager: "정다운",
            userCount: 4,
            assetCount: 12,
            location: "본사 4층",
            description: "인사 관리 및 채용 담당",
          },
          {
            id: 6,
            name: "재무팀",
            manager: "한상우",
            userCount: 5,
            assetCount: 15,
            location: "본사 4층",
            description: "재무 관리 및 회계 담당",
          },
          {
            id: 7,
            name: "IT 인프라팀",
            manager: "유기술",
            userCount: 7,
            assetCount: 60,
            location: "데이터센터",
            description: "IT 인프라 관리 및 유지보수 담당",
          },
          {
            id: 8,
            name: "고객지원팀",
            manager: "조서비스",
            userCount: 9,
            assetCount: 27,
            location: "지사 1층",
            description: "고객 지원 및 서비스 담당",
          },
        ];
        setDepartments(data);
      } catch (error) {
        console.error("부서 데이터를 불러오는 중 오류가 발생했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // 위치 목록 추출
  const locations = [...new Set(departments.map((dept) => dept.location))];

  // 검색 및 필터링된 부서 목록
  const filteredDepartments = departments.filter((department) => {
    const matchesSearch =
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation = filterLocation
      ? department.location === filterLocation
      : true;

    return matchesSearch && matchesLocation;
  });

  // 정렬
  const sortedDepartments = [...filteredDepartments].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "manager") {
      comparison = a.manager.localeCompare(b.manager);
    } else if (sortBy === "location") {
      comparison = a.location.localeCompare(b.location);
    } else if (sortBy === "userCount") {
      comparison = a.userCount - b.userCount;
    } else if (sortBy === "assetCount") {
      comparison = a.assetCount - b.assetCount;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-muted-foreground">로딩 중...</span>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">부서 관리</h1>
          <div className="flex gap-2">
            <Link
              to="/users/departments/add"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors flex items-center"
            >
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
                className="mr-1"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              부서 추가
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
                placeholder="부서명, 관리자 또는 설명 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">모든 위치</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 부서 목록 테이블 */}
        <div className="bg-card rounded-lg shadow overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      부서명
                      {sortBy === "name" && (
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
                    onClick={() => handleSort("manager")}
                  >
                    <div className="flex items-center">
                      관리자
                      {sortBy === "manager" && (
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
                    onClick={() => handleSort("location")}
                  >
                    <div className="flex items-center">
                      위치
                      {sortBy === "location" && (
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
                    onClick={() => handleSort("userCount")}
                  >
                    <div className="flex items-center">
                      사용자 수
                      {sortBy === "userCount" && (
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
                    onClick={() => handleSort("assetCount")}
                  >
                    <div className="flex items-center">
                      자산 수
                      {sortBy === "assetCount" && (
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
                    설명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedDepartments.map((department) => (
                  <tr
                    key={department.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {department.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {department.manager}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {department.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="text-primary font-medium">
                        {department.userCount}명
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="text-emerald-500 dark:text-emerald-400 font-medium">
                        {department.assetCount}개
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm max-w-xs truncate">
                      {department.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Link
                          to={`/users?department=${department.name}`}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
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
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </Link>
                        <Link
                          to={`/assets?department=${department.name}`}
                          className="text-green-500 hover:text-green-700 transition-colors"
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
                            <rect
                              width="20"
                              height="14"
                              x="2"
                              y="7"
                              rx="2"
                              ry="2"
                            />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                          </svg>
                        </Link>
                        <Link
                          to={`/users/departments/edit/${department.id}`}
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
                                `${department.name} 부서를 삭제하시겠습니까?`
                              )
                            ) {
                              console.log(`부서 삭제: ${department.id}`);
                              // 실제 삭제 로직 구현
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
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedDepartments.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-sm text-center text-muted-foreground"
                    >
                      {loading ? (
                        <div className="flex justify-center items-center">
                          <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                          부서 데이터를 불러오는 중...
                        </div>
                      ) : (
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
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 페이지네이션 */}
        {sortedDepartments.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              총 {sortedDepartments.length}개의 부서
            </div>
            <div className="flex space-x-1">
              <button className="px-3 py-1 rounded border border-input bg-background hover:bg-muted transition-colors disabled:opacity-50">
                이전
              </button>
              <button className="px-3 py-1 rounded border border-input bg-primary text-primary-foreground">
                1
              </button>
              <button className="px-3 py-1 rounded border border-input bg-background hover:bg-muted transition-colors">
                다음
              </button>
            </div>
          </div>
        )}

        {/* 카드 뷰 토글 버튼 */}
        <div className="flex justify-end mt-4">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted hover:bg-muted/80 text-foreground transition-colors"
            onClick={() => {
              // 카드 뷰와 테이블 뷰 전환 로직 구현
              console.log("카드 뷰로 전환");
            }}
          >
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
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
            카드 뷰로 보기
          </button>
        </div>

        {/* 카드 뷰 (기본적으로 숨김, 토글 버튼으로 표시) */}
        <div className="hidden mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedDepartments.map((department) => (
            <div
              key={department.id}
              className="rounded-lg border border-border bg-card p-4 shadow-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {department.name}
                  </h3>
                  <p className="text-muted-foreground">
                    관리자: {department.manager}
                  </p>
                  <div className="mt-2 flex space-x-4">
                    <p className="text-primary">
                      사용자 {department.userCount}명
                    </p>
                    <p className="text-emerald-500 dark:text-emerald-400">
                      자산 {department.assetCount}개
                    </p>
                  </div>
                  <p className="text-muted-foreground">
                    위치: {department.location}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/users/departments/edit/${department.id}`}
                    className="text-primary hover:text-primary/80"
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
                    className="text-destructive hover:text-destructive/80"
                    onClick={() => {
                      if (
                        window.confirm(
                          `${department.name} 부서를 삭제하시겠습니까?`
                        )
                      ) {
                        console.log(`부서 삭제: ${department.id}`);
                        // 실제 삭제 로직 구현
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
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {department.description}
              </p>
              <div className="mt-4 flex space-x-2">
                <Link
                  to={`/users?department=${department.name}`}
                  className={`rounded-md px-3 py-1 text-sm ${getButtonVariantClass(
                    "secondary"
                  )}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="inline-block mr-1"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  사용자 보기
                </Link>
                <Link
                  to={`/assets?department=${department.name}`}
                  className={`rounded-md px-3 py-1 text-sm ${getButtonVariantClass(
                    "secondary"
                  )}`}
                >
                  자산 보기
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default Departments;
