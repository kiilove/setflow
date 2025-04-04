/**
 * 중앙화된 더미 데이터
 * 프로젝트 전체에서 사용되는 더미 데이터를 한 곳에서 관리합니다.
 * 추후 실제 데이터로 대체될 예정입니다.
 */

// 자산 데이터
export const assetsData = [
  {
    id: 1,
    name: "Dell XPS 15",
    category: "노트북",
    status: "활성",
    location: "본사 3층",
    assignedTo: "김철수",
    purchaseDate: "2022-03-15",
    purchasePrice: 2200000,
    currentValue: 1650000,
    nextMaintenanceDate: "2023-03-15",
    image: "/images/assets/laptop.jpg",
  },
  {
    id: 2,
    name: "HP LaserJet Pro",
    category: "프린터",
    status: "활성",
    location: "본사 2층",
    assignedTo: "공용",
    purchaseDate: "2021-11-20",
    purchasePrice: 450000,
    currentValue: 315000,
    nextMaintenanceDate: "2023-05-20",
    image: "/images/assets/printer.jpg",
  },
  {
    id: 3,
    name: "회의실 프로젝터",
    category: "프로젝터",
    status: "수리중",
    location: "본사 회의실A",
    assignedTo: "공용",
    purchaseDate: "2020-06-10",
    purchasePrice: 1200000,
    currentValue: 600000,
    nextMaintenanceDate: "2023-01-10",
    image: "/images/assets/projector.jpg",
  },
  {
    id: 4,
    name: "사무용 책상",
    category: "가구",
    status: "활성",
    location: "본사 3층",
    assignedTo: "박지민",
    purchaseDate: "2022-01-05",
    purchasePrice: 350000,
    currentValue: 280000,
    nextMaintenanceDate: null,
    image: "/images/assets/desk.jpg",
  },
  {
    id: 5,
    name: "iPhone 13 Pro",
    category: "모바일기기",
    status: "활성",
    location: "외부",
    assignedTo: "이지은",
    purchaseDate: "2022-04-28",
    purchasePrice: 1350000,
    currentValue: 1080000,
    nextMaintenanceDate: "2023-04-28",
    image: "/images/assets/phone.jpg",
  },
  {
    id: 6,
    name: "LG 울트라와이드 모니터",
    category: "모니터",
    status: "활성",
    location: "본사 3층",
    assignedTo: "김철수",
    purchaseDate: "2022-02-15",
    purchasePrice: 550000,
    currentValue: 440000,
    nextMaintenanceDate: null,
    image: "/images/assets/monitor.jpg",
  },
  {
    id: 7,
    name: "회의실 테이블",
    category: "가구",
    status: "활성",
    location: "본사 회의실B",
    assignedTo: "공용",
    purchaseDate: "2021-09-10",
    purchasePrice: 1200000,
    currentValue: 960000,
    nextMaintenanceDate: null,
    image: "/images/assets/table.jpg",
  },
  {
    id: 8,
    name: "Logitech MX Master 3",
    category: "주변기기",
    status: "활성",
    location: "본사 3층",
    assignedTo: "박지민",
    purchaseDate: "2022-05-10",
    purchasePrice: 120000,
    currentValue: 108000,
    nextMaintenanceDate: null,
    image: "/images/assets/mouse.jpg",
  },
  {
    id: 9,
    name: "삼성 갤럭시 탭 S7",
    category: "태블릿",
    status: "수리중",
    location: "서비스센터",
    assignedTo: "홍길동",
    purchaseDate: "2021-12-20",
    purchasePrice: 900000,
    currentValue: 630000,
    nextMaintenanceDate: "2023-06-20",
    image: "/images/assets/tablet.jpg",
  },
  {
    id: 10,
    name: "사무용 의자",
    category: "가구",
    status: "활성",
    location: "본사 2층",
    assignedTo: "이지은",
    purchaseDate: "2022-01-05",
    purchasePrice: 250000,
    currentValue: 200000,
    nextMaintenanceDate: null,
    image: "/images/assets/chair.jpg",
  },
];

