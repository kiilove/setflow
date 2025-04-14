"use client";

import React from "react";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";
import { useFirestore } from "../../hooks/useFirestore";
import { useMessageContext } from "../../context/MessageContext";
import * as Icons from "lucide-react";
import { Edit, FileEdit, ArrowLeft, Trash2 } from "lucide-react";

const CategoriesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocument, deleteDocument } = useFirestore("categories");
  const { showConfirm, showSuccess, showError } = useMessageContext();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 카테고리 데이터 로드
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const data = await getDocument(id);

        if (!data) {
          throw new Error("카테고리를 찾을 수 없습니다.");
        }

        setCategory(data);
      } catch (err) {
        console.error("카테고리 로딩 오류:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, getDocument]);

  // 카테고리 삭제 핸들러
  const handleDelete = async () => {
    const confirmed = await showConfirm(
      "카테고리 삭제",
      `"${category.name}" 카테고리를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      {
        confirmText: "삭제",
        cancelText: "취소",
        confirmVariant: "error",
      }
    );

    if (confirmed) {
      try {
        await deleteDocument(id);
        showSuccess(
          "카테고리 삭제 완료",
          "카테고리가 성공적으로 삭제되었습니다."
        );
        navigate("/categories");
      } catch (error) {
        console.error("카테고리 삭제 중 오류가 발생했습니다:", error);
        showError("삭제 오류", "카테고리 삭제에 실패했습니다.");
      }
    }
  };

  // 아이콘 렌더링 함수
  const renderCategoryIcon = (iconName) => {
    if (iconName && Icons[iconName]) {
      return React.createElement(Icons[iconName], {
        className: "h-6 w-6",
      });
    }
    return <Icons.Package className="h-6 w-6" />;
  };

  // 잔존가치 표시 형식
  const formatResidualValue = (depreciation) => {
    if (!depreciation) return "-";
    if (depreciation.residualValueType === "percentage") {
      return `${depreciation.residualValue}%`;
    } else {
      return `${depreciation.residualValue.toLocaleString()}원`;
    }
  };

  // 감가상각 방법 표시 형식
  const formatDepreciationMethod = (method) => {
    switch (method) {
      case "straight-line":
        return "정액법 (Straight-Line)";
      case "declining-balance":
        return "정률법 (Declining Balance)";
      case "sum-of-years-digits":
        return "연수합계법 (Sum-of-Years-Digits)";
      case "units-of-production":
        return "생산량비례법 (Units of Production)";
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <PageContainer title="카테고리 상세 정보">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-muted-foreground">로딩 중...</span>
        </div>
      </PageContainer>
    );
  }

  if (error || !category) {
    return (
      <PageContainer title="카테고리 상세 정보">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground">
            카테고리를 찾을 수 없습니다
          </h3>
          <p className="text-muted-foreground mt-2">
            {error || "요청하신 카테고리 ID가 존재하지 않습니다."}
          </p>
          <Link
            to="/categories"
            className={`mt-4 inline-flex items-center px-4 py-2 rounded-md ${getButtonVariantClass(
              "primary"
            )}`}
          >
            카테고리 목록으로 돌아가기
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={`카테고리 상세 정보: ${category.name}`}>
      {/* 상단 액션 버튼 */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/categories"
          className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${getButtonVariantClass(
            "outline"
          )}`}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          목록으로 돌아가기
        </Link>
        <div className="flex space-x-2">
          <Link
            to={`/categories/template/${id}`}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${getButtonVariantClass(
              "secondary"
            )}`}
          >
            <FileEdit className="mr-1.5 h-4 w-4" />
            사양 템플릿 편집
          </Link>
          <Link
            to={`/categories/edit/${id}`}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${getButtonVariantClass(
              "primary"
            )}`}
          >
            <Edit className="mr-1.5 h-4 w-4" />
            카테고리 편집
          </Link>
          <button
            onClick={handleDelete}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${getButtonVariantClass(
              "destructive"
            )}`}
          >
            <Trash2 className="mr-1.5 h-4 w-4" />
            카테고리 삭제
          </button>
        </div>
      </div>

      {/* 카테고리 기본 정보 */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div
              className={`p-3 rounded-full mr-4 ${
                category.iconColor || "bg-gray-100"
              } ${category.iconTextColor || "text-gray-500"}`}
            >
              {renderCategoryIcon(category.icon)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {category.name}
              </h2>
              {category.group && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mt-1">
                  {category.group}
                </span>
              )}
            </div>
          </div>

          {category.description && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                설명
              </h3>
              <p className="text-foreground">{category.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* 감가상각 정보 */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            감가상각 정보
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                감가상각 방법
              </h4>
              <p className="text-foreground">
                {formatDepreciationMethod(category.depreciation?.method)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                내용연수
              </h4>
              <p className="text-foreground">
                {category.depreciation?.years || 0}년
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                잔존가치 유형
              </h4>
              <p className="text-foreground">
                {category.depreciation?.residualValueType === "percentage"
                  ? "퍼센트 (%)"
                  : "정액 (원)"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                잔존가치
              </h4>
              <p className="text-foreground">
                {formatResidualValue(category.depreciation)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 사양 필드 정보 */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">사양 필드</h3>
        </div>
        <div className="p-6">
          {category.specFields && category.specFields.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.specFields.map((field, index) => (
                <div
                  key={index}
                  className="border border-border rounded-md p-4"
                >
                  <h4 className="font-medium text-foreground">{field.label}</h4>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">필드 ID:</span>{" "}
                      <span>{field.id || "-"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">필드 유형:</span>{" "}
                      <span className="capitalize">{field.type || "text"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-border rounded-md">
              <p className="text-muted-foreground">
                정의된 사양 필드가 없습니다. '사양 템플릿 편집' 버튼을 클릭하여
                필드를 추가하세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default CategoriesDetail;
