"use client";

import React, { useState, useEffect } from "react";
import PageContainer from "../../components/common/PageContainer";
import * as Icons from "lucide-react";
import { List } from "lucide-react";
import { dataService } from "../../data/mockData";

// 분리된 컴포넌트들 가져오기
import CategoryStats from "../../components/categories/CategoryStats";
import CategorySearch from "../../components/categories/CategorySearch";
import CategoryGrid from "../../components/categories/CategoryGrid";
import CategoryTable from "../../components/categories/CategoryTable";
import CategoryPagination from "../../components/categories/CategoryPagination";
import CategoryEmptyState from "../../components/categories/CategoryEmptyState";

const Categories = () => {
  // 상태 관리
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid"); // grid 또는 list
  const [totalAssets, setTotalAssets] = useState(0);
  const [avgDepreciationYears, setAvgDepreciationYears] = useState(0);
  const [loading, setLoading] = useState(true);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 카테고리 데이터 로드
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // dataService를 사용하여 카테고리 데이터 가져오기
        const data = await dataService.getCategories();
        setCategories(data);

        // 통계 계산
        const assets = data.reduce((sum, cat) => sum + (cat.count || 0), 0);

        // 평균 감가상각 기간 계산
        const totalYears = data.reduce(
          (sum, cat) => sum + (cat.depreciation?.years || 0),
          0
        );
        const avgYears =
          data.length > 0 ? Math.round(totalYears / data.length) : 0;

        setTotalAssets(assets);
        setAvgDepreciationYears(avgYears);
      } catch (error) {
        console.error(
          "카테고리 데이터를 불러오는 중 오류가 발생했습니다:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 검색 및 정렬 적용
  useEffect(() => {
    if (!searchTerm && sortBy === "name" && sortOrder === "asc") {
      // 기본 상태일 때는 원본 데이터를 다시 불러옵니다
      const fetchOriginalData = async () => {
        try {
          const data = await dataService.getCategories();
          setCategories(data);
        } catch (error) {
          console.error(
            "카테고리 데이터를 불러오는 중 오류가 발생했습니다:",
            error
          );
        }
      };

      fetchOriginalData();
      return;
    }

    const applyFiltersAndSort = async () => {
      try {
        // 원본 데이터를 가져옵니다
        const originalData = await dataService.getCategories();
        let filtered = [...originalData];

        // 검색어 적용
        if (searchTerm) {
          filtered = filtered.filter(
            (cat) =>
              cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (cat.description &&
                cat.description
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()))
          );
        }

        // 정렬 적용
        filtered.sort((a, b) => {
          let comparison = 0;
          if (sortBy === "name") {
            comparison = a.name.localeCompare(b.name);
          } else if (sortBy === "count") {
            comparison = (a.count || 0) - (b.count || 0);
          } else if (sortBy === "years") {
            comparison =
              (a.depreciation?.years || 0) - (b.depreciation?.years || 0);
          }

          return sortOrder === "asc" ? comparison : -comparison;
        });

        setCategories(filtered);
        setCurrentPage(1); // 검색이나 정렬 변경 시 첫 페이지로 이동
      } catch (error) {
        console.error("카테고리 필터링 중 오류가 발생했습니다:", error);
      }
    };

    applyFiltersAndSort();
  }, [searchTerm, sortBy, sortOrder]);

  // 정렬 토글 함수
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // 페이지네이션 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(categories.length / itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 삭제 핸들러
  const handleDelete = async (id, name) => {
    if (window.confirm(`${name} 카테고리를 삭제하시겠습니까?`)) {
      try {
        // 실제 API 호출
        await dataService.deleteCategory(id);

        // 성공 시 목록 다시 불러오기
        const updatedCategories = await dataService.getCategories();
        setCategories(updatedCategories);

        // 성공 메시지 표시
        alert(`${name} 카테고리가 삭제되었습니다.`);
      } catch (error) {
        console.error("카테고리 삭제 중 오류가 발생했습니다:", error);
        alert("카테고리 삭제에 실패했습니다.");
      }
    }
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
    return <List className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <PageContainer title="자산 카테고리">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-muted-foreground">로딩 중...</span>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="자산 카테고리">
      <div className="space-y-6">
        {/* 요약 통계 */}
        <CategoryStats
          categoriesCount={categories.length}
          totalAssets={totalAssets}
          totalDepreciationYears={avgDepreciationYears}
        />

        {/* 검색 및 필터 */}
        <CategorySearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* 카테고리 없음 */}
        {categories.length === 0 && !loading && <CategoryEmptyState />}

        {/* 카테고리 목록 - 그리드 뷰 */}
        {viewMode === "grid" && categories.length > 0 && (
          <CategoryGrid
            categories={currentItems}
            renderCategoryIcon={renderCategoryIcon}
            formatResidualValue={formatResidualValue}
            handleDelete={handleDelete}
          />
        )}

        {/* 카테고리 목록 - 테이블 뷰 */}
        {viewMode === "list" && categories.length > 0 && (
          <CategoryTable
            categories={currentItems}
            renderCategoryIcon={renderCategoryIcon}
            formatResidualValue={formatResidualValue}
            handleDelete={handleDelete}
            sortBy={sortBy}
            sortOrder={sortOrder}
            handleSort={handleSort}
            loading={loading}
          />
        )}

        {/* 페이지네이션 */}
        {categories.length > 0 && totalPages > 1 && (
          <CategoryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            totalItems={categories.length}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default Categories;
