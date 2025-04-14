# 자산 관리 시스템 데이터베이스 설계

## 개요

자산 관리 시스템은 다음과 같은 주요 기능을 지원합니다:

- 자산 등록 및 관리
- 자산 할당 및 반납
- 유지보수 기록
- 자산 폐기
- 자산 이력 추적

이러한 기능을 지원하기 위해 Firebase Firestore를 사용하여 다음과 같은 컬렉션 구조를 설계했습니다.

## 컬렉션 구조

### 1. assets (자산)

자산의 기본 정보를 저장하는 컬렉션입니다.

- **id**: 자산 고유 ID
- **name**: 자산 이름
- **category**: 카테고리 (데스크탑, 노트북, 모니터 등)
- **serialNumber**: 시리얼 번호
- **model**: 모델명
- **manufacturer**: 제조사
- **status**: 상태 (사용가능, 사용중, 수리중, 폐기예정, 폐기됨, 분실)
- **purchaseDate**: 구매일
- **purchasePrice**: 구매 가격
- **supplier**: 공급업체
- **warrantyExpiry**: 보증 만료일
- **currentValue**: 현재 가치
- **location**: 현재 위치
- **currentAssignmentId**: 현재 할당 ID (null이면 할당되지 않음)
- **specifications**: 사

## 데이터베이스 관계 다이어그램
