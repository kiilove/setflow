import { Link } from "react-router-dom";
import { List, Plus } from "lucide-react";
import { getButtonVariantClass } from "../../utils/themeUtils";

const CategoryEmptyState = () => {
  return (
    <div className="text-center py-12 border border-dashed border-border rounded-lg">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <List className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground">
        등록된 카테고리가 없습니다
      </h3>
      <p className="text-muted-foreground mt-2 mb-4">
        새 카테고리를 추가하여 자산을 효과적으로 관리하세요.
      </p>
      <Link
        to="/categories/add"
        className={`${getButtonVariantClass(
          "primary"
        )} inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors`}
      >
        <Plus className="mr-2 -ml-1 h-4 w-4" />
        카테고리 추가
      </Link>
    </div>
  );
};

export default CategoryEmptyState;
