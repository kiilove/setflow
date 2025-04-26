"use client";
import { useState, useEffect } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import useModalMessage from "../../hooks/useModalMessage";
import { Button } from "../ui/Button";
import { CheckCircle, Info } from "lucide-react";

const SettingsDepreciation = () => {
  const { getDocument, updateDocument } = useFirestore();
  const { showModalMessage } = useModalMessage();
  const [loading, setLoading] = useState(true);
  const [depreciationSettings, setDepreciationSettings] = useState({
    method: "straight-line", // straight-line, declining-balance, double-declining
    fiscalYear: "calendar", // calendar, fiscal
    fiscalYearStart: "01-01", // MM-DD format
    fiscalYearEnd: "12-31", // MM-DD format
    salvageValue: 0,
    salvageValueType: "percentage", // percentage, fixed
    minDepreciationPeriod: 1, // in years
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadDepreciationSettings();
  }, []);

  const loadDepreciationSettings = async () => {
    try {
      setLoading(true);
      const settings = await getDocument("settings", "depreciation");
      if (settings) {
        setDepreciationSettings(settings);
      }
    } catch (error) {
      console.error("감가상각 설정을 불러오는 중 오류가 발생했습니다:", error);
      showModalMessage(
        "error",
        "감가상각 설정을 불러오는 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateDocument("settings", "depreciation", depreciationSettings);
      setSuccessMessage("감가상각 설정이 저장되었습니다.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("감가상각 설정을 저장하는 중 오류가 발생했습니다:", error);
      showModalMessage(
        "error",
        "감가상각 설정을 저장하는 중 오류가 발생했습니다."
      );
    }
  };

  // 날짜 유효성 검사 및 자동 조정 함수
  const validateAndAdjustDate = (dateStr) => {
    // MM-DD 형식 검사
    if (!/^\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }

    const [month, day] = dateStr.split("-").map(Number);

    // 기본 유효성 검사
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return dateStr;
    }

    // 2월 말일 처리 (윤년 여부는 calculateEndDate에서 처리)
    if (month === 2 && day > 29) {
      return `${month.toString().padStart(2, "0")}-29`;
    }

    // 30일까지 있는 달 처리
    if ([4, 6, 9, 11].includes(month) && day > 30) {
      return `${month.toString().padStart(2, "0")}-30`;
    }

    return dateStr;
  };

  const handleFiscalYearStartChange = (value) => {
    // 입력값이 MM-DD 형식이 아닌 경우 그대로 반영
    if (!/^\d{2}-\d{2}$/.test(value)) {
      setDepreciationSettings({
        ...depreciationSettings,
        fiscalYearStart: value,
      });
      return;
    }

    const adjustedDate = validateAndAdjustDate(value);
    setDepreciationSettings({
      ...depreciationSettings,
      fiscalYearStart: adjustedDate,
      fiscalYearEnd: calculateEndDate(adjustedDate),
    });
  };

  const calculateEndDate = (startDate) => {
    if (!/^\d{2}-\d{2}$/.test(startDate)) {
      return "12-31";
    }

    const [startMonth, startDay] = startDate.split("-").map(Number);
    let endMonth = startMonth;
    let endDay = startDay - 1;

    // 시작일이 1일인 경우
    if (endDay === 0) {
      endMonth = startMonth - 1;
      if (endMonth === 0) {
        endMonth = 12;
      }

      // 이전 달의 마지막 날 계산
      if (endMonth === 2) {
        // 2월의 경우 윤년 여부 확인
        const currentYear = new Date().getFullYear();
        const isLeapYear =
          (currentYear % 4 === 0 && currentYear % 100 !== 0) ||
          currentYear % 400 === 0;
        endDay = isLeapYear ? 29 : 28;
      } else if ([4, 6, 9, 11].includes(endMonth)) {
        endDay = 30;
      } else {
        endDay = 31;
      }
    }

    return `${endMonth.toString().padStart(2, "0")}-${endDay
      .toString()
      .padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700">
          <CheckCircle className="h-5 w-5" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border">
        <div className="p-4 border-b border-border theme-transition flex items-center">
          <h2 className="text-lg font-semibold">감가상각 방법 설정</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">감가상각 방법</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={depreciationSettings.method}
              onChange={(e) =>
                setDepreciationSettings({
                  ...depreciationSettings,
                  method: e.target.value,
                })
              }
            >
              <option value="straight-line">정액법</option>
              <option value="declining-balance">정률법</option>
              <option value="double-declining">이중체감법</option>
            </select>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p>
                  <span className="font-medium">정액법:</span> 자산의
                  취득원가에서 잔존가치를 차감한 금액을 내용연수로 균등하게
                  나누어 상각하는 방법
                </p>
                <p>
                  <span className="font-medium">정률법:</span> 자산의 장부가액에
                  일정한 비율을 곱하여 상각하는 방법. 매년 상각액이 감소
                </p>
                <p>
                  <span className="font-medium">이중체감법:</span> 정률법의
                  2배율을 적용하여 상각하는 방법. 초기 상각액이 크고 후기
                  상각액이 작음
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">회계연도</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={depreciationSettings.fiscalYear}
              onChange={(e) =>
                setDepreciationSettings({
                  ...depreciationSettings,
                  fiscalYear: e.target.value,
                })
              }
            >
              <option value="calendar">기본 연도 (1월 1일 ~ 12월 31일)</option>
              <option value="fiscal">회계연도</option>
            </select>
          </div>

          {depreciationSettings.fiscalYear === "fiscal" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">회계연도 시작일</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={depreciationSettings.fiscalYearStart}
                      onChange={(e) =>
                        handleFiscalYearStartChange(e.target.value)
                      }
                      placeholder="MM-DD"
                    />
                    <span className="text-sm text-muted-foreground">
                      (월-일)
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">회계연도 종료일</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={depreciationSettings.fiscalYearEnd}
                      readOnly
                      placeholder="MM-DD"
                    />
                    <span className="text-sm text-muted-foreground">
                      (월-일)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>회계연도는 12개월 단위로 설정해야 합니다.</p>
                  <p>예: 3월 1일 시작 → 2월 28일/29일 종료</p>
                  <p>예: 4월 15일 시작 → 4월 14일 종료</p>
                  <p className="mt-2 text-yellow-600">
                    ※ 2월 말일은 윤년에 따라 28일 또는 29일로 자동 조정됩니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">잔존가치</label>
            <div className="flex gap-2">
              <select
                className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={depreciationSettings.salvageValueType}
                onChange={(e) =>
                  setDepreciationSettings({
                    ...depreciationSettings,
                    salvageValueType: e.target.value,
                  })
                }
              >
                <option value="percentage">퍼센트 (%)</option>
                <option value="fixed">정액 (원)</option>
              </select>
              <input
                type="number"
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={depreciationSettings.salvageValue}
                onChange={(e) =>
                  setDepreciationSettings({
                    ...depreciationSettings,
                    salvageValue: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
                max={
                  depreciationSettings.salvageValueType === "percentage"
                    ? "100"
                    : undefined
                }
              />
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p>
                  <span className="font-medium">퍼센트:</span> 자산 취득원가의
                  일정 비율을 잔존가치로 설정
                </p>
                <p>
                  <span className="font-medium">정액:</span> 고정된 금액을
                  잔존가치로 설정
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">감가상각 기간 (년)</label>
            <input
              type="number"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={depreciationSettings.minDepreciationPeriod}
              onChange={(e) =>
                setDepreciationSettings({
                  ...depreciationSettings,
                  minDepreciationPeriod: parseInt(e.target.value) || 1,
                })
              }
              min="1"
            />
          </div>
        </div>
        <div className="p-4 border-t border-border flex justify-end">
          <Button onClick={handleSave}>저장</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsDepreciation;
