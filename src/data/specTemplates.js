// 카테고리별 사양 템플릿 정의
const specTemplates = {
  데스크탑: [
    { id: "cpu", label: "CPU", value: "" },
    { id: "ram", label: "RAM", value: "" },
    { id: "storage", label: "저장장치", value: "" },
    { id: "graphics", label: "그래픽카드", value: "" },
    { id: "os", label: "운영체제", value: "" },
    { id: "powerSupply", label: "전원 공급 장치", value: "" },
  ],
  노트북: [
    { id: "cpu", label: "CPU", value: "" },
    { id: "ram", label: "RAM", value: "" },
    { id: "storage", label: "저장장치", value: "" },
    { id: "display", label: "디스플레이", value: "" },
    { id: "graphics", label: "그래픽카드", value: "" },
    { id: "os", label: "운영체제", value: "" },
    { id: "battery", label: "배터리", value: "" },
    { id: "weight", label: "무게", value: "" },
  ],
  모니터: [
    { id: "size", label: "크기", value: "" },
    { id: "resolution", label: "해상도", value: "" },
    { id: "refreshRate", label: "주사율", value: "" },
    { id: "panelType", label: "패널 타입", value: "" },
    { id: "ports", label: "포트", value: "" },
    { id: "aspectRatio", label: "화면비", value: "" },
  ],
  모바일기기: [
    { id: "os", label: "운영체제", value: "" },
    { id: "processor", label: "프로세서", value: "" },
    { id: "memory", label: "메모리", value: "" },
    { id: "storage", label: "저장공간", value: "" },
    { id: "display", label: "화면", value: "" },
    { id: "battery", label: "배터리", value: "" },
    { id: "camera", label: "카메라", value: "" },
  ],
  주변기기: [
    { id: "interface", label: "인터페이스", value: "" },
    { id: "compatibility", label: "호환성", value: "" },
    { id: "powerRequirement", label: "전원 요구사항", value: "" },
  ],
  사무기기: [
    { id: "function", label: "기능", value: "" },
    { id: "paperSize", label: "용지 크기", value: "" },
    { id: "connectivity", label: "연결 방식", value: "" },
    { id: "printSpeed", label: "인쇄 속도", value: "" },
  ],
  서버: [
    { id: "cpu", label: "CPU", value: "" },
    { id: "ram", label: "RAM", value: "" },
    { id: "storage", label: "저장장치", value: "" },
    { id: "rackUnit", label: "랙 유닛", value: "" },
    { id: "os", label: "운영체제", value: "" },
    { id: "powerSupply", label: "전원 공급 장치", value: "" },
  ],
  네트워크장비: [
    { id: "ports", label: "포트 수", value: "" },
    { id: "throughput", label: "처리량", value: "" },
    { id: "managementInterface", label: "관리 인터페이스", value: "" },
    { id: "powerConsumption", label: "전력 소비", value: "" },
  ],
  소프트웨어: [
    { id: "version", label: "버전", value: "" },
    { id: "licenseType", label: "라이센스 유형", value: "" },
    { id: "supportEndDate", label: "지원 종료일", value: "" },
    { id: "platform", label: "플랫폼", value: "" },
  ],
  가구: [
    { id: "material", label: "재질", value: "" },
    { id: "dimensions", label: "크기", value: "" },
    { id: "weight", label: "무게", value: "" },
    { id: "color", label: "색상", value: "" },
  ],
  기타: [],
};

export default specTemplates;
