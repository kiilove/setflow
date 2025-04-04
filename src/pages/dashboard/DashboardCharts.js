"use client";

import { useEffect, useState } from "react";
import {
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
} from "recharts";

const DashboardCharts = ({
  assetTrends,
  maintenanceCosts,
  assetValueByCategory,
  assetAgeDistribution,
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 비용 포맷팅 함수
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // 자산 추이 데이터 변환 - 누적 영역 차트용
  const transformedAssetTrends = assetTrends.map((item) => ({
    month: item.month,
    활성: item.active,
    유지보수: item.maintenance,
    비활성: item.inactive,
  }));

  // 자산 가치 차트 데이터 준비
  const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

  // 자산 가치 데이터에 퍼센트 추가
  const totalValue = assetValueByCategory.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const assetValueWithPercent = assetValueByCategory.map((item) => ({
    ...item,
    percent: ((item.value / totalValue) * 100).toFixed(1),
  }));

  // 유지보수 비용 추세 분석 - 이동 평균 추가
  const maintenanceCostsWithTrend = [...maintenanceCosts];
  for (let i = 2; i < maintenanceCosts.length; i++) {
    const movingAvg =
      (maintenanceCosts[i].cost +
        maintenanceCosts[i - 1].cost +
        maintenanceCosts[i - 2].cost) /
      3;
    maintenanceCostsWithTrend[i].trend = movingAvg;
  }

  // 자산 연령 분포 데이터 - 시각적 개선
  const ageColors = {
    "1년 미만": "#4ade80",
    "1-2년": "#a3e635",
    "2-3년": "#facc15",
    "3-4년": "#fb923c",
    "4년 이상": "#f87171",
  };

  // 자산 연령 분포 데이터 변환 - 방사형 차트용
  const assetAgeRadial = assetAgeDistribution.map((item, index) => ({
    name: item.age,
    value: item.count,
    fill: Object.values(ageColors)[index % Object.values(ageColors).length],
  }));

  // 커스텀 툴팁 컴포넌트
  const CustomTooltip = ({
    active,
    payload,
    label,
    valuePrefix,
    valueSuffix,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border border-border rounded-md shadow-md">
          <p className="font-medium text-sm">{label}</p>
          {payload.map((entry, index) => (
            <p
              key={`item-${index}`}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {valuePrefix || ""}
              {entry.value.toLocaleString()}
              {valueSuffix || ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // 자산 가치 커스텀 툴팁
  const AssetValueTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 border border-border rounded-md shadow-md">
          <p className="font-medium text-sm">{data.category}</p>
          <p className="text-sm">{formatCurrency(data.value)}</p>
          <p className="text-xs text-muted-foreground">{data.percent}% 차지</p>
        </div>
      );
    }
    return null;
  };

  // 차트 클릭 핸들러
  const handlePieClick = (data, index) => {
    setActiveIndex(index);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 mb-6">
      {/* 자산 상태 추이 차트 - 누적 영역 차트로 변경 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
        <div className="p-4 border-b border-border theme-transition">
          <h3 className="text-lg font-medium text-foreground theme-transition">
            자산 상태 추이
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            시간 경과에 따른 자산 상태 분포 변화
          </p>
        </div>
        <div className="p-4">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={transformedAssetTrends}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="color활성" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient
                    id="color유지보수"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#facc15" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#facc15" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="color비활성" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip valueSuffix=" 대" />} />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area
                  type="monotone"
                  dataKey="활성"
                  stackId="1"
                  stroke="#4ade80"
                  fill="url(#color활성)"
                  fillOpacity={1}
                />
                <Area
                  type="monotone"
                  dataKey="유지보수"
                  stackId="1"
                  stroke="#facc15"
                  fill="url(#color유지보수)"
                  fillOpacity={1}
                />
                <Area
                  type="monotone"
                  dataKey="비활성"
                  stackId="1"
                  stroke="#f87171"
                  fill="url(#color비활성)"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              인사이트: 활성 자산은 꾸준히 증가하는 추세이며, 유지보수 중인
              자산은 연말에 증가하는 패턴을 보입니다.
            </p>
          </div>
        </div>
      </div>

      {/* 차트 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 유지보수 비용 차트 - 추세선 추가 */}
        <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
          <div className="p-4 border-b border-border theme-transition">
            <h3 className="text-lg font-medium text-foreground theme-transition">
              월별 유지보수 비용
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              월별 유지보수 비용과 3개월 이동 평균
            </p>
          </div>
          <div className="p-4">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={maintenanceCostsWithTrend}
                  margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${formatCurrency(value)}`,
                      "유지보수 비용",
                    ]}
                    labelFormatter={(label) => `${label} 유지보수 비용`}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar
                    dataKey="cost"
                    name="유지보수 비용"
                    fill="#4f46e5"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="trend"
                    name="3개월 이동평균"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                인사이트: 7월과 12월에 유지보수 비용이 가장 높으며, 연말로
                갈수록 비용이 증가하는 추세입니다.
              </p>
            </div>
          </div>
        </div>

        {/* 자산 가치 분포 차트 - 인터랙티브 파이 차트 */}
        <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
          <div className="p-4 border-b border-border theme-transition">
            <h3 className="text-lg font-medium text-foreground theme-transition">
              카테고리별 자산 가치
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              자산 유형별 가치 분포
            </p>
          </div>
          <div className="p-4">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={assetValueWithPercent}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="category"
                    onClick={handlePieClick}
                  >
                    {assetValueWithPercent.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<AssetValueTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                인사이트: 컴퓨터와 서버가 전체 자산 가치의 60% 이상을 차지하고
                있어 중점 관리가 필요합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 자산 연령 분포 차트 - 방사형 차트로 변경 */}
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
        <div className="p-4 border-b border-border theme-transition">
          <h3 className="text-lg font-medium text-foreground theme-transition">
            자산 연령 분포
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            자산 사용 기간별 분포 현황
          </p>
        </div>
        <div className="p-4">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="80%"
                barSize={20}
                data={assetAgeRadial}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  minAngle={15}
                  background
                  clockWise={true}
                  dataKey="value"
                  nameKey="name"
                  cornerRadius={10}
                  label={{
                    fill: "#666",
                    position: "insideStart",
                    fontSize: 12,
                  }}
                />
                <Legend
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ paddingLeft: "10px" }}
                />
                <Tooltip
                  formatter={(value, name) => [`${value}대`, name]}
                  labelFormatter={() => "자산 수"}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              인사이트: 1-2년 된 자산이 가장 많으며, 4년 이상 된 노후 자산은
              26대로 교체 계획이 필요합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 활성 파이 차트 조각 렌더링 함수
const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin((-midAngle * Math.PI) / 180);
  const cos = Math.cos((-midAngle * Math.PI) / 180);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        className="text-sm font-medium"
      >
        {payload.category}
      </text>
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        className="text-xs"
      >
        {`${formatCurrency(value)}`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
        className="text-xs"
      >
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

export default DashboardCharts;
