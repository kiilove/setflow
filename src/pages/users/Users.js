"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, UserCog } from "lucide-react";
import UserCard from "../../components/users/UserCard";
import UserStats from "../../components/users/UserStats";
import UserEmptyState from "../../components/users/UserEmptyState";
import useEntityData from "../../hooks/useEntityData";
import ListPageTemplate from "../../components/common/ListPageTemplate";
import { departments } from "../../data/userInitialData";
import { deleteFileFromStorage } from "../../utils/fileUtils";
import { fetchUserData } from "../../utils/firebaseUtils";
import BounceLoadingLogo from "../../components/common/BounceLoadingLogo";

const Users = () => {
  const navigate = useNavigate();
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterWorkType, setFilterWorkType] = useState("");
  const [decryptedUsers, setDecryptedUsers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  // 엔티티 데이터 관리 훅 사용
  const {
    data: users,
    loading: entityLoading,
    setLoading: setEntityLoading,
    fetchData,
    deleteItem: deleteUser,
    deleteMultipleItems: deleteMultipleUsers,
    getDocuments,
  } = useEntityData("users");

  // 사용자 데이터 복호화
  useEffect(() => {
    const decryptUsers = async () => {
      if (!users || users.length === 0) return;

      try {
        setEntityLoading(true);
        const decryptedData = await Promise.all(
          users.map(async (user) => {
            try {
              const decryptedUser = await fetchUserData(user.id);
              return { ...user, ...decryptedUser };
            } catch (error) {
              console.error(`Error decrypting user ${user.id}:`, error);
              return user;
            }
          })
        );
        setDecryptedUsers(decryptedData);
      } catch (error) {
        console.error("Error decrypting users:", error);
        setDecryptedUsers(users);
      } finally {
        setEntityLoading(false);
      }
    };

    decryptUsers();
  }, [users, setEntityLoading]);

  // 부서 목록 추출
  const departmentOptions = departments.map((dept) => ({
    label: dept.name,
    value: dept.name,
  }));

  // 위치 목록 추출
  const locations = [
    ...new Set(users.map((user) => user.location).filter(Boolean)),
  ];

  // 근무형태 목록 추출
  const workTypes = [
    ...new Set(users.map((user) => user.workType).filter(Boolean)),
  ];

  // 검색 필터 함수
  const searchFilter = (user, searchTerm) => {
    return (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // 추가 필터 함수
  const additionalFilter = (user) => {
    const matchesDepartment = filterDepartment
      ? user.department === filterDepartment
      : true;
    const matchesLocation = filterLocation
      ? user.location === filterLocation
      : true;
    const matchesWorkType = filterWorkType
      ? user.workType === filterWorkType
      : true;
    return matchesDepartment && matchesLocation && matchesWorkType;
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
    } else if (sortBy === "location") {
      comparison = (a.location || "").localeCompare(b.location || "");
    } else if (sortBy === "workType") {
      comparison = (a.workType || "").localeCompare(b.workType || "");
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
    } else if (filterId === "location") {
      setFilterLocation(value);
    } else if (filterId === "workType") {
      setFilterWorkType(value);
    }
  };

  // 필터 초기화 핸들러
  const handleResetFilters = () => {
    setFilterDepartment("");
    setFilterLocation("");
    setFilterWorkType("");
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  // 다중 삭제 함수 수정
  const handleDeleteMultipleUsers = async (userIds) => {
    try {
      const usersToDelete = users.filter((u) => userIds.includes(u.id));

      // 프로필 이미지 파일 삭제
      await Promise.all(
        usersToDelete.map((user) => {
          if (user.profileImage) {
            return deleteFileFromStorage(user.profileImage);
          }
          return Promise.resolve();
        })
      );

      // Firestore 데이터 삭제
      await deleteMultipleUsers(userIds);

      // 삭제 후 데이터 갱신
      const updatedUsers = users.filter((user) => !userIds.includes(user.id));
      setDecryptedUsers(updatedUsers);

      // 선택된 항목 초기화
      setSelectedItems([]);
    } catch (error) {
      console.error("사용자 다중 삭제 중 오류 발생:", error);
    }
  };

  // 사용자 삭제 함수 수정
  const handleDeleteUser = async (userId, userName) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (user?.profileImage) {
        await deleteFileFromStorage(user.profileImage);
      }
      await deleteUser(userId, userName);

      // 삭제 후 데이터 갱신
      const updatedUsers = users.filter((u) => u.id !== userId);
      setDecryptedUsers(updatedUsers);
    } catch (error) {
      console.error("사용자 삭제 중 오류 발생:", error);
    }
  };

  // 테이블 컬럼 정의
  const columns = [
    { id: "name", header: "이름", width: 120, sortable: true },
    { id: "email", header: "이메일", width: 200, sortable: true },
    { id: "employeeNumber", header: "사원번호", width: 120, sortable: true },
    { id: "gender", header: "성별", width: 80, sortable: true },
    { id: "department", header: "부서", width: 120, sortable: true },
    { id: "position", header: "직위", width: 120, sortable: true },
    { id: "title", header: "직책", width: 120, sortable: true },
    { id: "location", header: "위치", width: 120, sortable: true },
    { id: "workType", header: "근무형태", width: 120, sortable: true },
    { id: "joinDate", header: "입사일", width: 120, sortable: true },
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
      id: "location",
      label: "위치",
      value: filterLocation,
      options: locations.map((location) => ({
        label: location,
        value: location,
      })),
    },
    {
      id: "workType",
      label: "근무형태",
      value: filterWorkType,
      options: workTypes.map((workType) => ({
        label: workType,
        value: workType,
      })),
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
      activeCount={users.length}
      departmentsCount={
        [...new Set(users.map((user) => user.department).filter(Boolean))]
          .length
      }
    />
  );

  if (entityLoading) {
    return <BounceLoadingLogo />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ListPageTemplate
        // 기본 설정
        title="사용자 관리"
        entityName="사용자"
        // 데이터 관련
        data={decryptedUsers}
        loading={entityLoading}
        setLoading={setEntityLoading}
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
              handleDeleteUser(user.id, user.name);
            }}
            isSelected={selectedItems.includes(user.id)}
            onSelect={(e) => {
              e.stopPropagation();
              if (selectedItems.includes(user.id)) {
                setSelectedItems(selectedItems.filter((id) => id !== user.id));
              } else {
                setSelectedItems([...selectedItems, user.id]);
              }
            }}
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
        onDelete={handleDeleteUser}
        onDeleteMultiple={handleDeleteMultipleUsers}
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
        // 페이지네이션 관련
        currentPage={1}
        totalPages={Math.ceil(users.length / 10)}
        onPageChange={() => {}}
        pageSize={10}
        totalItems={users.length}
        // 선택 관련
        selectedItems={selectedItems}
        onSelectItem={(user) => {
          if (selectedItems.includes(user.id)) {
            setSelectedItems(selectedItems.filter((id) => id !== user.id));
          } else {
            setSelectedItems([...selectedItems, user.id]);
          }
        }}
        onSelectAll={() => {
          setSelectedItems(users.map((user) => user.id));
        }}
        // 정렬 설정
        sortConfig={{ key: "name", direction: "asc" }}
        onSort={() => {}}
        // 클릭 가능한 컬럼 설정
        clickableColumn={{ id: "name" }}
      />
    </div>
  );
};

export default Users;
