"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import useEntityData from "../../hooks/useEntityData";
import ListPageTemplate from "../../components/common/ListPageTemplate";
import { useMessageContext } from "../../context/MessageContext";

const Departments = () => {
  const navigate = useNavigate();
  const { showConfirm, showSuccess, showError } = useMessageContext();

  // 엔티티 데이터 관리 훅 사용
  const {
    data: departmentsData,
    loading,
    setLoading,
    fetchData,
    deleteItem: deleteDepartment,
    deleteMultipleItems: deleteMultipleDepartments,
  } = useEntityData("departments");

  // 위치 데이터 (실제로는 API에서 가져올 데이터)
  const locations = {
    loc1: "본사",
    loc2: "서울 지사",
    loc3: "부산 지사",
  };

  // 검색 필터 함수
  const searchFilter = (department, searchTerm) => {
    const locationName = department.locationId
      ? locations[department.locationId] || ""
      : "";
    return (
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (department.description &&
        department.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      locationName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // 정렬 함수
  const sortFunction = (a, b, sortBy, sortOrder) => {
    let comparison = 0;

    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "location") {
      const locationA = a.locationId ? locations[a.locationId] || "" : "";
      const locationB = b.locationId ? locations[b.locationId] || "" : "";
      comparison = locationA.localeCompare(locationB);
    }

    return sortOrder === "asc" ? comparison : -comparison;
  };

  // 아이콘 렌더링 함수
  const renderDepartmentIcon = (department) => {
    if (department.icon && Icons[department.icon]) {
      return React.createElement(Icons[department.icon], {
        className: "h-5 w-5",
      });
    }
    return <Icons.Building className="h-5 w-5" />;
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      id: "name",
      header: "부서명",
      sortable: true,
      render: (department) => (
        <div className="flex items-center">
          <div
            className={`p-2 rounded-full mr-3 ${
              department.iconColor || "bg-gray-100"
            } ${department.iconTextColor || "text-gray-500"}`}
          >
            {renderDepartmentIcon(department)}
          </div>
          <span className="font-medium">{department.name}</span>
        </div>
      ),
    },
    {
      id: "location",
      header: "위치",
      sortable: true,
      accessor: (department) =>
        department.locationId ? locations[department.locationId] || "-" : "-",
    },
    {
      id: "description",
      header: "설명",
      accessor: (department) => department.description || "-",
      className: "max-w-xs truncate",
    },
  ];

  // 테이블 액션 버튼 렌더링
  const renderActions = (department, onDelete) => (
    <div className="flex space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/users?department=${department.name}`);
        }}
        className="text-blue-500 hover:text-blue-700 p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
        title="소속 사용자 보기"
      >
        <Users className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/departments/edit/${department.id}`);
        }}
        className="text-yellow-500 hover:text-yellow-700 p-1 rounded-md hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
        title="부서 편집"
      >
        <Edit className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(department.id, department.name);
        }}
        className="text-destructive hover:text-destructive/80 p-1 rounded-md hover:bg-destructive/10"
        title="부서 삭제"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  // 헤더 액션 정의
  const headerActions = [
    {
      icon: Plus,
      label: "부서 추가",
      to: "/departments/add",
      variant: "primary",
    },
  ];

  return (
    <ListPageTemplate
      // 기본 설정
      title="부서 관리"
      entityName="부서"
      // 데이터 관련
      data={departmentsData}
      loading={loading}
      setLoading={setLoading}
      fetchData={fetchData}
      // 테이블/그리드 설정
      columns={columns}
      renderGridItem={(department) => (
        <div
          key={department.id}
          className="bg-card border border-border rounded-lg shadow-sm hover:shadow transition-shadow overflow-hidden"
          onClick={() => navigate(`/departments/detail/${department.id}`)}
        >
          <div className="relative">
            {/* 부서 헤더 */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center mb-2">
                <div
                  className={`p-2 rounded-full mr-3 ${
                    department.iconColor || "bg-gray-100"
                  } ${department.iconTextColor || "text-gray-500"}`}
                >
                  {renderDepartmentIcon(department)}
                </div>
                <h3 className="text-lg font-medium text-foreground">
                  {department.name}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                {department.description || "설명 없음"}
              </p>
            </div>

            {/* 부서 정보 */}
            <div className="p-4">
              <div className="space-y-2 mb-4">
                {department.locationId && (
                  <div className="flex items-center text-sm">
                    <Icons.MapPin className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-muted-foreground">
                      위치: {locations[department.locationId] || "-"}
                    </span>
                  </div>
                )}
              </div>

              {/* 액션 버튼 */}
              <div className="flex justify-end pt-3 border-t border-border">
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/users?department=${department.name}`);
                    }}
                    className="text-blue-500 hover:text-blue-700 p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    title="소속 사용자 보기"
                  >
                    <Users className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/departments/edit/${department.id}`);
                    }}
                    className="text-yellow-500 hover:text-yellow-700 p-1.5 rounded-md hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    title="부서 편집"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDepartment(department.id, department.name);
                    }}
                    className="text-destructive hover:text-destructive/80 p-1.5 rounded-md hover:bg-destructive/10"
                    title="부서 삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      renderActions={renderActions}
      // 필터 관련
      searchFilter={searchFilter}
      // 정렬 관련
      sortFunction={sortFunction}
      defaultSortBy="name"
      defaultSortOrder="asc"
      // 액션 관련
      onDelete={deleteDepartment}
      onDeleteMultiple={deleteMultipleDepartments}
      // 헤더 액션
      headerActions={headerActions}
      // 클릭 핸들러
      onItemClick={(department) =>
        navigate(`/departments/detail/${department.id}`)
      }
      // 추가 설정
      defaultViewMode="table"
      searchPlaceholder="부서명, 위치 검색..."
    />
  );
};

export default Departments;
