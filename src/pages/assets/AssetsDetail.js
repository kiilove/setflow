"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFirestore } from "../../hooks/useFirestore";
import { useMessageContext } from "../../context/MessageContext";
import PageContainer from "../../components/common/PageContainer";
import useAssetService from "../../services/assetService";

// 세부 컴포넌트 가져오기
import AssetHeader from "./detail/AssetHeader";
import ActionButtons from "./detail/ActionButtons";
import BasicInfo from "./detail/BasicInfo";
import PurchaseInfo from "./detail/PurchaseInfo";
import LocationInfo from "./detail/LocationInfo";
import SpecsInfo from "./detail/SpecsInfo";
import NotesInfo from "./detail/NotesInfo";
import AssetImage from "./detail/AssetImage";
import MaintenanceHistory from "./detail/MaintenanceHistory";
import DocumentsList from "./detail/DocumentsList";
import QRCodeSection from "./detail/QRCodeSection";
import AssignModal from "./detail/AssignModal";
import ReturnModal from "./detail/ReturnModal";
import DisposeModal from "./detail/DisposeModal";
import LoadingState from "./detail/LoadingState";
import ErrorState from "./detail/ErrorState";

const AssetsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocument } = useFirestore("assets");
  const { showConfirm, showSuccess, showError } = useMessageContext();
  const assetService = useAssetService();
  const {
    deleteAsset,
    getAssetHistory,
    assignAsset,
    returnAsset,
    disposeAsset,
  } = assetService;

  const [asset, setAsset] = useState(null);
  const [assetHistory, setAssetHistory] = useState([]);
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false); // 데이터 로드 완료 상태 추가

  // 모달 상태
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showDisposeModal, setShowDisposeModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 할당 폼 데이터
  const [assignmentFormData, setAssignmentFormData] = useState({
    assetId: id,
    assetName: "",
    assignedTo: "",
    department: "",
    email: "",
    role: "",
    assignedDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    notes: "",
    location: "",
    contactNumber: "",
  });

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  // 통화 포맷팅 함수
  const formatCurrency = (value) => {
    if (!value && value !== 0) return "-";
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(value);
  };

  // useCallback으로 감싸서 fetchData 함수를 메모이제이션
  const fetchData = useCallback(async () => {
    // 이미 데이터가 로드되었으면 중복 로드 방지
    if (dataLoaded && !loading) return;

    try {
      setLoading(true);
      console.log("자산 데이터 로딩 시작:", id);

      // 자산 정보 로드
      const assetData = await getDocument(id);
      if (!assetData) {
        setError("자산을 찾을 수 없습니다.");
        showError("데이터 로드 오류", "요청한 자산을 찾을 수 없습니다.");
        setLoading(false);
        return;
      }

      console.log("자산 데이터 로드 완료:", assetData);

      // 첨부 파일이 없는 경우 빈 배열로 초기화
      if (!assetData.attachments) {
        assetData.attachments = [];
      }

      setAsset(assetData);

      // 자산 이력 로드
      const historyData = await getAssetHistory(id);
      console.log("자산 이력 로드 완료:", historyData.length, "개 항목");
      setAssetHistory(historyData);

      // 유지보수 이력 필터링
      const maintenance = historyData.filter(
        (item) => item.type === "유지보수"
      );
      setMaintenanceHistory(maintenance);

      // 데이터 로드 완료 표시
      setDataLoaded(true);
    } catch (err) {
      console.error("자산 데이터 로드 오류:", err);
      setError("자산 데이터를 불러오는 중 오류가 발생했습니다.");
      showError(
        "데이터 로드 오류",
        "자산 정보를 불러오는 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, [id, getDocument, getAssetHistory, showError, dataLoaded, loading]);

  // 자산 데이터 및 이력 데이터 로드
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 자산 삭제 핸들러
  const handleDeleteAsset = async () => {
    if (!asset) return;

    const confirmed = await showConfirm(
      "자산 삭제",
      `"${asset.name}" 자산을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다. 모든 첨부 파일과 이미지도 함께 삭제됩니다.`,
      {
        confirmText: "삭제",
        cancelText: "취소",
        confirmVariant: "error",
      }
    );

    if (confirmed) {
      try {
        await deleteAsset(id);
        showSuccess("삭제 완료", "자산이 성공적으로 삭제되었습니다.");
        navigate("/assets"); // 목록 페이지로 이동
      } catch (error) {
        console.error("자산 삭제 오류:", error);
        showError("삭제 오류", "자산 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // 할당 폼 제출 핸들러
  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await assignAsset(id, asset.currentAssignmentId, assignmentFormData);
      showSuccess("할당 완료", "자산이 성공적으로 할당되었습니다.");
      setShowAssignModal(false);
      // 자산 정보 새로고침
      setDataLoaded(false); // 데이터 로드 상태 초기화
      fetchData();
    } catch (error) {
      showError("할당 오류", "자산 할당 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 반납 핸들러
  const handleReturnSubmit = async (returnNotes) => {
    setIsSubmitting(true);
    try {
      await returnAsset(id, asset.currentAssignmentId, returnNotes);
      showSuccess("반납 완료", "자산이 성공적으로 반납되었습니다.");
      setShowReturnModal(false);
      // 자산 정보 새로고침
      setDataLoaded(false); // 데이터 로드 상태 초기화
      fetchData();
    } catch (error) {
      showError("반납 오류", "자산 반납 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 폐기 핸들러
  const handleDisposeSubmit = async (disposeReason) => {
    setIsSubmitting(true);
    try {
      await disposeAsset(id, disposeReason);
      showSuccess("폐기 완료", "자산이 성공적으로 폐기되었습니다.");
      setShowDisposeModal(false);
      // 자산 정보 새로고침
      setDataLoaded(false); // 데이터 로드 상태 초기화
      fetchData();
    } catch (error) {
      showError("폐기 오류", "자산 폐기 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩 중 상태 표시
  if (loading) {
    return <LoadingState />;
  }

  // 에러 상태 표시
  if (error) {
    return <ErrorState error={error} />;
  }

  // 자산 데이터가 없는 경우
  if (!asset) {
    return <ErrorState error="자산 정보를 찾을 수 없습니다." />;
  }

  return (
    <PageContainer title={asset.name || "자산 상세"}>
      {/* 상단 정보 카드 */}
      <AssetHeader asset={asset} id={id} onDelete={handleDeleteAsset} />

      {/* 액션 버튼 그룹 */}
      <ActionButtons
        id={id}
        onAssignClick={() => setShowAssignModal(true)}
        onReturnClick={() => setShowReturnModal(true)}
        onDisposeClick={() => setShowDisposeModal(true)}
        status={asset.status}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 왼쪽 컬럼 - 기본 정보 */}
        <div className="md:col-span-2 space-y-6">
          {/* 기본 정보 */}
          <BasicInfo asset={asset} />

          {/* 구매 정보 */}
          <PurchaseInfo
            asset={asset}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
          />

          {/* 위치 및 할당 정보 */}
          <LocationInfo asset={asset} formatDate={formatDate} />

          {/* 사양 */}
          <SpecsInfo
            specifications={asset.specifications || {}}
            customSpecifications={asset.customSpecifications || {}}
          />

          {/* 비고 */}
          <NotesInfo notes={asset.notes} />
        </div>

        {/* 오른쪽 컬럼 - 사이드바 정보 */}
        <div className="space-y-6">
          {/* 자산 이미지 */}
          <AssetImage asset={asset} />

          {/* QR 코드 */}
          <QRCodeSection assetId={id} />

          {/* 첨부 파일 목록 */}
          <DocumentsList documents={asset.attachments || []} />

          {/* 유지보수 이력 */}
          <MaintenanceHistory
            maintenanceHistory={maintenanceHistory}
            id={id}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>

      {/* 할당 모달 */}
      {showAssignModal && (
        <AssignModal
          showAssignModal={showAssignModal}
          setShowAssignModal={setShowAssignModal}
          asset={asset}
          assignmentFormData={assignmentFormData}
          handleAssignmentChange={(e) => {
            const { name, value } = e.target;
            setAssignmentFormData((prev) => ({ ...prev, [name]: value }));
          }}
          handleAssignmentSubmit={handleAssignmentSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {/* 반납 모달 */}
      {showReturnModal && (
        <ReturnModal
          showReturnModal={showReturnModal}
          setShowReturnModal={setShowReturnModal}
          asset={asset}
          onReturnSubmit={handleReturnSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {/* 폐기 모달 */}
      {showDisposeModal && (
        <DisposeModal
          showDisposeModal={showDisposeModal}
          setShowDisposeModal={setShowDisposeModal}
          asset={asset}
          onDisposeSubmit={handleDisposeSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </PageContainer>
  );
};

export default AssetsDetail;
