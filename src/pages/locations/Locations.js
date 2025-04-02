"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaMapMarkedAlt,
} from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";

const Locations = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // 예시 위치 데이터
  const locations = [
    {
      id: 1,
      name: "본사 1층",
      address: "서울시 강남구 테헤란로 123",
      assetCount: 45,
      manager: "김관리자",
      description: "본사 1층 사무실",
    },
    {
      id: 2,
      name: "본사 2층",
      address: "서울시 강남구 테헤란로 123",
      assetCount: 62,
      manager: "이관리자",
      description: "본사 2층 사무실",
    },
    {
      id: 3,
      name: "본사 3층",
      address: "서울시 강남구 테헤란로 123",
      assetCount: 58,
      manager: "박관리자",
      description: "본사 3층 사무실",
    },
    {
      id: 4,
      name: "본사 4층",
      address: "서울시 강남구 테헤란로 123",
      assetCount: 51,
      manager: "최관리자",
      description: "본사 4층 사무실",
    },
    {
      id: 5,
      name: "지사 1층",
      address: "서울시 서초구 서초대로 456",
      assetCount: 32,
      manager: "정관리자",
      description: "지사 1층 사무실",
    },
    {
      id: 6,
      name: "지사 2층",
      address: "서울시 서초구 서초대로 456",
      assetCount: 28,
      manager: "한관리자",
      description: "지사 2층 사무실",
    },
    {
      id: 7,
      name: "데이터센터",
      address: "경기도 성남시 분당구 판교로 789",
      assetCount: 24,
      manager: "유관리자",
      description: "데이터센터 및 서버실",
    },
    {
      id: 8,
      name: "창고",
      address: "경기도 용인시 기흥구 동백로 101",
      assetCount: 15,
      manager: "조관리자",
      description: "자산 보관 창고",
    },
  ];

  // 검색 필터링
  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer title="위치 관리">
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

        <div className="flex gap-2">
          <Link
            to="/locations/map"
            className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
              "secondary"
            )}`}
          >
            <FaMapMarkedAlt className="h-4 w-4" />
            <span>지도 보기</span>
          </Link>
          <Link
            to="/locations/add"
            className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
              "primary"
            )}`}
          >
            <FaPlus className="h-4 w-4" />
            <span>위치 추가</span>
          </Link>
        </div>
      </div>

      {/* 위치 목록 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLocations.map((location) => (
          <div
            key={location.id}
            className="rounded-lg border border-border bg-card p-4 shadow-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  {location.name}
                </h3>
                <p className="text-muted-foreground">{location.address}</p>
                <p className="mt-2 text-primary">
                  자산 {location.assetCount}개
                </p>
                <p className="text-muted-foreground">
                  관리자: {location.manager}
                </p>
              </div>
              <div className="flex space-x-2">
                <Link
                  to={`/locations/edit/${location.id}`}
                  className="text-primary hover:text-primary/80"
                >
                  <FaEdit className="h-5 w-5" />
                </Link>
                <button className="text-destructive hover:text-destructive/80">
                  <FaTrash className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <Link
                to={`/assets?location=${location.name}`}
                className={`rounded-md px-3 py-1 text-sm ${getButtonVariantClass(
                  "secondary"
                )}`}
              >
                자산 보기
              </Link>
              <Link
                to={`/locations/map?id=${location.id}`}
                className={`rounded-md px-3 py-1 text-sm ${getButtonVariantClass(
                  "secondary"
                )}`}
              >
                지도 보기
              </Link>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
};

export default Locations;
