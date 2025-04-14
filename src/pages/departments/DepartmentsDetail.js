"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";
import { useFirestore } from "../../hooks/useFirestore";
import { useMessageContext } from "../../context/MessageContext";
import * as Icons from "lucide-react";
import { Edit, ArrowLeft, Trash2, Users, MapPin } from "lucide-react";

const DepartmentsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocument, deleteDocument } = useFirestore("departments");
  const { showConfirm, showSuccess, showError } = useMessageContext();

  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 위치 데이터 (실제로는 API에서 가져올 데이터)
  const locations = {
    loc1: "본사",
    loc2: "서울 지사",
    loc3: "부산 지사",
  };

  // 부서 데이터 로드
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setLoading(true);
        const data = await getDocument(id);

        if (!data) {
          throw new Error("부서를 찾을 수 없습니다.");
        }

        setDepartment(data);
      } catch (err) {
        console.error("부서 로딩 오류:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id, getDocument]);

  // 부서 삭제 핸들러
  const handleDelete = async () => {
    const confirmed = await showConfirm(
      "부서 삭제",
      `"${department.name}" 부서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      {
        confirmText: "삭제",
        cancelText: "취소",
        confirmVariant: "error",
      }
    );

    if (confirmed) {
      try {
        await deleteDocument(id);
        showSuccess("부서 삭제 완료", "부서가 성공적으로 삭제되었습니다.");
        navigate("/departments");
      } catch (error) {
        console.error("부서 삭제 중 오류가 발생했습니다:", error);
        showError("삭제 오류", "부서 삭제에 실패했습니다.");
      }
    }
  };

  // 아이콘 렌더링 함수
  const renderDepartmentIcon = (iconName) => {
    if (iconName && Icons[iconName]) {
      return React.createElement(Icons[iconName], {
        className: "h-6 w-6",
      });
    }
    return <Icons.Building className="h-6 w-6" />;
  };

  if (loading) {
    return (
      <PageContainer title="부서 상세 정보">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-muted-foreground">로딩 중...</span>
        </div>
      </PageContainer>
    );
  }

  if (error || !department) {
    return (
      <PageContainer title="부서 상세 정보">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground">
            부서를 찾을 수 없습니다
          </h3>
          <p className="text-muted-foreground mt-2">
            {error || "요청하신 부서 ID가 존재하지 않습니다."}
          </p>
          <Link
            to="/departments"
            className={`mt-4 inline-flex items-center px-4 py-2 rounded-md ${getButtonVariantClass(
              "primary"
            )}`}
          >
            부서 목록으로 돌아가기
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={`부서 상세 정보: ${department.name}`}>
      {/* 상단 액션 버튼 */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/departments"
          className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${getButtonVariantClass(
            "outline"
          )}`}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          목록으로 돌아가기
        </Link>
        <div className="flex space-x-2">
          <Link
            to={`/users?department=${department.name}`}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${getButtonVariantClass(
              "secondary"
            )}`}
          >
            <Users className="mr-1.5 h-4 w-4" />
            소속 사용자 보기
          </Link>
          <Link
            to={`/departments/edit/${id}`}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${getButtonVariantClass(
              "primary"
            )}`}
          >
            <Edit className="mr-1.5 h-4 w-4" />
            부서 편집
          </Link>
          <button
            onClick={handleDelete}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${getButtonVariantClass(
              "destructive"
            )}`}
          >
            <Trash2 className="mr-1.5 h-4 w-4" />
            부서 삭제
          </button>
        </div>
      </div>

      {/* 부서 기본 정보 */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div
              className={`p-3 rounded-full mr-4 ${
                department.iconColor || "bg-gray-100"
              } ${department.iconTextColor || "text-gray-500"}`}
            >
              {renderDepartmentIcon(department.icon)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {department.name}
              </h2>
            </div>
          </div>

          {department.description && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                설명
              </h3>
              <p className="text-foreground">{department.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* 부서 상세 정보 */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">부서 정보</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                위치
              </h4>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-green-500 mr-2" />
                <p className="text-foreground">
                  {department.locationId
                    ? locations[department.locationId] || "-"
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 소속 사용자 섹션 (실제 구현에서는 API 호출로 데이터 가져오기) */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden mt-6">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-semibold text-foreground">소속 사용자</h3>
          <Link
            to={`/users?department=${department.name}`}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${getButtonVariantClass(
              "secondary"
            )}`}
          >
            <Users className="mr-1.5 h-4 w-4" />
            모든 소속 사용자 보기
          </Link>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            이 부서에 소속된 사용자 정보를 불러오는 중입니다...
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default DepartmentsDetail;
