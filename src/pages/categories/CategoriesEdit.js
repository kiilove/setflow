"use client";
import { useNavigate, useParams } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import CategoriesForm from "../../components/categories/CategoriesForm";
import { dataService } from "../../data/mockData";
import { useState, useEffect } from "react";

const CategoriesEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        // ID가 문자열로 전달되므로 숫자로 변환
        const categoryId = Number.parseInt(id, 10);
        if (isNaN(categoryId)) {
          throw new Error("유효하지 않은 카테고리 ID입니다.");
        }

        const data = await dataService.getCategoryById(categoryId);
        if (!data) {
          throw new Error("카테고리를 찾을 수 없습니다.");
        }

        // 필수 필드가 없는 경우 기본값 설정
        const completeData = {
          ...data,
          // specFields가 없으면 빈 배열로 초기화
          specFields: data.specFields || [],
          // 템플릿 ID가 없으면 기본값 설정
          templateId: data.templateId || "custom",
          // icon 관련 필드가 없으면 기본값 설정
          icon: data.icon || "",
          iconColor: data.iconColor || "bg-gray-100",
          iconTextColor: data.iconTextColor || "text-gray-500",
          iconColorName: data.iconColorName || "기본",
          // depreciation이 없으면 기본값 설정
          depreciation: data.depreciation || {
            method: "straight-line",
            years: 5,
            residualValueType: "percentage",
            residualValue: 10,
          },
        };

        setCategory(completeData);
        setLoading(false);
      } catch (err) {
        console.error("카테고리 로딩 오류:", err);
        setError(err.message);
        setLoading(false);
        alert(err.message);
      }
    };

    fetchCategory();
  }, [id]);

  // 폼 제출 핸들러
  const handleSubmit = async (formData) => {
    try {
      // ID가 문자열로 전달되므로 숫자로 변환
      const categoryId = Number.parseInt(id, 10);
      if (isNaN(categoryId)) {
        throw new Error("유효하지 않은 카테고리 ID입니다.");
      }

      await dataService.updateCategory(categoryId, formData);
      alert("카테고리가 성공적으로 업데이트되었습니다.");
      navigate("/categories");
    } catch (err) {
      console.error("카테고리 업데이트 오류:", err);
      alert(err.message || "카테고리 업데이트 중 오류가 발생했습니다.");
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    navigate("/categories");
  };

  if (loading) {
    return (
      <PageContainer title="카테고리 수정">
        <div className="flex justify-center items-center h-64">로딩 중...</div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="카테고리 수정">
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => navigate("/categories")}
          >
            카테고리 목록으로 돌아가기
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="카테고리 수정">
      {category && (
        <CategoriesForm
          initialData={category}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </PageContainer>
  );
};

export default CategoriesEdit;
