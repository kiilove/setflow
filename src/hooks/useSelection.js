"use client";

import { useState, useEffect } from "react";

/**
 * 항목 선택 관리를 위한 커스텀 훅
 * @param {Array} items - 선택 가능한 항목 배열
 * @param {string} idField - 항목의 고유 식별자 필드명 (기본값: 'id')
 * @returns {Object} 선택 관리 상태 및 함수
 */
export const useSelection = (items, idField = "id") => {
  const [selectedItems, setSelectedItems] = useState([]);

  // 항목 선택 핸들러
  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  // 전체 선택 핸들러
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(items.map((item) => item[idField]));
    } else {
      setSelectedItems([]);
    }
  };

  // 선택 항목 확인
  const isSelected = (itemId) => {
    return selectedItems.includes(itemId);
  };

  // 전체 선택 여부 확인
  const isAllSelected =
    items.length > 0 && selectedItems.length === items.length;

  // 일부 선택 여부 확인
  const isIndeterminate =
    selectedItems.length > 0 && selectedItems.length < items.length;

  // 페이지 변경 시 선택 초기화
  const resetSelection = () => {
    setSelectedItems([]);
  };

  // 항목이 변경되면 선택 항목 재설정
  useEffect(() => {
    // 현재 선택된 항목 중 유효한 항목만 유지
    const validIds = items.map((item) => item[idField]);
    setSelectedItems((prev) => prev.filter((id) => validIds.includes(id)));
  }, [items, idField]);

  return {
    selectedItems,
    handleSelectItem,
    handleSelectAll,
    isSelected,
    isAllSelected,
    isIndeterminate,
    resetSelection,
  };
};
