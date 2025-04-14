/**
 * 자산 관리 시스템 데이터베이스 스키마 설계
 *
 * 이 파일은 Firestore 데이터베이스의 컬렉션 구조와 문서 스키마를 정의합니다.
 * 실제 코드에서는 참조용으로만 사용되며, Firestore는 스키마가 없는 NoSQL 데이터베이스입니다.
 */

// 자산 컬렉션 (assets)
const assetSchema = {
  id: "string", // 자산 고유 ID
  name: "string", // 자산 이름
  category: "string", // 카테고리 (데스크탑, 노트북, 모니터 등)
  serialNumber: "string", // 시리얼 번호
  model: "string", // 모델명
  manufacturer: "string", // 제조사
  status: "string", // 상태 (사용가능, 사용중, 수리중, 폐기예정, 폐기됨, 분실)

  // 구매 정보
  purchaseDate: "timestamp", // 구매일
  purchasePrice: "number", // 구매 가격
  supplier: "string", // 공급업체
  supplierContact: "string", // 공급업체 연락처
  warrantyExpiry: "timestamp", // 보증 만료일
  currentValue: "number", // 현재 가치

  // 위치 및 할당 정보 (현재 상태만 저장, 이력은 assignments 컬렉션에 저장)
  location: "string", // 현재 위치
  currentAssignmentId: "string", // 현재 할당 ID (null이면 할당되지 않음)

  // 사양 정보
  specifications: {
    // 카테고리별 표준 사양 필드
    cpu: "string",
    ram: "string",
    storage: "string",
    // 기타 사양 필드...
  },

  // 커스텀 사양 정보 (사용자 정의 필드)
  customSpecifications: {
    // 키-값 쌍으로 저장
    // "fieldName": "value"
  },

  // 감가상각 설정
  depreciation: {
    method: "string", // 감가상각 방법 (straight-line, double-declining, etc.)
    years: "number", // 감가상각 기간 (년)
    residualValueType: "string", // 잔존가치 유형 (percentage, fixed)
    residualValue: "number", // 잔존가치 (percentage인 경우 %, fixed인 경우 금액)
  },

  // 첨부 파일
  attachments: [
    {
      id: "string",
      name: "string",
      type: "string",
      size: "number",
      url: "string",
      date: "timestamp",
    },
  ],

  image: "string", // 자산 이미지 URL
  notes: "string", // 비고

  // 메타데이터
  createdAt: "timestamp", // 생성일
  updatedAt: "timestamp", // 수정일
  createdBy: "string", // 생성자 ID
  updatedBy: "string", // 수정자 ID
};

// 할당 컬렉션 (assignments)
const assignmentSchema = {
  id: "string", // 할당 고유 ID
  assetId: "string", // 자산 ID
  assetName: "string", // 자산 이름 (조회 편의성)

  // 할당 정보
  assignedTo: "string", // 담당자 이름
  department: "string", // 부서
  location: "string", // 위치
  contactNumber: "string", // 연락처
  email: "string", // 이메일
  role: "string", // 직책

  // 할당 기간
  startDate: "timestamp", // 할당 시작일
  endDate: "timestamp", // 할당 종료일 (null이면 현재 할당 중)
  dueDate: "timestamp", // 반납 예정일 (optional)

  // 상태 정보
  status: "string", // 상태 (active, completed, cancelled)
  returnNotes: "string", // 반납 시 비고

  // 메타데이터
  notes: "string", // 비고
  createdAt: "timestamp", // 생성일
  updatedAt: "timestamp", // 수정일
  createdBy: "string", // 생성자 ID
  updatedBy: "string", // 수정자 ID
};

// 유지보수 컬렉션 (maintenance)
const maintenanceSchema = {
  id: "string", // 유지보수 고유 ID
  assetId: "string", // 자산 ID
  assetName: "string", // 자산 이름 (조회 편의성)

  // 유지보수 정보
  type: "string", // 유지보수 유형 (정기점검, 수리, 업그레이드 등)
  description: "string", // 설명
  date: "timestamp", // 유지보수 일자
  cost: "number", // 비용
  technician: "string", // 담당 기술자
  vendor: "string", // 업체

  // 상태 정보
  status: "string", // 상태 (scheduled, in-progress, completed, cancelled)
  resolution: "string", // 해결 방법

  // 첨부 파일
  attachments: [
    {
      id: "string",
      name: "string",
      type: "string",
      size: "number",
      url: "string",
      date: "timestamp",
    },
  ],

  // 메타데이터
  notes: "string", // 비고
  createdAt: "timestamp", // 생성일
  updatedAt: "timestamp", // 수정일
  createdBy: "string", // 생성자 ID
  updatedBy: "string", // 수정자 ID
};

