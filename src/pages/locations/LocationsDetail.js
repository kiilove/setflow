"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";
import { useFirestore } from "../../hooks/useFirestore";
import { useMessageContext } from "../../context/MessageContext";
import { Edit, ArrowLeft, Trash2, Map, MapPin, FileText } from "lucide-react";

const LocationsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocument, deleteDocument } = useFirestore("locations");
  const { showConfirm, showSuccess, showError } = useMessageContext();

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);

  // 위치 데이터 로드
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);
        const data = await getDocument(id);

        if (!data) {
          throw new Error("위치를 찾을 수 없습니다.");
        }

        setLocation(data);
      } catch (err) {
        console.error("위치 로딩 오류:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id, getDocument]);

  // 카카오맵 스크립트 로드
  useEffect(() => {
    // 이미 로드된 스크립트가 있는지 확인
    const existingScript = document.getElementById("kakao-maps-sdk");
    if (existingScript) {
      // 이미 스크립트가 로드되어 있으면 바로 초기화
      if (window.kakao && window.kakao.maps) {
        setMapLoaded(true);
      } else {
        // kakao 객체는 있지만 maps가 초기화되지 않은 경우
        window.kakao.maps.load(() => {
          setMapLoaded(true);
        });
      }
      return;
    }

    // 스크립트 생성 및 로드
    const script = document.createElement("script");
    script.id = "kakao-maps-sdk";
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=0ad5b2c2799249be175ae1d00bfc1173&libraries=services&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log("Kakao Maps SDK loaded successfully");
        setMapLoaded(true);
      });
    };

    script.onerror = (e) => {
      console.error("Error loading Kakao Maps SDK:", e);
    };

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거하지 않음 (다른 컴포넌트에서 재사용)
    };
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (
      !mapLoaded ||
      !mapRef.current ||
      !location ||
      !window.kakao ||
      !window.kakao.maps
    )
      return;

    try {
      // 지도 생성
      const mapOption = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978), // 기본 중심 좌표
        level: 3, // 지도 확대 레벨
      };
      const map = new window.kakao.maps.Map(mapRef.current, mapOption);

      // 주소로 좌표 검색
      if (window.kakao.maps.services && window.kakao.maps.services.Geocoder) {
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(location.address, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            // 결과값으로 받은 위치를 마커로 표시
            const coords = new window.kakao.maps.LatLng(
              result[0].y,
              result[0].x
            );

            // 마커 생성
            const marker = new window.kakao.maps.Marker({
              map: map,
              position: coords,
            });

            // 인포윈도우로 장소에 대한 설명 표시
            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:5px;width:150px;text-align:center;">${location.name}</div>`,
            });
            infowindow.open(map, marker);

            // 지도의 중심을 결과값으로 받은 위치로 이동
            map.setCenter(coords);
          } else {
            console.error("Address search failed:", status);

            // 좌표가 있으면 좌표로 표시
            if (location.latitude && location.longitude) {
              const coords = new window.kakao.maps.LatLng(
                location.latitude,
                location.longitude
              );

              // 마커 생성
              const marker = new window.kakao.maps.Marker({
                map: map,
                position: coords,
              });

              // 인포윈도우로 장소에 대한 설명 표시
              const infowindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:5px;width:150px;text-align:center;">${location.name}</div>`,
              });
              infowindow.open(map, marker);

              // 지도의 중심을 결과값으로 받은 위치로 이동
              map.setCenter(coords);
            }
          }
        });
      } else {
        console.error("Geocoder service not available");
      }

      // 지도 컨트롤 추가
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
    } catch (error) {
      console.error("Map initialization error:", error);
    }
  }, [mapLoaded, location]);

  // 위치 삭제 핸들러
  const handleDelete = async () => {
    const confirmed = await showConfirm(
      "위치 삭제",
      `"${location.name}" 위치를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      {
        confirmText: "삭제",
        cancelText: "취소",
        confirmVariant: "error",
      }
    );

    if (confirmed) {
      try {
        await deleteDocument(id);
        showSuccess("위치 삭제 완료", "위치가 성공적으로 삭제되었습니다.");
        navigate("/locations");
      } catch (error) {
        console.error("위치 삭제 중 오류가 발생했습니다:", error);
        showError("삭제 오류", "위치 삭제에 실패했습니다.");
      }
    }
  };

  if (loading) {
    return (
      <PageContainer title="위치 상세 정보">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-muted-foreground">로딩 중...</span>
        </div>
      </PageContainer>
    );
  }

  if (error || !location) {
    return (
      <PageContainer title="위치 상세 정보">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground">
            위치를 찾을 수 없습니다
          </h3>
          <p className="text-muted-foreground mt-2">
            {error || "요청하신 위치 ID가 존재하지 않습니다."}
          </p>
          <Link
            to="/locations"
            className={`mt-4 inline-flex items-center px-4 py-2 rounded-md ${getButtonVariantClass(
              "primary"
            )}`}
          >
            위치 목록으로 돌아가기
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={`위치 상세 정보: ${location.name}`}>
      {/* 상단 액션 버튼 */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/locations"
          className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${getButtonVariantClass(
            "outline"
          )}`}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          목록으로 돌아가기
        </Link>
        <div className="flex space-x-2">
          <Link
            to={`/locations/map?id=${location.id}`}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${getButtonVariantClass(
              "secondary"
            )}`}
          >
            <Map className="mr-1.5 h-4 w-4" />
            지도에서 보기
          </Link>
          <Link
            to={`/locations/edit/${id}`}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${getButtonVariantClass(
              "primary"
            )}`}
          >
            <Edit className="mr-1.5 h-4 w-4" />
            위치 편집
          </Link>
          <button
            onClick={handleDelete}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${getButtonVariantClass(
              "destructive"
            )}`}
          >
            <Trash2 className="mr-1.5 h-4 w-4" />
            위치 삭제
          </button>
        </div>
      </div>

      {/* 위치 기본 정보 */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary mr-4">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {location.name}
              </h2>
            </div>
          </div>

          {location.description && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                설명
              </h3>
              <p className="text-foreground">{location.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* 위치 주소 정보 */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">주소 정보</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                주소
              </h4>
              <p className="text-foreground">{location.address}</p>
              {location.detail && (
                <p className="text-sm text-muted-foreground mt-1">
                  {location.detail}
                </p>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                좌표
              </h4>
              <p className="text-foreground">
                위도: {location.latitude}, 경도: {location.longitude}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 지도 */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">지도</h3>
        </div>
        <div className="p-6">
          <div
            ref={mapRef}
            className="w-full h-[400px] rounded-md border border-input"
            style={{ display: mapLoaded ? "block" : "none" }}
          ></div>
          {!mapLoaded && (
            <div className="w-full h-[400px] rounded-md border border-input bg-muted flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-muted-foreground">지도를 불러오는 중...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 관련 자산 섹션 (실제 구현에서는 API 호출로 데이터 가져오기) */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-semibold text-foreground">관련 자산</h3>
          <Link
            to={`/assets?location=${location.name}`}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${getButtonVariantClass(
              "secondary"
            )}`}
          >
            <FileText className="mr-1.5 h-4 w-4" />
            모든 자산 보기
          </Link>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            이 위치에 등록된 자산 정보를 불러오는 중입니다...
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default LocationsDetail;
