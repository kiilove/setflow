import PageContainer from "../../../components/common/PageContainer";

const LoadingState = () => {
  return (
    <PageContainer title="자산 로딩 중...">
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">
          자산 정보를 불러오는 중입니다...
        </p>
      </div>
    </PageContainer>
  );
};

export default LoadingState;
