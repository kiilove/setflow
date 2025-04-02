"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import { getStatusColorClass } from "../../utils/themeUtils";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaUserCog } from "react-icons/fa";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    // 예시 데이터 로드 (실제로는 API 호출)
    const mockUsers = [
      {
        id: 1,
        name: "홍길동",
        email: "hong@example.com",
        department: "개발팀",
        role: "관리자",
        status: "활성",
        position: "팀장",
        joinDate: "2021-03-15",
      },
      {
        id: 2,
        name: "김철수",
        email: "kim@example.com",
        department: "마케팅팀",
        role: "편집자",
        status: "활성",
        position: "팀원",
        joinDate: "2022-01-10",
      },
      {
        id: 3,
        name: "이영희",
        email: "lee@example.com",
        department: "디자인팀",
        role: "사용자",
        status: "비활성",
        position: "팀원",
        joinDate: "2020-11-05",
      },
      {
        id: 4,
        name: "박지민",
        email: "park@example.com",
        department: "영업팀",
        role: "사용자",
        status: "활성",
        position: "팀원",
        joinDate: "2022-05-20",
      },
      {
        id: 5,
        name: "최민수",
        email: "choi@example.com",
        department: "인사팀",
        role: "편집자",
        status: "활성",
        position: "팀장",
        joinDate: "2021-08-15",
      },
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
  }, []);

  // 부서 목록 추출
  const departments = [...new Set(users.map((user) => user.department))];

  // 역할 목록 추출
  const roles = [...new Set(users.map((user) => user.role))];

  // 검색 및 필터링된 사용자 목록
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = filterDepartment
      ? user.department === filterDepartment
      : true;
    const matchesRole = filterRole ? user.role === filterRole : true;

    return matchesSearch && matchesDepartment && matchesRole;
  });

  // 정렬
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "department") {
      comparison = a.department.localeCompare(b.department);
    } else if (sortBy === "role") {
      comparison = a.role.localeCompare(b.role);
    } else if (sortBy === "status") {
      comparison = a.status.localeCompare(b.status);
    } else if (sortBy === "joinDate") {
      comparison = new Date(a.joinDate) - new Date(b.joinDate);
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

  const handleRowClick = (userId) => {
    navigate(`/users/detail/${userId}`);
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
          <h1 className="text-2xl font-bold">사용자 관리</h1>
          <div className="flex gap-2">
            <Link
              to="/users/add"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors flex items-center"
            >
              <FaPlus className="mr-1" />
              사용자 추가
            </Link>
            <Link
              to="/users/permissions"
              className="bg-muted hover:bg-muted/80 text-muted-foreground px-4 py-2 rounded-md transition-colors flex items-center"
            >
              <FaUserCog className="mr-1" />
              권한 관리
            </Link>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="이름, 이메일, 부서 또는 역할 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">모든 부서</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">모든 역할</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 사용자 목록 */}
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
                      이름
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    이메일
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
                    onClick={() => handleSort("role")}
                  >
                    <div className="flex items-center">
                      역할
                      {sortBy === "role" && (
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
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("joinDate")}
                  >
                    <div className="flex items-center">
                      입사일
                      {sortBy === "joinDate" && (
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
                {sortedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(user.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex space-x-2">
                        <Link
                          to={`/users/edit/${user.id}`}
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          <FaEdit className="h-4 w-4" />
                        </Link>
                        <button
                          className="text-destructive hover:text-destructive/80 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // 삭제 확인 로직 추가
                            if (
                              window.confirm(
                                `${user.name} 사용자를 삭제하시겠습니까?`
                              )
                            ) {
                              console.log(`사용자 삭제: ${user.id}`);
                              // 실제 삭제 로직 구현
                            }
                          }}
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-sm text-center text-muted-foreground"
                    >
                      {loading ? (
                        <div className="flex justify-center items-center">
                          <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                          사용자 데이터를 불러오는 중...
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

        {/* 페이지네이션 (필요시 추가) */}
        {sortedUsers.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              총 {sortedUsers.length}명의 사용자
            </div>
            <div className="flex space-x-1">
              <button className="px-3 py-1 rounded border border-input bg-background hover:bg-muted transition-colors disabled:opacity-50">
                이전
              </button>
              <button className="px-3 py-1 rounded border border-input bg-primary text-primary-foreground">
                1
              </button>
              <button className="px-3 py-1 rounded border border-input bg-background hover:bg-muted transition-colors">
                2
              </button>
              <button className="px-3 py-1 rounded border border-input bg-background hover:bg-muted transition-colors">
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Users;
