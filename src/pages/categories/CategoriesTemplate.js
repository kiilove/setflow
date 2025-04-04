"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import CategoriesTemplateForm from "../../components/categories/CategoriesTemplateForm";
import { getButtonVariantClass } from "../../utils/themeUtils";
import specTemplates from "../../data/specTemplates";
import { dataService } from "../../data/mockData";

const CategoriesTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const categoryId = Number.parseInt(id);

  // 상태 관리
  const [templateData, setTemplateData] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 카테고리 및 템플릿 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 카테고리 데이터 가져오기
        const categoryData = await dataService.getCategoryById(categoryId);

        if (!categoryData) {
          throw new Error("카테고리를 찾을 수 없습니다.");
        }

        setCategory(categoryData);

        // specTemplates에서 해당 카테고리의 템플릿 가져오기
        const templateFields = specTemplates[categoryData.name] || [];

        // 기존에 저장된 사용자 정의 필드가 있으면 병합
        const existingFields = categoryData.specFields || [];

        // 템플릿 필드와 기존 필드 병합 (기존 필드 우선)
        const mergedFields = templateFields.map((templateField) => {
          const existingField = existingFields.find(
            (field) => field.id === templateField.id
          );
          return existingField || templateField;
        });

        // 템플릿에 없는 사용자 정의 필드 추가
        existingFields.forEach((existingField) => {
          if (!mergedFields.some((field) => field.id === existingField.id)) {
            mergedFields.push(existingField);
          }
        });

        setTemplateData({
          categoryId: categoryId,
          categoryName: categoryData.name,
          fields: mergedFields,
        });
      } catch (error) {
        console.error("데이터 불러오는 중 오류가 발생했습니다:", error);
        setError(error.message || "카테고리를 찾을 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  // 템플릿 저장 핸들러
  const handleSubmit = async (formData) => {
    try {
      // 카테고리 데이터 업데이트
      const updatedCategory = {
        ...category,
        specFields: formData.fields,
      };

      // 실제 API 호출
      await dataService.updateCategory(categoryId, updatedCategory);

      console.log("템플릿 저장:", formData);
      alert("사양 템플릿이 저장되었습니다.");
      navigate("/categories");
    } catch (error) {
      console.error("템플릿 저장 중 오류가 발생했습니다:", error);
      alert("템플릿 저장에 실패했습니다.");
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    navigate("/categories");
  };

  if (loading) {
    return (
      <PageContainer title="사양 템플릿 편집">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-muted-foreground">로딩 중...</span>
        </div>
      </PageContainer>
    );
  }

  if (error || !category) {
    return (
      <PageContainer title="사양 템플릿 편집">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground">
            카테고리를 찾을 수 없습니다
          </h3>
          <p className="text-muted-foreground mt-2">
            {error || "요청하신 카테고리 ID가 존재하지 않습니다."}
          </p>
          <Link
            to="/categories"
            className={`mt-4 inline-flex items-center px-4 py-2 rounded-md ${getButtonVariantClass(
              "primary"
            )}`}
          >
            카테고리 목록으로 돌아가기
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={`사양 템플릿 편집: ${category.name}`}>
      <div className="mb-6">
        <p className="text-muted-foreground">
          {category.name} 카테고리의 사양 템플릿을 편집합니다. 이 템플릿은 자산
          등록 시 해당 카테고리를 선택했을 때 표시될 사양 필드를 정의합니다.
        </p>
      </div>

      <CategoriesTemplateForm
        initialData={templateData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      <div className="mt-6">
        <Link
          to={`/categories/edit/${id}`}
          className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${getButtonVariantClass(
            "outline"
          )}`}
        >
          카테고리 정보 편집
        </Link>
      </div>
    </PageContainer>
  );
};

export default CategoriesTemplate;
