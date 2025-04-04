"use client";

import { Link } from "react-router-dom";
import {
  FaBoxOpen,
  FaChartBar,
  FaTools,
  FaExclamationTriangle,
  FaArrowRight,
} from "react-icons/fa";

const DashboardStats = ({ assetStats }) => {
  return (
    <>
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card text-card-foreground rounded-lg shadow-md p-4 border border-border theme-transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground theme-transition">
                총 자산
              </p>
              <h3 className="text-2xl font-bold text-foreground theme-transition">
                {assetStats.total}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-primary/10">
              <FaBoxOpen className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/assets"
              className="text-sm text-primary hover:text-primary/80 flex items-center"
            >
              자산 목록 보기
              <FaArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg shadow-md p-4 border border-border theme-transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground theme-transition">
                사용 중인 자산
              </p>
              <h3 className="text-2xl font-bold text-foreground theme-transition">
                {assetStats.active}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-green-500/10">
              <FaChartBar className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-muted rounded-full h-2.5 theme-transition">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{
                  width: `${(assetStats.active / assetStats.total) * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1 theme-transition">
              전체 자산의{" "}
              {Math.round((assetStats.active / assetStats.total) * 100)}%
            </p>
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg shadow-md p-4 border border-border theme-transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground theme-transition">
                유지보수 중
              </p>
              <h3 className="text-2xl font-bold text-foreground theme-transition">
                {assetStats.maintenance}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-yellow-500/10">
              <FaTools className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/maintenance"
              className="text-sm text-primary hover:text-primary/80 flex items-center"
            >
              유지보수 일정 보기
              <FaArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-lg shadow-md p-4 border border-border theme-transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground theme-transition">
                비활성 자산
              </p>
              <h3 className="text-2xl font-bold text-foreground theme-transition">
                {assetStats.inactive}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-red-500/10">
              <FaExclamationTriangle className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-muted rounded-full h-2.5 theme-transition">
              <div
                className="bg-red-500 h-2.5 rounded-full"
                style={{
                  width: `${(assetStats.inactive / assetStats.total) * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1 theme-transition">
              전체 자산의{" "}
              {Math.round((assetStats.inactive / assetStats.total) * 100)}%
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardStats;
