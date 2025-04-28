"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import CategoriesForm from "../../components/categories/CategoriesForm";
import { useFirestoreSubcollection } from "../../hooks/useFirestoreSubcollection";
import { useMessageContext } from "../../context/MessageContext";
import { useAuth } from "../../context/AuthContext";

const CategoriesEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userUUID } = useAuth();
  const { getDocument, updateDocument } = useFirestoreSubcollection(
    "clients",
    userUUID,
    "categories"
  );
  const { showSuccess, showError } = useMessageContext();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        setLoading(true);
        const data = await getDocument(id);
        if (data) {
          setCategory(data);
        } else {
          showError("오류", "카테고리를 찾을 수 없습니다.");
          navigate("/categories");
        }
      } catch (error) {
        console.error("카테고리 로드 중 오류가 발생했습니다:", error);
        showError("로드 오류", "카테고리 정보를 불러오는데 실패했습니다.");
        navigate("/categories");
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [id, getDocument, showError, navigate]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await updateDocument(id, formData);
      showSuccess("수정 완료", "카테고리가 성공적으로 수정되었습니다.");
      navigate("/categories");
    } catch (error) {
      console.error("카테고리 수정 중 오류가 발생했습니다:", error);
      showError("수정 오류", "카테고리 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !category) {
    return <div>로딩 중...</div>;
  }

  if (!category) {
    return null;
  }

  return (
    <PageContainer title="카테고리 수정">
      <CategoriesForm
        initialData={category}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </PageContainer>
  );
};

export default CategoriesEdit;
