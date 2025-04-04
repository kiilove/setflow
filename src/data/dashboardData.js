// 대시보드 기본 데이터
export const getDashboardData = () => {
  return {
    assetStats: {
      total: 256,
      active: 198,
      maintenance: 32,
      inactive: 26,
    },
    recentActivities: [
      {
        id: 1,
        type: "add",
        item: "노트북 Dell XPS 15",
        user: "김철수",
        timestamp: "2023-04-01T09:30:00",
      },
      {
        id: 2,
        type: "update",
        item: "모니터 LG 27인치",
        user: "이영희",
        timestamp: "2023-04-01T10:15:00",
      },
      {
        id: 3,
        type: "maintenance",
        item: "프린터 HP LaserJet",
        user: "박지민",
        timestamp: "2023-04-01T11:45:00",
      },
      {
        id: 4,
        type: "assign",
        item: "태블릿 iPad Pro",
        user: "최민수",
        timestamp: "2023-04-01T13:20:00",
      },
      {
        id: 5,
        type: "return",
        item: "키보드 Logitech MX",
        user: "정수진",
        timestamp: "2023-04-01T14:50:00",
      },
    ],
    alerts: [
      {
        id: 1,
        type: "maintenance",
        message:
          "프린터 HP LaserJet 유지보수 일정이 3일 후로 예정되어 있습니다.",
        severity: "info",
      },
      {
        id: 2,
        type: "warranty",
        message: "노트북 Dell XPS 15의 보증기간이 30일 후 만료됩니다.",
        severity: "warning",
      },
      {
        id: 3,
        type: "stock",
        message: "사무용 의자 재고가 부족합니다. 현재 2개 남았습니다.",
        severity: "warning",
      },
      {
        id: 4,
        type: "license",
        message: "Adobe Creative Cloud 라이센스가 만료되었습니다.",
        severity: "error",
      },
    ],
    categoryDistribution: [
      { name: "컴퓨터", count: 78, percentage: 30 },
      { name: "모바일기기", count: 52, percentage: 20 },
      { name: "사무기기", count: 39, percentage: 15 },
      { name: "네트워크장비", count: 26, percentage: 10 },
      { name: "기타", count: 61, percentage: 25 },
    ],
    locationDistribution: [
      { name: "본사 1층", count: 45, percentage: 18 },
      { name: "본사 2층", count: 67, percentage: 26 },
      { name: "본사 3층", count: 58, percentage: 23 },
      { name: "지사", count: 42, percentage: 16 },
      { name: "데이터센터", count: 44, percentage: 17 },
    ],
  };
};
