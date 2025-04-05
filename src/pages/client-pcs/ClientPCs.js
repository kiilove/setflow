"use client";

import { useState, useEffect } from "react";
import PageContainer from "../../components/common/PageContainer";
import {
  Laptop,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Cpu,
  MemoryStickIcon as Memory,
} from "lucide-react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import FancyLoadingLogo from "../../components/common/FancyLoadingLogo";
import FullScreenLoading from "../../components/common/FullScreenLoading";
import PageLoading from "../../components/common/PageLoading";

const ClientPCs = () => {
  const [clientPCs, setClientPCs] = useState([]);
  const [filteredPCs, setFilteredPCs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
    warning: 0,
    osDistribution: [],
    cpuUsage: [],
    memoryUsage: [],
    diskUsage: [],
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchClientPCs();
  }, []);

  useEffect(() => {
    if (clientPCs.length > 0) {
      let filtered = [...clientPCs];

      // 검색어 필터링
      if (searchTerm) {
        filtered = filtered.filter(
          (pc) =>
            pc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pc.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pc.department.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // 상태 필터링
      if (filterStatus !== "all") {
        filtered = filtered.filter((pc) => pc.status === filterStatus);
      }

      setFilteredPCs(filtered);
    }
  }, [searchTerm, filterStatus, clientPCs]);

  const fetchClientPCs = async () => {
    // 실제 구현에서는 API 호출로 대체
    setTimeout(() => {
      const dummyData = generateDummyData();
      setClientPCs(dummyData.pcs);
      setFilteredPCs(dummyData.pcs);
      setStats(dummyData.stats);
      setLoading(false);
    }, 1000);
  };

  const generateDummyData = () => {
    const departments = [
      "개발팀",
      "마케팅팀",
      "영업팀",
      "인사팀",
      "경영지원팀",
      "디자인팀",
    ];
    const osTypes = ["Windows 10", "Windows 11", "macOS", "Linux"];
    const pcs = [];

    // 더미 PC 데이터 생성
    for (let i = 1; i <= 100; i++) {
      const status =
        Math.random() > 0.2
          ? Math.random() > 0.15
            ? "online"
            : "warning"
          : "offline";
      const osType = osTypes[Math.floor(Math.random() * osTypes.length)];
      const department =
        departments[Math.floor(Math.random() * departments.length)];
      const cpuUsage = Math.floor(Math.random() * 100);
      const memoryUsage = Math.floor(Math.random() * 100);
      const diskUsage = Math.floor(Math.random() * 100);

      pcs.push({
        id: i,
        name: `PC-${i.toString().padStart(3, "0")}`,
        user: `사용자-${i}`,
        department,
        os: osType,
        status,
        lastSeen: new Date(
          Date.now() - Math.floor(Math.random() * 86400000 * 7)
        ).toISOString(),
        cpuUsage,
        memoryUsage,
        diskUsage,
        ipAddress: `192.168.1.${i % 255}`,
        macAddress: `00:1B:44:11:3A:${i
          .toString(16)
          .padStart(2, "0")
          .toUpperCase()}`,
      });
    }

    // 통계 데이터 계산
    const online = pcs.filter((pc) => pc.status === "online").length;
    const offline = pcs.filter((pc) => pc.status === "offline").length;
    const warning = pcs.filter((pc) => pc.status === "warning").length;

    // OS 분포 계산
    const osDistribution = osTypes.map((os) => ({
      type: os,
      value: pcs.filter((pc) => pc.os === os).length,
    }));

    // CPU, 메모리, 디스크 사용량 분포
    const cpuUsageData = [
      {
        range: "0-25%",
        count: pcs.filter((pc) => pc.cpuUsage >= 0 && pc.cpuUsage < 25).length,
      },
      {
        range: "25-50%",
        count: pcs.filter((pc) => pc.cpuUsage >= 25 && pc.cpuUsage < 50).length,
      },
      {
        range: "50-75%",
        count: pcs.filter((pc) => pc.cpuUsage >= 50 && pc.cpuUsage < 75).length,
      },
      {
        range: "75-100%",
        count: pcs.filter((pc) => pc.cpuUsage >= 75 && pc.cpuUsage <= 100)
          .length,
      },
    ];

    const memoryUsageData = [
      {
        range: "0-25%",
        count: pcs.filter((pc) => pc.memoryUsage >= 0 && pc.memoryUsage < 25)
          .length,
      },
      {
        range: "25-50%",
        count: pcs.filter((pc) => pc.memoryUsage >= 25 && pc.memoryUsage < 50)
          .length,
      },
      {
        range: "50-75%",
        count: pcs.filter((pc) => pc.memoryUsage >= 50 && pc.memoryUsage < 75)
          .length,
      },
      {
        range: "75-100%",
        count: pcs.filter((pc) => pc.memoryUsage >= 75 && pc.memoryUsage <= 100)
          .length,
      },
    ];

    const diskUsageData = [
      {
        range: "0-25%",
        count: pcs.filter((pc) => pc.diskUsage >= 0 && pc.diskUsage < 25)
          .length,
      },
      {
        range: "25-50%",
        count: pcs.filter((pc) => pc.diskUsage >= 25 && pc.diskUsage < 50)
          .length,
      },
      {
        range: "50-75%",
        count: pcs.filter((pc) => pc.diskUsage >= 50 && pc.diskUsage < 75)
          .length,
      },
      {
        range: "75-100%",
        count: pcs.filter((pc) => pc.diskUsage >= 75 && pc.diskUsage <= 100)
          .length,
      },
    ];

    return {
      pcs,
      stats: {
        total: pcs.length,
        online,
        offline,
        warning,
        osDistribution,
        cpuUsage: cpuUsageData,
        memoryUsage: memoryUsageData,
        diskUsage: diskUsageData,
      },
    };
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "online":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" /> 온라인
          </span>
        );
      case "offline":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            <Clock className="w-3 h-3 mr-1" /> 오프라인
          </span>
        );
      case "warning":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <AlertTriangle className="w-3 h-3 mr-1" /> 경고
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            알 수 없음
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // 차트 색상
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const USAGE_COLORS = {
    cpu: "#1890ff",
    memory: "#52c41a",
    disk: "#722ed1",
  };

  if (loading) {
    // return <PageLoading />;
    return <PageLoading />;
    // return <BounceLoadingLogo />;
  }

  return (
    <PageContainer title="클라이언트 PC 현황">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card text-card-foreground rounded-lg shadow-md p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">총 PC</p>
              <h3 className="text-2xl font-bold text-foreground">
                {stats.total}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-primary/10">
              <Laptop className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg shadow-md p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                온라인
              </p>
              <h3 className="text-2xl font-bold text-foreground">
                {stats.online}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-green-500/10">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{
                  width: `${(stats.online / stats.total) * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((stats.online / stats.total) * 100)}%
            </p>
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg shadow-md p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                오프라인
              </p>
              <h3 className="text-2xl font-bold text-foreground">
                {stats.offline}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-gray-500/10">
              <Clock className="h-6 w-6 text-gray-500" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-gray-500 h-2.5 rounded-full"
                style={{
                  width: `${(stats.offline / stats.total) * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((stats.offline / stats.total) * 100)}%
            </p>
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg shadow-md p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">경고</p>
              <h3 className="text-2xl font-bold text-foreground">
                {stats.warning}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-yellow-500/10">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-yellow-500 h-2.5 rounded-full"
                style={{
                  width: `${(stats.warning / stats.total) * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((stats.warning / stats.total) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border mb-6">
        <div className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="PC 이름, 사용자, 부서 검색..."
              className="pl-10 pr-4 py-2 w-full rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-40">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <select
                className="pl-10 pr-4 py-2 w-full rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">모든 상태</option>
                <option value="online">온라인</option>
                <option value="offline">오프라인</option>
                <option value="warning">경고</option>
              </select>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              onClick={() => fetchClientPCs()}
            >
              <RefreshCw className="h-4 w-4" />
              새로고침
            </button>
          </div>
        </div>
      </div>

      {/* PC 목록 테이블 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-medium text-foreground">
            클라이언트 PC 목록 ({filteredPCs.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  PC 이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  사용자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  부서
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  운영체제
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  리소스
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  마지막 접속
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPCs.slice(0, 10).map((pc) => (
                <tr key={pc.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    <div className="flex items-center">
                      <Laptop className="h-4 w-4 mr-2 text-primary" />
                      {pc.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {pc.ipAddress}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {pc.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {pc.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {pc.os}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(pc.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center">
                        <Cpu className="h-3 w-3 mr-1 text-blue-500" />
                        <div className="w-24 bg-muted rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              pc.cpuUsage > 80
                                ? "bg-red-500"
                                : pc.cpuUsage > 60
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${pc.cpuUsage}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs">{pc.cpuUsage}%</span>
                      </div>
                      <div className="flex items-center">
                        <Memory className="h-3 w-3 mr-1 text-green-500" />
                        <div className="w-24 bg-muted rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              pc.memoryUsage > 80
                                ? "bg-red-500"
                                : pc.memoryUsage > 60
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${pc.memoryUsage}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs">{pc.memoryUsage}%</span>
                      </div>
                      <div className="flex items-center">
                        <HardDrive className="h-3 w-3 mr-1 text-purple-500" />
                        <div className="w-24 bg-muted rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              pc.diskUsage > 80
                                ? "bg-red-500"
                                : pc.diskUsage > 60
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${pc.diskUsage}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs">{pc.diskUsage}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {formatDate(pc.lastSeen)}
                  </td>
                </tr>
              ))}
              {filteredPCs.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-sm text-center text-muted-foreground"
                  >
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border bg-muted/50 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            총 {filteredPCs.length}개 중 10개 표시
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-md bg-background border border-border text-sm">
              이전
            </button>
            <button className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm">
              1
            </button>
            <button className="px-3 py-1 rounded-md bg-background border border-border text-sm">
              2
            </button>
            <button className="px-3 py-1 rounded-md bg-background border border-border text-sm">
              3
            </button>
            <button className="px-3 py-1 rounded-md bg-background border border-border text-sm">
              다음
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ClientPCs;
