import { Link } from "react-router-dom";
import {
  FaChartBar,
  FaChartPie,
  FaChartLine,
  FaTools,
  FaEdit,
} from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";

const Reports = () => {
  // 예시 보고서 데이터
  const reportCategories = [
    {
      id: "assets",
      title: "자산 보고서",
      description: "자산 현황, 분포, 가치에 대한 보고서",
      icon: FaChartBar,
      path: "/reports/assets",
      color: "bg-primary",
    },
    {
      id: "depreciation",
      title: "감가상각 보고서",
      description: "자산 감가상각 및 현재 가치에 대한 보고서",
      icon: FaChartPie,
      path: "/reports/depreciation",
      color: "bg-primary",
    },
    {
      id: "maintenance",
      title: "유지보수 보고서",
      description: "자산 유지보수 이력 및 비용에 대한 보고서",
      icon: FaTools,
      path: "/reports/maintenance",
      color: "bg-amber-500 dark:bg-amber-600",
    },
    {
      id: "trends",
      title: "추세 분석 보고서",
      description: "자산 취득, 폐기, 비용 추세에 대한 보고서",
      icon: FaChartLine,
      path: "/reports/trends",
      color: "bg-emerald-500 dark:bg-emerald-600",
    },
    {
      id: "custom",
      title: "사용자 정의 보고서",
      description: "맞춤형 보고서 생성 및 관리",
      icon: FaEdit,
      path: "/reports/custom",
      color: "bg-purple-500 dark:bg-purple-600",
    },
  ];

  // 최근 생성된 보고서 (예시 데이터)
  const recentReports = [
    {
      id: 1,
      title: "2023년 2분기 자산 현황 보고서",
      type: "자산 보고서",
      createdBy: "김관리자",
      createdAt: "2023-07-05",
      format: "PDF",
    },
    {
      id: 2,
      title: "IT 장비 감가상각 보고서",
      type: "감가상각 보고서",
      createdBy: "이재무",
      createdAt: "2023-06-20",
      format: "Excel",
    },
    {
      id: 3,
      title: "상반기 유지보수 비용 분석",
      type: "유지보수 보고서",
      createdBy: "박기술자",
      createdAt: "2023-06-15",
      format: "PDF",
    },
  ];

  return (
    <PageContainer title="보고서">
      <p className="text-muted-foreground mb-6">
        자산 관리 시스템의 다양한 보고서를 생성하고 관리할 수 있습니다. 보고서
        유형을 선택하여 시작하세요.
      </p>

      {/* 보고서 카테고리 */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5 mb-8">
        {reportCategories.map((category) => (
          <Link
            key={category.id}
            to={category.path}
            className="rounded-lg border border-border bg-card p-4 shadow-md hover:bg-accent transition-colors"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`${category.color} p-3 rounded-lg mb-3`}>
                <category.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {category.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* 최근 생성된 보고서 */}
      <div className="rounded-lg border border-border bg-card p-4 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-foreground">
            최근 생성된 보고서
          </h3>
          <Link
            to="/reports/history"
            className="text-sm text-primary hover:text-primary/80"
          >
            모두 보기
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  보고서명
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  유형
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  생성자
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  생성일
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  형식
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
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {report.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {report.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {report.createdBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {report.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {report.format}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    <div className="flex space-x-2">
                      <button className="text-primary hover:text-primary/80">
                        보기
                      </button>
                      <button className="text-primary hover:text-primary/80">
                        다운로드
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 보고서 생성 가이드 */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="mb-2 text-xl font-semibold text-foreground">
            보고서 생성 방법
          </h3>
          <p className="text-muted-foreground">
            원하는 보고서 유형을 선택하고 필요한 매개변수를 설정하여 맞춤형
            보고서를 생성할 수 있습니다.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="mb-2 text-xl font-semibold text-foreground">
            보고서 내보내기
          </h3>
          <p className="text-muted-foreground">
            생성된 보고서는 PDF, Excel, CSV 등 다양한 형식으로 내보내기가
            가능합니다.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-md">
          <h3 className="mb-2 text-xl font-semibold text-foreground">
            정기 보고서 설정
          </h3>
          <p className="text-muted-foreground">
            주간, 월간, 분기별 등 정기적으로 생성되는 보고서를 설정하여 자동으로
            받아볼 수 있습니다.
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default Reports;
