"use client";

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * CRUD 작업 관리를 위한 커스텀 훅
 * @param {Object} options - 훅 옵션
 * @param {Function} options.deleteItem - 항목 삭제 함수
 * @param {Function} options.deleteMultipleItems - 다중 항목 삭제 함수 (선택사항)
 * @param {Function} options.onSuccess - 성공 시 콜백 함수 (선택사항)
 * @param {string} options.basePath - 기본 경로 (선택사항)
 * @returns {Object} CRUD 작업 관리 상태 및 함수
 */
export const useCrudActions = ({
  deleteItem,
  deleteMultipleItems,
  onSuccess,
  basePath = "",
}) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemsToDelete, setItemsToDelete] = useState([]);

  // 단일 항목 삭제 확인 모달 표시
  const handleDeleteClick = useCallback((item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  }, []);

  // 다중 항목 삭제 확인 모달 표시
  const handleMultiDeleteClick = useCallback((items) => {
    setItemsToDelete(items);
    setShowDeleteConfirm(true);
  }, []);

  // 삭제 확인 모달 닫기
  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    setItemsToDelete([]);
    setDeleteError(null);
  }, []);

  // 삭제 실행
  const handleConfirmDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);

      if (itemToDelete) {
        // 단일 항목 삭제
        await deleteItem(itemToDelete);
      } else if (itemsToDelete.length > 0 && deleteMultipleItems) {
        // 다중 항목 삭제
        await deleteMultipleItems(itemsToDelete);
      }

      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setItemsToDelete([]);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setDeleteError(error.message || "삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  }, [itemToDelete, itemsToDelete, deleteItem, deleteMultipleItems, onSuccess]);

  // 항목 추가 페이지로 이동
  const handleAddClick = useCallback(() => {
    navigate(`${basePath}/add`);
  }, [navigate, basePath]);

  // 항목 편집 페이지로 이동
  const handleEditClick = useCallback(
    (itemId) => {
      navigate(`${basePath}/edit/${itemId}`);
    },
    [navigate, basePath]
  );

  // 항목 상세 페이지로 이동
  const handleViewClick = useCallback(
    (itemId) => {
      navigate(`${basePath}/detail/${itemId}`);
    },
    [navigate, basePath]
  );

  return {
    isDeleting,
    deleteError,
    showDeleteConfirm,
    handleDeleteClick,
    handleMultiDeleteClick,
    handleCancelDelete,
    handleConfirmDelete,
    handleAddClick,
    handleEditClick,
    handleViewClick,
  };
};
