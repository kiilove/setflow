"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import UserForm from "../../components/users/UserForm";
import { useFirestore } from "../../hooks/useFirestore";
import { useMessageContext } from "../../context/MessageContext";

const UsersAdd = () => {
  const navigate = useNavigate();
  const { addDocument } = useFirestore("users");
  const { showSuccess, showError } = useMessageContext();
  const [loading, setLoading] = useState(false);

  // 초기 데이터 설정
  const initialData = {
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    employeeId: "",
    joinDate: "",
    status: "재직중",
    role: "사용자",
    location: "",
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      // Firestore에 사용자 추가 (createdAt, updatedAt은 useFirestore에서 처리)
      const newUserId = await addDocument(formData);

      showSuccess("사용자 추가 완료", "사용자가 성공적으로 추가되었습니다.");
      navigate("/users");
    } catch (error) {
      console.error("사용자 추가 중 오류가 발생했습니다:", error);
      showError("추가 오류", "사용자 추가에 실패했습니다.");
      setLoading(false);
    }
  };

  return (
    <PageContainer title="사용자 등록">
      <div className="space-y-6">
        <div className="bg-card rounded-lg shadow p-6 border border-border">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-muted-foreground">처리 중...</span>
            </div>
          ) : (
            <UserForm initialData={initialData} onSubmit={handleSubmit} />
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default UsersAdd;
