"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMessageContext } from "../../context/MessageContext";
import PageContainer from "../../components/common/PageContainer";
import AssetsForm from "../../components/assets/AssetsForm";
import useAssetService from "../../services/assetService";
import ProcessMessageBox from "../../components/common/ProcessMessageBox";

const AssetsAdd = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useMessageContext();
  const { createAsset, createAssetWithAssignment } = useAssetService();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processSteps, setProcessSteps] = useState([]);
  const [showProcessBox, setShowProcessBox] = useState(false);
  const [processStatus, setProcessStatus] = useState("idle"); // idle, processing, success, error

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
    role: "", // role 필드 추가
    specifications: {},
    customSpecifications: {}, // 커스텀 사양 필드 추가
    depreciation: {
      method: "straight-line",
      years: 5,
      residualValueType: "percentage",
      residualValue: 10,
    },
    attachments: [],
  };

  // 폼 제출 핸들러
  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setShowProcessBox(true);
      setProcessStatus("processing");
      setProcessSteps([{ title: "자산 등록 시작", status: "processing" }]);

      // 숫자 필드 변환
      const numericFormData = {
        ...formData,
        purchasePrice: Number.parseFloat(formData.purchasePrice) || 0,
        currentValue: Number.parseFloat(formData.currentValue) || 0,
      };

      // 할당 정보가 있는지 확인
      const hasAssignmentInfo = formData.assignedTo && formData.department;

      // 이미지 및 파일 업로드 단계 추가
      setProcessSteps([
        { title: "자산 등록 시작", status: "success" },
        { title: "이미지 및 파일 업로드 중", status: "processing" },
      ]);

      // 잠시 대기하여 사용자가 프로세스 상태를 볼 수 있게 함
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (hasAssignmentInfo) {
        // 프로세스 단계 업데이트 - 이전 "processing" 상태를 제거하고 완료 상태만 표시
        setProcessSteps([
          { title: "자산 등록 시작", status: "success" },
          { title: "이미지 및 파일 업로드 완료", status: "success" },
          { title: "자산 정보 처리 중", status: "processing" },
        ]);

        // 잠시 대기
        await new Promise((resolve) => setTimeout(resolve, 500));

        // 프로세스 단계 업데이트
        setProcessSteps([
          { title: "자산 등록 시작", status: "success" },
          { title: "이미지 및 파일 업로드 완료", status: "success" },
          { title: "자산 정보 처리 완료", status: "success" },
          { title: "할당 정보 처리 중", status: "processing" },
        ]);

        // 잠시 대기
        await new Promise((resolve) => setTimeout(resolve, 500));

        // 할당 데이터 준비
        const assignmentData = {
          assignedTo: formData.assignedTo,
          department: formData.department,
          location: formData.location,
          assignedDate:
            formData.assignedDate || new Date().toISOString().split("T")[0],
          contactNumber: formData.contactNumber,
          email: formData.email,
          role: formData.role || "", // role이 없으면 빈 문자열로 설정
          notes: formData.notes,
        };

        // 자산 생성과 할당을 트랜잭션으로 처리
        await createAssetWithAssignment(numericFormData, assignmentData);

        // 프로세스 단계 업데이트
        setProcessSteps([
          { title: "자산 등록 시작", status: "success" },
          { title: "이미지 및 파일 업로드 완료", status: "success" },
          { title: "자산 정보 처리 완료", status: "success" },
          { title: "할당 정보 처리 완료", status: "success" },
          { title: "자산 등록 및 할당 완료", status: "success" },
        ]);
        setProcessStatus("success");

        // 프로세스 메시지 박스가 충분히 표시된 후 성공 메시지 표시
        setTimeout(() => {
          showSuccess(
            "자산 등록 및 할당 완료",
            "자산이 성공적으로 등록되고 할당되었습니다."
          );

          // 추가 대기 후 목록 페이지로 이동
          setTimeout(() => {
            navigate("/assets"); // 목록 페이지로 이동
          }, 1000);
        }, 1000);
      } else {
        // 프로세스 단계 업데이트 - 이전 "processing" 상태를 제거하고 완료 상태만 표시
        setProcessSteps([
          { title: "자산 등록 시작", status: "success" },
          { title: "이미지 및 파일 업로드 완료", status: "success" },
          { title: "자산 정보 처리 중", status: "processing" },
        ]);

        // 잠시 대기
        await new Promise((resolve) => setTimeout(resolve, 500));

        // 할당 정보가 없으면 자산만 생성
        await createAsset(numericFormData);

        // 프로세스 단계 업데이트
        setProcessSteps([
          { title: "자산 등록 시작", status: "success" },
          { title: "이미지 및 파일 업로드 완료", status: "success" },
          { title: "자산 정보 처리 완료", status: "success" },
          { title: "자산 등록 완료", status: "success" },
        ]);
        setProcessStatus("success");

        // 프로세스 메시지 박스가 충분히 표시된 후 성공 메시지 표시
        /*
        setTimeout(() => {
          showSuccess("자산 등록 완료", "자산이 성공적으로 등록되었습니다.")

          // 추가 대기 후 목록 페이지로 이동
          setTimeout(() => {
            navigate("/assets") // 목록 페이지로 이동
          }, 1000)
        }, 1000)
        */
      }
    } catch (error) {
      console.error("자산 등록 중 오류 발생:", error);

      // 프로세스 단계 업데이트 - 오류 표시
      setProcessSteps((prev) => [
        ...prev,
        {
          title: "오류 발생",
          status: "error",
          description: error.message || "자산 등록 중 오류가 발생했습니다.",
        },
      ]);
      setProcessStatus("error");

      // 오류 메시지는 즉시 표시
      showError(
        "자산 등록 실패",
        "자산 등록 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsSubmitting(false);
      // ProcessMessageBox는 닫지 않고 유지 (사용자가 직접 닫거나 성공 시 자동으로 닫힘)
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    navigate("/assets"); // 목록 페이지로 이동
  };

  // 프로세스 메시지 박스 닫기 핸들러
  const handleCloseProcessBox = () => {
    setShowProcessBox(false);
    // 성공 상태에서 닫을 경우 목록 페이지로 이동
    if (processStatus === "success") {
      navigate("/assets");
    }
  };

  return (
    <PageContainer title="자산 등록">
      <AssetsForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />

      {/* 처리 과정 메시지 박스 */}
      <ProcessMessageBox
        isOpen={showProcessBox}
        onClose={handleCloseProcessBox}
        title="자산 등록 진행 상태"
        steps={processSteps}
        status={processStatus}
        allowClose={processStatus !== "processing"}
      />
    </PageContainer>
  );
};

export default AssetsAdd;
