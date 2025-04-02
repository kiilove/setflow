import PageContainer from "../../components/common/PageContainer"

const Products = () => {
  return (
    <PageContainer>
      <p className="text-slate-300">제품 목록을 관리하는 페이지입니다.</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            name: "스마트폰",
            category: "전자제품",
            price: "₩1,200,000",
            image: "/placeholder.svg?height=100&width=100",
          },
          { name: "노트북", category: "전자제품", price: "₩2,500,000", image: "/placeholder.svg?height=100&width=100" },
          { name: "헤드폰", category: "전자제품", price: "₩350,000", image: "/placeholder.svg?height=100&width=100" },
          { name: "티셔츠", category: "의류", price: "₩35,000", image: "/placeholder.svg?height=100&width=100" },
          { name: "청바지", category: "의류", price: "₩75,000", image: "/placeholder.svg?height=100&width=100" },
          { name: "운동화", category: "의류", price: "₩120,000", image: "/placeholder.svg?height=100&width=100" },
          { name: "커피 머신", category: "가전", price: "₩450,000", image: "/placeholder.svg?height=100&width=100" },
          { name: "블렌더", category: "가전", price: "₩85,000", image: "/placeholder.svg?height=100&width=100" },
          { name: "토스터", category: "가전", price: "₩65,000", image: "/placeholder.svg?height=100&width=100" },
        ].map((product, i) => (
          <div key={i} className="rounded-lg border border-slate-700/30 bg-slate-800/50 p-4 shadow-md">
            <div className="flex items-center space-x-4">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="h-16 w-16 rounded-md bg-slate-700"
              />
              <div>
                <h3 className="mb-1 text-xl font-semibold text-white">{product.name}</h3>
                <p className="text-sm text-slate-400">{product.category}</p>
                <p className="text-lg font-medium text-white">{product.price}</p>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="rounded-md bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700">
                상세 보기
              </button>
              <button className="rounded-md bg-slate-700 px-3 py-1 text-sm text-white hover:bg-slate-600">편집</button>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}

export default Products

