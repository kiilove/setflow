const MaintenanceStats = ({
  totalMaintenance,
  scheduledCount,
  inProgressCount,
  completedCount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">
          총 유지보수
        </h3>
        <p className="text-2xl font-bold">{totalMaintenance}</p>
      </div>
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">
          진행 예정
        </h3>
        <p className="text-2xl font-bold">{scheduledCount}</p>
      </div>
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">
          진행 중
        </h3>
        <p className="text-2xl font-bold">{inProgressCount}</p>
      </div>
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">완료</h3>
        <p className="text-2xl font-bold">{completedCount}</p>
      </div>
    </div>
  );
};

export default MaintenanceStats;
