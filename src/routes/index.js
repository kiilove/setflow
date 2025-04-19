import {
  HomeIcon,
  LayoutDashboard,
  Package,
  ListTodo,
  Wrench,
  BarChart3,
  UsersIcon,
  SettingsIcon,
  MapPin,
  Building2,
  Laptop,
} from "lucide-react";

// Import page components
import Home from "../pages/home/Home";
import Dashboard from "../pages/dashboard/Dashboard";
import DashboardAnalytics from "../pages/dashboard/DashboardAnalytics";

//인증 관리
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Terms from "../pages/terms";
import CheckAuth from "../utils/checkAuth";

// 자산 관리
import Assets from "../pages/assets/Assets";
import AssetsAdd from "../pages/assets/AssetsAdd";
import AssetsDetail from "../pages/assets/AssetsDetail";
import AssetsHistory from "../pages/assets/AssetsHistory";

// 자산 카테고리
import Categories from "../pages/categories/Categories";
import CategoriesAdd from "../pages/categories/CategoriesAdd";
import CategoriesTemplate from "../pages/categories/CategoriesTemplate";
// CategoriesEdit 컴포넌트 임포트 추가
import CategoriesEdit from "../pages/categories/CategoriesEdit";

// 유지보수
import Maintenance from "../pages/maintenance/Maintenance";
import MaintenanceSchedule from "../pages/maintenance/MaintenanceSchedule";

import MaintenanceAdd from "../pages/maintenance/MaintenanceAdd";

// 보고서
import Reports from "../pages/reports/Reports";
import ReportsAssets from "../pages/reports/ReportsAssets";
import ReportsDepreciation from "../pages/reports/ReportsDepreciation";
import ReportsMaintenance from "../pages/reports/ReportsMaintenance";

// 위치 관리
import Locations from "../pages/locations/Locations";
import LocationsAdd from "../pages/locations/LocationsAdd";
import LocationsMap from "../pages/locations/LocationsMapOld";

// 사용자 관리
import Users from "../pages/users/Users";
import UsersAdd from "../pages/users/UsersAdd";
import UsersEdit from "../pages/users/UsersEdit";
import UsersDetail from "../pages/users/UsersDetail";
import UsersPermissions from "../pages/users/UsersPermissions";

// 부서 관리
import Departments from "../pages/departments/Departments";
import DepartmentsAdd from "../pages/departments/DepartmentsAdd";
import DepartmentsEdit from "../pages/departments/DepartmentsEdit";
import DepartmentsDetail from "../pages/departments/DepartmentsDetail";

// 설정
import Settings from "../pages/settings/Settings";
import AssetsEdit from "../pages/assets/AssetsEdit";

// 클라이언트 PC
import ClientPCs from "../pages/client-pcs/ClientPCs";
import LocationsEdit from "../pages/locations/LocationsEdit";
import MaintenanceEdit from "../pages/maintenance/MaintenanceEdit";
import MaintenanceDetail from "../pages/maintenance/MaintenanceDetail";
import CategoriesDetail from "../pages/categories/CategoriesDetail";
import LocationsDetail from "../pages/locations/LocationsDetail";

/**
 * 라우트 구조 정의
 * id: 고유 식별자
 * path: URL 경로
 * component: 렌더링할 컴포넌트
 * title: 페이지 제목
 * icon: 사이드바 아이콘
 * parent: 부모 라우트 ID (Breadcrumb 생성에 사용)
 * showInSidebar: 사이드바에 표시 여부
 * children: 하위 라우트
 * standalone: 독립 페이지 여부 (true인 경우 메인 레이아웃 없이 렌더링)
 * requiresAuth: 인증이 필요한지 여부
 */
