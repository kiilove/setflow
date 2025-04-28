"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { Plus, RefreshCw, Grid, FileEdit, Edit, Trash2 } from "lucide-react";
import categoryInitialData, {
  categoryGroups,
} from "../../data/categoryInitialData";
import CategoryStats from "../../components/categories/CategoryStats";
import CategoryEmptyState from "../../components/categories/CategoryEmptyState";
import ListPageTemplate from "../../components/common/ListPageTemplate";
import { useMessageContext } from "../../context/MessageContext";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  getDoc,
  query,
  where,
} from "firebase/firestore";

const Categories = () => {
  const navigate = useNavigate();
  const { userUUID } = useAuth();
  const { showConfirm, showSuccess, showError } = useMessageContext();

  // 상태 관리
  const [filterYears, setFilterYears] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [initializing, setInitializing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // 카테고리 목록 가져오기
  const loadCategories = useCallback(async () => {
    if (!userUUID) {
      console.error("No user UUID available");
      return;
    }

    try {
      setLoading(true);
      console.log("Loading categories for user:", userUUID);

      const categoriesRef = collection(db, "clients", userUUID, "categories");
      const snapshot = await getDocs(categoriesRef);

      const loadedCategories = [];
      snapshot.forEach((doc) => {
        loadedCategories.push({ id: doc.id, ...doc.data() });
      });

      console.log("Loaded categories:", loadedCategories.length);
      setCategories(loadedCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
      showError(
        "로드 오류",
        "카테고리 목록을 불러오는 중 오류가 발생했습니다."
      );
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [userUUID, showError]);

  // 카테고리 초기화 함수
  const initializeCategories = useCallback(async () => {
    if (!userUUID) {
      console.error("No user UUID available");
      return;
    }

    const confirmed = await showConfirm(
      "카테고리 초기화",
      "이 작업은 모든 기존 카테고리와 그룹을 삭제하고 기본 데이터로 초기화합니다. 계속하시겠습니까?",
      {
        confirmText: "초기화",
        cancelText: "취소",
        confirmVariant: "primary",
      }
    );

    if (!confirmed) {
      console.log("Initialization cancelled by user");
      return;
    }

    try {
      setInitializing(true);
      console.log("Starting category initialization...");

      // 기존 데이터 삭제
      const batch = writeBatch(db);

      // 기존 카테고리 삭제
      const categoriesRef = collection(db, "clients", userUUID, "categories");
      const categoriesSnapshot = await getDocs(categoriesRef);
      categoriesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // 기존 카테고리 그룹 삭제
      const groupsRef = collection(db, "clients", userUUID, "categoryGroups");
      const groupsSnapshot = await getDocs(groupsRef);
      groupsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // 목업 데이터에서 고유한 그룹 목록 추출
      const uniqueGroups = [
        ...new Set(categoryInitialData.map((cat) => cat.group).filter(Boolean)),
      ];
      console.log("Unique groups from mock data:", uniqueGroups);

      // 카테고리 그룹 추가 (CategoriesForm.js와 동일한 구조)
      uniqueGroups.forEach((groupName) => {
        const groupDocRef = doc(groupsRef);
        batch.set(groupDocRef, {
          name: groupName,
          description: `${groupName} 그룹`,
          icon: "Package",
          color: "bg-gray-100",
          textColor: "text-gray-500",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });

      // 카테고리 추가 (목업 데이터 그대로 저장)
      categoryInitialData.forEach((category) => {
        const newDocRef = doc(categoriesRef);
        batch.set(newDocRef, {
          ...category,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
      console.log("Initialization completed:", {
        categories: categoryInitialData.length,
        groups: uniqueGroups.length,
      });

      // 데이터 다시 불러오기
      await loadCategories();

      showSuccess(
        "카테고리 초기화 완료",
        `기본 카테고리가 성공적으로 등록되었습니다. (카테고리: ${categoryInitialData.length}개, 그룹: ${uniqueGroups.length}개)`
      );
    } catch (error) {
      console.error("카테고리 초기화 중 오류 발생:", error);
      showError(
        "초기화 실패",
        "카테고리 초기화에 실패했습니다. 다시 시도해주세요."
      );
    } finally {
      setInitializing(false);
    }
  }, [userUUID, loadCategories, showConfirm, showSuccess, showError]);

  // 카테고리 그룹 목록 가져오기
  const loadCategoryGroups = useCallback(async () => {
    if (!userUUID) {
      console.error("No user UUID available");
      return;
    }

    try {
      const groupsRef = collection(db, "clients", userUUID, "categoryGroups");
      const snapshot = await getDocs(groupsRef);

      const groups = [];
      snapshot.forEach((doc) => {
        groups.push({ id: doc.id, ...doc.data() });
      });

      return groups;
    } catch (error) {
      console.error("Error loading category groups:", error);
      return [];
    }
  }, [userUUID]);

  // 카테고리 삭제 함수
  const handleDelete = useCallback(
    async (id) => {
      if (!userUUID) {
        console.error("No user UUID available");
        return;
      }

      try {
        // 카테고리 문서 참조
        const categoryRef = doc(db, "clients", userUUID, "categories", id);
        const categoryDoc = await getDoc(categoryRef);

        if (!categoryDoc.exists()) {
          throw new Error("카테고리가 존재하지 않습니다.");
        }

        const categoryData = categoryDoc.data();

        // 해당 카테고리가 마지막 카테고리인 그룹을 찾기 위해 그룹의 카테고리 수 확인
        const categoriesRef = collection(db, "clients", userUUID, "categories");
        const categoriesSnapshot = await getDocs(
          query(categoriesRef, where("group", "==", categoryData.group))
        );

        // 배치 작업 시작
        const batch = writeBatch(db);

        // 카테고리 삭제
        batch.delete(categoryRef);

        // 그룹에 속한 카테고리가 하나뿐이면 그룹도 삭제
        if (categoriesSnapshot.size === 1) {
          const groupsRef = collection(
            db,
            "clients",
            userUUID,
            "categoryGroups"
          );
          const groupsSnapshot = await getDocs(
            query(groupsRef, where("name", "==", categoryData.group))
          );

          groupsSnapshot.forEach((groupDoc) => {
            batch.delete(groupDoc.ref);
          });
        }

        await batch.commit();
        showSuccess("삭제 완료", "카테고리가 성공적으로 삭제되었습니다.");
        await loadCategories();
      } catch (error) {
        console.error("카테고리 삭제 중 오류가 발생했습니다:", error);
        showError("삭제 오류", "카테고리 삭제에 실패했습니다.");
      }
    },
    [userUUID, loadCategories, showSuccess, showError]
  );

  // 컴포넌트 마운트 시 카테고리 목록 로드
  useEffect(() => {
    if (userUUID) {
      loadCategories();
    } else {
      console.error("No user UUID available");
      showError("인증 오류", "사용자 정보를 찾을 수 없습니다.");
    }
  }, [userUUID, loadCategories, showError]);

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
      !filterYears ||
      category.depreciation?.minDepreciationPeriod?.toString() === filterYears;

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
      comparison =
        (a.depreciation?.minDepreciationPeriod || 0) -
        (b.depreciation?.minDepreciationPeriod || 0);
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

  // 감가상각 방법 표시 형식
  const formatDepreciationMethod = (method) => {
    return method || "-";
  };

  // 잔존가치 표시 형식
  const formatResidualValue = (depreciation) => {
    if (!depreciation) return "-";
    if (depreciation.salvageValueType === "percentage") {
      return `${depreciation.salvageValue}%`;
    } else {
      return `${depreciation.salvageValue?.toLocaleString() || 0}원`;
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
          {category.depreciation?.minDepreciationPeriod || 0}년/
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
      categories
        .map((cat) => cat.depreciation?.minDepreciationPeriod)
        .filter(Boolean)
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
                  cat.depreciation?.minDepreciationPeriod
                    ? sum + cat.depreciation.minDepreciationPeriod
                    : sum,
                0
              ) / categories.length
            )
          : 0
      }
      groupsCount={groups.length}
    />
  );

  // 카테고리 수정 페이지로 이동
  const handleEdit = (id) => {
    navigate(`/categories/edit/${id}`);
  };

  // 카테고리 추가 페이지로 이동
  const handleAdd = () => {
    navigate("/categories/add");
  };

  return (
    <ListPageTemplate
      // 기본 설정
      title="자산 카테고리"
      entityName="카테고리"
      // 데이터 관련
      data={categories}
      loading={loading}
      setLoading={setLoading}
      fetchData={loadCategories}
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
                  감가상각 {category.depreciation?.minDepreciationPeriod || 0}
                  년/
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
                      handleDelete(category.id);
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
      onDelete={handleDelete}
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
