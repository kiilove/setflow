"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import { useFirestoreSubcollection } from "../../hooks/useFirestoreSubcollection";
import { useAuth } from "../../context/AuthContext";
import { useMessageContext } from "../../context/MessageContext";
import CategoriesTable from "../../components/categories/CategoriesTable";

const CategoriesList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getDocuments, deleteDocument } = useFirestoreSubcollection(
    "clients",
    user.uid,
    "categories"
  );
  const { showSuccess, showError } = useMessageContext();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await getDocuments();
        setCategories(data);
      } catch (error) {
        console.error("카테고리 목록 로드 중 오류가 발생했습니다:", error);
        showError("로드 오류", "카테고리 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [getDocuments, showError]);

  const handleEdit = (id) => {
    navigate(`/categories/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteDocument(id);
      setCategories(categories.filter((category) => category.id !== id));
      showSuccess("삭제 완료", "카테고리가 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("카테고리 삭제 중 오류가 발생했습니다:", error);
      showError("삭제 오류", "카테고리 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    navigate("/categories/add");
  };

  return (
    <PageContainer title="카테고리 목록">
      <CategoriesTable
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        loading={loading}
      />
    </PageContainer>
  );
};

export default CategoriesList;
