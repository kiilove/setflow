"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/config";

export const useFirestoreSubcollection = (
  parentCollection,
  parentId,
  subcollection
) => {
  console.log("useFirestoreSubcollection initialized with:", {
    parentCollection,
    parentId,
    subcollection,
  });

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

  // 컬렉션 참조 생성 함수
  const getCollectionRef = useCallback(() => {
    if (!parentCollection || !parentId || !subcollection) {
      throw new Error("Invalid collection path parameters");
    }
    return collection(db, parentCollection, parentId, subcollection);
  }, [parentCollection, parentId, subcollection]);

  // 문서 참조 생성 함수
  const getDocumentRef = useCallback(
    (docId) => {
      if (!docId) {
        throw new Error("Document ID is required");
      }
      return doc(db, parentCollection, parentId, subcollection, docId);
    },
    [parentCollection, parentId, subcollection]
  );

  // 새 문서 추가 함수
  const addDocument = useCallback(
    async (data) => {
      console.log("addDocument called with data:", data);
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const colRef = getCollectionRef();
        console.log("Collection reference created:", colRef.path);

        const docData = {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        console.log("Document data prepared:", docData);

        const docRef = await addDoc(colRef, docData);
        console.log("Document added successfully:", docRef.id);

        setIsLoading(false);
        setSuccess(true);
        return { id: docRef.id, ...data };
      } catch (err) {
        console.error("Error adding document:", err);
        setError(err.message);
        setIsLoading(false);
        return null;
      }
    },
    [getCollectionRef]
  );

  // 문서 업데이트 함수
  const updateDocument = useCallback(
    async (docId, data) => {
      console.log("updateDocument called with:", { docId, data });
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const docRef = getDocumentRef(docId);
        console.log("Document reference created:", docRef.path);

        const updateData = {
          ...data,
          updatedAt: serverTimestamp(),
        };
        console.log("Update data prepared:", updateData);

        await setDoc(docRef, updateData, { merge: true });
        console.log("Document updated successfully");

        setIsLoading(false);
        setSuccess(true);
        return true;
      } catch (err) {
        console.error("Error updating document:", err);
        setError(err.message);
        setIsLoading(false);
        return false;
      }
    },
    [getDocumentRef]
  );

  // 문서 삭제 함수
  const deleteDocument = useCallback(
    async (docId) => {
      console.log("deleteDocument called with docId:", docId);
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const docRef = getDocumentRef(docId);
        console.log("Document reference created:", docRef.path);

        await deleteDoc(docRef);
        console.log("Document deleted successfully");

        setIsLoading(false);
        setSuccess(true);
        return true;
      } catch (err) {
        console.error("Error deleting document:", err);
        setError(err.message);
        setIsLoading(false);
        return false;
      }
    },
    [getDocumentRef]
  );

  // 단일 문서 조회 함수
  const getDocument = useCallback(
    async (docId) => {
      console.log("getDocument called with docId:", docId);
      setIsLoading(true);
      setError(null);

      try {
        const docRef = getDocumentRef(docId);
        console.log("Document reference created:", docRef.path);

        const docSnap = await getDoc(docRef);
        console.log("Document snapshot received:", docSnap.exists());

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          console.log("Document data:", data);
          setDocument(data);
          setIsLoading(false);
          return data;
        } else {
          console.log("Document does not exist");
          setDocument(null);
          setIsLoading(false);
          return null;
        }
      } catch (err) {
        console.error("Error getting document:", err);
        setError(err.message);
        setIsLoading(false);
        return null;
      }
    },
    [getDocumentRef]
  );

  // 컬렉션 조회 함수
  const getCollection = useCallback(
    async (conditions = [], sortOptions = ["updatedAt", "desc"]) => {
      console.log("getCollection called with:", { conditions, sortOptions });
      setIsLoading(true);
      setError(null);

      try {
        const colRef = getCollectionRef();
        console.log("Collection reference created:", colRef.path);

        let q = colRef;

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

        const snapshot = await getDocs(q);
        console.log("Query completed, snapshot size:", snapshot.size);

        const results = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });

        console.log("Processed documents:", results.length);
        setDocuments(results);
        setIsLoading(false);
        return results;
      } catch (err) {
        console.error("Error getting collection:", err);
        setError(err.message);
        setDocuments([]);
        setIsLoading(false);
        return [];
      }
    },
    [getCollectionRef]
  );

  // 문서 구독 함수
  const subscribeToDocument = useCallback(
    ({ docId, onUpdate }) => {
      console.log("subscribeToDocument called with docId:", docId);
      setError(null);

      try {
        const docRef = getDocumentRef(docId);
        console.log("Document reference created:", docRef.path);

        // 이전 구독이 있으면 해제
        if (unsubscribeRef.current) {
          console.log("Unsubscribing from previous subscription");
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }

        const unsubscribe = onSnapshot(
          docRef,
          (docSnap) => {
            console.log("Document snapshot received:", docSnap.exists());
            if (docSnap.exists()) {
              const data = { id: docSnap.id, ...docSnap.data() };
              console.log("Document data:", data);
              setDocument(data);
              if (onUpdate) onUpdate(data);
            } else {
              console.log("Document does not exist");
              setDocument(null);
              if (onUpdate) onUpdate(null);
            }
          },
          (err) => {
            console.error("Error in document subscription:", err);
            setError(err.message);
          }
        );

        unsubscribeRef.current = unsubscribe;
        return () => {
          console.log("Unsubscribing from document");
          unsubscribe();
          unsubscribeRef.current = null;
        };
      } catch (err) {
        console.error("Error setting up document subscription:", err);
        setError(err.message);
        return () => {};
      }
    },
    [getDocumentRef]
  );

  // 컬렉션 구독 함수
  const subscribeToCollection = useCallback(
    ({
      conditions = [],
      sortOptions = ["updatedAt", "desc"],
      onUpdate,
    } = {}) => {
      console.log("subscribeToCollection called with:", {
        conditions,
        sortOptions,
      });
      setError(null);

      try {
        const colRef = getCollectionRef();
        console.log("Collection reference created:", colRef.path);

        let q = colRef;

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
          console.log("Unsubscribing from previous subscription");
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }

        const unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            console.log("Query snapshot received, size:", querySnapshot.size);
            const results = [];
            querySnapshot.forEach((doc) => {
              results.push({ id: doc.id, ...doc.data() });
            });

            console.log("Processed documents:", results.length);
            setDocuments(results);
            if (onUpdate) onUpdate(results);
          },
          (err) => {
            console.error("Error in collection subscription:", err);
            setError(err.message);
          }
        );

        unsubscribeRef.current = unsubscribe;
        return () => {
          console.log("Unsubscribing from collection");
          unsubscribe();
          unsubscribeRef.current = null;
        };
      } catch (err) {
        console.error("Error setting up collection subscription:", err);
        setError(err.message);
        return () => {};
      }
    },
    [getCollectionRef]
  );

  // 일괄 작업 함수
  const batchOperation = useCallback(
    async (operations) => {
      console.log("batchOperation called with operations:", operations);
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const batch = writeBatch(db);
        console.log("Batch created");

        operations.forEach((op) => {
          if (op.type === "add") {
            const docRef = doc(getCollectionRef());
            batch.set(docRef, {
              ...op.data,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          } else if (op.type === "update") {
            const docRef = getDocumentRef(op.id);
            batch.update(docRef, {
              ...op.data,
              updatedAt: serverTimestamp(),
            });
          } else if (op.type === "delete") {
            const docRef = getDocumentRef(op.id);
            batch.delete(docRef);
          }
        });

        await batch.commit();
        console.log("Batch committed successfully");

        setIsLoading(false);
        setSuccess(true);
        return true;
      } catch (err) {
        console.error("Error in batch operation:", err);
        setError(err.message);
        setIsLoading(false);
        return false;
      }
    },
    [getCollectionRef, getDocumentRef]
  );

  // 컴포넌트 언마운트 시 구독 해제
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        console.log("Component unmounting: Unsubscribing from Firestore");
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  return {
    error,
    isLoading,
    success,
    document,
    documents,
    resetError,
    resetSuccess,
    addDocument,
    updateDocument,
    deleteDocument,
    getDocument,
    getCollection,
    subscribeToDocument,
    subscribeToCollection,
    batchOperation,
  };
};
