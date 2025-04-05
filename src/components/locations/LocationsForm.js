"use client";

import { useState, useEffect } from "react";
import { getButtonVariantClass } from "../../utils/themeUtils";
import {
  Save,
  X,
  MapPin,
  Building,
  Phone,
  Mail,
  Info,
  Search,
} from "lucide-react";

const LocationsForm = ({ location, onSubmit, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "대한민국",
    manager: "",
    phone: "",
    email: "",
    description: "",
    latitude: "",
    longitude: "",
    ...location,
  });

  const [errors, setErrors] = useState({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);

  // 카카오맵 스크립트 로드 (주소 검색용)
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=0ad5b2c2799249be175ae1d00bfc1173&libraries=services&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        setMapLoaded(true);
      });
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // 주소 검색 기능
  const searchAddress = () => {
    if (!mapLoaded || !formData.address || !window.kakao || !window.kakao.maps)
      return;

    setSearchingAddress(true);

    // 주소-좌표 변환 객체 생성
    const geocoder = new window.kakao.maps.services.Geocoder();

    // 주소로 좌표 검색
    geocoder.addressSearch(formData.address, (result, status) => {
      setSearchingAddress(false);

      // 정상적으로 검색이 완료됐으면
      if (status === window.kakao.maps.services.Status.OK) {
        // 폼 데이터 업데이트
        setFormData((prev) => ({
          ...prev,
          latitude: result[0].y,
          longitude: result[0].x,
          // 행정구역 정보 업데이트
          city: result[0].address?.region_2depth_name || prev.city,
          state: result[0].address?.region_1depth_name || prev.state,
        }));

        // 성공 메시지
        alert("주소를 찾았습니다. 위도/경도 정보가 자동으로 입력되었습니다.");
      } else {
        alert("주소를 찾을 수 없습니다. 다른 주소를 입력해보세요.");
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "위치명을 입력해주세요.";
    if (!formData.address.trim()) newErrors.address = "주소를 입력해주세요.";
    if (!formData.latitude || !formData.longitude)
      newErrors.address = "주소 검색을 통해 위치 정보를 설정해주세요.";

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              <span className="flex items-center">
                <MapPin className="mr-1 text-primary h-4 w-4" />
                위치명 <span className="text-destructive">*</span>
              </span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.name ? "border-destructive" : "border-input"
              } bg-background focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="manager" className="block text-sm font-medium mb-1">
              <span className="flex items-center">
                <Building className="mr-1 text-primary h-4 w-4" />
                관리자
              </span>
            </label>
            <input
              type="text"
              id="manager"
              name="manager"
              value={formData.manager}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
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
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              <span className="flex items-center">
                <MapPin className="mr-1 text-primary h-4 w-4" />
                주소 <span className="text-destructive">*</span>
              </span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.address ? "border-destructive" : "border-input"
                } bg-background focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="정확한 주소를 입력한 후 '주소 검색' 버튼을 클릭하세요"
              />
              <button
                type="button"
                onClick={searchAddress}
                disabled={!mapLoaded || !formData.address || searchingAddress}
                className={`px-3 py-2 rounded-md ${getButtonVariantClass(
                  "secondary"
                )} flex items-center whitespace-nowrap`}
              >
                {searchingAddress ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    검색 중...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-1" />
                    주소 검색
                  </>
                )}
              </button>
            </div>
            {errors.address && (
              <p className="mt-1 text-sm text-destructive">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="city" className="block text-sm font-medium mb-1">
                시/군/구
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="state" className="block text-sm font-medium mb-1">
                시/도
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium mb-1"
              >
                우편번호
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="country" className="block text-sm font-medium mb-1">
              국가
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* 연락처 정보 */}
      <div>
        <div className="flex items-center mb-4 pb-2 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">연락처 정보</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              <span className="flex items-center">
                <Phone className="mr-1 text-primary h-4 w-4" />
                전화번호
              </span>
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              <span className="flex items-center">
                <Mail className="mr-1 text-primary h-4 w-4" />
                이메일
              </span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* 위치 정보 (숨겨진 필드) */}
      <div>
        <div className="flex items-center mb-4 pb-2 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">위치 정보</h3>
          <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full">
            자동 입력
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="latitude"
              className="block text-sm font-medium mb-1"
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
              className="block text-sm font-medium mb-1"
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

      {/* 추가 정보 */}
      <div>
        <div className="flex items-center mb-4 pb-2 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">추가 정보</h3>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            <span className="flex items-center">
              <Info className="mr-1 text-primary h-4 w-4" />
              설명
            </span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* 카카오맵 API 키 안내 */}
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
    </form>
  );
};

export default LocationsForm;
