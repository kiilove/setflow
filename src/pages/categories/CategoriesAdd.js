"use client";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import CategoriesForm from "../../components/categories/CategoriesForm";
import { dataService } from "../../data/mockData";

const CategoriesAdd = () => {
  const navigate = useNavigate();

  // 초기 데이터 설정 (specTemplates 제거)
  const initialData = {
    name: "",
    description: "",
    specFields: [],
    icon: "",
    iconColor: "bg-gray-100",
    iconTextColor: "text-gray-500",
    iconColorName: "기본",
    depreciation: {
      method: "straight-line",
      years: 5,
      residualValueType: "percentage",
      residualValue: 10,
    },
  };

  // 폼 제출 핸들러
  const handleSubmit = async (formData) => {
    try {
      // 실제 API 호출
      await dataService.addCategory(formData);

      console.log("카테고리 추가:", formData);
      alert("카테고리가 추가되었습니다.");
      navigate("/categories");
    } catch (error) {
      console.error("카테고리 추가 중 오류가 발생했습니다:", error);
      alert("카테고리 추가에 실패했습니다.");
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
        onCancel={handleCancel}
      />
    </PageContainer>
  );
};

export default CategoriesAdd;
