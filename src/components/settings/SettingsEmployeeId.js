"use client";

import { useState } from "react";
import { Save, CheckCircle, User, X } from "lucide-react";
import { getButtonVariantClass } from "../../utils/themeUtils";

const SettingsEmployeeId = () => {
  const [employeeIdSettings, setEmployeeIdSettings] = useState({
    prefix: "EMP",
    suffix: "",
    length: 6,
    separator: "-",
    autoIncrement: true,
    lastNumber: 0,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployeeIdSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveSettings = () => {
    // 실제 구현에서는 API 호출로 설정 저장
    console.log("Saving employee ID settings:", employeeIdSettings);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-8">
      {/* 설정 저장 성공 메시지 */}
      {saveSuccess && (
        <div className="mb-6 p-4 rounded-md bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300 flex items-center">
          <CheckCircle className="mr-2 h-4 w-4" />
          <span>사원번호 설정이 성공적으로 저장되었습니다.</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground theme-transition flex items-center">
          <User className="mr-2 h-6 w-6 text-purple-500" />
          사원번호 설정
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

      {/* 사원번호 형식 설정 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
        <div className="p-4 border-b border-border theme-transition">
          <h3 className="text-lg font-medium text-foreground theme-transition">
            사원번호 형식
          </h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-border rounded-md bg-background">
              <span className="text-foreground theme-transition">접두사</span>
              <input
                type="text"
                name="prefix"
                value={employeeIdSettings.prefix}
                onChange={handleSettingChange}
                className="px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition w-32"
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-md bg-background">
              <span className="text-foreground theme-transition">접미사</span>
              <input
                type="text"
                name="suffix"
                value={employeeIdSettings.suffix}
                onChange={handleSettingChange}
                className="px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition w-32"
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-md bg-background">
              <span className="text-foreground theme-transition">구분자</span>
              <input
                type="text"
                name="separator"
                value={employeeIdSettings.separator}
                onChange={handleSettingChange}
                className="px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition w-20"
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-md bg-background">
              <span className="text-foreground theme-transition">자릿수</span>
              <input
                type="number"
                name="length"
                value={employeeIdSettings.length}
                onChange={handleSettingChange}
                min="1"
                max="10"
                className="px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition w-20"
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-md bg-background">
              <span className="text-foreground theme-transition">
                자동 증가
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="autoIncrement"
                  checked={employeeIdSettings.autoIncrement}
                  onChange={handleSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-md bg-background">
              <span className="text-foreground theme-transition">
                마지막 번호
              </span>
              <input
                type="number"
                name="lastNumber"
                value={employeeIdSettings.lastNumber}
                onChange={handleSettingChange}
                min="0"
                className="px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition w-32"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 미리보기 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
        <div className="p-4 border-b border-border theme-transition">
          <h3 className="text-lg font-medium text-foreground theme-transition">
            미리보기
          </h3>
        </div>
        <div className="p-4">
          <div className="p-3 border border-border rounded-md bg-background">
            <span className="text-foreground theme-transition">
              {employeeIdSettings.prefix}
              {employeeIdSettings.separator}
              {String(employeeIdSettings.lastNumber + 1).padStart(
                employeeIdSettings.length,
                "0"
              )}
              {employeeIdSettings.suffix}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsEmployeeId;
