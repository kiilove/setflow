"use client";

import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import { auth } from "../firebase/config";

/**
 * Firebase Authentication을 위한 커스텀 훅
 * @returns {Object} 인증 메서드와 상태
 */
export const useFirebaseAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 사용자 상태 변경 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * 이메일/비밀번호로 회원가입
   * @param {string} email - 이메일
   * @param {string} password - 비밀번호
   * @param {string} displayName - 표시 이름 (선택)
   * @returns {Promise<Object>} 사용자 객체
   */
  const signup = async (email, password, displayName = "") => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 표시 이름 설정 (선택)
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * 이메일/비밀번호로 로그인
   * @param {string} email - 이메일
   * @param {string} password - 비밀번호
   * @returns {Promise<Object>} 사용자 객체
   */
  const login = async (email, password) => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * 로그아웃
   * @returns {Promise<void>}
   */
  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * 비밀번호 재설정 이메일 전송
   * @param {string} email - 이메일
   * @returns {Promise<void>}
   */
  const resetPassword = async (email) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * 사용자 프로필 업데이트
   * @param {Object} profileData - 업데이트할 프로필 데이터
   * @returns {Promise<void>}
   */
  const updateUserProfile = async (profileData) => {
    setError(null);
    try {
      if (!currentUser) {
        throw new Error("로그인이 필요합니다.");
      }
      await updateProfile(currentUser, profileData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * 사용자 이메일 업데이트
   * @param {string} newEmail - 새 이메일
   * @returns {Promise<void>}
   */
  const updateUserEmail = async (newEmail) => {
    setError(null);
    try {
      if (!currentUser) {
        throw new Error("로그인이 필요합니다.");
      }
      await updateEmail(currentUser, newEmail);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * 사용자 비밀번호 업데이트
   * @param {string} newPassword - 새 비밀번호
   * @returns {Promise<void>}
   */
  const updateUserPassword = async (newPassword) => {
    setError(null);
    try {
      if (!currentUser) {
        throw new Error("로그인이 필요합니다.");
      }
      await updatePassword(currentUser, newPassword);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * 사용자 계정 삭제
   * @returns {Promise<void>}
   */
  const deleteUserAccount = async () => {
    setError(null);
    try {
      if (!currentUser) {
        throw new Error("로그인이 필요합니다.");
      }
      await deleteUser(currentUser);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    deleteUserAccount,
  };
};
