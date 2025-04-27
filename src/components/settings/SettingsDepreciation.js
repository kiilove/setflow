"use client";
import { useState, useEffect } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useMessageContext } from "../../context/MessageContext";
import { Button } from "../ui/Button";
import { CheckCircle, Info, Plus, Trash2, Save } from "lucide-react";

const SettingsDepreciation = () => {
  const { showSuccess, showError } = useMessageContext();
  const { updateDocument } = useFirestore("settings");
  const [loading, setLoading] = useState(true);
  const [depreciationSettings, setDepreciationSettings] = useState({
    methods: [
      {
        method: "straight-line",
        salvageValue: 0,
        salvageValueType: "percentage",
        minDepreciationPeriod: 3,
      },
      {
        method: "declining-balance",
        salvageValue: 10,
        salvageValueType: "percentage",
        minDepreciationPeriod: 5,
      },
      {
        method: "double-declining",
        salvageValue: 10,
        salvageValueType: "percentage",
        minDepreciationPeriod: 5,
      },
      {
        method: "units-of-production",
        salvageValue: 0,
        salvageValueType: "percentage",
        minDepreciationPeriod: 3,
      },
      {
        method: "sum-of-years-digits",
        salvageValue: 0,
        salvageValueType: "percentage",
        minDepreciationPeriod: 3,
      },
    ],
    fiscalYear: "calendar",
    fiscalYearStart: "01-01",
    fiscalYearEnd: "12-31",
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadDepreciationSettings();
  }, []);

  const loadDepreciationSettings = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "settings", "depreciation");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setDepreciationSettings({
          methods: data.methods || depreciationSettings.methods,
          fiscalYear: data.fiscalYear || "calendar",
          fiscalYearStart: data.fiscalYearStart || "01-01",
          fiscalYearEnd: data.fiscalYearEnd || "12-31",
        });
      } else {
        // 최초 등록 시 기본값으로 문서 생성
        await setDoc(docRef, {
          ...depreciationSettings,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("감가상각 설정을 불러오는 중 오류가 발생했습니다:", error);
      showError("오류", "감가상각 설정을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateDocument("depreciation", depreciationSettings);
      showSuccess("저장 완료", "감가상각 설정이 저장되었습니다.");
    } catch (error) {
      console.error("감가상각 설정을 저장하는 중 오류가 발생했습니다:", error);
      showError("오류", "감가상각 설정을 저장하는데 실패했습니다.");
    }
  };

  const handleMethodChange = (index, field, value) => {
    const updatedMethods = [...depreciationSettings.methods];
    updatedMethods[index] = {
      ...updatedMethods[index],
      [field]: value,
    };
    setDepreciationSettings({
      ...depreciationSettings,
      methods: updatedMethods,
    });
  };

  const handleFiscalYearChange = (field, value) => {
    setDepreciationSettings({
      ...depreciationSettings,
      [field]: value,
    });
  };

  const addNewMethod = () => {
    setDepreciationSettings({
      ...depreciationSettings,
      methods: [
        ...depreciationSettings.methods,
        {
          method: "straight-line",
          salvageValue: 0,
          salvageValueType: "percentage",
          minDepreciationPeriod: 1,
        },
      ],
    });
  };

  const removeMethod = (index) => {
    const updatedMethods = depreciationSettings.methods.filter(
      (_, i) => i !== index
    );
    setDepreciationSettings({
      ...depreciationSettings,
      methods: updatedMethods,
    });
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

  const handleFiscalYearStartChange = (index, value) => {
    // 입력값이 MM-DD 형식이 아닌 경우 그대로 반영
    if (!/^\d{2}-\d{2}$/.test(value)) {
      handleMethodChange(index, "fiscalYearStart", value);
      return;
    }

    const adjustedDate = validateAndAdjustDate(value);
    handleMethodChange(index, "fiscalYearStart", adjustedDate);
    handleMethodChange(index, "fiscalYearEnd", calculateEndDate(adjustedDate));
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
        <div className="p-4 border-b border-border theme-transition">
          <h2 className="text-lg font-semibold">감가상각 방법 설정</h2>
        </div>
        <div className="p-4 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">회계연도</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={depreciationSettings.fiscalYear}
              onChange={(e) =>
                handleFiscalYearChange("fiscalYear", e.target.value)
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
                        handleFiscalYearChange(
                          "fiscalYearStart",
                          e.target.value
                        )
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

          <div className="space-y-4">
            {depreciationSettings.methods.map((method, index) => (
              <div
                key={index}
                className="space-y-4 p-4 border border-border rounded-lg"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {method.method === "straight-line" && "정액법"}
                    {method.method === "declining-balance" && "정률법"}
                    {method.method === "double-declining" && "이중체감법"}
                    {method.method === "units-of-production" && "생산량비례법"}
                    {method.method === "sum-of-years-digits" && "연수합계법"}
                  </label>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      {method.method === "straight-line" &&
                        "매년 똑같은 금액을 상각하는 방법"}
                      {method.method === "declining-balance" &&
                        "매년 남은 가치의 일정 비율을 상각하는 방법"}
                      {method.method === "double-declining" &&
                        "정률법보다 2배 빠르게 상각하는 방법"}
                      {method.method === "units-of-production" &&
                        "사용량에 따라 상각하는 방법"}
                      {method.method === "sum-of-years-digits" &&
                        "초기에는 많이, 후기에는 적게 상각하는 방법"}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">잔존가치</label>
                  <div className="flex gap-2">
                    <select
                      className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={method.salvageValueType}
                      onChange={(e) =>
                        handleMethodChange(
                          index,
                          "salvageValueType",
                          e.target.value
                        )
                      }
                    >
                      <option value="percentage">퍼센트 (%)</option>
                      <option value="fixed">정액 (원)</option>
                    </select>
                    <input
                      type="number"
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={method.salvageValue}
                      onChange={(e) =>
                        handleMethodChange(
                          index,
                          "salvageValue",
                          parseInt(e.target.value) || 0
                        )
                      }
                      min="0"
                      max={
                        method.salvageValueType === "percentage"
                          ? "100"
                          : undefined
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    감가상각 기간 (년)
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={method.minDepreciationPeriod}
                    onChange={(e) =>
                      handleMethodChange(
                        index,
                        "minDepreciationPeriod",
                        parseInt(e.target.value) || 1
                      )
                    }
                    min="1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-border flex justify-end">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="h-4 w-4" />
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsDepreciation;
