"use client";

import { NavLink } from "react-router-dom";
import {
  Settings,
  Bell,
  Shield,
  Users,
  Database,
  Building,
  Briefcase,
  IdCard,
} from "lucide-react";

const SettingsMenu = () => {
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/settings/general"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              <Building className="h-4 w-4" />
              <span>회사 설정</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings/positions"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              <Briefcase className="h-4 w-4" />
              <span>직위/직책 관리</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings/employee-id"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              <IdCard className="h-4 w-4" />
              <span>사원번호 관리</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings/notifications"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              <Bell className="h-4 w-4" />
              <span>알림 설정</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings/security"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              <Shield className="h-4 w-4" />
              <span>보안 설정</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings/backup"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              <Database className="h-4 w-4" />
              <span>백업 설정</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              <Users className="h-4 w-4" />
              <span>관리자 설정</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SettingsMenu;
