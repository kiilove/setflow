"use client";
import { useNavigate } from "react-router-dom";
import { Plus, Map } from "lucide-react";
import useEntityData from "../../hooks/useEntityData";
import ListPageTemplate from "../../components/common/ListPageTemplate";
import { useMessageContext } from "../../context/MessageContext";

const Locations = () => {
  const navigate = useNavigate();
  const { showConfirm, showSuccess, showError } = useMessageContext();

  // 엔티티 데이터 관리 훅 사용
  const {
    data: locations,
    loading,
    setLoading,
    fetchData,
    deleteItem: deleteLocation,
    deleteMultipleItems: deleteMultipleLocations,
  } = useEntityData("locations");

  // 검색 필터 함수
  const searchFilter = (location, searchTerm) => {
    return (
      location.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // 정렬 함수
  const sortFunction = (a, b, sortBy, sortOrder) => {
    let comparison = 0;

    if (sortBy === "name") {
      comparison = (a.name || "").localeCompare(b.name || "");
    } else if (sortBy === "address") {
      comparison = (a.address || "").localeCompare(b.address || "");
    }

    return sortOrder === "asc" ? comparison : -comparison;
  };

  // 테이블 컬럼 정의 - 좌표값 컬럼 제거
  const columns = [
    {
      id: "name",
      header: "위치명",
      accessor: (location) => location.name || "-",
      sortable: true,
    },
    {
      id: "address",
      header: "주소",
      render: (location) => (
        <div>
          <div>{location.address}</div>
          {location.detail && (
            <div className="text-xs text-muted-foreground">
              {location.detail}
            </div>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      id: "description",
      header: "설명",
      accessor: (location) => location.description || "-",
    },
  ];

  // 헤더 액션 정의
  const headerActions = [
    {
      icon: Map,
      label: "지도 보기",
      to: "/locations/map",
      variant: "secondary",
    },
    {
      icon: Plus,
      label: "위치 추가",
      to: "/locations/add",
      variant: "primary",
    },
  ];

  return (
    <ListPageTemplate
      // 기본 설정
      title="위치 관리"
      entityName="위치"
      // 데이터 관련
      data={locations}
      loading={loading}
      setLoading={setLoading}
      fetchData={fetchData}
      // 테이블/그리드 설정
      columns={columns}
      renderGridItem={(location) => (
        <div
          key={location.id}
          className="bg-card border border-border rounded-lg shadow-sm hover:shadow transition-shadow overflow-hidden"
          onClick={() => navigate(`/locations/detail/${location.id}`)}
        >
          <div className="p-4">
            <h3 className="text-lg font-medium text-foreground">
              {location.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {location.address}
            </p>
            {location.detail && (
              <p className="text-xs text-muted-foreground">{location.detail}</p>
            )}

            {location.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {location.description}
              </p>
            )}
          </div>
        </div>
      )}
      // 필터 관련
      searchFilter={searchFilter}
      // 정렬 관련
      sortFunction={sortFunction}
      defaultSortBy="name"
      defaultSortOrder="asc"
      // 액션 관련
      onDelete={deleteLocation}
      onDeleteMultiple={deleteMultipleLocations}
      // 헤더 액션
      headerActions={headerActions}
      // 클릭 핸들러
      onItemClick={(location) => navigate(`/locations/detail/${location.id}`)}
      // 추가 설정
      defaultViewMode="table"
      searchPlaceholder="위치명, 주소 검색..."
    />
  );
};

export default Locations;
