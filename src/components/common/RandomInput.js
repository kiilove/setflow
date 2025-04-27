"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

/**
 * 랜덤 값 입력 컴포넌트
 * @param {Object} props
 * @param {string} props.id - 입력 필드 ID
 * @param {string} props.name - 입력 필드 이름
 * @param {string} props.label - 라벨 텍스트
 * @param {string} props.value - 입력 필드 값
 * @param {Function} props.onChange - 변경 핸들러
 * @param {boolean} props.required - 필수 입력 여부
 * @param {string} props.placeholder - 플레이스홀더 텍스트
 * @param {string} props.className - 추가 클래스명
 * @param {boolean} props.disabled - 비활성화 여부
 * @param {string} props.type - 랜덤 생성 타입 ('number' | 'alphanumeric')
 * @param {number} props.length - 생성할 값의 길이
 * @param {boolean} props.showLengthSelector - 자릿수 선택기 표시 여부
 */
const RandomInput = ({
  id,
  name,
  label,
  value = "",
  onChange,
  required = false,
  placeholder = "",
  className = "",
  disabled = false,
  type = "number",
  length = 8,
  showLengthSelector = false,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [error, setError] = useState("");
  const [selectedLength, setSelectedLength] = useState(length);

  // 초기 값 설정
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // 자릿수 변경 핸들러
  const handleLengthChange = (e) => {
    const newLength = parseInt(e.target.value);
    setSelectedLength(newLength);

    // 현재 입력값이 새로운 자릿수보다 길면 잘라내기
    if (inputValue.length > newLength) {
      const trimmedValue = inputValue.slice(0, newLength);
      setInputValue(trimmedValue);

      if (onChange) {
        const event = {
          target: {
            name,
            value: trimmedValue,
          },
        };
        onChange(event);
      }
    }
  };

  // 랜덤 값 생성
  const generateRandomValue = () => {
    let result = "";
    const characters =
      type === "number"
        ? "0123456789"
        : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < selectedLength; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    setInputValue(result);
    setError("");

    if (onChange) {
      const event = {
        target: {
          name,
          value: result,
        },
      };
      onChange(event);
    }
  };

  // 입력값 검증
  const validateInput = (value) => {
    if (!value) return true;

    // 길이 검증
    if (value.length !== selectedLength) {
      return `길이가 ${selectedLength}자리여야 합니다.`;
    }

    // 타입 검증
    if (type === "number") {
      if (!/^\d+$/.test(value)) {
        return "숫자만 입력 가능합니다.";
      }
    } else {
      if (!/^[A-Za-z0-9]+$/.test(value)) {
        return "영문자와 숫자만 입력 가능합니다.";
      }
    }

    return "";
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const errorMessage = validateInput(newValue);
    setError(errorMessage);

    if (onChange) {
      const event = {
        target: {
          name,
          value: newValue,
        },
      };
      onChange(event);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground mb-1"
        >
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}
      <div className="relative">
        <div className="flex items-center gap-2">
          <input
            type="text"
            id={id}
            name={name}
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          />
          {showLengthSelector && (
            <select
              value={selectedLength}
              onChange={handleLengthChange}
              disabled={disabled}
              className="px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((len) => (
                <option key={len} value={len}>
                  {len}자리
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={generateRandomValue}
            disabled={disabled}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="랜덤 값 생성"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
};

export default RandomInput;
