"use client";
import { useState } from "react";
import { Routes, Route, useLocation, Link, Navigate } from "react-router-dom";
import {
  Settings as SettingsIcon,
  Building2,
  Users,
  MapPin,
  Calculator,
  Bell,
  UserCog,
} from "lucide-react";
import PageContainer from "../../components/common/PageContainer";
import SettingsMenu from "../../components/settings/SettingsMenu";
import SettingsCompany from "../../components/settings/SettingsCompany";
import SettingsNotifications from "../../components/settings/SettingsNotifications";
import SettingsAdmin from "../../components/settings/SettingsAdmin";
import SettingsDepreciation from "../../components/settings/SettingsDepreciation";
import SettingsDepartments from "../../components/settings/SettingsDepartments";
import SettingsLocations from "../../components/settings/SettingsLocations";
import "./settings.css";

const Settings = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    {
      title: "회사 정보",
      path: "/settings/company",
      icon: Building2,
      color: "bg-blue-500",
    },
    {
      title: "부서 관리",
      path: "/settings/company/departments",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "위치 관리",
      path: "/settings/company/locations",
      icon: MapPin,
      color: "bg-purple-500",
    },
    {
      title: "감가상각 설정",
      path: "/settings/depreciation",
      icon: Calculator,
      color: "bg-orange-500",
    },
    {
      title: "알림 설정",
      path: "/settings/system/notifications",
      icon: Bell,
      color: "bg-red-500",
    },
    {
      title: "관리자 설정",
      path: "/settings/admin",
      icon: UserCog,
      color: "bg-gray-500",
    },
  ].reverse();

  return (
    <PageContainer>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* PC 레이아웃 - 사이드바 */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border sticky top-6">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">설정</h2>
              <SettingsMenu />
            </div>
          </div>
        </div>

        {/* 모바일 레이아웃 */}
        <div className="lg:hidden">
          {/* 부채꼴 메뉴 */}
          <div className="settings-menu-container">
            {isMenuOpen && (
              <div className="settings-menu-items">
                {menuItems.map((item, index) => {
                  const totalItems = menuItems.length;
                  const startAngle = 0; // 시작 각도 (위쪽)
                  const endAngle = 180; // 끝 각도 (왼쪽에서 오른쪽으로)
                  const angleStep = (endAngle - startAngle) / (totalItems - 1);
                  const angle = startAngle + index * angleStep;
                  const radius = 140; // 반지름 조정

                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = -Math.sin((angle * Math.PI) / 180) * radius; // y축 반전

                  return (
                    <div
                      key={item.path}
                      className="settings-menu-item"
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`settings-menu-icon ${item.color} text-white`}
                      >
                        <item.icon className="w-6 h-6" />
                      </Link>
                      <span className="settings-menu-text">{item.title}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 메인 버튼 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`settings-menu-button bg-primary text-white ${
                isMenuOpen ? "rotate-45" : ""
              }`}
            >
              <SettingsIcon className="w-6 h-6" />
            </button>
          </div>

          {/* 오버레이 */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setIsMenuOpen(false)}
            />
          )}
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 min-w-0 pb-24 lg:pb-0">
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/settings/company" replace />}
            />
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
