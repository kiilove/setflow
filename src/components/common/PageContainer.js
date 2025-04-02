import { useLocation } from "react-router-dom";
import Breadcrumb from "../navigation/Breadcrumb";

const PageContainer = ({ title, children, showBreadcrumb = true }) => {
  const location = useLocation();

  return (
    <div className="container mx-auto pb-8 theme-transition">
      {showBreadcrumb && (
        <div className="mb-4">
          <Breadcrumb path={location.pathname} />
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4 text-foreground theme-transition">
        {title}
      </h1>
      <div className="theme-transition">{children}</div>
    </div>
  );
};

export default PageContainer;
