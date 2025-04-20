"use client";
import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import SettingsMenu from "../../components/settings/SettingsMenu";
import SettingsCompany from "../../components/settings/SettingsCompany";
import SettingsSystem from "../../components/settings/SettingsSystem";
import SettingsNotifications from "../../components/settings/SettingsNotifications";
import SettingsBackup from "../../components/settings/SettingsBackup";
import SettingsAdmin from "../../components/settings/SettingsAdmin";
import SettingsPositions from "../../components/settings/SettingsPositions";
import SettingsEmployeeFormat from "../../components/settings/SettingsEmployeeFormat";
import InitialSetup from "../../components/settings/InitialSetup";

const Settings = () => {
  const location = useLocation();

  // 현재 경로에 따라 제목 설정
  const getTitle = (path) => {
    switch (path) {
      case "/settings/general":
        return "회사 설정";
      case "/settings/positions":
        return "직위/직책 관리";
      case "/settings/employee-id":
        return "사원번호 관리";
      case "/settings/notifications":
        return "알림 설정";
      case "/settings/backup":
        return "백업 설정";
      case "/settings/admin":
        return "관리자 설정";
      default:
        return "설정";
    }
  };

  return (
    <PageContainer title={getTitle(location.pathname)}>
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1">
          <SettingsMenu />
        </div>
        <div className="col-span-3">
          <Routes>
            <Route path="/general" element={<SettingsCompany />} />
            <Route path="/positions" element={<SettingsPositions />} />
            <Route path="/employee-id" element={<SettingsEmployeeFormat />} />
            <Route path="/notifications" element={<SettingsNotifications />} />
            <Route path="/backup" element={<SettingsBackup />} />
            <Route path="/admin" element={<SettingsAdmin />} />
            <Route path="/initial-setup" element={<InitialSetup />} />
          </Routes>
        </div>
      </div>
    </PageContainer>
  );
};

export default Settings;