// 자산 이력 컬렉션 (assetHistory)
const assetHistorySchema = {
  id: "string", // 이력 고유 ID
  assetId: "string", // 자산 ID
  assetName: "string", // 자산 이름 (조회 편의성)

  // 이벤트 정보
  type: "string", // 이벤트 유형 (구매, 할당, 반납, 유지보수, 상태변경, 폐기 등)
  date: "timestamp", // 이벤트 일자
  description: "string", // 설명
  user: "string", // 처리자

  // 이벤트 상세 정보 (이벤트 유형에 따라 다름)
  details: {
    // 구매 이벤트
    purchasePrice: "number",
    supplier: "string",

    // 할당 이벤트
    assignedTo: "string",
    department: "string",
    location: "string",

    // 유지보수 이벤트
    maintenanceType: "string",
    cost: "number",
    technician: "string",

    // 상태변경 이벤트
    previousStatus: "string",
    newStatus: "string",

    // 기타 필요한 정보...
  },

  // 관련 문서 ID
  relatedDocumentId: "string", // 관련 문서 ID (할당 ID, 유지보수 ID 등)
  relatedDocumentType: "string", // 관련 문서 유형 (assignment, maintenance 등)

  // 메타데이터
  createdAt: "timestamp", // 생성일
  createdBy: "string", // 생성자 ID
};

// 카테고리 컬렉션 (categories)
const categorySchema = {
  id: "string", // 카테고리 고유 ID
  name: "string", // 카테고리 이름
  description: "string", // 설명

  // 사양 템플릿
  specificationTemplate: [
    {
      id: "string", // 필드 ID
      label: "string", // 표시 라벨
      type: "string", // 필드 타입 (text, number, date, select 등)
      required: "boolean", // 필수 여부
      options: ["string"], // select 타입인 경우 선택 옵션
    },
  ],

  // 감가상각 기본 설정
  defaultDepreciation: {
    method: "string",
    years: "number",
    residualValueType: "string",
    residualValue: "number",
  },

  // 메타데이터
  createdAt: "timestamp", // 생성일
  updatedAt: "timestamp", // 수정일
  createdBy: "string", // 생성자 ID
  updatedBy: "string", // 수정자 ID
};

// 위치 컬렉션 (locations)
const locationSchema = {
  id: "string", // 위치 고유 ID
  name: "string", // 위치 이름
  description: "string", // 설명
  address: "string", // 주소
  floor: "string", // 층
  room: "string", // 호실

  // 메타데이터
  createdAt: "timestamp", // 생성일
  updatedAt: "timestamp", // 수정일
  createdBy: "string", // 생성자 ID
  updatedBy: "string", // 수정자 ID
};

// 부서 컬렉션 (departments)
const departmentSchema = {
  id: "string", // 부서 고유 ID
  name: "string", // 부서 이름
  description: "string", // 설명
  manager: "string", // 관리자

  // 메타데이터
  createdAt: "timestamp", // 생성일
  updatedAt: "timestamp", // 수정일
  createdBy: "string", // 생성자 ID
  updatedBy: "string", // 수정자 ID
};

// 사용자 컬렉션 (users)
const userSchema = {
  id: "string", // 사용자 고유 ID
  name: "string", // 이름
  email: "string", // 이메일
  department: "string", // 부서
  role: "string", // 직책
  contactNumber: "string", // 연락처

  // 권한 정보
  userRole: "string", // 사용자 권한 (admin, manager, user)
  permissions: ["string"], // 권한 목록

  // 메타데이터
  createdAt: "timestamp", // 생성일
  updatedAt: "timestamp", // 수정일
  lastLogin: "timestamp", // 마지막 로그인
};

// 설정 컬렉션 (settings)
const settingsSchema = {
  id: "string", // 설정 고유 ID
  category: "string", // 설정 카테고리
  key: "string", // 설정 키
  value: "any", // 설정 값

  // 메타데이터
  createdAt: "timestamp", // 생성일
  updatedAt: "timestamp", // 수정일
  updatedBy: "string", // 수정자 ID
};

// 데이터베이스 스키마 내보내기
export const databaseSchema = {
  assets: assetSchema,
  assignments: assignmentSchema,
  maintenance: maintenanceSchema,
  assetHistory: assetHistorySchema,
  categories: categorySchema,
  locations: locationSchema,
  departments: departmentSchema,
  users: userSchema,
  settings: settingsSchema,
};
