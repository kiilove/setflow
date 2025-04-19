"use client";

import { useState } from "react";
import { Building, Save, CheckCircle } from "lucide-react";

const SettingsCompany = () => {
  const [companySettings, setCompanySettings] = useState({
    companyName: "Setflow Inc.",
    businessRegistrationNumber: "123-45-67890",
    representativeName: "홍길동",
    companyAddress: "서울특별시 강남구 테헤란로 123",
    companyPhone: "02-1234-5678",
    companyEmail: "info@setflow.com",
    industry: "IT 서비스",
    establishmentDate: "2020-01-01",
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 설정 변경 핸들러
  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setCompanySettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 설정 저장 핸들러
  const handleSaveSettings = () => {
    // 실제 구현에서는 API 호출로 설정 저장
    console.log("Saving settings:", companySettings);

    // 성공 메시지 표시
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* 설정 저장 성공 메시지 */}
      {saveSuccess && (
        <div className="mb-6 p-4 rounded-md bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300 flex items-center">
          <CheckCircle className="mr-2 h-4 w-4" />
          <span>설정이 성공적으로 저장되었습니다.</span>
        </div>
      )}

      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
        <div className="p-4 border-b border-border theme-transition">
          <h3 className="text-lg font-medium text-foreground theme-transition flex items-center">
            <Building className="mr-2 h-5 w-5 text-blue-500" />
            회사 설정
          </h3>
        </div>
        <div className="p-4">
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-foreground theme-transition">
                  기본 정보
                </h4>

                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                  >
                    회사명
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={companySettings.companyName}
                    onChange={handleSettingChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="businessRegistrationNumber"
                    className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                  >
                    사업자등록번호
                  </label>
                  <input
                    type="text"
                    id="businessRegistrationNumber"
                    name="businessRegistrationNumber"
                    value={companySettings.businessRegistrationNumber}
                    onChange={handleSettingChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="representativeName"
                    className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                  >
                    대표자명
                  </label>
                  <input
                    type="text"
                    id="representativeName"
                    name="representativeName"
                    value={companySettings.representativeName}
                    onChange={handleSettingChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                  />
                </div>
              </div>

              {/* 연락처 정보 */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-foreground theme-transition">
                  연락처 정보
                </h4>

                <div>
                  <label
                    htmlFor="companyAddress"
                    className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                  >
                    회사 주소
                  </label>
                  <input
                    type="text"
                    id="companyAddress"
                    name="companyAddress"
                    value={companySettings.companyAddress}
                    onChange={handleSettingChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="companyPhone"
                    className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                  >
                    전화번호
                  </label>
                  <input
                    type="tel"
                    id="companyPhone"
                    name="companyPhone"
                    value={companySettings.companyPhone}
                    onChange={handleSettingChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="companyEmail"
                    className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                  >
                    이메일
                  </label>
                  <input
                    type="email"
                    id="companyEmail"
                    name="companyEmail"
                    value={companySettings.companyEmail}
                    onChange={handleSettingChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                  />
                </div>
              </div>
            </div>

            {/* 추가 정보 */}
            <div className="mt-6 space-y-4">
              <h4 className="text-md font-medium text-foreground theme-transition">
                추가 정보
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="industry"
                    className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                  >
                    업종
                  </label>
                  <input
                    type="text"
                    id="industry"
                    name="industry"
                    value={companySettings.industry}
                    onChange={handleSettingChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="establishmentDate"
                    className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                  >
                    설립일
                  </label>
                  <input
                    type="date"
                    id="establishmentDate"
                    name="establishmentDate"
                    value={companySettings.establishmentDate}
                    onChange={handleSettingChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                  />
                </div>
              </div>
            </div>

            {/* 저장 버튼 */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSaveSettings}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Save className="mr-2 -ml-1 h-4 w-4" />
                설정 저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsCompany;
