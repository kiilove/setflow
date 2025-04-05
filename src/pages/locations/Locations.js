"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";
import { MapPin, Plus, Search, Edit, Trash2, Map, Info } from "lucide-react";

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 실제 구현에서는 API 호출로 대체
    const fetchLocations = async () => {
      try {
        // 예시 위치 데이터
        const data = [
          {
            id: 1,
            name: "본사 1층",
            address: "서울시 강남구 테헤란로 123",
            assetCount: 45,
            manager: "김관리자",
            description: "본사 1층 사무실",
            latitude: 37.5665,
            longitude: 126.978,
          },
          {
            id: 2,
            name: "본사 2층",
            address: "서울시 강남구 테헤란로 123",
            assetCount: 62,
            manager: "이관리자",
            description: "본사 2층 사무실",
            latitude: 37.5665,
            longitude: 126.978,
          },
          {
            id: 3,
            name: "본사 3층",
            address: "서울시 강남구 테헤란로 123",
            assetCount: 58,
            manager: "박관리자",
            description: "본사 3층 사무실",
            latitude: 37.5665,
            longitude: 126.978,
          },
          {
            id: 4,
            name: "본사 4층",
            address: "서울시 강남구 테헤란로 123",
            assetCount: 51,
            manager: "최관리자",
            description: "본사 4층 사무실",
            latitude: 37.5665,
            longitude: 126.978,
          },
          {
            id: 5,
            name: "지사 1층",
            address: "서울시 서초구 서초대로 456",
            assetCount: 32,
            manager: "정관리자",
            description: "지사 1층 사무실",
            latitude: 37.4969,
            longitude: 127.0278,
          },
          {
            id: 6,
            name: "지사 2층",
            address: "서울시 서초구 서초대로 456",
            assetCount: 28,
            manager: "한관리자",
            description: "지사 2층 사무실",
            latitude: 37.4969,
            longitude: 127.0278,
          },
          {
            id: 7,
            name: "데이터센터",
            address: "경기도 성남시 분당구 판교로 789",
            assetCount: 24,
            manager: "유관리자",
            description: "데이터센터 및 서버실",
            latitude: 37.4019,
            longitude: 127.1128,
          },
          {
            id: 8,
            name: "창고",
            address: "경기도 용인시 기흥구 동백로 101",
            assetCount: 15,
            manager: "조관리자",
            description: "자산 보관 창고",
            latitude: 37.2747,
            longitude: 127.1443,
          },
        ];
        setLocations(data);
      } catch (error) {
        console.error("위치 데이터를 불러오는 중 오류가 발생했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // 검색 필터링
  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id, name) => {
    if (window.confirm(`${name} 위치를 삭제하시겠습니까?`)) {
      // 실제 구현에서는 API 호출로 대체
      console.log(`위치 삭제: ${id}`);
      // 삭제 후 목록 업데이트
      setLocations(locations.filter((location) => location.id !== id));
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-muted-foreground">로딩 중...</span>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">위치 관리</h1>
          <div className="flex gap-2">
            <Link
              to="/locations/map"
              className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
                "secondary"
              )}`}
            >
              <Map className="h-4 w-4" />
              <span>지도 보기</span>
            </Link>
            <Link
              to="/locations/add"
              className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
                "primary"
              )}`}
            >
              <Plus className="h-4 w-4" />
              <span>위치 추가</span>
            </Link>
          </div>
        </div>

        {/* 검색 */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="위치 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* 위치 목록 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLocations.map((location) => (
            <div
              key={location.id}
              className="rounded-lg border border-border bg-card p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    {location.name}
                  </h3>
                  <p className="text-muted-foreground">{location.address}</p>
                  <p className="mt-2 text-primary font-medium">
                    자산 {location.assetCount}개
                  </p>
                  <p className="text-muted-foreground">
                    관리자: {location.manager}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/locations/edit/${location.id}`}
                    className="text-primary hover:text-primary/80 p-1"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    className="text-destructive hover:text-destructive/80 p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(location.id, location.name);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {location.description}
              </p>
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
                    "outline"
                  )}`}
                >
                  지도 보기
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-8 border border-dashed border-border rounded-md">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-medium">
              위치를 찾을 수 없습니다
            </h3>
            <p className="mt-2 text-muted-foreground">
              검색어와 일치하는 위치가 없습니다. 다른 검색어를 시도하거나 새
              위치를 추가하세요.
            </p>
            <Link
              to="/locations/add"
              className={`mt-4 inline-flex items-center px-4 py-2 rounded-md ${getButtonVariantClass(
                "primary"
              )}`}
            >
              <Plus className="mr-2 h-4 w-4" />
              위치 추가
            </Link>
          </div>
        )}

        {/* 카카오맵 API 키 안내 */}
        <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 p-4 rounded-md flex items-start">
          <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium">카카오맵 API 키 설정 필요</h4>
            <p className="mt-1 text-sm">
              실제 사용을 위해서는 카카오 개발자 사이트에서 API 키를 발급받아
              코드의 'YOUR_KAKAO_MAP_API_KEY' 부분을 교체해주세요.
              <a
                href="https://developers.kakao.com/console/app"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 underline"
              >
                카카오 개발자 사이트 바로가기
              </a>
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Locations;
