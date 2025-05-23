/**
 * 카테고리 초기 데이터
 * 카테고리 정보와 사양 템플릿을 통합하여 관리합니다.
 * 모든 자산은 정률법, 5년 감가상각, 잔존가치 1000원으로 통일되었습니다.
 */
const categoryInitialData = [
  // 컴퓨터/IT장비 그룹 (상위 노출)
  {
    name: "데스크탑",
    description: "데스크탑 컴퓨터 및 워크스테이션",
    group: "컴퓨터/IT장비",
    icon: "Monitor",
    iconColor: "bg-blue-100",
    iconTextColor: "text-blue-500",
    iconColorName: "파랑",
    depreciation: {
      method: "declining-balance",
      years: 5,
      residualValueType: "fixed",
      residualValue: 1000,
    },
    specFields: [
      { id: "cpu", label: "CPU", type: "text", value: "" },
      { id: "ram", label: "RAM", type: "text", value: "" },
      { id: "storage", label: "저장장치", type: "text", value: "" },
      { id: "graphics", label: "그래픽카드", type: "text", value: "" },
      { id: "os", label: "운영체제", type: "text", value: "" },
      { id: "powerSupply", label: "전원 공급 장치", type: "text", value: "" },
    ],
  },
  {
    name: "노트북",
    description: "노트북 및 휴대용 컴퓨터",
    group: "컴퓨터/IT장비",
    icon: "Laptop",
    iconColor: "bg-purple-100",
    iconTextColor: "text-purple-500",
    iconColorName: "보라",
    depreciation: {
      method: "declining-balance",
      years: 5,
      residualValueType: "fixed",
      residualValue: 1000,
    },
    specFields: [
      { id: "cpu", label: "CPU", type: "text", value: "" },
      { id: "ram", label: "RAM", type: "text", value: "" },
      { id: "storage", label: "저장장치", type: "text", value: "" },
      { id: "display", label: "디스플레이", type: "text", value: "" },
      { id: "graphics", label: "그래픽카드", type: "text", value: "" },
      { id: "os", label: "운영체제", type: "text", value: "" },
      { id: "battery", label: "배터리", type: "text", value: "" },
      { id: "weight", label: "무게", type: "text", value: "" },
    ],
  },
  {
    name: "모니터",
    description: "모니터 및 디스플레이 장치",
    group: "컴퓨터/IT장비",
    icon: "Tv",
    iconColor: "bg-green-100",
    iconTextColor: "text-green-500",
    iconColorName: "초록",
    depreciation: {
      method: "declining-balance",
      years: 5,
      residualValueType: "fixed",
      residualValue: 1000,
    },
    specFields: [
      { id: "size", label: "크기", type: "text", value: "" },
      { id: "resolution", label: "해상도", type: "text", value: "" },
      { id: "refreshRate", label: "주사율", type: "text", value: "" },
      { id: "panelType", label: "패널 타입", type: "text", value: "" },
      { id: "ports", label: "포트", type: "text", value: "" },
      { id: "aspectRatio", label: "화면비", type: "text", value: "" },
    ],
  },
  {
    name: "주변기기",
    description: "키보드, 마우스, 웹캠 등 주변기기",
    group: "컴퓨터/IT장비",
    icon: "Mouse",
    iconColor: "bg-red-100",
    iconTextColor: "text-red-500",
    iconColorName: "빨강",
    depreciation: {
      method: "declining-balance",
      years: 5,
      residualValueType: "fixed",
      residualValue: 1000,
    },
    specFields: [
      { id: "interface", label: "인터페이스", type: "text", value: "" },
      { id: "compatibility", label: "호환성", type: "text", value: "" },
      {
        id: "powerRequirement",
        label: "전원 요구사항",
        type: "text",
        value: "",
      },
      { id: "connectivity", label: "연결 방식", type: "text", value: "" },
    ],
  },
  {
    name: "서버",
    description: "서버 및 서버 관련 장비",
    group: "컴퓨터/IT장비",
    icon: "Server",
    iconColor: "bg-indigo-100",
    iconTextColor: "text-indigo-500",
    iconColorName: "남색",
    depreciation: {
      method: "declining-balance",
      years: 5,
      residualValueType: "fixed",
      residualValue: 1000,
    },
    specFields: [
      { id: "cpu", label: "CPU", type: "text", value: "" },
      { id: "ram", label: "RAM", type: "text", value: "" },
      { id: "storage", label: "저장장치", type: "text", value: "" },
      { id: "rackUnit", label: "랙 유닛", type: "text", value: "" },
      { id: "os", label: "운영체제", type: "text", value: "" },
      { id: "powerSupply", label: "전원 공급 장치", type: "text", value: "" },
    ],
  },

  // 네트워크/인프라 그룹
  {
    name: "네트워크장비",
    description: "라우터, 스위치 등 네트워크 장비",
    group: "네트워크/인프라",
    icon: "Network",
    iconColor: "bg-teal-100",
    iconTextColor: "text-teal-500",
    iconColorName: "청록",
    depreciation: {
      method: "declining-balance",
      years: 5,
      residualValueType: "fixed",
      residualValue: 1000,
    },
    specFields: [
      { id: "ports", label: "포트 수", type: "text", value: "" },
      { id: "throughput", label: "처리량", type: "text", value: "" },
      {
        id: "managementInterface",
        label: "관리 인터페이스",
        type: "text",
        value: "",
      },
      { id: "powerConsumption", label: "전력 소비", type: "text", value: "" },
    ],
  },
  {
    name: "보안장비",
    description: "방화벽, VPN 장비 등 보안 관련 장비",
    group: "네트워크/인프라",
    icon: "Shield",
    iconColor: "bg-orange-100",
    iconTextColor: "text-orange-500",
    iconColorName: "주황",
    depreciation: {
      method: "declining-balance",
      years: 5,
      residualValueType: "fixed",
      residualValue: 1000,
    },
    specFields: [
      { id: "throughput", label: "처리량", type: "text", value: "" },
      { id: "connections", label: "동시 연결 수", type: "text", value: "" },
      { id: "features", label: "주요 기능", type: "text", value: "" },
      { id: "certification", label: "보안 인증", type: "text", value: "" },
    ],
  },
  {
    name: "UPS/전원장비",
    description: "무정전 전원 공급 장치 및 전원 관련 장비",
    group: "네트워크/인프라",
    icon: "Battery",
    iconColor: "bg-yellow-100",
    iconTextColor: "text-yellow-500",
    iconColorName: "노랑",
    depreciation: {
      method: "declining-balance",
      years: 5,
      residualValueType: "fixed",
      residualValue: 1000,
    },
    specFields: [
      { id: "capacity", label: "용량", type: "text", value: "" },
      { id: "runtime", label: "지속 시간", type: "text", value: "" },
      { id: "outputType", label: "출력 유형", type: "text", value: "" },
      { id: "batteryType", label: "배터리 유형", type: "text", value: "" },
    ],
  },

  // 모바일/통신장비 그룹
  {
    name: "모바일기기",
    description: "스마트폰, 태블릿 등 모바일 기기",
    group: "모바일/통신장비",
    icon: "Smartphone",
    iconColor: "bg-yellow-100",
    iconTextColor: "text-yellow-500",
    iconColorName: "노랑",
    depreciation: {
      method: "declining-balance",
      years: 5,
      residualValueType: "fixed",
      residualValue: 1000,
    },
    specFields: [
      { id: "os", label: "운영체제", type: "text", value: "" },
      { id: "processor", label: "프로세서", type: "text", value: "" },
      { id: "memory", label: "메모리", type: "text", value: "" },
      { id: "storage", label: "저장공간", type: "text", value: "" },
      { id: "display", label: "화면", type: "text", value: "" },
      { id: "battery", label: "배터리", type: "text", value: "" },
      { id: "camera", label: "카메라", type: "text", value: "" },
    ],
  },
  {
    name: "통신장비",
    description: "통신 관련 장비 및 기기",
    group: "모바일/통신장비",
    icon: "Radio",
    iconColor: "bg-purple-100",
    iconTextColor: "text-purple-500",
    iconColorName: "보라",
    depreciation: {
      method: "declining-balance",
      years: 5,
      residualValueType: "fixed",
      residualValue: 1000,
    },
    specFields: [
      { id: "frequency", label: "주파수", type: "text", value: "" },
      { id: "range", label: "범위", type: "text", value: "" },
      { id: "protocol", label: "통신 프로토콜", type: "text", value: "" },
      { id: "powerSource", label: "전원", type: "text", value: "" },
    ],
  },

  // 소프트웨어/라이센스 그룹
  {
    name: "소프트웨어",
    description: "소프트웨어 및 라이센스",
    group: "소프트웨어/라이센스",
    icon: "FileCode",
    iconColor: "bg-pink-100",
    iconTextColor: "text-pink-500",
    iconColorName: "분홍",
    depreciation: {
      method: "declining-balance",
      years: 5,
      residualValueType: "fixed",
      residualValue: 1000,
    },
    specFields: [
      { id: "version", label: "버전", type: "text", value: "" },
      { id: "licenseType", label: "라이센스 유형", type: "text", value: "" },
      { id: "supportEndDate", label: "지원 종료일", type: "date", value: "" },
      { id: "platform", label: "플랫폼", type: "text", value: "" },
      { id: "seats", label: "사용자 수", type: "number", value: "" },
    ],
  },
  {
    name: "클라우드서비스",
    description: "클라우드 서비스 구독 및 라이센스",
    group: "소프트웨어/라이센스",
    icon: "Cloud",
    iconColor: "bg-blue-100",
    iconTextColor: "text-blue-500",
    iconColorName: "파랑",
    depreciation: {
      method: "declining-balance",
      years: 5,
      residualValueType: "fixed",
      residualValue: 1000,
    },
    specFields: [
      { id: "provider", label: "제공업체", type: "text", value: "" },
      { id: "plan", label: "요금제", type: "text", value: "" },
      { id: "renewalDate", label: "갱신일", type: "date", value: "" },
      { id: "storage", label: "저장 용량", type: "text", value: "" },
      { id: "users", label: "사용자 수", type: "number", value: "" },
    ],
  },

  // 사무/비품 그룹
  {
    name: "사무기기",
    description: "프린터, 스캐너, 복합기 등 사무기기",
    group: "사무/비품",
    icon: "Printer",
    iconColor: "bg-orange-100",
    iconTextColor: "text-orange-500",
    iconColorName: "주황",
    depreciation: {
      method: "declining-balance",
      years: 5,
      residualValueType: "fixed",
      residualValue: 1000,
    },
    specFields: [
      { id: "function", label: "기능", type: "text", value: "" },
      { id: "paperSize", label: "용지 크기", type: "text", value: "" },
      { id: "connectivity", label: "연결 방식", type: "text", value: "" },
      { id: "printSpeed", label: "인쇄 속도", type: "text", value: "" },
    ],
  },
  {
    name: "가구",
    description: "책상, 의자 등 사무용 가구",
    group: "사무/비품",
    icon: "Armchair",
    iconColor: "bg-gray-100",
    iconTextColor: "text-gray-500",
    iconColorName: "기본",
    depreciation: {
      method: "declining-balance",
      years: 5,
      residualValueType: "fixed",
      residualValue: 1000,
    },
    specFields: [
      { id: "material", label: "재질", type: "text", value: "" },
      { id: "dimensions", label: "크기", type: "text", value: "" },
      { id: "weight", label: "무게", type: "text", value: "" },
      { id: "color", label: "색상", type: "text", value: "" },
    ],
  },

  // 차량/운송장비 그룹 (새로 추가)
  {
    name: "업무용차량",
    description: "회사 업무용 차량",
    group: "차량/운송장비",
    icon: "Car",
    iconColor: "bg-blue-100",
    iconTextColor: "text-blue-500",
    iconColorName: "파랑",
    depreciation: {
      method: "declining-balance",
      years: 5,
      residualValueType: "fixed",
      residualValue: 1000,
    },
    specFields: [
      { id: "make", label: "제조사", type: "text", value: "" },
      { id: "model", label: "모델", type: "text", value: "" },
      { id: "year", label: "연식", type: "text", value: "" },
      { id: "licensePlate", label: "번호판", type: "text", value: "" },
      { id: "fuelType", label: "연료 유형", type: "text", value: "" },
      { id: "mileage", label: "주행거리", type: "text", value: "" },
      { id: "insurance", label: "보험 정보", type: "text", value: "" },
    ],
  },
  {
    name: "운송장비",
    description: "운송 관련 장비 및 기기",
    group: "차량/운송장비",
    icon: "Truck",
    iconColor: "bg-green-100",
    iconTextColor: "text-green-500",
    iconColorName: "초록",
    depreciation: {
      method: "declining-balance",
      years: 5,
      residualValueType: "fixed",
      residualValue: 1000,
    },
    specFields: [
      { id: "type", label: "유형", type: "text", value: "" },
      { id: "capacity", label: "적재 용량", type: "text", value: "" },
      { id: "dimensions", label: "크기", type: "text", value: "" },
      { id: "weight", label: "무게", type: "text", value: "" },
    ],
  },

  // 테스트/측정장비 그룹 (새로 추가)
  {
    name: "테스트장비",
    description: "하드웨어 및 네트워크 테스트 장비",
    group: "테스트/측정장비",
    icon: "Gauge",
    iconColor: "bg-purple-100",
    iconTextColor: "text-purple-500",
    iconColorName: "보라",
    depreciation: {
      method: "declining-balance",
      years: 5,
      residualValueType: "fixed",
      residualValue: 1000,
    },
    specFields: [
      { id: "type", label: "유형", type: "text", value: "" },
      { id: "accuracy", label: "정확도", type: "text", value: "" },
      { id: "calibrationDate", label: "교정일", type: "date", value: "" },
      { id: "range", label: "측정 범위", type: "text", value: "" },
      { id: "interface", label: "인터페이스", type: "text", value: "" },
    ],
  },
  {
    name: "측정도구",
    description: "각종 측정 도구 및 장비",
    group: "테스트/측정장비",
    icon: "Ruler",
    iconColor: "bg-yellow-100",
    iconTextColor: "text-yellow-500",
    iconColorName: "노랑",
    depreciation: {
      method: "declining-balance",
      years: 5,
      residualValueType: "fixed",
      residualValue: 1000,
    },
    specFields: [
      { id: "type", label: "유형", type: "text", value: "" },
      { id: "accuracy", label: "정확도", type: "text", value: "" },
      { id: "range", label: "측정 범위", type: "text", value: "" },
      {
        id: "calibrationRequired",
        label: "교정 필요 여부",
        type: "boolean",
        value: false,
      },
    ],
  },

  // 기타 그룹
  {
    name: "기타",
    description: "기타 분류되지 않은 자산",
    group: "기타",
    icon: "Package",
    iconColor: "bg-gray-100",
    iconTextColor: "text-gray-500",
    iconColorName: "기본",
    depreciation: {
      method: "declining-balance",
      years: 5,
      residualValueType: "fixed",
      residualValue: 1000,
    },
    specFields: [
      { id: "description", label: "상세 설명", type: "textarea", value: "" },
      { id: "notes", label: "비고", type: "textarea", value: "" },
    ],
  },
];

