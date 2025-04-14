"use client";

import { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";

/**
 * 날짜 입력 컴포넌트 (YYYY-MM-DD 마스킹 포함)
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
const DateInput = ({
  id,
  name,
  label,
  value = "",
  onChange,
  required = false,
  placeholder = "YYYY-MM-DD",
  className = "",
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // 초기 값 설정
  useEffect(() => {
    if (value) {
      // ISO 형식(YYYY-MM-DD)인지 확인
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        setInputValue(value);
      } else {
        // 날짜 객체로 변환 시도
        try {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            const formattedDate = date.toISOString().split("T")[0];
            setInputValue(formattedDate);
          }
        } catch (error) {
          console.error("Invalid date format:", error);
          setInputValue("");
        }
      }
    } else {
      setInputValue("");
    }
  }, [value]);

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    let input = e.target.value;

    // 숫자와 하이픈만 허용
    input = input.replace(/[^\d-]/g, "");

    // YYYY-MM-DD 형식으로 마스킹
    if (input.length <= 4) {
      // 연도 입력 중 - 4자리로 제한
      const year = input.substring(0, 4);
      setInputValue(year);
    } else if (input.length <= 7) {
      // 월 입력 중
      const year = input.substring(0, 4);
      let month = input.substring(5, 7);

      // 월이 1-12 범위를 벗어나면 조정
      if (month.length === 2) {
        const monthNum = Number.parseInt(month, 10);
        if (monthNum > 12) month = "12";
        else if (monthNum < 1 && month.length === 2) month = "01";
      }

      setInputValue(`${year}-${month}`);
    } else {
      // 일 입력 중
      const year = input.substring(0, 4);
      let month = input.substring(5, 7);
      let day = input.substring(8, 10);

      // 월이 1-12 범위를 벗어나면 조정
      if (month.length === 2) {
        const monthNum = Number.parseInt(month, 10);
        if (monthNum > 12) month = "12";
        else if (monthNum < 1 && month.length === 2) month = "01";
      }

      // 일이 1-31 범위를 벗어나면 조정
      if (day.length === 2) {
        const dayNum = Number.parseInt(day, 10);
        const maxDay = new Date(
          Number.parseInt(year, 10),
          Number.parseInt(month, 10),
          0
        ).getDate();
        if (dayNum > maxDay) day = maxDay.toString();
        else if (dayNum < 1 && day.length === 2) day = "01";
      }

      setInputValue(`${year}-${month}-${day}`);
    }
  };

  // 키 입력 핸들러 - 년도 4자리 제한을 위해 추가
  const handleKeyDown = (e) => {
    const cursorPosition = e.target.selectionStart;

    // 년도 부분(처음 4자리)에서 이미 4자리가 입력된 상태에서 추가 숫자 입력 방지
    if (
      cursorPosition <= 4 &&
      inputValue.substring(0, 4).length >= 4 &&
      /\d/.test(e.key) &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey
    ) {
      // 선택된 텍스트가 있는 경우는 허용 (덮어쓰기)
      if (e.target.selectionStart === e.target.selectionEnd) {
        e.preventDefault();
      }
    }

    // 하이픈(-) 자동 추가
    if (inputValue.length === 4 && /\d/.test(e.key) && cursorPosition === 4) {
      setInputValue(`${inputValue}-${e.key}`);
      e.preventDefault();

      // 다음 위치로 커서 이동을 위한 setTimeout
      setTimeout(() => {
        e.target.setSelectionRange(6, 6);
      }, 0);
    } else if (
      inputValue.length === 7 &&
      /\d/.test(e.key) &&
      cursorPosition === 7
    ) {
      setInputValue(`${inputValue}-${e.key}`);
      e.preventDefault();

      // 다음 위치로 커서 이동을 위한 setTimeout
      setTimeout(() => {
        e.target.setSelectionRange(9, 9);
      }, 0);
    }
  };

  // 포커스 이벤트 핸들러
  const handleFocus = () => {
    setIsFocused(true);
  };

  // 블러 이벤트 핸들러
  const handleBlur = () => {
    setIsFocused(false);

    // 유효한 날짜인지 확인
    if (inputValue) {
      const datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
      const match = inputValue.match(datePattern);

      if (match) {
        const year = Number.parseInt(match[1], 10);
        const month = Number.parseInt(match[2], 10);
        const day = Number.parseInt(match[3], 10);

        // 유효한 날짜인지 확인
        const date = new Date(year, month - 1, day);
        const isValidDate =
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day;

        if (isValidDate) {
          // 날짜가 유효하면 onChange 이벤트 발생
          if (onChange) {
            const event = {
              target: {
                name,
                value: inputValue,
              },
            };
            onChange(event);
          }
        } else {
          // 유효하지 않은 날짜면 초기화
          setInputValue("");
          if (onChange) {
            const event = {
              target: {
                name,
                value: "",
              },
            };
            onChange(event);
          }
        }
      } else {
        // 패턴이 맞지 않으면 초기화
        setInputValue("");
        if (onChange) {
          const event = {
            target: {
              name,
              value: "",
            },
          };
          onChange(event);
        }
      }
    }
  };

  // 날짜 입력 필드 클릭 핸들러
  const handleDateInputClick = (e) => {
    e.stopPropagation();

    // 다른 열린 달력 닫기
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach((input) => {
      if (input !== e.target) {
        input.blur();
      }
    });
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
          type={isFocused ? "date" : "text"}
          id={id}
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={handleDateInputClick}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary pr-10"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <FaCalendarAlt className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default DateInput;