const routes = [
  // CheckAuth 컴포넌트를 루트 경로에 추가
  {
    id: "root",
    path: "/",
    component: CheckAuth,
    title: "인증 확인",
    showInSidebar: false,
    standalone: true,
  },
  // 기존 홈 컴포넌트는 /home 경로로 변경
  {
    id: "home",
    path: "/home",
    component: Home,
    title: "홈",
    icon: HomeIcon,
    showInSidebar: true,
    requiresAuth: true, // 인증 필요 표시
  },
  // 인증 관련 라우트를 독립적인 페이지로 변경
  {
    id: "login",
    path: "/auth/login",
    component: Login,
    title: "로그인",
    showInSidebar: false,
    standalone: true, // 독립 페이지로 표시
  },
  {
    id: "register",
    path: "/auth/register",
    component: Register,
    title: "회원가입",
    showInSidebar: false,
    standalone: true, // 독립 페이지로 표시
  },
  {
    id: "forgot-password",
    path: "/auth/forgot-password",
    component: ForgotPassword,
    title: "비밀번호 찾기",
    showInSidebar: false,
    standalone: true, // 독립 페이지로 표시
  },
  {
    id: "terms",
    path: "/terms",
    component: Terms,
    title: "이용약관",
    showInSidebar: false,
    standalone: true, // 독립 페이지로 표시
  },
  {
    id: "dashboard",
    path: "/dashboard",
    component: Dashboard,
    title: "대시보드",
    icon: LayoutDashboard,
    showInSidebar: true,
    requiresAuth: true, // 인증 필요 표시
    children: [
      {
        id: "dashboard-overview",
        path: "/dashboard",
        component: Dashboard,
        title: "개요",
        parent: "dashboard",
        showInSidebar: true,
        requiresAuth: true, // 인증 필요 표시
      },
      // 클라이언트 PC 페이지 추가
      {
        id: "client-pcs",
        path: "/client-pcs",
        component: ClientPCs,
        title: "클라이언트 PC",
        parent: "dashboard",
        icon: Laptop,
        showInSidebar: true,
        requiresAuth: true,
      },
    ],
  },
  // 나머지 라우트에 requiresAuth: true 추가 (표시 생략)
  {
    id: "assets",
    path: "/assets",
    component: Assets,
    title: "자산 관리",
    icon: Package,
    showInSidebar: true,
    requiresAuth: true,
    children: [
      {
        id: "assets-list",
        path: "/assets",
        component: Assets,
        title: "자산 목록",
        parent: "assets",
        showInSidebar: true,
        requiresAuth: true,
      },
      {
        id: "assets-add",
        path: "/assets/add",
        component: AssetsAdd,
        title: "자산 등록",
        parent: "assets",
        showInSidebar: true,
        requiresAuth: true,
      },
      {
        id: "assets-detail",
        path: "/assets/detail/:id",
        component: AssetsDetail,
        title: "자산 상세",
        parent: "assets",
        showInSidebar: false,
        requiresAuth: true,
      },
      {
        id: "assets-history",
        path: "/assets/history",
        component: AssetsHistory,
        title: "자산 이력",
        parent: "assets",
        showInSidebar: true,
        requiresAuth: true,
      },
      {
        id: "assets-edit",
        path: "/assets/edit/:id",
        component: AssetsEdit,
        title: "자산 이력",
        parent: "assets",
        showInSidebar: false,
        requiresAuth: true,
      },
    ],
  },
  {
    id: "categories",
    path: "/categories",
    component: Categories,
    title: "자산 카테고리",
    icon: ListTodo,
    showInSidebar: true,
    requiresAuth: true,
    children: [
      {
        id: "categories-list",
        path: "/categories",
        component: Categories,
        title: "카테고리 목록",
        parent: "categories",
        showInSidebar: true,
        requiresAuth: true,
      },
      {
        id: "categories-add",
        path: "/categories/add",
        component: CategoriesAdd,
        title: "카테고리 추가",
        parent: "categories",
        showInSidebar: true,
        requiresAuth: true,
      },
      {
        id: "categories-edit",
        path: "/categories/edit/:id",
        component: CategoriesEdit,
        title: "카테고리 편집",
        parent: "categories",
        showInSidebar: false,
        requiresAuth: true,
      },
      {
        id: "categories-template",
        path: "/categories/template/:id",
        component: CategoriesTemplate,
        title: "사양 템플릿 편집",
        parent: "categories",
        showInSidebar: false,
        requiresAuth: true,
      },
      {
        id: "categories-detail",
        path: "/categories/detail/:id",
        component: CategoriesDetail,
        title: "카테고리 상세",
        parent: "categories",
        showInSidebar: false,
        requiresAuth: true,
      },
    ],
  },
  {
    id: "maintenance",
    path: "/maintenance",
    component: Maintenance,
    title: "유지보수",
    icon: Wrench,
    showInSidebar: true,
    requiresAuth: true,
    children: [
      {
        id: "maintenance-list",
        path: "/maintenance",
        component: Maintenance,
        title: "유지보수 목록",
        parent: "maintenance",
        showInSidebar: true,
        requiresAuth: true,
      },
      {
        id: "maintenance-add",
        path: "/maintenance/add",
        component: MaintenanceAdd,
        title: "유지보수 일정 등록",
        parent: "maintenance",
        showInSidebar: true,
        requiresAuth: true,
      },
      {
        id: "maintenance-edit",
        path: "/maintenance/edit",
        component: MaintenanceEdit,
        title: "유지보수 일정 수정",
        parent: "maintenance",
        showInSidebar: false,
        requiresAuth: true,
      },
      {
        id: "maintenance-detail",
        path: "/maintenance/detail/:id",
        component: MaintenanceDetail,
        title: "유지보수 일정 보기",
        parent: "maintenance",
        showInSidebar: false,
        requiresAuth: true,
      },
    ],
  },
  {
    id: "reports",
    path: "/reports",
    component: Reports,
    title: "보고서",
    icon: BarChart3,
    showInSidebar: true,
    requiresAuth: true,
    children: [
      {
        id: "reports-overview",
        path: "/reports",
        component: Reports,
        title: "보고서 개요",
        parent: "reports",
        showInSidebar: true,
        requiresAuth: true,
      },
      {
        id: "reports-assets",
        path: "/reports/assets",
        component: ReportsAssets,
        title: "자산 보고서",
        parent: "reports",
        showInSidebar: true,
        requiresAuth: true,
      },
      {
        id: "reports-depreciation",
        path: "/reports/depreciation",
        component: ReportsDepreciation,
        title: "감가상각 보고서",
        parent: "reports",
        showInSidebar: true,
        requiresAuth: true,
      },
      {
        id: "reports-maintenance",
        path: "/reports/maintenance",
        component: ReportsMaintenance,
        title: "유지보수 보고서",
        parent: "reports",
        showInSidebar: true,
        requiresAuth: true,
      },
    ],
  },
  {
    id: "users",
    path: "/users",
    component: Users,
    title: "구성원 관리",
    icon: UsersIcon,
    showInSidebar: true,
    requiresAuth: true,
    children: [
      {
        id: "users-list",
        path: "/users",
        component: Users,
        title: "사용자 목록",
        parent: "users",
        showInSidebar: true,
        requiresAuth: true,
      },
      {
        id: "users-add",
        path: "/users/add",
        component: UsersAdd,
        title: "사용자 추가",
        parent: "users",
        showInSidebar: true,
        requiresAuth: true,
      },
      {
        id: "users-permissions",
        path: "/users/permissions",
        component: UsersPermissions,
        title: "권한 관리",
        parent: "users",
        showInSidebar: true,
        requiresAuth: true,
      },
      {
        id: "users-edit",
        path: "/users/edit/:id",
        component: UsersEdit,
        title: "사용자 수정",
        parent: "users",
        showInSidebar: false,
        requiresAuth: true,
      },
      {
        id: "users-detail",
        path: "/users/detail/:id",
        component: UsersDetail,
        title: "사용자 보기",
        parent: "users",
        showInSidebar: false,
        requiresAuth: true,
      },
    ],
  },
  {
    id: "departments",
    path: "/departments",
    component: Departments,
    title: "부서 관리",
    icon: Building2,
    showInSidebar: true,
    requiresAuth: true,
    children: [
      {
        id: "departments-list",
        path: "/departments",
        component: Departments,
        title: "부서 목록",
        parent: "departments",
        showInSidebar: true,
        requiresAuth: true,
      },
      {
        id: "departments-add",
        path: "/departments/add",
        component: DepartmentsAdd,
        title: "부서 추가",
        parent: "departments",
        showInSidebar: true,
        requiresAuth: true,
      },
      {
        id: "departments-edit",
        path: "/departments/edit/:id",
        component: DepartmentsEdit,
        title: "부서 수정",
        parent: "departments",
        showInSidebar: false,
        requiresAuth: true,
      },
      {
        id: "departments-detail",
        path: "/departments/detail/:id",
        component: DepartmentsDetail,
        title: "부서 상세",
        parent: "departments",
        showInSidebar: false,
        requiresAuth: true,
      },
    ],
  },
  {
    id: "locations",
    path: "/locations",
    component: Locations,
    title: "위치 관리",
    icon: MapPin,
    showInSidebar: true,
    requiresAuth: true,
    children: [
      {
        id: "locations-list",
        path: "/locations",
        component: Locations,
        title: "위치 목록",
        parent: "locations",
        showInSidebar: true,
        requiresAuth: true,
      },
      {
        id: "locations-add",
        path: "/locations/add",
        component: LocationsAdd,
        title: "위치 추가",
        parent: "locations",
        showInSidebar: true,
        requiresAuth: true,
      },
      {
        id: "locations-map",
        path: "/locations/map",
        component: LocationsMap,
        title: "위치 지도",
        parent: "locations",
        showInSidebar: true,
        requiresAuth: true,
      },
      {
        id: "locations-edit",
        path: "/locations/edit/:id",
        component: LocationsEdit,
        title: "위치 수정",
        parent: "locations",
        showInSidebar: false,
        requiresAuth: true,
      },
      {
        id: "locations-detail",
        path: "/locations/detail/:id",
        component: LocationsDetail,
        title: "위치 상세",
        parent: "locations",
        showInSidebar: false,
        requiresAuth: true,
      },
    ],
  },
  {
    id: "settings",
    path: "/settings/*",
    component: Settings,
    title: "설정",
    icon: SettingsIcon,
    showInSidebar: true,
    requiresAuth: true,
  },
];

