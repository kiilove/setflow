"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import DepartmentForm from "../../components/departments/DepartmentForm";

const DepartmentsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        // 실제 구현에서는 API 호출
        // 예시 데이터
        const departmentData = {
          id: Number.parseInt(id),
          name: "개발팀",
          manager: "김철수",
          location: "본사 3층",
          description: "소프트웨어 개발 및 유지보수 담당",
        };

        setTimeout(() => {
          setDepartment(departmentData);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("부서 정보를 불러오는 중 오류가 발생했습니다:", error);
        setError("부서 정보를 불러올 수 없습니다.");
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      // 실제 구현에서는 API 호출
      console.log("부서 정보 수정:", formData);

      // 성공 시 부서 목록 페이지로 이동
      setTimeout(() => {
        setSubmitting(false);
        navigate("/users/departments", {
          state: { message: "부서 정보가 성공적으로 수정되었습니다." },
        });
      }, 1000);
    } catch (error) {
      console.error("부서 정보 수정 중 오류 발생:", error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-muted-foreground">
            부서 정보를 불러오는 중...
          </span>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p>{error}</p>
          <button
            onClick={() => navigate("/users/departments")}
            className="mt-2 px-4 py-2 bg-background border border-input rounded-md hover:bg-muted transition-colors"
          >
            부서 목록으로 돌아가기
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">부서 정보 수정</h1>
        </div>

        <div className="bg-card rounded-lg shadow p-6 border border-border">
          {submitting ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-muted-foreground">처리 중...</span>
            </div>
          ) : (
            <DepartmentForm
              department={department}
              onSubmit={handleSubmit}
              isEditing={true}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default DepartmentsEdit;
