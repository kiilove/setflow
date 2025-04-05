"use client";
import { Link } from "react-router-dom";
import { Search, Plus, Grid, List } from "lucide-react";
import { getButtonVariantClass } from "../../utils/themeUtils";

const CategorySearch = ({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="w-full sm:w-auto flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="카테고리 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="flex gap-2">
        <div className="flex rounded-md shadow-sm">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-l-md border ${
              viewMode === "grid"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border"
            }`}
            aria-label="그리드 보기"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-r-md border ${
              viewMode === "list"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border"
            }`}
            aria-label="리스트 보기"
          >
            <List className="h-4 w-4" />
          </button>
        </div>

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
    </div>
  );
};

export default CategorySearch;
