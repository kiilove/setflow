"use client";
import { Link, useLocation } from "react-router-dom";
import {
  Building2,
  Bell,
  UserCog,
  Calculator,
  Users,
  MapPin,
} from "lucide-react";

const SettingsMenu = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: "회사 정보",
      path: "/settings/company",
      icon: Building2,
    },
    {
      title: "부서 관리",
      path: "/settings/company/departments",
      icon: Users,
    },
    {
      title: "위치 관리",
      path: "/settings/company/locations",
      icon: MapPin,
    },
    {
      title: "감가상각 설정",
      path: "/settings/depreciation",
      icon: Calculator,
    },
    {
      title: "알림 설정",
      path: "/settings/system/notifications",
      icon: Bell,
    },
    {
      title: "관리자 설정",
      path: "/settings/admin",
      icon: UserCog,
    },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">설정</h2>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary border-l-4 border-primary"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${isActive ? "text-primary" : ""}`}
                  />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SettingsMenu;
