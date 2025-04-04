"use client";

import { useState } from "react";
import { Settings, Globe, Save, CheckCircle } from "lucide-react";

const SettingsGeneral = () => {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Setflow Inc.",
    adminEmail: "admin@setflow.com",
    dateFormat: "YYYY-MM-DD",
    timeFormat: "24h",
    defaultCurrency: "KRW",
    defaultLanguage: "ko-KR",
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 설정 변경 핸들러
  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 설정 저장 핸들러
  const handleSaveSettings = () => {
    // 실제 구현에서는 API 호출로 설정 저장
    console.log("Saving settings:", generalSettings);

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
            <Settings className="mr-2 h-5 w-5" />
            일반 설정
          </h3>
        </div>
        <div className="p-4">
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 회사 정보 */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-foreground theme-transition">
                  회사 정보
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
                    value={generalSettings.companyName}
                    onChange={handleSettingChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="adminEmail"
                    className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                  >
                    관리자 이메일
                  </label>
                  <input
                    type="email"
                    id="adminEmail"
                    name="adminEmail"
                    value={generalSettings.adminEmail}
                    onChange={handleSettingChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                  />
                </div>
              </div>

              {/* 표시 형식 */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-foreground theme-transition">
                  표시 형식
                </h4>

                <div>
                  <label
                    htmlFor="dateFormat"
                    className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                  >
                    날짜 형식
                  </label>
                  <select
                    id="dateFormat"
                    name="dateFormat"
                    value={generalSettings.dateFormat}
                    onChange={handleSettingChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                  >
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY.MM.DD">YYYY.MM.DD</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="timeFormat"
                    className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                  >
                    시간 형식
                  </label>
                  <select
                    id="timeFormat"
                    name="timeFormat"
                    value={generalSettings.timeFormat}
                    onChange={handleSettingChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                  >
                    <option value="24h">24시간 (14:30)</option>
                    <option value="12h">12시간 (2:30 PM)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 지역 및 언어 설정 */}
            <div className="mt-6 space-y-4">
              <h4 className="text-md font-medium text-foreground theme-transition flex items-center">
                <Globe className="mr-2 h-5 w-5 text-blue-500" />
                지역 및 언어 설정
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="defaultCurrency"
                    className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                  >
                    기본 통화
                  </label>
                  <select
                    id="defaultCurrency"
                    name="defaultCurrency"
                    value={generalSettings.defaultCurrency}
                    onChange={handleSettingChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                  >
                    <option value="KRW">한국 원화 (₩)</option>
                    <option value="USD">미국 달러 ($)</option>
                    <option value="EUR">유로 (€)</option>
                    <option value="JPY">일본 엔 (¥)</option>
                    <option value="CNY">중국 위안 (¥)</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="defaultLanguage"
                    className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                  >
                    기본 언어
                  </label>
                  <select
                    id="defaultLanguage"
                    name="defaultLanguage"
                    value={generalSettings.defaultLanguage}
                    onChange={handleSettingChange}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                  >
                    <option value="ko-KR">한국어</option>
                    <option value="en-US">English (US)</option>
                    <option value="ja-JP">日本語</option>
                    <option value="zh-CN">中文 (简体)</option>
                  </select>
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

export default SettingsGeneral;
