"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import LocationForm from "../../components/locations/LocationForm";
import { useFirestore } from "../../hooks/useFirestore";
import { useMessageContext } from "../../context/MessageContext";

const LocationsAdd = () => {
  const navigate = useNavigate();
  const { addDocument } = useFirestore("locations");
  const { showSuccess, showError } = useMessageContext();
  const [loading, setLoading] = useState(false);

  // 초기 데이터 설정
  const initialValues = {
    name: "",
    address: "",
    detail: "",
    description: "",
    latitude: "",
    longitude: "",
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      // Firestore에 위치 추가
      const newLocationId = await addDocument(formData);

      showSuccess("위치 추가 완료", "위치가 성공적으로 추가되었습니다.");
      navigate("/locations");
    } catch (error) {
      console.error("위치 추가 중 오류가 발생했습니다:", error);
      showError("추가 오류", "위치 추가에 실패했습니다.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/locations");
  };

  return (
    <PageContainer title="위치 추가">
      <div className="space-y-6">
        <div className="bg-card rounded-lg shadow p-6 border border-border">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-muted-foreground">처리 중...</span>
            </div>
          ) : (
            <LocationForm
              initialValues={initialValues}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default LocationsAdd;
