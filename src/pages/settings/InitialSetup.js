"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirestore } from "../../hooks/useFirestore";
import { useMessageContext } from "../../context/MessageContext";
import { getButtonVariantClass } from "../../utils/themeUtils";
import {
  Save,
  ArrowRight,
  Building2,
  Users,
  Settings2,
  CheckCircle2,
} from "lucide-react";

const InitialSetup = () => {
  const router = useRouter();
  const { addDocument, updateDocument } = useFirestore("settings");
  const { showSuccess, showError, showWarning } = useMessageContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [setupData, setSetupData] = useState({
    // 회사 기본 정보
    company: {
      name: "",
      address: "",
      phone: "",
      email: "",
    },
    // 사원번호 형식
    employeeIdFormat: {
      prefix: "EMP",
      length: 4,
      useYear: true,
      useSeparator: false,
      separator: "-",
    },
    // 기본 부서 설정
    departments: [
      { id: "dev", name: "개발팀", code: "DEV" },
      { id: "sales", name: "영업팀", code: "SALES" },
      { id: "hr", name: "인사팀", code: "HR" },
    ],
  });

  const handleChange = (section, field, value) => {
    setSetupData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // 1. 회사 기본 정보 저장
      await updateDocument("company", setupData.company);

      // 2. 사원번호 형식 저장
      await updateDocument("employeeIdFormats", setupData.employeeIdFormat);

      // 3. 부서 정보 저장
      await updateDocument("departments", {
        list: setupData.departments,
        updatedAt: new Date().toISOString(),
      });

      showSuccess("초기 설정 완료", "시스템 초기 설정이 완료되었습니다.");
      router.push("/settings");
    } catch (error) {
      console.error("초기 설정 중 오류 발생:", error);
      showError(
        "초기 설정 실패",
        "시스템 초기 설정에 실패했습니다. 다시 시도해주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              회사 기본 정보 설정
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium mb-1"
                >
                  회사명
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={setupData.company.name}
                  onChange={(e) =>
                    handleChange("company", "name", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label
                  htmlFor="companyAddress"
                  className="block text-sm font-medium mb-1"
                >
                  회사 주소
                </label>
                <input
                  id="companyAddress"
                  type="text"
                  value={setupData.company.address}
                  onChange={(e) =>
                    handleChange("company", "address", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label
                  htmlFor="companyPhone"
                  className="block text-sm font-medium mb-1"
                >
                  전화번호
                </label>
                <input
                  id="companyPhone"
                  type="text"
                  value={setupData.company.phone}
                  onChange={(e) =>
                    handleChange("company", "phone", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label
                  htmlFor="companyEmail"
                  className="block text-sm font-medium mb-1"
                >
                  이메일
                </label>
                <input
                  id="companyEmail"
                  type="email"
                  value={setupData.company.email}
                  onChange={(e) =>
                    handleChange("company", "email", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center">
              <Users className="mr-2 h-5 w-5" />
              사원번호 형식 설정
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="prefix"
                  className="block text-sm font-medium mb-1"
                >
                  접두사
                </label>
                <input
                  id="prefix"
                  type="text"
                  value={setupData.employeeIdFormat.prefix}
                  onChange={(e) =>
                    handleChange("employeeIdFormat", "prefix", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
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
                <input
                  id="length"
                  type="number"
                  value={setupData.employeeIdFormat.length}
                  onChange={(e) =>
                    handleChange(
                      "employeeIdFormat",
                      "length",
                      parseInt(e.target.value)
                    )
                  }
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  1에서 10 사이의 숫자 입력
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useYear"
                  checked={setupData.employeeIdFormat.useYear}
                  onChange={(e) =>
                    handleChange(
                      "employeeIdFormat",
                      "useYear",
                      e.target.checked
                    )
                  }
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
                  checked={setupData.employeeIdFormat.useSeparator}
                  onChange={(e) =>
                    handleChange(
                      "employeeIdFormat",
                      "useSeparator",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-primary border-primary focus:ring-primary"
                />
                <label htmlFor="useSeparator" className="text-sm font-medium">
                  구분자 사용
                </label>
              </div>
              {setupData.employeeIdFormat.useSeparator && (
                <div>
                  <label
                    htmlFor="separator"
                    className="block text-sm font-medium mb-1"
                  >
                    구분자
                  </label>
                  <input
                    id="separator"
                    type="text"
                    value={setupData.employeeIdFormat.separator}
                    onChange={(e) =>
                      handleChange(
                        "employeeIdFormat",
                        "separator",
                        e.target.value
                      )
                    }
                    maxLength={1}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center">
              <Settings2 className="mr-2 h-5 w-5" />
              기본 부서 설정
            </h3>
            <div className="space-y-4">
              {setupData.departments.map((dept, index) => (
                <div
                  key={dept.id}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      부서명
                    </label>
                    <input
                      type="text"
                      value={dept.name}
                      onChange={(e) => {
                        const newDepartments = [...setupData.departments];
                        newDepartments[index] = {
                          ...dept,
                          name: e.target.value,
                        };
                        setSetupData((prev) => ({
                          ...prev,
                          departments: newDepartments,
                        }));
                      }}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      부서 코드
                    </label>
                    <input
                      type="text"
                      value={dept.code}
                      onChange={(e) => {
                        const newDepartments = [...setupData.departments];
                        newDepartments[index] = {
                          ...dept,
                          code: e.target.value.toUpperCase(),
                        };
                        setSetupData((prev) => ({
                          ...prev,
                          departments: newDepartments,
                        }));
                      }}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border">
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">시스템 초기 설정</h2>
            <p className="text-muted-foreground">
              시스템을 사용하기 위한 기본 설정을 진행합니다.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex items-center ${
                    step < currentStep
                      ? "text-primary"
                      : step === currentStep
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step < currentStep
                        ? "bg-primary text-primary-foreground"
                        : step === currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {step < currentStep ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 3 && (
                    <div
                      className={`h-1 w-16 mx-2 ${
                        step < currentStep ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {renderStep()}

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
              className={`inline-flex items-center px-4 py-2 rounded-md ${getButtonVariantClass(
                "outline"
              )} ${
                currentStep === 1 || loading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              이전
            </button>
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className={`inline-flex items-center px-4 py-2 rounded-md ${getButtonVariantClass(
                  "primary"
                )} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                다음
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`inline-flex items-center px-4 py-2 rounded-md ${getButtonVariantClass(
                  "primary"
                )} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? "저장 중..." : "설정 완료"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialSetup;
