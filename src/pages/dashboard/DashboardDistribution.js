"use client";

const DashboardDistribution = ({
  categoryDistribution,
  locationDistribution,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 카테고리별 자산 분포 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
        <div className="p-4 border-b border-border theme-transition">
          <h3 className="text-lg font-medium text-foreground theme-transition">
            카테고리별 자산 분포
          </h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {categoryDistribution.map((category, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-foreground theme-transition">
                    {category.name}
                  </span>
                  <span className="text-sm text-foreground theme-transition">
                    {category.count}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 theme-transition">
                  <div
                    className={`h-2.5 rounded-full ${
                      index === 0
                        ? "bg-blue-500"
                        : index === 1
                        ? "bg-green-500"
                        : index === 2
                        ? "bg-yellow-500"
                        : index === 3
                        ? "bg-purple-500"
                        : "bg-gray-500"
                    }`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 theme-transition">
                  {category.percentage}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 위치별 자산 분포 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
        <div className="p-4 border-b border-border theme-transition">
          <h3 className="text-lg font-medium text-foreground theme-transition">
            위치별 자산 분포
          </h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {locationDistribution.map((location, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-foreground theme-transition">
                    {location.name}
                  </span>
                  <span className="text-sm text-foreground theme-transition">
                    {location.count}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 theme-transition">
                  <div
                    className={`h-2.5 rounded-full ${
                      index === 0
                        ? "bg-indigo-500"
                        : index === 1
                        ? "bg-pink-500"
                        : index === 2
                        ? "bg-cyan-500"
                        : index === 3
                        ? "bg-orange-500"
                        : "bg-teal-500"
                    }`}
                    style={{ width: `${location.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 theme-transition">
                  {location.percentage}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDistribution;
