"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaBriefcase,
  FaIdCard,
  FaCalendarAlt,
  FaCircle,
  FaShieldAlt,
  FaEdit,
  FaTrash,
  FaHistory,
  FaLaptop,
  FaMobile,
  FaDesktop,
  FaTabletAlt,
  FaHeadphones,
  FaFileAlt,
  FaMapMarkerAlt,
  FaQrcode,
  FaDownload,
} from "react-icons/fa";
import {
  HiDocumentText,
  HiIdentification,
  HiOfficeBuilding,
  HiClock,
} from "react-icons/hi";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";

// QRCode 컴포넌트 대체 구현
const SimpleQRCode = ({ value, size = 200 }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: "#f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #ddd",
        borderRadius: "4px",
      }}
    >
      <div className="text-center">
        <FaQrcode size={size / 2} />
        <div className="mt-2 text-xs">QR Code for: {value}</div>
      </div>
    </div>
  );
};

const UsersDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assets");
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    // 실제 구현에서는 API 호출로 대체
    const fetchUser = async () => {
      try {
        // 예시 데이터
        const userData = {
          id: Number.parseInt(id),
          name: "김철수",
          email: "chulsoo.kim@example.com",
          phone: "010-1234-5678",
          department: "개발팀",
          position: "선임 개발자",
          employeeId: "EMP-2023-0042",
          hireDate: "2020-03-15",
          status: "재직중",
          role: "일반 사용자",
          location: "본사 3층",
          profileImage: "/placeholder.svg?height=150&width=150",
          lastLogin: "2023-11-28 14:23",
          assets: [
            {
              id: 1,
              name: "MacBook Pro 16인치",
              type: "노트북",
              assignedDate: "2022-01-15",
              status: "사용중",
              icon: <FaLaptop className="text-blue-500" />,
            },
            {
              id: 2,
              name: "iPhone 13 Pro",
              type: "모바일",
              assignedDate: "2022-01-15",
              status: "사용중",
              icon: <FaMobile className="text-green-500" />,
            },
            {
              id: 3,
              name: "Dell 27인치 모니터",
              type: "모니터",
              assignedDate: "2022-01-15",
              status: "사용중",
              icon: <FaDesktop className="text-purple-500" />,
            },
            {
              id: 4,
              name: "iPad Pro 12.9인치",
              type: "태블릿",
              assignedDate: "2022-06-10",
              status: "사용중",
              icon: <FaTabletAlt className="text-indigo-500" />,
            },
            {
              id: 5,
              name: "Bose 노이즈 캔슬링 헤드폰",
              type: "주변기기",
              assignedDate: "2022-08-22",
              status: "사용중",
              icon: <FaHeadphones className="text-red-500" />,
            },
          ],
          history: [
            {
              id: 1,
              date: "2023-11-25",
              action: "로그인",
              details: "시스템 로그인 (IP: 192.168.1.45)",
            },
            {
              id: 2,
              date: "2023-11-20",
              action: "자산 반납",
              details: "Samsung Galaxy S21 반납 처리",
            },
            {
              id: 3,
              date: "2023-11-15",
              action: "정보 수정",
              details: "연락처 정보 업데이트",
            },
            {
              id: 4,
              date: "2023-10-05",
              action: "자산 할당",
              details: "iPad Pro 12.9인치 할당 받음",
            },
            {
              id: 5,
              date: "2023-09-12",
              action: "부서 이동",
              details: "마케팅팀에서 개발팀으로 이동",
            },
          ],
          documents: [
            {
              id: 1,
              name: "입사 계약서",
              type: "PDF",
              uploadDate: "2020-03-15",
              size: "2.4MB",
            },
            {
              id: 2,
              name: "보안 서약서",
              type: "PDF",
              uploadDate: "2020-03-15",
              size: "1.1MB",
            },
            {
              id: 3,
              name: "장비 수령 확인서",
              type: "PDF",
              uploadDate: "2022-01-15",
              size: "0.8MB",
            },
          ],
        };

        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("정말로 이 사용자를 삭제하시겠습니까?")) {
      // 실제 구현에서는 API 호출로 대체
      alert("사용자가 삭제되었습니다.");
      navigate("/users");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "재직중":
        return "text-green-500";
      case "휴직중":
        return "text-yellow-500";
      case "퇴사":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading) {
    return (
      <PageContainer title="사용자 상세 정보">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer title="사용자 상세 정보">
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">
            사용자를 찾을 수 없습니다.
          </p>
          <Link
            to="/users"
            className={`mt-4 inline-block px-4 py-2 rounded-md ${getButtonVariantClass(
              "secondary"
            )}`}
          >
            사용자 목록으로 돌아가기
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="사용자 상세 정보">
      {/* 상단 정보 카드 */}
      <div className="mb-6 rounded-lg border border-border bg-card p-6 shadow-md">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <img
              src={user.profileImage || "/placeholder.svg"}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
            />
          </div>
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center">
                {user.name}
                <span
                  className={`ml-3 text-sm px-2 py-1 rounded-full ${
                    user.status === "재직중"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : user.status === "휴직중"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {user.status}
                </span>
              </h2>
              <div className="flex space-x-2 mt-2 md:mt-0">
                <Link
                  to={`/users/edit/${user.id}`}
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
                icon={<FaEnvelope className="text-blue-500" />}
                label="이메일"
                value={user.email}
              />
              <InfoItem
                icon={<FaPhone className="text-green-500" />}
                label="전화번호"
                value={user.phone}
              />
              <InfoItem
                icon={<FaBuilding className="text-purple-500" />}
                label="부서"
                value={user.department}
              />
              <InfoItem
                icon={<FaBriefcase className="text-yellow-500" />}
                label="직책"
                value={user.position}
              />
              <InfoItem
                icon={<FaIdCard className="text-red-500" />}
                label="사원번호"
                value={user.employeeId}
              />
              <InfoItem
                icon={<FaCalendarAlt className="text-teal-500" />}
                label="입사일"
                value={user.hireDate}
              />
              <InfoItem
                icon={<FaCircle className={getStatusColor(user.status)} />}
                label="상태"
                value={user.status}
              />
              <InfoItem
                icon={<FaShieldAlt className="text-indigo-500" />}
                label="권한"
                value={user.role}
              />
              <InfoItem
                icon={<FaMapMarkerAlt className="text-pink-500" />}
                label="위치"
                value={user.location}
              />
              <InfoItem
                icon={<HiClock className="text-gray-500" />}
                label="마지막 로그인"
                value={user.lastLogin}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="mb-6 border-b border-border">
        <div className="flex space-x-6">
          <TabButton
            active={activeTab === "assets"}
            onClick={() => setActiveTab("assets")}
            icon={<FaLaptop />}
            label="할당된 자산"
          />
          <TabButton
            active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
            icon={<FaHistory />}
            label="활동 이력"
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
        {activeTab === "assets" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                할당된 자산 ({user.assets.length})
              </h3>
              <Link
                to={`/assignments/add?userId=${user.id}`}
                className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
                  "primary"
                )}`}
              >
                <FaLaptop className="h-4 w-4" />
                <span>자산 할당</span>
              </Link>
            </div>
            {user.assets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left">자산</th>
                      <th className="px-4 py-2 text-left">유형</th>
                      <th className="px-4 py-2 text-left">할당일</th>
                      <th className="px-4 py-2 text-left">상태</th>
                      <th className="px-4 py-2 text-left">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.assets.map((asset) => (
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
                        <td className="px-4 py-3">{asset.assignedDate}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {asset.status}
                          </span>
                        </td>
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
                              to={`/assignments/return?assetId=${asset.id}&userId=${user.id}`}
                              className="text-yellow-500 hover:text-yellow-600"
                              title="자산 반납"
                            >
                              <HiDocumentText className="h-4 w-4" />
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
                할당된 자산이 없습니다.
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">활동 이력</h3>
            {user.history.length > 0 ? (
              <div className="space-y-4">
                {user.history.map((item) => (
                  <div
                    key={item.id}
                    className="flex border-b border-border pb-4"
                  >
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {item.action === "로그인" && (
                          <HiIdentification className="text-blue-500" />
                        )}
                        {item.action === "자산 반납" && (
                          <FaLaptop className="text-red-500" />
                        )}
                        {item.action === "정보 수정" && (
                          <FaEdit className="text-yellow-500" />
                        )}
                        {item.action === "자산 할당" && (
                          <FaLaptop className="text-green-500" />
                        )}
                        {item.action === "부서 이동" && (
                          <HiOfficeBuilding className="text-purple-500" />
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
                활동 이력이 없습니다.
              </div>
            )}
          </div>
        )}

        {activeTab === "documents" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">문서</h3>
            {user.documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.documents.map((doc) => (
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
              <h3 className="text-xl font-semibold">사용자 QR 코드</h3>
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
              <SimpleQRCode
                value={`https://setflow.app/users/${user.id}`}
                size={200}
              />
              <p className="mt-4 text-center text-sm text-muted-foreground">
                이 QR 코드를 스캔하여 사용자 정보에 빠르게 접근하세요.
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

export default UsersDetail;
