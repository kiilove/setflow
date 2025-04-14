"use client";

import { useState } from "react";
import { writeBatch, doc } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Firestore 일괄 작업을 위한 커스텀 훅
 * 여러 문서를 한 번에 추가, 업데이트, 삭제할 때 사용
 * @returns {Object} 일괄 작업 메서드와 상태
 */
export const useBatchOperations = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 일괄 작업 실행
   * @param {Function} batchCallback - 일괄 작업 콜백 함수
   * @returns {Promise<void>}
   */
  const performBatchOperation = async (batchCallback) => {
    setIsLoading(true);
    setError(null);

    try {
      const batch = writeBatch(db);
      await batchCallback(batch);
      await batch.commit();
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * 여러 문서 일괄 추가
   * @param {string} collectionName - 컬렉션 이름
   * @param {Array} documents - 추가할 문서 배열 [{id: 'id1', data: {...}}, ...]
   * @returns {Promise<void>}
   */
  const batchAddDocuments = async (collectionName, documents) => {
    await performBatchOperation(async (batch) => {
      const timestamp = new Date();

      documents.forEach((document) => {
        const docRef = doc(db, collectionName, document.id);
        batch.set(docRef, {
          ...document.data,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      });
    });
  };

  /**
   * 여러 문서 일괄 업데이트
   * @param {string} collectionName - 컬렉션 이름
   * @param {Array} documents - 업데이트할 문서 배열 [{id: 'id1', data: {...}}, ...]
   * @returns {Promise<void>}
   */
  const batchUpdateDocuments = async (collectionName, documents) => {
    await performBatchOperation(async (batch) => {
      const timestamp = new Date();

      documents.forEach((document) => {
        const docRef = doc(db, collectionName, document.id);
        batch.update(docRef, {
          ...document.data,
          updatedAt: timestamp,
        });
      });
    });
  };

  /**
   * 여러 문서 일괄 삭제
   * @param {string} collectionName - 컬렉션 이름
   * @param {Array} documentIds - 삭제할 문서 ID 배열
   * @returns {Promise<void>}
   */
  const batchDeleteDocuments = async (collectionName, documentIds) => {
    await performBatchOperation(async (batch) => {
      documentIds.forEach((id) => {
        const docRef = doc(db, collectionName, id);
        batch.delete(docRef);
      });
    });
  };

  /**
   * 서브컬렉션 문서 일괄 작업
   * @param {string} parentCollection - 부모 컬렉션 이름
   * @param {string} parentId - 부모 문서 ID
   * @param {string} subcollectionName - 서브컬렉션 이름
   * @param {Array} operations - 작업 배열 [{type: 'add|update|delete', id: 'id1', data: {...}}, ...]
   * @returns {Promise<void>}
   */
  const batchSubcollectionOperations = async (
    parentCollection,
    parentId,
    subcollectionName,
    operations
  ) => {
    await performBatchOperation(async (batch) => {
      const timestamp = new Date();

      operations.forEach((operation) => {
        const docRef = doc(
          db,
          parentCollection,
          parentId,
          subcollectionName,
          operation.id
        );

        switch (operation.type) {
          case "add":
            batch.set(docRef, {
              ...operation.data,
              createdAt: timestamp,
              updatedAt: timestamp,
            });
            break;
          case "update":
            batch.update(docRef, {
              ...operation.data,
              updatedAt: timestamp,
            });
            break;
          case "delete":
            batch.delete(docRef);
            break;
          default:
            throw new Error(`알 수 없는 작업 유형: ${operation.type}`);
        }
      });
    });
  };

  return {
    error,
    isLoading,
    batchAddDocuments,
    batchUpdateDocuments,
    batchDeleteDocuments,
    batchSubcollectionOperations,
    performBatchOperation,
  };
};
