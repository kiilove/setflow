"use client";

import { useState, useCallback } from "react";
import {
  runTransaction,
  writeBatch,
  serverTimestamp,
  doc,
  collection,
} from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Firestore 트랜잭션 처리를 위한 커스텀 훅
 * @returns {Object} 트랜잭션 관련 상태 및 함수
 */
export const useFirestoreTransaction = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 에러 초기화 함수
  const resetError = () => {
    setError(null);
  };

  // 성공 상태 초기화 함수
  const resetSuccess = () => {
    setSuccess(false);
  };

  /**
   * 트랜잭션 실행 함수
   * @param {Function} transactionFunction - 트랜잭션 함수
   * @returns {Promise<any>} 트랜잭션 결과
   */
  const executeTransaction = useCallback(async (transactionFunction) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await runTransaction(db, transactionFunction);
      setIsLoading(false);
      setSuccess(true);
      return result;
    } catch (err) {
      console.error("트랜잭션 실패:", err.message);
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  /**
   * 일괄 작업 트랜잭션
   * @param {Array} operations - 작업 배열
   * @returns {Promise<boolean>} 성공 여부
   */
  const batchTransaction = useCallback(async (operations) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const batch = writeBatch(db);
      const timestamp = serverTimestamp();

      operations.forEach((op) => {
        if (op.type === "add") {
          const docRef = op.id
            ? doc(db, op.collection, op.id)
            : doc(collection(db, op.collection));

          batch.set(docRef, {
            ...op.data,
            createdAt: op.data.createdAt || timestamp,
            updatedAt: op.data.updatedAt || timestamp,
          });
        } else if (op.type === "update") {
          const docRef = doc(db, op.collection, op.id);
          batch.update(docRef, {
            ...op.data,
            updatedAt: timestamp,
          });
        } else if (op.type === "delete") {
          const docRef = doc(db, op.collection, op.id);
          batch.delete(docRef);
        }
      });

      await batch.commit();
      setIsLoading(false);
      setSuccess(true);
      return true;
    } catch (err) {
      console.error("일괄 트랜잭션 오류:", err.message);
      setError(err.message);
      setIsLoading(false);
      return false;
    }
  }, []);

  return {
    error,
    isLoading,
    success,
    resetError,
    resetSuccess,
    executeTransaction,
    batchTransaction,
  };
};

export default useFirestoreTransaction;
