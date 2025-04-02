import { Link, useLocation } from "react-router-dom";
import {
  FaCog,
  FaBell,
  FaDatabase,
  FaUserShield,
  FaShieldAlt,
  FaChevronRight,
} from "react-icons/fa";

const SettingsMenu = () => {
  const location = useLocation();

  // 현재 경로에 따라 활성 메뉴 항목 결정
  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      path: "/settings",
      icon: <FaCog className="mr-3 h-5 w-5" />,
      label: "일반 설정",
    },
    {
      path: "/settings/notifications",
      icon: <FaBell className="mr-3 h-5 w-5 text-yellow-500" />,
      label: "알림 설정",
    },
    {
      path: "/settings/backup",
      icon: <FaDatabase className="mr-3 h-5 w-5 text-blue-500" />,
      label: "백업 및 복원",
    },
    {
      path: "/settings/admin",
      icon: <FaUserShield className="mr-3 h-5 w-5 text-green-500" />,
      label: "관리자 관리",
    },
    {
      path: "/settings/security",
      icon: <FaShieldAlt className="mr-3 h-5 w-5 text-red-500" />,
      label: "보안 설정",
    },
  ];

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
      <div className="p-4 border-b border-border theme-transition">
        <h3 className="text-lg font-medium text-foreground theme-transition">
          설정 메뉴
        </h3>
      </div>
      <div className="p-2">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2 rounded-md ${
                isActive(item.path)
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted theme-transition"
              }`}
            >
              <div className="flex items-center">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <FaChevronRight className="h-4 w-4" />
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SettingsMenu;
