"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";
import { List, Search, MapPin, Info } from "lucide-react";
import PageLoading from "../../components/common/PageLoading";

const LocationsMap = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const locationId = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapScriptLoaded, setMapScriptLoaded] = useState(false);

  // 카카오맵 관련 상태 및 참조
  const mapRef = useRef(null);
  const kakaoMapRef = useRef(null);
  const markersRef = useRef([]);

  // 카카오맵 스크립트 로드
  useEffect(() => {
    // 이미 스크립트가 로드되어 있는지 확인
    const existingScript = document.getElementById("kakao-map-script");
    if (existingScript) {
      // 이미 스크립트가 있으면 로드 완료 상태로 설정
      setMapScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "kakao-map-script"; // ID 추가하여 중복 로드 방지
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=0ad5b2c2799249be175ae1d00bfc1173&autoload=false`;

    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log("Kakao Maps SDK loaded successfully");
        setMapScriptLoaded(true);
      });
    };

    script.onerror = (error) => {
      console.error("Error loading Kakao Maps SDK:", error);
    };

    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거는 하지 않음
      // 스크립트를 제거하면 다시 로드할 때 문제가 발생할 수 있음
    };
  }, []);

  // 위치 데이터 로드 및 지도 초기화
  useEffect(() => {
    if (!mapScriptLoaded) return;

    const fetchLocations = async () => {
      try {
        console.log("Fetching location data...");
        // 예시 위치 데이터
        const data = [
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
        setLocations(data);

        // URL에서 locationId가 있으면 해당 위치 선택
        if (locationId) {
          const selected = data.find(
            (loc) => loc.id === Number.parseInt(locationId)
          );
          if (selected) {
            setSelectedLocation(selected);
          }
        }

        setLoading(false);

        // 지도 초기화는 데이터 로드 후에 수행
        setTimeout(() => {
          // 약간의 지연을 주어 DOM이 완전히 렌더링된 후 지도 초기화
          initializeMap(data, locationId ? Number.parseInt(locationId) : null);
        }, 100);
      } catch (error) {
        console.error("위치 데이터를 불러오는 중 오류가 발생했습니다:", error);
        setLoading(false);
      }
    };

    fetchLocations();
  }, [locationId, mapScriptLoaded]);

  // 지도 초기화 함수
  const initializeMap = (locationsData, selectedId) => {
    if (!mapRef.current || !window.kakao || !window.kakao.maps) {
      console.error("Map initialization failed: Missing required references");
      return;
    }

    try {
      console.log("Initializing map...");

      // 지도 옵션 설정
      const mapOption = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 중심 좌표
        level: 8, // 지도 확대 레벨
      };

      // 지도 생성
      const map = new window.kakao.maps.Map(mapRef.current, mapOption);
      kakaoMapRef.current = map;

      // 지도 컨트롤 추가
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      // 지도 타입 컨트롤 추가
      const mapTypeControl = new window.kakao.maps.MapTypeControl();
      map.addControl(
        mapTypeControl,
        window.kakao.maps.ControlPosition.TOPRIGHT
      );

      // 마커 생성 및 표시
      const bounds = new window.kakao.maps.LatLngBounds();
      markersRef.current = [];

      locationsData.forEach((loc) => {
        const position = new window.kakao.maps.LatLng(
          loc.latitude,
          loc.longitude
        );

        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: position,
          map: map,
          title: loc.name,
        });

        // 인포윈도우 생성
        const infoContent = `
           <div style="padding:12px;width:220px;background-color:#f8fafc;border-radius:6px;box-shadow:0 2px 5px rgba(0,0,0,0.1);">
    <h3 style="margin-top:0;margin-bottom:8px;font-size:16px;font-weight:bold;color:#1e293b;">${loc.name}</h3>
    <p style="margin:5px 0;font-size:13px;color:#334155;">${loc.address}</p>
    <p style="margin:5px 0;font-size:13px;color:#334155;font-weight:500;">자산: <span style="color:#3b82f6;font-weight:600;">${loc.assetCount}개</span></p>
  </div>
        `;

        const infoWindow = new window.kakao.maps.InfoWindow({
          content: infoContent,
          removable: true,
        });

        // 마커 클릭 이벤트
        window.kakao.maps.event.addListener(marker, "click", () => {
          // 이전에 열린 인포윈도우 닫기
          markersRef.current.forEach((m) => {
            if (m.infoWindow.getMap()) {
              m.infoWindow.close();
            }
          });

          // 현재 인포윈도우 열기
          infoWindow.open(map, marker);

          // 선택된 위치 업데이트
          setSelectedLocation(loc);
        });

        // 마커와 인포윈도우 저장
        markersRef.current.push({ marker, infoWindow, location: loc });

        // 지도 범위에 포함
        bounds.extend(position);
      });

      // 모든 마커가 보이도록 지도 범위 설정
      if (locationsData.length > 0) {
        map.setBounds(bounds);
      }

      // 선택된 위치가 있으면 해당 마커 활성화
      if (selectedId) {
        const selectedMarkerInfo = markersRef.current.find(
          (m) => m.location.id === selectedId
        );
        if (selectedMarkerInfo) {
          const { marker, infoWindow, location } = selectedMarkerInfo;

          // 지도 중심 이동
          map.setCenter(
            new window.kakao.maps.LatLng(location.latitude, location.longitude)
          );
          map.setLevel(3); // 더 가깝게 확대

          // 인포윈도우 열기
          infoWindow.open(map, marker);
        }
      }

      console.log("Map initialized successfully");
    } catch (error) {
      console.error("Map initialization error:", error);
    }
  };

  // 위치 선택 시 지도 업데이트
  useEffect(() => {
    if (
      !selectedLocation ||
      !kakaoMapRef.current ||
      !window.kakao ||
      !window.kakao.maps
    )
      return;

    try {
      console.log("Updating map for selected location:", selectedLocation.name);

      // 선택된 위치로 지도 중심 이동
      const position = new window.kakao.maps.LatLng(
        selectedLocation.latitude,
        selectedLocation.longitude
      );

      kakaoMapRef.current.setCenter(position);
      kakaoMapRef.current.setLevel(3); // 더 가깝게 확대

      // 해당 마커의 인포윈도우 열기
      const selectedMarkerInfo = markersRef.current.find(
        (m) => m.location.id === selectedLocation.id
      );

      if (selectedMarkerInfo) {
        // 이전에 열린 인포윈도우 닫기
        markersRef.current.forEach((m) => {
          if (m.infoWindow.getMap()) {
            m.infoWindow.close();
          }
        });

        // 선택된 마커의 인포윈도우 열기
        selectedMarkerInfo.infoWindow.open(
          kakaoMapRef.current,
          selectedMarkerInfo.marker
        );
      }
    } catch (error) {
      console.error("Error updating map for selected location:", error);
    }
  }, [selectedLocation]);

  // 검색 필터링
  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <PageContainer>
        <PageLoading />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">위치 지도</h1>
          <Link
            to="/locations"
            className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
              "secondary"
            )}`}
          >
            <List className="h-4 w-4" />
            <span>목록 보기</span>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* 위치 목록 */}
          <div className="md:col-span-1 rounded-lg border border-border bg-card p-4 shadow-md">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="위치 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              위치 목록 ({filteredLocations.length})
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {filteredLocations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc)}
                  className={`block w-full p-3 rounded-md transition-colors text-left ${
                    selectedLocation && selectedLocation.id === loc.id
                      ? "bg-primary/10 border border-primary/30 text-primary"
                      : "bg-accent hover:bg-accent/80 text-foreground"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1.5" />
                        {loc.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {loc.address}
                      </p>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {loc.assetCount}
                    </span>
                  </div>
                </button>
              ))}

              {filteredLocations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          </div>

          {/* 지도 */}
          <div className="md:col-span-2 rounded-lg border border-border bg-card p-4 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-foreground">지도</h3>
              {selectedLocation && (
                <span className="text-sm text-muted-foreground">
                  {selectedLocation.name} 위치 표시 중
                </span>
              )}
            </div>

            {/* 카카오맵이 렌더링될 div */}
            <div
              ref={mapRef}
              id="kakao-map"
              className="w-full h-[400px] rounded-md"
              style={{ border: "1px solid #ddd" }}
            >
              {!mapScriptLoaded && (
                <div className="flex items-center justify-center h-full bg-muted">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-muted-foreground">
                      지도를 불러오는 중...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 선택된 위치 정보 */}
            {selectedLocation && (
              <div className="mt-4 p-4 rounded-md bg-accent">
                <h4 className="text-lg font-medium text-foreground mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  {selectedLocation.name} 정보
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">주소</p>
                    <p className="text-foreground">
                      {selectedLocation.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">관리자</p>
                    <p className="text-foreground">
                      {selectedLocation.manager}
                    </p>
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

        {/* 카카오맵 사용 안내 - API 키가 이미 설정되어 있으므로 안내 메시지 수정 */}
        <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 p-4 rounded-md flex items-start">
          <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium">카카오맵 API 사용 중</h4>
            <p className="mt-1 text-sm">
              현재 카카오맵 API 키가 설정되어 있습니다. 도메인 제한이 있을 수
              있으니 실제 배포 시에는{" "}
              <a
                href="https://developers.kakao.com/console/app"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                카카오 개발자 사이트
              </a>
              에서 도메인 설정을 확인해주세요.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default LocationsMap;
