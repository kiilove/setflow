"use client";

import { useState } from "react";
import {
  Building2,
  Save,
  CheckCircle,
  FileText,
  MapPin,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { getButtonVariantClass } from "../../utils/themeUtils";

const CompanySettings = () => {
  const [companySettings, setCompanySettings] = useState({
    companyName: "",
    businessRegistrationNumber: "",
    representativeName: "",
    businessType: "",
    businessCategory: "",
    establishmentDate: "",
    address: "",
    phoneNumber: "",
    email: "",
    website: "",
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setCompanySettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveSettings = () => {
    // 실제 구현에서는 API 호출로 설정 저장
    console.log("Saving company settings:", companySettings);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {saveSuccess && (
        <div className="mb-6 p-4 rounded-md bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300 flex items-center">
          <CheckCircle className="mr-2 h-4 w-4" />
          <span>회사 정보가 성공적으로 저장되었습니다.</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground theme-transition flex items-center">
          <Building2 className="mr-2 h-6 w-6 text-blue-500" />
          회사 설정
        </h2>
        <button
          onClick={handleSaveSettings}
          className={`${getButtonVariantClass(
            "primary"
          )} px-4 py-2 flex items-center rounded-md`}
        >
          <Save className="mr-2 h-4 w-4" />
          저장
        </button>
      </div>

      {/* 회사 기본 정보 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
        <div className="p-4 border-b border-border theme-transition">
          <h3 className="text-lg font-medium text-foreground theme-transition flex items-center">
            <Building2 className="mr-2 h-5 w-5 text-blue-500" />
            회사 기본 정보
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-foreground theme-transition mb-1"
              >
                회사명
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={companySettings.companyName}
                onChange={handleSettingChange}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="businessRegistrationNumber"
                className="block text-sm font-medium text-foreground theme-transition mb-1"
              >
                사업자등록번호
              </label>
              <input
                type="text"
                id="businessRegistrationNumber"
                name="businessRegistrationNumber"
                value={companySettings.businessRegistrationNumber}
                onChange={handleSettingChange}
                placeholder="000-00-00000"
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="representativeName"
                className="block text-sm font-medium text-foreground theme-transition mb-1"
              >
                대표자명
              </label>
              <input
                type="text"
                id="representativeName"
                name="representativeName"
                value={companySettings.representativeName}
                onChange={handleSettingChange}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="establishmentDate"
                className="block text-sm font-medium text-foreground theme-transition mb-1"
              >
                설립일
              </label>
              <input
                type="date"
                id="establishmentDate"
                name="establishmentDate"
                value={companySettings.establishmentDate}
                onChange={handleSettingChange}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 사업자 정보 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
        <div className="p-4 border-b border-border theme-transition">
          <h3 className="text-lg font-medium text-foreground theme-transition flex items-center">
            <FileText className="mr-2 h-5 w-5 text-blue-500" />
            사업자 정보
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="businessType"
                className="block text-sm font-medium text-foreground theme-transition mb-1"
              >
                업태
              </label>
              <input
                type="text"
                id="businessType"
                name="businessType"
                value={companySettings.businessType}
                onChange={handleSettingChange}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="businessCategory"
                className="block text-sm font-medium text-foreground theme-transition mb-1"
              >
                업종
              </label>
              <input
                type="text"
                id="businessCategory"
                name="businessCategory"
                value={companySettings.businessCategory}
                onChange={handleSettingChange}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 연락처 정보 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
        <div className="p-4 border-b border-border theme-transition">
          <h3 className="text-lg font-medium text-foreground theme-transition flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-blue-500" />
            연락처 정보
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-foreground theme-transition mb-1"
              >
                주소
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={companySettings.address}
                onChange={handleSettingChange}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-foreground theme-transition mb-1"
              >
                전화번호
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={companySettings.phoneNumber}
                onChange={handleSettingChange}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground theme-transition mb-1"
              >
                이메일
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={companySettings.email}
                onChange={handleSettingChange}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-foreground theme-transition mb-1"
              >
                웹사이트
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={companySettings.website}
                onChange={handleSettingChange}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;
