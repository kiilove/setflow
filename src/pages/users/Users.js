import PageContainer from "../../components/common/PageContainer";
import { getStatusColorClass } from "../../utils/themeUtils";

const Users = () => {
  return (
    <PageContainer title="사용자 관리">
      <p className="text-muted-foreground mb-4">
        사용자 목록을 관리하는 페이지입니다.
      </p>
      <div className="rounded-lg border border-border bg-card p-6 shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                이름
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                이메일
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                역할
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                상태
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                작업
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              {
                name: "홍길동",
                email: "hong@example.com",
                role: "관리자",
                status: "활성",
              },
              {
                name: "김철수",
                email: "kim@example.com",
                role: "편집자",
                status: "활성",
              },
              {
                name: "이영희",
                email: "lee@example.com",
                role: "사용자",
                status: "비활성",
              },
              {
                name: "박지민",
                email: "park@example.com",
                role: "사용자",
                status: "활성",
              },
              {
                name: "최민수",
                email: "choi@example.com",
                role: "편집자",
                status: "활성",
              },
            ].map((user, index) => (
              <tr key={index} className="hover:bg-muted/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  <button className="text-primary hover:text-primary/80 mr-3">
                    편집
                  </button>
                  <button className="text-destructive hover:text-destructive/80">
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
};

export default Users;
