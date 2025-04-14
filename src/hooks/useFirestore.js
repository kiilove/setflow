"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
  collectionGroup,
} from "firebase/firestore";
import { db } from "../firebase/config";

export const useFirestore = (collectionName) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [document, setDocument] = useState(null);
  const [documents, setDocuments] = useState([]);

  // 구독 참조를 저장하기 위한 ref
  const unsubscribeRef = useRef(null);

  // 에러 초기화 함수
  const resetError = () => {
    setError(null);
  };

  // 성공 상태 초기화 함수
  const resetSuccess = () => {
    setSuccess(false);
  };

  // 문서 추가 함수
  const addDocument = useCallback(
    async (data) => {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const createdAt = serverTimestamp();
        const docRef = await addDoc(collection(db, collectionName), {
          ...data,
          createdAt,
        });
        setIsLoading(false);
        setSuccess(true);
        return { id: docRef.id, ...data };
      } catch (err) {
        console.error(`문서 추가 오류 (${collectionName}):`, err.message);
        setError(err.message);
        setIsLoading(false);
        return null;
      }
    },
    [collectionName]
  );

  // 문서 업데이트 함수
  const updateDocument = useCallback(
    async (id, data) => {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const updatedAt = serverTimestamp();
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, { ...data, updatedAt });
        setIsLoading(false);
        setSuccess(true);
        return true;
      } catch (err) {
        console.error(
          `문서 업데이트 오류 (${collectionName}/${id}):`,
          err.message
        );
        setError(err.message);
        setIsLoading(false);
        return false;
      }
    },
    [collectionName]
  );

  // 문서 삭제 함수
  const deleteDocument = useCallback(
    async (id) => {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
        setIsLoading(false);
        setSuccess(true);
        return true;
      } catch (err) {
        console.error(`문서 삭제 오류 (${collectionName}/${id}):`, err.message);
        setError(err.message);
        setIsLoading(false);
        return false;
      }
    },
    [collectionName]
  );

  // 여러 문서 삭제 함수
  const deleteMultipleDocuments = async (ids) => {
    try {
      // 병렬로 여러 문서 삭제
      await Promise.all(
        ids.map((id) => deleteDoc(doc(db, collectionName, id)))
      );
      return true;
    } catch (error) {
      console.error(`Error deleting documents from ${collectionName}:`, error);
      throw error;
    }
  };

  // 단일 문서 조회 함수
  const getDocument = useCallback(
    async (id) => {
      setIsLoading(true);
      setError(null);

      try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setDocument(data);
          setIsLoading(false);
          return data;
        } else {
          console.log(`문서가 존재하지 않음 (${collectionName}/${id})`);
          setDocument(null);
          setIsLoading(false);
          return null;
        }
      } catch (err) {
        console.error(`문서 조회 오류 (${collectionName}/${id}):`, err.message);
        setError(err.message);
        setIsLoading(false);
        return null;
      }
    },
    [collectionName]
  );

  // 컬렉션 조회 함수
  const getCollection = useCallback(
    async (conditions = [], sortOptions = ["createdAt", "desc"]) => {
      setIsLoading(true);
      setError(null);

      try {
        let q = collection(db, collectionName);

        // 조건 적용
        if (conditions.length > 0) {
          q = query(
            q,
            ...conditions.map((cond) =>
              where(cond.field, cond.operator, cond.value)
            )
          );
        }

        // 정렬 적용
        if (sortOptions) {
          q = query(q, orderBy(sortOptions[0], sortOptions[1]));
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
        console.error(`컬렉션 조회 오류 (${collectionName}):`, err.message);
        setError(err.message);
        setIsLoading(false);
        return [];
      }
    },
    [collectionName]
  );

  // 컬렉션 그룹 조회 함수
  const getCollectionGroup = useCallback(
    async (conditions = [], sortOptions = ["createdAt", "desc"]) => {
      setIsLoading(true);
      setError(null);

      try {
        let q = collectionGroup(db, collectionName);

        // 조건 적용
        if (conditions.length > 0) {
          q = query(
            q,
            ...conditions.map((cond) =>
              where(cond.field, cond.operator, cond.value)
            )
          );
        }

        // 정렬 적용
        if (sortOptions) {
          q = query(q, orderBy(sortOptions[0], sortOptions[1]));
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
        console.error(
          `컬렉션 그룹 조회 오류 (${collectionName}):`,
          err.message
        );
        setError(err.message);
        setIsLoading(false);
        return [];
      }
    },
    [collectionName]
  );

  // 문서 구독 함수
  const subscribeToDocument = useCallback(
    ({ id, onUpdate }) => {
      setError(null);

      try {
        console.log(`Firestore 문서 구독 시작: ${collectionName}/${id}`);
        const docRef = doc(db, collectionName, id);

        // 이전 구독이 있으면 해제
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }

        const unsubscribe = onSnapshot(
          docRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = { id: docSnap.id, ...docSnap.data() };
              setDocument(data);
              if (onUpdate) onUpdate(data);
            } else {
              console.log(`문서가 존재하지 않음 (${collectionName}/${id})`);
              setDocument(null);
              if (onUpdate) onUpdate(null);
            }
          },
          (err) => {
            console.error(
              `문서 구독 오류 (${collectionName}/${id}):`,
              err.message
            );
            setError(err.message);
          }
        );

        // 구독 해제 함수 저장
        unsubscribeRef.current = unsubscribe;

        return () => {
          console.log(`Firestore 문서 구독 해제: ${collectionName}/${id}`);
          unsubscribe();
          unsubscribeRef.current = null;
        };
      } catch (err) {
        console.error(
          `문서 구독 설정 오류 (${collectionName}/${id}):`,
          err.message
        );
        setError(err.message);
        return () => {};
      }
    },
    [collectionName]
  );

  // 컬렉션 구독 함수
  const subscribeToCollection = useCallback(
    ({
      conditions = [],
      sortOptions = ["createdAt", "desc"],
      onUpdate,
    } = {}) => {
      setError(null);

      try {
        const conditionsStr = JSON.stringify(conditions);
        console.log(
          `Firestore 구독 시작: ${collectionName}, 조건: ${conditionsStr}, 정렬: ${JSON.stringify(
            sortOptions
          )}`
        );

        let q = collection(db, collectionName);

        // 조건 적용
        if (conditions.length > 0) {
          q = query(
            q,
            ...conditions.map((cond) =>
              where(cond.field, cond.operator, cond.value)
            )
          );
        }

        // 정렬 적용
        if (sortOptions) {
          q = query(q, orderBy(sortOptions[0], sortOptions[1]));
        }

        // 이전 구독이 있으면 해제
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }

        const unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const results = [];
            querySnapshot.forEach((doc) => {
              results.push({ id: doc.id, ...doc.data() });
            });

            console.log(
              `Firestore 데이터 수신: ${collectionName}, 문서 수: ${results.length}`
            );
            setDocuments(results);
            if (onUpdate) onUpdate(results);
          },
          (err) => {
            console.error(`컬렉션 구독 오류 (${collectionName}):`, err.message);
            setError(err.message);
          }
        );

        // 구독 해제 함수 저장
        unsubscribeRef.current = unsubscribe;

        return () => {
          console.log(
            `Firestore 구독 해제: ${collectionName}, 조건: ${conditionsStr}`
          );
          unsubscribe();
          unsubscribeRef.current = null;
        };
      } catch (err) {
        console.error(
          `컬렉션 구독 설정 오류 (${collectionName}):`,
          err.message
        );
        setError(err.message);
        return () => {};
      }
    },
    [collectionName]
  );

  // 컬렉션 그룹 구독 함수
  const subscribeToCollectionGroup = useCallback(
    ({
      conditions = [],
      sortOptions = ["createdAt", "desc"],
      onUpdate,
    } = {}) => {
      setError(null);

      try {
        const conditionsStr = JSON.stringify(conditions);
        console.log(
          `Firestore 컬렉션 그룹 구독 시작: ${collectionName}, 조건: ${conditionsStr}`
        );

        let q = collectionGroup(db, collectionName);

        // 조건 적용
        if (conditions.length > 0) {
          q = query(
            q,
            ...conditions.map((cond) =>
              where(cond.field, cond.operator, cond.value)
            )
          );
        }

        // 정렬 적용
        if (sortOptions) {
          q = query(q, orderBy(sortOptions[0], sortOptions[1]));
        }

        // 이전 구독이 있으면 해제
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }

        const unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const results = [];
            querySnapshot.forEach((doc) => {
              results.push({ id: doc.id, ...doc.data() });
            });

            console.log(
              `Firestore 컬렉션 그룹 데이터 수신: ${collectionName}, 문서 수: ${results.length}`
            );
            setDocuments(results);
            if (onUpdate) onUpdate(results);
          },
          (err) => {
            console.error(
              `컬렉션 그룹 구독 오류 (${collectionName}):`,
              err.message
            );
            setError(err.message);
          }
        );

        // 구독 해제 함수 저장
        unsubscribeRef.current = unsubscribe;

        return () => {
          console.log(
            `Firestore 컬렉션 그룹 구독 해제: ${collectionName}, 조건: ${conditionsStr}`
          );
          unsubscribe();
          unsubscribeRef.current = null;
        };
      } catch (err) {
        console.error(
          `컬렉션 그룹 구독 설정 오류 (${collectionName}):`,
          err.message
        );
        setError(err.message);
        return () => {};
      }
    },
    [collectionName]
  );

  // 일괄 작업 함수
  const batchOperation = useCallback(
    async (operations) => {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const batch = writeBatch(db);

        operations.forEach((op) => {
          if (op.type === "add") {
            const docRef = doc(collection(db, op.collection || collectionName));
            batch.set(docRef, { ...op.data, createdAt: serverTimestamp() });
          } else if (op.type === "update") {
            const docRef = doc(db, op.collection || collectionName, op.id);
            batch.update(docRef, { ...op.data, updatedAt: serverTimestamp() });
          } else if (op.type === "delete") {
            const docRef = doc(db, op.collection || collectionName, op.id);
            batch.delete(docRef);
          }
        });

        await batch.commit();
        setIsLoading(false);
        setSuccess(true);
        return true;
      } catch (err) {
        console.error(`일괄 작업 오류:`, err.message);
        setError(err.message);
        setIsLoading(false);
        return false;
      }
    },
    [collectionName]
  );

  // 컴포넌트 언마운트 시 구독 해제
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        console.log(
          `컴포넌트 언마운트: Firestore 구독 해제 (${collectionName})`
        );
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [collectionName]);

  return {
    error,
    isLoading,
    success,
    document,
    documents,
    resetError,
    resetSuccess,
    addDocument,
    getDocument,
    updateDocument,
    deleteDocument,
    deleteMultipleDocuments,
    getCollection,
    getCollectionGroup,
    subscribeToDocument,
    subscribeToCollection,
    subscribeToCollectionGroup,
    batchOperation,
  };
};
