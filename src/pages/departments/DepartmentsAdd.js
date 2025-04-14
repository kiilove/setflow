"use client";

import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import DepartmentForm from "../../components/departments/DepartmentForm";
import { useFirestore } from "../../hooks/useFirestore";
import { useMessageContext } from "../../context/MessageContext";

const DepartmentsAdd = () => {
  const navigate = useNavigate();
  const { addDocument } = useFirestore("departments");
  const { showSuccess, showError } = useMessageContext();

  // 초기 데이터 설정
  const initialData = {
    name: "",
    description: "",
    icon: "Building",
    iconColor: "bg-gray-100",
    iconTextColor: "text-gray-500",
    iconColorName: "기본",
    manager: "",
    location: "",
    contactEmail: "",
    contactPhone: "",
  };

  // 폼 제출 핸들러
  const handleSubmit = async (formData) => {
    try {
      // Firestore에 부서 추가 - createdAt, updatedAt 제거
      const newDepartmentId = await addDocument(formData);

      showSuccess("부서 추가 완료", "부서가 성공적으로 추가되었습니다.");
      navigate("/departments");
    } catch (error) {
      console.error("부서 추가 중 오류가 발생했습니다:", error);
      showError("추가 오류", "부서 추가에 실패했습니다.");
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    navigate("/departments");
  };

  return (
    <PageContainer title="부서 추가">
      <DepartmentForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </PageContainer>
  );
};

export default DepartmentsAdd;
