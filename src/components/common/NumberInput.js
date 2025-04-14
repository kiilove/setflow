"use client";

import { useState, useEffect } from "react";

/**
 * 숫자 입력 컴포넌트 (3자리마다 콤마 자동 추가)
 * @param {Object} props
 * @param {string} props.id - 입력 필드 ID
 * @param {string} props.name - 입력 필드 이름
 * @param {string} props.label - 라벨 텍스트
 * @param {string|number} props.value - 입력 필드 값
 * @param {Function} props.onChange - 변경 핸들러
 * @param {boolean} props.required - 필수 입력 여부
 * @param {string} props.placeholder - 플레이스홀더 텍스트
 * @param {string} props.className - 추가 클래스명
 * @param {boolean} props.disabled - 비활성화 여부
 * @param {number} props.min - 최소값
 * @param {number} props.max - 최대값
 * @param {string} props.prefix - 접두사 (예: ₩)
 * @param {string} props.suffix - 접미사 (예: 원)
 */
const NumberInput = ({
  id,
  name,
  label,
  value = "",
  onChange,
  required = false,
  placeholder = "0",
  className = "",
  disabled = false,
  min,
  max,
  prefix = "",
  suffix = "",
}) => {
  const [displayValue, setDisplayValue] = useState("");

  // 초기 값 설정
  useEffect(() => {
    if (value !== undefined && value !== null && value !== "") {
      // 숫자로 변환
      const numValue =
        typeof value === "string"
          ? Number.parseFloat(value.replace(/,/g, ""))
          : value;

      // 콤마 추가
      setDisplayValue(numValue.toLocaleString("ko-KR"));
    } else {
      setDisplayValue("");
    }
  }, [value]);

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    let input = e.target.value;

    // 콤마와 숫자 이외의 문자 제거
    input = input.replace(/[^\d,.-]/g, "");

    // 음수 부호는 맨 앞에만 허용
    if (input.startsWith("-")) {
      input = "-" + input.substring(1).replace(/-/g, "");
    }

    // 소수점은 하나만 허용
    const dotCount = (input.match(/\./g) || []).length;
    if (dotCount > 1) {
      const firstDotIndex = input.indexOf(".");
      input =
        input.substring(0, firstDotIndex + 1) +
        input.substring(firstDotIndex + 1).replace(/\./g, "");
    }

    // 콤마 제거 후 숫자로 변환
    const numericValue = input.replace(/,/g, "");

    // 빈 문자열이면 초기화
    if (numericValue === "" || numericValue === "-" || numericValue === ".") {
      setDisplayValue(numericValue);

      if (onChange) {
        const event = {
          target: {
            name,
            value: numericValue === "-" ? "-" : "",
          },
        };
        onChange(event);
      }
      return;
    }

    // 숫자로 변환
    let numValue = Number.parseFloat(numericValue);

    // 최소값, 최대값 검사
    if (min !== undefined && numValue < min) numValue = min;
    if (max !== undefined && numValue > max) numValue = max;

    // 콤마 추가
    const formattedValue = numValue.toLocaleString("ko-KR");
    setDisplayValue(formattedValue);

    // 원래 값(콤마 없는 숫자)을 onChange로 전달
    if (onChange) {
      const event = {
        target: {
          name,
          value: numValue,
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
          className="block text-sm font-medium text-muted-foreground mb-1"
        >
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-muted-foreground">{prefix}</span>
          </div>
        )}
        <input
          type="text"
          id={id}
          name={name}
          value={displayValue}
          onChange={handleInputChange}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary text-right ${
            prefix ? "pl-8" : ""
          } ${suffix ? "pr-8" : ""}`}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-muted-foreground">{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NumberInput;
