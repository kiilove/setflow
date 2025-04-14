import { Users, UserCheck, Building } from "lucide-react";

/**
 * 사용자 통계 컴포넌트
 * 사용자 관련 주요 통계를 표시합니다.
 */
const UserStats = ({ usersCount, activeCount, departmentsCount }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div className="bg-card border border-border rounded-lg p-4 flex items-center">
        <div className="p-3 rounded-full bg-primary/10 text-primary mr-4">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">전체 사용자</p>
          <h3 className="text-2xl font-bold">{usersCount}</h3>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 flex items-center">
        <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 mr-4">
          <UserCheck className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">재직 중</p>
          <h3 className="text-2xl font-bold">{activeCount}</h3>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 flex items-center">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mr-4">
          <Building className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">부서 수</p>
          <h3 className="text-2xl font-bold">{departmentsCount}</h3>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
