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

/**
 * 회원 상담 기록 관리를 위한 커스텀 훅
 * @param {string} memberId - 회원 ID
 * @returns {Object} 상담 기록 관리 메서드와 상태
 */
export const useConsultationManager = (memberId) => {
  const [consultations, setConsultations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Firestore 훅 사용
  const { getCollection } = useFirestore(`members/${memberId}/consultations`);

  // 상담 기록 로드
  const loadConsultations = useCallback(async () => {
    if (!memberId) return [];

    try {
      setIsLoading(true);
      const data = await getCollection([], ["date", "desc"]);
      setConsultations(data);
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error("상담 기록 로드 실패:", error);
      setIsLoading(false);
      return [];
    }
  }, [memberId, getCollection]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    if (memberId) {
      loadConsultations();
    }
  }, [memberId, loadConsultations]);

  // 상담 기록 추가
  const addConsultation = async (consultationData) => {
    if (!memberId) return null;

    try {
      // 타임스탬프 추가
      const dataToSave = {
        ...consultationData,
        createdAt: serverTimestamp(),
      };

      // Firestore에 저장
      const docRef = await addDoc(
        collection(db, `members/${memberId}/consultations`),
        dataToSave
      );

      // 상담 기록 새로고침
      await loadConsultations();

      return { id: docRef.id, ...consultationData };
    } catch (error) {
      console.error("상담 기록 추가 실패:", error);
      throw error;
    }
  };

  // 상담 기록 삭제
  const deleteConsultation = async (consultationId) => {
    if (!memberId || !consultationId) return false;

    try {
      await deleteDoc(
        doc(db, `members/${memberId}/consultations`, consultationId)
      );

      // 상담 기록 새로고침
      await loadConsultations();

      return true;
    } catch (error) {
      console.error("상담 기록 삭제 실패:", error);
      throw error;
    }
  };

  return {
    consultations,
    isLoading,
    addConsultation,
    deleteConsultation,
    loadConsultations,
  };
};
