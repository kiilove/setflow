"use client";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import AssetsForm from "../../components/assets/AssetsForm";

const AssetsAdd = () => {
  const navigate = useNavigate();

  // 초기 데이터 설정
  const initialData = {
    name: "",
    category: "",
    serialNumber: "",
    model: "",
    manufacturer: "",
    purchaseDate: new Date().toISOString().split("T")[0], // 오늘 날짜로 설정
    purchasePrice: "",
    supplier: "",
    warrantyExpiry: "",
    location: "",
    status: "사용가능", // 기본값 설정
    notes: "",
    currentValue: "",
    assignedTo: "",
    department: "",
    assignedDate: "",
    specifications: {},
    customSpecifications: {},
    depreciation: {
      method: "straight-line",
      years: 5,
      residualValueType: "percentage",
      residualValue: 10,
    },
    attachments: [],
  };

  // 폼 제출 핸들러
  const handleSubmit = (formData) => {
    console.log("자산 등록:", formData);

    // 여기서 API 호출로 데이터 저장
    // const response = await api.post('/assets', formData);

    alert("자산이 등록되었습니다.");
    navigate("/assets"); // 목록 페이지로 이동
  };

  // 취소 핸들러
  const handleCancel = () => {
    navigate("/assets"); // 목록 페이지로 이동
  };

  return (
    <PageContainer title="자산 등록">
      <AssetsForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </PageContainer>
  );
};

export default AssetsAdd;
