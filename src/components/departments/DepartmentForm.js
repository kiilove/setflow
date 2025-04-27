"use client";

import { useState, useEffect } from "react";
import { getButtonVariantClass } from "../../utils/themeUtils";
import { Save, X, MapPin, Building } from "lucide-react";
import DepartmentIconSelector from "./DepartmentIconSelector";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const DepartmentForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    name: initialValues?.name || "",
    description: initialValues?.description || "",
    locationId: initialValues?.locationId || "",
    address: initialValues?.address || "",
    detail: initialValues?.detail || "",
    icon: initialValues?.icon || "Building",
    iconColor: initialValues?.iconColor || "bg-gray-100",
    iconTextColor: initialValues?.iconTextColor || "text-gray-500",
  });

  const [errors, setErrors] = useState({});
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoadingLocations(true);
        const docRef = doc(db, "settings", "locations");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setLocations(data.locations || []);
        }
      } catch (error) {
        console.error("위치 데이터를 불러오는 중 오류가 발생했습니다:", error);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationChange = (e) => {
    const locationId = e.target.value;

    if (locationId) {
      const selectedLocation = locations.find((loc) => loc.id === locationId);
      if (selectedLocation) {
        setFormData({
          ...formData,
          locationId: locationId,
          address: selectedLocation.address,
          detail: selectedLocation.detail || "",
        });
      }
    } else {
      setFormData({
        ...formData,
        locationId: "",
        address: "",
        detail: "",
      });
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
      newErrors.name = "부서명을 입력해주세요";
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
              부서명 <span className="text-destructive">*</span>
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
              부서에 대한 간략한 설명을 입력하세요.
            </p>
          </div>

          {/* 아이콘 선택기 */}
          <DepartmentIconSelector
            selectedIcon={formData.icon}
            selectedColor={{
              name: formData.iconColorName || "기본",
              bg: formData.iconColor,
              text: formData.iconTextColor,
            }}
            onSelectIcon={(icon) => setFormData({ ...formData, icon })}
            onSelectColor={(color) =>
              setFormData({
                ...formData,
                iconColor: color.bg,
                iconTextColor: color.text,
                iconColorName: color.name,
              })
            }
          />
        </div>
      </div>

      {/* 위치 정보 */}
      <div>
        <div className="flex items-center mb-4 pb-2 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">위치 정보</h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="locationId"
              className="block text-sm font-medium text-foreground"
            >
              위치 선택
            </label>
            <select
              id="locationId"
              name="locationId"
              value={formData.locationId}
              onChange={handleLocationChange}
              className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            >
              <option value="">위치 선택...</option>
              {loadingLocations ? (
                <option disabled>로딩 중...</option>
              ) : (
                locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name} ({location.address})
                  </option>
                ))
              )}
            </select>
            <p className="text-xs text-muted-foreground">
              부서의 위치를 선택하세요. 위치 정보는 자동으로 채워집니다.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-foreground"
            >
              주소
            </label>
            <div className="relative">
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-4 py-2 pl-10 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                placeholder="위치를 선택하면 자동으로 채워집니다"
                readOnly
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
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
              readOnly
            />
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
    </form>
  );
};

export default DepartmentForm;
