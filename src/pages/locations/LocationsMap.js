"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";
import { List, Search, MapPin, Edit, FileText } from "lucide-react";
import { useFirestore } from "../../hooks/useFirestore";
import { useMessageContext } from "../../context/MessageContext";

const LocationsMap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const locationId = searchParams.get("id");
  const { getCollection, getDocument } = useFirestore("locations");
  const { showError } = useMessageContext();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapScriptLoaded, setMapScriptLoaded] = useState(false);

  // 카카오맵 관련 상태 및 참조
  const mapRef = useRef(null);
  const kakaoMapRef = useRef(null);
  const markersRef = useRef([]);

  // 카카오맵 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        setMapScriptLoaded(true);
      });
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // 위치 데이터 로드
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const data = await getCollection();
        setLocations(data);
        setFilteredLocations(data);

        // URL에서 locationId가 있으면 해당 위치 선택
        if (locationId) {
          const selected = data.find((loc) => loc.id === locationId);
          if (selected) {
            setSelectedLocation(selected);
          } else {
            // ID가 있지만 데이터에서 찾을 수 없는 경우 직접 조회
            try {
              const locationData = await getDocument(locationId);
              if (locationData) {
                setSelectedLocation(locationData);
              }
            } catch (err) {
              console.error(
                "위치 정보를 불러오는 중 오류가 발생했습니다:",
                err
              );
            }
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("위치 데이터를 불러오는 중 오류가 발생했습니다:", error);
        showError("데이터 로드 오류", "위치 정보를 불러올 수 없습니다.");
        setLoading(false);
      }
    };

    fetchLocations();
  }, [getCollection, getDocument, locationId, showError]);

  // 검색어에 따른 필터링
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLocations(locations);
    } else {
      const filtered = locations.filter(
        (loc) =>
          loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loc.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (loc.detail &&
            loc.detail.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredLocations(filtered);
    }
  }, [searchTerm, locations]);

  // 지도 초기화
  useEffect(() => {
    if (!mapScriptLoaded || !mapRef.current || filteredLocations.length === 0)
      return;

    try {
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

      filteredLocations.forEach((loc) => {
        if (!loc.latitude || !loc.longitude) return;

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
            <h3 style="margin-top:0;margin-bottom:8px;font-size:16px;font-weight:bold;color:#1e293b;">${
              loc.name
            }</h3>
            <p style="margin:5px 0;font-size:13px;color:#334155;">${
              loc.address
            }</p>
            ${
              loc.detail
                ? `<p style="margin:5px 0;font-size:13px;color:#334155;">${loc.detail}</p>`
                : ""
            }
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
      if (filteredLocations.length > 0) {
        map.setBounds(bounds);
      }

      // 선택된 위치가 있으면 해당 마커 활성화
      if (selectedLocation) {
        const selectedMarkerInfo = markersRef.current.find(
          (m) => m.location.id === selectedLocation.id
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
    } catch (error) {
      console.error("지도 초기화 오류:", error);
      showError("지도 오류", "지도를 초기화하는 중 오류가 발생했습니다.");
    }
  }, [mapScriptLoaded, filteredLocations, selectedLocation, showError]);

  // 위치 선택 시 지도 업데이트
  const handleLocationSelect = (loc) => {
    setSelectedLocation(loc);

    if (!kakaoMapRef.current || !mapScriptLoaded) return;

    try {
      // 선택된 위치로 지도 중심 이동
      const position = new window.kakao.maps.LatLng(
        loc.latitude,
        loc.longitude
      );
      kakaoMapRef.current.setCenter(position);
      kakaoMapRef.current.setLevel(3); // 더 가깝게 확대

      // 해당 마커의 인포윈도우 열기
      const selectedMarkerInfo = markersRef.current.find(
        (m) => m.location.id === loc.id
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
      console.error("지도 업데이트 오류:", error);
    }
  };

  return (
    <PageContainer title="위치 지도">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link
            to="/locations"
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${getButtonVariantClass(
              "outline"
            )}`}
          >
            <List className="mr-1.5 h-4 w-4" />
            목록으로 돌아가기
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
                  onClick={() => handleLocationSelect(loc)}
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
                      {loc.detail && (
                        <p className="text-xs text-muted-foreground">
                          {loc.detail}
                        </p>
                      )}
                    </div>
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
                  {selectedLocation.name}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">주소</p>
                    <p className="text-foreground">
                      {selectedLocation.address}
                      {selectedLocation.detail && (
                        <span className="block text-sm">
                          {selectedLocation.detail}
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">좌표</p>
                    <p className="text-foreground">
                      {selectedLocation.latitude}, {selectedLocation.longitude}
                    </p>
                  </div>
                </div>
                {selectedLocation.description && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">설명</p>
                    <p className="text-foreground">
                      {selectedLocation.description}
                    </p>
                  </div>
                )}
                <div className="mt-4 flex space-x-2">
                  <Link
                    to={`/assets?location=${selectedLocation.name}`}
                    className={`rounded-md px-3 py-1 text-sm ${getButtonVariantClass(
                      "secondary"
                    )}`}
                  >
                    <FileText className="h-4 w-4 mr-1.5 inline-block" />
                    자산 보기
                  </Link>
                  <Link
                    to={`/locations/edit/${selectedLocation.id}`}
                    className={`rounded-md px-3 py-1 text-sm ${getButtonVariantClass(
                      "outline"
                    )}`}
                  >
                    <Edit className="h-4 w-4 mr-1.5 inline-block" />
                    위치 편집
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default LocationsMap;
