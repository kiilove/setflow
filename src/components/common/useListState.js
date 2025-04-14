"use client";

import { useState, useEffect, useMemo } from "react";

/**
 * 목록 페이지의 상태 관리 훅
 * @param {Object} options
 * @param {Array} options.data - 원본 데이터 배열
 * @param {Function} options.searchFilter - 검색 필터 함수 (item, searchTerm) => boolean
 * @param {Function} options.additionalFilter - 추가 필터 함수 (item) => boolean
 * @param {Function} options.sortFunction - 정렬 함수 (a, b, sortBy, sortOrder) => number
 * @param {string} options.defaultSortBy - 기본 정렬 컬럼
 * @param {string} options.defaultSortOrder - 기본 정렬 방향 ('asc' 또는 'desc')
 * @param {string} options.defaultViewMode - 기본 뷰 모드 ('table' 또는 'grid')
 * @param {number} options.defaultPageSize - 기본 페이지 크기
 * @returns {Object} 목록 상태 및 핸들러
 */
const useListState = ({
  data = [],
  searchFilter,
  additionalFilter,
  sortFunction,
  defaultSortBy = "name",
  defaultSortOrder = "asc",
  defaultViewMode = "table",
  defaultPageSize = 10,
}) => {
  // 기본 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);
  const [viewMode, setViewMode] = useState(defaultViewMode);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = searchFilter
        ? searchFilter(item, searchTerm)
        : true;
      const matchesAdditional = additionalFilter
        ? additionalFilter(item)
        : true;
      return matchesSearch && matchesAdditional;
    });
  }, [data, searchTerm, searchFilter, additionalFilter]);

  // 정렬된 데이터
  const sortedData = useMemo(() => {
    if (!sortFunction) return filteredData;
    return [...filteredData].sort((a, b) =>
      sortFunction(a, b, sortBy, sortOrder)
    );
  }, [filteredData, sortBy, sortOrder, sortFunction]);

  // 페이지네이션 계산
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // 현재 페이지에 해당하는 데이터
  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // 필터 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // 정렬 핸들러
  const handleSort = (column, direction) => {
    setSortBy(column);
    setSortOrder(direction);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // 페이지 변경 시 선택된 항목 초기화
    setSelectedItems([]);
  };

  // 페이지 크기 변경 핸들러
  const handlePageSizeChange = (e) => {
    const newPageSize = Number(e.target.value);
    setPageSize(newPageSize);
    setCurrentPage(1); // 페이지 크기 변경 시 첫 페이지로 이동
  };

  // 체크박스 선택 핸들러
  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  // 전체 선택 핸들러
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(currentPageData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  return {
    // 상태
    searchTerm,
    sortBy,
    sortOrder,
    viewMode,
    selectedItems,
    currentPage,
    pageSize,
    filteredData,
    sortedData,
    currentPageData,
    totalItems,
    totalPages,

    // 핸들러
    setSearchTerm,
    handleSort,
    setViewMode,
    handlePageChange,
    handlePageSizeChange,
    handleSelectItem,
    handleSelectAll,
    setSelectedItems,
  };
};

export default useListState;
