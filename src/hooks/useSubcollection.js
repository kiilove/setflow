"use client";

import { useState, useCallback } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Firestore 서브컬렉션 CRUD 작업을 위한 커스텀 훅
 * @param {string} parentCollection - 부모 컬렉션 이름
 * @param {string} parentId - 부모 문서 ID
 * @param {string} subcollectionName - 서브컬렉션 이름
 * @returns {Object} 서브컬렉션 CRUD 메서드와 상태
 */
export const useSubcollection = (
  parentCollection,
  parentId,
  subcollectionName
) => {
  const [documents, setDocuments] = useState([]);
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 서브컬렉션 참조 생성
  const getSubcollectionRef = useCallback(() => {
    return collection(db, parentCollection, parentId, subcollectionName);
  }, [parentCollection, parentId, subcollectionName]);

  /**
   * 서브컬렉션에 문서 추가
   * @param {Object} data - 추가할 문서 데이터
   * @returns {Promise<string>} 생성된 문서 ID
   */
  const addDocument = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const subcollectionRef = getSubcollectionRef();
      const timestamp = new Date();
      const docRef = await addDoc(subcollectionRef, {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      setIsLoading(false);
      return docRef.id;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * 서브컬렉션에서 문서 ID로 문서 가져오기
   * @param {string} id - 문서 ID
   * @returns {Promise<Object>} 문서 데이터
   */
  const getDocument = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const docRef = doc(db, parentCollection, parentId, subcollectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDocument({ id: docSnap.id, ...docSnap.data() });
        setIsLoading(false);
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        setDocument(null);
        setError("문서가 존재하지 않습니다.");
        setIsLoading(false);
        return null;
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * 서브컬렉션 문서 업데이트
   * @param {string} id - 문서 ID
   * @param {Object} data - 업데이트할 데이터
   * @returns {Promise<void>}
   */
  const updateDocument = async (id, data) => {
    setIsLoading(true);
    setError(null);

    try {
      const docRef = doc(db, parentCollection, parentId, subcollectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      });
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * 서브컬렉션 문서 삭제
   * @param {string} id - 문서 ID
   * @returns {Promise<void>}
   */
  const deleteDocument = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const docRef = doc(db, parentCollection, parentId, subcollectionName, id);
      await deleteDoc(docRef);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * 서브컬렉션의 모든 문서 가져오기
   * @param {Array} orderByField - 정렬 필드와 방향 [필드명, 방향]
   * @returns {Promise<Array>} 문서 배열
   */
  const getDocuments = async (orderByField = ["createdAt", "desc"]) => {
    setIsLoading(true);
    setError(null);

    try {
      const subcollectionRef = getSubcollectionRef();
      const q = query(
        subcollectionRef,
        orderBy(orderByField[0], orderByField[1])
      );
      const querySnapshot = await getDocs(q);

      const results = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
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
   * 서브컬렉션의 필터링된 문서 가져오기
   * @param {Array} conditions - 필터 조건 배열 [[필드, 연산자, 값], ...]
   * @param {Array} orderByField - 정렬 필드와 방향 [필드명, 방향]
   * @returns {Promise<Array>} 필터링된 문서 배열
   */
  const getFilteredDocuments = async (
    conditions = [],
    orderByField = ["createdAt", "desc"]
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const subcollectionRef = getSubcollectionRef();
      let q;

      // 필터 조건 적용
      if (conditions.length > 0) {
        const whereConditions = conditions.map((condition) =>
          where(condition[0], condition[1], condition[2])
        );
        q = query(
          subcollectionRef,
          ...whereConditions,
          orderBy(orderByField[0], orderByField[1])
        );
      } else {
        q = query(subcollectionRef, orderBy(orderByField[0], orderByField[1]));
      }

      const querySnapshot = await getDocs(q);

      const results = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
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
   * 서브컬렉션 실시간 구독
   * @param {Array} conditions - 필터 조건 배열 [[필드, 연산자, 값], ...]
   * @param {Array} orderByField - 정렬 필드와 방향 [필드명, 방향]
   * @returns {Function} 구독 해제 함수
   */
  const subscribeToCollection = (
    conditions = [],
    orderByField = ["createdAt", "desc"]
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const subcollectionRef = getSubcollectionRef();
      let q;

      // 필터 조건 적용
      if (conditions.length > 0) {
        const whereConditions = conditions.map((condition) =>
          where(condition[0], condition[1], condition[2])
        );
        q = query(
          subcollectionRef,
          ...whereConditions,
          orderBy(orderByField[0], orderByField[1])
        );
      } else {
        q = query(subcollectionRef, orderBy(orderByField[0], orderByField[1]));
      }

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const results = [];
          snapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
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

  /**
   * 서브컬렉션의 단일 문서 실시간 구독
   * @param {string} id - 문서 ID
   * @returns {Function} 구독 해제 함수
   */
  const subscribeToDocument = (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const docRef = doc(db, parentCollection, parentId, subcollectionName, id);

      const unsubscribe = onSnapshot(
        docRef,
        (doc) => {
          if (doc.exists()) {
            setDocument({ id: doc.id, ...doc.data() });
          } else {
            setDocument(null);
            setError("문서가 존재하지 않습니다.");
          }
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
    document,
    error,
    isLoading,
    addDocument,
    getDocument,
    updateDocument,
    deleteDocument,
    getDocuments,
    getFilteredDocuments,
    subscribeToCollection,
    subscribeToDocument,
  };
};
