"use client";

import { useState, useEffect, useRef } from "react";
import { getButtonVariantClass } from "../../utils/themeUtils";
import { Save, X, MapPin, Building, Search } from "lucide-react";
import DaumPostcode from "react-daum-postcode";

const LocationForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    detail: "",
    description: "",
    ...initialValues,
  });

  const [errors, setErrors] = useState({});
  const [showPostcode, setShowPostcode] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [kakaoReady, setKakaoReady] = useState(false);
  const mapRef = useRef(null);
  const kakaoMapRef = useRef(null);
  const markerRef = useRef(null);
  const checkIntervalRef = useRef(null);

  // 카카오맵 스크립트 로드
  useEffect(() => {
    // 이미 로드된 스크립트가 있는지 확인
    const existingScript = document.getElementById("kakao-maps-sdk");

    // 스크립트 로드 함수
    const loadKakaoScript = () => {
      const script = document.createElement("script");
      script.id = "kakao-maps-sdk";
      script.async = true;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=0ad5b2c2799249be175ae1d00bfc1173&libraries=services&autoload=false`;
      document.head.appendChild(script);

      script.onload = () => {
        console.log("Kakao Maps SDK script loaded");
        setScriptLoaded(true);

        // 스크립트가 로드된 후 kakao.maps.load 호출
        if (window.kakao) {
          window.kakao.maps.load(() => {
            console.log("Kakao Maps API initialized");
            setKakaoReady(true);
            setMapLoaded(true);
          });
        }
      };

      script.onerror = (e) => {
        console.error("Error loading Kakao Maps SDK:", e);
      };
    };

    if (existingScript) {
      setScriptLoaded(true);

      // 이미 kakao 객체가 초기화되었는지 확인
      if (window.kakao && window.kakao.maps) {
        console.log("Kakao Maps SDK already loaded");
        setKakaoReady(true);
        setMapLoaded(true);
      } else if (window.kakao) {
        // kakao 객체는 있지만 maps가 초기화되지 않은 경우
        window.kakao.maps.load(() => {
          console.log("Kakao Maps API initialized");
          setKakaoReady(true);
          setMapLoaded(true);
        });
      } else {
        // 스크립트는 있지만 kakao 객체가 없는 경우 - 일정 시간 후 다시 확인
        const checkKakaoInterval = setInterval(() => {
          if (window.kakao) {
            clearInterval(checkKakaoInterval);

            if (window.kakao.maps) {
              setKakaoReady(true);
              setMapLoaded(true);
            } else {
              window.kakao.maps.load(() => {
                console.log("Kakao Maps API initialized after interval check");
                setKakaoReady(true);
                setMapLoaded(true);
              });
            }
          }
        }, 500);

        // 10초 후에도 로드되지 않으면 인터벌 정리
        setTimeout(() => {
          clearInterval(checkKakaoInterval);
          if (!kakaoReady) {
            console.error("Failed to load Kakao Maps after 10 seconds");
            // 스크립트 다시 로드 시도
            loadKakaoScript();
          }
        }, 10000);

        checkIntervalRef.current = checkKakaoInterval;
      }
    } else {
      // 스크립트가 없으면 로드
      loadKakaoScript();
    }

    return () => {
      // 컴포넌트 언마운트 시 인터벌 정리
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  // 지도 초기화 - kakaoReady 상태가 true일 때만 실행
  useEffect(() => {
    if (!kakaoReady || !mapRef.current) return;

    console.log("Initializing map with Kakao Maps API");

    try {
      const mapOption = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 중심 좌표
        level: 3,
      };

      const map = new window.kakao.maps.Map(mapRef.current, mapOption);
      kakaoMapRef.current = map;

      // 기존 위치 정보가 있으면 주소 검색으로 마커 표시
      if (formData.address) {
        searchAddressCoordinates(formData.address);
      }

      // 지도 클릭 이벤트 등록
      window.kakao.maps.event.addListener(map, "click", (mouseEvent) => {
        // 클릭한 위치의 좌표 정보 가져오기
        const latlng = mouseEvent.latLng;

        // 기존 마커 제거
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        // 새 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: latlng,
          map: map,
        });
        markerRef.current = marker;

        // 폼 데이터 업데이트
        setFormData((prev) => ({
          ...prev,
          latitude: latlng.getLat(),
          longitude: latlng.getLng(),
        }));

        // 좌표로 주소 검색
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2Address(
          latlng.getLng(),
          latlng.getLat(),
          (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              if (result[0].road_address) {
                setFormData((prev) => ({
                  ...prev,
                  address: result[0].road_address.address_name,
                }));
              } else if (result[0].address) {
                setFormData((prev) => ({
                  ...prev,
                  address: result[0].address.address_name,
                }));
              }
            }
          }
        );
      });

      // 지도 컨트롤 추가
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
    } catch (error) {
      console.error("Map initialization error:", error);
    }
  }, [kakaoReady, formData.address]);

  // 주소 검색 완료 핸들러
  const handleComplete = (data) => {
    const fullAddress = data.address;
    setFormData((prev) => ({
      ...prev,
      address: fullAddress,
    }));
    setShowPostcode(false);

    if (kakaoReady) {
      searchAddressCoordinates(fullAddress);
    }
  };

  // 주소로 좌표 검색 및 마커 표시
  const searchAddressCoordinates = (address) => {
    if (!kakaoReady || !address || !kakaoMapRef.current) {
      console.log("Cannot search address: map not ready or address empty");
      return;
    }

    console.log("Searching address:", address);

    try {
      // 주소-좌표 변환 객체 생성
      const geocoder = new window.kakao.maps.services.Geocoder();

      // 주소로 좌표 검색
      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          console.log("Address search result:", result);

          // 폼 데이터 업데이트
          setFormData((prev) => ({
            ...prev,
            latitude: result[0].y,
            longitude: result[0].x,
          }));

          // 지도에 마커 표시
          const position = new window.kakao.maps.LatLng(
            result[0].y,
            result[0].x
          );

          // 기존 마커 제거
          if (markerRef.current) {
            markerRef.current.setMap(null);
          }

          // 새 마커 생성
          const marker = new window.kakao.maps.Marker({
            position: position,
            map: kakaoMapRef.current,
          });
          markerRef.current = marker;

          // 인포윈도우로 장소에 대한 설명 표시
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;width:150px;text-align:center;">${
              formData.name || address
            }</div>`,
          });
          infowindow.open(kakaoMapRef.current, marker);

          // 지도 중심 이동
          kakaoMapRef.current.setCenter(position);
        } else {
          console.error("Address search failed:", status);
          alert("주소를 찾을 수 없습니다. 다른 주소를 입력해보세요.");
        }
      });
    } catch (error) {
      console.error("Error during address search:", error);
      alert("주소 검색 중 오류가 발생했습니다.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "위치명을 입력해주세요";
    }
    if (!formData.address.trim()) {
      newErrors.address = "주소를 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 기본 정보 */}
      <div>
        <div className="flex items-center mb-4 pb-2 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">기본 정보</h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground"
            >
              위치명 <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`w-full rounded-md border ${
                  errors.name ? "border-destructive" : "border-input"
                } bg-background px-4 py-2 pl-10 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors`}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Building className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-foreground"
            >
              설명
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
            <p className="text-xs text-muted-foreground">
              위치에 대한 간략한 설명을 입력하세요.
            </p>
          </div>
        </div>
      </div>

      {/* 주소 정보 */}
      <div>
        <div className="flex items-center mb-4 pb-2 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">주소 정보</h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-foreground"
            >
              주소 <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    errors.address ? "border-destructive" : "border-input"
                  } bg-background px-4 py-2 pl-10 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors`}
                  placeholder="주소 검색 버튼을 클릭하여 주소를 입력하세요"
                  readOnly
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPostcode(true)}
                className={`px-3 py-2 rounded-md ${getButtonVariantClass(
                  "secondary"
                )} flex items-center whitespace-nowrap`}
              >
                <Search className="h-4 w-4 mr-1" />
                주소 검색
              </button>
            </div>
            {errors.address && (
              <p className="text-xs text-destructive">{errors.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="detail"
              className="block text-sm font-medium text-foreground"
            >
              상세 주소
            </label>
            <input
              type="text"
              id="detail"
              name="detail"
              value={formData.detail}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              지도에서 위치 선택 <span className="text-destructive">*</span>
            </label>
            <div
              ref={mapRef}
              className="w-full h-[300px] rounded-md border border-input"
              style={{ display: kakaoReady ? "block" : "none" }}
            ></div>
            {!kakaoReady && (
              <div className="w-full h-[300px] rounded-md border border-input bg-muted flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-muted-foreground">지도를 불러오는 중...</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {scriptLoaded
                      ? "카카오맵 API 초기화 중..."
                      : "카카오맵 스크립트 로딩 중..."}
                  </p>
                </div>
              </div>
            )}
            {errors.map && (
              <p className="text-xs text-destructive">{errors.map}</p>
            )}
            <p className="text-xs text-muted-foreground">
              지도를 클릭하여 정확한 위치를 지정하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="latitude"
                className="block text-sm font-medium text-muted-foreground"
              >
                위도
              </label>
              <input
                type="text"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                readOnly
                className="w-full px-3 py-2 border rounded-md border-input bg-muted text-muted-foreground focus:outline-none"
              />
              <p className="text-xs text-muted-foreground">
                주소 검색 시 자동으로 입력됩니다
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="longitude"
                className="block text-sm font-medium text-muted-foreground"
              >
                경도
              </label>
              <input
                type="text"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                readOnly
                className="w-full px-3 py-2 border rounded-md border-input bg-muted text-muted-foreground focus:outline-none"
              />
              <p className="text-xs text-muted-foreground">
                주소 검색 시 자동으로 입력됩니다
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${getButtonVariantClass(
            "outline"
          )}`}
        >
          <X className="mr-2 -ml-1 h-4 w-4" />
          취소
        </button>
        <button
          type="submit"
          className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${getButtonVariantClass(
            "primary"
          )}`}
        >
          <Save className="mr-2 -ml-1 h-4 w-4" />
          {isEditing ? "수정 완료" : "저장"}
        </button>
      </div>

      {/* 다음 주소 검색 모달 */}
      {showPostcode && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">주소 검색</h3>
              <button
                type="button"
                onClick={() => setShowPostcode(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <DaumPostcode
              onComplete={handleComplete}
              style={{ height: 400 }}
              autoClose={false}
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default LocationForm;
