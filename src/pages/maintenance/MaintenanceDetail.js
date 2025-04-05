"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  PenToolIcon as Tool,
  AlertTriangle,
  CheckCircle,
  FileText,
  User,
  Package,
  Clipboard,
  DollarSign,
} from "lucide-react";
import PageContainer from "../../components/common/PageContainer";
import {
  getButtonVariantClass,
  getStatusColorClass,
} from "../../utils/themeUtils";
import { dataService } from "../../data/mockData";

const MaintenanceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        // 실제 구현에서는 API 호출
        const data = await dataService.getMaintenanceById(Number(id));

        if (data) {
          setMaintenance(data);
        } else {
          setError("유지보수 정보를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error(
          "유지보수 정보를 불러오는 중 오류가 발생했습니다:",
          error
        );
        setError("유지보수 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenance();
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("정말로 이 유지보수 기록을 삭제하시겠습니까?")) {
      // 실제 구현에서는 API 호출
      console.log(`유지보수 ID ${id} 삭제`);

      // 성공 시 목록 페이지로 이동
      navigate("/maintenance", {
        state: { message: "유지보수 기록이 삭제되었습니다." },
      });
    }
  };

  // 상태에 따른 색상 클래스 가져오기
  const getMaintenanceStatusClass = (status) => {
    switch (status) {
      case "예정":
        return getStatusColorClass("info");
      case "진행중":
        return getStatusColorClass("warning");
      case "완료":
        return getStatusColorClass("success");
      case "취소":
        return getStatusColorClass("destructive");
      default:
        return getStatusColorClass("default");
    }
  };

  // 우선순위에 따른 색상 클래스 가져오기
  const getPriorityColorClass = (priority) => {
    switch (priority) {
      case "높음":
        return getStatusColorClass("destructive");
      case "중간":
        return getStatusColorClass("warning");
      case "낮음":
        return getStatusColorClass("success");
      default:
        return getStatusColorClass("default");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-muted-foreground">
            유지보수 정보를 불러오는 중...
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
            onClick={() => navigate("/maintenance")}
            className="mt-2 px-4 py-2 bg-background border border-input rounded-md hover:bg-muted transition-colors"
          >
            유지보수 목록으로 돌아가기
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* 상단 헤더 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">유지보수 상세 정보</h1>
          <div className="flex gap-2">
            <Link
              to={`/maintenance/edit/${maintenance.id}`}
              className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
                "secondary"
              )}`}
            >
              <FileText className="h-4 w-4" />
              <span>수정</span>
            </Link>
            <button
              onClick={handleDelete}
              className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
                "destructive"
              )}`}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>삭제</span>
            </button>
          </div>
        </div>

        {/* 상태 배지 */}
        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMaintenanceStatusClass(
              maintenance.status
            )}`}
          >
            {maintenance.status === "완료" && (
              <CheckCircle className="mr-1 h-4 w-4" />
            )}
            {maintenance.status === "진행중" && (
              <Clock className="mr-1 h-4 w-4" />
            )}
            {maintenance.status === "예정" && (
              <Calendar className="mr-1 h-4 w-4" />
            )}
            {maintenance.status === "취소" && (
              <AlertTriangle className="mr-1 h-4 w-4" />
            )}
            {maintenance.status}
          </span>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColorClass(
              maintenance.priority
            )}`}
          >
            우선순위: {maintenance.priority}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
            {maintenance.type}
          </span>
        </div>

        {/* 메인 정보 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 자산 정보 */}
          <div className="bg-card rounded-lg shadow p-6 border border-border">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Package className="mr-2 h-5 w-5 text-primary" />
              자산 정보
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">자산 ID</p>
                <p className="font-medium">{maintenance.assetId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">자산명</p>
                <p className="font-medium">{maintenance.assetName}</p>
              </div>
              <div>
                <Link
                  to={`/assets/${maintenance.assetId}`}
                  className={`inline-flex items-center px-3 py-1 text-sm ${getButtonVariantClass(
                    "outline"
                  )}`}
                >
                  <Package className="mr-1.5 h-3.5 w-3.5" />
                  자산 상세 보기
                </Link>
              </div>
            </div>
          </div>

          {/* 기술자 정보 */}
          <div className="bg-card rounded-lg shadow p-6 border border-border">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              기술자 정보
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">기술자</p>
                <p className="font-medium">{maintenance.technician}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">연락처</p>
                <p className="font-medium">
                  {maintenance.technicianContact || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* 일정 정보 */}
          <div className="bg-card rounded-lg shadow p-6 border border-border">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              일정 정보
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">예정일</p>
                <p className="font-medium">{maintenance.scheduledDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">완료일</p>
                <p className="font-medium">
                  {maintenance.completedDate || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* 비용 정보 */}
          <div className="bg-card rounded-lg shadow p-6 border border-border">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-primary" />
              비용 정보
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">비용</p>
                <p className="font-medium">
                  {maintenance.cost
                    ? `₩${Number(maintenance.cost).toLocaleString()}`
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="bg-card rounded-lg shadow p-6 border border-border">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Clipboard className="mr-2 h-5 w-5 text-primary" />
            상세 정보
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">비고</p>
              <p className="mt-1">{maintenance.notes || "-"}</p>
            </div>
          </div>
        </div>

        {/* 작업 내역 */}
        {maintenance.status === "완료" && (
          <div className="bg-card rounded-lg shadow p-6 border border-border">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Tool className="mr-2 h-5 w-5 text-primary" />
              작업 내역
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">작업 내용</p>
                <p className="mt-1">
                  {maintenance.workDetails ||
                    "작업 내용이 기록되지 않았습니다."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="flex justify-end">
          <Link
            to="/maintenance"
            className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
              "outline"
            )}`}
          >
            <span>목록으로 돌아가기</span>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

export default MaintenanceDetail;
