"use client";

import { useState, useEffect } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { useMessageContext } from "../../context/MessageContext";
import { getButtonVariantClass } from "../../utils/themeUtils";
import { Save, RefreshCw, IdCard } from "lucide-react";

const SettingsEmployeeFormat = () => {
  const { getDocument, updateDocument, addDocument } = useFirestore("settings");
  const { showSuccess, showError, showWarning } = useMessageContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [format, setFormat] = useState({
    prefix: "",
    length: 4,
    useYear: true,
    useDepartment: true,
    separator: "-",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getDocument("employeeIdFormats");

      if (data) {
        setFormat(data);
      }
    } catch (error) {
      console.error("설정 로드 중 오류 발생:", error);
      showError(
        "설정 로드 실패",
        "사원번호 형식 설정을 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormat((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      // 필수 필드 검증
      if (!format.prefix.trim()) {
        showWarning("사원번호 형식 설정", "접두사를 입력해주세요.");
        return;
      }

      if (format.length < 1) {
        showWarning("사원번호 형식 설정", "번호 길이는 1 이상이어야 합니다.");
        return;
      }

      // 기존 데이터 확인
      const existingData = await getDocument("employeeIdFormats");

      if (existingData) {
        // 기존 데이터 업데이트
        await updateDocument("employeeIdFormats", format);
      } else {
        // 새 데이터 추가
        await addDocument("employeeIdFormats", format);
      }

      showSuccess("사원번호 형식 설정", "설정이 저장되었습니다.");
    } catch (error) {
      console.error("설정 저장 중 오류 발생:", error);
      showError(
        "설정 저장 실패",
        "사원번호 형식 설정을 저장하는데 실패했습니다."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormat({
      prefix: "",
      length: 4,
      useYear: true,
      useDepartment: true,
      separator: "-",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium flex items-center text-gray-900 dark:text-gray-100">
            <IdCard className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            사원번호 형식 설정
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="prefix"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  접두사
                </label>
                <div className="relative">
                  <input
                    id="prefix"
                    name="prefix"
                    type="text"
                    value={format.prefix}
                    onChange={handleChange}
                    placeholder="예: EMP"
                    maxLength={5}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="length"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  번호 길이
                </label>
                <div className="relative">
                  <input
                    id="length"
                    name="length"
                    type="number"
                    value={format.length}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="separator"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  구분자
                </label>
                <div className="relative">
                  <input
                    id="separator"
                    name="separator"
                    type="text"
                    value={format.separator}
                    onChange={handleChange}
                    maxLength={1}
                    placeholder="예: -"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useYear"
                  name="useYear"
                  checked={format.useYear}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <label
                  htmlFor="useYear"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  연도 포함
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useDepartment"
                  name="useDepartment"
                  checked={format.useDepartment}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <label
                  htmlFor="useDepartment"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  부서 코드 포함
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={saving}
                className={`inline-flex items-center px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                  saving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                초기화
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`inline-flex items-center px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  saving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsEmployeeFormat;
