import PageContainer from "../../components/common/PageContainer";

const UsersPermissions = () => {
  return (
    <PageContainer title="사용자 권한 관리">
      <p className="text-muted-foreground mb-4">
        사용자 권한을 관리하는 페이지입니다.
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
                역할
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                대시보드
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                사용자 관리
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                문서
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                제품
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              {
                name: "관리자",
                role: "관리자",
                dashboard: true,
                users: true,
                documents: true,
                products: true,
              },
              {
                name: "편집자",
                role: "편집자",
                dashboard: true,
                users: false,
                documents: true,
                products: true,
              },
              {
                name: "사용자",
                role: "사용자",
                dashboard: true,
                users: false,
                documents: false,
                products: false,
              },
            ].map((user, index) => (
              <tr key={index} className="hover:bg-muted/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  <input
                    type="checkbox"
                    defaultChecked={user.dashboard}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  <input
                    type="checkbox"
                    defaultChecked={user.users}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  <input
                    type="checkbox"
                    defaultChecked={user.documents}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  <input
                    type="checkbox"
                    defaultChecked={user.products}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
};

export default UsersPermissions;
