"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFirestoreSubcollection } from "../../hooks/useFirestoreSubcollection";
import CategoriesTemplateForm from "../../components/categories/CategoriesTemplateForm";
import { toast } from "react-toastify";

const CategoriesTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocument, updateDocument } =
    useFirestoreSubcollection("categories");
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        setLoading(true);
        const data = await getDocument(id);
        if (!data) {
          toast.error("카테고리를 찾을 수 없습니다.");
          navigate("/categories");
          return;
        }
        setCategoryData(data);
      } catch (error) {
        console.error("Error loading category:", error);
        toast.error("카테고리 로딩 중 오류가 발생했습니다.");
        navigate("/categories");
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [id, getDocument, navigate]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await updateDocument(id, formData);
      toast.success("템플릿이 성공적으로 저장되었습니다.");
      navigate(`/categories/${id}`);
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error("템플릿 저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !categoryData) {
    return <div>로딩 중...</div>;
  }

  if (!categoryData) {
    return null;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {categoryData.name} - 사양 템플릿 편집
        </h1>
        <p className="text-muted-foreground">
          카테고리의 사양 필드를 관리합니다.
        </p>
      </div>
      <CategoriesTemplateForm
        initialData={categoryData}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default CategoriesTemplate;
