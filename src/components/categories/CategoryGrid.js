"use client";
import { Link } from "react-router-dom";
import { Edit, Trash2, List } from "lucide-react";
import {
  getButtonVariantClass,
  getStatusColorClass,
} from "../../utils/themeUtils";

const CategoryGrid = ({
  categories,
  renderCategoryIcon,
  formatResidualValue,
  handleDelete,
}) => {
  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">표시할 카테고리가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="rounded-lg border border-border bg-card p-4 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-full ${
                category.iconColor || "bg-gray-100"
              } ${category.iconTextColor || "text-gray-500"}`}
            >
              {renderCategoryIcon(category)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-foreground">
                  {category.name}
                </h3>
                <div className="flex space-x-1">
                  <div className="group relative">
                    <Link
                      to={`/categories/edit/${category.id}`}
                      className="text-primary hover:text-primary/80 p-1.5 rounded-md hover:bg-primary/5"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      카테고리 편집
                    </div>
                  </div>

                  <div className="group relative">
                    <button
                      className="text-destructive hover:text-destructive/80 p-1.5 rounded-md hover:bg-destructive/5"
                      onClick={() => handleDelete(category.id, category.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      카테고리 삭제
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                {category.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(
                    "active"
                  )}`}
                >
                  자산 {category.count || 0}개
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(
                    "pending"
                  )}`}
                >
                  사양 필드 {category.specFieldsCount || 0}개
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(
                    "processing"
                  )}`}
                >
                  감가상각 {category.depreciation?.years || 0}년/
                  {formatResidualValue(category.depreciation)}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to={`/assets?category=${category.name}`}
              className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${getButtonVariantClass(
                "secondary"
              )}`}
            >
              <List className="mr-1.5 h-3.5 w-3.5" />
              자산 보기
            </Link>
            <Link
              to={`/categories/template/${category.id}`}
              className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${getButtonVariantClass(
                "outline"
              )}`}
            >
              <Edit className="mr-1.5 h-3.5 w-3.5" />
              사양 템플릿
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;
