"use client";

import { useNavigate, useParams } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import DepartmentForm from "../../components/departments/DepartmentForm";
import { useState, useEffect } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { useMessageContext } from "../../context/MessageContext";

const DepartmentsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getDocument, updateDocument } = useFirestore("departments");
  const { showSuccess, showError } = useMessageContext();

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setLoading(true);
        const data = await getDocument(id);

        if (!data) {
          throw new Error("부서를 찾을 수 없습니다.");
        }

        // 필수 필드가 없는 경우 기본값 설정
        const completeData = {
          ...data,
          // icon 관련 필드가 없으면 기본값 설정
          icon: data.icon || "Building",
          iconColor: data.iconColor || "bg-gray-100",
          iconTextColor: data.iconTextColor || "text-gray-500",
          iconColorName: data.iconColorName || "기본",
        };

        setDepartment(completeData);
      } catch (err) {
        console.error("부서 로딩 오류:", err);
        setError(err.message);
        showError(
          "로딩 오류",
          err.message || "부서를 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id, getDocument, showError]);

  // 폼 제출 핸들러
  const handleSubmit = async (formData) => {
    try {
      // Firestore 업데이트 - updatedAt 제거
      await updateDocument(id, formData);

      showSuccess("부서 수정 완료", "부서가 성공적으로 업데이트되었습니다.");
      navigate("/departments");
    } catch (err) {
      console.error("부서 업데이트 오류:", err);
      showError("수정 오류", "부서 업데이트 중 오류가 발생했습니다.");
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    navigate("/departments");
  };

  if (loading) {
    return (
      <PageContainer title="부서 수정">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-muted-foreground">로딩 중...</span>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="부서 수정">
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-destructive mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            onClick={() => navigate("/departments")}
          >
            부서 목록으로 돌아가기
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="부서 수정">
      {department && (
        <DepartmentForm
          initialData={department}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </PageContainer>
  );
};

export default DepartmentsEdit;
