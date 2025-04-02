"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaDownload, FaHistory, FaClipboardList } from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import { getStatusColorClass } from "../../utils/themeUtils";

const Maintenance = () => {
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState("current"); // 'current' 또는 'history'

  // 공통 상태
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 현재 유지보수 관련 상태
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("assetName");
  const [sortOrder, setSortOrder] = useState("asc");

  // 유지보수 이력 관련 상태
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [historySortBy, setHistorySortBy] = useState("date");
  const [historySortOrder, setHistorySortOrder] = useState("desc");

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 현재 유지보수 데이터 로딩 시뮬레이션
        setTimeout(() => {
          const mockRecords = [
            {
              id: 1,
              assetName: "노트북 Dell XPS 15",
              assetId: "AST-001",
              type: "정기점검",
              date: "2023-01-10",
              technician: "박기술자",
              status: "완료",
              cost: "₩50,000",
            },
            {
              id: 2,
              assetName: "프린터 HP LaserJet",
              assetId: "AST-003",
              type: "수리",
              date: "2023-02-15",
              technician: "이수리",
              status: "완료",
              cost: "₩120,000",
            },
            {
              id: 3,
              assetName: "서버 Dell PowerEdge",
              assetId: "AST-005",
              type: "업그레이드",
              date: "2023-03-20",
              technician: "김엔지니어",
              status: "완료",
              cost: "₩800,000",
            },
            {
              id: 4,
              assetName: "태블릿 iPad Pro",
              assetId: "AST-004",
              type: "수리",
              date: "2023-06-15",
              technician: "이수리",
              status: "진행중",
              cost: "₩150,000",
            },
            {
              id: 5,
              assetName: "노트북 MacBook Pro",
              assetId: "AST-012",
              type: "정기점검",
              date: "2023-07-05",
              technician: "박기술자",
              status: "예정",
              cost: "₩50,000",
            },
          ];
          setMaintenanceRecords(mockRecords);

          // 유지보수 이력 데이터
          const mockHistory = [
            {
              id: 1,
              assetName: "노트북 Dell XPS 15",
              assetId: "AST-001",
              type: "정기점검",
              date: "2022-08-15",
              technician: "박기술자",
              cost: "₩50,000",
              description: "하드웨어 점검 및 소프트웨어 업데이트",
            },
            {
              id: 2,
              assetName: "프린터 HP LaserJet",
              assetId: "AST-003",
              type: "수리",
              date: "2022-09-20",
              technician: "이수리",
              cost: "₩120,000",
              description: "용지 걸림 센서 교체",
            },
            {
              id: 3,
              assetName: "서버 Dell PowerEdge",
              assetId: "AST-005",
              type: "업그레이드",
              date: "2022-11-10",
              technician: "김엔지니어",
              cost: "₩800,000",
              description: "메모리 증설 및 RAID 구성 변경",
            },
            {
              id: 4,
              assetName: "노트북 Dell XPS 15",
              assetId: "AST-001",
              type: "수리",
              date: "2023-01-05",
              technician: "이수리",
              cost: "₩200,000",
              description: "키보드 교체",
            },
            {
              id: 5,
              assetName: "프린터 HP LaserJet",
              assetId: "AST-003",
              type: "정기점검",
              date: "2023-02-15",
              technician: "박기술자",
              cost: "₩50,000",
              description: "정기 유지보수 및 토너 교체",
            },
            {
              id: 6,
              assetName: "태블릿 iPad Pro",
              assetId: "AST-004",
              type: "수리",
              date: "2023-06-15",
              technician: "이수리",
              cost: "₩150,000",
              description: "배터리 교체",
            },
          ];
          setMaintenanceHistory(mockHistory);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error(
          "유지보수 데이터를 불러오는 중 오류가 발생했습니다:",
          error
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 탭 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // 정렬 처리 - 현재 유지보수
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // 정렬 처리 - 유지보수 이력
  const handleHistorySort = (column) => {
    if (historySortBy === column) {
      setHistorySortOrder(historySortOrder === "asc" ? "desc" : "asc");
    } else {
      setHistorySortBy(column);
      setHistorySortOrder("asc");
    }
  };

  // 검색 및 필터링된 현재 유지보수 목록
  const filteredRecords = maintenanceRecords.filter(
    (record) =>
      (record.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.assetId.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "" || record.status === filterStatus)
  );

  // 검색 및 필터링된 유지보수 이력 목록
  const filteredHistory = maintenanceHistory.filter(
    (history) =>
      (history.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        history.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
        history.assetId.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterType === "" || history.type === filterType)
  );

  // 정렬 - 현재 유지보수
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "assetName") {
      comparison = a.assetName.localeCompare(b.assetName);
    } else if (sortBy === "assetId") {
      comparison = a.assetId.localeCompare(b.assetId);
    } else if (sortBy === "type") {
      comparison = a.type.localeCompare(b.type);
    } else if (sortBy === "date") {
      comparison = new Date(a.date) - new Date(b.date);
    } else if (sortBy === "technician") {
      comparison = a.technician.localeCompare(b.technician);
    } else if (sortBy === "status") {
      comparison = a.status.localeCompare(b.status);
    } else if (sortBy === "cost") {
      const aCost = Number.parseInt(a.cost.replace(/[^\d]/g, ""));
      const bCost = Number.parseInt(b.cost.replace(/[^\d]/g, ""));
      comparison = aCost - bCost;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  // 정렬 - 유지보수 이력
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    let comparison = 0;

    if (historySortBy === "date") {
      comparison = new Date(a.date) - new Date(b.date);
    } else if (historySortBy === "assetName") {
      comparison = a.assetName.localeCompare(b.assetName);
    } else if (historySortBy === "assetId") {
      comparison = a.assetId.localeCompare(b.assetId);
    } else if (historySortBy === "type") {
      comparison = a.type.localeCompare(b.type);
    } else if (historySortBy === "technician") {
      comparison = a.technician.localeCompare(b.technician);
    } else if (historySortBy === "cost") {
      const aCost = Number.parseInt(a.cost.replace(/[^\d]/g, ""));
      const bCost = Number.parseInt(b.cost.replace(/[^\d]/g, ""));
      comparison = aCost - bCost;
    }

    return historySortOrder === "asc" ? comparison : -comparison;
  });

  // 페이지네이션 - 현재 활성 탭에 따라 데이터 선택
  const currentData = activeTab === "current" ? sortedRecords : sortedHistory;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currentData.slice(indexOfFirstItem, indexOfLastItem);

  // 유지보수 유형에 따른 상태 색상 클래스 가져오기
  const getMaintenanceTypeClass = (type) => {
    switch (type) {
      case "정기점검":
        return getStatusColorClass("success");
      case "수리":
        return getStatusColorClass("warning");
      case "업그레이드":
        return getStatusColorClass("info");
      default:
        return getStatusColorClass("default");
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">유지보수 관리</h1>
          <div className="flex gap-2">
            {activeTab === "current" && (
              <>
                <button className="bg-muted hover:bg-muted/80 text-muted-foreground px-4 py-2 rounded-md transition-colors flex items-center">
                  <FaDownload className="mr-1 h-4 w-4" />
                  내보내기
                </button>
                <Link
                  to="/maintenance/add"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors flex items-center"
                >
                  <FaPlus className="mr-1 h-4 w-4" />
                  유지보수 등록
                </Link>
              </>
            )}
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex border-b border-border">
          <button
            className={`px-4 py-2 font-medium flex items-center ${
              activeTab === "current"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("current")}
          >
            <FaClipboardList className="mr-2 h-4 w-4" />
            유지보수 관리
          </button>
          <button
            className={`px-4 py-2 font-medium flex items-center ${
              activeTab === "history"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("history")}
          >
            <FaHistory className="mr-2 h-4 w-4" />
            유지보수 이력
          </button>
        </div>

        {/* 검색 및 필터 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder={
                  activeTab === "current"
                    ? "자산, 기술자 또는 유형 검색..."
                    : "자산명, 자산 ID 또는 기술자 검색..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              {activeTab === "current" ? (
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">모든 상태</option>
                  <option value="완료">완료</option>
                  <option value="진행중">진행중</option>
                  <option value="예정">예정</option>
                </select>
              ) : (
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">모든 유형</option>
                  <option value="정기점검">정기점검</option>
                  <option value="수리">수리</option>
                  <option value="업그레이드">업그레이드</option>
                </select>
              )}
            </div>
          </div>
        </div>

        {/* 유지보수 목록 테이블 */}
        <div className="bg-card rounded-lg shadow overflow-hidden border border-border">
          <div className="overflow-x-auto">
            {activeTab === "current" ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("assetName")}
                    >
                      <div className="flex items-center">
                        자산명
                        {sortBy === "assetName" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            {sortOrder === "asc" ? (
                              <path d="m18 15-6-6-6 6" />
                            ) : (
                              <path d="m6 9 6 6 6-6" />
                            )}
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("assetId")}
                    >
                      <div className="flex items-center">
                        자산 ID
                        {sortBy === "assetId" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            {sortOrder === "asc" ? (
                              <path d="m18 15-6-6-6 6" />
                            ) : (
                              <path d="m6 9 6 6 6-6" />
                            )}
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("type")}
                    >
                      <div className="flex items-center">
                        유형
                        {sortBy === "type" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            {sortOrder === "asc" ? (
                              <path d="m18 15-6-6-6 6" />
                            ) : (
                              <path d="m6 9 6 6 6-6" />
                            )}
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center">
                        날짜
                        {sortBy === "date" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            {sortOrder === "asc" ? (
                              <path d="m18 15-6-6-6 6" />
                            ) : (
                              <path d="m6 9 6 6 6-6" />
                            )}
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("technician")}
                    >
                      <div className="flex items-center">
                        기술자
                        {sortBy === "technician" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            {sortOrder === "asc" ? (
                              <path d="m18 15-6-6-6 6" />
                            ) : (
                              <path d="m6 9 6 6 6-6" />
                            )}
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("cost")}
                    >
                      <div className="flex items-center">
                        비용
                        {sortBy === "cost" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            {sortOrder === "asc" ? (
                              <path d="m18 15-6-6-6 6" />
                            ) : (
                              <path d="m6 9 6 6 6-6" />
                            )}
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        상태
                        {sortBy === "status" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            {sortOrder === "asc" ? (
                              <path d="m18 15-6-6-6 6" />
                            ) : (
                              <path d="m6 9 6 6 6-6" />
                            )}
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="px-6 py-8 text-center">
                        <div className="flex justify-center items-center">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <span className="ml-2 text-muted-foreground">
                            로딩 중...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : currentItems.length > 0 ? (
                    currentItems.map((record) => (
                      <tr
                        key={record.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {record.assetName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {record.assetId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getMaintenanceTypeClass(
                              record.type
                            )}`}
                          >
                            {record.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {record.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {record.technician}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {record.cost}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(
                              record.status === "완료"
                                ? "success"
                                : record.status === "진행중"
                                ? "warning"
                                : "info"
                            )}`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <Link
                              to={`/maintenance/view/${record.id}`}
                              className="text-primary hover:text-primary/80 transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </Link>
                            <Link
                              to={`/maintenance/edit/${record.id}`}
                              className="text-primary hover:text-primary/80 transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                              </svg>
                            </Link>
                            <button
                              className="text-destructive hover:text-destructive/80 transition-colors"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `${record.assetName}의 유지보수 기록을 삭제하시겠습니까?`
                                  )
                                ) {
                                  console.log(`유지보수 삭제: ${record.id}`);
                                }
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                <line x1="10" x2="10" y1="11" y2="17" />
                                <line x1="14" x2="14" y1="11" y2="17" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        className="px-6 py-8 text-sm text-center text-muted-foreground"
                      >
                        <div className="flex flex-col items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mb-2 text-muted-foreground/60"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" x2="12" y1="8" y2="12" />
                            <line x1="12" x2="12.01" y1="16" y2="16" />
                          </svg>
                          검색 결과가 없습니다.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                      onClick={() => handleHistorySort("date")}
                    >
                      <div className="flex items-center">
                        날짜
                        {historySortBy === "date" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            {historySortOrder === "asc" ? (
                              <path d="m18 15-6-6-6 6" />
                            ) : (
                              <path d="m6 9 6 6 6-6" />
                            )}
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                      onClick={() => handleHistorySort("type")}
                    >
                      <div className="flex items-center">
                        유형
                        {historySortBy === "type" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            {historySortOrder === "asc" ? (
                              <path d="m18 15-6-6-6 6" />
                            ) : (
                              <path d="m6 9 6 6 6-6" />
                            )}
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                      onClick={() => handleHistorySort("assetName")}
                    >
                      <div className="flex items-center">
                        자산명
                        {historySortBy === "assetName" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            {historySortOrder === "asc" ? (
                              <path d="m18 15-6-6-6 6" />
                            ) : (
                              <path d="m6 9 6 6 6-6" />
                            )}
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                      onClick={() => handleHistorySort("assetId")}
                    >
                      <div className="flex items-center">
                        자산 ID
                        {historySortBy === "assetId" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            {historySortOrder === "asc" ? (
                              <path d="m18 15-6-6-6 6" />
                            ) : (
                              <path d="m6 9 6 6 6-6" />
                            )}
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                      onClick={() => handleHistorySort("technician")}
                    >
                      <div className="flex items-center">
                        기술자
                        {historySortBy === "technician" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            {historySortOrder === "asc" ? (
                              <path d="m18 15-6-6-6 6" />
                            ) : (
                              <path d="m6 9 6 6 6-6" />
                            )}
                          </svg>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                      onClick={() => handleHistorySort("cost")}
                    >
                      <div className="flex items-center">
                        비용
                        {historySortBy === "cost" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            {historySortOrder === "asc" ? (
                              <path d="m18 15-6-6-6 6" />
                            ) : (
                              <path d="m6 9 6 6 6-6" />
                            )}
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      설명
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center">
                        <div className="flex justify-center items-center">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <span className="ml-2 text-muted-foreground">
                            로딩 중...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : currentItems.length > 0 ? (
                    currentItems.map((history) => (
                      <tr
                        key={history.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {history.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getMaintenanceTypeClass(
                              history.type
                            )}`}
                          >
                            {history.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {history.assetName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {history.assetId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {history.technician}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {history.cost}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {history.description}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-6 py-8 text-sm text-center text-muted-foreground"
                      >
                        <div className="flex flex-col items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mb-2 text-muted-foreground/60"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" x2="12" y1="8" y2="12" />
                            <line x1="12" x2="12.01" y1="16" y2="16" />
                          </svg>
                          검색 결과가 없습니다.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 페이지네이션 */}
        {currentData.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              총 {currentData.length}개의{" "}
              {activeTab === "current" ? "유지보수 기록" : "유지보수 이력"}
            </div>
            <div className="flex space-x-1">
              <button
                className="px-3 py-1 rounded border border-input bg-background hover:bg-muted transition-colors disabled:opacity-50"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                이전
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`px-3 py-1 rounded border ${
                      currentPage === pageNum
                        ? "bg-primary text-primary-foreground"
                        : "border-input bg-background hover:bg-muted transition-colors"
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                className="px-3 py-1 rounded border border-input bg-background hover:bg-muted transition-colors disabled:opacity-50"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Maintenance;
