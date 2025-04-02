"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaList,
  FaSearch,
  FaDesktop,
  FaLaptop,
  FaMobile,
  FaKeyboard,
  FaPrint,
  FaServer,
  FaNetworkWired,
  FaFileCode,
  FaChair,
  FaQuestion,
  FaTv,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";
import specTemplates from "../../data/specTemplates";

const Categories = () => {
  // 카테고리 데이터
  const categoriesData = [
    {
      id: 1,
      name: "데스크탑",
      count: 28,
      description: "데스크톱 컴퓨터",
      specFieldsCount: specTemplates["데스크탑"]?.length || 0,
      icon: <FaDesktop className="h-6 w-6" />,
      color: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-500 dark:text-blue-400",
      borderColor: "border-blue-200 dark:border-blue-800",
      depreciation: {
        method: "straight-line",
        years: 4,
        residualValueType: "percentage", // percentage 또는 fixed
        residualValue: 10, // 퍼센트 또는 원
      },
    },
    {
      id: 2,
      name: "노트북",
      count: 42,
      description: "노트북 컴퓨터",
      specFieldsCount: specTemplates["노트북"]?.length || 0,
      icon: <FaLaptop className="h-6 w-6" />,
      color: "bg-indigo-50 dark:bg-indigo-900/20",
      iconColor: "text-indigo-500 dark:text-indigo-400",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      depreciation: {
        method: "straight-line",
        years: 3,
        residualValueType: "fixed",
        residualValue: 1000,
      },
    },
    {
      id: 3,
      name: "모니터",
      count: 35,
      description: "모니터 및 디스플레이",
      specFieldsCount: specTemplates["모니터"]?.length || 0,
      icon: <FaTv className="h-6 w-6" />,
      color: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-500 dark:text-purple-400",
      borderColor: "border-purple-200 dark:border-purple-800",
      depreciation: {
        method: "straight-line",
        years: 5,
        residualValueType: "percentage",
        residualValue: 5,
      },
    },
    {
      id: 4,
      name: "모바일기기",
      count: 32,
      description: "태블릿, 스마트폰 등",
      specFieldsCount: specTemplates["모바일기기"]?.length || 0,
      icon: <FaMobile className="h-6 w-6" />,
      color: "bg-pink-50 dark:bg-pink-900/20",
      iconColor: "text-pink-500 dark:text-pink-400",
      borderColor: "border-pink-200 dark:border-pink-800",
      depreciation: {
        method: "straight-line",
        years: 2,
        residualValueType: "fixed",
        residualValue: 1000,
      },
    },
    {
      id: 5,
      name: "주변기기",
      count: 78,
      description: "키보드, 마우스 등",
      specFieldsCount: specTemplates["주변기기"]?.length || 0,
      icon: <FaKeyboard className="h-6 w-6" />,
      color: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-500 dark:text-green-400",
      borderColor: "border-green-200 dark:border-green-800",
      depreciation: {
        method: "straight-line",
        years: 3,
        residualValueType: "percentage",
        residualValue: 10,
      },
    },
    {
      id: 6,
      name: "사무기기",
      count: 24,
      description: "프린터, 스캐너, 복사기 등",
      specFieldsCount: specTemplates["사무기기"]?.length || 0,
      icon: <FaPrint className="h-6 w-6" />,
      color: "bg-yellow-50 dark:bg-yellow-900/20",
      iconColor: "text-yellow-500 dark:text-yellow-400",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      depreciation: {
        method: "straight-line",
        years: 5,
        residualValueType: "fixed",
        residualValue: 1000,
      },
    },
    {
      id: 7,
      name: "서버",
      count: 15,
      description: "서버 장비",
      specFieldsCount: specTemplates["서버"]?.length || 0,
      icon: <FaServer className="h-6 w-6" />,
      color: "bg-red-50 dark:bg-red-900/20",
      iconColor: "text-red-500 dark:text-red-400",
      borderColor: "border-red-200 dark:border-red-800",
      depreciation: {
        method: "straight-line",
        years: 4,
        residualValueType: "percentage",
        residualValue: 12,
      },
    },
    {
      id: 8,
      name: "네트워크장비",
      count: 18,
      description: "라우터, 스위치, 액세스 포인트 등",
      specFieldsCount: specTemplates["네트워크장비"]?.length || 0,
      icon: <FaNetworkWired className="h-6 w-6" />,
      color: "bg-cyan-50 dark:bg-cyan-900/20",
      iconColor: "text-cyan-500 dark:text-cyan-400",
      borderColor: "border-cyan-200 dark:border-cyan-800",
      depreciation: {
        method: "straight-line",
        years: 3,
        residualValueType: "fixed",
        residualValue: 1000,
      },
    },
    {
      id: 9,
      name: "소프트웨어",
      count: 56,
      description: "운영체제, 응용프로그램, 라이센스 등",
      specFieldsCount: specTemplates["소프트웨어"]?.length || 0,
      icon: <FaFileCode className="h-6 w-6" />,
      color: "bg-teal-50 dark:bg-teal-900/20",
      iconColor: "text-teal-500 dark:text-teal-400",
      borderColor: "border-teal-200 dark:border-teal-800",
      depreciation: {
        method: "straight-line",
        years: 1,
        residualValueType: "fixed",
        residualValue: 0,
      },
    },
    {
      id: 10,
      name: "가구",
      count: 37,
      description: "책상, 의자, 캐비닛 등",
      specFieldsCount: specTemplates["가구"]?.length || 0,
      icon: <FaChair className="h-6 w-6" />,
      color: "bg-amber-50 dark:bg-amber-900/20",
      iconColor: "text-amber-500 dark:text-amber-400",
      borderColor: "border-amber-200 dark:border-amber-800",
      depreciation: {
        method: "straight-line",
        years: 7,
        residualValueType: "percentage",
        residualValue: 2,
      },
    },
    {
      id: 11,
      name: "기타",
      count: 12,
      description: "기타 자산",
      specFieldsCount: specTemplates["기타"]?.length || 0,
      icon: <FaQuestion className="h-6 w-6" />,
      color: "bg-gray-50 dark:bg-gray-800/40",
      iconColor: "text-gray-500 dark:text-gray-400",
      borderColor: "border-gray-200 dark:border-gray-700",
      depreciation: {
        method: "straight-line",
        years: 6,
        residualValueType: "fixed",
        residualValue: 1000,
      },
    },
  ];

  // 상태 관리
  const [categories, setCategories] = useState(categoriesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid"); // grid 또는 list
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalFields, setTotalFields] = useState(0);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 검색 및 정렬 적용
  useEffect(() => {
    let filtered = [...categoriesData];

    // 검색어 적용
    if (searchTerm) {
      filtered = filtered.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 정렬 적용
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "count") {
        comparison = a.count - b.count;
      } else if (sortBy === "fields") {
        comparison = a.specFieldsCount - b.specFieldsCount;
      } else if (sortBy === "years") {
        comparison = a.depreciation.years - b.depreciation.years;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setCategories(filtered);
    setCurrentPage(1); // 검색이나 정렬 변경 시 첫 페이지로 이동

    // 통계 계산
    const assets = categoriesData.reduce((sum, cat) => sum + cat.count, 0);
    const fields = categoriesData.reduce(
      (sum, cat) => sum + cat.specFieldsCount,
      0
    );
    setTotalAssets(assets);
    setTotalFields(fields);
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

  // 잔존가치 표시 형식
  const formatResidualValue = (depreciation) => {
    if (depreciation.residualValueType === "percentage") {
      return `${depreciation.residualValue}%`;
    } else {
      return `${depreciation.residualValue.toLocaleString()}원`;
    }
  };

  return (
    <PageContainer title="자산 카테고리">
      {/* 요약 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            총 카테고리
          </h3>
          <p className="text-2xl font-bold">{categories.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            총 자산
          </h3>
          <p className="text-2xl font-bold">{totalAssets}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            총 사양 필드
          </h3>
          <p className="text-2xl font-bold">{totalFields}</p>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="w-full md:w-auto flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="카테고리 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
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
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
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
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>

          <Link
            to="/categories/add"
            className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
              "primary"
            )}`}
          >
            <FaPlus className="h-4 w-4" />
            <span>카테고리 추가</span>
          </Link>
        </div>
      </div>

      {/* 카테고리 목록 - 그리드 뷰 */}
      {viewMode === "grid" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`rounded-lg border ${category.borderColor} bg-card p-4 shadow-md transition-all duration-200 hover:shadow-lg`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-full ${category.color} ${category.iconColor}`}
                >
                  {category.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-foreground">
                      {category.name}
                    </h3>
                    <div className="flex space-x-1">
                      <Link
                        to={`/categories/edit/${category.id}`}
                        className="text-primary hover:text-primary/80 p-1.5 rounded-md hover:bg-primary/5"
                        title="카테고리 편집"
                      >
                        <FaEdit className="h-4 w-4" />
                      </Link>
                      <button
                        className="text-destructive hover:text-destructive/80 p-1.5 rounded-md hover:bg-destructive/5"
                        title="카테고리 삭제"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">
                    {category.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      자산 {category.count}개
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                      사양 필드 {category.specFieldsCount}개
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                      감가상각 {category.depreciation.years}년/
                      {formatResidualValue(category.depreciation)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={`/assets?category=${category.name}`}
                  className={`flex items-center gap-1 rounded-md px-3 py-1 text-sm ${getButtonVariantClass(
                    "secondary"
                  )}`}
                >
                  <FaList className="h-3 w-3" />
                  자산 보기
                </Link>
                <Link
                  to={`/categories/template/${category.id}`}
                  className={`flex items-center gap-1 rounded-md px-3 py-1 text-sm ${getButtonVariantClass(
                    "outline"
                  )}`}
                >
                  <FaEdit className="h-3 w-3" />
                  사양 템플릿
                </Link>
                <Link
                  to={`/categories/edit/${category.id}`}
                  className={`flex items-center gap-1 rounded-md px-3 py-1 text-sm ${getButtonVariantClass(
                    "ghost"
                  )}`}
                >
                  <FaEdit className="h-3 w-3" />
                  편집
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 카테고리 목록 - 리스트 뷰 */}
      {viewMode === "list" && (
        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th
                    onClick={() => handleSort("name")}
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                  >
                    <div className="flex items-center">
                      카테고리
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
                    설명
                  </th>
                  <th
                    onClick={() => handleSort("count")}
                    className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                  >
                    <div className="flex items-center justify-center">
                      자산 수
                      {sortBy === "count" && (
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
                    onClick={() => handleSort("fields")}
                    className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                  >
                    <div className="flex items-center justify-center">
                      사양 필드
                      {sortBy === "fields" && (
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
                    onClick={() => handleSort("years")}
                    className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                  >
                    <div className="flex items-center justify-center">
                      감가상각
                      {sortBy === "years" && (
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentItems.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-10 w-10 rounded-full ${category.color} ${category.iconColor} flex items-center justify-center`}
                        >
                          {category.icon}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">
                            {category.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-muted-foreground">
                        {category.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {category.count}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        {category.specFieldsCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        {category.depreciation.years}년/
                        {formatResidualValue(category.depreciation)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/assets?category=${category.name}`}
                          className="text-primary hover:text-primary/80"
                        >
                          자산 보기
                        </Link>
                        <Link
                          to={`/categories/template/${category.id}`}
                          className="text-secondary hover:text-secondary/80"
                        >
                          템플릿
                        </Link>
                        <Link
                          to={`/categories/edit/${category.id}`}
                          className="text-primary hover:text-primary/80"
                        >
                          편집
                        </Link>
                        <button className="text-destructive hover:text-destructive/80">
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {currentItems.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-sm text-center text-muted-foreground"
                    >
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {viewMode === "list" && categories.length > 0 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-border">
              <div className="text-sm text-muted-foreground">
                전체 {categories.length}개 중 {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, categories.length)}개 표시
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md border border-border bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // 현재 페이지를 중심으로 최대 5개의 페이지 버튼 표시
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
                  <FaChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 검색 결과가 없을 때 */}
      {categories.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <FaSearch className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">
            검색 결과가 없습니다
          </h3>
          <p className="text-muted-foreground mt-2">
            다른 검색어를 입력하거나 필터를 조정해보세요.
          </p>
        </div>
      )}
    </PageContainer>
  );
};

export default Categories;
