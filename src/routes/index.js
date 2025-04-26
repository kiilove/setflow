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
import AssetsEdit from "../pages/assets/AssetsEdit";

// 자산 카테고리
import Categories from "../pages/categories/Categories";
import CategoriesAdd from "../pages/categories/CategoriesAdd";
import CategoriesTemplate from "../pages/categories/CategoriesTemplate";
import CategoriesEdit from "../pages/categories/CategoriesEdit";
import CategoriesDetail from "../pages/categories/CategoriesDetail";

// 유지보수
import Maintenance from "../pages/maintenance/Maintenance";
import MaintenanceSchedule from "../pages/maintenance/MaintenanceSchedule";
import MaintenanceAdd from "../pages/maintenance/MaintenanceAdd";
import MaintenanceEdit from "../pages/maintenance/MaintenanceEdit";
import MaintenanceDetail from "../pages/maintenance/MaintenanceDetail";

// 보고서
import Reports from "../pages/reports/Reports";
import ReportsAssets from "../pages/reports/ReportsAssets";
import ReportsDepreciation from "../pages/reports/ReportsDepreciation";
import ReportsMaintenance from "../pages/reports/ReportsMaintenance";

// 위치 관리
import Locations from "../pages/locations/Locations";
import LocationsAdd from "../pages/locations/LocationsAdd";
import LocationsMap from "../pages/locations/LocationsMapOld";
import LocationsEdit from "../pages/locations/LocationsEdit";
import LocationsDetail from "../pages/locations/LocationsDetail";

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

// 클라이언트 PC
import ClientPCs from "../pages/client-pcs/ClientPCs";

// 공통 라우트 설정
const createRoute = (config) => ({
  requiresAuth: true,
  showInSidebar: true,
  standalone: false,
  ...config,
});

// 인증 관련 라우트
const authRoutes = [
  createRoute({
    id: "root",
    path: "/",
    component: CheckAuth,
    title: "인증 확인",
    showInSidebar: false,
    standalone: true,
  }),
  createRoute({
    id: "login",
    path: "/auth/login",
    component: Login,
    title: "로그인",
    showInSidebar: false,
    standalone: true,
    requiresAuth: false,
  }),
  createRoute({
    id: "register",
    path: "/auth/register",
    component: Register,
    title: "회원가입",
    showInSidebar: false,
    standalone: true,
    requiresAuth: false,
  }),
  createRoute({
    id: "forgot-password",
    path: "/auth/forgot-password",
    component: ForgotPassword,
    title: "비밀번호 찾기",
    showInSidebar: false,
    standalone: true,
    requiresAuth: false,
  }),
  createRoute({
    id: "terms",
    path: "/terms",
    component: Terms,
    title: "이용약관",
    showInSidebar: false,
    standalone: true,
    requiresAuth: false,
  }),
];

// 대시보드 관련 라우트
const dashboardRoutes = [
  createRoute({
    id: "home",
    path: "/home",
    component: Home,
    title: "홈",
    icon: HomeIcon,
  }),
  createRoute({
    id: "dashboard",
    path: "/dashboard",
    component: Dashboard,
    title: "대시보드",
    icon: LayoutDashboard,
    children: [
      createRoute({
        id: "dashboard-overview",
        path: "/dashboard",
        component: Dashboard,
        title: "개요",
        parent: "dashboard",
      }),
      createRoute({
        id: "client-pcs",
        path: "/client-pcs",
        component: ClientPCs,
        title: "클라이언트 PC",
        parent: "dashboard",
        icon: Laptop,
      }),
    ],
  }),
];

// 자산 관리 관련 라우트
const assetRoutes = [
  createRoute({
    id: "assets",
    path: "/assets",
    component: Assets,
    title: "자산 관리",
    icon: Package,
    children: [
      createRoute({
        id: "assets-list",
        path: "/assets",
        component: Assets,
        title: "자산 목록",
        parent: "assets",
      }),
      createRoute({
        id: "assets-add",
        path: "/assets/add",
        component: AssetsAdd,
        title: "자산 등록",
        parent: "assets",
      }),
      createRoute({
        id: "assets-detail",
        path: "/assets/detail/:id",
        component: AssetsDetail,
        title: "자산 상세",
        parent: "assets",
        showInSidebar: false,
      }),
      createRoute({
        id: "assets-history",
        path: "/assets/history",
        component: AssetsHistory,
        title: "자산 이력",
        parent: "assets",
      }),
      createRoute({
        id: "assets-edit",
        path: "/assets/edit/:id",
        component: AssetsEdit,
        title: "자산 수정",
        parent: "assets",
        showInSidebar: false,
      }),
    ],
  }),
];

