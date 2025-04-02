import PageContainer from "../../components/common/PageContainer"

const ProductsCategories = () => {
  return (
    <PageContainer>
      <p className="text-slate-300">제품 카테고리를 관리하는 페이지입니다.</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {["전자제품", "의류", "식품", "가구", "도서", "스포츠"].map((category, i) => (
          <div key={i} className="rounded-lg border border-slate-700/30 bg-slate-800/50 p-4 shadow-md">
            <h3 className="mb-2 text-xl font-semibold text-white">{category}</h3>
            <p className="text-slate-400">이 카테고리에는 {Math.floor(Math.random() * 100)}개의 제품이 있습니다.</p>
            <div className="mt-4 flex space-x-2">
              <button className="rounded-md bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700">
                편집
              </button>
              <button className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700">삭제</button>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}

export default ProductsCategories

