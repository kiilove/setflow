"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import UserForm from "../../components/users/UserForm";

const UsersAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      // 실제 구현에서는 API 호출
      console.log("사용자 등록:", formData);

      // 성공 시 사용자 목록 페이지로 이동
      setTimeout(() => {
        setLoading(false);
        navigate("/users", {
          state: { message: "사용자가 성공적으로 등록되었습니다." },
        });
      }, 1000);
    } catch (error) {
      console.error("사용자 등록 중 오류 발생:", error);
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">사용자 등록</h1>
        </div>

        <div className="bg-card rounded-lg shadow p-6 border border-border">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-muted-foreground">처리 중...</span>
            </div>
          ) : (
            <UserForm onSubmit={handleSubmit} />
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default UsersAdd;
