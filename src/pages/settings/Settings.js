"use client";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import PageContainer from "../../components/common/PageContainer";
import SettingsMenu from "../../components/settings/SettingsMenu";
import SettingsCompany from "../../components/settings/SettingsCompany";
import SettingsNotifications from "../../components/settings/SettingsNotifications";
import SettingsAdmin from "../../components/settings/SettingsAdmin";
import SettingsDepreciation from "../../components/settings/SettingsDepreciation";
import SettingsDepartments from "../../components/settings/SettingsDepartments";
import SettingsLocations from "../../components/settings/SettingsLocations";

const Settings = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getTitle = (path) => {
    const pathMap = {
      "/settings/company": "회사 설정",
      "/settings/company/departments": "부서 관리",
      "/settings/company/locations": "위치 관리",
      "/settings/depreciation": "감가상각 설정",
      "/settings/system/notifications": "알림 설정",
      "/settings/admin": "관리자 설정",
    };
    return pathMap[path] || "설정";
  };

  return (
    <PageContainer title={getTitle(location.pathname)}>
      <div className="flex flex-col lg:flex-row">
        {/* 모바일 메뉴 토글 버튼 */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">
            {getTitle(location.pathname)}
          </h2>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md hover:bg-accent"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* 사이드바 - 모바일에서는 오버레이로 표시 */}
        <div
          className={`fixed inset-0 lg:static lg:w-64 transition-transform duration-200 ease-in-out ${
            isMenuOpen
              ? "translate-x-0 z-50"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="h-full lg:h-auto bg-card lg:bg-transparent">
            <div className="p-4 lg:p-0">
              <SettingsMenu />
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex-1">
          <div className="p-4 lg:px-6">
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

        {/* 모바일 메뉴 오버레이 배경 */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default Settings;
