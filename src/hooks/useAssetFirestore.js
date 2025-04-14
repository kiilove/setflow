"use client";

import { useState } from "react";
import { doc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import useFirestore from "./useFirestore";
import useFirestoreTransaction from "./useFirestoreTransaction";

/**
 * 자산 관리 시스템을 위한 특화된 Firestore 훅
 * @returns {Object} 자산 관리 관련 Firestore 함수
 */
const useAssetFirestore = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const { executeTransaction } = useFirestoreTransaction();
  const { getDocument, getCollection, addDocument } = useFirestore("assets");

  /**
   * 자산 생성
   * @param {Object} assetData - 자산 데이터
   * @returns {Promise<Object>} - 생성된 자산 정보
   */
  const createAsset = async (assetData) => {
    setIsPending(true);
    setError(null);

    try {
      // 자산 및 이력 문서의 참조 생성
      const assetRef = doc(collection(db, "assets"));
      const assetId = assetRef.id;
      const historyRef = doc(collection(db, "assetHistory"));

      // 트랜잭션 실행
      const result = await executeTransaction(async (transaction) => {
        // 현재 시간 설정
        const timestamp = serverTimestamp();

        // 자산 데이터 준비
        const completeAssetData = {
          ...assetData,
          id: assetId,
          status: assetData.status || "사용가능",
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        // 자산 이력 데이터 준비
        const historyData = {
          id: historyRef.id,
          assetId: assetId,
          assetName: assetData.name,
          type: "구매",
          date: timestamp,
          description: `자산 "${assetData.name}" 구매`,
          user: "시스템", // 실제 구현에서는 현재 로그인한 사용자 정보 사용
          details: {
            purchasePrice: assetData.purchasePrice,
            supplier: assetData.supplier,
          },
          createdAt: timestamp,
        };

        // 트랜잭션에 문서 생성 작업 추가
        transaction.set(assetRef, completeAssetData);
        transaction.set(historyRef, historyData);

        return {
          assetId,
          assetData: completeAssetData,
          historyId: historyRef.id,
        };
      });

      setIsPending(false);
      return result;
    } catch (err) {
      console.error("자산 생성 중 오류 발생:", err);
      setError(`자산 생성 실패: ${err.message}`);
      setIsPending(false);
      throw err;
    }
  };

  /**
   * 자산 생성 및 할당 (트랜잭션)
   * @param {Object} assetData - 자산 데이터
   * @param {Object} assignmentData - 할당 데이터
   * @returns {Promise<Object>} - 생성된 자산 및 할당 정보
   */
  const createAssetWithAssignment = async (assetData, assignmentData) => {
    setIsPending(true);
    setError(null);

    try {
      // 자산 및 할당 문서의 참조 생성
      const assetRef = doc(collection(db, "assets"));
      const assetId = assetRef.id;
      const assignmentRef = doc(collection(db, "assignments"));
      const assignmentId = assignmentRef.id;

      // 트랜잭션 실행
      const result = await executeTransaction(async (transaction) => {
        // 현재 시간 설정
        const timestamp = serverTimestamp();

        // 자산 데이터에 ID와 현재 할당 ID 추가
        const completeAssetData = {
          ...assetData,
          id: assetId,
          currentAssignmentId: assignmentId,
          status: "사용중", // 할당되었으므로 상태 변경
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        // 할당 데이터에 ID와 자산 ID 추가
        const completeAssignmentData = {
          ...assignmentData,
          id: assignmentId,
          assetId: assetId,
          assetName: assetData.name,
          status: "active",
          startDate: timestamp,
          endDate: null,
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        // 자산 이력 데이터 준비
        const purchaseHistoryRef = doc(collection(db, "assetHistory"));
        const purchaseHistoryData = {
          id: purchaseHistoryRef.id,
          assetId: assetId,
          assetName: assetData.name,
          type: "구매",
          date: timestamp,
          description: `자산 "${assetData.name}" 구매 및 할당`,
          user: "시스템", // 실제 구현에서는 현재 로그인한 사용자 정보 사용
          details: {
            purchasePrice: assetData.purchasePrice,
            supplier: assetData.supplier,
          },
          relatedDocumentId: assetId,
          relatedDocumentType: "asset",
          createdAt: timestamp,
        };

        // 할당 이력 데이터 준비
        const assignmentHistoryRef = doc(collection(db, "assetHistory"));
        const assignmentHistoryData = {
          id: assignmentHistoryRef.id,
          assetId: assetId,
          assetName: assetData.name,
          type: "할당",
          date: timestamp,
          description: `자산 "${assetData.name}"이(가) ${assignmentData.assignedTo}에게 할당됨`,
          user: "시스템", // 실제 구현에서는 현재 로그인한 사용자 정보 사용
          details: {
            assignedTo: assignmentData.assignedTo,
            department: assignmentData.department,
            location: assignmentData.location,
          },
          relatedDocumentId: assignmentId,
          relatedDocumentType: "assignment",
          createdAt: timestamp,
        };

        // 트랜잭션에 문서 생성 작업 추가
        transaction.set(assetRef, completeAssetData);
        transaction.set(assignmentRef, completeAssignmentData);
        transaction.set(purchaseHistoryRef, purchaseHistoryData);
        transaction.set(assignmentHistoryRef, assignmentHistoryData);

        return {
          assetId,
          assignmentId,
          assetData: completeAssetData,
          assignmentData: completeAssignmentData,
        };
      });

      setIsPending(false);
      return result;
    } catch (err) {
      console.error("자산 생성 및 할당 트랜잭션 실패:", err);
      setError(`자산 생성 및 할당 실패: ${err.message}`);
      setIsPending(false);
      throw err;
    }
  };

  /**
   * 자산 할당 (트랜잭션)
   * @param {string} assetId - 자산 ID
   * @param {string} currentAssignmentId - 현재 할당 ID (없으면 null)
   * @param {Object} assignmentData - 할당 데이터
   * @returns {Promise<Object>} - 할당 결과
   */
  const assignAsset = async (assetId, currentAssignmentId, assignmentData) => {
    setIsPending(true);
    setError(null);

    try {
      // 자산 및 새 할당 문서의 참조 생성
      const assetRef = doc(db, "assets", assetId);
      const newAssignmentRef = doc(collection(db, "assignments"));
      const newAssignmentId = newAssignmentRef.id;

      // 트랜잭션 실행
      const result = await executeTransaction(async (transaction) => {
        // 현재 시간 설정
        const timestamp = serverTimestamp();

        // 현재 자산 데이터 가져오기
        const assetDoc = await transaction.get(assetRef);
        if (!assetDoc.exists()) {
          throw new Error("자산이 존재하지 않습니다");
        }

        const assetData = assetDoc.data();

        // 현재 할당이 있으면 종료 처리
        if (currentAssignmentId) {
          const currentAssignmentRef = doc(
            db,
            "assignments",
            currentAssignmentId
          );
          const currentAssignmentDoc = await transaction.get(
            currentAssignmentRef
          );

          if (currentAssignmentDoc.exists()) {
            transaction.update(currentAssignmentRef, {
              status: "completed",
              endDate: timestamp,
              updatedAt: timestamp,
            });

            // 반납 이력 추가
            const returnHistoryRef = doc(collection(db, "assetHistory"));
            transaction.set(returnHistoryRef, {
              id: returnHistoryRef.id,
              assetId: assetId,
              assetName: assetData.name,
              type: "반납",
              date: timestamp,
              description: `자산 "${assetData.name}" 반납 후 재할당`,
              user: "시스템", // 실제 구현에서는 현재 로그인한 사용자 정보 사용
              details: {
                previousAssignee: currentAssignmentDoc.data().assignedTo,
              },
              relatedDocumentId: currentAssignmentId,
              relatedDocumentType: "assignment",
              createdAt: timestamp,
            });
          }
        }

        // 새 할당 데이터 준비
        const completeAssignmentData = {
          ...assignmentData,
          id: newAssignmentId,
          assetId: assetId,
          assetName: assetData.name,
          status: "active",
          startDate: timestamp,
          endDate: null,
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        // 자산 업데이트
        transaction.update(assetRef, {
          currentAssignmentId: newAssignmentId,
          assignedTo: assignmentData.assignedTo,
          department: assignmentData.department,
          location: assignmentData.location,
          assignedDate: assignmentData.assignedDate || timestamp,
          status: "사용중",
          updatedAt: timestamp,
        });

        // 새 할당 생성
        transaction.set(newAssignmentRef, completeAssignmentData);

        // 할당 이력 추가
        const assignmentHistoryRef = doc(collection(db, "assetHistory"));
        transaction.set(assignmentHistoryRef, {
          id: assignmentHistoryRef.id,
          assetId: assetId,
          assetName: assetData.name,
          type: "할당",
          date: timestamp,
          description: `자산 "${assetData.name}"이(가) ${assignmentData.assignedTo}에게 할당됨`,
          user: "시스템", // 실제 구현에서는 현재 로그인한 사용자 정보 사용
          details: {
            assignedTo: assignmentData.assignedTo,
            department: assignmentData.department,
            location: assignmentData.location,
          },
          relatedDocumentId: newAssignmentId,
          relatedDocumentType: "assignment",
          createdAt: timestamp,
        });

        return {
          assetId,
          newAssignmentId,
          previousAssignmentId: currentAssignmentId,
          assignmentData: completeAssignmentData,
        };
      });

      setIsPending(false);
      return result;
    } catch (err) {
      console.error("자산 할당 트랜잭션 실패:", err);
      setError(`자산 할당 실패: ${err.message}`);
      setIsPending(false);
      throw err;
    }
  };

  /**
   * 자산 반납 (트랜잭션)
   * @param {string} assetId - 자산 ID
   * @param {string} currentAssignmentId - 현재 할당 ID
   * @param {string} returnNotes - 반납 비고
   * @returns {Promise<Object>} - 반납 결과
   */
  const returnAsset = async (assetId, currentAssignmentId, returnNotes) => {
    setIsPending(true);
    setError(null);

    try {
      // 자산 참조 생성
      const assetRef = doc(db, "assets", assetId);

      // 트랜잭션 실행
      const result = await executeTransaction(async (transaction) => {
        // 현재 시간 설정
        const timestamp = serverTimestamp();

        // 현재 자산 데이터 가져오기
        const assetDoc = await transaction.get(assetRef);
        if (!assetDoc.exists()) {
          throw new Error("자산이 존재하지 않습니다");
        }

        const assetData = assetDoc.data();

        // 현재 할당이 있으면 종료 처리
        if (currentAssignmentId) {
          const currentAssignmentRef = doc(
            db,
            "assignments",
            currentAssignmentId
          );
          const currentAssignmentDoc = await transaction.get(
            currentAssignmentRef
          );

          if (currentAssignmentDoc.exists()) {
            const assignmentData = currentAssignmentDoc.data();

            transaction.update(currentAssignmentRef, {
              status: "completed",
              endDate: timestamp,
              returnNotes: returnNotes || "",
              updatedAt: timestamp,
            });

            // 반납 이력 추가
            const returnHistoryRef = doc(collection(db, "assetHistory"));
            transaction.set(returnHistoryRef, {
              id: returnHistoryRef.id,
              assetId: assetId,
              assetName: assetData.name,
              type: "반납",
              date: timestamp,
              description: `자산 "${assetData.name}"이(가) ${assignmentData.assignedTo}로부터 반납됨`,
              user: "시스템", // 실제 구현에서는 현재 로그인한 사용자 정보 사용
              details: {
                assignedTo: assignmentData.assignedTo,
                department: assignmentData.department,
                returnNotes: returnNotes || "",
              },
              relatedDocumentId: currentAssignmentId,
              relatedDocumentType: "assignment",
              createdAt: timestamp,
            });
          }
        }

        // 자산 업데이트
        transaction.update(assetRef, {
          currentAssignmentId: null,
          assignedTo: "",
          department: "",
          assignedDate: null,
          status: "사용가능",
          updatedAt: timestamp,
        });

        return {
          assetId,
          previousAssignmentId: currentAssignmentId,
        };
      });

      setIsPending(false);
      return result;
    } catch (err) {
      console.error("자산 반납 트랜잭션 실패:", err);
      setError(`자산 반납 실패: ${err.message}`);
      setIsPending(false);
      throw err;
    }
  };

  /**
   * 자산 이력 조회
   * @param {string} assetId - 자산 ID
   * @returns {Promise<Array>} - 자산 이력 목록
   */
  const getAssetHistory = async (assetId) => {
    try {
      const historyData = await getCollection({
        collectionName: "assetHistory",
        whereConditions: [["assetId", "==", assetId]],
        orderByField: ["date", "desc"],
      });

      return historyData;
    } catch (err) {
      console.error("자산 이력 조회 중 오류 발생:", err);
      throw err;
    }
  };

  return {
    createAsset,
    createAssetWithAssignment,
    assignAsset,
    returnAsset,
    getAssetHistory,
    getDocument,
    getCollection,
    isPending,
    error,
  };
};

export default useAssetFirestore;
