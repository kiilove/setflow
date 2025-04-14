"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFirestore } from "../../hooks/useFirestore";
import { useMessageContext } from "../../context/MessageContext"; // 경로 수정
import useAssetService from "../../services/assetService";
import PageContainer from "../../components/common/PageContainer";
import AssetsForm from "../../components/assets/AssetsForm";
import ProcessMessageBox from "../../components/common/ProcessMessageBox";

const AssetsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocument } = useFirestore("assets");
  const { updateAsset } = useAssetService();
  const { showSuccess, showError, showInfo } = useMessageContext();

  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processSteps, setProcessSteps] = useState([]);
  const [showProcessBox, setShowProcessBox] = useState(false);
  const [processStatus, setProcessStatus] = useState("idle"); // idle, processing, success, error

  // 자산 데이터 불러오기
  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setLoading(true);
        setProcessSteps([{ title: "자산 정보 로딩 중", status: "processing" }]);
        setShowProcessBox(true);
        setProcessStatus("processing");

        const data = await getDocument(id);
        if (data) {
          // 커스텀 사양 필드가 없는 경우 빈 객체로 초기화
          if (!data.customSpecifications) {
            data.customSpecifications = {};
          }
          setAsset(data);

          // 프로세스 단계 업데이트
          setProcessSteps((prev) => [
            ...prev,
            { title: "자산 정보 로딩 완료", status: "success" },
          ]);
          setProcessStatus("success");

          // 잠시 후 프로세스 박스 닫기
          setTimeout(() => {
            setShowProcessBox(false);
          }, 1000);
        } else {
          setError("자산을 찾을 수 없습니다.");

          // 프로세스 단계 업데이트
          setProcessSteps((prev) => [
            ...prev,
            {
              title: "자산 정보 로딩 실패",
              status: "error",
              description: "요청하신 자산 정보를 찾을 수 없습니다.",
            },
          ]);
          setProcessStatus("error");

          showInfo("자산 정보 없음", "요청하신 자산 정보를 찾을 수 없습니다.");
        }
      } catch (err) {
        setError("자산 정보를 불러오는 중 오류가 발생했습니다.");

        // 프로세스 단계 업데이트
        setProcessSteps((prev) => [
          ...prev,
          {
            title: "자산 정보 로딩 실패",
            status: "error",
            description:
              err.message || "자산 정보를 불러오는 중 오류가 발생했습니다.",
          },
        ]);
        setProcessStatus("error");

        showError(
          "데이터 로드 오류",
          "자산 정보를 불러오는 중 오류가 발생했습니다."
        );
        console.error("Error fetching asset:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [id, getDocument, showError, showInfo]);

  // 폼 제출 핸들러
  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setShowProcessBox(true);
      setProcessStatus("processing");
      setProcessSteps([
        { title: "자산 정보 업데이트 시작", status: "processing" },
      ]);

      // 숫자 필드 변환
      const numericFormData = {
        ...formData,
        purchasePrice: Number.parseFloat(formData.purchasePrice) || 0,
        currentValue: Number.parseFloat(formData.currentValue) || 0,
      };

      // 프로세스 단계 업데이트
      setProcessSteps((prev) => [
        ...prev,
        { title: "이미지 및 파일 업로드 중", status: "processing" },
      ]);

      // 잠시 대기하여 사용자가 프로세스 상태를 볼 수 있게 함
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 자산 업데이트
      await updateAsset(id, {
        ...numericFormData,
      });

      // 프로세스 단계 업데이트
      setProcessSteps((prev) => [
        ...prev,
        { title: "이미지 및 파일 업로드 완료", status: "success" },
        { title: "자산 정보 업데이트 완료", status: "success" },
      ]);
      setProcessStatus("success");

      // 별도의 성공 메시지 표시 대신 ProcessMessageBox에서 완료 처리
      // 아래 코드 제거
      /*
      setTimeout(() => {
        showSuccess("자산 수정 완료", "자산 정보가 성공적으로 업데이트되었습니다.")

        // 추가 대기 후 상세 페이지로 이동
        setTimeout(() => {
          navigate(`/assets/detail/${id}`)
        }, 1000)
      }, 1000)
      */
    } catch (error) {
      console.error("자산 수정 중 오류 발생:", error);

      // 프로세스 단계 업데이트 - 오류 표시
      setProcessSteps((prev) => [
        ...prev,
        {
          title: "오류 발생",
          status: "error",
          description: error.message || "자산 수정 중 오류가 발생했습니다.",
        },
      ]);
      setProcessStatus("error");

      // 오류 메시지는 즉시 표시
      showError(
        "자산 수정 실패",
        "자산 수정 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsSubmitting(false);
      // ProcessMessageBox는 닫지 않고 유지 (사용자가 직접 닫거나 성공 시 자동으로 닫힘)
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    navigate(`/assets/detail/${id}`); // 상세 페이지로 이동
  };

  // 프로세스 메시지 박스 닫기 핸들러 수정
  const handleCloseProcessBox = () => {
    setShowProcessBox(false);
    // 성공 상태에서 닫을 경우 상세 페이지로 이동
    if (processStatus === "success") {
      navigate(`/assets/detail/${id}`);
    }
  };

  // 로딩 중이면 로딩 표시
  if (loading) {
    return (
      <PageContainer title="자산 정보 로딩 중...">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">
            자산 정보를 불러오는 중입니다...
          </p>
        </div>
      </PageContainer>
    );
  }

  // 에러가 있으면 에러 표시
  if (error) {
    return (
      <PageContainer title="오류 발생">
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
          <p>{error}</p>
          <button
            onClick={() => navigate("/assets")}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            자산 목록으로 돌아가기
          </button>
        </div>
      </PageContainer>
    );
  }

  // 자산 데이터가 없으면 메시지 표시
  if (!asset) {
    return (
      <PageContainer title="자산 정보 없음">
        <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded">
          <p>요청하신 자산 정보를 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate("/assets")}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            자산 목록으로 돌아가기
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={`자산 수정 - ${asset.name || ""}`}>
      <AssetsForm
        initialData={asset}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        isEditMode={true}
      />

      {/* 처리 과정 메시지 박스 */}
      <ProcessMessageBox
        isOpen={showProcessBox}
        onClose={handleCloseProcessBox}
        title="자산 수정 진행 상태"
        steps={processSteps}
        status={processStatus}
        allowClose={processStatus !== "processing"}
      />
    </PageContainer>
  );
};

export default AssetsEdit;
