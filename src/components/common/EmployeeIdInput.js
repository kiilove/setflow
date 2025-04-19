"use client";

import { useState, useEffect } from "react";
import { BadgeCheck, RefreshCw, Lock, Unlock, ChevronDown } from "lucide-react";
import { useFirestore } from "../../hooks/useFirestore";

/**
 * 사원번호 입력 컴포넌트 (자동 생성 및 커스텀 형식 지원)
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
 * @param {string} props.joinDate - 입사일 (사원번호 생성에 사용)
 */
const EmployeeIdInput = ({
  id,
  name,
  label,
  value = "",
  onChange,
  required = false,
  placeholder = "사원번호",
  className = "",
  disabled = false,
  isEditing = false,
  joinDate = "",
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLocked, setIsLocked] = useState(isEditing); // 수정 모드에서는 기본적으로 잠금
  const [showFormatSelector, setShowFormatSelector] = useState(false);
  const [formats, setFormats] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const { getCollection } = useFirestore("users");
  const { getDocument } = useFirestore("settings");

  // 사원번호 형식 로드
  useEffect(() => {
    const loadFormats = async () => {
      try {
        // 설정에서 사원번호 형식 가져오기
        const settingsDoc = await getDocument("employeeIdFormats");

        let formatsList = [];
        if (
          settingsDoc &&
          settingsDoc.formats &&
          settingsDoc.formats.length > 0
        ) {
          formatsList = settingsDoc.formats;
        } else {
          // 기본 형식 설정
          formatsList = [
            {
              id: "default",
              name: "기본 형식",
              pattern: "EMP-{YYYY}-{000}",
              isDefault: true,
              description: "EMP-입사년도-일련번호",
            },
            {
              id: "simple",
              name: "간단 형식",
              pattern: "{YYYY}{MM}{000}",
              isDefault: false,
              description: "입사년월-일련번호",
            },
            {
              id: "company",
              name: "회사 형식",
              pattern: "ABC-{YYYY}{000}",
              isDefault: false,
              description: "회사코드-입사년도-일련번호",
            },
          ];
        }

        setFormats(formatsList);

        // 기본 형식 설정
        const defaultFormat =
          formatsList.find((f) => f.isDefault) || formatsList[0];
        setSelectedFormat(defaultFormat);
      } catch (error) {
        console.error("사원번호 형식 로드 중 오류 발생:", error);
      }
    };

    loadFormats();
  }, [getDocument]);

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

      if (!selectedFormat) {
        console.error("선택된 사원번호 형식이 없습니다.");
        return;
      }

      // 입사일 또는 현재 날짜 정보
      let hireDate = new Date();
      if (joinDate) {
        hireDate = new Date(joinDate);
      }

      const year = hireDate.getFullYear();
      const month = String(hireDate.getMonth() + 1).padStart(2, "0");
      const day = String(hireDate.getDate()).padStart(2, "0");

      // 기존 사원 데이터 가져오기
      const users = await getCollection();

      // 일련번호 생성 (현재 연도의 사원 수 + 1)
      const currentYearUsers = users.filter((user) => {
        return user.employeeId && user.employeeId.includes(String(year));
      });
      const sequenceNumber = currentYearUsers.length + 1;

      // 패턴에 따라 사원번호 생성
      let newEmployeeId = selectedFormat.pattern
        .replace(/{YYYY}/g, String(year))
        .replace(/{YY}/g, String(year).substring(2))
        .replace(/{MM}/g, month)
        .replace(/{DD}/g, day);

      // 일련번호 패턴 처리 - 정규식 이스케이프 처리
      if (newEmployeeId.includes("{0000}")) {
        newEmployeeId = newEmployeeId.replace(
          /\{0000\}/g,
          String(sequenceNumber).padStart(4, "0")
        );
      } else if (newEmployeeId.includes("{000}")) {
        newEmployeeId = newEmployeeId.replace(
          /\{000\}/g,
          String(sequenceNumber).padStart(3, "0")
        );
      } else if (newEmployeeId.includes("{00}")) {
        newEmployeeId = newEmployeeId.replace(
          /\{00\}/g,
          String(sequenceNumber).padStart(2, "0")
        );
      } else if (newEmployeeId.includes("{0}")) {
        newEmployeeId = newEmployeeId.replace(/\{0\}/g, String(sequenceNumber));
      }

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

  // 형식 선택 핸들러
  const handleSelectFormat = (format) => {
    setSelectedFormat(format);
    setShowFormatSelector(false);
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
          className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary pl-10 pr-20"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <BadgeCheck className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
          {isEditing ? (
            // 수정 모드에서는 잠금/해제 버튼 표시
            <button
              type="button"
              onClick={toggleLock}
              className={`p-1 rounded-md ${
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
            <>
              {/* 형식 선택 드롭다운 */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFormatSelector(!showFormatSelector)}
                  className="p-1 rounded-md text-primary hover:text-primary/80"
                  title="형식 선택"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>

                {showFormatSelector && (
                  <div className="absolute right-0 mt-1 w-56 rounded-md shadow-lg bg-card border border-border z-10">
                    <div className="py-1">
                      {formats.map((format) => (
                        <button
                          key={format.id}
                          type="button"
                          onClick={() => handleSelectFormat(format)}
                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted ${
                            selectedFormat?.id === format.id
                              ? "bg-primary/10 text-primary"
                              : "text-foreground"
                          }`}
                        >
                          <div>{format.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {format.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 자동 생성 버튼 */}
              <button
                type="button"
                onClick={generateEmployeeId}
                disabled={isGenerating}
                className="p-1 rounded-md text-primary hover:text-primary/80"
                title="사원번호 자동 생성"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`}
                />
              </button>
            </>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {isEditing
          ? isLocked
            ? "사원번호를 수정하려면 잠금을 해제하세요."
            : "주의: 사원번호 변경은 시스템 전체에 영향을 줄 수 있습니다."
          : selectedFormat
          ? `현재 형식: ${selectedFormat.description}`
          : "자동 생성 버튼을 클릭하면 고유한 사원번호가 생성됩니다."}
      </p>
    </div>
  );
};

export default EmployeeIdInput;
