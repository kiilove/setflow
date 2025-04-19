"use client";

import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AssetsEmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 p-3 rounded-full bg-primary/10">
        <Plus className="h-10 w-10 text-primary" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        등록된 자산이 없습니다
      </h3>
      <p className="text-muted-foreground mb-4 max-w-sm">
        새로운 자산을 등록하여 체계적인 자산 관리를 시작해보세요.
      </p>
      <button
        onClick={() => navigate("/assets/add")}
        className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <Plus className="mr-1.5 h-4 w-4" />
        자산 등록
      </button>
    </div>
  );
};

export default AssetsEmptyState;
