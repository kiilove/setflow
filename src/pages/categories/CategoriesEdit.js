"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSave, FaTimes, FaArrowLeft } from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";

const CategoriesEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const categoryId = Number.parseInt(id);

  // 카테고리 데이터 (실제로는 API에서 가져올 것)
  const categoriesData = [
    {
      id: 1,
      name: "데스크탑",
      description: "데스크톱 컴퓨터",
      depreciation: {
        method: "straight-line", // 정액법
        years: 4,
        residualValueType: "percentage", // percentage 또는 fixed
        residualValue: 10, // 퍼센트 또는 원
      },
    },
    {
      id: 2,
      name: "노트북",
      description: "노트북 컴퓨터",
      depreciation: {
        method: "straight-line",
        years: 3,
        residualValueType: "fixed",
        residualValue: 1000,
      },
    },
    {
      id: 3,
      name: "모니터",
      description: "모니터 및 디스플레이",
      depreciation: {
        method: "straight-line",
        years: 5,
        residualValueType: "percentage",
        residualValue: 0,
      },
    },
    {
      id: 4,
      name: "모바일기기",
      description: "태블릿, 스마트폰 등",
      depreciation: {
        method: "straight-line",
        years: 2,
        residualValueType: "fixed",
        residualValue: 1000,
      },
    },
    {
      id: 5,
      name: "주변기기",
      description: "키보드, 마우스 등",
      depreciation: {
        method: "straight-line",
        years: 3,
        residualValueType: "percentage",
        residualValue: 0,
      },
    },
    {
      id: 6,
      name: "사무기기",
      description: "프린터, 스캐너, 복사기 등",
      depreciation: {
        method: "straight-line",
        years: 5,
        residualValueType: "fixed",
        residualValue: 1000,
      },
    },
    {
      id: 7,
      name: "서버",
      description: "서버 장비",
      depreciation: {
        method: "straight-line",
        years: 5,
        residualValueType: "percentage",
        residualValue: 15,
      },
    },
    {
      id: 8,
      name: "네트워크장비",
      description: "라우터, 스위치, 액세스 포인트 등",
      depreciation: {
        method: "straight-line",
        years: 4,
        residualValueType: "fixed",
        residualValue: 1000,
      },
    },
    {
      id: 9,
      name: "소프트웨어",
      description: "운영체제, 응용프로그램, 라이센스 등",
      depreciation: {
        method: "straight-line",
        years: 3,
        residualValueType: "fixed",
        residualValue: 0,
      },
    },
    {
      id: 10,
      name: "가구",
      description: "책상, 의자, 캐비닛 등",
      depreciation: {
        method: "straight-line",
        years: 7,
        residualValueType: "percentage",
        residualValue: 20,
      },
    },
    {
      id: 11,
      name: "기타",
      description: "기타 자산",
      depreciation: {
        method: "straight-line",
        years: 5,
        residualValueType: "fixed",
        residualValue: 1000,
      },
    },
  ];

  // 감가상각 방법 옵션
  const depreciationMethods = [
    { value: "straight-line", label: "정액법 (Straight-Line)" },
    { value: "declining-balance", label: "정률법 (Declining Balance)" },
    { value: "sum-of-years-digits", label: "연수합계법 (Sum-of-Years-Digits)" },
    {
      value: "units-of-production",
      label: "생산량비례법 (Units of Production)",
    },
  ];

  // 상태 관리
  const [category, setCategory] = useState({
    name: "",
    description: "",
    depreciation: {
      method: "straight-line",
      years: 5,
      residualValueType: "percentage",
      residualValue: 10,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 카테고리 데이터 로드
  useEffect(() => {
    // 실제로는 API 호출로 대체
    const foundCategory = categoriesData.find((cat) => cat.id === categoryId);
    if (foundCategory) {
      setCategory(foundCategory);
    } else {
      setError("카테고리를 찾을 수 없습니다.");
    }
    setLoading(false);
  }, [categoryId]);

  // 입력 필드 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 감가상각 필드 변경 처리
  const handleDepreciationChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      depreciation: {
        ...prev.depreciation,
        [name]:
          name === "years" || name === "residualValue"
            ? name === "residualValue" &&
              prev.depreciation.residualValueType === "fixed"
              ? Number.parseInt(value)
              : name === "years"
              ? Number.parseInt(value)
              : Number.parseFloat(value)
            : value,
      },
    }));
  };

  // 잔존가치 유형 변경 처리
  const handleResidualValueTypeChange = (type) => {
    setCategory((prev) => ({
      ...prev,
      depreciation: {
        ...prev.depreciation,
        residualValueType: type,
        // 유형이 변경되면 기본값으로 설정
        residualValue: type === "percentage" ? 10 : 1000,
      },
    }));
  };

  // 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    // 실제로는 API 호출로 데이터 저장
    console.log("저장된 카테고리:", category);
    // 저장 후 카테고리 목록으로 이동
    navigate("/categories");
  };

  if (loading) {
    return (
      <PageContainer title="카테고리 편집">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="카테고리 편집">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate("/categories")}
          className={`flex items-center gap-2 ${getButtonVariantClass(
            "outline"
          )}`}
        >
          <FaArrowLeft /> 카테고리 목록으로 돌아가기
        </button>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={`카테고리 편집: ${category.name}`}>
      <div className="mb-6">
        <button
          onClick={() => navigate("/categories")}
          className={`flex items-center gap-2 ${getButtonVariantClass(
            "outline"
          )}`}
        >
          <FaArrowLeft /> 카테고리 목록으로 돌아가기
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 기본 정보 */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium border-b border-border pb-2">
                  기본 정보
                </h3>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    카테고리 이름 <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={category.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    설명
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={category.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* 감가상각 설정 */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium border-b border-border pb-2">
                  감가상각 설정
                </h3>
                <div>
                  <label
                    htmlFor="method"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    감가상각 방법 <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="method"
                    name="method"
                    value={category.depreciation.method}
                    onChange={handleDepreciationChange}
                    className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {depreciationMethods.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.depreciation.method === "straight-line" &&
                      "정액법: 자산의 가치가 매년 동일한 금액으로 감가상각됩니다."}
                    {category.depreciation.method === "declining-balance" &&
                      "정률법: 자산의 장부가치에 일정 비율을 곱하여 감가상각됩니다."}
                    {category.depreciation.method === "sum-of-years-digits" &&
                      "연수합계법: 자산의 내용연수 합계를 기준으로 감가상각됩니다."}
                    {category.depreciation.method === "units-of-production" &&
                      "생산량비례법: 자산의 총 예상 생산량에 대한 실제 생산량 비율로 감가상각됩니다."}
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="years"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    내용연수 (년) <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    id="years"
                    name="years"
                    value={category.depreciation.years}
                    onChange={handleDepreciationChange}
                    min={1}
                    max={50}
                    required
                    className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    자산의 예상 사용 기간을 년 단위로 입력하세요.
                  </p>
                </div>

                {/* 잔존가치 유형 선택 */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    잔존가치 유형 <span className="text-destructive">*</span>
                  </label>
                  <div className="flex space-x-4 mb-3">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="residualValueType"
                        checked={
                          category.depreciation.residualValueType ===
                          "percentage"
                        }
                        onChange={() =>
                          handleResidualValueTypeChange("percentage")
                        }
                        className="h-4 w-4 text-primary border-border focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-foreground">
                        퍼센트 (%)
                      </span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="residualValueType"
                        checked={
                          category.depreciation.residualValueType === "fixed"
                        }
                        onChange={() => handleResidualValueTypeChange("fixed")}
                        className="h-4 w-4 text-primary border-border focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-foreground">
                        정액 (원)
                      </span>
                    </label>
                  </div>

                  {/* 잔존가치 입력 필드 - 유형에 따라 다르게 표시 */}
                  {category.depreciation.residualValueType === "percentage" ? (
                    <div>
                      <label
                        htmlFor="residualValue"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        잔존가치 (%) <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="number"
                        id="residualValue"
                        name="residualValue"
                        value={category.depreciation.residualValue}
                        onChange={handleDepreciationChange}
                        min={0}
                        max={100}
                        step="0.1"
                        required
                        className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        내용연수 종료 후 자산의 예상 잔존가치를 원가 대비
                        백분율로 입력하세요.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="residualValue"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        잔존가치 (원){" "}
                        <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="number"
                        id="residualValue"
                        name="residualValue"
                        value={category.depreciation.residualValue}
                        onChange={handleDepreciationChange}
                        min={0}
                        required
                        className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        내용연수 종료 후 자산의 예상 잔존가치를 원 단위로
                        입력하세요.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 px-6 py-4 flex justify-end gap-2 border-t border-border">
            <button
              type="button"
              onClick={() => navigate("/categories")}
              className={`flex items-center gap-1 ${getButtonVariantClass(
                "outline"
              )}`}
            >
              <FaTimes className="h-4 w-4" /> 취소
            </button>
            <button
              type="submit"
              className={`flex items-center gap-1 ${getButtonVariantClass(
                "primary"
              )}`}
            >
              <FaSave className="h-4 w-4" /> 저장
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};

export default CategoriesEdit;
