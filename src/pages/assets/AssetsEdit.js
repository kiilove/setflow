"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import AssetsForm from "../../components/assets/AssetsForm";

const AssetsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 자산 데이터 불러오기
  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setLoading(true);
        // 실제 API 호출로 대체
        // const response = await api.get(`/assets/${id}`);
        // setAsset(response.data);

        // 임시 데이터 (실제 구현 시 API 호출로 대체)
        setTimeout(() => {
          const mockAsset = {
            id,
            name: "테스트 자산",
            category: "노트북",
            serialNumber: "SN12345",
            model: "MacBook Pro",
            manufacturer: "Apple",
            purchaseDate: "2023-01-15",
            purchasePrice: "2000000",
            supplier: "Apple Store",
            warrantyExpiry: "2024-01-15",
            location: "본사",
            status: "사용중",
            notes: "테스트용 노트북입니다.",
            currentValue: "1800000",
            assignedTo: "홍길동",
            department: "개발팀",
            assignedDate: "2023-01-20",
            specifications: {
              cpu: "Apple M1",
              ram: "16GB",
              storage: "512GB SSD",
            },
            customSpecifications: {
              color: "Space Gray",
            },
            depreciation: {
              method: "straight-line",
              years: 3,
              residualValueType: "fixed",
              residualValue: 500000,
            },
            imageUrl: null,
            attachments: [
              {
                id: "att123",
                name: "매뉴얼.pdf",
                size: 1024000,
                type: "application/pdf",
                date: "2023-01-15",
              },
            ],
          };
          setAsset(mockAsset);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("자산 정보를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
        console.error("Error fetching asset:", err);
      }
    };

    fetchAsset();
  }, [id]);

  // 폼 제출 핸들러
  const handleSubmit = (formData) => {
    console.log("자산 수정:", formData);

    // 여기서 API 호출로 데이터 업데이트
    // const response = await api.put(`/assets/${id}`, formData);

    alert("자산이 수정되었습니다.");
    navigate("/assets"); // 목록 페이지로 이동
  };

  // 취소 핸들러
  const handleCancel = () => {
    navigate("/assets"); // 목록 페이지로 이동
  };

  if (loading) {
    return (
      <PageContainer title="자산 수정">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="자산 수정">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={`자산 수정: ${asset.name}`}>
      <AssetsForm
        initialData={asset}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </PageContainer>
  );
};

export default AssetsEdit;
