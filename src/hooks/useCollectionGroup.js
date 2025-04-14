"use client";

import { useState } from "react";
import {
  collectionGroup,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Firestore 컬렉션 그룹 쿼리를 위한 커스텀 훅
 * 여러 문서에 걸쳐 있는 동일한 이름의 서브컬렉션을 쿼리할 때 사용
 * @param {string} groupName - 컬렉션 그룹 이름 (서브컬렉션 이름)
 * @returns {Object} 컬렉션 그룹 쿼리 메서드와 상태
 */
export const useCollectionGroup = (groupName) => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 컬렉션 그룹의 모든 문서 가져오기
   * @param {Array} conditions - 필터 조건 배열 [[필드, 연산자, 값], ...]
   * @param {Array} orderByField - 정렬 필드와 방향 [필드명, 방향]
   * @returns {Promise<Array>} 문서 배열
   */
  const getDocuments = async (
    conditions = [],
    orderByField = ["createdAt", "desc"]
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const groupRef = collectionGroup(db, groupName);
      let q;

      // 필터 조건 적용
      if (conditions.length > 0) {
        const whereConditions = conditions.map((condition) =>
          where(condition[0], condition[1], condition[2])
        );
        q = query(
          groupRef,
          ...whereConditions,
          orderBy(orderByField[0], orderByField[1])
        );
      } else {
        q = query(groupRef, orderBy(orderByField[0], orderByField[1]));
      }

      const querySnapshot = await getDocs(q);

      const results = [];
      querySnapshot.forEach((doc) => {
        // 부모 경로 정보 추가
        const pathSegments = doc.ref.path.split("/");
        const parentCollection = pathSegments[0];
        const parentId = pathSegments[1];

        results.push({
          id: doc.id,
          ...doc.data(),
          _path: {
            parentCollection,
            parentId,
          },
        });
      });

      setDocuments(results);
      setIsLoading(false);
      return results;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * 컬렉션 그룹 실시간 구독
   * @param {Array} conditions - 필터 조건 배열 [[필드, 연산자, 값], ...]
   * @param {Array} orderByField - 정렬 필드와 방향 [필드명, 방향]
   * @returns {Function} 구독 해제 함수
   */
  const subscribeToCollectionGroup = (
    conditions = [],
    orderByField = ["createdAt", "desc"]
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const groupRef = collectionGroup(db, groupName);
      let q;

      // 필터 조건 적용
      if (conditions.length > 0) {
        const whereConditions = conditions.map((condition) =>
          where(condition[0], condition[1], condition[2])
        );
        q = query(
          groupRef,
          ...whereConditions,
          orderBy(orderByField[0], orderByField[1])
        );
      } else {
        q = query(groupRef, orderBy(orderByField[0], orderByField[1]));
      }

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const results = [];
          snapshot.forEach((doc) => {
            // 부모 경로 정보 추가
            const pathSegments = doc.ref.path.split("/");
            const parentCollection = pathSegments[0];
            const parentId = pathSegments[1];

            results.push({
              id: doc.id,
              ...doc.data(),
              _path: {
                parentCollection,
                parentId,
              },
            });
          });

          setDocuments(results);
          setIsLoading(false);
        },
        (err) => {
          setError(err.message);
          setIsLoading(false);
        }
      );

      return unsubscribe;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  return {
    documents,
    error,
    isLoading,
    getDocuments,
    subscribeToCollectionGroup,
  };
};