// 대시보드 요약 데이터
export const dashboardSummary = {
  totalAssets: 156,
  activeAssets: 142,
  inactiveAssets: 14,
  totalValue: 187500000,
  depreciationThisYear: 24500000,
  maintenanceCostsThisYear: 8700000,
  assetsByCategory: [
    { name: "컴퓨터/노트북", value: 45 },
    { name: "모바일기기", value: 32 },
    { name: "가구", value: 28 },
    { name: "네트워크장비", value: 18 },
    { name: "주변기기", value: 15 },
    { name: "기타", value: 18 },
  ],
  assetsByLocation: [
    { name: "본사", value: 98 },
    { name: "지사A", value: 25 },
    { name: "지사B", value: 18 },
    { name: "외부/재택", value: 15 },
  ],
  recentActivities: [
    {
      id: 1,
      type: "자산등록",
      assetName: "Dell XPS 15",
      user: "김관리자",
      date: "2023-06-15T09:30:00",
    },
    {
      id: 2,
      type: "자산할당",
      assetName: "iPhone 13 Pro",
      user: "이지은",
      date: "2023-06-14T14:20:00",
    },
    {
      id: 3,
      type: "유지보수",
      assetName: "회의실 프로젝터",
      user: "박기술",
      date: "2023-06-12T11:15:00",
    },
    {
      id: 4,
      type: "자산반납",
      assetName: "삼성 갤럭시 탭 S7",
      user: "홍길동",
      date: "2023-06-10T16:45:00",
    },
    {
      id: 5,
      type: "자산폐기",
      assetName: "구형 데스크탑 PC",
      user: "김관리자",
      date: "2023-06-08T10:30:00",
    },
  ],
  upcomingMaintenance: [
    {
      id: 1,
      assetName: "서버 장비 A",
      dueDate: "2023-06-25",
      assignedTo: "박기술",
      priority: "높음",
    },
    {
      id: 2,
      assetName: "네트워크 스위치",
      dueDate: "2023-06-28",
      assignedTo: "김네트워크",
      priority: "중간",
    },
    {
      id: 3,
      assetName: "보안 시스템",
      dueDate: "2023-07-05",
      assignedTo: "이보안",
      priority: "높음",
    },
  ],
};

// 유지보수 데이터
export const maintenanceData = [
  {
    id: 1,
    assetId: 3,
    assetName: "회의실 프로젝터",
    type: "정기점검",
    status: "완료",
    scheduledDate: "2023-01-10",
    completedDate: "2023-01-10",
    technician: "박기술",
    cost: 150000,
    notes: "램프 교체 및 광학장치 청소 완료",
  },
  {
    id: 2,
    assetId: 2,
    assetName: "HP LaserJet Pro",
    type: "수리",
    status: "완료",
    scheduledDate: "2023-02-15",
    completedDate: "2023-02-16",
    technician: "이수리",
    cost: 220000,
    notes: "토너 카트리지 교체 및 롤러 청소",
  },
  {
    id: 3,
    assetId: 9,
    assetName: "삼성 갤럭시 탭 S7",
    type: "수리",
    status: "진행중",
    scheduledDate: "2023-06-20",
    completedDate: null,
    technician: "김태블릿",
    cost: null,
    notes: "화면 깨짐 수리 중",
  },
  {
    id: 4,
    assetId: 1,
    assetName: "Dell XPS 15",
    type: "정기점검",
    status: "예정",
    scheduledDate: "2023-09-15",
    completedDate: null,
    technician: "박기술",
    cost: null,
    notes: "1년 정기 점검 예정",
  },
  {
    id: 5,
    assetId: 5,
    assetName: "iPhone 13 Pro",
    type: "정기점검",
    status: "예정",
    scheduledDate: "2023-10-28",
    completedDate: null,
    technician: "이모바일",
    cost: null,
    notes: "배터리 상태 확인 및 소프트웨어 업데이트",
  },
];

// 재무 데이터
export const financeData = {
  assetValueByCategory: [
    { name: "컴퓨터/노트북", value: 68500000 },
    { name: "모바일기기", value: 42300000 },
    { name: "가구", value: 24800000 },
    { name: "네트워크장비", value: 35700000 },
    { name: "주변기기", value: 8200000 },
    { name: "기타", value: 8000000 },
  ],
  depreciationByYear: [
    { year: "2020", value: 18500000 },
    { year: "2021", value: 21300000 },
    { year: "2022", value: 23700000 },
    { year: "2023", value: 24500000 },
  ],
  maintenanceCostsByQuarter: [
    { quarter: "2022 Q1", value: 1800000 },
    { quarter: "2022 Q2", value: 2200000 },
    { quarter: "2022 Q3", value: 1500000 },
    { quarter: "2022 Q4", value: 2500000 },
    { quarter: "2023 Q1", value: 2700000 },
    { quarter: "2023 Q2", value: 3200000 },
  ],
  costsByDepartment: [
    { name: "IT부서", value: 85000000 },
    { name: "영업부", value: 45000000 },
    { name: "인사부", value: 25000000 },
    { name: "마케팅부", value: 32500000 },
  ],
};

