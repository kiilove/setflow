// 분석 데이터 생성 함수
export const generateAssetTrendsData = (range) => {
  if (range === "year") {
    return [
      {
        period: "1월",
        total: 220,
        active: 180,
        maintenance: 25,
        inactive: 15,
      },
      {
        period: "2월",
        total: 225,
        active: 182,
        maintenance: 28,
        inactive: 15,
      },
      {
        period: "3월",
        total: 230,
        active: 185,
        maintenance: 30,
        inactive: 15,
      },
      {
        period: "4월",
        total: 235,
        active: 190,
        maintenance: 28,
        inactive: 17,
      },
      {
        period: "5월",
        total: 240,
        active: 195,
        maintenance: 25,
        inactive: 20,
      },
      {
        period: "6월",
        total: 245,
        active: 198,
        maintenance: 27,
        inactive: 20,
      },
      {
        period: "7월",
        total: 248,
        active: 200,
        maintenance: 28,
        inactive: 20,
      },
      {
        period: "8월",
        total: 250,
        active: 202,
        maintenance: 28,
        inactive: 20,
      },
      {
        period: "9월",
        total: 252,
        active: 205,
        maintenance: 27,
        inactive: 20,
      },
      {
        period: "10월",
        total: 254,
        active: 205,
        maintenance: 29,
        inactive: 20,
      },
      {
        period: "11월",
        total: 255,
        active: 200,
        maintenance: 30,
        inactive: 25,
      },
      {
        period: "12월",
        total: 256,
        active: 198,
        maintenance: 32,
        inactive: 26,
      },
    ];
  } else if (range === "quarter") {
    return [
      {
        period: "1분기",
        total: 230,
        active: 185,
        maintenance: 30,
        inactive: 15,
      },
      {
        period: "2분기",
        total: 245,
        active: 198,
        maintenance: 27,
        inactive: 20,
      },
      {
        period: "3분기",
        total: 252,
        active: 205,
        maintenance: 27,
        inactive: 20,
      },
      {
        period: "4분기",
        total: 256,
        active: 198,
        maintenance: 32,
        inactive: 26,
      },
    ];
  } else {
    return [
      {
        period: "2020",
        total: 180,
        active: 150,
        maintenance: 20,
        inactive: 10,
      },
      {
        period: "2021",
        total: 210,
        active: 175,
        maintenance: 25,
        inactive: 10,
      },
      {
        period: "2022",
        total: 235,
        active: 190,
        maintenance: 30,
        inactive: 15,
      },
      {
        period: "2023",
        total: 256,
        active: 198,
        maintenance: 32,
        inactive: 26,
      },
    ];
  }
};

// 분석 데이터
export const getAnalyticsData = (timeRange) => {
  return {
    assetTrends: generateAssetTrendsData(timeRange),
    valueAnalysis: {
      totalValue: 125750000,
      depreciationValue: 32450000,
      currentValue: 93300000,
      valueByCategory: [
        { category: "컴퓨터", value: 45000000, percentage: 35.8 },
        { category: "서버", value: 35000000, percentage: 27.8 },
        { category: "네트워크장비", value: 18000000, percentage: 14.3 },
        { category: "모바일기기", value: 12000000, percentage: 9.5 },
        { category: "사무기기", value: 8500000, percentage: 6.8 },
        { category: "소프트웨어", value: 5000000, percentage: 4.0 },
        { category: "가구", value: 2250000, percentage: 1.8 },
      ],
    },
    utilizationRates: [
      { category: "컴퓨터", rate: 92 },
      { category: "서버", rate: 98 },
      { category: "네트워크장비", rate: 95 },
      { category: "모바일기기", rate: 85 },
      { category: "사무기기", rate: 78 },
    ],
    maintenanceAnalysis: {
      totalMaintenanceCost: 5870000,
      costByCategory: [
        { category: "컴퓨터", cost: 1250000, percentage: 21.3 },
        { category: "서버", cost: 2350000, percentage: 40.0 },
        { category: "네트워크장비", cost: 950000, percentage: 16.2 },
        { category: "모바일기기", cost: 420000, percentage: 7.2 },
        { category: "사무기기", cost: 900000, percentage: 15.3 },
      ],
      maintenanceFrequency: [
        { month: "1월", count: 12 },
        { month: "2월", count: 8 },
        { month: "3월", count: 15 },
        { month: "4월", count: 10 },
        { month: "5월", count: 7 },
        { month: "6월", count: 14 },
        { month: "7월", count: 18 },
        { month: "8월", count: 9 },
        { month: "9월", count: 11 },
        { month: "10월", count: 13 },
        { month: "11월", count: 16 },
        { month: "12월", count: 20 },
      ],
    },
    predictiveAnalysis: {
      assetReplacement: [
        { quarter: "Q1 2024", count: 15, estimatedCost: 12500000 },
        { quarter: "Q2 2024", count: 22, estimatedCost: 18700000 },
        { quarter: "Q3 2024", count: 18, estimatedCost: 15200000 },
        { quarter: "Q4 2024", count: 25, estimatedCost: 21500000 },
      ],
      maintenanceForecast: [
        { quarter: "Q1 2024", count: 35, estimatedCost: 1750000 },
        { quarter: "Q2 2024", count: 42, estimatedCost: 2100000 },
        { quarter: "Q3 2024", count: 38, estimatedCost: 1900000 },
        { quarter: "Q4 2024", count: 45, estimatedCost: 2250000 },
      ],
    },
  };
};
