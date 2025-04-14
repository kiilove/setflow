"use client";
import { useNavigate } from "react-router-dom";
import { useMessageContext } from "../../context/MessageContext";
import ListLayout from "./ListLayout";
import ListHeader from "./ListHeader";
import ListActions from "./ListActions";
import ListContent from "./ListContent";
import ListPagination from "./ListPagination";
import DataFilter from "./DataFilter";
import useListState from "./useListState";

/**
 * 목록 페이지 템플릿 컴포넌트
 * 모든 목록 페이지의 공통 로직과 레이아웃을 처리합니다.
 */
const ListPageTemplate = ({
  // 기본 설정
  title,
  entityName,

  // 데이터 관련
  fetchData,
  data,
  loading,
  setLoading,

  // 테이블/그리드 설정
  columns,
  renderGridItem,
  renderActions,

  // 필터 관련
  filterOptions,
  onFilterChange,
  onResetFilters,
  searchFilter,
  additionalFilter,

  // 정렬 관련
  sortFunction,
  defaultSortBy = "name",
  defaultSortOrder = "asc",

  // 액션 관련
  onDelete,
  onDeleteMultiple,

  // 헤더 액션
  headerActions,

  // 추가 컴포넌트
  statsComponent,
  emptyStateComponent,

  // 추가 설정
  defaultViewMode = "table",
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  searchPlaceholder,

  // 클릭 핸들러
  onItemClick,
}) => {
  const navigate = useNavigate();
  const { showConfirm, showSuccess, showError } = useMessageContext();

  // 목록 상태 관리 훅 사용
  const {
    searchTerm,
    sortBy,
    sortOrder,
    viewMode,
    selectedItems,
    currentPage,
    pageSize,
    currentPageData,
    totalItems,
    totalPages,
    setSearchTerm,
    handleSort,
    setViewMode,
    handlePageChange,
    handlePageSizeChange,
    handleSelectItem,
    handleSelectAll,
    setSelectedItems,
  } = useListState({
    data,
    searchFilter,
    additionalFilter,
    sortFunction,
    defaultSortBy,
    defaultSortOrder,
    defaultViewMode,
    defaultPageSize,
  });

  // 항목 삭제 핸들러
  const handleDeleteItem = async (id, name) => {
    const confirmed = await showConfirm(
      `${entityName} 삭제`,
      `"${name}" ${entityName}을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      {
        confirmText: "삭제",
        cancelText: "취소",
        confirmVariant: "error",
      }
    );

    if (confirmed) {
      try {
        setLoading(true);
        await onDelete(id, name);
        showSuccess(
          "삭제 완료",
          `${entityName}이(가) 성공적으로 삭제되었습니다.`
        );
        // fetchData() 호출 제거 - 이미 onDelete 내부에서 상태 업데이트
      } catch (error) {
        console.error(`${entityName} 삭제 중 오류 발생:`, error);
        showError("삭제 오류", `${entityName} 삭제에 실패했습니다.`);
      } finally {
        setLoading(false);
      }
    }
  };

  // 선택한 항목 삭제 핸들러
  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;

    const confirmed = await showConfirm(
      `선택한 ${entityName} 삭제`,
      `선택한 ${selectedItems.length}개의 ${entityName}을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      {
        confirmText: "삭제",
        cancelText: "취소",
        confirmVariant: "error",
      }
    );

    if (confirmed) {
      try {
        setLoading(true);
        await onDeleteMultiple(selectedItems);
        setSelectedItems([]);
        showSuccess(
          "삭제 완료",
          `${selectedItems.length}개의 ${entityName}이(가) 성공적으로 삭제되었습니다.`
        );
        // fetchData() 호출 제거 - 이미 onDeleteMultiple 내부에서 상태 업데이트
      } catch (error) {
        console.error(`${entityName} 삭제 중 오류 발생:`, error);
        showError("삭제 오류", `${entityName} 삭제에 실패했습니다.`);
      } finally {
        setLoading(false);
      }
    }
  };

  // 항목 클릭 핸들러
  const handleItemClick = (item) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <ListLayout
      header={<ListHeader title={title} actions={headerActions} />}
      stats={statsComponent}
      filter={
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <DataFilter
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filterOptions}
            onFilterChange={onFilterChange}
            onResetFilters={() => {
              setSearchTerm("");
              onResetFilters && onResetFilters();
            }}
            searchPlaceholder={searchPlaceholder || `${entityName} 검색...`}
          />
          <ListActions
            viewMode={viewMode}
            onViewChange={setViewMode}
            selectedItems={selectedItems}
            onDeleteSelected={handleDeleteSelected}
          />
        </div>
      }
      content={
        <ListContent
          viewMode={viewMode}
          data={currentPageData}
          columns={columns}
          renderGridItem={renderGridItem}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
          onSelectAll={handleSelectAll}
          sortConfig={{ key: sortBy, direction: sortOrder }}
          onSort={handleSort}
          loading={loading}
          emptyMessage={`검색 결과가 없습니다.`}
          onItemClick={handleItemClick}
          clickableColumn={{ id: "name", handler: handleItemClick }}
          renderActions={
            renderActions
              ? (item) => renderActions(item, handleDeleteItem)
              : undefined
          }
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          totalItems={totalItems}
        />
      }
      pagination={
        <ListPagination
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={pageSizeOptions}
        />
      }
      emptyState={data.length === 0 && !loading && emptyStateComponent}
      loading={loading}
      itemCount={data.length}
    />
  );
};

export default ListPageTemplate;