// 모든 라우트를 평면화하여 배열로 반환 (중첩 라우트 포함)
export const flattenRoutes = (routesArray) => {
  let flatRoutes = [];

  routesArray.forEach((route) => {
    // 메인 라우트 추가
    const { children, ...routeWithoutChildren } = route;
    flatRoutes.push(routeWithoutChildren);

    // 자식 라우트가 있으면 재귀적으로 추가
    if (children && children.length > 0) {
      flatRoutes = [...flatRoutes, ...children];
    }
  });

  return flatRoutes;
};

// 사이드바에 표시할 라우트만 필터링 - 수정된 부분
export const getSidebarRoutes = () => {
  return routes.filter((route) => {
    if (!route.showInSidebar) return false;

    // 하위 라우트도 필터링
    if (route.children) {
      route.children = route.children.filter((child) => child.showInSidebar);
    }

    return true;
  });
};

// 모든 라우트 반환 (React Router에서 사용)
export const getAllRoutes = () => {
  return flattenRoutes(routes);
};

// 특정 경로에 해당하는 라우트 정보 찾기
export const findRouteByPath = (path) => {
  const allRoutes = flattenRoutes(routes);

  // 경로에 파라미터가 있는 경우 처리 (예: /assets/detail/1)
  if (path.includes("/")) {
    const pathParts = path.split("/");
    const potentialRoutes = allRoutes.filter((route) => {
      const routeParts = route.path.split("/");
      if (routeParts.length !== pathParts.length) return false;

      // 각 부분을 비교하되, :id와 같은 파라미터는 무시
      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(":")) continue;
        if (routeParts[i] !== pathParts[i]) return false;
      }
      return true;
    });

    // 파라미터가 있는 라우트 중 parent 속성이 있는 것을 우선
    const subRoute = potentialRoutes.find((route) => route.parent);
    if (subRoute) return subRoute;
  }

  // 먼저 parent 속성이 있는 라우트를 찾습니다 (서브메뉴 우선)
  const subRoute = allRoutes.find(
    (route) => route.path === path && route.parent
  );

  // 서브메뉴가 있으면 그것을 반환, 없으면 일반 경로 반환
  return subRoute || allRoutes.find((route) => route.path === path);
};

