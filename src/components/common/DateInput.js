"use client";

import { useState, useEffect, useRef } from "react";
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaCaretDown,
} from "react-icons/fa";

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
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState("");
  const calendarRef = useRef(null);
  const [showYearSelect, setShowYearSelect] = useState(false);
  const [showMonthSelect, setShowMonthSelect] = useState(false);
  const [years] = useState(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => currentYear - 50 + i);
  });
  const yearListRef = useRef(null);

  // 초기 값 설정
  useEffect(() => {
    if (value) {
      setInputValue(value);
      setSelectedDate(new Date(value));
    } else {
      setInputValue("");
      setSelectedDate(null);
    }
  }, [value]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 연도 선택 시 스크롤 처리
  useEffect(() => {
    if (showYearSelect && yearListRef.current) {
      const currentYear = currentDate.getFullYear();
      const yearElement = yearListRef.current.querySelector(
        `[data-year="${currentYear}"]`
      );
      if (yearElement) {
        yearElement.scrollIntoView({ block: "center" });
      }
    }
  }, [showYearSelect, currentDate]);

  // 날짜 형식 검증
  const validateDate = (dateStr) => {
    if (!dateStr) return true;

    const parts = dateStr.split("-");
    if (parts.length !== 3) return false;

    const [year, month, day] = parts.map(Number);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return false;

    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    let input = e.target.value;
    // 숫자와 하이픈만 허용
    input = input.replace(/[^\d-]/g, "");

    // 백스페이스로 지울 때는 자동 하이픈 추가를 하지 않음
    if (e.nativeEvent.inputType !== "deleteContentBackward") {
      // 자동 하이픈 추가
      if (input.length === 4 && !input.includes("-")) {
        input = input + "-";
      } else if (input.length === 7 && input.split("-").length === 2) {
        input = input + "-";
      }
    }

    setInputValue(input);

    if (onChange) {
      const event = {
        target: {
          name,
          value: input,
        },
      };
      onChange(event);
    }
  };

  // 포커스가 벗어날 때 처리
  const handleBlur = () => {
    const input = inputValue.replace(/\D/g, "");

    if (input.length === 8) {
      const formattedDate = `${input.substring(0, 4)}-${input.substring(
        4,
        6
      )}-${input.substring(6, 8)}`;

      if (validateDate(formattedDate)) {
        setInputValue(formattedDate);
        setError("");
        if (onChange) {
          const event = {
            target: {
              name,
              value: formattedDate,
            },
          };
          onChange(event);
        }
      } else {
        setError(
          <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="w-5 h-5 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-sm text-destructive">
              <p className="font-medium">올바른 날짜 형식이 아닙니다.</p>
              <p className="mt-1">YYYY-MM-DD 형식으로 입력해주세요.</p>
              <p className="mt-1 text-muted-foreground">예: 2024-01-01</p>
            </div>
          </div>
        );
      }
    } else if (input.length > 0) {
      setError(
        <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
          <div className="flex-shrink-0 mt-0.5">
            <svg
              className="w-5 h-5 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="text-sm text-destructive">
            <p className="font-medium">날짜 형식이 올바르지 않습니다.</p>
            <p className="mt-1">
              8자리 숫자를 입력하거나 달력에서 날짜를 선택해주세요.
            </p>
            <p className="mt-1 text-muted-foreground">
              예: 20240101 또는 2024-01-01
            </p>
          </div>
        </div>
      );
    } else {
      setError("");
    }
  };

  // 달력 아이콘 클릭 핸들러
  const handleCalendarClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCalendar(!showCalendar);
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (date, isCurrentMonth) => {
    if (!isCurrentMonth) {
      setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    setInputValue(formattedDate);
    setSelectedDate(date);
    setShowCalendar(false);
    setError("");

    if (onChange) {
      const event = {
        target: {
          name,
          value: formattedDate,
        },
      };
      onChange(event);
    }
  };

  // 이전 달로 이동
  const prevMonth = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // 다음 달로 이동
  const nextMonth = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // 달력 날짜 생성
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // 이전 달의 날짜들
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    // 현재 달의 날짜들
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // 다음 달의 날짜들
    const remainingDays = 42 - days.length; // 6주 * 7일 = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const days = getCalendarDays();
  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  // 취소 버튼 핸들러
  const handleCancel = () => {
    setShowCalendar(false);
  };

  const handleKeyDown = (e) => {
    // 숫자와 하이픈만 허용 (백스페이스는 허용)
    if (
      !/[\d-]/.test(e.key) &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      e.preventDefault();
      return;
    }

    // 연도 입력 제한 (4자리)
    if (
      e.target.value.length >= 4 &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      const cursorPosition = e.target.selectionStart;
      if (cursorPosition <= 4) {
        e.preventDefault();
        return;
      }
    }

    // 백스페이스로 지울 때는 자동 하이픈 추가를 하지 않음
    if (e.key !== "Backspace" && e.key !== "Delete") {
      const value = e.target.value;
      if (value.length === 4 || value.length === 7) {
        e.target.value = value + "-";
      }
    }
  };

  // 연도 선택 핸들러
  const handleYearSelect = (year) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setShowYearSelect(false);
  };

  // 월 선택 핸들러
  const handleMonthSelect = (month) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
    setShowMonthSelect(false);
  };

  // 연도/월 표시 영역 클릭 핸들러
  const handleYearClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowYearSelect(!showYearSelect);
    setShowMonthSelect(false);
  };

  const handleMonthClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMonthSelect(!showMonthSelect);
    setShowYearSelect(false);
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
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          />
          <button
            onClick={handleCalendarClick}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <FaCalendarAlt className="w-5 h-5" />
          </button>
        </div>

        {error && <div className="mt-2">{error}</div>}

        {showCalendar && (
          <div
            ref={calendarRef}
            className="absolute top-full left-0 mt-2 w-[320px] bg-background border border-input rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleYearClick}
                    className="px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors flex items-center gap-1"
                  >
                    {currentDate.getFullYear()}년
                    <FaCaretDown className="w-3 h-3 text-muted-foreground" />
                  </button>
                  <button
                    onClick={handleMonthClick}
                    className="px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors flex items-center gap-1"
                  >
                    {monthNames[currentDate.getMonth()]}
                    <FaCaretDown className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={prevMonth}
                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    <FaChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    <FaChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {showYearSelect && (
                <div
                  ref={yearListRef}
                  className="absolute top-[72px] left-4 w-[120px] bg-background border border-input rounded-lg shadow-lg max-h-[200px] overflow-y-auto z-[60]"
                >
                  {years.map((year) => (
                    <button
                      key={year}
                      data-year={year}
                      onClick={() => handleYearSelect(year)}
                      className={`w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors ${
                        year === currentDate.getFullYear()
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {year}년
                    </button>
                  ))}
                </div>
              )}

              {showMonthSelect && (
                <div className="absolute top-[72px] left-[140px] w-[160px] bg-background border border-input rounded-lg shadow-lg p-2 z-[60]">
                  <div className="grid grid-cols-3 gap-2">
                    {monthNames.map((month, index) => (
                      <button
                        key={month}
                        onClick={() => handleMonthSelect(index)}
                        className={`p-2 text-sm rounded-md transition-colors ${
                          index === currentDate.getMonth()
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className={`text-center text-sm font-medium py-1 ${
                      day === "일"
                        ? "text-red-500"
                        : day === "토"
                        ? "text-blue-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map(({ date, isCurrentMonth }, index) => {
                  const isSelected =
                    selectedDate &&
                    date.getDate() === selectedDate.getDate() &&
                    date.getMonth() === selectedDate.getMonth() &&
                    date.getFullYear() === selectedDate.getFullYear();

                  const dayColor =
                    date.getDay() === 0
                      ? "text-red-500"
                      : date.getDay() === 6
                      ? "text-blue-500"
                      : "text-foreground";

                  return (
                    <button
                      key={index}
                      onClick={() => handleDateSelect(date, isCurrentMonth)}
                      className={`p-2 text-sm rounded-md transition-colors ${
                        isCurrentMonth
                          ? isSelected
                            ? "bg-primary text-primary-foreground"
                            : `${dayColor} hover:bg-muted`
                          : "text-muted-foreground/50 hover:bg-muted/50"
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-input p-2 flex justify-end">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateInput;
