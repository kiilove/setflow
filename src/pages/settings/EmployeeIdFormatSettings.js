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
  const router = useRouter();
  const { getDocument, updateDocument, addDocument } = useFirestore("settings");
  const { showSuccess, showError, showWarning } = useMessageContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [format, setFormat] = useState({
    prefix: "",
    length: 4,
    useYear: true,
    useDepartment: true,
    separator: "-",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getDocument("employeeIdFormats");

      if (data) {
        setFormat(data);
      }
    } catch (error) {
      console.error("설정 로드 중 오류 발생:", error);
      showError(
        "설정 로드 실패",
        "사원번호 형식 설정을 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormat((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      // 필수 필드 검증
      if (!format.prefix.trim()) {
        showWarning("사원번호 형식 설정", "접두사를 입력해주세요.");
        return;
      }

      if (format.length < 1) {
        showWarning("사원번호 형식 설정", "번호 길이는 1 이상이어야 합니다.");
        return;
      }

      // 기존 데이터 확인
      const existingData = await getDocument("employeeIdFormats");

      if (existingData) {
        // 기존 데이터 업데이트
        await updateDocument("employeeIdFormats", format);
      } else {
        // 새 데이터 추가
        await addDocument("employeeIdFormats", format);
      }

      showSuccess("사원번호 형식 설정", "설정이 저장되었습니다.");
    } catch (error) {
      console.error("설정 저장 중 오류 발생:", error);
      showError(
        "설정 저장 실패",
        "사원번호 형식 설정을 저장하는데 실패했습니다."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormat({
      prefix: "",
      length: 4,
      useYear: true,
      useDepartment: true,
      separator: "-",
    });
  };

  return (
    <PageContainer title="사원번호 형식 설정">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings2 className="mr-2 h-5 w-5" />
              사원번호 형식 설정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="prefix">접두사</Label>
                  <Input
                    id="prefix"
                    name="prefix"
                    value={format.prefix}
                    onChange={handleChange}
                    placeholder="예: EMP"
                    maxLength={5}
                  />
                </div>

                <div>
                  <Label htmlFor="length">번호 길이</Label>
                  <Input
                    id="length"
                    name="length"
                    type="number"
                    value={format.length}
                    onChange={handleChange}
                    min="1"
                    max="10"
                  />
                </div>

                <div>
                  <Label htmlFor="separator">구분자</Label>
                  <Input
                    id="separator"
                    name="separator"
                    value={format.separator}
                    onChange={handleChange}
                    maxLength={1}
                    placeholder="예: -"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="useYear"
                    name="useYear"
                    checked={format.useYear}
                    onCheckedChange={(checked) =>
                      setFormat((prev) => ({ ...prev, useYear: checked }))
                    }
                  />
                  <Label htmlFor="useYear">연도 포함</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="useDepartment"
                    name="useDepartment"
                    checked={format.useDepartment}
                    onCheckedChange={(checked) =>
                      setFormat((prev) => ({ ...prev, useDepartment: checked }))
                    }
                  />
                  <Label htmlFor="useDepartment">부서 코드 포함</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={saving}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  초기화
                </Button>
                <Button type="submit" disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "저장 중..." : "저장"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default EmployeeIdFormatSettings;