// 카테고리 그룹 정보
export const categoryGroups = [
  {
    id: "computer-it",
    name: "컴퓨터/IT장비",
    description: "컴퓨터, 노트북, 모니터 등 IT 관련 장비",
    icon: "Laptop",
    color: "bg-blue-100",
    textColor: "text-blue-500",
  },
  {
    id: "network-infra",
    name: "네트워크/인프라",
    description: "서버, 네트워크 장비, 인프라 관련 장비",
    icon: "Server",
    color: "bg-indigo-100",
    textColor: "text-indigo-500",
  },
  {
    id: "mobile-comm",
    name: "모바일/통신장비",
    description: "스마트폰, 태블릿, 통신장비 등",
    icon: "Smartphone",
    color: "bg-yellow-100",
    textColor: "text-yellow-500",
  },
  {
    id: "software-license",
    name: "소프트웨어/라이센스",
    description: "소프트웨어 및 라이센스",
    icon: "FileCode",
    color: "bg-pink-100",
    textColor: "text-pink-500",
  },
  {
    id: "office-supplies",
    name: "사무/비품",
    description: "사무기기, 가구 등 사무실 비품",
    icon: "Briefcase",
    color: "bg-orange-100",
    textColor: "text-orange-500",
  },
  {
    id: "vehicle-transport",
    name: "차량/운송장비",
    description: "업무용 차량 및 운송 장비",
    icon: "Car",
    color: "bg-green-100",
    textColor: "text-green-500",
  },
  {
    id: "test-measurement",
    name: "테스트/측정장비",
    description: "테스트 및 측정 관련 장비",
    icon: "Gauge",
    color: "bg-purple-100",
    textColor: "text-purple-500",
  },
  {
    id: "others",
    name: "기타",
    description: "기타 분류되지 않은 자산",
    icon: "Package",
    color: "bg-gray-100",
    textColor: "text-gray-500",
  },
];

export default categoryInitialData;
