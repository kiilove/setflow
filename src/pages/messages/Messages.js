import PageContainer from "../../components/common/PageContainer"

const Messages = () => {
  return (
    <PageContainer>
      <p className="text-slate-300">메시지 관리 페이지입니다. 여기서 메시지를 관리할 수 있습니다.</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-lg border border-slate-700/30 bg-slate-800/50 p-4 shadow-md">
            <h3 className="mb-2 text-xl font-semibold text-white">메시지 {i}</h3>
            <p className="text-slate-400">이것은 예시 메시지입니다.</p>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}

export default Messages

