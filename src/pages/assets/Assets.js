"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, History } from "lucide-react";
import { getStatusColorClass } from "../../utils/themeUtils";
import AssetCard from "./components/AssetCard";
import useEntityData from "../../hooks/useEntityData";
import ListPageTemplate from "../../components/common/ListPageTemplate";

const Assets = () => {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // 엔티티 데이터 관리 훅 사용
  const {
    data: assets,
    loading,
    setLoading,
    fetchData,
    deleteItem: deleteAsset,
    deleteMultipleItems: deleteMultipleAssets,
  } = useEntityData("assets");

  // 카테고리 목록 추출
  const categories = [
    ...new Set(assets.map((asset) => asset.category).filter(Boolean)),
  ];

  // 상태 목록 추출
  const statuses = [
    ...new Set(assets.map((asset) => asset.status).filter(Boolean)),
  ];

  // 검색 필터 함수
  const searchFilter = (asset, searchTerm) => {
    return (
      asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // 추가 필터 함수
  const additionalFilter = (asset) => {
    const matchesCategory = filterCategory
      ? asset.category === filterCategory
      : true;
    const matchesStatus = filterStatus ? asset.status === filterStatus : true;
    return matchesCategory && matchesStatus;
  };

  // 정렬 함수
  const sortFunction = (a, b, sortBy, sortOrder) => {
    let comparison = 0;

    if (sortBy === "name") {
      comparison = (a.name || "").localeCompare(b.name || "");
    } else if (sortBy === "category") {
      comparison = (a.category || "").localeCompare(b.category || "");
    } else if (sortBy === "status") {
      comparison = (a.status || "").localeCompare(b.status || "");
    } else if (sortBy === "location") {
      comparison = (a.location || "").localeCompare(b.location || "");
    } else if (sortBy === "assignedTo") {
      comparison = (a.assignedTo || "").localeCompare(b.assignedTo || "");
    } else if (sortBy === "purchaseDate") {
      const dateA = a.purchaseDate ? new Date(a.purchaseDate) : new Date(0);
      const dateB = b.purchaseDate ? new Date(b.purchaseDate) : new Date(0);
      comparison = dateA - dateB;
    } else if (sortBy === "purchasePrice") {
      const priceA = a.purchasePrice || 0;
      const priceB = b.purchasePrice || 0;
      comparison = priceA - priceB;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  };

  // 필터 변경 핸들러
  const handleFilterChange = (filterId, value) => {
    if (filterId === "category") {
      setFilterCategory(value);
    } else if (filterId === "status") {
      setFilterStatus(value);
    }
  };

  // 필터 초기화 핸들러
  const handleResetFilters = () => {
    setFilterCategory("");
    setFilterStatus("");
  };

  // 통화 포맷팅
  const formatCurrency = (value) => {
    if (!value && value !== 0) return "-";
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(value);
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      id: "name",
      header: "자산명",
      accessor: (asset) => asset.name || "-",
      sortable: true,
    },
    {
      id: "category",
      header: "카테고리",
      accessor: (asset) => asset.category || "-",
      sortable: true,
    },
    {
      id: "status",
      header: "상태",
      sortable: true,
      render: (asset) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(
            asset.status || "미지정"
          )}`}
        >
          {asset.status || "미지정"}
        </span>
      ),
    },
    {
      id: "location",
      header: "위치",
      accessor: (asset) => asset.location || "-",
      sortable: true,
    },
    {
      id: "assignedTo",
      header: "담당자",
      accessor: (asset) => asset.assignedTo || "-",
      sortable: true,
    },
    {
      id: "purchaseDate",
      header: "구매일",
      accessor: (asset) => formatDate(asset.purchaseDate),
      sortable: true,
    },
    {
      id: "purchasePrice",
      header: "구매가",
      accessor: (asset) => formatCurrency(asset.purchasePrice),
      sortable: true,
    },
  ];

  // 필터 정의
  const filterOptions = [
    {
      id: "category",
      label: "카테고리",
      value: filterCategory,
      options: categories.map((category) => ({
        label: category,
        value: category,
      })),
    },
    {
      id: "status",
      label: "상태",
      value: filterStatus,
      options: statuses.map((status) => ({ label: status, value: status })),
    },
  ];

  // 헤더 액션 정의
  const headerActions = [
    {
      icon: Plus,
      label: "자산 추가",
      to: "/assets/add",
      variant: "primary",
    },
    {
      icon: History,
      label: "자산 이력",
      to: "/assets/history",
      variant: "secondary",
    },
  ];

  // 자산 상세 페이지로 이동
  const handleAssetClick = (asset) => {
    navigate(`/assets/detail/${asset.id}`);
  };

  return (
    <ListPageTemplate
      // 기본 설정
      title="자산 관리"
      entityName="자산"
      // 데이터 관련
      data={assets}
      loading={loading}
      setLoading={setLoading}
      fetchData={fetchData}
      // 테이블/그리드 설정
      columns={columns}
      renderGridItem={(asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          onClick={() => navigate(`/assets/detail/${asset.id}`)}
          onDelete={(e) => {
            e.stopPropagation();
            deleteAsset(asset.id, asset.name);
          }}
          isSelected={false}
          onSelect={() => {}}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      )}
      // 필터 관련
      filterOptions={filterOptions}
      onFilterChange={handleFilterChange}
      onResetFilters={handleResetFilters}
      searchFilter={searchFilter}
      additionalFilter={additionalFilter}
      // 정렬 관련
      sortFunction={sortFunction}
      defaultSortBy="name"
      defaultSortOrder="asc"
      // 액션 관련
      onDelete={deleteAsset}
      onDeleteMultiple={deleteMultipleAssets}
      // 헤더 액션
      headerActions={headerActions}
      // 클릭 핸들러
      onItemClick={(asset) => navigate(`/assets/detail/${asset.id}`)}
      // 추가 설정
      defaultViewMode="table"
      searchPlaceholder="자산명, 카테고리, 위치 또는 담당자 검색..."
    />
  );
};

export default Assets;
