"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import CategoriesForm from "../../components/categories/CategoriesForm";
import { useFirestoreSubcollection } from "../../hooks/useFirestoreSubcollection";
import { useMessageContext } from "../../context/MessageContext";
import { useAuth } from "../../context/AuthContext";

const CategoriesAdd = () => {
  const navigate = useNavigate();
  const { userUUID } = useAuth();
  const { addDocument } = useFirestoreSubcollection(
    "clients",
    userUUID,
    "categories"
  );
  const { showSuccess, showError } = useMessageContext();
  const [loading, setLoading] = useState(false);

  // 초기 데이터 설정
  const initialData = {
    name: "",
    group: "",
    description: "",
    depreciation: {
      method: "정액법",
      minDepreciationPeriod: 5,
      salvageValue: 1000,
      salvageValueType: "fixed",
    },
  };

  // 폼 제출 핸들러
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await addDocument(formData);
      showSuccess("추가 완료", "카테고리가 성공적으로 추가되었습니다.");
      navigate("/categories");
    } catch (error) {
      console.error("카테고리 추가 중 오류가 발생했습니다:", error);
      showError("추가 오류", "카테고리 추가에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    navigate("/categories");
  };

  return (
    <PageContainer title="카테고리 추가">
      <CategoriesForm
        initialData={initialData}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </PageContainer>
  );
};

export default CategoriesAdd;
