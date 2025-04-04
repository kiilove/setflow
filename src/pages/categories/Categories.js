"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import {
  getButtonVariantClass,
  getStatusColorClass,
} from "../../utils/themeUtils";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  List,
  Grid,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as Icons from "lucide-react";
import { Tooltip } from "antd";
import { dataService } from "../../data/mockData";

const Categories = () => {
  // 상태 관리
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid"); // grid 또는 list
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalFields, setTotalFields] = useState(0);
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
        const fields = data.reduce(
          (sum, cat) => sum + (cat.specFieldsCount || 0),
          0
        );
        setTotalAssets(assets);
        setTotalFields(fields);
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
          } else if (sortBy === "fields") {
            comparison = (a.specFieldsCount || 0) - (b.specFieldsCount || 0);
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
  const currentItems =
    viewMode === "grid"
      ? categories
      : categories.slice(indexOfFirstItem, indexOfLastItem);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              총 카테고리
            </h3>
            <p className="text-2xl font-bold">{categories.length}</p>
          </div>
          <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              총 자산
            </h3>
            <p className="text-2xl font-bold">{totalAssets}</p>
          </div>
          <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              총 사양 필드
            </h3>
            <p className="text-2xl font-bold">{totalFields}</p>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="카테고리 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-l-md border ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border"
                }`}
                aria-label="그리드 보기"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-r-md border ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border"
                }`}
                aria-label="리스트 보기"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <Link
              to="/categories/add"
              className={`${getButtonVariantClass(
                "primary"
              )} inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              <Plus className="mr-2 -ml-1 h-4 w-4" />
              카테고리 추가
            </Link>
          </div>
        </div>

        {/* 카테고리 없음 */}
        {categories.length === 0 && !loading && (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <List className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              등록된 카테고리가 없습니다
            </h3>
            <p className="text-muted-foreground mt-2 mb-4">
              새 카테고리를 추가하여 자산을 효과적으로 관리하세요.
            </p>
            <Link
              to="/categories/add"
              className={`${getButtonVariantClass(
                "primary"
              )} inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              <Plus className="mr-2 -ml-1 h-4 w-4" />
              카테고리 추가
            </Link>
          </div>
        )}

        {/* 카테고리 목록 - 그리드 뷰 */}
        {viewMode === "grid" && categories.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentItems.map((category) => (
              <div
                key={category.id}
                className="rounded-lg border border-border bg-card p-4 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-full ${
                      category.iconColor || "bg-gray-100"
                    } ${category.iconTextColor || "text-gray-500"}`}
                  >
                    {renderCategoryIcon(category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-foreground">
                        {category.name}
                      </h3>
                      <div className="flex space-x-1">
                        <Tooltip title="카테고리 편집">
                          <Link
                            to={`/categories/edit/${category.id}`}
                            className="text-primary hover:text-primary/80 p-1.5 rounded-md hover:bg-primary/5"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Tooltip>

                        <Tooltip title="카테고리 삭제">
                          <button
                            className="text-destructive hover:text-destructive/80 p-1.5 rounded-md hover:bg-destructive/5"
                            onClick={() =>
                              handleDelete(category.id, category.name)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                      {category.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(
                          "active"
                        )}`}
                      >
                        자산 {category.count || 0}개
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(
                          "pending"
                        )}`}
                      >
                        사양 필드 {category.specFieldsCount || 0}개
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(
                          "processing"
                        )}`}
                      >
                        감가상각 {category.depreciation?.years || 0}년/
                        {formatResidualValue(category.depreciation)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to={`/assets?category=${category.name}`}
                    className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${getButtonVariantClass(
                      "secondary"
                    )}`}
                  >
                    <List className="mr-1.5 h-3.5 w-3.5" />
                    자산 보기
                  </Link>
                  <Link
                    to={`/categories/template/${category.id}`}
                    className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${getButtonVariantClass(
                      "outline"
                    )}`}
                  >
                    <Edit className="mr-1.5 h-3.5 w-3.5" />
                    사양 템플릿
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {viewMode === "grid" && categories.length > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-border bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
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
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md border ${
                      currentPage === pageNum
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border bg-card text-foreground hover:bg-muted"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border border-border bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* 목록 뷰는 실제와 같이 구현 (기존 코드 활용) */}
      </div>
    </PageContainer>
  );
};

export default Categories;
