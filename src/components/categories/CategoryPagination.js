"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategoryPagination = ({
  currentPage,
  totalPages,
  handlePageChange,
  totalItems,
  indexOfFirstItem,
  indexOfLastItem,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center mt-4">
      <div className="text-sm text-muted-foreground">
        총 {totalItems}개 항목 중 {indexOfFirstItem + 1}-
        {Math.min(indexOfLastItem, totalItems)}개 표시
      </div>
      <div className="flex space-x-1">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md border border-border bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-1 rounded-md border ${
                currentPage === pageNum
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md border border-border bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CategoryPagination;