// 사용자 데이터
export const userData = [
  {
    id: 1,
    name: "김관리자",
    email: "admin@example.com",
    role: "관리자",
    department: "IT부서",
    assignedAssets: 2,
  },
  {
    id: 2,
    name: "이지은",
    email: "lee@example.com",
    role: "일반사용자",
    department: "마케팅부",
    assignedAssets: 3,
  },
  {
    id: 3,
    name: "박지민",
    email: "park@example.com",
    role: "일반사용자",
    department: "영업부",
    assignedAssets: 2,
  },
  {
    id: 4,
    name: "김철수",
    email: "kim@example.com",
    role: "일반사용자",
    department: "IT부서",
    assignedAssets: 3,
  },
  {
    id: 5,
    name: "홍길동",
    email: "hong@example.com",
    role: "일반사용자",
    department: "인사부",
    assignedAssets: 1,
  },
];

// 백업 데이터
export const backupHistory = [
  {
    id: 1,
    date: "2023-06-15T09:30:00",
    size: "24.5 MB",
    status: "성공",
    createdBy: "김관리자",
    notes: "정기 백업",
  },
  {
    id: 2,
    date: "2023-06-01T10:15:00",
    size: "24.2 MB",
    status: "성공",
    createdBy: "시스템",
    notes: "자동 백업",
  },
  {
    id: 3,
    date: "2023-05-15T14:20:00",
    size: "23.8 MB",
    status: "성공",
    createdBy: "김관리자",
    notes: "정기 백업",
  },
  {
    id: 4,
    date: "2023-05-01T10:15:00",
    size: "23.5 MB",
    status: "성공",
    createdBy: "시스템",
    notes: "자동 백업",
  },
  {
    id: 5,
    date: "2023-04-15T11:30:00",
    size: "23.1 MB",
    status: "성공",
    createdBy: "김관리자",
    notes: "정기 백업",
  },
];

// 카테고리 데이터 추가
export const categoriesData = [
  {
    id: 1,
    name: "데스크탑",
    description: "데스크탑 컴퓨터 및 워크스테이션",
    count: 15,
    specFieldsCount: 6,
    icon: "Monitor",
    iconColor: "bg-blue-100",
    iconTextColor: "text-blue-500",
    iconColorName: "파랑",
    depreciation: {
      method: "straight-line",
      years: 4,
      residualValueType: "percentage",
      residualValue: 10,
    },
  },
  {
    id: 2,
    name: "노트북",
    description: "노트북 및 휴대용 컴퓨터",
    count: 28,
    specFieldsCount: 8,
    icon: "Laptop",
    iconColor: "bg-purple-100",
    iconTextColor: "text-purple-500",
    iconColorName: "보라",
    depreciation: {
      method: "straight-line",
      years: 3,
      residualValueType: "fixed",
      residualValue: 100000,
    },
  },
  {
    id: 3,
    name: "모니터",
    description: "모니터 및 디스플레이 장치",
    count: 22,
    specFieldsCount: 6,
    icon: "Tv",
    iconColor: "bg-green-100",
    iconTextColor: "text-green-500",
    iconColorName: "초록",
    depreciation: {
      method: "straight-line",
      years: 5,
      residualValueType: "percentage",
      residualValue: 5,
    },
  },
  {
    id: 4,
    name: "모바일기기",
    description: "스마트폰, 태블릿 등 모바일 기기",
    count: 18,
    specFieldsCount: 7,
    icon: "Smartphone",
    iconColor: "bg-yellow-100",
    iconTextColor: "text-yellow-500",
    iconColorName: "노랑",
    depreciation: {
      method: "straight-line",
      years: 2,
      residualValueType: "fixed",
      residualValue: 50000,
    },
  },
  {
    id: 5,
    name: "주변기기",
    description: "키보드, 마우스, 웹캠 등 주변기기",
    count: 35,
    specFieldsCount: 3,
    icon: "Mouse",
    iconColor: "bg-red-100",
    iconTextColor: "text-red-500",
    iconColorName: "빨강",
    depreciation: {
      method: "straight-line",
      years: 3,
      residualValueType: "percentage",
      residualValue: 10,
    },
  },
  {
    id: 6,
    name: "사무기기",
    description: "프린터, 스캐너, 복합기 등 사무기기",
    count: 12,
    specFieldsCount: 4,
    icon: "Printer",
    iconColor: "bg-orange-100",
    iconTextColor: "text-orange-500",
    iconColorName: "주황",
    depreciation: {
      method: "straight-line",
      years: 5,
      residualValueType: "fixed",
      residualValue: 100000,
    },
  },
  {
    id: 7,
    name: "서버",
    description: "서버 및 서버 관련 장비",
    count: 8,
    specFieldsCount: 6,
    icon: "Server",
    iconColor: "bg-indigo-100",
    iconTextColor: "text-indigo-500",
    iconColorName: "남색",
    depreciation: {
      method: "straight-line",
      years: 4,
      residualValueType: "percentage",
      residualValue: 12,
    },
  },
  {
    id: 8,
    name: "네트워크장비",
    description: "라우터, 스위치 등 네트워크 장비",
    count: 14,
    specFieldsCount: 4,
    icon: "Network",
    iconColor: "bg-teal-100",
    iconTextColor: "text-teal-500",
    iconColorName: "청록",
    depreciation: {
      method: "straight-line",
      years: 3,
      residualValueType: "fixed",
      residualValue: 50000,
    },
  },
  {
    id: 9,
    name: "소프트웨어",
    description: "소프트웨어 및 라이센스",
    count: 42,
    specFieldsCount: 4,
    icon: "FileCode",
    iconColor: "bg-pink-100",
    iconTextColor: "text-pink-500",
    iconColorName: "분홍",
    depreciation: {
      method: "straight-line",
      years: 1,
      residualValueType: "fixed",
      residualValue: 0,
    },
  },
  {
    id: 10,
    name: "가구",
    description: "책상, 의자 등 사무용 가구",
    count: 56,
    specFieldsCount: 4,
    icon: "Armchair",
    iconColor: "bg-gray-100",
    iconTextColor: "text-gray-500",
    iconColorName: "기본",
    depreciation: {
      method: "straight-line",
      years: 7,
      residualValueType: "percentage",
      residualValue: 2,
    },
  },
  {
    id: 11,
    name: "기타",
    description: "기타 분류되지 않은 자산",
    count: 8,
    specFieldsCount: 0,
    icon: "Package",
    iconColor: "bg-gray-100",
    iconTextColor: "text-gray-500",
    iconColorName: "기본",
    depreciation: {
      method: "straight-line",
      years: 5,
      residualValueType: "fixed",
      residualValue: 10000,
    },
  },
];

