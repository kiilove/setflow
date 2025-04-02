"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaUsers } from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";

const Departments = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // 예시 부서 데이터
  const departments = [
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

  // 검색 필터링
  const filteredDepartments = departments.filter(
    (department) =>
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer title="부서 관리">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="부서 검색..."
            className="w-full md:w-64 pl-10 pr-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>

        <Link
          to="/users/departments/add"
          className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
            "primary"
          )}`}
        >
          <FaPlus className="h-4 w-4" />
          <span>부서 추가</span>
        </Link>
      </div>

      {/* 부서 목록 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDepartments.map((department) => (
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
                  <FaEdit className="h-5 w-5" />
                </Link>
                <button className="text-destructive hover:text-destructive/80">
                  <FaTrash className="h-5 w-5" />
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
                <FaUsers className="inline-block mr-1 h-4 w-4" />
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
    </PageContainer>
  );
};

export default Departments;
