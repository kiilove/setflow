"use client";

import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaExchangeAlt,
  FaTools,
  FaHistory,
  FaDownload,
  FaQrcode,
  FaPrint,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBuilding,
  FaUser,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaFileAlt,
  FaMicrochip,
  FaClipboardList,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import {
  getStatusColorClass,
  getButtonVariantClass,
} from "../../utils/themeUtils";
import PageContainer from "../../components/common/PageContainer";
import AssignmentSection from "../../components/assets/AssignmentSection";

const AssetsDetail = () => {
  const { id = "1" } = useParams(); // 기본값으로 ID 1 사용
  const [showAssignModal, setShowAssignModal] = useState(false); // 할당 모달 상태
  const [assignmentFormData, setAssignmentFormData] = useState({
    assetId: id,
    assetName: "",
    assignedTo: "",
    department: "",
    email: "",
    role: "",
    assignedDate: new Date().toISOString().split("T")[0], // 오늘 날짜로 초기화
    dueDate: "",
    notes: "",
    location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 할당 폼 데이터 변경 핸들러
  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;
    setAssignmentFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 할당 폼 제출 핸들러
  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation(); // 이벤트 전파 중지
    setIsSubmitting(true);

    // 여기서 API 호출을 통해 할당 정보를 저장합니다
    // 실제 구현에서는 API 호출로 대체
    setTimeout(() => {
      setIsSubmitting(false);
      setShowAssignModal(false);
      // 성공 메시지 표시 로직 추가
      alert("자산이 성공적으로 할당되었습니다.");
    }, 1000);
  };

  // 가상의 자산 데이터 (디자인 확인용)
  const asset = {
    id: 1,
    name: "Dell XPS 15",
    category: "노트북",
    status: "활성",
    location: "본사 3층",
    assignedTo: "김철수",
    department: "개발팀",
    assignedDate: "2022-05-20",
    purchaseDate: "2022-03-15",
    purchasePrice: 2200000,
    currentValue: 1650000,
    nextMaintenanceDate: "2023-03-15",
    image: "/images/assets/laptop.jpg",
    serialNumber: "SN12345678",
    model: "XPS 15 9510",
    manufacturer: "Dell",
    supplier: "(주)델컴퓨터",
    warrantyExpiry: "2025-05-14",
    notes: "개발팀 리더용 노트북",
    specifications: {
      cpu: "Intel Core i7-11800H",
      ram: "32GB DDR4",
      storage: "1TB SSD",
      display: "15.6인치 4K UHD",
      os: "Windows 11 Pro",
      graphics: "NVIDIA GeForce RTX 3050 Ti",
    },
    maintenanceHistory: [
      {
        id: 1,
        date: "2023-01-10",
        type: "정기점검",
        description: "하드웨어 점검 및 소프트웨어 업데이트",
        cost: 150000,
        technician: "박기술자",
      },
      {
        id: 2,
        date: "2023-06-15",
        type: "수리",
        description: "배터리 교체",
        cost: 250000,
        technician: "이수리",
      },
    ],
    documents: [
      { id: 1, name: "구매 영수증.pdf", size: "1.2MB", date: "2022-05-15" },
      { id: 2, name: "사용 설명서.pdf", size: "5.8MB", date: "2022-05-15" },
      { id: 3, name: "보증서.pdf", size: "0.8MB", date: "2022-05-15" },
    ],
  };

  // 할당 모달 열기 시 자산 정보 설정
  const openAssignModal = (e) => {
    if (e) e.stopPropagation();
    setAssignmentFormData((prev) => ({
      ...prev,
      assetId: id,
      assetName: asset.name,
    }));
    setShowAssignModal(true);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  // 섹션 컴포넌트 - 재사용 가능한 정보 섹션
  const InfoSection = ({ title, children, className = "", icon: Icon }) => (
    <div
      className={`rounded-lg border border-border bg-card p-6 shadow-sm ${className}`}
    >
      <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center">
        {Icon && <Icon className="mr-2 text-primary h-4 w-4" />}
        {title}
      </h3>
      {children}
    </div>
  );

  // 정보 항목 컴포넌트 - 라벨과 값을 표시
  const InfoItem = ({ label, value, icon: Icon }) => (
    <div className="mb-4">
      <p className="text-sm text-muted-foreground flex items-center mb-1">
        {Icon && <Icon className="mr-1.5 h-3 w-3" />}
        {label}
      </p>
      <p className="text-foreground font-medium">{value}</p>
    </div>
  );

  // 할당 모달 컴포넌트
  const AssignModal = () => {
    if (!showAssignModal) return null;

    // 모달 내부 클릭 시 이벤트 전파 중지
    const handleModalContentClick = (e) => {
      e.stopPropagation();
    };

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={() => setShowAssignModal(false)}
      >
        <div
          className="bg-background rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          onClick={handleModalContentClick}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground flex items-center">
                <FaExchangeAlt className="mr-2 text-primary" />
                자산 할당
              </h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAssignmentSubmit}>
              <div className="mb-6">
                <div className="flex items-center p-4 bg-primary/5 rounded-md border border-primary/20 mb-6">
                  <FaInfoCircle className="text-primary mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{asset.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {asset.serialNumber} • {asset.category}
                    </p>
                  </div>
                </div>

                {/* AssignmentSection 컴포넌트 사용 */}
                <AssignmentSection
                  isInForm={true}
                  formData={assignmentFormData}
                  handleChange={handleAssignmentChange}
                />
              </div>

              <div className="border-t border-border pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAssignModal(false);
                  }}
                  className="px-4 py-2 rounded-md border border-input bg-background hover:bg-muted transition-colors flex items-center"
                >
                  <FaTimes className="mr-2 h-4 w-4" />
                  취소
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md ${getButtonVariantClass(
                    "primary"
                  )} flex items-center`}
                  disabled={isSubmitting}
                  onClick={(e) => e.stopPropagation()}
                >
                  {isSubmitting ? (
                    <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                  ) : (
                    <FaSave className="mr-2 h-4 w-4" />
                  )}
                  할당 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageContainer title={asset.name}>
      {/* 할당 모달 */}
      <AssignModal />

      {/* 상단 정보 카드 */}
      <div className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 shadow-sm border border-primary/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{asset.name}</h1>
            <div className="flex items-center mt-2">
              <span
                className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(
                  asset.status
                )}`}
              >
                {asset.status}
              </span>
              <span className="mx-2 text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                {asset.category}
              </span>
              <span className="mx-2 text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                {asset.serialNumber}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to={`/assets/edit/${id}`}
              className={`${getButtonVariantClass(
                "primary"
              )} inline-flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium transition-colors`}
            >
              <FaEdit className="mr-2 -ml-1 h-4 w-4" />
              편집
            </Link>
            <button
              className={`${getButtonVariantClass(
                "danger"
              )} inline-flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium transition-colors`}
            >
              <FaTrash className="mr-2 -ml-1 h-4 w-4" />
              삭제
            </button>
          </div>
        </div>
      </div>

      {/* 액션 버튼 그룹 */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={openAssignModal}
          className={`${getButtonVariantClass(
            "success"
          )} inline-flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium transition-colors`}
        >
          <FaExchangeAlt className="mr-2 -ml-1 h-4 w-4" />
          할당
        </button>
        <Link
          to={`/maintenance/add?assetId=${id}`}
          className={`${getButtonVariantClass(
            "outline"
          )} inline-flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium transition-colors hover:bg-primary/5`}
        >
          <FaTools className="mr-2 -ml-1 h-4 w-4" />
          유지보수
        </Link>
        <Link
          to={`/assets/history?assetId=${id}`}
          className={`${getButtonVariantClass(
            "outline"
          )} inline-flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium transition-colors hover:bg-primary/5`}
        >
          <FaHistory className="mr-2 -ml-1 h-4 w-4" />
          이력
        </Link>
        <button
          className={`${getButtonVariantClass(
            "outline"
          )} inline-flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium transition-colors hover:bg-primary/5`}
        >
          <FaQrcode className="mr-2 -ml-1 h-4 w-4" />
          QR 코드
        </button>
        <button
          className={`${getButtonVariantClass(
            "outline"
          )} inline-flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium transition-colors hover:bg-primary/5`}
        >
          <FaDownload className="mr-2 -ml-1 h-4 w-4" />
          내보내기
        </button>
        <button
          className={`${getButtonVariantClass(
            "outline"
          )} inline-flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium transition-colors hover:bg-primary/5`}
        >
          <FaPrint className="mr-2 -ml-1 h-4 w-4" />
          인쇄
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 왼쪽 컬럼 - 기본 정보 */}
        <div className="md:col-span-2 space-y-6">
          {/* 기본 정보 */}
          <InfoSection title="기본 정보" icon={FaInfoCircle}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem label="자산명" value={asset.name} />
              <InfoItem label="카테고리" value={asset.category} />
              <InfoItem label="시리얼 번호" value={asset.serialNumber} />
              <InfoItem label="모델명" value={asset.model} />
              <InfoItem label="제조사" value={asset.manufacturer} />
              <InfoItem
                label="상태"
                value={
                  <span
                    className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(
                      asset.status
                    )}`}
                  >
                    {asset.status}
                  </span>
                }
              />
            </div>
          </InfoSection>

          {/* 구매 정보 */}
          <InfoSection title="구매 정보" icon={FaMoneyBillWave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem
                label="구매일"
                value={formatDate(asset.purchaseDate)}
                icon={FaCalendarAlt}
              />
              <InfoItem
                label="구매 가격"
                value={formatCurrency(asset.purchasePrice)}
                icon={FaMoneyBillWave}
              />
              <InfoItem
                label="공급업체"
                value={asset.supplier}
                icon={FaBuilding}
              />
              <InfoItem
                label="보증 만료일"
                value={formatDate(asset.warrantyExpiry)}
                icon={FaCalendarAlt}
              />
              <InfoItem
                label="현재 가치"
                value={formatCurrency(asset.currentValue)}
                icon={FaMoneyBillWave}
              />
              <InfoItem
                label="감가상각률"
                value={`${Math.round(
                  ((asset.purchasePrice - asset.currentValue) /
                    asset.purchasePrice) *
                    100
                )}%`}
              />
            </div>
          </InfoSection>

          {/* 위치 및 할당 정보 */}
          <InfoSection title="위치 및 할당 정보" icon={FaMapMarkerAlt}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem
                label="위치"
                value={asset.location}
                icon={FaMapMarkerAlt}
              />
              <InfoItem
                label="할당 대상"
                value={asset.assignedTo}
                icon={FaUser}
              />
              <InfoItem
                label="부서"
                value={asset.department}
                icon={FaBuilding}
              />
              <InfoItem
                label="할당일"
                value={formatDate(asset.assignedDate)}
                icon={FaCalendarAlt}
              />
            </div>
          </InfoSection>

          {/* 사양 */}
          <InfoSection title="사양" icon={FaMicrochip}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(asset.specifications).map(([key, value]) => (
                <InfoItem key={key} label={key.toUpperCase()} value={value} />
              ))}
            </div>
          </InfoSection>

          {/* 비고 */}
          <InfoSection title="비고" icon={FaClipboardList}>
            <div className="bg-muted/30 p-4 rounded-md border border-border">
              <p className="text-foreground whitespace-pre-line">
                {asset.notes}
              </p>
            </div>
          </InfoSection>
        </div>

        {/* 오른쪽 컬럼 - 사이드바 정보 */}
        <div className="space-y-6">
          {/* 자산 이미지 */}
          <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground flex items-center">
              <FaQrcode className="mr-2 text-primary h-4 w-4" />
              자산 이미지
            </h2>
            <div className="aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden border border-border">
              {asset.image ? (
                <img
                  src={asset.image || "/placeholder.svg"}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=300&width=300";
                    e.target.alt = "이미지를 불러올 수 없습니다";
                  }}
                />
              ) : (
                <div className="text-muted-foreground text-sm">이미지 없음</div>
              )}
            </div>
            <div className="mt-4">
              <button
                className={`${getButtonVariantClass(
                  "outline"
                )} w-full px-4 py-2 rounded-md text-sm inline-flex items-center justify-center transition-colors hover:bg-primary/5`}
              >
                <FaDownload className="mr-1.5 h-3.5 w-3.5" />
                이미지 다운로드
              </button>
            </div>
          </div>

          {/* 유지보수 이력 */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <FaTools className="mr-2 text-primary h-4 w-4" />
                유지보수 이력
              </h3>
              <Link
                to={`/maintenance/history?assetId=${id}`}
                className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
              >
                모두 보기
              </Link>
            </div>
            <div className="space-y-4">
              {asset.maintenanceHistory.map((item) => (
                <div
                  key={item.id}
                  className="border border-border rounded-md p-4 bg-card hover:bg-muted/20 transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-foreground font-medium">{item.type}</p>
                    <p className="text-sm text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                      {formatDate(item.date)}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.description}
                  </p>
                  <div className="flex justify-between mt-1 text-sm">
                    <p className="text-muted-foreground flex items-center">
                      <FaUser className="mr-1 h-3 w-3" />
                      {item.technician}
                    </p>
                    <p className="text-foreground font-medium">
                      {formatCurrency(item.cost)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 문서 */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <FaFileAlt className="mr-2 text-primary h-4 w-4" />
                문서
              </h3>
              <button className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                추가
              </button>
            </div>
            <div className="space-y-3">
              {asset.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex justify-between items-center p-3 border border-border rounded-md hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center">
                    <FaFileAlt className="h-8 w-8 text-muted-foreground mr-3" />
                    <div>
                      <p className="text-foreground font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.size} • {doc.date}
                      </p>
                    </div>
                  </div>
                  <button className="text-primary hover:text-primary/80 transition-colors p-2 hover:bg-primary/5 rounded-full">
                    <FaDownload className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* QR 코드 */}
          <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground flex items-center">
              <FaQrcode className="mr-2 text-primary h-4 w-4" />
              QR 코드
            </h2>
            <div className="aspect-square bg-white rounded-md flex items-center justify-center p-4 border border-border">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=asset:${asset.id}`}
                alt="자산 QR 코드"
                className="w-full h-full"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                className={`${getButtonVariantClass(
                  "outline"
                )} flex-1 px-4 py-2 rounded-md text-sm inline-flex items-center justify-center transition-colors hover:bg-primary/5`}
              >
                <FaDownload className="mr-1.5 h-3.5 w-3.5" />
                다운로드
              </button>
              <button
                className={`${getButtonVariantClass(
                  "outline"
                )} flex-1 px-4 py-2 rounded-md text-sm inline-flex items-center justify-center transition-colors hover:bg-primary/5`}
              >
                <FaPrint className="mr-1.5 h-3.5 w-3.5" />
                인쇄
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default AssetsDetail;
