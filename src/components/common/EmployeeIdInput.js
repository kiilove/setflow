"use client";

import { useState, useEffect } from "react";
import { BadgeCheck, RefreshCw, Lock, Unlock } from "lucide-react";
import { useFirestore } from "../../hooks/useFirestore";

/**
 * 사원번호 입력 컴포넌트 (자동 생성 기능 포함)
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
 * @param {boolean} props.isEditing - 수정 모드 여부
 */
const EmployeeIdInput = ({
  id,
  name,
  label,
  value = "",
  onChange,
  required = false,
  placeholder = "EMP-YYYY-NNN",
  className = "",
  disabled = false,
  isEditing = false,
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLocked, setIsLocked] = useState(isEditing); // 수정 모드에서는 기본적으로 잠금
  const { getCollection } = useFirestore("users");

  // 초기 값 설정
  useEffect(() => {
    if (value) {
      setInputValue(value);
    }
  }, [value]);

  // 사원번호 자동 생성
  const generateEmployeeId = async () => {
    try {
      setIsGenerating(true);

      // 현재 연도 가져오기
      const currentYear = new Date().getFullYear();

      // 기존 사원 데이터 가져오기
      const users = await getCollection();

      // 현재 연도의 사원번호 패턴 (EMP-YYYY-NNN)
      const pattern = new RegExp(`EMP-${currentYear}-(\\d{3})`);

      // 현재 연도의 사원번호 중 가장 큰 번호 찾기
      let maxNumber = 0;
      users.forEach((user) => {
        if (user.employeeId) {
          const match = user.employeeId.match(pattern);
          if (match) {
            const num = Number.parseInt(match[1], 10);
            if (num > maxNumber) {
              maxNumber = num;
            }
          }
        }
      });

      // 새 번호 생성 (현재 최대 번호 + 1)
      const newNumber = maxNumber + 1;
      const newEmployeeId = `EMP-${currentYear}-${newNumber
        .toString()
        .padStart(3, "0")}`;

      setInputValue(newEmployeeId);

      // onChange 이벤트 발생
      if (onChange) {
        const event = {
          target: {
            name,
            value: newEmployeeId,
          },
        };
        onChange(event);
      }
    } catch (error) {
      console.error("사원번호 생성 중 오류 발생:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    if (isLocked && isEditing) return; // 잠금 상태에서는 수정 불가

    const newValue = e.target.value;
    setInputValue(newValue);

    // onChange 이벤트 발생
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

  // 잠금 토글 핸들러
  const toggleLock = () => {
    setIsLocked(!isLocked);
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
          type="text"
          id={id}
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          required={required}
          placeholder={placeholder}
          disabled={disabled || (isLocked && isEditing)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary pl-10 pr-10"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <BadgeCheck className="h-4 w-4 text-muted-foreground" />
        </div>

        {isEditing ? (
          // 수정 모드에서는 잠금/해제 버튼 표시
          <button
            type="button"
            onClick={toggleLock}
            className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
              isLocked
                ? "text-red-500 hover:text-red-600"
                : "text-green-500 hover:text-green-600"
            }`}
            title={isLocked ? "사원번호 잠금 해제" : "사원번호 잠금"}
          >
            {isLocked ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Unlock className="h-4 w-4" />
            )}
          </button>
        ) : (
          // 신규 등록 모드에서는 자동 생성 버튼 표시
          <button
            type="button"
            onClick={generateEmployeeId}
            disabled={isGenerating}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary hover:text-primary/80"
            title="사원번호 자동 생성"
          >
            <RefreshCw
              className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`}
            />
          </button>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {isEditing
          ? isLocked
            ? "사원번호를 수정하려면 잠금을 해제하세요."
            : "주의: 사원번호 변경은 시스템 전체에 영향을 줄 수 있습니다."
          : "자동 생성 버튼을 클릭하면 고유한 사원번호가 생성됩니다."}
      </p>
    </div>
  );
};

export default EmployeeIdInput;
