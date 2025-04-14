import { Layers, Clock, Users } from "lucide-react";

/**
 * 카테고리 통계 컴포넌트
 * 카테고리 관련 주요 통계를 표시합니다.
 */
const CategoryStats = ({
  categoriesCount,
  totalAssets,
  totalDepreciationYears,
  groupsCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div className="bg-card border border-border rounded-lg p-4 flex items-center">
        <div className="p-3 rounded-full bg-primary/10 text-primary mr-4">
          <Layers className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">카테고리 수</p>
          <h3 className="text-2xl font-bold">{categoriesCount}</h3>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 flex items-center">
        <div className="p-3 rounded-full bg-primary/10 text-primary mr-4">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">카테고리 그룹 수</p>
          <h3 className="text-2xl font-bold">{groupsCount || 0}</h3>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 flex items-center">
        <div className="p-3 rounded-full bg-primary/10 text-primary mr-4">
          <Clock className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">평균 감가상각 기간</p>
          <h3 className="text-2xl font-bold">{totalDepreciationYears}년</h3>
        </div>
      </div>
    </div>
  );
};

export default CategoryStats;