// 특정 ID에 해당하는 라우트 정보 찾기
export const findRouteById = (id) => {
  const allRoutes = flattenRoutes(routes);
  return allRoutes.find((route) => route.id === id);
};

// Breadcrumb 생성을 위한 경로 계층 구조 가져오기
export const getBreadcrumbsForPath = (path) => {
  const allRoutes = flattenRoutes(routes);

  // 경로에 파라미터가 있는 경우 처리
  let currentRoute;
  if (path.includes("/")) {
    const pathParts = path.split("/");
    const potentialRoutes = allRoutes.filter((route) => {
      const routeParts = route.path.split("/");
      if (routeParts.length !== pathParts.length) return false;

      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(":")) continue;
        if (routeParts[i] !== pathParts[i]) return false;
      }
      return true;
    });

    // 파라미터가 있는 라우트 중 parent 속성이 있는 것을 우선
    currentRoute =
      potentialRoutes.find((route) => route.parent) || potentialRoutes[0];
  }

  // 일반 경로 처리
  if (!currentRoute) {
    // 먼저 parent 속성이 있는 라우트를 찾  || potentialRoutes[0]
  }

  // 일반 경로 처리
  if (!currentRoute) {
    // 먼저 parent 속성이 있는 라우트를 찾습니다 (서브메뉴 우선)
    const subRoute = allRoutes.find(
      (route) => route.path === path && route.parent
    );
    currentRoute = subRoute || allRoutes.find((route) => route.path === path);
  }

  if (!currentRoute) return [];

  const breadcrumbs = [currentRoute];

  // 부모 경로를 찾아 breadcrumbs 배열에 추가
  let parentId = currentRoute.parent;
  while (parentId) {
    const parentRoute = allRoutes.find((route) => route.id === parentId);
    if (parentRoute) {
      breadcrumbs.unshift(parentRoute);
      parentId = parentRoute.parent;
    } else {
      break;
    }
  }

  return breadcrumbs;
};

export default routes;
