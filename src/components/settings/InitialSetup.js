"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

// 기존 컴포넌트 import
import SettingsCompany from "./SettingsCompany";
import SettingsPositions from "./SettingsPositions";
import SettingsEmployeeFormat from "./SettingsEmployeeFormat";
import SettingsNotifications from "./SettingsNotifications";
import SettingsAdmin from "./SettingsAdmin";

const InitialSetup = () => {
  const navigate = useNavigate();
  const { addDocument, updateDocument } = useFirestore("settings");
  const { showSuccess, showError, showWarning } = useMessageContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // 각 단계별 데이터 상태
  const [companyData, setCompanyData] = useState(null);
  const [positionsData, setPositionsData] = useState(null);
  const [employeeFormatData, setEmployeeFormatData] = useState(null);
  const [notificationsData, setNotificationsData] = useState(null);
  const [adminData, setAdminData] = useState(null);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepData = (step, data) => {
    switch (step) {
      case 1:
        setCompanyData(data);
        break;
      case 2:
        setPositionsData(data);
        break;
      case 3:
        setEmployeeFormatData(data);
        break;
      case 4:
        setNotificationsData(data);
        break;
      case 5:
        setAdminData(data);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // 1. 회사 정보 저장
      if (companyData) {
        await updateDocument("company", companyData);
      }

      // 2. 직위/직책 정보 저장
      if (positionsData) {
        await updateDocument("positions", positionsData);
      }

      // 3. 사원번호 형식 저장
      if (employeeFormatData) {
        await updateDocument("employeeIdFormats", employeeFormatData);
      }

      // 4. 알림 설정 저장
      if (notificationsData) {
        await updateDocument("notifications", notificationsData);
      }

      // 5. 관리자 정보 저장
      if (adminData) {
        await updateDocument("admin", adminData);
      }

      showSuccess("초기 설정 완료", "시스템 초기 설정이 완료되었습니다.");
      navigate("/settings");
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
          <SettingsCompany
            onDataChange={(data) => handleStepData(1, data)}
            initialData={companyData}
          />
        );
      case 2:
        return (
          <SettingsPositions
            onDataChange={(data) => handleStepData(2, data)}
            initialData={positionsData}
          />
        );
      case 3:
        return (
          <SettingsEmployeeFormat
            onDataChange={(data) => handleStepData(3, data)}
            initialData={employeeFormatData}
          />
        );
      case 4:
        return (
          <SettingsNotifications
            onDataChange={(data) => handleStepData(4, data)}
            initialData={notificationsData}
          />
        );
      case 5:
        return (
          <SettingsAdmin
            onDataChange={(data) => handleStepData(5, data)}
            initialData={adminData}
          />
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
              {[1, 2, 3, 4, 5].map((step) => (
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
                  {step < 5 && (
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
            {currentStep < 5 ? (
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
