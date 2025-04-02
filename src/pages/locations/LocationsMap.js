"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaList, FaSearch } from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";

const LocationsMap = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const locationId = searchParams.get("id");

  const [searchTerm, setSearchTerm] = useState("");

  // 예시 위치 데이터
  const locations = [
    {
      id: 1,
      name: "본사 1층",
      address: "서울시 강남구 테헤란로 123",
      assetCount: 45,
      manager: "김관리자",
      latitude: 37.5665,
      longitude: 126.978,
    },
    {
      id: 2,
      name: "본사 2층",
      address: "서울시 강남구 테헤란로 123",
      assetCount: 62,
      manager: "이관리자",
      latitude: 37.5665,
      longitude: 126.978,
    },
    {
      id: 3,
      name: "본사 3층",
      address: "서울시 강남구 테헤란로 123",
      assetCount: 58,
      manager: "박관리자",
      latitude: 37.5665,
      longitude: 126.978,
    },
    {
      id: 4,
      name: "본사 4층",
      address: "서울시 강남구 테헤란로 123",
      assetCount: 51,
      manager: "최관리자",
      latitude: 37.5665,
      longitude: 126.978,
    },
    {
      id: 5,
      name: "지사 1층",
      address: "서울시 서초구 서초대로 456",
      assetCount: 32,
      manager: "정관리자",
      latitude: 37.4969,
      longitude: 127.0278,
    },
    {
      id: 6,
      name: "지사 2층",
      address: "서울시 서초구 서초대로 456",
      assetCount: 28,
      manager: "한관리자",
      latitude: 37.4969,
      longitude: 127.0278,
    },
    {
      id: 7,
      name: "데이터센터",
      address: "경기도 성남시 분당구 판교로 789",
      assetCount: 24,
      manager: "유관리자",
      latitude: 37.4019,
      longitude: 127.1128,
    },
    {
      id: 8,
      name: "창고",
      address: "경기도 용인시 기흥구 동백로 101",
      assetCount: 15,
      manager: "조관리자",
      latitude: 37.2747,
      longitude: 127.1443,
    },
  ];

  // 검색 필터링
  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 선택된 위치
  const selectedLocation = locationId
    ? locations.find((loc) => loc.id === Number.parseInt(locationId))
    : null;

  return (
    <PageContainer title="위치 지도">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="위치 검색..."
            className="w-full md:w-64 pl-10 pr-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>

        <Link
          to="/locations"
          className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
            "secondary"
          )}`}
        >
          <FaList className="h-4 w-4" />
          <span>목록 보기</span>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* 위치 목록 */}
        <div className="md:col-span-1 rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-4">
            위치 목록
          </h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredLocations.map((loc) => (
              <Link
                key={loc.id}
                to={`/locations/map?id=${loc.id}`}
                className={`block p-3 rounded-md ${
                  selectedLocation && selectedLocation.id === loc.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground hover:bg-accent/80"
                }`}
              >
                <h4 className="font-medium">{loc.name}</h4>
                <p className="text-sm opacity-90">{loc.address}</p>
                <p className="text-xs opacity-75 mt-1">
                  자산 {loc.assetCount}개
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* 지도 */}
        <div className="md:col-span-2 rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="text-lg font-medium text-foreground mb-4">지도</h3>
          <div className="w-full h-[500px] bg-muted rounded-md flex items-center justify-center">
            {selectedLocation ? (
              <div className="text-center">
                <p className="text-foreground text-lg">
                  {selectedLocation.name}
                </p>
                <p className="text-muted-foreground">
                  {selectedLocation.address}
                </p>
                <p className="text-muted-foreground mt-2">
                  위도: {selectedLocation.latitude}, 경도:{" "}
                  {selectedLocation.longitude}
                </p>
                <p className="text-primary mt-4">
                  실제 지도 구현 시 이 위치에 마커가 표시됩니다.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-foreground text-lg">지도</p>
                <p className="text-muted-foreground">
                  왼쪽 목록에서 위치를 선택하세요
                </p>
                <p className="text-primary mt-4">
                  실제 구현 시 Google Maps, Kakao Maps 등의 API를 사용할 수
                  있습니다.
                </p>
              </div>
            )}
          </div>

          {/* 선택된 위치 정보 */}
          {selectedLocation && (
            <div className="mt-4 p-4 rounded-md bg-accent">
              <h4 className="text-lg font-medium text-foreground mb-2">
                {selectedLocation.name} 정보
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">주소</p>
                  <p className="text-foreground">{selectedLocation.address}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">관리자</p>
                  <p className="text-foreground">{selectedLocation.manager}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">자산 수</p>
                  <p className="text-foreground">
                    {selectedLocation.assetCount}개
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">좌표</p>
                  <p className="text-foreground">
                    {selectedLocation.latitude}, {selectedLocation.longitude}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Link
                  to={`/assets?location=${selectedLocation.name}`}
                  className={`rounded-md px-3 py-1 text-sm ${getButtonVariantClass(
                    "primary"
                  )}`}
                >
                  자산 보기
                </Link>
                <Link
                  to={`/locations/edit/${selectedLocation.id}`}
                  className={`rounded-md px-3 py-1 text-sm ${getButtonVariantClass(
                    "secondary"
                  )}`}
                >
                  위치 편집
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default LocationsMap;
