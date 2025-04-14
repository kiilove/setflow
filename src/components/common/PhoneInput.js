"use client";

import { useState, useEffect } from "react";
import { FaPhone } from "react-icons/fa";

/**
 * 전화번호 입력 컴포넌트 (###-####-#### 마스킹)
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
 */
const PhoneInput = ({
  id,
  name,
  label,
  value = "",
  onChange,
  required = false,
  placeholder = "010-0000-0000",
  className = "",
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");

  // 초기 값 설정
  useEffect(() => {
    if (value) {
      // 이미 형식이 맞는지 확인
      if (/^\d{2,3}-\d{3,4}-\d{4}$/.test(value)) {
        setInputValue(value);
      } else {
        // 숫자만 추출
        const digits = value.replace(/\D/g, "");

        // 전화번호 형식으로 변환
        setInputValue(formatPhoneNumber(digits));
      }
    } else {
      setInputValue("");
    }
  }, [value]);

  // 전화번호 형식으로 변환하는 함수
  const formatPhoneNumber = (digits) => {
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 7) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      // 앞자리가 2자리인 경우 (02로 시작하는 서울 지역번호)
      if (digits.startsWith("02")) {
        return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(
          6,
          10
        )}`;
      }
      // 앞자리가 3자리인 경우 (010, 011 등 대부분의 번호)
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(
        7,
        11
      )}`;
    }
  };

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    let input = e.target.value;

    // 숫자와 하이픈만 허용
    input = input.replace(/[^\d-]/g, "");

    // 숫자만 추출
    const digits = input.replace(/\D/g, "");

    // 최대 11자리로 제한
    const truncatedDigits = digits.slice(0, 11);

    // 전화번호 형식으로 변환
    const formattedValue = formatPhoneNumber(truncatedDigits);

    setInputValue(formattedValue);

    // onChange 이벤트 발생
    if (onChange) {
      const event = {
        target: {
          name,
          value: formattedValue,
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
        <input
          type="tel"
          id={id}
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary pl-10"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FaPhone className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default PhoneInput;
