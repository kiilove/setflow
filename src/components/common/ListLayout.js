import PageContainer from "./PageContainer";

/**
 * 목록 페이지의 공통 레이아웃 컴포넌트
 * @param {Object} props
 * @param {React.ReactNode} props.header - 헤더 컴포넌트
 * @param {React.ReactNode} props.filter - 필터 컴포넌트
 * @param {React.ReactNode} props.content - 컨텐츠 컴포넌트
 * @param {React.ReactNode} props.pagination - 페이지네이션 컴포넌트
 * @param {React.ReactNode} props.stats - 통계 컴포넌트 (선택적)
 * @param {React.ReactNode} props.emptyState - 데이터가 없을 때 표시할 컴포넌트 (선택적)
 * @param {boolean} props.loading - 로딩 상태
 * @param {number} props.itemCount - 항목 수
 */
const ListLayout = ({
  header,
  filter,
  content,
  pagination,
  stats,
  emptyState,
  loading,
  itemCount,
}) => {
  return (
    <PageContainer>
      <div className="space-y-6">
        {/* 헤더 */}
        {header}

        {/* 통계 (있는 경우) */}
        {stats && stats}

        {/* 필터 */}
        {filter}

        {/* 빈 상태 (데이터가 없고 로딩 중이 아닌 경우) */}
        {itemCount === 0 && !loading && emptyState}

        {/* 컨텐츠 */}
        {content}

        {/* 페이지네이션 */}
        {pagination}
      </div>
    </PageContainer>
  );
};

export default ListLayout;
