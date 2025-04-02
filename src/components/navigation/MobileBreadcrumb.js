import { useLocation } from "react-router-dom"
import { findRouteByPath } from "../../routes"

const MobileBreadcrumb = () => {
  const location = useLocation()
  const currentRoute = findRouteByPath(location.pathname)

  if (!currentRoute) return null

  return (
    <div className="md:hidden py-2 px-4 bg-slate-800/50 border-b border-slate-700/30">
      <h2 className="text-lg font-medium text-white">{currentRoute.title}</h2>
    </div>
  )
}

export default MobileBreadcrumb

