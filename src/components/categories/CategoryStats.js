const CategoryStats = ({
  categoriesCount,
  totalAssets,
  totalDepreciationYears,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">
          총 카테고리
        </h3>
        <p className="text-2xl font-bold">{categoriesCount}</p>
      </div>
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">
          총 자산
        </h3>
        <p className="text-2xl font-bold">{totalAssets}</p>
      </div>
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">
          평균 감가상각 기간
        </h3>
        <p className="text-2xl font-bold">
          {totalDepreciationYears ? `${totalDepreciationYears}년` : "-"}
        </p>
      </div>
    </div>
  );
};

export default CategoryStats;
