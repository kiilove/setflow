"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import LocationsForm from "../../components/locations/LocationsForm";

const LocationsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // 실제 구현에서는 API 호출
        // 예시 데이터
        const locationData = {
          id: Number.parseInt(id),
          name: "본사 3층",
          address: "서울시 강남구 테헤란로 123",
          city: "강남구",
          state: "서울시",
          zipCode: "06123",
          country: "대한민국",
          manager: "박관리자",
          phone: "02-1234-5678",
          email: "location@example.com",
          description: "본사 3층 사무실",
          latitude: "37.5665",
          longitude: "126.978",
        };

        setTimeout(() => {
          setLocation(locationData);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("위치 정보를 불러오는 중 오류가 발생했습니다:", error);
        setError("위치 정보를 불러올 수 없습니다.");
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      // 실제 구현에서는 API 호출
      console.log("위치 정보 수정:", formData);

      // 성공 시 위치 목록 페이지로 이동
      setTimeout(() => {
        setSubmitting(false);
        navigate("/locations", {
          state: { message: "위치 정보가 성공적으로 수정되었습니다." },
        });
      }, 1000);
    } catch (error) {
      console.error("위치 정보 수정 중 오류 발생:", error);
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/locations");
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-muted-foreground">
            위치 정보를 불러오는 중...
          </span>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p>{error}</p>
          <button
            onClick={() => navigate("/locations")}
            className="mt-2 px-4 py-2 bg-background border border-input rounded-md hover:bg-muted transition-colors"
          >
            위치 목록으로 돌아가기
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">위치 정보 수정</h1>
        </div>

        <div className="bg-card rounded-lg shadow p-6 border border-border">
          {submitting ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-muted-foreground">처리 중...</span>
            </div>
          ) : (
            <LocationsForm
              location={location}
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
