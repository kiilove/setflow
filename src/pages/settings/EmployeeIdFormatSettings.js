"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirestore } from "../../hooks/useFirestore";
import { useMessageContext } from "../../context/MessageContext";
import PageContainer from "../../components/common/PageContainer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { getButtonVariantClass } from "../../utils/themeUtils";
import { Settings2, Save, RefreshCw } from "lucide-react";

const EmployeeIdFormatSettings = () => {
  const { getDocument, updateDocument, addDocument } = useFirestore("settings");
  const { showSuccess, showError } = useMessageContext();
  const [loading, setLoading] = useState(true);
  const [formats, setFormats] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 설정 로드
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);

        // Firestore에서 사원번호 형식 설정 가져오기
        const settingsDoc = await getDocument("employeeIdFormats");

        if (settingsDoc && settingsDoc.formats) {
          setFormats(settingsDoc.formats);
        } else {
          // 기본 형식 설정
          const defaultFormats = [
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

          setFormats(defaultFormats);
        }
      } catch (error) {
        console.error("설정 로드 중 오류 발생:", error);
        showError(
          "설정 로드 오류",
          "사원번호 형식 설정을 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [getDocument, showError]);

  // 설정 저장
  const handleSaveFormats = async (updatedFormats) => {
    try {
      setLoading(true);

      // Firestore에 설정 저장
      const settingsDoc = await getDocument("employeeIdFormats");
      if (settingsDoc) {
        await updateDocument("employeeIdFormats", { formats: updatedFormats });
      } else {
        await addDocument(
          { id: "employeeIdFormats", formats: updatedFormats },
          "employeeIdFormats"
        );
      }

      setFormats(updatedFormats);
      setSaveSuccess(true);
      showSuccess(
        "설정 저장 완료",
        "사원번호 형식 설정이 성공적으로 저장되었습니다."
      );

      // 3초 후 성공 메시지 숨기기
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("설정 저장 중 오류 발생:", error);
      showError(
        "설정 저장 오류",
        "사원번호 형식 설정을 저장하는 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 설정 저장 성공 메시지 */}
      {saveSuccess && (
        <div className="mb-6 p-4 rounded-md bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300 flex items-center">
          <BadgeCheck className="mr-2 h-4 w-4" />
          <span>사원번호 형식 설정이 성공적으로 저장되었습니다.</span>
        </div>
      )}

      <p className="text-muted-foreground">
        사원번호 형식을 관리하고 기본값을 설정합니다. 사용자 등록 시 선택한
        형식에 따라 사원번호가 자동 생성됩니다. 사원번호는 입사 시점에 발급되며,
        부서 이동이나 위치 변경 시에도 변경되지 않습니다.
      </p>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-muted-foreground">
            설정을 불러오는 중...
          </span>
        </div>
      ) : (
        <EmployeeIdFormatSettings
          initialFormats={formats}
          onSave={handleSaveFormats}
        />
      )}
    </div>
  );
};

export default EmployeeIdFormatSettings;