// 데이터 접근 함수
// 이 함수들은 추후 실제 API 호출로 대체될 예정입니다.
export const fetchData = {
  // 자산 데이터 가져오기
  getAssets: () => {
    return Promise.resolve(assetsData);
  },

  // 자산 상세 정보 가져오기
  getAssetById: (id) => {
    const asset = assetsData.find((asset) => asset.id === Number.parseInt(id));
    return Promise.resolve(asset || null);
  },

  // 대시보드 요약 데이터 가져오기
  getDashboardSummary: () => {
    return Promise.resolve(dashboardSummary);
  },

  // 유지보수 데이터 가져오기
  getMaintenance: () => {
    return Promise.resolve(maintenanceData);
  },

  // 재무 데이터 가져오기
  getFinanceData: () => {
    return Promise.resolve(financeData);
  },

  // 사용자 데이터 가져오기
  getUsers: () => {
    return Promise.resolve(userData);
  },

  // 백업 이력 가져오기
  getBackupHistory: () => {
    return Promise.resolve(backupHistory);
  },

  // 자산 추가하기 (더미 함수)
  addAsset: (asset) => {
    console.log("자산 추가:", asset);
    return Promise.resolve({ success: true, id: Date.now() });
  },

  // 자산 업데이트하기 (더미 함수)
  updateAsset: (id, asset) => {
    console.log(`자산 ID ${id} 업데이트:`, asset);
    return Promise.resolve({ success: true });
  },

  // 자산 삭제하기 (더미 함수)
  deleteAsset: (id) => {
    console.log(`자산 ID ${id} 삭제`);
    return Promise.resolve({ success: true });
  },

  // 백업 생성하기 (더미 함수)
  createBackup: () => {
    const newBackup = {
      id: Date.now(),
      date: new Date().toISOString(),
      size: "24.8 MB",
      status: "성공",
      createdBy: "김관리자",
      notes: "수동 백업",
    };
    console.log("백업 생성:", newBackup);
    return Promise.resolve({ success: true, backup: newBackup });
  },

  // 백업 복원하기 (더미 함수)
  restoreBackup: (id) => {
    console.log(`백업 ID ${id} 복원`);
    return Promise.resolve({ success: true });
  },

  // 카테고리 데이터 가져오기
  getCategories: () => {
    return Promise.resolve(categoriesData);
  },

  // 카테고리 상세 정보 가져오기
  getCategoryById: (id) => {
    const category = categoriesData.find(
      (category) => category.id === Number.parseInt(id)
    );
    return Promise.resolve(category || null);
  },

  // 카테고리 추가하기 (더미 함수)
  addCategory: (category) => {
    console.log("카테고리 추가:", category);
    return Promise.resolve({ success: true, id: Date.now() });
  },

  // 카테고리 업데이트하기 (더미 함수)
  updateCategory: (id, category) => {
    console.log(`카테고리 ID ${id} 업데이트:`, category);
    return Promise.resolve({ success: true });
  },

  // 카테고리 삭제하기 (더미 함수)
  deleteCategory: (id) => {
    console.log(`카테고리 ID ${id} 삭제`);
    return Promise.resolve({ success: true });
  },
};

// 데이터 접근을 위한 전역 변수
export const dataService = fetchData;
