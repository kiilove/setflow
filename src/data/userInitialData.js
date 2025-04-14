/**
 * 사용자 초기 데이터
 * 사용자 정보와 권한 템플릿을 통합하여 관리합니다.
 */
const userInitialData = [
  {
    name: "홍길동",
    email: "hong@example.com",
    phone: "010-1234-5678",
    department: "개발팀",
    position: "팀장",
    employeeId: "EMP-2021-001",
    joinDate: "2021-03-15",
    status: "재직중",
    role: "관리자",
    location: "본사 3층",
    profileImage: null,
  },
  {
    name: "김철수",
    email: "kim@example.com",
    phone: "010-2345-6789",
    department: "마케팅팀",
    position: "팀원",
    employeeId: "EMP-2022-001",
    joinDate: "2022-01-10",
    status: "재직중",
    role: "편집자",
    location: "본사 2층",
    profileImage: null,
  },
  {
    name: "이영희",
    email: "lee@example.com",
    phone: "010-3456-7890",
    department: "디자인팀",
    position: "팀원",
    employeeId: "EMP-2020-005",
    joinDate: "2020-11-05",
    status: "휴직중",
    role: "사용자",
    location: "본사 2층",
    profileImage: null,
  },
  {
    name: "박지민",
    email: "park@example.com",
    phone: "010-4567-8901",
    department: "영업팀",
    position: "팀원",
    employeeId: "EMP-2022-010",
    joinDate: "2022-05-20",
    status: "재직중",
    role: "사용자",
    location: "지사 1층",
    profileImage: null,
  },
  {
    name: "최민수",
    email: "choi@example.com",
    phone: "010-5678-9012",
    department: "인사팀",
    position: "팀장",
    employeeId: "EMP-2021-008",
    joinDate: "2021-08-15",
    status: "재직중",
    role: "편집자",
    location: "본사 1층",
    profileImage: null,
  },
];

// 역할 정보
export const userRoles = [
  {
    id: "admin",
    name: "관리자",
    description: "모든 기능에 접근 가능한 최고 권한",
    permissions: {
      dashboard: true,
      users: true,
      assets: true,
      finance: true,
      reports: true,
      settings: true,
      maintenance: true,
      categories: true,
    },
  },
  {
    id: "editor",
    name: "편집자",
    description: "대부분의 기능에 접근 가능하나 일부 제한됨",
    permissions: {
      dashboard: true,
      users: false,
      assets: true,
      finance: true,
      reports: true,
      settings: false,
      maintenance: true,
      categories: false,
    },
  },
  {
    id: "user",
    name: "사용자",
    description: "기본적인 조회 기능만 접근 가능",
    permissions: {
      dashboard: true,
      users: false,
      assets: false,
      finance: false,
      reports: false,
      settings: false,
      maintenance: false,
      categories: false,
    },
  },
];

// 부서 정보
export const departments = [
  { id: "dev", name: "개발팀", description: "소프트웨어 개발 및 유지보수" },
  { id: "marketing", name: "마케팅팀", description: "마케팅 전략 및 실행" },
  { id: "design", name: "디자인팀", description: "UI/UX 및 그래픽 디자인" },
  { id: "sales", name: "영업팀", description: "영업 및 고객 관리" },
  { id: "hr", name: "인사팀", description: "인사 및 채용 관리" },
  { id: "finance", name: "재무팀", description: "재무 및 회계 관리" },
  { id: "it", name: "IT 인프라팀", description: "IT 인프라 관리 및 지원" },
  { id: "support", name: "고객지원팀", description: "고객 지원 및 서비스" },
];

export default userInitialData;
