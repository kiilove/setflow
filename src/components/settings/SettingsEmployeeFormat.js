"use client";

import { useState, useEffect } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { useMessageContext } from "../../context/MessageContext";
import { getButtonVariantClass } from "../../utils/themeUtils";
import { Save, RefreshCw, IdCard, Info } from "lucide-react";

const SettingsEmployeeFormat = () => {
  const { getDocument, updateDocument } = useFirestore("settings");
  const { showSuccess, showError, showWarning, showConfirm } =
    useMessageContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [format, setFormat] = useState({
    prefix: "",
    length: 4,
    useYear: true,
    useSeparator: false,
    separator: "-",
  });

  // 미리보기용 샘플 데이터
  const [preview, setPreview] = useState({
    year: new Date().getFullYear().toString().slice(-2),
    randomNumber: "1234",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  // 미리보기 업데이트
  useEffect(() => {
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const randomNumber = Math.floor(
      Math.pow(10, format.length - 1) +
        Math.random() *
          (Math.pow(10, format.length) - Math.pow(10, format.length - 1))
    )
      .toString()
      .padStart(format.length, "0");

    setPreview({
      year: currentYear,
      randomNumber,
    });
  }, [format]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getDocument("employeeIdFormats");

      if (data) {
        setFormat({
          prefix: data.prefix || "",
          length: data.length || 4,
          useYear: data.useYear !== undefined ? data.useYear : true,
          useSeparator:
            data.useSeparator !== undefined ? data.useSeparator : false,
          separator: data.separator || "-",
        });
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

    // 숫자 필드 검증
    if (name === "length") {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 1 || numValue > 10) {
        showWarning(
          "유효하지 않은 값",
          "번호 길이는 1에서 10 사이여야 합니다."
        );
        return;
      }
    }

    // 접두사 검증
    if (name === "prefix") {
      if (value.length > 5) {
        showWarning(
          "유효하지 않은 값",
          "접두사는 최대 5자까지 입력 가능합니다."
        );
        return;
      }
      if (!/^[A-Z0-9]*$/.test(value)) {
        showWarning(
          "유효하지 않은 값",
          "접두사는 영문 대문자와 숫자만 사용 가능합니다."
        );
        return;
      }
    }

    // 구분자 검증
    if (name === "separator") {
      if (value.length > 1) {
        showWarning("유효하지 않은 값", "구분자는 1자만 입력 가능합니다.");
        return;
      }
      if (!/^[^A-Za-z0-9]*$/.test(value)) {
        showWarning(
          "유효하지 않은 값",
          "구분자는 영문자와 숫자를 사용할 수 없습니다."
        );
        return;
      }
    }

    setFormat((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 사원번호 형식 생성
  const generateEmployeeId = (data) => {
    const { prefix, useYear, useSeparator, separator } = format;
    const { year, randomNumber } = data;

    const parts = [prefix];
    if (useYear) parts.push(year);
    parts.push(randomNumber);

    return parts.join(useSeparator ? separator : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. 기본 필드 검증
      if (!format.prefix.trim()) {
        showWarning("사원번호 형식 설정", "접두사를 입력해주세요.");
        return;
      }

      if (format.length < 1 || format.length > 10) {
        showWarning(
          "사원번호 형식 설정",
          "번호 길이는 1에서 10 사이여야 합니다."
        );
        return;
      }

      // 2. 형식 검증
      if (!/^[A-Z0-9]{1,5}$/.test(format.prefix)) {
        showWarning(
          "사원번호 형식 설정",
          "접두사는 영문 대문자와 숫자만 사용 가능하며, 1~5자까지 입력 가능합니다."
        );
        return;
      }

      if (format.useSeparator && !/^[^A-Za-z0-9]$/.test(format.separator)) {
        showWarning(
          "사원번호 형식 설정",
          "구분자는 영문자와 숫자를 제외한 1자만 입력 가능합니다."
        );
        return;
      }

      // 3. 기존 설정 확인
      const existingData = await getDocument("employeeIdFormats");

      // 4. 설정 변경 확인 (기존 설정이 있고 변경된 경우에만)
      if (existingData) {
        const hasChanges = Object.keys(format).some(
          (key) => format[key] !== existingData[key]
        );

        if (hasChanges) {
          const confirmed = await showConfirm(
            "설정 변경 확인",
            "사원번호 형식 설정을 변경하면 기존 사용자의 사원번호는 변경되지 않으며, 새로 등록되는 사용자부터 적용됩니다. 계속하시겠습니까?"
          );
          if (!confirmed) return;
        }
      }

      setSaving(true);

      // 5. 데이터 저장
      const saveData = {
        prefix: format.prefix.toUpperCase(), // 접두사는 항상 대문자로 저장
        length: parseInt(format.length),
        useYear: format.useYear,
        useSeparator: format.useSeparator,
        separator: format.separator,
        updatedAt: new Date().toISOString(),
      };

      // 항상 updateDocument를 사용하고, 문서 ID를 명시적으로 지정
      await updateDocument("employeeIdFormats", saveData);

      showSuccess("사원번호 형식 설정", "설정이 성공적으로 저장되었습니다.");

      // 6. 저장 후 상태 업데이트
      setFormat(saveData);
    } catch (error) {
      console.error("설정 저장 중 오류 발생:", error);
      showError(
        "설정 저장 실패",
        "사원번호 형식 설정을 저장하는데 실패했습니다. 다시 시도해주세요."
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
      useSeparator: false,
      separator: "-",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-medium flex items-center">
            <IdCard className="mr-2 h-5 w-5" />
            사원번호 형식 설정
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="prefix"
                  className="block text-sm font-medium mb-1"
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
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  영문 대문자와 숫자만 사용 가능 (최대 5자)
                </p>
              </div>

              <div>
                <label
                  htmlFor="length"
                  className="block text-sm font-medium mb-1"
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
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  1에서 10 사이의 숫자 입력
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useYear"
                  name="useYear"
                  checked={format.useYear}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary border-primary focus:ring-primary"
                />
                <label htmlFor="useYear" className="text-sm font-medium">
                  연도 포함
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useSeparator"
                  name="useSeparator"
                  checked={format.useSeparator}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary border-primary focus:ring-primary"
                />
                <label htmlFor="useSeparator" className="text-sm font-medium">
                  구분자 사용
                </label>
              </div>

              {format.useSeparator && (
                <div>
                  <label
                    htmlFor="separator"
                    className="block text-sm font-medium mb-1"
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
                      className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    영문자와 숫자를 제외한 1자 입력
                  </p>
                </div>
              )}
            </div>

            {/* 미리보기 섹션 */}
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <div className="flex items-center mb-2">
                <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                <h4 className="text-sm font-medium">사원번호 미리보기</h4>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>샘플 데이터:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>연도: {preview.year}</li>
                  <li>일련번호: {preview.randomNumber}</li>
                </ul>
                <p className="mt-2 font-medium">
                  생성된 사원번호:{" "}
                  <span className="text-primary">
                    {generateEmployeeId(preview)}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={saving}
                className={`inline-flex items-center px-4 py-2 rounded-md ${getButtonVariantClass(
                  "outline"
                )} ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                초기화
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`inline-flex items-center px-4 py-2 rounded-md ${getButtonVariantClass(
                  "primary"
                )} ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
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
