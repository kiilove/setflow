"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import LocationForm from "../../components/locations/LocationForm";
import { useFirestore } from "../../hooks/useFirestore";
import { useMessageContext } from "../../context/MessageContext";

const LocationsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocument, updateDocument } = useFirestore("locations");
  const { showSuccess, showError } = useMessageContext();

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);
        const data = await getDocument(id);

        if (!data) {
          throw new Error("위치를 찾을 수 없습니다.");
        }

        setLocation(data);
      } catch (err) {
        console.error("위치 로딩 오류:", err);
        setError(err.message);
        showError(
          "로딩 오류",
          err.message || "위치를 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id, getDocument, showError]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);

      // Firestore 업데이트
      await updateDocument(id, formData);

      showSuccess("위치 수정 완료", "위치가 성공적으로 업데이트되었습니다.");
      navigate("/locations");
    } catch (err) {
      console.error("위치 업데이트 오류:", err);
      showError("수정 오류", "위치 업데이트 중 오류가 발생했습니다.");
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/locations");
  };

  if (loading) {
    return (
      <PageContainer title="위치 수정">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-muted-foreground">로딩 중...</span>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="위치 수정">
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-destructive mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            onClick={() => navigate("/locations")}
          >
            위치 목록으로 돌아가기
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="위치 수정">
      <div className="space-y-6">
        <div className="bg-card rounded-lg shadow p-6 border border-border">
          {submitting ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-muted-foreground">처리 중...</span>
            </div>
          ) : (
            <LocationForm
              initialValues={location}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isEditing={true}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default LocationsEdit;