// 자산 카테고리 관련 라우트
const categoryRoutes = [
  createRoute({
    id: "categories",
    path: "/categories",
    component: Categories,
    title: "자산 카테고리",
    icon: ListTodo,
    children: [
      createRoute({
        id: "categories-list",
        path: "/categories",
        component: Categories,
        title: "카테고리 목록",
        parent: "categories",
      }),
      createRoute({
        id: "categories-add",
        path: "/categories/add",
        component: CategoriesAdd,
        title: "카테고리 등록",
        parent: "categories",
      }),
      createRoute({
        id: "categories-detail",
        path: "/categories/detail/:id",
        component: CategoriesDetail,
        title: "카테고리 상세",
        parent: "categories",
        showInSidebar: false,
      }),
      createRoute({
        id: "categories-edit",
        path: "/categories/edit/:id",
        component: CategoriesEdit,
        title: "카테고리 수정",
        parent: "categories",
        showInSidebar: false,
      }),
      createRoute({
        id: "categories-template",
        path: "/categories/template",
        component: CategoriesTemplate,
        title: "카테고리 템플릿",
        parent: "categories",
      }),
    ],
  }),
];

// 유지보수 관련 라우트
const maintenanceRoutes = [
  createRoute({
    id: "maintenance",
    path: "/maintenance",
    component: Maintenance,
    title: "유지보수",
    icon: Wrench,
    children: [
      createRoute({
        id: "maintenance-list",
        path: "/maintenance",
        component: Maintenance,
        title: "유지보수 목록",
        parent: "maintenance",
      }),
      createRoute({
        id: "maintenance-add",
        path: "/maintenance/add",
        component: MaintenanceAdd,
        title: "유지보수 등록",
        parent: "maintenance",
      }),
      createRoute({
        id: "maintenance-detail",
        path: "/maintenance/detail/:id",
        component: MaintenanceDetail,
        title: "유지보수 상세",
        parent: "maintenance",
        showInSidebar: false,
      }),
      createRoute({
        id: "maintenance-edit",
        path: "/maintenance/edit/:id",
        component: MaintenanceEdit,
        title: "유지보수 수정",
        parent: "maintenance",
        showInSidebar: false,
      }),
      createRoute({
        id: "maintenance-schedule",
        path: "/maintenance/schedule",
        component: MaintenanceSchedule,
        title: "유지보수 스케줄",
        parent: "maintenance",
      }),
    ],
  }),
];

// 보고서 관련 라우트
const reportRoutes = [
  createRoute({
    id: "reports",
    path: "/reports",
    component: Reports,
    title: "보고서",
    icon: BarChart3,
    children: [
      createRoute({
        id: "reports-assets",
        path: "/reports/assets",
        component: ReportsAssets,
        title: "자산 보고서",
        parent: "reports",
      }),
      createRoute({
        id: "reports-depreciation",
        path: "/reports/depreciation",
        component: ReportsDepreciation,
        title: "감가상각 보고서",
        parent: "reports",
      }),
      createRoute({
        id: "reports-maintenance",
        path: "/reports/maintenance",
        component: ReportsMaintenance,
        title: "유지보수 보고서",
        parent: "reports",
      }),
    ],
  }),
];

// 위치 관리 관련 라우트
const locationRoutes = [
  createRoute({
    id: "locations",
    path: "/locations",
    component: Locations,
    title: "위치 관리",
    icon: MapPin,
    children: [
      createRoute({
        id: "locations-list",
        path: "/locations",
        component: Locations,
        title: "위치 목록",
        parent: "locations",
      }),
      createRoute({
        id: "locations-add",
        path: "/locations/add",
        component: LocationsAdd,
        title: "위치 등록",
        parent: "locations",
      }),
      createRoute({
        id: "locations-detail",
        path: "/locations/detail/:id",
        component: LocationsDetail,
        title: "위치 상세",
        parent: "locations",
        showInSidebar: false,
      }),
      createRoute({
        id: "locations-edit",
        path: "/locations/edit/:id",
        component: LocationsEdit,
        title: "위치 수정",
        parent: "locations",
        showInSidebar: false,
      }),
      createRoute({
        id: "locations-map",
        path: "/locations/map",
        component: LocationsMap,
        title: "위치 지도",
        parent: "locations",
      }),
    ],
  }),
];

