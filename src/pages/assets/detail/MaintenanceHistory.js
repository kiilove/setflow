import { Link } from "react-router-dom";
import { FaTools, FaUser, FaPlus } from "react-icons/fa";

const MaintenanceHistory = ({
  maintenanceHistory = [],
  id,
  formatDate,
  formatCurrency,
}) => {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <FaTools className="mr-2 text-primary h-4 w-4" />
          유지보수 이력
        </h3>
        <div className="flex gap-2">
          <Link
            to={`/maintenance/add?assetId=${id}`}
            className="text-sm text-primary hover:text-primary/80 transition-colors font-medium flex items-center"
          >
            <FaPlus className="mr-1 h-3 w-3" />
            추가
          </Link>
          <Link
            to={`/maintenance/history?assetId=${id}`}
            className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            모두 보기
          </Link>
        </div>
      </div>

      {maintenanceHistory.length > 0 ? (
        <div className="space-y-4">
          {maintenanceHistory.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="border border-border rounded-md p-4 bg-card hover:bg-muted/20 transition-colors"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="text-foreground font-medium">
                  {item.type || "유지보수"}
                </p>
                <p className="text-sm text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                  {formatDate(item.date)}
                </p>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {item.description || "-"}
              </p>
              <div className="flex justify-between mt-1 text-sm">
                <p className="text-muted-foreground flex items-center">
                  <FaUser className="mr-1 h-3 w-3" />
                  {item.technician || item.user || "-"}
                </p>
                {item.cost !== undefined && (
                  <p className="text-foreground font-medium">
                    {formatCurrency(item.cost)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground text-center py-8 border border-dashed border-border rounded-md">
          유지보수 이력이 없습니다.
        </div>
      )}
    </div>
  );
};

export default MaintenanceHistory;
