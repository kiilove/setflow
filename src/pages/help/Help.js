import PageContainer from "../../components/common/PageContainer"

const Help = () => {
  return (
    <PageContainer>
      <p className="text-slate-300">
        도움말 페이지입니다. 여기서 애플리케이션 사용 방법에 대한 정보를 확인할 수 있습니다.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-lg border border-slate-700/30 bg-slate-800/50 p-4 shadow-md">
            <h3 className="mb-2 text-xl font-semibold text-white">도움말 {i}</h3>
            <p className="text-slate-400">이것은 예시 도움말입니다.</p>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}

export default Help

