"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import UserForm from "../../components/users/UserForm";
import { useFirestore } from "../../hooks/useFirestore";
import { useMessageContext } from "../../context/MessageContext";

const UsersEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocument, updateDocument } = useFirestore("users");
  const { showSuccess, showError } = useMessageContext();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getDocument(id);

        if (!data) {
          throw new Error("사용자를 찾을 수 없습니다.");
        }

        setUser(data);
      } catch (err) {
        console.error("사용자 정보를 불러오는 중 오류가 발생했습니다:", err);
        setError(err.message || "사용자 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, getDocument]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);

      // Firestore 업데이트 (updatedAt은 useFirestore에서 처리)
      await updateDocument(id, formData);

      showSuccess(
        "사용자 정보 수정 완료",
        "사용자 정보가 성공적으로 업데이트되었습니다."
      );
      navigate("/users");
    } catch (error) {
      console.error("사용자 정보 수정 중 오류 발생:", error);
      showError("수정 오류", "사용자 정보 수정에 실패했습니다.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="사용자 정보 수정">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-muted-foreground">
            사용자 정보를 불러오는 중...
          </span>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="사용자 정보 수정">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p>{error}</p>
          <button
            onClick={() => navigate("/users")}
            className="mt-2 px-4 py-2 bg-background border border-input rounded-md hover:bg-muted transition-colors"
          >
            사용자 목록으로 돌아가기
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="사용자 정보 수정">
      <div className="space-y-6">
        <div className="bg-card rounded-lg shadow p-6 border border-border">
          {submitting ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-muted-foreground">처리 중...</span>
            </div>
          ) : (
            <UserForm user={user} onSubmit={handleSubmit} isEditing={true} />
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default UsersEdit;
