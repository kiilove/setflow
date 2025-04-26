import { Routes, Route, useLocation } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import SettingsMenu from "../components/settings/SettingsMenu";
import SettingsCompany from "../components/settings/SettingsCompany";
import SettingsNotifications from "../components/settings/SettingsNotifications";
import SettingsAdmin from "../components/settings/SettingsAdmin";
import SettingsDepreciation from "../components/settings/SettingsDepreciation";
import SettingsDepartments from "../components/settings/SettingsDepartments";
import SettingsLocations from "../components/settings/SettingsLocations";

const Settings = () => {
  const location = useLocation();

  const getTitle = () => {
    const path = location.pathname;
    if (path.includes("/settings/company")) return "회사 정보";
    if (path.includes("/settings/company/departments")) return "부서 관리";
    if (path.includes("/settings/company/locations")) return "위치 관리";
    if (path.includes("/settings/depreciation")) return "감가상각 설정";
    if (path.includes("/settings/system/notifications")) return "알림 설정";
    if (path.includes("/settings/admin")) return "관리자 설정";
    return "설정";
  };

  return (
    <PageContainer title={getTitle()}>
      <div className="flex h-full">
        <SettingsMenu />
        <div className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="company" element={<SettingsCompany />} />
            <Route
              path="company/departments"
              element={<SettingsDepartments />}
            />
            <Route path="company/locations" element={<SettingsLocations />} />
            <Route path="depreciation" element={<SettingsDepreciation />} />
            <Route
              path="system/notifications"
              element={<SettingsNotifications />}
            />
            <Route path="admin" element={<SettingsAdmin />} />
          </Routes>
        </div>
      </div>
    </PageContainer>
  );
};

export default Settings;
