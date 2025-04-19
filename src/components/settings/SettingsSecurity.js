"use client";

import { useState } from "react";
import { Save, CheckCircle, Lock, Shield, Key, X } from "lucide-react";
import { getButtonVariantClass } from "../../utils/themeUtils";

const SettingsSecurity = () => {
  const [securitySettings, setSecuritySettings] = useState({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expirationDays: 90,
    },
    twoFactorAuth: {
      enabled: false,
      method: "email", // email, sms, authenticator
    },
    sessionSettings: {
      timeoutMinutes: 30,
      maxConcurrentSessions: 3,
    },
    ipRestrictions: {
      enabled: false,
      allowedIPs: [],
    },
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    const [section, field] = name.split(".");

    setSecuritySettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleSaveSettings = () => {
    // 실제 구현에서는 API 호출로 설정 저장
    console.log("Saving security settings:", securitySettings);
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
          <span>보안 설정이 성공적으로 저장되었습니다.</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground theme-transition flex items-center">
          <Shield className="mr-2 h-6 w-6 text-red-500" />
          보안 설정
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

      {/* 비밀번호 정책 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
        <div className="p-4 border-b border-border theme-transition">
          <h3 className="text-lg font-medium text-foreground theme-transition flex items-center">
            <Key className="mr-2 h-5 w-5 text-blue-500" />
            비밀번호 정책
          </h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-border rounded-md bg-background">
              <span className="text-foreground theme-transition">
                최소 비밀번호 길이
              </span>
              <input
                type="number"
                name="passwordPolicy.minLength"
                value={securitySettings.passwordPolicy.minLength}
                onChange={handleSettingChange}
                min="6"
                max="32"
                className="px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition w-20"
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-md bg-background">
              <span className="text-foreground theme-transition">
                대문자 포함
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="passwordPolicy.requireUppercase"
                  checked={securitySettings.passwordPolicy.requireUppercase}
                  onChange={handleSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-md bg-background">
              <span className="text-foreground theme-transition">
                소문자 포함
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="passwordPolicy.requireLowercase"
                  checked={securitySettings.passwordPolicy.requireLowercase}
                  onChange={handleSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-md bg-background">
              <span className="text-foreground theme-transition">
                숫자 포함
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="passwordPolicy.requireNumbers"
                  checked={securitySettings.passwordPolicy.requireNumbers}
                  onChange={handleSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-md bg-background">
              <span className="text-foreground theme-transition">
                특수문자 포함
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="passwordPolicy.requireSpecialChars"
                  checked={securitySettings.passwordPolicy.requireSpecialChars}
                  onChange={handleSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-md bg-background">
              <span className="text-foreground theme-transition">
                비밀번호 만료 기간 (일)
              </span>
              <input
                type="number"
                name="passwordPolicy.expirationDays"
                value={securitySettings.passwordPolicy.expirationDays}
                onChange={handleSettingChange}
                min="30"
                max="365"
                className="px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition w-20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2단계 인증 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
        <div className="p-4 border-b border-border theme-transition">
          <h3 className="text-lg font-medium text-foreground theme-transition flex items-center">
            <Lock className="mr-2 h-5 w-5 text-green-500" />
            2단계 인증
          </h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-border rounded-md bg-background">
              <span className="text-foreground theme-transition">
                2단계 인증 활성화
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="twoFactorAuth.enabled"
                  checked={securitySettings.twoFactorAuth.enabled}
                  onChange={handleSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-md bg-background">
              <span className="text-foreground theme-transition">
                인증 방법
              </span>
              <select
                name="twoFactorAuth.method"
                value={securitySettings.twoFactorAuth.method}
                onChange={handleSettingChange}
                className="px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition w-32"
              >
                <option value="email">이메일</option>
                <option value="sms">SMS</option>
                <option value="authenticator">인증 앱</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 세션 설정 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
        <div className="p-4 border-b border-border theme-transition">
          <h3 className="text-lg font-medium text-foreground theme-transition flex items-center">
            <Shield className="mr-2 h-5 w-5 text-purple-500" />
            세션 설정
          </h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-border rounded-md bg-background">
              <span className="text-foreground theme-transition">
                세션 타임아웃 (분)
              </span>
              <input
                type="number"
                name="sessionSettings.timeoutMinutes"
                value={securitySettings.sessionSettings.timeoutMinutes}
                onChange={handleSettingChange}
                min="5"
                max="1440"
                className="px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition w-20"
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-md bg-background">
              <span className="text-foreground theme-transition">
                최대 동시 세션 수
              </span>
              <input
                type="number"
                name="sessionSettings.maxConcurrentSessions"
                value={securitySettings.sessionSettings.maxConcurrentSessions}
                onChange={handleSettingChange}
                min="1"
                max="10"
                className="px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition w-20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* IP 제한 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
        <div className="p-4 border-b border-border theme-transition">
          <h3 className="text-lg font-medium text-foreground theme-transition flex items-center">
            <Shield className="mr-2 h-5 w-5 text-orange-500" />
            IP 제한
          </h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-border rounded-md bg-background">
              <span className="text-foreground theme-transition">
                IP 제한 활성화
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="ipRestrictions.enabled"
                  checked={securitySettings.ipRestrictions.enabled}
                  onChange={handleSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-md bg-background">
              <span className="text-foreground theme-transition">
                허용된 IP 주소
              </span>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="IP 주소 추가"
                  className="px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition w-48"
                />
                <button
                  className={`${getButtonVariantClass(
                    "primary"
                  )} px-3 py-1 flex items-center rounded-md`}
                >
                  <span className="text-sm">추가</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {securitySettings.ipRestrictions.allowedIPs.map((ip, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border border-border rounded-md bg-background"
                >
                  <span className="text-foreground theme-transition">{ip}</span>
                  <button
                    onClick={() => {
                      setSecuritySettings((prev) => ({
                        ...prev,
                        ipRestrictions: {
                          ...prev.ipRestrictions,
                          allowedIPs: prev.ipRestrictions.allowedIPs.filter(
                            (_, i) => i !== index
                          ),
                        },
                      }));
                    }}
                    className="p-1 hover:bg-muted rounded-md"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSecurity;
