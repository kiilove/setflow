"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getButtonVariantClass } from "../../utils/themeUtils";
import {
  Box,
  ArrowRight,
  LayoutDashboard,
  Settings,
  FileText,
  PenToolIcon as Tool,
  Bell,
  ShoppingBag,
  Users,
  Laptop,
  Server,
  HardDrive,
} from "lucide-react";

const Home = () => {
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 공지사항, 이벤트, 제품 데이터 가져오기 (실제로는 API 호출)
        const noticesData = [
          {
            id: 1,
            title: "시스템 업데이트 안내",
            date: "2023-04-15",
            important: true,
          },
          {
            id: 2,
            title: "2023년 자산 관리 정책 변경 안내",
            date: "2023-04-10",
            important: true,
          },
          {
            id: 3,
            title: "신규 자산 등록 절차 안내",
            date: "2023-04-05",
            important: false,
          },
          {
            id: 4,
            title: "유지보수 일정 변경 안내",
            date: "2023-04-01",
            important: false,
          },
          {
            id: 5,
            title: "자산 관리 시스템 사용자 매뉴얼 배포",
            date: "2023-03-28",
            important: false,
          },
        ];

        const eventsData = [
          {
            id: 1,
            title: "자산 관리 워크샵",
            date: "2023-05-15",
            endDate: "2023-05-16",
          },
          {
            id: 2,
            title: "IT 장비 전시회",
            date: "2023-05-20",
            endDate: "2023-05-22",
          },
          {
            id: 3,
            title: "신규 장비 교육 세미나",
            date: "2023-05-25",
            endDate: "2023-05-25",
          },
        ];

        const productsData = [
          {
            id: 1,
            name: "Dell XPS 15 노트북",
            category: "노트북",
            price: 2200000,
            image: "laptop.jpg",
          },
          {
            id: 2,
            name: "HP Z27 모니터",
            category: "모니터",
            price: 750000,
            image: "monitor.jpg",
          },
          {
            id: 3,
            name: "Logitech MX Master 3 마우스",
            category: "주변기기",
            price: 120000,
            image: "mouse.jpg",
          },
          {
            id: 4,
            name: "Microsoft Office 365",
            category: "소프트웨어",
            price: 150000,
            image: "office.jpg",
          },
        ];

        setNotices(noticesData);
        setEvents(eventsData);
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 자주 사용하는 메뉴 정의
  const frequentMenus = [
    {
      name: "자산 목록",
      icon: <Box size={24} />,
      path: "/assets",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      name: "자산 등록",
      icon: <PlusCircle size={24} />,
      path: "/assets/add",
      color:
        "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      name: "유지보수",
      icon: <Tool size={24} />,
      path: "/maintenance",
      color:
        "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    },
    {
      name: "대시보드",
      icon: <LayoutDashboard size={24} />,
      path: "/dashboard",
      color:
        "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      name: "보고서",
      icon: <FileText size={24} />,
      path: "/reports",
      color:
        "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    },
    {
      name: "사용자 관리",
      icon: <Users size={24} />,
      path: "/users",
      color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
    },
    {
      name: "클라이언트 PC",
      icon: <Laptop size={24} />,
      path: "/client-pcs",
      color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
    },
    {
      name: "설정",
      icon: <Settings size={24} />,
      path: "/settings",
      color: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            자산 관리 시스템
          </h1>
          <p className="text-muted-foreground mt-2">
            효율적인 자산 관리를 위한 통합 플랫폼에 오신 것을 환영합니다.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/dashboard"
            className={`${getButtonVariantClass(
              "primary"
            )} px-4 py-2 rounded-md transition-colors flex items-center gap-2`}
          >
            <LayoutDashboard size={18} />
            대시보드
          </Link>
          <Link
            to="/settings"
            className={`${getButtonVariantClass(
              "outline"
            )} px-4 py-2 rounded-md transition-colors flex items-center gap-2`}
          >
            <Settings size={18} />
            설정
          </Link>
        </div>
      </div>

      {/* 자주 사용하는 메뉴 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
        <h2 className="text-xl font-semibold mb-6">자주 사용하는 메뉴</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {frequentMenus.map((menu, index) => (
            <Link
              key={index}
              to={menu.path}
              className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className={`p-3 rounded-full mb-3 ${menu.color}`}>
                {menu.icon}
              </div>
              <span className="text-sm font-medium text-center">
                {menu.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 공지사항 및 이벤트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 공지사항 */}
        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="mr-2 text-primary" size={20} />
              <h2 className="text-xl font-semibold text-foreground">
                공지사항
              </h2>
            </div>
            <Link
              to="/notices"
              className="text-sm text-primary hover:underline flex items-center"
            >
              더보기
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          <div className="p-4">
            <ul className="divide-y divide-border">
              {notices.map((notice) => (
                <li key={notice.id} className="py-3">
                  <Link
                    to={`/notices/${notice.id}`}
                    className="block hover:bg-muted/50 p-2 rounded-md transition-colors"
                  >
                    <div className="flex items-start">
                      {notice.important && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 mr-2">
                          중요
                        </span>
                      )}
                      <span className="flex-1 text-foreground">
                        {notice.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {notice.date}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 이벤트 */}
        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="mr-2 text-primary" size={20} />
              <h2 className="text-xl font-semibold text-foreground">
                이벤트 및 일정
              </h2>
            </div>
            <Link
              to="/events"
              className="text-sm text-primary hover:underline flex items-center"
            >
              더보기
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          <div className="p-4">
            <ul className="divide-y divide-border">
              {events.map((event) => (
                <li key={event.id} className="py-3">
                  <Link
                    to={`/events/${event.id}`}
                    className="block hover:bg-muted/50 p-2 rounded-md transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <p className="text-foreground">{event.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.date === event.endDate
                            ? event.date
                            : `${event.date} ~ ${event.endDate}`}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 자사몰 제품 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingBag className="mr-2 text-primary" size={20} />
            <h2 className="text-xl font-semibold text-foreground">추천 제품</h2>
          </div>
          <Link
            to="/products"
            className="text-sm text-primary hover:underline flex items-center"
          >
            제품 더보기
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-40 bg-muted flex items-center justify-center">
                  <img
                    src={`/placeholder.svg?height=160&width=240&text=${product.name}`}
                    alt={product.name}
                    className="object-cover h-full w-full"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-foreground">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {product.category}
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-2">
                    {formatCurrency(product.price)}
                  </p>
                  <button
                    className={`${getButtonVariantClass(
                      "outline"
                    )} w-full mt-3 px-3 py-1 text-sm rounded-md transition-colors`}
                  >
                    상세 정보
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 시스템 상태 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center">
            <Server className="mr-2 text-primary" size={20} />
            시스템 상태
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">서버 가동률</span>
              <span className="text-sm font-medium text-foreground">99.8%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "99.8%" }}
              ></div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-muted-foreground">
                데이터베이스
              </span>
              <span className="text-sm font-medium text-foreground">정상</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-muted-foreground">
                API 응답 시간
              </span>
              <span className="text-sm font-medium text-foreground">245ms</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "90%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center">
            <HardDrive className="mr-2 text-amber-500" size={20} />
            스토리지 사용량
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">주 스토리지</span>
              <span className="text-sm font-medium text-foreground">
                68% (3.4TB / 5TB)
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full"
                style={{ width: "68%" }}
              ></div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-muted-foreground">
                백업 스토리지
              </span>
              <span className="text-sm font-medium text-foreground">
                42% (4.2TB / 10TB)
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "42%" }}
              ></div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-muted-foreground">
                클라우드 스토리지
              </span>
              <span className="text-sm font-medium text-foreground">
                23% (230GB / 1TB)
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "23%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center">
            <Users className="mr-2 text-blue-500" size={20} />
            사용자 통계
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">총 사용자</span>
              <span className="text-sm font-medium text-foreground">128명</span>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-muted-foreground">활성 사용자</span>
              <span className="text-sm font-medium text-foreground">87명</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: "68%" }}
              ></div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-muted-foreground">오늘 로그인</span>
              <span className="text-sm font-medium text-foreground">42명</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: "33%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

// 아이콘 컴포넌트 추가
function PlusCircle(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}

function Calendar(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
