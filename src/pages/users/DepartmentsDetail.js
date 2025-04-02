"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaUser,
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
  FaUsers,
  FaLaptop,
  FaHistory,
  FaFileAlt,
  FaQrcode,
  FaDownload,
  FaDesktop,
  FaMobile,
  FaPrint,
} from "react-icons/fa";
import { HiDocumentText, HiLocationMarker, HiCalendar } from "react-icons/hi";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";
import QRCode from "react-qr-code";

const DepartmentsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    // 실제 구현에서는 API 호출로 대체
    const fetchDepartment = async () => {
      try {
        // 예시 데이터
        const departmentData = {
          id: Number.parseInt(id),
          name: "개발팀",
          manager: "김철수",
          managerTitle: "팀장",
          managerId: 42,
          location: "본사 3층",
          description: "소프트웨어 개발 및 유지보수 담당",
          createdDate: "2018-05-10",
          budget: "120,000,000원",
          headcount: 12,
          assetCount: 45,
          users: [
            {
              id: 1,
              name: "김철수",
              position: "팀장",
              email: "chulsoo.kim@example.com",
              phone: "010-1234-5678",
              joinDate: "2018-05-10",
              status: "재직중",
            },
            {
              id: 2,
              name: "이영희",
              position: "선임 개발자",
              email: "younghee.lee@example.com",
              phone: "010-2345-6789",
              joinDate: "2019-03-15",
              status: "재직중",
            },
            {
              id: 3,
              name: "박지민",
              position: "개발자",
              email: "jimin.park@example.com",
              phone: "010-3456-7890",
              joinDate: "2020-07-22",
              status: "재직중",
            },
            {
              id: 4,
              name: "최민수",
              position: "개발자",
              email: "minsoo.choi@example.com",
              phone: "010-4567-8901",
              joinDate: "2021-01-05",
              status: "재직중",
            },
            {
              id: 5,
              name: "정다운",
              position: "인턴",
              email: "dawoon.jung@example.com",
              phone: "010-5678-9012",
              joinDate: "2023-06-01",
              status: "재직중",
            },
          ],
          assets: [
            {
              id: 1,
              name: "MacBook Pro 16인치",
              type: "노트북",
              assignedTo: "김철수",
              status: "사용중",
              purchaseDate: "2022-01-15",
              icon: <FaLaptop className="text-blue-500" />,
            },
            {
              id: 2,
              name: "Dell XPS 15",
              type: "노트북",
              assignedTo: "이영희",
              status: "사용중",
              purchaseDate: "2022-02-10",
              icon: <FaLaptop className="text-blue-500" />,
            },
            {
              id: 3,
              name: "Dell 27인치 모니터",
              type: "모니터",
              assignedTo: "박지민",
              status: "사용중",
              purchaseDate: "2022-03-05",
              icon: <FaDesktop className="text-purple-500" />,
            },
            {
              id: 4,
              name: "iPhone 13 Pro",
              type: "모바일",
              assignedTo: "김철수",
              status: "사용중",
              purchaseDate: "2022-01-15",
              icon: <FaMobile className="text-green-500" />,
            },
            {
              id: 5,
              name: "HP 컬러 레이저 프린터",
              type: "프린터",
              assignedTo: "개발팀 공용",
              status: "사용중",
              purchaseDate: "2021-11-20",
              icon: <FaPrint className="text-red-500" />,
            },
          ],
          history: [
            {
              id: 1,
              date: "2023-11-15",
              action: "사용자 추가",
              details: "정다운 인턴 추가",
            },
            {
              id: 2,
              date: "2023-10-10",
              action: "자산 할당",
              details: "Dell XPS 15 노트북 이영희에게 할당",
            },
            {
              id: 3,
              date: "2023-09-05",
              action: "부서 정보 수정",
              details: "부서 설명 업데이트",
            },
            {
              id: 4,
              date: "2023-08-20",
              action: "예산 변경",
              details: "연간 예산 120,000,000원으로 증액",
            },
            {
              id: 5,
              date: "2023-07-15",
              action: "위치 변경",
              details: "부서 위치 본사 2층에서 3층으로 이동",
            },
          ],
          documents: [
            {
              id: 1,
              name: "부서 운영 계획서",
              type: "PDF",
              uploadDate: "2023-01-10",
              size: "3.2MB",
            },
            {
              id: 2,
              name: "개발 프로세스 문서",
              type: "PDF",
              uploadDate: "2022-11-05",
              size: "2.5MB",
            },
            {
              id: 3,
              name: "부서 예산 계획",
              type: "XLSX",
              uploadDate: "2023-01-15",
              size: "1.8MB",
            },
          ],
        };

        setDepartment(departmentData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching department:", error);
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("정말로 이 부서를 삭제하시겠습니까?")) {
      // 실제 구현에서는 API 호출로 대체
      alert("부서가 삭제되었습니다.");
      navigate("/users/departments");
    }
  };

  if (loading) {
    return (
      <PageContainer title="부서 상세 정보">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
    );
  }

  if (!department) {
    return (
      <PageContainer title="부서 상세 정보">
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">
            부서를 찾을 수 없습니다.
          </p>
          <Link
            to="/users/departments"
            className={`mt-4 inline-block px-4 py-2 rounded-md ${getButtonVariantClass(
              "secondary"
            )}`}
          >
            부서 목록으로 돌아가기
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="부서 상세 정보">
      {/* 상단 정보 카드 */}
      <div className="mb-6 rounded-lg border border-border bg-card p-6 shadow-md">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
              <FaBuilding className="h-16 w-16 text-primary" />
            </div>
          </div>
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{department.name}</h2>
              <div className="flex space-x-2 mt-2 md:mt-0">
                <Link
                  to={`/users/departments/edit/${department.id}`}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
                    "secondary"
                  )}`}
                >
                  <FaEdit className="h-4 w-4" />
                  <span>편집</span>
                </Link>
                <button
                  onClick={handleDelete}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
                    "destructive"
                  )}`}
                >
                  <FaTrash className="h-4 w-4" />
                  <span>삭제</span>
                </button>
                <button
                  onClick={() => setShowQRModal(true)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
                    "outline"
                  )}`}
                >
                  <FaQrcode className="h-4 w-4" />
                  <span>QR 코드</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem
                icon={<FaUser className="text-blue-500" />}
                label="관리자"
                value={`${department.manager} (${department.managerTitle})`}
              />
              <InfoItem
                icon={<FaMapMarkerAlt className="text-red-500" />}
                label="위치"
                value={department.location}
              />
              <InfoItem
                icon={<FaUsers className="text-green-500" />}
                label="인원"
                value={`${department.headcount}명`}
              />
              <InfoItem
                icon={<FaLaptop className="text-purple-500" />}
                label="자산"
                value={`${department.assetCount}개`}
              />
              <InfoItem
                icon={<HiCalendar className="text-teal-500" />}
                label="생성일"
                value={department.createdDate}
              />
              <InfoItem
                icon={<HiDocumentText className="text-yellow-500" />}
                label="예산"
                value={department.budget}
              />
            </div>

            <div className="mt-4 p-3 bg-muted/30 rounded-md">
              <h3 className="text-sm font-medium mb-1">부서 설명</h3>
              <p className="text-muted-foreground">{department.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="mb-6 border-b border-border">
        <div className="flex space-x-6">
          <TabButton
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
            icon={<FaUsers />}
            label="소속 사용자"
          />
          <TabButton
            active={activeTab === "assets"}
            onClick={() => setActiveTab("assets")}
            icon={<FaLaptop />}
            label="부서 자산"
          />
          <TabButton
            active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
            icon={<FaHistory />}
            label="부서 이력"
          />
          <TabButton
            active={activeTab === "documents"}
            onClick={() => setActiveTab("documents")}
            icon={<FaFileAlt />}
            label="문서"
          />
        </div>
      </div>

      {/* 탭 내용 */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-md">
        {activeTab === "users" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                소속 사용자 ({department.users.length})
              </h3>
              <Link
                to={`/users/add?department=${department.name}`}
                className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
                  "primary"
                )}`}
              >
                <FaUser className="h-4 w-4" />
                <span>사용자 추가</span>
              </Link>
            </div>
            {department.users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left">이름</th>
                      <th className="px-4 py-2 text-left">직책</th>
                      <th className="px-4 py-2 text-left">이메일</th>
                      <th className="px-4 py-2 text-left">전화번호</th>
                      <th className="px-4 py-2 text-left">입사일</th>
                      <th className="px-4 py-2 text-left">상태</th>
                      <th className="px-4 py-2 text-left">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {department.users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-border hover:bg-muted/20"
                      >
                        <td className="px-4 py-3 font-medium">{user.name}</td>
                        <td className="px-4 py-3">{user.position}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">{user.phone}</td>
                        <td className="px-4 py-3">{user.joinDate}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              user.status === "재직중"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : user.status === "휴직중"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <Link
                              to={`/users/${user.id}`}
                              className="text-primary hover:text-primary/80"
                              title="사용자 상세 보기"
                            >
                              <FaUser className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/users/edit/${user.id}`}
                              className="text-yellow-500 hover:text-yellow-600"
                              title="사용자 편집"
                            >
                              <FaEdit className="h-4 w-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                소속 사용자가 없습니다.
              </div>
            )}
          </div>
        )}

        {activeTab === "assets" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                부서 자산 ({department.assets.length})
              </h3>
              <Link
                to={`/assets/add?department=${department.name}`}
                className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
                  "primary"
                )}`}
              >
                <FaLaptop className="h-4 w-4" />
                <span>자산 추가</span>
              </Link>
            </div>
            {department.assets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left">자산</th>
                      <th className="px-4 py-2 text-left">유형</th>
                      <th className="px-4 py-2 text-left">할당 대상</th>
                      <th className="px-4 py-2 text-left">상태</th>
                      <th className="px-4 py-2 text-left">구매일</th>
                      <th className="px-4 py-2 text-left">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {department.assets.map((asset) => (
                      <tr
                        key={asset.id}
                        className="border-b border-border hover:bg-muted/20"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="mr-3">{asset.icon}</div>
                            <span>{asset.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{asset.type}</td>
                        <td className="px-4 py-3">{asset.assignedTo}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {asset.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">{asset.purchaseDate}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <Link
                              to={`/assets/${asset.id}`}
                              className="text-primary hover:text-primary/80"
                              title="자산 상세 보기"
                            >
                              <FaLaptop className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/assets/edit/${asset.id}`}
                              className="text-yellow-500 hover:text-yellow-600"
                              title="자산 편집"
                            >
                              <FaEdit className="h-4 w-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                부서 자산이 없습니다.
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">부서 이력</h3>
            {department.history.length > 0 ? (
              <div className="space-y-4">
                {department.history.map((item) => (
                  <div
                    key={item.id}
                    className="flex border-b border-border pb-4"
                  >
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {item.action === "사용자 추가" && (
                          <FaUser className="text-blue-500" />
                        )}
                        {item.action === "자산 할당" && (
                          <FaLaptop className="text-green-500" />
                        )}
                        {item.action === "부서 정보 수정" && (
                          <FaEdit className="text-yellow-500" />
                        )}
                        {item.action === "예산 변경" && (
                          <HiDocumentText className="text-purple-500" />
                        )}
                        {item.action === "위치 변경" && (
                          <HiLocationMarker className="text-red-500" />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">{item.action}</h4>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {item.date}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                부서 이력이 없습니다.
              </div>
            )}
          </div>
        )}

        {activeTab === "documents" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                문서 ({department.documents.length})
              </h3>
              <button
                className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
                  "primary"
                )}`}
              >
                <FaFileAlt className="h-4 w-4" />
                <span>문서 추가</span>
              </button>
            </div>
            {department.documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {department.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="border border-border rounded-lg p-4 hover:bg-muted/20"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <FaFileAlt className="text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <div className="flex text-xs text-muted-foreground">
                            <span>{doc.type}</span>
                            <span className="mx-1">•</span>
                            <span>{doc.size}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        className="text-primary hover:text-primary/80"
                        title="다운로드"
                      >
                        <FaDownload className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      업로드: {doc.uploadDate}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                문서가 없습니다.
              </div>
            )}
          </div>
        )}
      </div>

      {/* QR 코드 모달 */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">부서 QR 코드</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <QRCode
                value={`https://setflow.app/users/departments/${department.id}`}
                size={200}
                level="H"
              />
              <p className="mt-4 text-center text-sm text-muted-foreground">
                이 QR 코드를 스캔하여 부서 정보에 빠르게 접근하세요.
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowQRModal(false)}
                className={`px-4 py-2 rounded-md ${getButtonVariantClass(
                  "secondary"
                )}`}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

// 정보 항목 컴포넌트
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center">
    <div className="mr-3">{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

// 탭 버튼 컴포넌트
const TabButton = ({ active, onClick, icon, label }) => (
  <button
    className={`flex items-center gap-2 py-3 px-1 border-b-2 ${
      active
        ? "border-primary text-primary"
        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
    }`}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default DepartmentsDetail;
