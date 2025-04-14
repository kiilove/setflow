"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useFirestore } from "./useFirestore";
import { calculateBMI } from "../utils/memberUtils";

/**
 * 회원 신체정보 관리를 위한 커스텀 훅
 * @param {string} memberId - 회원 ID
 * @returns {Object} 신체정보 관리 메서드와 상태
 */
export const useBodyInfoManager = (memberId) => {
  const [bodyInfoHistory, setBodyInfoHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestBodyInfo, setLatestBodyInfo] = useState(null);

  // Firestore 훅 사용
  const { getCollection } = useFirestore(`members/${memberId}/bodyInfo`);

  // 신체정보 히스토리 로드
  const loadBodyInfoHistory = useCallback(async () => {
    if (!memberId) return [];

    try {
      setIsLoading(true);
      const data = await getCollection([], ["date", "desc"]);
      setBodyInfoHistory(data);

      // 최신 신체정보 설정
      if (data.length > 0) {
        setLatestBodyInfo(data[0]);
      }

      setIsLoading(false);
      return data;
    } catch (error) {
      console.error("신체 정보 히스토리 로드 실패:", error);
      setIsLoading(false);
      return [];
    }
  }, [memberId, getCollection]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    if (memberId) {
      loadBodyInfoHistory();
    }
  }, [memberId, loadBodyInfoHistory]);

  // 신체정보 추가
  const addBodyInfo = async (bodyInfoData) => {
    if (!memberId) return null;

    try {
      // BMI 계산
      if (bodyInfoData.height && bodyInfoData.weight) {
        bodyInfoData.bmi = calculateBMI(
          Number(bodyInfoData.weight),
          Number(bodyInfoData.height)
        );
      }

      // 타임스탬프 추가
      const dataToSave = {
        ...bodyInfoData,
        createdAt: serverTimestamp(),
      };

      // Firestore에 저장
      const docRef = await addDoc(
        collection(db, `members/${memberId}/bodyInfo`),
        dataToSave
      );

      // 히스토리 새로고침
      await loadBodyInfoHistory();

      return { id: docRef.id, ...bodyInfoData };
    } catch (error) {
      console.error("신체 정보 추가 실패:", error);
      throw error;
    }
  };

  // 신체정보 삭제
  const deleteBodyInfo = async (bodyInfoId) => {
    if (!memberId || !bodyInfoId) return false;

    try {
      await deleteDoc(doc(db, `members/${memberId}/bodyInfo`, bodyInfoId));

      // 히스토리 새로고침
      await loadBodyInfoHistory();

      return true;
    } catch (error) {
      console.error("신체 정보 삭제 실패:", error);
      throw error;
    }
  };

  return {
    bodyInfoHistory,
    latestBodyInfo,
    isLoading,
    addBodyInfo,
    deleteBodyInfo,
    loadBodyInfoHistory,
  };
};
