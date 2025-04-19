"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, UserCog } from "lucide-react";
import { getStatusColorClass } from "../../utils/themeUtils";
import UserCard from "../../components/users/UserCard";
import UserStats from "../../components/users/UserStats";
import UserEmptyState from "../../components/users/UserEmptyState";
import useEntityData from "../../hooks/useEntityData";
import ListPageTemplate from "../../components/common/ListPageTemplate";
import { departments } from "../../data/userInitialData";

const Users = () => {
  const navigate = useNavigate();
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // 엔티티 데이터 관리 훅 사용
  const {
    data: users,
    loading,
    setLoading,
    fetchData,
    deleteItem: deleteUser,
    deleteMultipleItems: deleteMultipleUsers,
  } = useEntityData("users");

  // 부서 목록 추출
  const departmentOptions = departments.map((dept) => ({
    label: dept.name,
    value: dept.name,
  }));

  // 역할 목록 추출
  const roles = [...new Set(users.map((user) => user.role).filter(Boolean))];

  // 상태 목록 추출
  const statuses = [
    ...new Set(users.map((user) => user.status).filter(Boolean)),
  ];

  // 검색 필터 함수
  const searchFilter = (user, searchTerm) => {
    return (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // 추가 필터 함수
  const additionalFilter = (user) => {
    const matchesDepartment = filterDepartment
      ? user.department === filterDepartment
      : true;
    const matchesRole = filterRole ? user.role === filterRole : true;
    const matchesStatus = filterStatus ? user.status === filterStatus : true;
    return matchesDepartment && matchesRole && matchesStatus;
  };

  // 정렬 함수
  const sortFunction = (a, b, sortBy, sortOrder) => {
    let comparison = 0;

    if (sortBy === "name") {
      comparison = (a.name || "").localeCompare(b.name || "");
    } else if (sortBy === "department") {
      comparison = (a.department || "").localeCompare(b.department || "");
    } else if (sortBy === "position") {
      comparison = (a.position || "").localeCompare(b.position || "");
    } else if (sortBy === "title") {
      comparison = (a.title || "").localeCompare(b.title || "");
    } else if (sortBy === "role") {
      comparison = (a.role || "").localeCompare(b.role || "");
    } else if (sortBy === "status") {
      comparison = (a.status || "").localeCompare(b.status || "");
    } else if (sortBy === "joinDate") {
      const dateA = a.joinDate ? new Date(a.joinDate) : new Date(0);
      const dateB = b.joinDate ? new Date(b.joinDate) : new Date(0);
      comparison = dateA - dateB;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  };

  // 필터 변경 핸들러
  const handleFilterChange = (filterId, value) => {
    if (filterId === "department") {
      setFilterDepartment(value);
    } else if (filterId === "role") {
      setFilterRole(value);
    } else if (filterId === "status") {
      setFilterStatus(value);
    }
  };

  // 필터 초기화 핸들러
  const handleResetFilters = () => {
    setFilterDepartment("");
    setFilterRole("");
    setFilterStatus("");
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  // 테이블 컬럼 정의
  const columns = [
    { field: "name", headerName: "이름", width: 120 },
    { field: "email", headerName: "이메일", width: 200 },
    { field: "department", headerName: "부서", width: 120 },
    { field: "position", headerName: "직위", width: 120 },
    { field: "title", headerName: "직책", width: 120 },
    { field: "role", headerName: "권한", width: 120 },
    { field: "status", headerName: "상태", width: 120 },
    { field: "joinDate", headerName: "입사일", width: 120 },
    { field: "actions", headerName: "관리", width: 120, sortable: false },
  ];

  // 필터 정의
  const filterOptions = [
    {
      id: "department",
      label: "부서",
      value: filterDepartment,
      options: departmentOptions,
    },
    {
      id: "role",
      label: "권한",
      value: filterRole,
      options: roles.map((role) => ({ label: role, value: role })),
    },
    {
      id: "status",
      label: "상태",
      value: filterStatus,
      options: statuses.map((status) => ({ label: status, value: status })),
    },
  ];

  // 헤더 액션 정의
  const headerActions = [
    {
      icon: UserCog,
      label: "권한 관리",
      to: "/users/permissions",
      variant: "secondary",
    },
    {
      icon: UserPlus,
      label: "사용자 추가",
      to: "/users/add",
      variant: "primary",
    },
  ];

  // 통계 컴포넌트
  const statsComponent = (
    <UserStats
      usersCount={users.length}
      activeCount={users.filter((user) => user.status === "재직중").length}
      departmentsCount={
        [...new Set(users.map((user) => user.department).filter(Boolean))]
          .length
      }
    />
  );

  return (
    <ListPageTemplate
      // 기본 설정
      title="사용자 관리"
      entityName="사용자"
      // 데이터 관련
      data={users}
      loading={loading}
      setLoading={setLoading}
      fetchData={fetchData}
      // 테이블/그리드 설정
      columns={columns}
      renderGridItem={(user) => (
        <UserCard
          key={user.id}
          user={user}
          onClick={() => navigate(`/users/detail/${user.id}`)}
          onDelete={(e) => {
            e.stopPropagation();
            deleteUser(user.id, user.name);
          }}
          isSelected={false}
          onSelect={() => {}}
        />
      )}
      // 필터 관련
      filterOptions={filterOptions}
      onFilterChange={handleFilterChange}
      onResetFilters={handleResetFilters}
      searchFilter={searchFilter}
      additionalFilter={additionalFilter}
      // 정렬 관련
      sortFunction={sortFunction}
      defaultSortBy="name"
      defaultSortOrder="asc"
      // 액션 관련
      onDelete={deleteUser}
      onDeleteMultiple={deleteMultipleUsers}
      // 헤더 액션
      headerActions={headerActions}
      // 추가 컴포넌트
      statsComponent={statsComponent}
      emptyStateComponent={<UserEmptyState />}
      // 클릭 핸들러
      onItemClick={(user) => navigate(`/users/detail/${user.id}`)}
      // 추가 설정
      defaultViewMode="table"
      searchPlaceholder="이름, 이메일, 부서 또는 직책 검색..."
      // 사용자가 없을 때는 테이블/그리드를 표시하지 않음
      hideTableWhenEmpty={true}
    />
  );
};

export default Users;
