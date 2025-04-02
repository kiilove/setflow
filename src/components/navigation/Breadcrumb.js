import { Link, useLocation } from "react-router-dom";
import { getBreadcrumbsForPath } from "../../routes";
import { FaChevronRight } from "react-icons/fa";

const Breadcrumb = () => {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbsForPath(location.pathname);

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex theme-transition" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 text-sm">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={breadcrumb.id} className="flex items-center">
              {index > 0 && (
                <FaChevronRight className="mx-1 h-3 w-3 text-muted-foreground" />
              )}

              {isLast ? (
                <span className="text-foreground font-medium">
                  {breadcrumb.title}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {breadcrumb.title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