// 사용자 관리 관련 라우트
const userRoutes = [
  createRoute({
    id: "users",
    path: "/users",
    component: Users,
    title: "사용자 관리",
    icon: UsersIcon,
    children: [
      createRoute({
        id: "users-list",
        path: "/users",
        component: Users,
        title: "사용자 목록",
        parent: "users",
      }),
      createRoute({
        id: "users-add",
        path: "/users/add",
        component: UsersAdd,
        title: "사용자 등록",
        parent: "users",
      }),
      createRoute({
        id: "users-detail",
        path: "/users/detail/:id",
        component: UsersDetail,
        title: "사용자 상세",
        parent: "users",
        showInSidebar: false,
      }),
      createRoute({
        id: "users-edit",
        path: "/users/edit/:id",
        component: UsersEdit,
        title: "사용자 수정",
        parent: "users",
        showInSidebar: false,
      }),
      createRoute({
        id: "users-permissions",
        path: "/users/permissions",
        component: UsersPermissions,
        title: "권한 관리",
        parent: "users",
      }),
    ],
  }),
];

// 부서 관리 관련 라우트
const departmentRoutes = [
  createRoute({
    id: "departments",
    path: "/departments",
    component: Departments,
    title: "부서 관리",
    icon: Building2,
    children: [
      createRoute({
        id: "departments-list",
        path: "/departments",
        component: Departments,
        title: "부서 목록",
        parent: "departments",
      }),
      createRoute({
        id: "departments-add",
        path: "/departments/add",
        component: DepartmentsAdd,
        title: "부서 등록",
        parent: "departments",
      }),
      createRoute({
        id: "departments-detail",
        path: "/departments/detail/:id",
        component: DepartmentsDetail,
        title: "부서 상세",
        parent: "departments",
        showInSidebar: false,
      }),
      createRoute({
        id: "departments-edit",
        path: "/departments/edit/:id",
        component: DepartmentsEdit,
        title: "부서 수정",
        parent: "departments",
        showInSidebar: false,
      }),
    ],
  }),
];

// 설정 관련 라우트
const settingRoutes = [
  createRoute({
    id: "settings",
    path: "/settings/*",
    component: Settings,
    title: "설정",
    icon: SettingsIcon,
  }),
];

// 모든 라우트를 하나의 배열로 결합
const routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...assetRoutes,
  ...categoryRoutes,
  ...maintenanceRoutes,
  ...reportRoutes,
  ...locationRoutes,
  ...userRoutes,
  ...departmentRoutes,
  ...settingRoutes,
];

// 라우트 헬퍼 함수들
export const flattenRoutes = (routesArray) => {
  return routesArray.reduce((acc, route) => {
    acc.push(route);
    if (route.children) {
      acc.push(...flattenRoutes(route.children));
    }
    return acc;
  }, []);
};

export const getSidebarRoutes = () => {
  return routes
    .map((route) => {
      if (route.children) {
        return {
          ...route,
          children: route.children.filter((child) => child.showInSidebar),
        };
      }
      return route;
    })
    .filter((route) => route.showInSidebar);
};

export const getAllRoutes = () => {
  return flattenRoutes(routes);
};

export const findRouteByPath = (path) => {
  const allRoutes = flattenRoutes(routes);
  return allRoutes.find((route) => {
    if (route.path.includes(":id")) {
      const pathPattern = new RegExp(
        "^" + route.path.replace(/:id/g, "[^/]+") + "$"
      );
      return pathPattern.test(path);
    }
    return route.path === path;
  });
};

export const findRouteById = (id) => {
  const allRoutes = flattenRoutes(routes);
  return allRoutes.find((route) => route.id === id);
};

export const getBreadcrumbsForPath = (path) => {
  const route = findRouteByPath(path);
  if (!route) return [];

  const breadcrumbs = [];
  let currentRoute = route;

  while (currentRoute) {
    breadcrumbs.unshift({
      title: currentRoute.title,
      path: currentRoute.path,
    });

    if (currentRoute.parent) {
      currentRoute = findRouteById(currentRoute.parent);
    } else {
      currentRoute = null;
    }
  }

  return breadcrumbs;
};

export default routes;
