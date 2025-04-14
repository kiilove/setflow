"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { Plus, RefreshCw, Grid, FileEdit, Edit, Trash2 } from "lucide-react";
import { db } from "../../firebase/config";
import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import categoryInitialData, {
  categoryGroups,
} from "../../data/categoryInitialData";
import CategoryStats from "../../components/categories/CategoryStats";
import CategoryEmptyState from "../../components/categories/CategoryEmptyState";
import useEntityData from "../../hooks/useEntityData";
import ListPageTemplate from "../../components/common/ListPageTemplate";
import { useMessageContext } from "../../context/MessageContext";

const Categories = () => {
  const navigate = useNavigate();
  const { showConfirm, showSuccess, showError } = useMessageContext();
  const [filterYears, setFilterYears] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [initializing, setInitializing] = useState(false);

  // 엔티티 데이터 관리 훅 사용
  const {
    data: categories,
    loading,
    setLoading,
    fetchData,
    deleteItem: deleteCategory,
    deleteMultipleItems: deleteMultipleCategories,
  } = useEntityData("categories", {
    onDataLoaded: (data) => {
      // 통계 계산은 이제 StatsComponent에서 직접 처리
    },
  });

  // 카테고리 초기화 함수
  const initializeCategories = async () => {
    const confirmed = await showConfirm(
      "카테고리 초기화",
      "이 작업은 기본 카테고리 데이터를 Firebase에 등록합니다. 기존 카테고리는 유지되며, 중복된 이름의 카테고리는 업데이트되지 않고 새로 추가됩니다. 계속하시겠습니까?",
      {
        confirmText: "초기화",
        cancelText: "취소",
        confirmVariant: "primary",
      }
    );

    if (!confirmed) return;

    try {
      setInitializing(true);

      // Firebase Batch 작업 준비
      const batch = writeBatch(db);

      // 각 카테고리에 대해 처리
      for (const category of categoryInitialData) {
        // Firebase가 자동으로 ID를 생성하도록 함
        const categoryRef = doc(collection(db, "categories"));

        // 카테고리 데이터 준비
        const categoryData = {
          ...category,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        // Batch에 추가 (merge 옵션 제거하여 항상 새로 생성)
        batch.set(categoryRef, categoryData);
      }

      // 카테고리 그룹 데이터도 추가
      const groupsCollectionRef = collection(db, "categoryGroups");

      // 기존 그룹 데이터를 삭제하지 않고 새로 추가
      for (const group of categoryGroups) {
        const groupRef = doc(groupsCollectionRef, group.id);
        batch.set(groupRef, {
          ...group,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      // Batch 실행
      await batch.commit();

      // 데이터 다시 불러오기
      await fetchData();

      showSuccess(
        "카테고리 초기화 완료",
        "기본 카테고리와 그룹이 성공적으로 등록되었습니다."
      );
    } catch (error) {
      console.error("카테고리 초기화 중 오류 발생:", error);
      showError("초기화 오류", "카테고리 초기화 중 오류가 발생했습니다.");
    } finally {
      setInitializing(false);
    }
  };

  // 검색 필터 함수
  const searchFilter = (category, searchTerm) => {
    return (
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (category.group &&
        category.group.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  // 추가 필터 함수
  const additionalFilter = (category) => {
    // 감가상각 기간 필터링
    const matchesYears =
      !filterYears || category.depreciation?.years?.toString() === filterYears;

    // 감가상각 방법 필터링
    const matchesMethod =
      !filterMethod || category.depreciation?.method === filterMethod;

    // 카테고리 그룹 필터링
    const matchesGroup = !filterGroup || category.group === filterGroup;

    return matchesYears && matchesMethod && matchesGroup;
  };

  // 정렬 함수
  const sortFunction = (a, b, sortBy, sortOrder) => {
    let comparison = 0;

    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "group") {
      comparison = (a.group || "").localeCompare(b.group || "");
    } else if (sortBy === "years") {
      comparison = (a.depreciation?.years || 0) - (b.depreciation?.years || 0);
    }

    return sortOrder === "asc" ? comparison : -comparison;
  };

  // 필터 변경 핸들러
  const handleFilterChange = (filterId, value) => {
    if (filterId === "years") {
      setFilterYears(value);
    } else if (filterId === "method") {
      setFilterMethod(value);
    } else if (filterId === "group") {
      setFilterGroup(value);
    }
  };

  // 필터 초기화 핸들러
  const handleResetFilters = () => {
    setFilterYears("");
    setFilterMethod("");
    setFilterGroup("");
  };

  // 잔존가치 표시 형식
  const formatResidualValue = (depreciation) => {
    if (!depreciation) return "-";
    if (depreciation.residualValueType === "percentage") {
      return `${depreciation.residualValue}%`;
    } else {
      return `${depreciation.residualValue.toLocaleString()}원`;
    }
  };

  // 아이콘 렌더링 함수
  const renderCategoryIcon = (category) => {
    if (category.icon && Icons[category.icon]) {
      return React.createElement(Icons[category.icon], {
        className: "h-5 w-5",
      });
    }
    return <Icons.List className="h-5 w-5" />;
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      id: "name",
      header: "카테고리명",
      sortable: true,
      render: (category) => (
        <div className="flex items-center">
          <div
            className={`p-2 rounded-full mr-3 ${
              category.iconColor || "bg-gray-100"
            } ${category.iconTextColor || "text-gray-500"}`}
          >
            {renderCategoryIcon(category)}
          </div>
          <span className="font-medium">{category.name}</span>
        </div>
      ),
    },
    {
      id: "group",
      header: "그룹",
      sortable: true,
      accessor: (category) => category.group || "-",
    },
    {
      id: "years",
      header: "감가상각",
      sortable: true,
      render: (category) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
          {category.depreciation?.years || 0}년/
          {formatResidualValue(category.depreciation)}
        </span>
      ),
    },
    {
      id: "description",
      header: "설명",
      accessor: (category) => category.description || "-",
      className: "max-w-xs truncate",
    },
  ];

  // 테이블 액션 버튼 렌더링
  const renderActions = (category, onDelete) => (
    <div className="flex space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/assets?category=${category.name}`);
        }}
        className="text-blue-500 hover:text-blue-700 p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
        title="자산 보기"
      >
        <Grid className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/categories/template/${category.id}`);
        }}
        className="text-primary hover:text-primary/80 p-1 rounded-md hover:bg-primary/5"
        title="사양 템플릿 편집"
      >
        <FileEdit className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/categories/edit/${category.id}`);
        }}
        className="text-yellow-500 hover:text-yellow-700 p-1 rounded-md hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
        title="카테고리 편집"
      >
        <Edit className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(category.id, category.name);
        }}
        className="text-destructive hover:text-destructive/80 p-1 rounded-md hover:bg-destructive/10"
        title="카테고리 삭제"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  // 필터 정의
  const depreciationYears = [
    ...new Set(
      categories.map((cat) => cat.depreciation?.years).filter(Boolean)
    ),
  ].sort((a, b) => a - b);

  const depreciationMethods = [
    ...new Set(
      categories.map((cat) => cat.depreciation?.method).filter(Boolean)
    ),
  ];

  // 카테고리 그룹 목록 추출
  const groups = [
    ...new Set(categories.map((cat) => cat.group).filter(Boolean)),
  ];

  const filterOptions = [
    {
      id: "group",
      label: "카테고리 그룹",
      value: filterGroup,
      options: groups.map((group) => ({
        label: group,
        value: group,
      })),
    },
    {
      id: "years",
      label: "감가상각 기간",
      value: filterYears,
      options: depreciationYears.map((year) => ({
        label: `${year}년`,
        value: year.toString(),
      })),
    },
    {
      id: "method",
      label: "감가상각 방법",
      value: filterMethod,
      options: depreciationMethods.map((method) => {
        let label = method;
        if (method === "straight-line") label = "정액법";
        if (method === "declining-balance") label = "정률법";
        return { label, value: method };
      }),
    },
  ];

  // 헤더 액션 정의
  const headerActions = [
    {
      icon: RefreshCw,
      label: initializing ? "초기화 중..." : "카테고리 초기화",
      onClick: initializeCategories,
      disabled: initializing,
      iconClassName: initializing ? "animate-spin" : "",
      variant: "secondary",
    },
    {
      icon: Plus,
      label: "카테고리 추가",
      to: "/categories/add",
      variant: "primary",
    },
  ];

  // 통계 컴포넌트
  const statsComponent = (
    <CategoryStats
      categoriesCount={categories.length}
      totalAssets={0} // 실제 자산 수는 별도로 계산해야 함
      totalDepreciationYears={
        categories.length > 0
          ? Math.round(
              categories.reduce(
                (sum, cat) =>
                  cat.depreciation?.years ? sum + cat.depreciation.years : sum,
                0
              ) / categories.length
            )
          : 0
      }
      groupsCount={groups.length}
    />
  );

  return (
    <ListPageTemplate
      // 기본 설정
      title="자산 카테고리"
      entityName="카테고리"
      // 데이터 관련
      data={categories}
      loading={loading}
      setLoading={setLoading}
      fetchData={fetchData}
      // 테이블/그리드 설정
      columns={columns}
      renderGridItem={(category) => (
        <div
          key={category.id}
          className="bg-card border border-border rounded-lg shadow-sm hover:shadow transition-shadow overflow-hidden"
          onClick={() => navigate(`/categories/detail/${category.id}`)}
        >
          <div className="relative">
            {/* 카테고리 헤더 */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center mb-2">
                <div
                  className={`p-2 rounded-full mr-3 ${
                    category.iconColor || "bg-gray-100"
                  } ${category.iconTextColor || "text-gray-500"}`}
                >
                  {renderCategoryIcon(category)}
                </div>
                <h3 className="text-lg font-medium text-foreground">
                  {category.name}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                {category.description || "설명 없음"}
              </p>
            </div>

            {/* 카테고리 정보 */}
            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {category.group && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {category.group}
                  </span>
                )}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  감가상각 {category.depreciation?.years || 0}년/
                  {formatResidualValue(category.depreciation)}
                </span>
              </div>

              {/* 액션 버튼 */}
              <div className="flex justify-between pt-3 border-t border-border">
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/assets?category=${category.name}`);
                    }}
                    className="text-blue-500 hover:text-blue-700 p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    title="자산 보기"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/categories/template/${category.id}`);
                    }}
                    className="text-primary hover:text-primary/80 p-1.5 rounded-md hover:bg-primary/5"
                    title="사양 템플릿 편집"
                  >
                    <FileEdit className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/categories/edit/${category.id}`);
                    }}
                    className="text-yellow-500 hover:text-yellow-700 p-1.5 rounded-md hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    title="카테고리 편집"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCategory(category.id, category.name);
                    }}
                    className="text-destructive hover:text-destructive/80 p-1.5 rounded-md hover:bg-destructive/10"
                    title="카테고리 삭제"
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
      onDelete={deleteCategory}
      onDeleteMultiple={deleteMultipleCategories}
      // 헤더 액션
      headerActions={headerActions}
      // 추가 컴포넌트
      statsComponent={statsComponent}
      emptyStateComponent={<CategoryEmptyState />}
      // 클릭 핸들러
      onItemClick={(category) => navigate(`/categories/detail/${category.id}`)}
      // 추가 설정
      defaultViewMode="table"
      searchPlaceholder="카테고리 검색..."
    />
  );
};

export default Categories;
