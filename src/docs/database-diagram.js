/**
 * 자산 관리 시스템 데이터베이스 관계 다이어그램
 *
 * 이 파일은 시각적 참조용으로만 사용됩니다.
 * 실제 Firestore는 NoSQL 데이터베이스이므로 관계형 데이터베이스와 같은 명시적 관계가 없습니다.
 * 대신 문서 ID를 통한 참조로 관계를 표현합니다.
 */

// 주요 컬렉션 간의 관계
const relationships = {
  // 자산과 할당 관계
  "assets.currentAssignmentId": "assignments.id", // 자산은 현재 할당 ID를 참조
  "assignments.assetId": "assets.id", // 할당은 자산 ID를 참조

  // 자산과 유지보수 관계
  "maintenance.assetId": "assets.id", // 유지보수는 자산 ID를 참조

  // 자산과 이력 관계
  "assetHistory.assetId": "assets.id", // 이력은 자산 ID를 참조
  "assetHistory.relatedDocumentId": "assignments.id | maintenance.id", // 이력은 관련 문서 ID를 참조

  // 자산과 카테고리 관계
  "assets.category": "categories.name", // 자산은 카테고리 이름을 참조

  // 할당과 부서 관계
  "assignments.department": "departments.name", // 할당은 부서 이름을 참조

  // 할당과 위치 관계
  "assignments.location": "locations.name", // 할당은 위치 이름을 참조
};

// 주요 트랜잭션 작업
const transactions = {
  // 자산 생성 및 할당
  createAssetWithAssignment: [
    "assets.create", // 자산 생성
    "assignments.create", // 할당 생성
    "assetHistory.create (구매)", // 구매 이력 생성
    "assetHistory.create (할당)", // 할당 이력 생성
  ],

  // 자산 할당
  assignAsset: [
    "assignments.update (기존 할당 종료)", // 기존 할당 종료
    "assignments.create (새 할당)", // 새 할당 생성
    "assets.update (할당 정보 업데이트)", // 자산 정보 업데이트
    "assetHistory.create (반납)", // 반납 이력 생성 (기존 할당이 있는 경우)
    "assetHistory.create (할당)", // 할당 이력 생성
  ],

  // 자산 반납
  returnAsset: [
    "assignments.update (할당 종료)", // 할당 종료
    "assets.update (할당 정보 제거)", // 자산 정보 업데이트
    "assetHistory.create (반납)", // 반납 이력 생성
  ],

  // 자산 폐기
  disposeAsset: [
    "assignments.update (할당 종료)", // 할당 종료 (할당된 경우)
    "assets.update (상태 변경)", // 자산 상태 변경
    "assetHistory.create (폐기)", // 폐기 이력 생성
  ],

  // 유지보수 추가
  addMaintenance: [
    "maintenance.create", // 유지보수 기록 생성
    "assets.update (상태 변경)", // 자산 상태 변경 (필요한 경우)
    "assetHistory.create (유지보수)", // 유지보수 이력 생성
  ],
};

// 데이터 흐름 예시
const dataFlowExamples = {
  // 자산 생성 및 할당 예시
  createAssetWithAssignment: {
    // 입력 데이터
    input: {
      assetData: {
        name: "MacBook Pro",
        category: "노트북",
        serialNumber: "C02XL0THJGH5",
        purchasePrice: 2000000,
        // 기타 자산 정보...
      },
      assignmentData: {
        assignedTo: "홍길동",
        department: "개발팀",
        location: "본사 3층",
        // 기타 할당 정보...
      },
    },

    // 생성되는 문서
    output: {
      assets: {
        id: "asset123",
        name: "MacBook Pro",
        category: "노트북",
        serialNumber: "C02XL0THJGH5",
        purchasePrice: 2000000,
        status: "사용중",
        currentAssignmentId: "assignment456",
        assignedTo: "홍길동",
        department: "개발팀",
        location: "본사 3층",
        // 기타 자산 정보...
      },
      assignments: {
        id: "assignment456",
        assetId: "asset123",
        assetName: "MacBook Pro",
        assignedTo: "홍길동",
        department: "개발팀",
        location: "본사 3층",
        status: "active",
        startDate: "2023-04-01T00:00:00.000Z",
        endDate: null,
        // 기타 할당 정보...
      },
      assetHistory: [
        {
          id: "history789",
          assetId: "asset123",
          assetName: "MacBook Pro",
          type: "구매",
          date: "2023-04-01T00:00:00.000Z",
          description: '자산 "MacBook Pro" 구매',
          details: {
            purchasePrice: 2000000,
            supplier: "Apple",
          },
          // 기타 이력 정보...
        },
        {
          id: "history790",
          assetId: "asset123",
          assetName: "MacBook Pro",
          type: "할당",
          date: "2023-04-01T00:00:00.000Z",
          description: '자산 "MacBook Pro"이(가) 홍길동에게 할당됨',
          details: {
            assignedTo: "홍길동",
            department: "개발팀",
            location: "본사 3층",
          },
          relatedDocumentId: "assignment456",
          relatedDocumentType: "assignment",
          // 기타 이력 정보...
        },
      ],
    },
  },
};
