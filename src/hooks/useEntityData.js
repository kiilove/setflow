"use client";

import { useState, useEffect, useCallback } from "react";
import { useFirestore } from "../hooks/useFirestore";
import { useMessageContext } from "../context/MessageContext";

/**
 * 엔티티 데이터 관리 커스텀 훅
 * 데이터 로딩, 추가, 수정, 삭제 등의 CRUD 작업을 처리합니다.
 */
const useEntityData = (collectionName, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getCollection, addDocument, updateDocument, deleteDocument } =
    useFirestore(collectionName);
  const { showError } = useMessageContext();

  // 데이터 로드
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedData = await getCollection();
      setData(fetchedData);

      // 데이터 로드 후 추가 처리가 필요한 경우
      if (options.onDataLoaded) {
        options.onDataLoaded(fetchedData);
      }

      return fetchedData;
    } catch (error) {
      console.error(
        `${collectionName} 데이터를 불러오는 중 오류가 발생했습니다:`,
        error
      );
      showError(
        "데이터 로드 오류",
        `${collectionName} 데이터를 불러오는 중 오류가 발생했습니다.`
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, [collectionName, getCollection, showError, options]);

  // 초기 데이터 로드
  useEffect(() => {
    // 컴포넌트 마운트 시 한 번만 실행
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // fetchData를 의존성 배열에서 제거

  // 항목 삭제
  const deleteItem = async (id, name) => {
    try {
      await deleteDocument(id);
      setData(data.filter((item) => item.id !== id));
      return true;
    } catch (error) {
      console.error(`${collectionName} 삭제 중 오류 발생:`, error);
      throw error;
    }
  };

  // 여러 항목 삭제
  const deleteMultipleItems = async (ids) => {
    try {
      await Promise.all(ids.map((id) => deleteDocument(id)));
      setData(data.filter((item) => !ids.includes(item.id)));
      return true;
    } catch (error) {
      console.error(`${collectionName} 일괄 삭제 중 오류 발생:`, error);
      throw error;
    }
  };

  // 항목 추가
  const addItem = async (item) => {
    try {
      const newItemId = await addDocument(item);
      const newItem = { ...item, id: newItemId };
      setData([...data, newItem]);
      return newItemId;
    } catch (error) {
      console.error(`${collectionName} 추가 중 오류 발생:`, error);
      throw error;
    }
  };

  // 항목 수정
  const updateItem = async (id, item) => {
    try {
      await updateDocument(id, item);
      setData(
        data.map((existingItem) =>
          existingItem.id === id ? { ...existingItem, ...item } : existingItem
        )
      );
      return true;
    } catch (error) {
      console.error(`${collectionName} 수정 중 오류 발생:`, error);
      throw error;
    }
  };

  return {
    data,
    loading,
    setLoading,
    fetchData,
    deleteItem,
    deleteMultipleItems,
    addItem,
    updateItem,
  };
};

export default useEntityData;
