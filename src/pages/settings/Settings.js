"use client";
import { Routes, Route, useLocation } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import SettingsMenu from "../../components/settings/SettingsMenu";
import SettingsGeneral from "../../components/settings/SettingsGeneral";
import SettingsSystem from "../../components/settings/SettingsSystem";
import SettingsNotifications from "../../components/settings/SettingsNotifications";
import SettingsBackup from "../../components/settings/SettingsBackup";
import SettingsAdmin from "../../components/settings/SettingsAdmin";

const Settings = () => {
  const location = useLocation();

  // 현재 경로에 따라 제목 설정
  const getTitle = () => {
    const path = location.pathname;
    if (path === "/settings") return "일반 설정";
    if (path === "/settings/notifications") return "알림 설정";
    if (path === "/settings/backup") return "백업 및 복원";
    if (path === "/settings/admin") return "관리자 관리";
    if (path === "/settings/security") return "보안 설정";
    return "시스템 설정";
  };

  return (
    <PageContainer title={getTitle()}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 설정 메뉴 */}
        <div className="lg:col-span-1">
          <SettingsMenu />
        </div>

        {/* 설정 내용 */}
        <div className="lg:col-span-3">
          <Routes>
            <Route
              path="/"
              element={
                <div className="space-y-6">
                  <SettingsGeneral />
                  <SettingsSystem />
                </div>
              }
            />
            <Route path="/notifications" element={<SettingsNotifications />} />
            <Route path="/backup" element={<SettingsBackup />} />
            <Route path="/admin" element={<SettingsAdmin />} />
            <Route
              path="/security"
              element={
                <div className="bg-card text-card-foreground rounded-lg shadow-md p-6 border border-border theme-transition">
                  <h3 className="text-lg font-medium text-foreground theme-transition mb-4">
                    보안 설정
                  </h3>
                  <p className="text-muted-foreground">
                    이 기능은 현재 개발 중입니다.
                  </p>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </PageContainer>
  );
};

export default Settings;
