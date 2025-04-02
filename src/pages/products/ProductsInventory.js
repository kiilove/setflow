import PageContainer from "../../components/common/PageContainer"

const ProductsInventory = () => {
  return (
    <PageContainer>
      <p className="text-slate-300">제품 재고를 관리하는 페이지입니다.</p>
      <div className="rounded-lg border border-slate-700/30 bg-slate-800/50 p-6 shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead>
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
              >
                제품명
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
              >
                카테고리
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
              >
                가격
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
              >
                재고
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
              >
                상태
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
              >
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {[
              { name: "스마트폰", category: "전자제품", price: "₩1,200,000", stock: 15, status: "판매중" },
              { name: "노트북", category: "전자제품", price: "₩2,500,000", stock: 8, status: "판매중" },
              { name: "헤드폰", category: "전자제품", price: "₩350,000", stock: 0, status: "품절" },
              { name: "티셔츠", category: "의류", price: "₩35,000", stock: 120, status: "판매중" },
              { name: "청바지", category: "의류", price: "₩75,000", stock: 45, status: "판매중" },
              { name: "운동화", category: "의류", price: "₩120,000", stock: 3, status: "판매중" },
            ].map((product, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === "판매중" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  <button className="text-indigo-400 hover:text-indigo-300 mr-3">편집</button>
                  <button className="text-red-400 hover:text-red-300">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  )
}

export default ProductsInventory

