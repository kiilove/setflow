"use client";

import { useState } from "react";
import {
  FaUserShield,
  FaLock,
  FaEnvelope,
  FaUser,
  FaPhone,
  FaSave,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const SettingsAdmin = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminInfo, setAdminInfo] = useState({
    name: "관리자",
    email: "admin@setflow.com",
    phone: "010-1234-5678",
    position: "시스템 관리자",
    department: "IT 부서",
    lastLogin: "2023-12-15 14:30:22",
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 관리자 정보 수정 버튼 클릭 핸들러
  const handleEditAdmin = () => {
    setShowPasswordModal(true);
    setPassword("");
    setPasswordError("");
  };

  // 비밀번호 확인 핸들러
  const handleVerifyPassword = () => {
    // 실제 구현에서는 API 호출로 비밀번호 검증
    if (password === "admin123") {
      setIsAuthenticated(true);
      setShowPasswordModal(false);
    } else {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    }
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setPassword("");
    setPasswordError("");
  };

  // 관리자 정보 변경 핸들러
  const handleAdminInfoChange = (e) => {
    const { name, value } = e.target;
    setAdminInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 관리자 정보 저장 핸들러
  const handleSaveAdminInfo = () => {
    // 실제 구현에서는 API 호출로 정보 저장
    console.log("Saving admin info:", adminInfo);

    // 성공 메시지 표시
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* 설정 저장 성공 메시지 */}
      {saveSuccess && (
        <div className="mb-6 p-4 rounded-md bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300 flex items-center">
          <FaCheck className="mr-2" />
          <span>관리자 정보가 성공적으로 저장되었습니다.</span>
        </div>
      )}

      {/* 관리자 정보 카드 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
        <div className="p-4 border-b border-border theme-transition">
          <h3 className="text-lg font-medium text-foreground theme-transition flex items-center">
            <FaUserShield className="mr-2 text-primary" />
            관리자 정보
          </h3>
        </div>
        <div className="p-4">
          {!isAuthenticated ? (
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-muted/50 rounded-md theme-transition">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FaUserShield className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <h4 className="text-md font-medium text-foreground theme-transition">
                    {adminInfo.name}
                  </h4>
                  <p className="text-sm text-muted-foreground theme-transition">
                    {adminInfo.email}
                  </p>
                  <p className="text-sm text-muted-foreground theme-transition">
                    {adminInfo.position} | {adminInfo.department}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground theme-transition">
                    마지막 로그인
                  </p>
                  <p className="text-sm text-foreground theme-transition">
                    {adminInfo.lastLogin}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground theme-transition">
                    연락처
                  </p>
                  <p className="text-sm text-foreground theme-transition">
                    {adminInfo.phone}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleEditAdmin}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <FaLock className="mr-2 -ml-1 h-4 w-4" />
                  관리자 정보 수정
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                  >
                    이름
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-muted-foreground" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={adminInfo.name}
                      onChange={handleAdminInfoChange}
                      className="w-full pl-10 px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                  >
                    이메일
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-muted-foreground" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={adminInfo.email}
                      onChange={handleAdminInfoChange}
                      className="w-full pl-10 px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                  >
                    연락처
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-muted-foreground" />
                    </div>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={adminInfo.phone}
                      onChange={handleAdminInfoChange}
                      className="w-full pl-10 px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="position"
                    className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                  >
                    직책
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={adminInfo.position}
                    onChange={handleAdminInfoChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                  >
                    부서
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={adminInfo.department}
                    onChange={handleAdminInfoChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAuthenticated(false)}
                  className="inline-flex items-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-muted hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-muted theme-transition"
                >
                  <FaTimes className="mr-2 -ml-1 h-4 w-4" />
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSaveAdminInfo}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <FaSave className="mr-2 -ml-1 h-4 w-4" />
                  저장
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 비밀번호 변경 카드 */}
      {isAuthenticated && (
        <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
          <div className="p-4 border-b border-border theme-transition">
            <h3 className="text-lg font-medium text-foreground theme-transition flex items-center">
              <FaLock className="mr-2 text-primary" />
              비밀번호 변경
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                >
                  현재 비밀번호
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                >
                  새 비밀번호
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                >
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <FaSave className="mr-2 -ml-1 h-4 w-4" />
                  비밀번호 변경
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 비밀번호 확인 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 max-w-md w-full theme-transition">
            <h3 className="text-xl font-semibold mb-4 text-foreground theme-transition flex items-center">
              <FaLock className="mr-2 text-primary" />
              관리자 인증
            </h3>
            <p className="text-muted-foreground theme-transition mb-4">
              관리자 정보를 수정하려면 비밀번호를 입력하세요.
            </p>

            <div className="mb-4">
              <label
                htmlFor="adminPassword"
                className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
              >
                관리자 비밀번호
              </label>
              <input
                type="password"
                id="adminPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                placeholder="비밀번호를 입력하세요"
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-500">{passwordError}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-colors theme-transition"
              >
                취소
              </button>
              <button
                onClick={handleVerifyPassword}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsAdmin;
